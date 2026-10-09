import {
  AdditiveBlending,
  MeshPhysicalMaterial,
  ShaderMaterial,
  type Texture,
  Uniform,
  Vector2,
} from "three";
import type { Media, MediaFit, Values } from "@/lib/mockup-studio/scene/types";
import { TONE_GLSL } from "./tone";

/**
 * The screen is an unlit shader: it shows the media (or a placeholder) and layers the screen effects on top.
 *
 * Content is addressed by `screenUv`, a per-vertex attribute that device-model.ts derives from the screen mesh's
 * geometry (0..1 across the screen, origin top-left). It spans exactly the screen whatever the UV layout of the model.
 */

const VERTEX = /* glsl */ `
attribute vec2 screenUv;

varying vec2 vScreen;
varying vec3 vViewPosition;

void main() {
  vScreen = screenUv;
  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
  vViewPosition = viewPosition.xyz;
  gl_Position = projectionMatrix * viewPosition;
}
`;

const FRAGMENT = /* glsl */ `
uniform sampler2D uMap;
uniform float uHasMap;
uniform float uMediaAspect;
uniform float uScreenAspect;
uniform float uFit;
uniform float uScale;
uniform vec2 uOffset;
uniform float uOpacity;
uniform float uCrt;
uniform float uGhosting;
uniform float uDepth;
uniform float uVideo;

varying vec2 vScreen;
varying vec3 vViewPosition;

${TONE_GLSL}

// Mask cells across the width of the screen.
const float CRT_CELLS = 340.0;
// Average brightness of the mask, used where the cells are too small to draw.
const float CRT_MEAN = 0.52;

// Video frames arrive sRGB encoded: three uploads them without an sRGB internal format and leaves the decoding to the
// shader, where its own materials do it. Without this a video reads as linear light and gets gamma applied twice,
// which lifts its blacks.
vec3 srgbToLinear(vec3 c) {
  vec3 low = c / 12.92;
  vec3 high = pow((c + 0.055) / 1.055, vec3(2.4));
  return mix(high, low, vec3(lessThanEqual(c, vec3(0.04045))));
}

// Media sampled with the fit, scale and offset applied. s is screen uv with the origin top-left.
vec3 mediaColor(vec2 s) {
  float screenOverMedia = uScreenAspect / uMediaAspect;
  vec2 span = vec2(1.0);
  if (uFit < 0.5) {
    span = vec2(min(1.0, screenOverMedia), min(1.0, 1.0 / screenOverMedia));
  } else if (uFit < 1.5) {
    span = vec2(max(1.0, screenOverMedia), max(1.0, 1.0 / screenOverMedia));
  }
  vec2 m = 0.5 + (s - 0.5 - vec2(uOffset.x, -uOffset.y)) * span / uScale;
  vec4 texel = texture2D(uMap, clamp(m, 0.0, 1.0));
  if (uVideo > 0.5) {
    texel.rgb = srgbToLinear(texel.rgb);
  }
  float inside = step(0.0, m.x) * step(m.x, 1.0) * step(0.0, m.y) * step(m.y, 1.0);
  return texel.rgb * texel.a * inside;
}

vec3 contentAt(vec2 s) {
  float onScreen = step(0.0, s.x) * step(s.x, 1.0) * step(0.0, s.y) * step(s.y, 1.0);
  // With nothing on it the panel is off: true black, like an OLED.
  vec3 content = uHasMap > 0.5 ? mediaColor(s) : vec3(0.0);
  return content * onScreen;
}

// Where the line of sight meets a panel sitting uDepth (a fraction of the screen's width) below the glass, in screen
// uv. This is what makes the picture read as being behind the glass: it slides against the bezel as the view turns.
vec2 behindGlass(vec2 s) {
  vec3 dp1 = dFdx(vViewPosition);
  vec3 dp2 = dFdy(vViewPosition);
  vec2 duv1 = dFdx(s);
  vec2 duv2 = dFdy(s);
  vec3 normal = normalize(cross(dp1, dp2));
  vec3 dp2perp = cross(dp2, normal);
  vec3 dp1perp = cross(normal, dp1);
  float det = dot(dp1, dp2perp);
  if (abs(det) < 1e-12) {
    return s;
  }
  // How screen uv changes per unit moved across the surface, in view space.
  vec3 gradU = (dp2perp * duv1.x + dp1perp * duv2.x) / det;
  vec3 gradV = (dp2perp * duv1.y + dp1perp * duv2.y) / det;
  vec3 ray = normalize(vViewPosition);
  float facing = max(abs(dot(ray, normal)), 0.25);
  float depth = uDepth / max(length(gradU), 1e-6);
  vec3 along = ray * (depth / facing);
  vec3 across = along - normal * dot(along, normal);
  return s + vec2(dot(across, gradU), dot(across, gradV));
}

// One phosphor mask sample: red, green and blue stripes in square cells, alternate columns dropped half a cell like a
// slot mask, with a soft dark gap between rows.
vec3 phosphorMask(vec2 cell) {
  float column = floor(cell.x);
  float within = fract(cell.x) * 3.0;
  vec3 centres = vec3(0.5, 1.5, 2.5);
  vec3 offset = abs(within - centres);
  offset = min(offset, 3.0 - offset);
  vec3 lit = 1.0 - smoothstep(0.32, 0.6, offset);
  vec3 stripes = mix(vec3(0.6), vec3(1.0), lit);
  float row = fract(cell.y + 0.5 * mod(column, 2.0)) - 0.5;
  float rows = 0.62 + 0.38 * exp(-row * row / 0.03);
  return stripes * rows;
}

void main() {
  vec2 s = uDepth > 0.0 ? behindGlass(vScreen) : vScreen;

  vec3 color = contentAt(s);

  if (uGhosting > 0.0) {
    vec3 ghost = contentAt(s + vec2(0.012, 0.016));
    color = color * (1.0 - 0.3 * uGhosting) + ghost * 0.4 * uGhosting;
  }

  if (uCrt > 0.0) {
    // The mask reads at half the slider: 25 already shows clear phosphor cells up close, like a real panel under a
    // macro lens, while far away the cells shrink below a pixel and fade to nothing.
    float mask = min(1.0, uCrt * 2.0);
    vec2 cell = vec2(s.x, s.y / uScreenAspect) * CRT_CELLS;
    // Each cell shows one sample of the picture, so close up the image breaks into real phosphor pixels.
    vec2 cellCentre = (floor(cell) + 0.5) / CRT_CELLS * vec2(1.0, uScreenAspect);
    color = mix(color, contentAt(cellCentre), mask);
    // From far away the cells are smaller than a pixel and would shimmer; fade to the mask's average brightness.
    float cellPixels = 1.0 / max(fwidth(cell.x), 1e-4);
    float detail = smoothstep(1.2, 3.5, cellPixels);
    vec3 phosphor = mix(vec3(CRT_MEAN), phosphorMask(cell), detail);
    // Applied on display values, not linear light, so the mask has the same weight in dark and bright areas.
    vec3 display = pow(max(color, vec3(0.0)), vec3(1.0 / 2.2));
    display *= mix(vec3(1.0), phosphor, mask);
    color = pow(display, vec3(2.2));
  }

  if (uDepth > 0.0) {
    // The panel sits in a shallow well, so its edges fall into the shadow of the bezel.
    vec2 edge = min(s, 1.0 - s) * vec2(1.0, 1.0 / uScreenAspect);
    float lip = smoothstep(0.0, uDepth * 3.0, min(edge.x, edge.y));
    color *= mix(0.45, 1.0, lip);
  }

  color *= uOpacity;

  // Pre-compensate the post-pass tone curve so the screen comes out exactly as authored.
  gl_FragColor = vec4(toneShoulderInverse(color), 1.0);
}
`;

