import { type AnimPath, PARAMS } from "./params";

/**
 * How far a typed value may go past its slider. The slider keeps the range
 * that is comfortable to drag; the number box accepts anything inside these
 * outer limits. Params not listed stop at their slider range, because past it
 * they mean nothing (an opacity over 100%) or break the view (a lens past flat).
 */
const TYPED: Partial<Record<AnimPath, readonly [min: number, max: number]>> = {
  "object.tilt": [-180, 180],
  "object.x": [-500, 500],
  "object.y": [-500, 500],
  "object.rotX": [-3600, 3600],
  "object.rotY": [-3600, 3600],
  "object.rotZ": [-3600, 3600],
  "camera.zoom": [1, 1000],
};

export function typedLimits(path: AnimPath): readonly [number, number] {
  return TYPED[path] ?? [PARAMS[path].min, PARAMS[path].max];
}

/** Clamp to the outer limits: what the scene will hold, as opposed to what the slider shows. */
export function clampTyped(path: AnimPath, value: number): number {
  const [min, max] = typedLimits(path);
  return Math.min(max, Math.max(min, value));
}
