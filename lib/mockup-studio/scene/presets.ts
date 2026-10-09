import type { DeviceCategory, DeviceDef } from "./devices";
import { type FramingContext, placeSubject, zoomForFill } from "./framing";
import { type AnimPath, clampParam } from "./params";
import type { Ease, Keyframe, Tracks } from "./types";

/** One shot of a preset. */
export interface PresetShot {
  name: string;
  /** Length in seconds when the preset lays out a whole timeline. */
  seconds: number;
  /** A close-up that crops into the device on purpose. Everything else must keep the whole device in frame. */
  crop?: boolean;
  /** A close-up aimed at one end of the device rather than its middle, so most of the device is out of frame. */
  detail?: boolean;
  /** One continuous take that travels between a view of the whole device and close-ups. */
  journey?: boolean;
  /** Tracks for a shot of `duration` ms, framed for the current device and canvas shape. */
  build(duration: number, framing: FramingContext): Tracks;
}

export interface AnimationPreset {
  id: string;
  name: string;
  description: string;
  /** Only offered for devices with this feature. */
  requires?: "lid";
  /** Written for these folders of devices, and only offered there. Absent, with `ids`, means every device. */
  categories?: DeviceCategory[];
  /** Written for these particular devices, and only offered there. */
  ids?: string[];
  /** Built from mckp.live's own presets for this device, measured keyframe by keyframe. The ones to look at first. */
  featured?: boolean;
  /**
   * One shot animates the shot under the playhead. Several shots replace the
   * whole timeline and hard-cut from one to the next.
   */
  shots: PresetShot[];
}

/** One stop on a track: `at` is 0..1 of the shot, `ease` leads to the next stop. */
type Stop = readonly [at: number, value: number, ease?: Ease];

function key(path: AnimPath, t: number, value: number, ease: Ease): Keyframe {
  return { id: crypto.randomUUID(), t, value: clampParam(path, value), ease };
}

/** Keyframes from fractional stops. Values are clamped to the param's range. */
function track(
  path: AnimPath,
  duration: number,
  stops: readonly Stop[],
  defaultEase: Ease = "easeInOut",
): Keyframe[] {
  return stops.map(([at, value, ease]) =>
    key(path, Math.round(at * duration), value, ease ?? defaultEase),
  );
}

/**
 * A camera-and-object pose. Presets set every one of these outright, so a
 * preset always looks the same whatever the scene was left in.
 */
interface Pose {
  x?: number;
  y?: number;
  tilt?: number;
  rotX?: number;
  rotY?: number;
  rotZ?: number;
  /**
   * How much of the frame the device reaches in this pose: under 1 keeps the
   * whole device inside with room to spare, over 1 crops into it. The zoom
   * that gives this is solved per device and canvas shape when the preset is
   * applied.
   */
  fill?: number;
  /**
   * Which part of the device sits in the middle of the frame, top to bottom:
   * 1 is its top edge, -1 its bottom edge, 0 its centre. The zoom is solved
   * as if centred, then the device is slid so this point is in the middle.
   */
  focus?: number;
  /** The same, left to right: 1 is the right edge, -1 the left. */
  focusX?: number;
  /** Studio brightness, 0..100. Only animated by takes that set it; otherwise the user's lighting is left alone. */
  ambient?: number;
  /** Every lamp in the rig, 0..200 (100 = as set). Takes fade it to bring the device up out of the dark. */
  lamps?: number;
  /** Depth of field, 0..100. Takes push it up in close-ups so the picture falls off into softness. */
  dof?: number;
  /** Screen glow, 0..100: bloom spilling off a lit sign at night. Only animated where a take sets it. */
  glow?: number;
  /** Whole-picture blur, 0..100. Like `ambient`, only animated where a take sets it. */
  blur?: number;
  /** CRT mask on the screen, 0..100. Only animated where a take sets it. */
  crt?: number;
  /** Lens bulge, 0..100. Only animated where a take sets it. */
  fisheye?: number;
  lens?: number;
  /** Screen brightness, 0..100. 0 is a switched-off screen. */
  screen?: number;
  /** Light sweep, degrees. */
  light?: number;
  /** 0..100 */
  lid?: number;
}

/** Settings a take only touches when one of its poses asks for them. */
const OPTIONAL_PATHS = {
  ambient: "lights.ambient",
  lamps: "lights.level",
  dof: "camera.dof",
  glow: "screen.glow",
  blur: "effects.soften",
  crt: "screen.crt",
  fisheye: "camera.fisheye",
} as const satisfies Partial<Record<keyof Pose, AnimPath>>;

type OptionalPose = keyof typeof OPTIONAL_PATHS;

type TrackedPose = Exclude<
  keyof Pose,
  "fill" | "focus" | "focusX" | OptionalPose
>;

const POSE_PATHS: Record<TrackedPose, AnimPath> = {
  x: "object.x",
  y: "object.y",
  tilt: "object.tilt",
  rotX: "object.rotX",
  rotY: "object.rotY",
  rotZ: "object.rotZ",
  lens: "camera.lens",
  screen: "screen.opacity",
  light: "lights.rotation",
  lid: "object.lid",
};

const NEUTRAL: Required<Pose> = {
  x: 0,
  y: 0,
  tilt: 0,
  rotX: 0,
  rotY: 0,
  rotZ: 0,
  fill: 0.8,
  focus: 0,
  focusX: 0,
  ambient: 25,
  lamps: 100,
  dof: 20,
  glow: 0,
  blur: 0,
  crt: 0,
  fisheye: 0,
  lens: 70,
  screen: 100,
  light: 0,
  lid: 100,
};

/** One solved point on a take. */
interface PlacedStop {
  at: number;
  ease: Ease;
  pose: Required<Pose>;
  zoom: number;
}

/** Solve a pose's zoom and slide it so its subject sits mid-frame. */
function place(pose: Required<Pose>, framing: FramingContext) {
  // Zoom is solved on the centred pose; the slide is applied afterwards.
  const zoom = zoomForFill(pose, pose.fill, framing.extents, framing.aspect);
  const slide = placeSubject(pose, pose.fill, pose.focusX, pose.focus, framing);
  return {
    zoom,
    pose: { ...pose, x: pose.x + slide.x, y: pose.y + slide.y },
  };
}

function tracksFor(
  stops: readonly PlacedStop[],
  duration: number,
  optional: readonly OptionalPose[],
): Tracks {
  const tracks: Tracks = {};
  for (const name of Object.keys(POSE_PATHS) as TrackedPose[]) {
    const path = POSE_PATHS[name];
    tracks[path] = track(
      path,
      duration,
      stops.map((stop) => [stop.at, stop.pose[name], stop.ease] as const),
    );
  }
  tracks["camera.zoom"] = track(
    "camera.zoom",
    duration,
    stops.map((stop) => [stop.at, stop.zoom, stop.ease] as const),
  );
  for (const name of optional) {
    const path = OPTIONAL_PATHS[name];
    tracks[path] = track(
      path,
      duration,
      stops.map((stop) => [stop.at, stop.pose[name], stop.ease] as const),
    );
  }
  return tracks;
}

/** A point on a continuous take: where in the shot (0..1), the pose there, and the ease towards the next point. */
type Waypoint = readonly [at: number, pose: Pose, ease?: Ease];

/**
 * One unbroken camera move through several poses. Each pose carries over
 * whatever it does not set from the one before, and gets its own solved
 * zoom, so the take can swing from the whole device to a tight detail and
 * stay composed on any device and canvas shape. Far poses centre the device;
 * close ones centre its screen.
 */
function journey(
  points: readonly Waypoint[],
  defaultEase: Ease = "easeInOut",
): PresetShot["build"] {
  return (duration, framing) => {
    let pose: Required<Pose> = { ...NEUTRAL };
    const stops = points.map(([at, change, ease]) => {
      pose = { ...pose, ...change };
      return { at, ease: ease ?? defaultEase, ...place(pose, framing) };
    });
    const optional = (Object.keys(OPTIONAL_PATHS) as OptionalPose[]).filter(
      (name) => points.some(([, change]) => change[name] !== undefined),
    );
    return tracksFor(stops, duration, optional);
  };
}

