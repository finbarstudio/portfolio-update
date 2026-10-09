import { BlendFunction, Effect, EffectAttribute } from "postprocessing";
import { Uniform, Vector2 } from "three";
import { TONE_GLSL } from "./tone";

/**
 * Custom post effects. Every effect here:
 * - uses BlendFunction.NORMAL so its output replaces the input outright;
 * - keeps the alpha channel meaningful (premultiplied) so a transparent background still exports with alpha;
 * - has no influence at all when its amounts are 0.
 */

const TONE_FRAGMENT = /* glsl */ `
${TONE_GLSL}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec3 mapped = toneShoulder(max(inputColor.rgb, vec3(0.0)));
  // Light added on empty pixels (bloom) has no coverage yet. Give it some so it survives a transparent export.
  float coverage = max(inputColor.a, max(mapped.r, max(mapped.g, mapped.b)));
  outputColor = vec4(mapped, min(coverage, 1.0));
}
`;

/** Highlight roll-off for the lit device. The screen shader pre-compensates for it, see ./tone. */
export class ShoulderToneMapEffect extends Effect {
  constructor() {
    super("ShoulderToneMapEffect", TONE_FRAGMENT, {
      blendFunction: BlendFunction.NORMAL,
    });
  }
}

const LENS_FRAGMENT = /* glsl */ `
uniform float uFisheye;
uniform float uBlur;
uniform vec2 uBlurCenter;
uniform float uAberration;
uniform vec2 uAberrationCenter;

// Barrel distortion that keeps the frame corners fixed, so the centre magnifies and no empty edges appear.
vec2 lensWarp(vec2 uv) {
  vec2 p = uv * 2.0 - 1.0;
  float scale = (1.0 + uFisheye * dot(p, p)) / (1.0 + 2.0 * uFisheye);
  return p * scale * 0.5 + 0.5;
}

// One sample of the frame with radial chromatic aberration: red and blue are scaled away from the aberration centre.
vec4 lensTap(vec2 uv) {
  vec4 green = texture2D(inputBuffer, lensWarp(uv));
  if (uAberration <= 0.0) {
    return green;
  }
  vec2 offset = uv - uAberrationCenter;
  vec4 red = texture2D(inputBuffer, lensWarp(uAberrationCenter + offset * (1.0 + uAberration)));
  vec4 blue = texture2D(inputBuffer, lensWarp(uAberrationCenter + offset * (1.0 - uAberration)));
  return vec4(red.r, green.g, blue.b, max(green.a, max(red.a, blue.a)));
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  if (uBlur <= 0.0) {
    outputColor = lensTap(uv);
    return;
  }
  // Zoom blur: average taps along the line through the blur centre, so the smear grows with distance from it.
  vec2 direction = uv - uBlurCenter;
  vec4 sum = vec4(0.0);
  for (int i = 0; i < 16; i++) {
    float t = float(i) / 15.0 - 0.5;
    sum += lensTap(uBlurCenter + direction * (1.0 - uBlur * t));
  }
  outputColor = sum / 16.0;
}
`;

/** Fisheye, radial zoom blur and radial chromatic aberration in a single pass. Centres are in GL uv (origin bottom-left). */
export class LensEffect extends Effect {
  /** Barrel strength, 0 = off. */
  readonly fisheye: Uniform<number>;
  /** Zoom blur span as a fraction of the distance to the centre, 0 = off. */
  readonly blur: Uniform<number>;
  readonly blurCenter: Uniform<Vector2>;
  /** Red/blue scale offset, 0 = off. */
  readonly aberration: Uniform<number>;
  readonly aberrationCenter: Uniform<Vector2>;

  constructor() {
    const fisheye = new Uniform(0);
    const blur = new Uniform(0);
    const blurCenter = new Uniform(new Vector2(0.5, 0.5));
    const aberration = new Uniform(0);
    const aberrationCenter = new Uniform(new Vector2(0.5, 0.5));
    super("LensEffect", LENS_FRAGMENT, {
      attributes: EffectAttribute.CONVOLUTION,
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map<string, Uniform>([
        ["uFisheye", fisheye],
        ["uBlur", blur],
        ["uBlurCenter", blurCenter],
        ["uAberration", aberration],
        ["uAberrationCenter", aberrationCenter],
      ]),
    });
    this.fisheye = fisheye;
    this.blur = blur;
    this.blurCenter = blurCenter;
    this.aberration = aberration;
    this.aberrationCenter = aberrationCenter;
  }
}

const FILM_FRAGMENT = /* glsl */ `
uniform float uVignette;
uniform float uGrain;
uniform float uTime;
uniform vec2 uResolution;

float filmHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec3 color = inputColor.rgb;
  color *= 1.0 - uVignette * smoothstep(0.25, 0.8, length(uv - 0.5));

  // The grain is a pure function of uv and time, quantised to 24 steps a second, so a given time always renders the
  // same noise. That keeps exports repeatable.
  float grainSize = max(1.0, uResolution.y / 1080.0);
  vec2 cell = floor(uv * uResolution / grainSize);
  float step24 = mod(floor(uTime * 24.0), 64.0);
  float noise = filmHash(cell + step24 * vec2(37.0, 17.0)) + filmHash(cell * 1.7 + step24 * vec2(11.0, 29.0)) - 1.0;
  color += noise * uGrain * 0.12 * inputColor.a;

  outputColor = vec4(clamp(color, vec3(0.0), vec3(inputColor.a)), inputColor.a);
}
`;

/** Vignette and animated film grain. */
export class FilmEffect extends Effect {
  /** 0..1 */
  readonly vignette: Uniform<number>;
  /** 0..1 */
  readonly grain: Uniform<number>;
  /** Seconds. Drives the grain pattern. */
  readonly time: Uniform<number>;
  private readonly resolution: Uniform<Vector2>;

  constructor() {
    const vignette = new Uniform(0);
    const grain = new Uniform(0);
    const time = new Uniform(0);
    const resolution = new Uniform(new Vector2(1, 1));
    super("FilmEffect", FILM_FRAGMENT, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map<string, Uniform>([
        ["uVignette", vignette],
        ["uGrain", grain],
        ["uTime", time],
        ["uResolution", resolution],
      ]),
    });
    this.vignette = vignette;
    this.grain = grain;
    this.time = time;
    this.resolution = resolution;
  }

  setSize(width: number, height: number): void {
    super.setSize(width, height);
    this.resolution.value.set(width, height);
  }
}
