import {
  type Matrix4,
  type Mesh,
  type MeshStandardMaterial,
  type Texture,
  Uniform,
  Vector2,
  Vector3,
} from "three";

/**
 * The screen on the body: what makes a lit display read as part of the device rather than a sticker on it.
 *
 * Every body material gets the screen's own picture and the screen's place in the world, and does two things with
 * them in its own shader:
 *
 * - The screen seen IN the surface. The line of sight is reflected off the surface and followed to the screen's
 *   plane; where it lands, that pixel of the picture shows up, softened by the surface's roughness and the distance.
 *   A planar reflection without a second render pass, which is why a keyboard mirrors the video frame for frame.
 * - The screen AS A LIGHT. A blurred wash of the picture thrown onto anything facing the screen, with a wrapped
 *   falloff, so a desk a phone stands on still catches its colour where no mirror path exists.
 *
 * The picture is sampled through the same code the screen itself uses, so the reflection shows exactly the framing,
 * fit and opacity the screen shows.
 */

/** The media as the screen presents it. Shared by the screen's shader and every surface that reflects it. */
export interface MediaUniforms {
  uMap: Uniform<Texture | null>;
  /** 1 once the media has something to show. */
  uHasMap: Uniform<number>;
  uMediaAspect: Uniform<number>;
  uScreenAspect: Uniform<number>;
  /** 0 cover, 1 contain, 2 stretch */
  uFit: Uniform<number>;
  uScale: Uniform<number>;
  uOffset: Uniform<Vector2>;
  /** 0..1 */
  uOpacity: Uniform<number>;
  /** 1 when uMap is a video, whose frames the shader must decode from sRGB itself. */
  uVideo: Uniform<number>;
}

/** The screen's place and the strength of its bounce. Shared by every surface that reflects it. */
export interface BounceUniforms extends MediaUniforms {
  /** Top-left corner of the screen in world space. */
  uBounceOrigin: Uniform<Vector3>;
  /** From the top-left corner to the top-right, and to the bottom-left, in world space. */
  uBounceAcross: Uniform<Vector3>;
  uBounceDown: Uniform<Vector3>;
  /** Unit normal of the screen, pointing out of the glass. */
  uBounceNormal: Uniform<Vector3>;
  /** How strongly the picture shows in the body. 0 is off. */
  uBounceAmount: Uniform<number>;
  /** 0..1, how soft the reflection is before the surface's own roughness is counted. */
  uBounceSoft: Uniform<number>;
  /** How much light the screen throws onto what faces it. 0 is off. */
  uBounceWash: Uniform<number>;
}

export function createBounceUniforms(): BounceUniforms {
  return {
    uMap: new Uniform<Texture | null>(null),
    uHasMap: new Uniform(0),
    uMediaAspect: new Uniform(1),
    uScreenAspect: new Uniform(1),
    uFit: new Uniform(0),
    uScale: new Uniform(1),
    uOffset: new Uniform(new Vector2()),
    uOpacity: new Uniform(1),
    uVideo: new Uniform(0),
    uBounceOrigin: new Uniform(new Vector3()),
    uBounceAcross: new Uniform(new Vector3(1, 0, 0)),
    uBounceDown: new Uniform(new Vector3(0, -1, 0)),
    uBounceNormal: new Uniform(new Vector3(0, 0, 1)),
    uBounceAmount: new Uniform(0),
    uBounceSoft: new Uniform(0.75),
    uBounceWash: new Uniform(0),
  };
}

/**
 * The media sampled the way the screen shows it: fit, scale and offset applied, video decoded from sRGB, nothing
 * outside the picture. `s` is screen uv with the origin top-left.
 */