/**
 * One slow move from pose `a` to pose `b` over the whole shot. Anything `b`
 * leaves out holds its `a` value.
 */
function drift(
  a: Pose,
  b: Pose,
  ease: Ease = "easeInOut",
): PresetShot["build"] {
  return journey(
    [
      [0, a],
      [1, b],
    ],
    ease,
  );
}

export const PRESETS: AnimationPreset[] = [
  // ---- iPhone: rebuilt from mckp.live's seven iPhone presets, keyframe by keyframe ----
  {
    id: "rise-and-turn",
    name: "Rise and Turn",
    description: "",
    categories: ["Phones and tablets"],
    featured: true,
    shots: [
      {
        name: "Rise",
        seconds: 7,
        journey: true,
        build: journey([
          [0, { fill: 0.64, lens: 100 }],
          [0.29, { rotX: -22, rotY: -36, rotZ: -17 }],
          [0.57, { rotX: -27, rotY: -22, rotZ: -13, fill: 1.5, focus: 0.1 }],
          [0.85, { rotX: -45, rotY: -22, rotZ: -22, fill: 1.58, lens: 0 }],
          [1, { lamps: 0, screen: 0 }],
        ]),
      },
    ],
  },
  {
    id: "spin-through",
    name: "Spin Through",
    description: "",
    categories: ["Phones and tablets"],
    featured: true,
    shots: [
      {
        name: "Spin",
        seconds: 10,
        journey: true,
        build: journey([
          [0, { fill: 0.74, rotX: -8, screen: 0, lamps: 0 }],
          [0.2, { rotY: 320, rotZ: -16 }],
          [0.28, { fill: 2, rotZ: -17, screen: 100, lamps: 100, crt: 7 }],
          [0.8, { rotX: -29, rotY: 398, rotZ: 24, fill: 1.76 }],
          [0.88, { screen: 0, lamps: 0 }],
          [1, { rotY: 628, rotX: -23, fill: 0.74, crt: 0 }],
        ]),
      },
    ],
  },
  {
    id: "edge-turn",
    name: "Edge Turn",
    description: "",
    categories: ["Phones and tablets"],
    featured: true,
    shots: [
      {
        name: "Turn",
        seconds: 13,
        journey: true,
        build: journey([
          [0, { rotY: 86.5, rotX: 1, fill: 0.8, screen: 0, lamps: 0 }],
          [0.08, { screen: 100 }],
          [0.28, { rotY: 0, rotX: 0, lamps: 100 }],
          [0.43, { rotY: 20, rotX: -1.75, fill: 2, crt: 7 }],
          [0.8, { rotY: -22, rotX: 1.75 }],
          [0.92, { screen: 100 }],
          [1, { rotY: -88.5, rotX: 2.8, screen: 0, lamps: 0 }],
        ]),
      },
    ],
  },
  {
    id: "focus-pull",
    name: "Focus Pull",
    description: "",
    categories: ["Phones and tablets"],
    featured: true,
    shots: [
      {
        name: "Pull",
        seconds: 12,
        journey: true,
        build: journey([
          [0, { rotY: 90.5, rotX: 2, fill: 0.8, dof: 20, crt: 0 }],
          [0.17, { rotY: 52, rotX: 8, fill: 2.4, dof: 90, crt: 13 }],
          [0.41, { rotY: 50, rotX: -14, focus: 0.1 }],
          [0.69, { rotY: -40, rotX: -11, fill: 2.43, focus: -0.1 }],
          [1, { rotY: 0, rotX: 0, fill: 0.84, focus: 0, dof: 20, crt: 0 }],
        ]),
      },
    ],
  },
  {
    id: "dutch-rise",
    name: "Dutch Rise",
    description: "",
    categories: ["Phones and tablets"],
    featured: true,
    shots: [
      {
        name: "Rise",
        seconds: 9,
        journey: true,
        build: journey([
          [0, { fill: 0.8, screen: 0, lamps: 50 }],
          [0.09, { screen: 100, lamps: 140 }],
          [0.36, { rotX: 36, rotY: 35, fill: 2.24, focus: -0.1 }],
          [0.75, { rotX: -19, rotY: -45.5, focus: 0.1 }],
          [0.88, { rotX: 0, rotY: 0, focus: 0 }],
          [0.93, { screen: 0 }],
          [1, { fill: 0.8, lamps: 0 }],
        ]),
      },
    ],
  },
  {
    id: "three-angles",
    name: "Three Angles",
    description: "",
    categories: ["Phones and tablets"],
    featured: true,
    shots: [
      {
        name: "Low left",
        seconds: 4.07,
        crop: true,
        detail: true,
        build: journey([
          [0, { rotX: -22, rotY: -35.5, fill: 2.16, screen: 0, lamps: 0 }],
          [0.2, { screen: 100, lamps: 100 }],
          [1, { rotX: -21, rotY: 1.5 }],
        ]),
      },
      {
        name: "High sweep",
        seconds: 4.03,
        crop: true,
        detail: true,
        build: journey([
          [0, { rotX: 20, rotY: -42.5, fill: 2.24, focus: 0.1 }],
          [1, { rotX: 27.65, rotY: 37 }],
        ]),
      },
      {
        name: "Turn away",
        seconds: 3.98,
        crop: true,
        detail: true,
        build: journey([
          [0, { rotX: -21, rotY: 1.5, fill: 2.16 }],
          [0.77, { lamps: 100, screen: 100 }],
          [1, { rotY: 38.5, rotX: -19.6, screen: 0, lamps: 0 }],
        ]),
      },
    ],
  },
  {
    id: "screen-study",
    name: "Screen Study",
    description: "",
    categories: ["Phones and tablets"],
    featured: true,
    shots: [
      {
        name: "Study",
        seconds: 12,
        journey: true,
        build: journey([
          [0, { fill: 0.68, screen: 0 }],
          [0.11, { fill: 0.92, screen: 100 }],
          [
            0.245,
            { rotY: 43, rotX: 10.5, fill: 2.12, dof: 90, crt: 17, focus: 0.1 },
          ],
          [0.47, { rotY: -36, rotX: -11, focus: -0.1 }],
          [0.69, { rotY: 4.5, rotX: 0.35, fill: 2.1 }],
          [0.82, { screen: 100 }],
          [
            0.89,
            {
              rotY: 0,
              rotX: 0,
              fill: 0.68,
              focus: 0,
              dof: 20,
              crt: 0,
              screen: 0,
            },
          ],
          [1, { fill: 0.68 }],
        ]),
      },
    ],
  },
  // ---- Laptops: rebuilt from mckp.live's MacBook Pro and Galaxy Book presets ----
  {
    id: "laptop-long-take",
    name: "Long Take",
    description: "",
    requires: "lid",
    featured: true,
    shots: [
      {
        name: "Take",
        seconds: 14,
        journey: true,
        build: journey([
          [0, { fill: 1.16, lens: 100, screen: 0, lamps: 50 }],
          [0.16, { fill: 1.3, screen: 100, lamps: 100, rotX: 11.6, lid: 100 }],
          [
            0.29,
            {
              fill: 2.8,
              rotX: -14,
              rotY: -4,
              lid: 122,
              dof: 90,
              crt: 25,
              focus: -0.2,
              focusX: 0.2,
            },
          ],
          [
            0.67,
            {
              fill: 3.1,
              rotX: 19.6,
              rotY: -50,
              lid: 114,
              focusX: -0.2,
              focus: 0.1,
            },
          ],
          [
            0.8,
            {
              fill: 0.74,
              rotX: -1,
              rotY: 0,
              lid: 100,
              dof: 20,
              crt: 0,
              focus: 0,
              focusX: 0,
            },
          ],
          [0.93, { lid: 0, lamps: 130 }],
          [1, { lamps: 0, screen: 0 }],
        ]),
      },
    ],
  },
  {
    id: "wide-lens-close",
    name: "Wide Lens Close",
    description: "",
    requires: "lid",
    featured: true,
    shots: [
      {
        name: "Close",
        seconds: 10,
        journey: true,
        build: journey([
          [
            0,
            {
              fill: 2.2,
              rotX: 4.3,
              rotY: 36,
              lid: 115,
              crt: 28,
              dof: 80,
              fisheye: 0,
              focusX: 0.3,
              focus: -0.2,
            },
          ],
          [0.47, { rotY: -20.6, fisheye: 65, focusX: -0.2, focus: 0 }],
          [0.72, { fisheye: 80, focus: 0.15 }],
          [
            1,
            {
              rotY: 0.5,
              fill: 1.04,
              lid: 100,
              fisheye: 0,
              crt: 0,
              dof: 20,
              focusX: 0,
              focus: 0,
            },
          ],
        ]),
      },
    ],
  },
  {
    id: "fisheye-swing",
    name: "Fisheye Swing",
    description: "",
    requires: "lid",
    featured: true,
    shots: [
      {
        name: "Swing",
        seconds: 9,
        journey: true,
        build: journey([
          [0, { fill: 0.8, rotX: 8, rotY: 0.5, fisheye: 0, lid: 100 }],
          [0.34, { fill: 2, rotX: 11, rotY: -54, fisheye: 90, focusX: 0.2 }],
          [
            0.67,
            {
              fill: 1.88,
              rotX: -1.3,
              rotY: 24,
              fisheye: 2,
              lid: 114,
              focusX: -0.1,
            },
          ],
          [
            1,
            {
              fill: 1.04,
              rotX: -1,
              rotY: -0.5,
              fisheye: 0,
              lid: 100,
              focusX: 0,
            },
          ],
        ]),
      },
    ],
  },
  {
    id: "three-cuts",
    name: "Three Cuts",
    description: "",
    requires: "lid",
    featured: true,
    shots: [
      {
        name: "Over the top",
        seconds: 4.75,
        journey: true,
        build: journey([
          [0, { rotX: 15, rotY: 40, fill: 1, lid: 120 }],
          [1, { rotX: 21.6, rotY: -19.7 }],
        ]),
      },
      {
        name: "Flat across",
        seconds: 5.19,
        crop: true,
        detail: true,
        build: journey([
          [0, { rotX: -1.4, rotY: -0.5, fill: 2.3, lid: 100, focusX: 0.3 }],
          [1, { focusX: -0.3 }],
        ]),
      },
      {
        name: "Corner",
        seconds: 3.96,
        crop: true,
        detail: true,
        build: journey([
          [0, { rotX: 19, rotY: -43, fill: 1.84, lid: 124, focus: -0.3 }],
          [1, { focus: 0.2, focusX: -0.2 }],
        ]),
      },
    ],
  },
  // ---- Displays: rebuilt from mckp.live's eight Studio Display presets ----
  {
    id: "display-long-take",
    name: "Long Take",
    description: "",
    ids: ["pro-display", "studio-display", "mac-pro"],
    featured: true,
    shots: [
      {
        name: "Take",
        seconds: 16,
        journey: true,
        build: journey([
          [0, { fill: 0.8, screen: 0 }],
          [0.06, { screen: 100 }],
          [
            0.23,
            { rotX: -13, rotY: -32.5, fill: 2.9, focusX: -0.3, focus: -0.2 },
          ],
          [0.5, { rotX: -9.8, rotY: 43.5, fill: 2.1, focusX: 0.2, focus: 0 }],
          [
            0.74,
            { rotX: 20.7, rotY: -26, fill: 2.56, focusX: -0.3, focus: 0.2 },
          ],
          [0.94, { screen: 100 }],
          [1, { rotX: 0, rotY: 0, fill: 0.8, screen: 0, focusX: 0, focus: 0 }],
        ]),
      },
    ],
  },
  {
    id: "sweep-and-push",
    name: "Sweep and Push",
    description: "",
    ids: ["pro-display", "studio-display", "mac-pro"],
    featured: true,
    shots: [
      {
        name: "Sweep",
        seconds: 10,
        journey: true,
        build: journey([
          [0, { rotY: 90, rotX: -0.7, fill: 0.8, screen: 0, lamps: 0 }],
          [0.04, { screen: 100, lamps: 100 }],
          [
            0.28,
            { rotY: 56, rotX: 6.65, fill: 2.08, focusX: 0.2, focus: -0.2 },
          ],
          [0.8, { rotY: -43, rotX: 6.3, focusX: -0.3 }],
          [1, { rotY: 0, rotX: 0, fill: 0.96, focusX: 0, focus: 0 }],
        ]),
      },
    ],
  },
  {
    id: "turn-around",
    name: "Turn Around",
    description: "",
    ids: ["pro-display", "studio-display", "mac-pro"],
    featured: true,
    shots: [
      {
        name: "Turn",
        seconds: 12,
        journey: true,
        build: journey([
          [0, { fill: 0.8 }],
          [0.33, { rotX: 24.5, rotY: 35.5, fill: 1.6, focusX: 0.2 }],
          [0.67, { rotX: 18.9, rotY: -44.5, fill: 1.76, focusX: -0.2 }],
          [1, { rotX: 0, rotY: 0, fill: 0.8, focusX: 0 }],
        ]),
      },
    ],
  },
  {
    id: "two-cuts",
    name: "Two Cuts",
    description: "",
    ids: ["pro-display", "studio-display", "mac-pro"],
    featured: true,
    shots: [
      {
        name: "From the right",
        seconds: 4.85,
        crop: true,
        build: journey([
          [
            0,
            {
              rotX: 13.65,
              rotY: 53,
              fill: 1.6,
              screen: 0,
              lamps: 0,
              focusX: 0.1,
            },
          ],
          [0.17, { screen: 100, lamps: 100 }],
          [0.83, { screen: 100, lamps: 100 }],
          [1, { rotX: 10.85, rotY: 60, screen: 0, lamps: 0 }],
        ]),
      },
      {
        name: "From the left",
        seconds: 4.8,
        crop: true,
        detail: true,
        build: journey([
          [
            0,
            {
              rotX: 2.8,
              rotY: -49,
              fill: 1.92,
              screen: 0,
              lamps: 0,
              focusX: -0.1,
              focus: 0.1,
            },
          ],
          [0.16, { screen: 100, lamps: 100 }],
          [0.82, { screen: 100, lamps: 100 }],
          [1, { rotY: -50.5, rotX: 0.35, fill: 2.08, screen: 0, lamps: 0 }],
        ]),
      },
    ],
  },
  // ---- Tablets: rebuilt from mckp.live's iPad Pro presets ----
  {
    id: "bright-pop",
    name: "Bright Pop",
    description: "",
    ids: ["ipad-pro-13", "ipad-mini-6"],
    featured: true,
    shots: [
      {
        name: "Turn to face",
        seconds: 4.8,
        build: journey([
          [0, { rotY: 90, fill: 0.8, screen: 0, lamps: 0 }],
          [0.21, { lamps: 10 }],
          [0.58, { rotY: 0, lamps: 100 }],
          [1, { screen: 100 }],
        ]),
      },
      {
        name: "Blaze",
        seconds: 4.4,
        crop: true,
        build: journey([
          [
            0,
            {
              rotX: -10,
              rotY: -20,
              fill: 1.42,
              lamps: 200,
              crt: 10,
              focusX: -0.1,
            },
          ],
          [1, { rotX: -11.5, rotY: -0.5 }],
        ]),
      },
      {
        name: "Settle and fade",
        seconds: 4.4,
        crop: true,
        build: journey([
          [
            0,
            { rotX: -20, rotY: 26, fill: 1.1, lamps: 200, crt: 10, focusX: 0 },
          ],
          [0.7, { lamps: 100 }],
          [1, { rotX: -5, rotY: 5.5, lamps: 0, screen: 0 }],
        ]),
      },
    ],
  },
  {
    id: "spin-settle",
    name: "Spin Settle",
    description: "",
    ids: ["ipad-pro-13", "ipad-mini-6"],
    featured: true,
    shots: [
      {
        name: "Spin",
        seconds: 8,
        journey: true,
        build: journey([
          [0, { rotY: 180, rotX: 0, fill: 0.8, lamps: 0, lens: 100 }],
          [0.18, { lamps: 75 }],
          [
            0.45,
            {
              rotY: 397.5,
              rotX: 28.7,
              fill: 1.57,
              lamps: 100,
              crt: 11,
              lens: 95,
            },
          ],
          [0.9, { rotY: 322.5, rotX: 30.45 }],
          [1, { lamps: 0, screen: 0 }],
        ]),
      },
    ],
  },
  {
    id: "lean-and-return",
    name: "Lean and Return",
    description: "",
    ids: ["ipad-pro-13", "ipad-mini-6"],
    featured: true,
    shots: [
      {
        name: "Lean",
        seconds: 10,
        journey: true,
        build: journey([
          [0, { fill: 0.8, screen: 0, lens: 100 }],
          [0.08, { screen: 100 }],
          [
            0.4,
            {
              rotX: -16.8,
              rotY: 38,
              fill: 2.5,
              crt: 11,
              lens: 95,
              focus: -0.2,
            },
          ],
          [0.7, { rotX: 14, rotY: -42.5, fill: 2.27, focus: 0.2 }],
          [0.92, { screen: 100 }],
          [
            1,
            {
              rotX: 0,
              rotY: 0,
              fill: 0.8,
              crt: 0,
              lens: 100,
              screen: 0,
              focus: 0,
            },
          ],
        ]),
      },
    ],
  },
  {
    id: "signature-cut",
    name: "Signature Cut",
    description:
      "Three bold shots: a big three-quarter that fills the frame, a low close pass across the screen, then a slow settle to face the camera.",
    shots: [
      {
        name: "Three-quarter",
        seconds: 3.2,
        crop: true,
        build: drift(
          { rotY: 44, rotX: 9, fill: 1.18, light: -30 },
          { rotY: 33, rotX: 4, fill: 1.08, light: 10 },
          "linear",
        ),
      },
      {
        name: "Low pass",
        seconds: 3.8,
        crop: true,
        detail: true,
        build: drift(
          {
            rotY: 42,
            rotX: -17,
            focusX: 0.18,
            focus: -0.3,
            fill: 1.7,
            light: 30,
          },
          {
            rotY: 18,
            rotX: -14,
            focusX: 0.3,
            focus: -0.2,
            fill: 1.7,
            light: -20,
          },
          "linear",
        ),
      },
      {
        name: "Settle",
        seconds: 3.8,
        journey: true,
        build: drift(
          { rotY: 20, rotX: 9, fill: 1.06, light: -50 },
          { rotY: 0, rotX: -4, tilt: -9, fill: 0.9, light: 30 },
          "easeOut",
        ),
      },
    ],
  },
  {
    id: "sweep-in",
    name: "Sweep In",
    description:
      "One take: starts square on, drops low to one side, then swings right round and finishes tight on the far corner of the screen.",
    shots: [
      {
        name: "Sweep",
        seconds: 8,
        journey: true,
        build: journey([
          [0, { fill: 0.8, light: -40 }],
          [
            0.5,
            {
              tilt: -18,
              rotY: -26,
              rotX: 4,
              focusX: -0.28,
              focus: 0.15,
              fill: 1.5,
              light: 0,
            },
          ],
          [1, { rotY: 58, focusX: 0.22, focus: -0.25, fill: 2.2, light: 40 }],
        ]),
      },
    ],
  },
  {
    id: "pull-back-reveal",
    name: "Pull Back Reveal",
    description:
      "One take: opens so close you only see a corner of the screen, swings low round the other side, and pulls back to reveal the whole device.",
    shots: [
      {
        name: "Reveal",
        seconds: 10,
        journey: true,
        build: journey([
          [0, { rotY: 60, focusX: 0.14, focus: 0.24, fill: 2.5, light: 40 }],
          [
            0.5,
            {
              tilt: -18,
              rotY: -36,
              rotX: 16,
              focusX: -0.3,
              focus: 0.08,
              fill: 1.3,
              light: 0,
            },
          ],
          [
            1,
            {
              tilt: 0,
              rotY: 0,
              rotX: 0,
              focusX: 0,
              focus: 0,
              fill: 0.95,
              light: -30,
            },
          ],
        ]),
      },
    ],
  },
  {
    id: "edge-to-face",
    name: "Edge to Face",
    description:
      "One take: begins edge-on in near darkness, the lights and screen come up as it turns in close, then it settles facing the camera.",
    shots: [
      {
        name: "Turn in",
        seconds: 10,
        journey: true,
        build: journey([
          [
            0,
            {
              rotY: 88,
              rotX: -1,
              fill: 0.8,
              screen: 8,
              ambient: 6,
              light: -40,
            },
          ],
          [
            0.46,
            {
              rotY: 30,
              rotX: 7,
              focusX: 0.12,
              focus: -0.24,
              fill: 2.05,
              screen: 100,
              ambient: 25,
              light: 0,
            },
          ],
          [1, { rotY: 0, rotX: 0, focusX: 0, focus: 0, fill: 0.95, light: 30 }],
        ]),
      },
    ],
  },
  {
    id: "wake-loop",
    name: "Wake Loop",
    description:
      "One long take that loops: a dark screen facing you, the camera drifts in close as it lights up, then drifts back out as it dims.",
    shots: [
      {
        name: "Wake",
        seconds: 14,
        journey: true,
        build: journey([
          [0, { fill: 0.8, screen: 0, light: -30 }],
          [
            0.5,
            {
              rotY: 42,
              rotX: -9,
              focusX: 0.26,
              focus: -0.14,
              fill: 2.05,
              screen: 100,
              light: 20,
            },
          ],
          [
            1,
            {
              rotY: 0,
              rotX: 0,
              focusX: 0,
              focus: 0,
              fill: 0.8,
              screen: 0,
              light: -30,
            },
          ],
        ]),
      },
    ],
  },
  {
    id: "light-pulse",
    name: "Light Pulse",
    description:
      "Two tight corner shots that barely move while the lights and the screen swell up and fade away.",
    shots: [
      {
        name: "Corner",
        seconds: 4.8,
        crop: true,
        detail: true,
        build: journey(
          [
            [
              0,
              {
                rotY: 52,
                rotX: 13,
                focusX: 0.12,
                focus: -0.12,
                fill: 1.6,
                screen: 3,
                ambient: 3,
              },
            ],
            [0.5, { rotY: 55, rotX: 12, tilt: -4, screen: 100, ambient: 25 }],
            [1, { rotY: 58, rotX: 11, tilt: -8, screen: 5, ambient: 4 }],
          ],
          "easeInOut",
        ),
      },
      {
        name: "Other corner",
        seconds: 4.8,
        crop: true,
        detail: true,
        build: journey(
          [
            [
              0,
              {
                rotY: -48,
                rotX: 3,
                focusX: -0.1,
                focus: 0.2,
                fill: 1.9,
                screen: 0,
                ambient: 3,
              },
            ],
            [
              0.55,
              { tilt: -9, focusX: 0.06, fill: 2, screen: 100, ambient: 25 },
            ],
            [
              1,
              { tilt: -16, focusX: 0.16, fill: 2.08, screen: 10, ambient: 5 },
            ],
          ],
          "easeInOut",
        ),
      },
    ],
  },
  {
    id: "screen-pan",
    name: "Screen Pan",
    description:
      "One take, close in: the camera slides right across the screen from one side to the other, turning as it goes.",
    shots: [
      {
        name: "Pan",
        seconds: 8,
        crop: true,
        detail: true,
        build: journey([
          [0, { focusX: 0.55, focus: -0.2, fill: 1.75, light: 30 }],
          [
            0.4,
            {
              rotY: 28,
              rotX: -1,
              focusX: 0.4,
              focus: 0.14,
              fill: 1.7,
              light: 0,
            },
          ],
          [
            1,
            {
              rotY: -30,
              rotX: -2,
              focusX: -0.38,
              focus: 0.16,
              fill: 1.6,
              light: -40,
            },
          ],
        ]),
      },
    ],
  },
  {
    id: "corner-push",
    name: "Corner Push",
    description:
      "One long take that loops: from square on, a slow push down into one corner of the screen from above, and back out.",
    shots: [
      {
        name: "Push",
        seconds: 12,
        journey: true,
        build: journey([
          [0, { fill: 0.8, light: -20 }],
          [
            0.52,
            {
              rotX: 19,
              rotY: -23,
              focusX: -0.1,
              focus: -0.1,
              fill: 1.72,
              light: 25,
            },
          ],
          [1, { rotX: 0, rotY: 0, focusX: 0, focus: 0, fill: 0.8, light: -20 }],
        ]),
      },
    ],
  },
  {
    id: "scroll-through",
    name: "Scroll Through",
    description:
      "Four close passes down the screen from top to bottom, as if scrolling the content, then the whole device.",
    categories: ["Phones and tablets"],
    shots: [
      {
        name: "Top",
        seconds: 2.8,
        crop: true,
        detail: true,
        build: drift(
          { focus: 0.56, rotY: 8, rotX: 3, fill: 1.9, light: -20 },
          { focus: 0.34, rotY: 8, rotX: 3, fill: 1.9, light: 0 },
          "linear",
        ),
      },
      {
        name: "Middle",
        seconds: 2.8,
        crop: true,
        detail: true,
        build: drift(
          { focus: 0.14, rotY: -8, rotX: 2, fill: 1.9, light: 20 },
          { focus: -0.1, rotY: -8, rotX: 2, fill: 1.9, light: 0 },
          "linear",
        ),
      },
      {
        name: "Bottom",
        seconds: 2.8,
        crop: true,
        detail: true,
        build: drift(
          { focus: -0.3, rotY: 8, rotX: -2, fill: 1.9, light: -20 },
          { focus: -0.54, rotY: 8, rotX: -2, fill: 1.9, light: 0 },
          "linear",
        ),
      },
      {
        name: "Whole device",
        seconds: 4,
        build: drift(
          { rotY: 5, rotX: 2, fill: 0.72, light: -40 },
          { rotY: 1, rotX: 1, fill: 0.84, light: 30 },
          "easeOut",
        ),
      },
    ],
  },
  {
    id: "in-hand",
    name: "In Hand",
    description:
      "Tilted back the way a phone is held, drifting closer, then straightening to face the camera.",
    categories: ["Phones and tablets"],
    shots: [
      {
        name: "Held",
        seconds: 3.4,
        build: drift(
          { rotX: -20, rotZ: 7, rotY: 14, fill: 0.78, light: -30 },
          { rotX: -16, rotZ: 5, rotY: 9, fill: 0.84, light: 10 },
        ),
      },
      {
        name: "Closer",
        seconds: 3.2,
        crop: true,
        build: drift(
          { rotX: -14, rotZ: -5, rotY: -12, fill: 1.3, light: 30 },
          { rotX: -10, rotZ: -3, rotY: -8, fill: 1.38, light: -10 },
          "linear",
        ),
      },
      {
        name: "Face on",
        seconds: 4,
        build: drift(
          { rotX: -4, rotY: 4, fill: 0.86, light: -40 },
          { rotX: 0, rotY: 0, fill: 0.78, light: 30 },
          "easeOut",
        ),
      },
    ],
  },
  {
    id: "desk-hero",
    name: "Desk Hero",
    description:
      "Seen from above the desk, then close on the screen, then square on.",
    categories: ["Computers and displays", "Retro"],
    shots: [
      {
        name: "From above",
        seconds: 3.6,
        build: drift(
          { rotX: 20, rotY: -28, fill: 0.78, light: 30 },
          { rotX: 16, rotY: -20, fill: 0.84, light: -10 },
        ),
      },
      {
        name: "Screen",
        seconds: 3.4,
        crop: true,
        detail: true,
        build: drift(
          { focus: 0.34, rotX: 6, rotY: 10, fill: 1.45, light: -30 },
          { focus: 0.3, rotX: 4, rotY: 5, fill: 1.5, light: 15 },
          "linear",
        ),
      },
      {
        name: "Square on",
        seconds: 4,
        build: drift(
          { rotX: 8, rotY: 4, fill: 0.86, light: -50 },
          { rotX: 6, rotY: 0, fill: 0.78, light: 30 },
          "easeOut",
        ),
      },
    ],
  },
  {
    id: "profile-to-screen",
    name: "Profile to Screen",
    description:
      "Starts side-on to show how thin it is, swings to three-quarter, then lands close on the screen.",
    categories: ["Computers and displays", "Retro"],
    shots: [
      {
        name: "Profile",
        seconds: 3.2,
        build: drift(
          { rotY: 84, rotX: 4, fill: 0.8, light: -20 },
          { rotY: 74, rotX: 5, fill: 0.82, light: 20 },
          "linear",
        ),
      },
      {
        name: "Three-quarter",
        seconds: 3.4,
        build: drift(
          { rotY: 40, rotX: 10, fill: 0.8, light: 30 },
          { rotY: 30, rotX: 8, fill: 0.84, light: -10 },
        ),
      },
      {
        name: "Screen",
        seconds: 4,
        crop: true,
        detail: true,
        build: drift(
          { focus: 0.3, rotY: 8, rotX: 5, fill: 1.3, light: -30 },
          { focus: 0.3, rotY: 3, rotX: 4, fill: 1.4, light: 20 },
          "easeOut",
        ),
      },
    ],
  },
  {
    id: "wrist-turn",
    name: "Wrist Turn",
    description:
      "Close on the watch face, round to the crown side, then the whole watch at three-quarter.",
    categories: ["Wearables"],
    shots: [
      {
        name: "Face",
        seconds: 3.2,
        crop: true,
        build: drift(
          { rotY: 10, rotX: 4, fill: 1.5, light: -30 },
          { rotY: 4, rotX: 2, fill: 1.42, light: 10 },
          "linear",
        ),
      },
      {
        name: "Crown side",
        seconds: 3.2,
        build: drift(
          { rotY: -62, rotX: 6, fill: 0.84, light: 30 },
          { rotY: -50, rotX: 6, fill: 0.86, light: -10 },
          "linear",
        ),
      },
      {
        name: "Three-quarter",
        seconds: 4,
        build: drift(
          { rotY: 30, rotX: 10, fill: 0.84, light: -40 },
          { rotY: 20, rotX: 7, fill: 0.78, light: 30 },
          "easeOut",
        ),
      },
    ],
  },
  {
    id: "street-view",
    name: "Street View",
    description:
      "Looking up from the pavement, a walk past, then standing in front of it.",
    categories: ["Signage"],
    shots: [
      {
        name: "Looking up",
        seconds: 3.6,
        build: drift(
          { tilt: -22, rotY: -30, lens: 0, fill: 0.8, light: 30 },
          { tilt: -18, rotY: -22, lens: 0, fill: 0.84, light: 0 },
        ),
      },
      {
        name: "Walking past",
        seconds: 3.4,
        build: drift(
          { rotY: 34, rotX: 2, fill: 0.84, light: -30 },
          { rotY: 20, rotX: 2, fill: 0.86, light: 10 },
          "linear",
        ),
      },
      {
        name: "In front",
        seconds: 4,
        build: drift(
          { rotY: 6, fill: 0.86, light: -40 },
          { rotY: 0, fill: 0.78, light: 30 },
          "easeOut",
        ),
      },
    ],
  },
  {
    id: "all-sides",
    name: "All Sides",
    description:
      "One shot for each of the three faces, turning the same way each time.",
    ids: ["three-sided-sign"],
    shots: [
      {
        name: "First face",
        seconds: 3.4,
        build: drift(
          { rotY: 14, rotX: 4, fill: 0.82, light: -30 },
          { rotY: 2, rotX: 4, fill: 0.84, light: 0 },
          "linear",
        ),
      },
      {
        name: "Second face",
        seconds: 3.4,
        build: drift(
          { rotY: 134, rotX: 4, fill: 0.82, light: 0 },
          { rotY: 122, rotX: 4, fill: 0.84, light: 30 },
          "linear",
        ),
      },
      {
        name: "Third face",
        seconds: 3.8,
        build: drift(
          { rotY: -106, rotX: 4, fill: 0.82, light: 30 },
          { rotY: -118, rotX: 4, fill: 0.84, light: 60 },
          "easeOut",
        ),
      },
    ],
  },
  {
    id: "screen-showcase",
    name: "Screen Showcase",
    description:
      "Close on the top of the screen drifting down, cut to the bottom drifting up, then the whole device. Built to show off what is on the screen.",
    shots: [
      {
        name: "Top of screen",
        seconds: 3.6,
        crop: true,
        detail: true,
        build: drift(
          { focus: 0.46, rotY: 10, rotX: 4, fill: 1.7, light: -30 },
          { focus: 0.36, rotY: 7, rotX: 3, fill: 1.7, light: 10 },
          "linear",
        ),
      },
      {
        name: "Bottom of screen",
        seconds: 3.6,
        crop: true,
        detail: true,
        build: drift(
          { focus: -0.46, rotY: -10, rotX: -3, fill: 1.7, light: 25 },
          { focus: -0.36, rotY: -7, rotX: -2, fill: 1.7, light: -10 },
          "linear",
        ),
      },
      {
        name: "Whole device",
        seconds: 4.4,
        build: drift(
          { rotY: 6, rotX: 3, fill: 0.74, light: -50 },
          { rotY: 2, rotX: 1, fill: 0.84, light: 40 },
          "easeOut",
        ),
      },
    ],
  },
  {
    id: "dark-reveal",
    name: "Dark Reveal",
    description:
      "The screen starts dimmed while a light travels over the device, brightens close up, then the camera pulls back.",
    shots: [
      {
        name: "Dimmed",
        seconds: 3.6,
        build: drift(
          { screen: 22, rotY: -26, rotX: 8, fill: 0.8, light: -90 },
          { screen: 30, rotY: -20, rotX: 6, fill: 0.84, light: 40 },
          "linear",
        ),
      },
      {
        name: "Brighten",
        seconds: 3.2,
        crop: true,
        build: drift(
          { screen: 30, rotY: 14, rotX: 5, fill: 1.4, light: 30 },
          { screen: 100, rotY: 9, rotX: 4, fill: 1.32, light: -10 },
          "easeOut",
        ),
      },
      {
        name: "Pull back",
        seconds: 4.2,
        build: drift(
          { rotY: 6, rotX: 3, fill: 0.86, light: -40 },
          { rotY: 2, rotX: 1, fill: 0.76, light: 30 },
          "easeOut",
        ),
      },
    ],
  },
  {
    id: "studio-turn",
    name: "Studio Turn",
    description:
      "A three-quarter view from the right, a low angle from the left, then the device settles square to the camera.",
    shots: [
      {
        name: "Three-quarter",
        seconds: 3.4,
        build: drift(
          { rotY: 38, rotX: 6, fill: 0.8, light: -30 },
          { rotY: 30, rotX: 4, fill: 0.84, light: 10 },
        ),
      },
      {
        name: "Low angle",
        seconds: 3.4,
        build: drift(
          { rotY: -24, rotX: -10, fill: 0.82, light: 30 },
          { rotY: -18, rotX: -13, fill: 0.86, light: -15 },
        ),
      },
      {
        name: "Settle",
        seconds: 3.8,
        build: drift(
          { rotY: 8, rotX: 3, fill: 0.78, light: -60 },
          { rotY: 4, rotX: 2, fill: 0.74, light: 40 },
          "easeOut",
        ),
      },
    ],
  },
  {
    id: "screen-first",
    name: "Screen First",
    description:
      "Opens tight on the screen, cuts wide to show the whole device, then goes close again from the other side.",
    shots: [
      {
        name: "Close",
        seconds: 3.2,
        crop: true,
        build: drift(
          { rotY: 18, rotX: 8, fill: 1.35, light: -40 },
          { rotY: 12, rotX: 5, fill: 1.25, light: 20 },
          "linear",
        ),
      },
      {
        name: "Wide",
        seconds: 3.6,
        build: drift(
          { rotY: -30, rotX: 10, fill: 0.76, light: 30 },
          { rotY: -24, rotX: 7, fill: 0.8, light: -10 },
        ),
      },
      {
        name: "Close again",
        seconds: 3.6,
        crop: true,
        build: drift(
          { rotY: -14, rotX: -6, fill: 1.3, light: -30 },
          { rotY: -8, rotX: -4, fill: 1.42, light: 25 },
          "linear",
        ),
      },
    ],
  },
  {
    id: "slow-orbit",
    name: "Slow Orbit",
    description:
      "Left, front, right. Every shot keeps turning the same way, so the cuts read as one long move around the device.",
    shots: [
      {
        name: "Left",
        seconds: 3.4,
        build: drift(
          { rotY: -40, rotX: 5, fill: 0.78, light: 20 },
          { rotY: -30, rotX: 5, fill: 0.8, light: -5 },
          "linear",
        ),
      },
      {
        name: "Front",
        seconds: 3.4,
        build: drift(
          { rotY: -8, rotX: 3, fill: 0.84, light: 0 },
          { rotY: 4, rotX: 3, fill: 0.86, light: -25 },
          "linear",
        ),
      },
      {
        name: "Right",
        seconds: 3.8,
        build: drift(
          { rotY: 24, rotX: 5, fill: 0.8, light: -20 },
          { rotY: 34, rotX: 5, fill: 0.76, light: -50 },
          "easeOut",
        ),
      },
    ],
  },
  {
    id: "around-the-back",
    name: "Around the Back",
    description:
      "Starts on the back of the device, cuts to its edge, then lands on the screen.",
    shots: [
      {
        name: "Back",
        seconds: 3.4,
        build: drift(
          { rotY: 150, rotX: 6, fill: 0.8, light: -30 },
          { rotY: 162, rotX: 4, fill: 0.84, light: 20 },
          "linear",
        ),
      },
      {
        name: "Edge",
        seconds: 3.2,
        build: drift(
          { rotY: 84, rotX: 2, fill: 0.82, light: 30 },
          { rotY: 72, rotX: 2, fill: 0.8, light: 0 },
          "linear",
        ),
      },
      {
        name: "Screen",
        seconds: 4,
        build: drift(
          { rotY: 28, rotX: 6, fill: 0.8, light: -40 },
          { rotY: 18, rotX: 4, fill: 0.86, light: 10 },
          "easeOut",
        ),
      },
    ],
  },
  {
    id: "low-hero",
    name: "Low Hero",
    description:
      "Wide-lens shots from below that make the device feel big, finishing level and square on.",
    shots: [
      {
        name: "From below left",
        seconds: 3.4,
        build: drift(
          { tilt: -18, rotY: -26, lens: 0, fill: 0.84, light: 30 },
          { tilt: -14, rotY: -18, lens: 0, fill: 0.88, light: 0 },
        ),
      },
      {
        name: "From below right",
        seconds: 3.4,
        build: drift(
          { tilt: -14, rotY: 26, lens: 0, fill: 0.86, light: -30 },
          { tilt: -10, rotY: 18, lens: 0, fill: 0.82, light: 5 },
        ),
      },
      {
        name: "Square on",
        seconds: 3.8,
        build: drift(
          { rotX: -4, fill: 0.8, light: -60 },
          { rotX: 0, fill: 0.76, light: 40 },
          "easeOut",
        ),
      },
    ],
  },
  {
    id: "overhead",
    name: "Overhead",
    description:
      "Looks down on the device lying at an angle, drops in close from above, then lifts to a three-quarter view.",
    shots: [
      {
        name: "Top down",
        seconds: 3.4,
        build: drift(
          { rotX: 55, rotZ: -16, fill: 0.78, light: 20 },
          { rotX: 48, rotZ: -10, fill: 0.82, light: -15 },
          "linear",
        ),
      },
      {
        name: "Top down close",
        seconds: 3.2,
        crop: true,
        build: drift(
          { rotX: 40, rotZ: 12, fill: 1.25, light: -30 },
          { rotX: 34, rotZ: 8, fill: 1.35, light: 5 },
          "linear",
        ),
      },
      {
        name: "Lift",
        seconds: 4,
        build: drift(
          { rotX: 14, rotY: -22, fill: 0.8, light: 30 },
          { rotX: 8, rotY: -16, fill: 0.76, light: -20 },
          "easeOut",
        ),
      },
    ],
  },
  {
    id: "macro-study",
    name: "Macro Study",
    description:
      "Two very close, slightly tilted studies of the screen, then a pull back that reveals the whole device.",
    shots: [
      {
        name: "Macro left",
        seconds: 3.2,
        crop: true,
        build: drift(
          { rotY: 24, rotX: 12, rotZ: -8, fill: 1.5, light: -20 },
          { rotY: 18, rotX: 8, rotZ: -5, fill: 1.4, light: 20 },
          "linear",
        ),
      },
      {
        name: "Macro right",
        seconds: 3.2,
        crop: true,
        build: drift(
          { rotY: -22, rotX: -8, rotZ: 6, fill: 1.45, light: 40 },
          { rotY: -16, rotX: -5, rotZ: 4, fill: 1.55, light: 0 },
          "linear",
        ),
      },
      {
        name: "Reveal",
        seconds: 4,
        build: drift(
          { rotY: 10, rotX: 4, fill: 0.76, light: -40 },
          { rotY: 4, rotX: 2, fill: 0.72, light: 10 },
          "easeOut",
        ),
      },
    ],
  },
  {
    id: "keynote",
    name: "Keynote",
    description:
      "Four shots: a flat front push, a three-quarter from the left, a close-up from the right, then a slow pull back.",
    shots: [
      {
        name: "Front",
        seconds: 2.8,
        build: drift(
          { fill: 0.72, light: -40 },
          { fill: 0.8, light: 0 },
          "linear",
        ),
      },
      {
        name: "Left",
        seconds: 2.8,
        build: drift(
          { rotY: -34, rotX: 8, fill: 0.82, light: 20 },
          { rotY: -26, rotX: 6, fill: 0.86, light: -10 },
          "linear",
        ),
      },
      {
        name: "Right close",
        seconds: 2.8,
        crop: true,
        build: drift(
          { rotY: 30, rotX: -8, fill: 1.25, light: -20 },
          { rotY: 24, rotX: -6, fill: 1.35, light: 15 },
          "linear",
        ),
      },
      {
        name: "Pull back",
        seconds: 3.8,
        build: drift(
          { rotY: 12, rotX: 4, fill: 0.84, light: 30 },
          { rotY: 6, rotX: 2, fill: 0.74, light: -20 },
          "easeOut",
        ),
      },
    ],
  },
  {
    id: "lean-in",
    name: "Lean In",
    description:
      "Each cut gets closer: a wide shot from a little above, a mid shot, then a tight crop into the screen.",
    shots: [
      {
        name: "Wide",
        seconds: 3.4,
        build: drift(
          { rotX: 10, rotY: -12, fill: 0.72, light: -30 },
          { rotX: 8, rotY: -8, fill: 0.76, light: 10 },
        ),
      },
      {
        name: "Mid",
        seconds: 3.4,
        build: drift(
          { rotX: 8, rotY: 16, fill: 0.84, light: 30 },
          { rotX: 6, rotY: 22, fill: 0.88, light: -10 },
        ),
      },
      {
        name: "Tight",
        seconds: 3.8,
        crop: true,
        build: drift(
          { rotX: 6, rotY: 10, fill: 1.3, light: -40 },
          { rotX: 4, rotY: 6, fill: 1.45, light: 20 },
          "easeOut",
        ),
      },
    ],
  },
  {
    id: "edge-and-face",
    name: "Edge and Face",
    description:
      "Opens nearly edge on, cuts to the opposite three-quarter, then finishes dead front and close.",
    shots: [
      {
        name: "Edge",
        seconds: 3.2,
        build: drift(
          { rotY: -78, rotX: 4, fill: 0.8, light: 40 },
          { rotY: -68, rotX: 4, fill: 0.82, light: 0 },
          "linear",
        ),
      },
      {
        name: "Three-quarter",
        seconds: 3.4,
        build: drift(
          { rotY: 40, rotX: 8, fill: 0.78, light: -30 },
          { rotY: 32, rotX: 5, fill: 0.84, light: 15 },
        ),
      },
      {
        name: "Front close",
        seconds: 3.8,
        crop: true,
        build: drift(
          { fill: 1.2, light: -50 },
          { fill: 1.32, light: 30 },
          "easeOut",
        ),
      },
    ],
  },
  {
    id: "lid-open",
    name: "Lid Open",
    description:
      "Starts shut under a moving light, opens in one slow motion, then settles on the screen.",
    requires: "lid",
    shots: [
      {
        name: "Shut",
        seconds: 2.8,
        build: drift(
          { lid: 0, rotX: 30, rotY: 28, fill: 0.86, light: -60 },
          { lid: 0, rotX: 26, rotY: 22, fill: 0.88, light: 20 },
          "linear",
        ),
      },
      {
        name: "Opening",
        seconds: 4.2,
        build: drift(
          { lid: 2, rotX: 12, rotY: -22, fill: 0.8, light: 20 },
          { lid: 100, rotX: 8, rotY: -16, fill: 0.82, light: -10 },
          "easeInOutQuint",
        ),
      },
      {
        name: "Screen",
        seconds: 3.6,
        build: drift(
          { rotY: 10, rotX: 4, fill: 0.84, light: -30 },
          { rotY: 6, rotX: 3, fill: 0.88, light: 15 },
          "easeOut",
        ),
      },
    ],
  },
  {
    id: "lid-close",
    name: "Lid Close",
    description:
      "The lid lowers gently until it is shut, then the light crosses the closed laptop from above.",
    requires: "lid",
    shots: [
      {
        name: "Closing",
        seconds: 4.2,
        build: drift(
          { lid: 100, rotY: -24, rotX: 10, fill: 0.8, light: -10 },
          { lid: 0, rotY: -18, rotX: 14, fill: 0.82, light: 25 },
          "easeInOutQuint",
        ),
      },
      {
        name: "Shut",
        seconds: 3.2,
        build: drift(
          { lid: 0, rotX: 32, rotY: 20, fill: 0.86, light: -40 },
          { lid: 0, rotX: 28, rotY: 26, fill: 0.88, light: 30 },
          "linear",
        ),
      },
    ],
  },
  {
    id: "light-sweep",
    name: "Light Sweep",
    description:
      "One shot: the device barely moves while the light travels right across it.",
    shots: [
      {
        name: "Sweep",
        seconds: 4,
        build: drift(
          { rotY: 22, rotX: 7, fill: 0.8, light: -90 },
          { rotY: 18, rotX: 7, fill: 0.82, light: 70 },
        ),
      },
    ],
  },
  {
    id: "gentle-push",
    name: "Gentle Push",
    description:
      "One shot: a slow move in while the device squares up slightly.",
    shots: [
      {
        name: "Push",
        seconds: 4,
        build: drift(
          { rotY: 14, rotX: 5, fill: 0.74, light: -20 },
          { rotY: 8, rotX: 3, fill: 0.86, light: 10 },
          "easeOut",
        ),
      },
    ],
  },
  // ---- Signage: for billboards and street lightboxes, shot like a location crew would ----
  {
    id: "drive-by",
    name: "Drive By",
    description: "",
    ids: ["metal-billboard", "v-billboard"],
    shots: [
      {
        name: "Drive",
        seconds: 10,
        journey: true,
        build: journey(
          [
            [0, { rotY: 58, tilt: -10, fill: 1.1, dof: 40, focusX: 0.3 }],
            [0.5, { rotY: 10, fill: 1.35, focusX: 0 }],
            [1, { rotY: -40, fill: 1.15, focusX: -0.3 }],
          ],
          "linear",
        ),
      },
    ],
  },
  {
    id: "look-up",
    name: "Look Up",
    description: "",
    categories: ["Signage"],
    shots: [
      {
        name: "Up",
        seconds: 9,
        journey: true,
        build: journey([
          [0, { tilt: -24, rotY: -18, fill: 0.9, lens: 0 }],
          [0.55, { tilt: -14, rotY: -6, fill: 1.5, lens: 20 }],
          [1, { tilt: -8, rotY: 0, fill: 1.9, lens: 40, dof: 50 }],
        ]),
      },
    ],
  },
  {
    id: "flip-sides",
    name: "Flip Sides",
    description: "",
    ids: ["v-billboard"],
    shots: [
      {
        name: "Flip",
        seconds: 10,
        journey: true,
        build: journey([
          [0, { rotY: -35, rotX: 2, fill: 1.2 }],
          [0.5, { rotY: 90, fill: 1 }],
          [1, { rotY: 215, fill: 1.2 }],
        ]),
      },
    ],
  },
  {
    id: "round-three",
    name: "Round Three",
    description: "",
    ids: ["three-sided-sign"],
    shots: [
      {
        name: "Round",
        seconds: 12,
        journey: true,
        build: journey(
          [
            [0, { rotY: 0, rotX: 3, fill: 0.9 }],
            [1, { rotY: 360, rotX: 3, fill: 0.9 }],
          ],
          "linear",
        ),
      },
    ],
  },
  {
    id: "walk-past",
    name: "Walk Past",
    description: "",
    ids: ["sign-1", "sign-2", "sign-3", "sign-4", "billboard", "framed-poster"],
    shots: [
      {
        name: "Walk",
        seconds: 8,
        journey: true,
        build: journey(
          [
            [0, { rotY: 40, fill: 1.3, focusX: 0.35, focus: 0.1, dof: 55 }],
            [1, { rotY: -40, focusX: -0.35 }],
          ],
          "linear",
        ),
      },
    ],
  },
  {
    id: "night-wake",
    name: "Night Wake",
    description: "",
    categories: ["Signage"],
    shots: [
      {
        name: "Wake",
        seconds: 8,
        journey: true,
        build: journey([
          [0, { lamps: 8, screen: 0, glow: 0, fill: 0.95, rotY: 12 }],
          [0.25, { screen: 100, glow: 60 }],
          [0.6, { lamps: 35, rotY: -6, fill: 1.2 }],
          [1, { lamps: 70, glow: 30, rotY: -14, fill: 1.25 }],
        ]),
      },
    ],
  },
  {
    id: "campaign-cut",
    name: "Campaign Cut",
    description: "",
    categories: ["Signage"],
    shots: [
      {
        name: "From the street",
        seconds: 4,
        build: drift(
          { tilt: -20, rotY: -30, fill: 0.85, lens: 0 },
          { tilt: -18, rotY: -22, fill: 0.88, lens: 0 },
          "linear",
        ),
      },
      {
        name: "Across the face",
        seconds: 3.5,
        crop: true,
        detail: true,
        build: journey(
          [
            [0, { rotY: 8, fill: 2, focusX: 0.3, dof: 60 }],
            [1, { focusX: -0.3 }],
          ],
          "linear",
        ),
      },
      {
        name: "Settle",
        seconds: 4,
        build: journey([
          [0, { rotY: 28, fill: 0.9, lamps: 100 }],
          [0.7, { rotY: 16, lamps: 100, screen: 100 }],
          [1, { rotY: 14, lamps: 0, screen: 0 }],
        ]),
      },
    ],
  },
  // ---- Simple: one quiet move each, five seconds, ending where it started so it loops ----
  {
    id: "slow-turn",
    name: "Slow Turn",
    description: "",
    shots: [
      {
        name: "Turn",
        seconds: 6,
        build: journey(
          [
            [0, { rotY: -14 }],
            [0.5, { rotY: 14 }],
            [1, { rotY: -14 }],
          ],
          "easeInOut",
        ),
      },
    ],
  },
  {
    id: "nod",
    name: "Nod",
    description: "",
    shots: [
      {
        name: "Nod",
        seconds: 6,
        build: journey(
          [
            [0, { rotX: -8 }],
            [0.5, { rotX: 8 }],
            [1, { rotX: -8 }],
          ],
          "easeInOut",
        ),
      },
    ],
  },
  {
    id: "rock",
    name: "Rock",
    description: "",
    shots: [
      {
        name: "Rock",
        seconds: 6,
        build: journey(
          [
            [0, { rotZ: -4, rotY: -6 }],
            [0.5, { rotZ: 4, rotY: 6 }],
            [1, { rotZ: -4, rotY: -6 }],
          ],
          "easeInOut",
        ),
      },
    ],
  },
  {
    id: "breathe",
    name: "Breathe",
    description: "",
    shots: [
      {
        name: "Breathe",
        seconds: 6,
        build: journey(
          [
            [0, { fill: 0.78 }],
            [0.5, { fill: 0.9 }],
            [1, { fill: 0.78 }],
          ],
          "easeInOut",
        ),
      },
    ],
  },
  {
    id: "push-in",
    name: "Push In",
    description: "",
    shots: [
      {
        name: "Push",
        seconds: 5,
        journey: true,
        build: drift({ fill: 0.76 }, { fill: 1.15 }, "easeInOut"),
      },
    ],
  },
  {
    id: "pull-out",
    name: "Pull Out",
    description: "",
    shots: [
      {
        name: "Pull",
        seconds: 5,
        journey: true,
        build: drift({ fill: 1.15 }, { fill: 0.76 }, "easeInOut"),
      },
    ],
  },
  {
    id: "drift-up",
    name: "Drift Up",
    description: "",
    shots: [
      {
        name: "Drift",
        seconds: 6,
        build: drift({ y: -4, rotX: -3 }, { y: 4, rotX: 3 }, "easeInOut"),
      },
    ],
  },
  {
    id: "pan-across",
    name: "Pan Across",
    description: "",
    shots: [
      {
        name: "Pan",
        seconds: 6,
        build: drift({ x: -6, rotY: 8 }, { x: 6, rotY: -8 }, "easeInOut"),
      },
    ],
  },
  {
    id: "fade-up",
    name: "Fade Up",
    description: "",
    shots: [
      {
        name: "Fade",
        seconds: 4,
        build: journey(
          [
            [0, { screen: 0, lamps: 0 }],
            [0.45, { screen: 100, lamps: 100 }],
            [1, { screen: 100, lamps: 100 }],
          ],
          "easeInOut",
        ),
      },
    ],
  },
  {
    id: "fade-down",
    name: "Fade Down",
    description: "",
    shots: [
      {
        name: "Fade",
        seconds: 4,
        build: journey(
          [
            [0, { screen: 100, lamps: 100 }],
            [0.55, { screen: 100, lamps: 100 }],
            [1, { screen: 0, lamps: 0 }],
          ],
          "easeInOut",
        ),
      },
    ],
  },
  {
    id: "lamps-pass",
    name: "Lamps Pass",
    description: "",
    shots: [
      {
        name: "Pass",
        seconds: 6,
        build: journey(
          [
            [0, { light: -60 }],
            [0.5, { light: 60 }],
            [1, { light: -60 }],
          ],
          "easeInOut",
        ),
      },
    ],
  },
];

/** Whether a preset is meant for a device. */
export function presetSuits(
  preset: AnimationPreset,
  device: DeviceDef,
): boolean {
  if (preset.requires === "lid" && !device.lid) return false;
  if (preset.ids) return preset.ids.includes(device.id);
  if (preset.categories) return preset.categories.includes(device.category);
  return true;
}

/** Whether a preset was written for particular devices rather than for all of them. */
export function isTailored(preset: AnimationPreset): boolean {
  return (
    preset.ids !== undefined ||
    preset.categories !== undefined ||
    preset.requires !== undefined
  );
}
