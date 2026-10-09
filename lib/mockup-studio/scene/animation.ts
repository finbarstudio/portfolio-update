import type { AnimPath } from "./params";
import type { Ease, Keyframe, Shot, Values } from "./types";

const EASINGS: Record<Ease, (t: number) => number> = {
  linear: (t) => t,
  easeIn: (t) => t * t * t,
  easeOut: (t) => 1 - (1 - t) ** 3,
  easeInOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
  easeOutExpo: (t) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t)),
  easeInOutQuint: (t) => (t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2),
  easeOutBack: (t) => 1 + 2.70158 * (t - 1) ** 3 + 1.70158 * (t - 1) ** 2,
  spring: (t) =>
    t <= 0 || t >= 1
      ? Math.min(Math.max(t, 0), 1)
      : 1 - Math.exp(-6 * t) * Math.cos(11 * t),
  hold: () => 0,
};

export const EASE_OPTIONS: Ease[] = [
  "linear",
  "easeIn",
  "easeOut",
  "easeInOut",
  "easeOutExpo",
  "easeInOutQuint",
  "easeOutBack",
  "spring",
  "hold",
];

/** Value of a sorted keyframe track at `t` ms. Clamps outside the range. */
export function sampleTrack(keyframes: Keyframe[], t: number): number {
  const first = keyframes[0];
  const last = keyframes[keyframes.length - 1];
  if (t <= first.t) return first.value;
  if (t >= last.t) return last.value;
  let i = 0;
  while (keyframes[i + 1].t <= t) i++;
  const from = keyframes[i];
  const to = keyframes[i + 1];
  const progress = EASINGS[from.ease]((t - from.t) / (to.t - from.t));
  return from.value + (to.value - from.value) * progress;
}

export function totalDuration(shots: Shot[]): number {
  return shots.reduce((sum, shot) => sum + shot.duration, 0);
}

export interface ShotLocation {
  shot: Shot;
  index: number;
  /** Milliseconds from the start of the shot. */
  localMs: number;
  /** Global start of the shot in milliseconds. */
  startMs: number;
}

/** Which shot a global time falls in. The end of the timeline maps to the last shot. */
export function locateShot(shots: Shot[], ms: number): ShotLocation {
  let startMs = 0;
  for (let index = 0; index < shots.length; index++) {
    const shot = shots[index];
    const isLast = index === shots.length - 1;
    if (ms < startMs + shot.duration || isLast) {
      return {
        shot,
        index,
        startMs,
        localMs: Math.min(Math.max(ms - startMs, 0), shot.duration),
      };
    }
    startMs += shot.duration;
  }
  throw new Error("locateShot: the timeline has no shots");
}

/** Rest values overridden by whatever the shot under `ms` animates. */
function evaluateShots(rest: Values, shots: Shot[], ms: number): Values {
  const { shot, localMs } = locateShot(shots, ms);
  const out = { ...rest };
  for (const path of Object.keys(shot.tracks) as AnimPath[]) {
    const keyframes = shot.tracks[path];
    if (keyframes?.length) out[path] = sampleTrack(keyframes, localMs);
  }
  return out;
}

/** The last stretch of the timeline that a seamless loop spends returning to the first frame. */
const RETURN_FRACTION = 0.2;
const RETURN_MIN_MS = 500;
const RETURN_MAX_MS = 2500;

const ANGLE_PATHS = new Set<AnimPath>([
  "object.rotX",
  "object.rotY",
  "object.rotZ",
  "lights.rotation",
]);

/** Over a full turn, come back the short way round: a shot that ends at 360 should hold, not unwind. */
function blendAngle(from: number, to: number, k: number): number {
  const delta = ((((to - from) % 360) + 540) % 360) - 180;
  return from + delta * k;
}

/**
 * Scene values at `ms`. With `seamless` on, the end of the timeline glides back to how the first frame looks, so
 * playing on a loop never jumps: whatever the animation did, the last frame equals the first.
 */
export function evaluate(
  rest: Values,
  shots: Shot[],
  ms: number,
  seamless = false,
): Values {
  const now = evaluateShots(rest, shots, ms);
  if (!seamless) return now;
  const total = totalDuration(shots);
  const window = Math.min(
    RETURN_MAX_MS,
    Math.max(RETURN_MIN_MS, total * RETURN_FRACTION),
  );
  const start = total - window;
  if (ms <= start || window <= 0) return now;
  const k = EASINGS.easeInOut(Math.min(1, (ms - start) / window));
  const first = evaluateShots(rest, shots, 0);
  const out = { ...now };
  for (const path of Object.keys(now) as AnimPath[]) {
    const to = first[path];
    const from = now[path];
    if (to === from) continue;
    out[path] = ANGLE_PATHS.has(path)
      ? blendAngle(from, to, k)
      : from + (to - from) * k;
  }
  return out;
}