export const MEDIA_GLSL = /* glsl */ `
uniform sampler2D uMap;
uniform float uHasMap;
uniform float uMediaAspect;
uniform float uScreenAspect;
uniform float uFit;
uniform float uScale;
uniform vec2 uOffset;
uniform float uOpacity;
uniform float uVideo;

// Video frames arrive sRGB encoded: three uploads them without an sRGB internal format and leaves the decoding to the
// shader, where its own materials do it. Without this a video reads as linear light and gets gamma applied twice,
// which lifts its blacks.
vec3 mediaSrgbToLinear(vec3 c) {
  vec3 low = c / 12.92;
  vec3 high = pow((c + 0.055) / 1.055, vec3(2.4));
  return mix(high, low, vec3(lessThanEqual(c, vec3(0.04045))));
}

// The same picture read from a coarser level of the texture's mipmaps: a cheap blur. 0 is the full picture.
vec3 mediaColorLod(vec2 s, float lod) {
  float screenOverMedia = uScreenAspect / uMediaAspect;
  vec2 span = vec2(1.0);
  if (uFit < 0.5) {
    span = vec2(min(1.0, screenOverMedia), min(1.0, 1.0 / screenOverMedia));
  } else if (uFit < 1.5) {
    span = vec2(max(1.0, screenOverMedia), max(1.0, 1.0 / screenOverMedia));
  }
  vec2 m = 0.5 + (s - 0.5 - vec2(uOffset.x, -uOffset.y)) * span / uScale;
  vec4 texel = textureLod(uMap, clamp(m, 0.0, 1.0), lod);
  if (uVideo > 0.5) {
    texel.rgb = mediaSrgbToLinear(texel.rgb);
  }
  float inside = step(0.0, m.x) * step(m.x, 1.0) * step(0.0, m.y) * step(m.y, 1.0);
  return texel.rgb * texel.a * inside;
}

vec3 mediaColor(vec2 s) {
  return mediaColorLod(s, 0.0);
}

vec3 contentAtLod(vec2 s, float lod) {
  float onScreen = step(0.0, s.x) * step(s.x, 1.0) * step(0.0, s.y) * step(s.y, 1.0);
  // With nothing on it the panel is off: true black, like an OLED.
  vec3 content = uHasMap > 0.5 ? mediaColorLod(s, lod) : vec3(0.0);
  return content * onScreen;
}

vec3 contentAt(vec2 s) {
  return contentAtLod(s, 0.0);
}
`;

/**
 * Taps in the blur disc. The texture's own mipmaps do most of the softening, so a few taps are enough to shape the
 * disc; the per-pixel turn below hides the gaps between them.
 */
const TAPS = 8;

const BOUNCE_PARS = /* glsl */ `
varying vec3 vBounceWorldPos;
varying vec3 vBounceWorldNormal;
uniform vec3 uBounceOrigin;
uniform vec3 uBounceAcross;
uniform vec3 uBounceDown;
uniform vec3 uBounceNormal;
uniform float uBounceAmount;
uniform float uBounceSoft;
uniform float uBounceWash;
// How finely this part is modelled, relative to the plainest surface on the device: a field of keycaps scatters
// light where a slab mirrors it.
uniform float uBounceDetail;

${MEDIA_GLSL}

// Where a point in the world lands on the screen, 0..1 across it with the origin top-left.
vec2 bounceUv(vec3 world) {
  vec3 rel = world - uBounceOrigin;
  return vec2(
    dot(rel, uBounceAcross) / dot(uBounceAcross, uBounceAcross),
    dot(rel, uBounceDown) / dot(uBounceDown, uBounceDown)
  );
}

// What the screen shows at that point, as bright as the screen is, read at the mip level whose texels are about
// radius (a fraction of the screen's width) across, so the picture arrives already softened to that size.
vec3 bounceTap(vec2 uv, float radius) {
  float texels = float(textureSize(uMap, 0).x);
  float lod = clamp(log2(max(radius * texels, 1.0)), 0.0, 10.0);
  return contentAtLod(clamp(uv, 0.0, 1.0), lod) * uOpacity;
}

float bounceTurn(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

// The picture blurred over a disc that is round on the glass, not in uv. The taps spiral out at the golden angle
// with Gaussian weights, and the whole disc is turned by a per-pixel amount so the gaps between taps come out as
// grain rather than as copies of the picture.
vec3 bounceBlurred(vec2 uv, float radius) {
  if (radius < 0.0005) return bounceTap(uv, 0.0);
  vec2 round = vec2(1.0, length(uBounceAcross) / max(length(uBounceDown), 1e-4));
  float turn = bounceTurn(gl_FragCoord.xy) * 6.2831853;
  // Each tap covers about a third of the disc on its own, which is what lets eight of them read as one.
  float footprint = radius * 0.35;
  vec3 sum = vec3(0.0);
  float total = 0.0;
  for (int i = 0; i < ${TAPS}; i++) {
    float angle = float(i) * 2.3999632 + turn;
    float r = sqrt((float(i) + 0.5) / float(${TAPS}));
    float w = exp(-2.2 * r * r);
    sum += bounceTap(uv + vec2(cos(angle), sin(angle)) * r * radius * round, footprint) * w;
    total += w;
  }
  return sum / total;
}

// The screen as one soft colour at that point: the picture at a level where a texel is a third of the screen.
vec3 bounceWashed(vec2 uv) {
  return bounceTap(uv, 0.35);
}

// Fades out towards the edges of the glass, so a surface that reflects a point beyond the screen gets nothing rather
// than the edge pixel stretched out.
float bounceInside(vec2 uv) {
  vec2 edge = smoothstep(0.0, 0.18, uv) * smoothstep(0.0, 0.18, 1.0 - uv);
  return edge.x * edge.y;
}
`;

