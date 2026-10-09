/**
 * Camera framing, as plain maths so the viewport, the presets and the
 * framing checker all agree. Mirrors components/viewport/frame-driver.tsx
 * (camera on +Z looking at the origin, fov = 50 - lens * 0.4) and
 * components/viewport/device.tsx (outer group moves and tilts, inner group
 * holds the Euler XYZ rotation).
 */

import { PARAMS } from "./params";

/** Share of the frame the device takes up at zoom 60. */
const FIT_FILL = 0.62;
const TURN_ALLOWANCE = 0.85;
const DEG = Math.PI / 180;

export interface Extents {
  /** Width, height and depth of the device in world units. */
  x: number;
  y: number;
  z: number;
}

/** Width, height and depth of the device in world units, as stored. */
export type ExtentsTuple = readonly [number, number, number];

/** Everything that decides where the device lands in the frame. */
export interface FramingPose {
  /** `object.x`, 100 = one world unit. */
  x: number;
  y: number;
  /** Degrees. */
  tilt: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  zoom: number;
  lens: number;
}

/** Where the screen sits on the device, in the same units as the extents, measured from the device's centre. */
export interface ScreenBox {
  center: readonly [number, number, number];
  /** Width and height. */
  size: readonly [number, number];
}

export interface FramingContext {
  extents: ExtentsTuple;
  /** Absent for a device with no screen. */
  screen?: ScreenBox | null;
  /** Composition width / height. */
  aspect: number;
}

/**
 * World units the frame shows top to bottom at the origin for a given zoom.
 * Zoom is relative to the device and the canvas shape: at 60 the whole device
 * fits with room to turn, 120 is twice as close.
 */
export function visibleSpan(
  extents: Extents,
  aspect: number,
  zoom: number,
): number {
  const { x: w, y: h, z: d } = extents;
  // A deep device (an open laptop) swings its depth into view as it turns, so allow for most of the diagonal.
  const wide = Math.max(w, TURN_ALLOWANCE * Math.hypot(w, d));
  const tall = Math.max(h, TURN_ALLOWANCE * Math.hypot(h, d));
  const fitSpan = Math.max(tall, wide / aspect) / FIT_FILL;
  return (fitSpan * 60) / zoom;
}

type Vec3 = [number, number, number];

function rotateX([x, y, z]: Vec3, deg: number): Vec3 {
  const c = Math.cos(deg * DEG);
  const s = Math.sin(deg * DEG);
  return [x, y * c - z * s, y * s + z * c];
}

function rotateY([x, y, z]: Vec3, deg: number): Vec3 {
  const c = Math.cos(deg * DEG);
  const s = Math.sin(deg * DEG);
  return [x * c + z * s, y, -x * s + z * c];
}

function rotateZ([x, y, z]: Vec3, deg: number): Vec3 {
  const c = Math.cos(deg * DEG);
  const s = Math.sin(deg * DEG);
  return [x * c - y * s, x * s + y * c, z];
}

/** A device-local point in world space under `pose`. */
function toWorld(point: Vec3, pose: FramingPose): Vec3 {
  // Euler XYZ applies Z, then Y, then X; the outer group then tilts and moves.
  const [x, y, z] = rotateX(
    rotateX(rotateY(rotateZ(point, pose.rotZ), pose.rotY), pose.rotX),
    pose.tilt,
  );
  return [x + pose.x / 100, y + pose.y / 100, z];
}

/** Below this fill a shot is about the whole device; above the upper value it is about the screen. */
const SCREEN_PRIORITY_FROM = 0.95;
const SCREEN_PRIORITY_FULL = 1.5;

/**
 * Where to slide the device (as `object.x` / `object.y`) so the point the
 * shot is about sits in the middle of the frame. From far away that point is
 * on the device as a whole; as the shot gets closer it moves onto the
 * screen, which is what a close shot is there to show. `focusX` / `focus`
 * pick a spot within whichever it is: 1 is the right or top edge, -1 the
 * left or bottom.
 */
export function placeSubject(
  pose: Omit<FramingPose, "zoom" | "x" | "y">,
  fill: number,
  focusX: number,
  focus: number,
  { extents, screen }: FramingContext,
): { x: number; y: number } {
  const onDevice: Vec3 = [
    (focusX * extents[0]) / 2,
    (focus * extents[1]) / 2,
    0,
  ];
  let target = onDevice;
  if (screen) {
    const t = Math.min(
      1,
      Math.max(
        0,
        (fill - SCREEN_PRIORITY_FROM) /
          (SCREEN_PRIORITY_FULL - SCREEN_PRIORITY_FROM),
      ),
    );
    const k = t * t * (3 - 2 * t);
    const onScreen: Vec3 = [
      screen.center[0] + (focusX * screen.size[0]) / 2,
      screen.center[1] + (focus * screen.size[1]) / 2,
      screen.center[2],
    ];
    target = [
      onDevice[0] + (onScreen[0] - onDevice[0]) * k,
      onDevice[1] + (onScreen[1] - onDevice[1]) * k,
      onDevice[2] + (onScreen[2] - onDevice[2]) * k,
    ];
  }
  const [x, y] = toWorld(target, { ...pose, x: 0, y: 0, zoom: 60 });
  return { x: -x * 100, y: -y * 100 };
}

/**
 * Largest |NDC| any corner of the device's bounding box reaches: 1 touches the
 * edge of the frame, under 1 keeps the whole device inside, over 1 crops into
 * it. Infinity when a corner is at or behind the camera.
 */
export function deviceReach(
  pose: FramingPose,
  extents: ExtentsTuple,
  aspect: number,
): number {
  const [w, h, d] = extents;
  const fov = 50 - pose.lens * 0.4;
  const tan = Math.tan((fov / 2) * DEG);
  const span = visibleSpan({ x: w, y: h, z: d }, aspect, pose.zoom);
  const distance = span / (2 * tan);
  let worst = 0;
  for (const sx of [-0.5, 0.5])
    for (const sy of [-0.5, 0.5])
      for (const sz of [-0.5, 0.5]) {
        const [x, y, z] = toWorld([sx * w, sy * h, sz * d], pose);
        const depth = distance - z;
        if (depth <= 0) return Number.POSITIVE_INFINITY;
        worst = Math.max(
          worst,
          Math.abs(x / depth / (tan * aspect)),
          Math.abs(y / depth / tan),
        );
      }
  return worst;
}

/**
 * The zoom at which the device reaches `fill` of the frame in this pose,
 * within the `camera.zoom` range. Reach grows with zoom, so a bisection finds it.
 */
export function zoomForFill(
  pose: Omit<FramingPose, "zoom">,
  fill: number,
  extents: ExtentsTuple,
  aspect: number,
): number {
  const reachAt = (zoom: number) =>
    deviceReach({ ...pose, zoom }, extents, aspect);
  let lo: number = PARAMS["camera.zoom"].min;
  let hi: number = PARAMS["camera.zoom"].max;
  if (reachAt(lo) >= fill) return lo;
  if (reachAt(hi) <= fill) return hi;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (reachAt(mid) < fill) lo = mid;
    else hi = mid;
  }
  return Math.round(((lo + hi) / 2) * 10) / 10;
}
