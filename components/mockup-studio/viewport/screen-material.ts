import {
  AdditiveBlending,
  Color,
  MeshPhysicalMaterial,
  ShaderMaterial,
  type Texture,
  Uniform,
  Vector2,
  Vector3,
} from "three";
import { lampPosition } from "@/lib/mockup-studio/scene/lamps";
import type { Light, Media, MediaFit, Values } from "@/lib/mockup-studio/scene/types";
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

// Pixels across the width of the screen.
const float CRT_CELLS = 340.0;

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

// The panel's own pixel grid, as a macro lens sees it: each pixel is a red, a green and a blue stripe side by side,
// with a slightly brighter band across the middle of each row. Soft and muted, never a hard mask, and it averages
// to exactly 1 so the picture is neither darkened nor tinted.
vec3 pixelGrid(vec2 cell) {
  vec3 phase = fract(cell.x) - vec3(1.0 / 6.0, 0.5, 5.0 / 6.0);
  vec3 stripes = 0.7 + 0.3 * (1.0 + cos(6.2831853 * phase));
  float rows = 1.0 + 0.12 * cos(6.2831853 * fract(cell.y));
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
    float strength = min(1.0, uCrt * 1.6);
    vec2 cell = vec2(s.x, s.y / uScreenAspect) * CRT_CELLS;
    // From far away the pixels are smaller than a screen pixel and would shimmer; the grid fades out to nothing.
    float cellPixels = 1.0 / max(fwidth(cell.x), 1e-4);
    float detail = smoothstep(1.5, 4.0, cellPixels);
    // Applied on display values, not linear light, so the grid has the same weight in dark and bright areas.
    vec3 display = pow(max(color, vec3(0.0)), vec3(1.0 / 2.2));
    display *= mix(vec3(1.0), pixelGrid(cell), strength * detail);
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

/** Lamps the glass can show at once. */
const MAX_LAMPS = 4;

/**
 * What the cover glass reflects. Not the bare point lights, which would smear into a haze, and not a grey room, which
 * would veil the blacks: each lamp shows up the way it would on a real shoot, as a softbox with soft edges, standing
 * where the lamp stands, and everything else in the glass stays black. Strength follows the angle like real glass
 * does: faint head on, strong at a glance.
 */
const GLASS_LAMPS = /* glsl */ `
reflectedLight.directDiffuse = vec3(0.0);
reflectedLight.directSpecular = vec3(0.0);
reflectedLight.indirectDiffuse = vec3(0.0);
// What is left is the surroundings mirrored in the glass: kept for an environment photo, dropped for the studio.
reflectedLight.indirectSpecular *= uGlassEnv;
{
  vec3 mirrored = reflect(-geometryViewDir, geometryNormal);
  float fresnel = 0.04 + 0.96 * pow(1.0 - clamp(dot(geometryNormal, geometryViewDir), 0.0, 1.0), 5.0);
  vec3 up = normalize((viewMatrix * vec4(0.0, 1.0, 0.0, 0.0)).xyz);
  for (int i = 0; i < ${MAX_LAMPS}; i++) {
    vec3 toLamp = normalize((viewMatrix * vec4(uLampPos[i], 1.0)).xyz - geometryPosition);
    vec3 side = normalize(cross(up, toLamp));
    vec3 top = cross(toLamp, side);
    float along = dot(mirrored, toLamp);
    vec2 inBox = vec2(dot(mirrored, side), dot(mirrored, top)) / max(along, 1e-3);
    // A softbox taller than it is wide, its edges falling off over the last fifth.
    vec2 edge = 1.0 - smoothstep(vec2(0.13, 0.21), vec2(0.16, 0.26), abs(inBox));
    reflectedLight.indirectSpecular += uLampColor[i] * (edge.x * edge.y * step(0.0, along) * fresnel);
  }
}
`;

export interface ScreenSurface {
  material: ShaderMaterial;
  uniforms: ScreenUniforms;
  /**
   * Cover glass drawn over the panel. Its base colour is black and it blends additively, so all it contributes is
   * what real glass does: reflections of the lights and the studio. That is what makes the screen sit under the
   * surface instead of looking like a sticker on top of it.
   */
  glass: MeshPhysicalMaterial;
  /** Where each lamp stands, and its colour times its strength in the glass. Unused slots are black. */
  lamps: {
    uLampPos: Uniform<Vector3[]>;
    uLampColor: Uniform<Color[]>;
    /** How strongly the surroundings show in the glass. 0 in the studio. */
    uGlassEnv: Uniform<number>;
  };
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
  const lamps = {
    uLampPos: new Uniform(
      Array.from({ length: MAX_LAMPS }, () => new Vector3(0, 0, 1)),
    ),
    uLampColor: new Uniform(
      Array.from({ length: MAX_LAMPS }, () => new Color(0, 0, 0)),
    ),
    uGlassEnv: new Uniform(0),
  };
  glass.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, lamps);
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>\nuniform vec3 uLampPos[${MAX_LAMPS}];\nuniform vec3 uLampColor[${MAX_LAMPS}];\nuniform float uGlassEnv;`,
      )
      .replace(
        "#include <lights_fragment_end>",
        `#include <lights_fragment_end>\n${GLASS_LAMPS}`,
      );
  };
  return { material, uniforms, glass, lamps };
}

/** Reflection 100 shows an environment photo this many times brighter in the glass than it really is. */
const GLASS_MAX_ENV = 2.5;
/** How bright a lamp of intensity 1 looks in the glass at Reflection 100, before the angle weakens it. */
const GLASS_LAMP_GAIN = 5;

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
  lights: readonly Light[],
  /** An environment photo is lighting the scene, so the glass should mirror it too. */
  environment: boolean,
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
  // The procedural studio is not mirrored: its dim walls would lay a grey veil over the blacks. A real place is.
  surface.lamps.uGlassEnv.value = environment ? reflection * GLASS_MAX_ENV : 0;
  const level = (values["lights.level"] / 100) * reflection * GLASS_LAMP_GAIN;
  for (let i = 0; i < MAX_LAMPS; i++) {
    const light = lights[i];
    const colour = surface.lamps.uLampColor.value[i];
    if (!light) {
      colour.setRGB(0, 0, 0);
      continue;
    }
    surface.lamps.uLampPos.value[i].set(
      ...lampPosition(light, values["lights.rotation"]),
    );
    colour.set(light.color).multiplyScalar(light.intensity * level);
  }
}