/**
 * Reflectance at which a surface takes the reflection at full strength. Below it the response falls off faster
 * than the reflectance itself, which keeps the order the model's materials have while opening up the gap between
 * them: anodised metal and black plastic are a factor of two apart in F0, and that is not a difference the eye
 * finds on a dark body without help.
 */
const F0_FULL = 0.18;

const BOUNCE_BODY = /* glsl */ `
if (uBounceAmount > 0.0 || uBounceWash > 0.0) {
  vec3 n = normalize(vBounceWorldNormal);
  float reach = 0.5 * (length(uBounceAcross) + length(uBounceDown));

  if (uBounceWash > 0.0) {
    vec3 centre = uBounceOrigin + 0.5 * (uBounceAcross + uBounceDown);
    vec3 toScreen = centre - vBounceWorldPos;
    float dist = length(toScreen);
    vec3 dir = toScreen / max(dist, 1e-4);
    // Both must face each other. The screen's side is wrapped: a flat panel puts no light into its own plane, but a
    // real one plainly lights the desk it stands on, so ninety degrees still gives something and only what is
    // behind the screen gets nothing.
    float facing = max(dot(n, dir), 0.0);
    float emits = max(dot(uBounceNormal, -dir) * 0.6 + 0.4, 0.0);
    if (facing * emits > 0.001) {
      // Softened inverse square, measured against the screen's size so it means the same on a phone and a billboard.
      float falloff = 1.0 / (1.0 + pow(dist / max(reach * 2.0, 1e-4), 1.3));
      vec3 wash = bounceWashed(bounceUv(vBounceWorldPos));
      reflectedLight.indirectDiffuse += wash * diffuseColor.rgb * facing * emits * falloff * uBounceWash;
    }
  }

  if (uBounceAmount > 0.0) {
    vec3 view = normalize(vBounceWorldPos - cameraPosition);
    vec3 mirrored = reflect(view, n);
    // The reflected ray must be heading into the front of the glass; from behind, the screen shows nothing.
    float towards = dot(mirrored, uBounceNormal);
    if (towards < -1e-4) {
      float t = dot(uBounceOrigin - vBounceWorldPos, uBounceNormal) / towards;
      if (t > 0.0) {
        vec2 hit = bounceUv(vBounceWorldPos + mirrored * t);
        // How much this surface reflects comes from the material itself: three's own split-sum term, built from the
        // base colour, metalness and roughness, so the body takes the screen exactly as hard as it takes the room.
        vec3 reflectance = EnvironmentBRDF(geometryNormal, geometryViewDir,
          material.specularColorBlended, material.specularF90, material.roughness);
        reflectance *= clamp(reflectance / ${F0_FULL.toFixed(3)}, 0.0, 1.0);
        float weight = bounceInside(hit);
        if (max(max(reflectance.r, reflectance.g), reflectance.b) * weight > 0.001) {
          // Softness: the setting, then the surface's roughness, how far the ray travelled, how finely this part
          // is modelled, and how fast the surface turns within this pixel (the gaps between keys).
          float travel = 0.5 + 0.5 * clamp(t / max(reach, 1e-4), 0.0, 2.0);
          float curvature = clamp(length(fwidth(vBounceWorldNormal)) * 8.0, 0.0, 1.0);
          float spread = min(0.5, mix(0.002, 0.16, uBounceSoft) * (0.3 + roughnessFactor) * travel
            * uBounceDetail * (1.0 + curvature * 2.5));
          reflectedLight.indirectSpecular += bounceBlurred(hit, spread) * reflectance * weight * uBounceAmount;
        }
      }
    }
  }
}
`;