export interface ScreenUniforms {
  uMap: Uniform<Texture | null>;
  /** 1 once the media has something to show. */
  uHasMap: Uniform<number>;
  uMediaAspect: Uniform<number>;
  uScreenAspect: Uniform<number>;
  /** 0 cover, 1 contain, 2 stretch */
  uFit: Uniform<number>;
  uScale: Uniform<number>;
  uOffset: Uniform<Vector2>;
  /** 0..1, like the next three. */
  uOpacity: Uniform<number>;
  uCrt: Uniform<number>;
  uGhosting: Uniform<number>;
  /** How far the panel sits below the glass, as a fraction of the screen's width. */
  uDepth: Uniform<number>;
  /** 1 when uMap is a video, whose frames the shader must decode from sRGB itself. */
  uVideo: Uniform<number>;
}

export interface ScreenSurface {
  material: ShaderMaterial;
  uniforms: ScreenUniforms;
  /**
   * Cover glass drawn over the panel. Its base colour is black and it blends additively, so all it contributes is
   * what real glass does: reflections of the lights and the studio. That is what makes the screen sit under the
   * surface instead of looking like a sticker on top of it.
   */
  glass: MeshPhysicalMaterial;
}

export function createScreenSurface(): ScreenSurface {
  const uniforms: ScreenUniforms = {
    uMap: new Uniform<Texture | null>(null),
    uHasMap: new Uniform(0),
    uMediaAspect: new Uniform(1),
    uScreenAspect: new Uniform(1),
    uFit: new Uniform(0),
    uScale: new Uniform(1),
    uOffset: new Uniform(new Vector2()),
    uOpacity: new Uniform(1),
    uCrt: new Uniform(0),
    uGhosting: new Uniform(0),
    uDepth: new Uniform(0),
    uVideo: new Uniform(0),
  };
  const material = new ShaderMaterial({
    uniforms: { ...uniforms },
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    // The screen is emissive and must keep its authored colours.
    toneMapped: false,
  });
  const glass = new MeshPhysicalMaterial({
    color: 0x000000,
    roughness: 0.2,
    metalness: 0,
    ior: 1.5,
    transparent: true,
    blending: AdditiveBlending,
    depthWrite: false,
    // Drawn on the same surface as the panel; pull it forward so the two never z-fight.
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  });
  return { material, uniforms, glass };
}

/** Reflection 100 shows the studio this many times brighter in the glass than it really is. */
const GLASS_MAX_ENV = 2.5;

/** Glass Depth 100 puts the panel this fraction of the screen's width below the glass. */
const MAX_DEPTH = 0.03;

const FIT_INDEX: Record<MediaFit, number> = {
  cover: 0,
  contain: 1,
  stretch: 2,
};

/** Push the current values and media placement into the screen shader. Cheap enough to call every frame. */
export function updateScreenSurface(
  surface: ScreenSurface,
  values: Values,
  media: Media | null,
  screenAspect: number,
) {
  const { uniforms } = surface;
  uniforms.uScreenAspect.value = screenAspect;
  uniforms.uFit.value = media ? FIT_INDEX[media.fit] : 0;
  uniforms.uScale.value = media ? Math.max(0.01, media.scale) : 1;
  uniforms.uOffset.value.set(media?.offsetX ?? 0, media?.offsetY ?? 0);
  uniforms.uOpacity.value = values["screen.opacity"] / 100;
  uniforms.uCrt.value = values["screen.crt"] / 100;
  uniforms.uGhosting.value = values["screen.ghosting"] / 100;
  uniforms.uDepth.value = (values["screen.depth"] / 100) * MAX_DEPTH;
  const reflection = values["screen.reflection"] / 100;
  surface.glass.visible = reflection > 0;
  surface.glass.envMapIntensity = reflection * GLASS_MAX_ENV;
  surface.glass.specularIntensity = Math.min(1, reflection * 2);
}