const BOUNCE_VERTEX_PARS = /* glsl */ `
varying vec3 vBounceWorldPos;
varying vec3 vBounceWorldNormal;
`;

// The normal is carried by the inverse transpose of the model matrix, which three provides as normalMatrix in view
// space; multiplying by the view matrix on the right takes it back to the world without an inverse.
const BOUNCE_VERTEX = /* glsl */ `
vBounceWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
vBounceWorldNormal = normalize((vec4(normalize(normalMatrix * objectNormal), 0.0) * viewMatrix).xyz);
`;

/** Make a material reflect the screen. `detail` is how finely its part is modelled, 1 for a plain slab. */
export function applyScreenBounce(
  material: MeshStandardMaterial,
  shared: BounceUniforms,
  detail: number,
): void {
  const uBounceDetail = new Uniform(detail);
  const before = material.onBeforeCompile;
  material.onBeforeCompile = (shader, renderer) => {
    before?.call(material, shader, renderer);
    Object.assign(shader.uniforms, shared, { uBounceDetail });
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", `#include <common>\n${BOUNCE_VERTEX_PARS}`)
      .replace(
        "#include <project_vertex>",
        `#include <project_vertex>\n${BOUNCE_VERTEX}`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>\n${BOUNCE_PARS}`)
      .replace(
        "#include <lights_fragment_end>",
        `#include <lights_fragment_end>\n${BOUNCE_BODY}`,
      );
  };
  // Programs are cached by this key; the patched shader must never be confused with the plain one.
  material.customProgramCacheKey = () => "screen-bounce";
}

/** The screen's corners in the screen mesh's own space, fixed when the device is prepared. */
export interface ScreenFrame {
  mesh: Mesh;
  origin: Vector3;
  across: Vector3;
  down: Vector3;
  /** Unit direction out of the glass, in the mesh's own space. */
  facing: Vector3;
}

const point = new Vector3();
const corner = new Vector3();

/** Carry the screen's corners into the world, so a lid that moves takes its reflection with it. */
export function updateBounceFrame(
  shared: BounceUniforms,
  frame: ScreenFrame,
): void {
  const world: Matrix4 = frame.mesh.matrixWorld;
  const origin = shared.uBounceOrigin.value
    .copy(frame.origin)
    .applyMatrix4(world);
  // Edges as the difference of two moved points, which is right under any scale.
  corner.copy(frame.origin).add(frame.across).applyMatrix4(world);
  shared.uBounceAcross.value.copy(corner).sub(origin);
  corner.copy(frame.origin).add(frame.down).applyMatrix4(world);
  shared.uBounceDown.value.copy(corner).sub(origin);
  // The normal from the edges themselves, so a squashed model still faces the right way; the facing direction only
  // says which of the two sides is the glass.
  const normal = shared.uBounceNormal.value
    .crossVectors(shared.uBounceDown.value, shared.uBounceAcross.value)
    .normalize();
  point.copy(frame.facing).transformDirection(world);
  if (normal.dot(point) < 0) normal.negate();
}
