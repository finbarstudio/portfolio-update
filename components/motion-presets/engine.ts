/**
 * Motion presets: where every card sits at every moment.
 *
 * A layout places item i of n at loop position T. T runs from 0 to `speed`
 * and lands on a whole number at the loop point, which is what makes every
 * preset loop without a jump. Nothing here touches the DOM or WebGL.
 */

export const TAU = Math.PI * 2;
export const DEG = Math.PI / 180;
/** Camera distance at which a card 2 units tall fills the frame. */
export const CAM_Z = 1 / Math.tan((35 * DEG) / 2);

export const clamp = (x: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const mod = (a: number, n: number) => ((a % n) + n) % n;
/** Wraps into -n/2..n/2. */
const centred = (a: number, n: number) => mod(a + n / 2, n) - n / 2;
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const smooth = (x: number) => {
  const t = clamp(x);
  return t * t * (3 - 2 * t);
};
/** Fades items out as they reach the wrap point of a looping row. */
const edgeFade = (c: number, n: number, width = 1) => clamp((n / 2 - Math.abs(c)) / width);
const hash = (i: number, salt: number) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** A move that settles like a spring: 0 to 1, overshooting by up to 25% at full bounce. */
export function spring(x: number, bounce: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const damping = 7;
  const frequency = bounce > 0.01 ? (damping * Math.PI) / Math.log(1 / (bounce * 0.25)) : 1e-4;
  const at = (t: number) =>
    1 - Math.exp(-damping * t) * (Math.cos(frequency * t) + (damping / frequency) * Math.sin(frequency * t));
  return at(x) + (1 - at(1)) * x;
}

export type LayoutName =
  | "slide"
  | "cover"
  | "ring"
  | "orbit"
  | "deck"
  | "wheel"
  | "grid"
  | "marquee"
  | "helix"
  | "globe"
  | "flip"
  | "tunnel"
  | "fan"
  | "wave"
  | "stairs"
  | "float"
  | "pulse";

/** What makes one preset of a layout differ from the next. */
export interface Variant {
  focus?: boolean;
  vertical?: boolean;
  inside?: boolean;
  two?: boolean;
  flat?: boolean;
  fly?: "up" | "right" | "spin";
  side?: boolean;
  full?: boolean;
  pan?: "x" | "diag" | "alt" | "pulse";
  rows?: number;
  horizontal?: boolean;
  tornado?: boolean;
  close?: boolean;
  axis?: "x" | "y";
  cube?: boolean;
  spiral?: boolean;
  sides?: boolean;
  sway?: boolean;
  open?: boolean;
  ribbon?: boolean;
  drift?: boolean;
}

/** The sliders that describe motion. Each preset has its own defaults. */
export interface Motion {
  speed: number;
  count: number;
  size: number;
  gap: number;
  tilt: number;
  rhythm: number;
  stagger: number;
  bounce: number;
}
export type MotionKey = keyof Motion;

export interface Preset {
  name: string;
  layout: LayoutName;
  variant: Variant;
  defaults: Partial<Motion>;
  /** Fixed camera angles, in degrees. */
  roll?: number;
  yaw?: number;
}

export interface Transform {
  x?: number;
  y?: number;
  z?: number;
  rx?: number;
  ry?: number;
  rz?: number;
  /** scale */
  s?: number;
  /** opacity */
  a?: number;
}

export interface Context {
  n: number;
  T: number;
  w: number;
  h: number;
  /** gap between cards */
  g: number;
  /** frame aspect, width over height */
  A: number;
  v: Variant;
  spring: (x: number) => number;
}

const ringRadius = (c: Context) =>
  c.v.inside ? Math.max(2.4, ((c.w + c.g) * c.n) / TAU) : Math.max(c.w * 1.1, ((c.w + c.g) * c.n) / TAU);
const gridCols = (n: number) => Math.ceil(Math.sqrt(n));
const GOLDEN_ANGLE = 2.39996323;

const layouts: Record<LayoutName, (i: number, c: Context) => Transform | null> = {
  slide(i, c) {
    const p = centred(i - c.T * c.n, c.n);
    const s = c.v.focus ? 1 - 0.3 * Math.min(1, Math.abs(p)) : 1;
    const a = edgeFade(p, c.n);
    return c.v.vertical ? { y: -p * (c.h + c.g), s, a } : { x: p * (c.w + c.g), s, a };
  },
  cover(i, c) {
    const p = centred(i - c.T * c.n, c.n);
    const d = Math.min(1, Math.abs(p));
    const side = Math.sign(p);
    return {
      x: side * (d * c.w * 0.75 + Math.max(0, Math.abs(p) - 1) * (c.w * 0.3 + c.g)),
      z: -d * c.w * 0.6 - Math.abs(p) * 0.02,
      ry: -side * d * 65 * DEG,
      a: edgeFade(p, c.n),
    };
  },
  ring(i, c) {
    const angle = TAU * (i / c.n + c.T);
    const R = ringRadius(c);
    if (c.v.vertical) return { y: Math.sin(angle) * R, z: Math.cos(angle) * R, rx: -angle };
    if (c.v.inside) return { x: Math.sin(angle) * R, z: Math.cos(angle) * R, ry: angle + Math.PI };
    return { x: Math.sin(angle) * R, z: Math.cos(angle) * R, ry: angle };
  },
  orbit(i, c) {
    if (i === 0) return { s: 1.15 };
    const k = i - 1;
    const m = c.n - 1;
    if (c.v.flat) {
      const angle = TAU * (k / m + c.T);
      return { x: Math.cos(angle) * Math.min(c.A, 1) * 0.78, y: Math.sin(angle) * 0.78, z: -0.05, s: 0.38 };
    }
    const outer = Boolean(c.v.two) && k % 2 === 1;
    const angle = TAU * (k / m + (outer ? -c.T : c.T));
    const R = (outer ? 1.75 : 1.2) + c.g;
    const y = c.v.two ? (outer ? 0.28 : -0.28) : 0;
    return { x: Math.cos(angle) * R, y, z: Math.sin(angle) * R, s: 0.42 };
  },
  deck(i, c) {
    const q = mod(i - c.T * c.n, c.n);
    // The front card leaves, travels to the back, and rejoins the stack.
    const leaving = q > c.n - 1 ? c.n - q : 0;
    const slot = leaving ? lerp(0, c.n - 1, ease(leaving)) : q;
    const lift = Math.sin(Math.PI * leaving);
    const out: Transform = {
      x: slot * c.g * 0.25,
      y: slot * c.g * 0.2,
      z: -slot * 0.12,
      s: 1 - slot * 0.04,
      a: 1 - clamp((slot - 6) / 2),
    };
    if (c.v.fly === "up") out.y = (out.y ?? 0) + lift * c.h * 1.15;
    if (c.v.fly === "right") {
      out.x = (out.x ?? 0) + lift * c.w * 1.25;
      out.rz = -lift * 0.3;
    }
    if (c.v.fly === "spin") {
      out.x = (out.x ?? 0) - lift * c.w * 1.1;
      out.rz = lift * 0.6;
      out.ry = lift * 0.8;
    }
    return out;
  },
  wheel(i, c) {
    const angle = TAU * (i / c.n + c.T);
    if (c.v.full) {
      const R = 0.68 * Math.min(1, c.A);
      return { x: Math.sin(angle) * R, y: Math.cos(angle) * R, rz: -angle };
    }
    const R = Math.max(1.6, ((c.w + c.g) * c.n) / TAU);
    if (c.v.side) return { x: Math.cos(angle) * R - R, y: Math.sin(angle) * R, rz: angle };
    return { x: Math.sin(angle) * R, y: Math.cos(angle) * R - R, rz: -angle };
  },
  grid(i, c) {
    const cols = gridCols(c.n);
    const rows = Math.ceil(c.n / cols);
    const col = i % cols;
    const row = Math.floor(i / cols);
    let px = col - (cols - 1) / 2;
    let py = row - (rows - 1) / 2;
    let s = 1;
    let a = 1;
    if (c.v.pan === "x" || c.v.pan === "diag") {
      px = centred(col - c.T * cols, cols);
      a *= edgeFade(px, cols, 0.5);
    }
    if (c.v.pan === "diag") {
      py = centred(row + c.T * rows, rows);
      a *= edgeFade(py, rows, 0.5);
    }
    if (c.v.pan === "alt") {
      py = centred(row + (col % 2 ? 1 : -1) * c.T * rows, rows);
      a *= edgeFade(py, rows, 0.5);
    }
    if (c.v.pan === "pulse") s = 0.82 + 0.18 * Math.sin(TAU * (c.T + (col + row) / 6));
    return { x: px * (c.w + c.g), y: -py * (c.h + c.g), s, a };
  },
  marquee(i, c) {
    const rows = c.v.rows ?? 2;
    const cols = Math.ceil(c.n / rows);
    const row = i % rows;
    const col = Math.floor(i / rows);
    const along = centred(col + (row % 2 ? 1 : -1) * c.T * cols + row * 0.5, cols);
    const across = row - (rows - 1) / 2;
    const a = edgeFade(along, cols, 0.5);
    return c.v.vertical
      ? { x: across * (c.w + c.g), y: along * (c.h + c.g), a }
      : { x: along * (c.w + c.g), y: -across * (c.h + c.g), a };
  },
  helix(i, c) {
    const p = mod(i / c.n + c.T, 1);
    const angle = TAU * 2 * p + TAU * c.T;
    const R = c.v.tornado ? lerp(0.25, 1.5, p) : 0.95;
    const a = smooth(p / 0.12) * smooth((1 - p) / 0.12);
    if (c.v.horizontal) {
      return { x: (p - 0.5) * 2.6 * Math.max(1, c.A), y: Math.sin(angle) * R, z: Math.cos(angle) * R, rx: -angle, a };
    }
    return { x: Math.sin(angle) * R, y: (p - 0.5) * 2.8, z: Math.cos(angle) * R, ry: angle, a };
  },
  globe(i, c) {
    const y = 1 - (2 * (i + 0.5)) / c.n;
    const r = Math.sqrt(1 - y * y);
    const theta = i * GOLDEN_ANGLE + TAU * c.T;
    const R = c.v.close ? 1.7 : 1.05;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    return { x: x * R, y: y * R, z: z * R, ry: Math.atan2(x, z), rx: -Math.asin(y) };
  },
  flip(i, c) {
    const v = c.T * c.n;
    const k = Math.floor(v);
    const f = c.spring(clamp((v - k) / 0.6));
    const current = i === mod(k, c.n);
    const next = i === mod(k + 1, c.n);
    if (c.v.cube) {
      if (!current && !next) return null;
      const face = (current ? 0 : Math.PI / 2) - (f * Math.PI) / 2;
      return { x: (Math.sin(face) * c.w) / 2, z: (Math.cos(face) * c.w) / 2 - c.w / 2, ry: face };
    }
    let turn: number;
    if (current && f < 0.5) turn = f * Math.PI;
    else if (next && f >= 0.5) turn = (f - 1) * Math.PI;
    else return null;
    const z = -Math.sin(Math.PI * f) * 0.5;
    return c.v.axis === "x" ? { z, rx: turn } : { z, ry: turn };
  },
  tunnel(i, c) {
    const p = mod(i / c.n + c.T, 1);
    const z = lerp(-11, CAM_Z - 0.4, p);
    const a = smooth(p / 0.15) * smooth((1 - p) / 0.1);
    if (c.v.sides) {
      const side = i % 2 ? 1 : -1;
      return { z, a, x: side * (0.55 * c.A + c.w * 0.35), ry: -side * 50 * DEG };
    }
    const angle = c.v.spiral ? TAU * 2 * p : i * GOLDEN_ANGLE;
    return { z, a, x: Math.cos(angle) * 0.7 * Math.min(1.4, c.A), y: Math.sin(angle) * 0.7 };
  },
  fan(i, c) {
    const breathing = c.v.open ? 0.55 + 0.45 * Math.sin(TAU * c.T - Math.PI / 2) : 1;
    const spread = Math.min(0.2 + c.g, 2.4 / c.n) * breathing;
    const angle = (i - (c.n - 1) / 2) * spread + (c.v.sway ? 0.25 * Math.sin(TAU * c.T) : 0);
    const R = 2.2;
    return { x: Math.sin(angle) * R, y: Math.cos(angle) * R - R - 0.1, z: i * 0.01, rz: -angle };
  },
  wave(i, c) {
    const p = centred(i - c.T * c.n, c.n);
    const phase = (TAU * p * Math.max(1, Math.round(c.n / 6))) / c.n;
    const a = edgeFade(p, c.n);
    if (c.v.ribbon) return { x: p * (c.w + c.g), z: -Math.cos(phase) * 0.35, ry: Math.sin(phase), a };
    return { x: p * (c.w + c.g), y: Math.sin(phase) * 0.4, rz: -Math.cos(phase) * 0.2, a };
  },
  stairs(i, c) {
    const p = centred(i - c.T * c.n, c.n);
    return { x: p * (c.w * 0.7 + c.g), y: -p * c.h * 0.35, z: -p * 0.3, a: edgeFade(p, c.n, 1.5) };
  },
  float(i, c) {
    const z = lerp(-3, 0.4, hash(i, 1));
    const reach = (CAM_Z - z) / CAM_Z; // how much wider the view is at this depth
    const speed = 1 + (i % 2);
    const sway = 0.06 * Math.sin(TAU * (c.T + hash(i, 4)));
    if (c.v.drift) {
      const span = 2 * c.A * 2.1 + 2;
      const x = centred((hash(i, 2) - 0.5) * span + c.T * speed * span, span);
      return { x, y: (hash(i, 3) - 0.5) * 2.2 * reach + sway, z, s: 0.75, a: edgeFade(x, span, 0.6) };
    }
    const span = 5;
    const y = centred((hash(i, 3) - 0.5) * span + c.T * speed * span, span);
    return { x: (hash(i, 2) - 0.5) * 2 * c.A * reach + sway, y, z, s: 0.75, a: edgeFade(y, span, 0.6) };
  },
  pulse(i, c) {
    const v = c.T * c.n;
    const k = Math.floor(v);
    const f = c.spring(clamp((v - k) / 0.6));
    if (i === mod(k, c.n)) return { s: 1 + 0.5 * f, a: 1 - f, z: 0.01 };
    if (i === mod(k + 1, c.n)) return { s: 0.7 + 0.3 * f, a: f };
    return null;
  },
};

export function place(layout: LayoutName, i: number, c: Context): Transform | null {
  return layouts[layout](i, c);
}

/** Layouts that fill whole rows draw a few more items than asked for. */
export function itemTotal(layout: LayoutName, n: number, v: Variant): number {
  if (layout === "grid") return gridCols(n) * Math.ceil(n / gridCols(n));
  if (layout === "marquee") return (v.rows ?? 2) * Math.ceil(n / (v.rows ?? 2));
  return n;
}

/** How far the camera steps back so the nearest card sits where a flat card would. */
export function cameraBack(layout: LayoutName, c: Context): number {
  if (layout === "ring") return c.v.inside ? -CAM_Z + 0.15 * ringRadius(c) : ringRadius(c);
  if (layout === "globe") return c.v.close ? 0.6 : 0.9;
  if (layout === "orbit") return c.v.flat ? 0 : 0.9;
  if (layout === "helix") return 0.8;
  return 0;
}

/** Motion is a chain of steps, one per item unless a layout says otherwise. */
function stepsPerLoop(layout: LayoutName, c: Context): number {
  if (layout === "marquee") return Math.ceil(c.n / (c.v.rows ?? 2));
  if (layout === "grid") return gridCols(c.n);
  if (layout === "globe") return 6;
  return c.n;
}

/**
 * Where an item sits in the queue for step k (0 moves first, 1 last), so the
 * one at the front pulls away and the rest follow: gaps open, then close.
 */
function queuePlace(layout: LayoutName, i: number, c: Context, k: number): number {
  if (layout === "marquee") {
    const rows = c.v.rows ?? 2;
    const cols = Math.ceil(c.n / rows);
    const row = i % rows;
    const col = Math.floor(i / rows);
    const spot = mod(col + (row % 2 ? 1 : -1) * k + cols / 2, cols) / cols;
    return row % 2 ? 1 - spot : spot;
  }
  if (layout === "grid") {
    const cols = gridCols(c.n);
    return mod((i % cols) - k + cols / 2, cols) / cols;
  }
  return mod(i - k + c.n / 2, c.n) / c.n;
}

/**
 * Each item's own clock. `rhythm` blends a steady glide (0) with stop-and-go
 * steps (1); `stagger` delays items down the queue; `bounce` is the overshoot.
 * Flip and pulse show one item at a time and pace themselves.
 */
export function itemTime(layout: LayoutName, i: number, c: Context, T: number, motion: Motion): number {
  if (layout === "flip" || layout === "pulse" || motion.rhythm === 0) return T;
  const steps = stepsPerLoop(layout, c);
  const v = T * steps;
  const k = Math.floor(v);
  const x = clamp((v - k - queuePlace(layout, i, c, k) * motion.stagger * 0.4) / 0.6);
  return lerp(v, k + spring(x, motion.bounce), motion.rhythm) / steps;
}

export const BASE_MOTION: Motion = {
  speed: 1,
  count: 8,
  size: 1,
  gap: 0.1,
  tilt: 0,
  rhythm: 0.45,
  stagger: 0.7,
  bounce: 0.3,
};

export const MOTION_RANGES: Record<MotionKey, { label: string; min: number; max: number; step: number }> = {
  speed: { label: "Speed", min: 1, max: 4, step: 1 },
  rhythm: { label: "Stop and go", min: 0, max: 1, step: 0.01 },
  stagger: { label: "Stagger", min: 0, max: 1, step: 0.01 },
  bounce: { label: "Bounce", min: 0, max: 1, step: 0.01 },
  count: { label: "Items", min: 3, max: 60, step: 1 },
  size: { label: "Size", min: 0.2, max: 1.8, step: 0.01 },
  gap: { label: "Spacing", min: 0, max: 1, step: 0.01 },
  tilt: { label: "Tilt", min: -60, max: 60, step: 1 },
};
export const MOTION_KEYS = Object.keys(MOTION_RANGES) as MotionKey[];

/**
 * Size, count and spacing carry between presets as a proportion ("a third
 * bigger than this preset's own size"); the rest carry as an offset.
 */
const PROPORTIONAL: ReadonlySet<MotionKey> = new Set<MotionKey>(["size", "count", "gap"]);

export type Adjustments = Partial<Record<MotionKey, number>>;

export const presetMotion = (preset: Preset): Motion => ({ ...BASE_MOTION, ...preset.defaults });

/** The change a slider value represents, measured against the preset's own default. */
export function adjustmentFor(key: MotionKey, value: number, preset: Preset): number {
  const base = presetMotion(preset)[key];
  return PROPORTIONAL.has(key) ? (base > 0 ? value / base : 1) : value - base;
}

/** A preset's defaults with the user's changes laid over them, kept inside each slider's range. */
export function applyAdjustments(preset: Preset, adjustments: Adjustments): Motion {
  const motion = presetMotion(preset);
  for (const key of MOTION_KEYS) {
    const change = adjustments[key];
    if (change === undefined) continue;
    const { min, max, step } = MOTION_RANGES[key];
    const raw = PROPORTIONAL.has(key) ? motion[key] * change : motion[key] + change;
    motion[key] = clamp(step >= 1 ? Math.round(raw) : raw, min, max);
  }
  return motion;
}

const preset = (name: string, layout: LayoutName, variant: Variant, defaults: Partial<Motion>, camera: { roll?: number; yaw?: number } = {}): Preset => ({
  name,
  layout,
  variant,
  defaults,
  ...camera,
});

export const PRESETS: Preset[] = [
  preset("Slide 01", "slide", {}, { count: 7, size: 0.9, gap: 0.08 }),
  preset("Slide 02", "slide", {}, { count: 7, size: 0.9, gap: 0.08, rhythm: 1 }),
  preset("Slide 03", "slide", { focus: true }, { count: 7, size: 1.05, gap: 0.06, rhythm: 1 }),
  preset("Slide 04", "slide", { vertical: true }, { count: 7, size: 0.8, gap: 0.08, rhythm: 1, stagger: 1 }),
  preset("Coverflow 01", "cover", {}, { count: 9, size: 1 }),
  preset("Coverflow 02", "cover", {}, { count: 9, size: 1, rhythm: 1 }),
  preset("Coverflow 03", "cover", {}, { count: 9, size: 0.8, gap: 0.25, tilt: 12, rhythm: 1, bounce: 0.6 }),
  preset("Ring 01", "ring", {}, { count: 10, size: 0.8, gap: 0.1 }),
  preset("Ring 02", "ring", {}, { count: 12, size: 0.7, gap: 0.1, tilt: 22 }),
  preset("Ring 03", "ring", { inside: true }, { count: 12, size: 1.1, gap: 0.06 }),
  preset("Ring 04", "ring", { vertical: true }, { count: 10, size: 0.7, gap: 0.12 }),
  preset("Orbit 01", "orbit", {}, { count: 9, size: 0.9, tilt: 14 }),
  preset("Orbit 02", "orbit", { two: true }, { count: 13, size: 0.85, tilt: 18 }),
  preset("Orbit 03", "orbit", { flat: true }, { count: 9, size: 0.8 }),
  preset("Deck 01", "deck", { fly: "up" }, { count: 6, size: 1.05, gap: 0.3, rhythm: 1 }),
  preset("Deck 02", "deck", { fly: "right" }, { count: 6, size: 1.05, gap: 0.3, rhythm: 1 }),
  preset("Deck 03", "deck", { fly: "spin" }, { count: 6, size: 1, gap: 0.5, tilt: 10, rhythm: 1 }),
  preset("Wheel 01", "wheel", {}, { count: 12, size: 0.8, gap: 0.1 }),
  preset("Wheel 02", "wheel", { side: true }, { count: 12, size: 0.7, gap: 0.15 }),
  preset("Wheel 03", "wheel", { full: true }, { count: 10, size: 0.42, gap: 0.1 }),
  preset("Grid 01", "grid", { pan: "x" }, { count: 24, size: 0.6, gap: 0.08 }),
  preset("Grid 02", "grid", { pan: "diag" }, { count: 36, size: 0.6, gap: 0.08, tilt: 48 }, { roll: -30 }),
  preset("Grid 03", "grid", { pan: "alt" }, { count: 24, size: 0.6, gap: 0.08 }),
  preset("Grid 04", "grid", { pan: "pulse" }, { count: 24, size: 0.55, gap: 0.1 }),
  preset("Marquee 01", "marquee", { rows: 2 }, { count: 16, size: 0.85, gap: 0.08 }),
  preset("Marquee 02", "marquee", { rows: 3 }, { count: 24, size: 0.6, gap: 0.08 }),
  preset("Marquee 03", "marquee", { rows: 4 }, { count: 32, size: 0.6, gap: 0.08 }, { roll: -14 }),
  preset("Marquee 04", "marquee", { rows: 3, vertical: true }, { count: 18, size: 0.7, gap: 0.08 }),
  preset("Marquee 05", "marquee", { rows: 4 }, { count: 32, size: 0.6, gap: 0.08, tilt: 55 }),
  preset("Helix 01", "helix", {}, { count: 14, size: 0.6 }),
  preset("Helix 02", "helix", { horizontal: true }, { count: 14, size: 0.55 }),
  preset("Helix 03", "helix", { tornado: true }, { count: 16, size: 0.5 }),
  preset("Globe 01", "globe", {}, { count: 40, size: 0.34 }),
  preset("Globe 02", "globe", {}, { count: 40, size: 0.34, tilt: 12 }, { roll: 22 }),
  preset("Globe 03", "globe", { close: true }, { count: 60, size: 0.4 }),
  preset("Flip 01", "flip", { axis: "y" }, { count: 5, size: 1.3 }),
  preset("Flip 02", "flip", { axis: "x" }, { count: 5, size: 1.3 }),
  preset("Flip 03", "flip", { cube: true }, { count: 5, size: 1.1 }),
  preset("Tunnel 01", "tunnel", {}, { count: 12, size: 0.9 }),
  preset("Tunnel 02", "tunnel", { spiral: true }, { count: 14, size: 0.8 }),
  preset("Tunnel 03", "tunnel", { sides: true }, { count: 12, size: 1 }),
  preset("Fan 01", "fan", { sway: true }, { count: 7, size: 1, rhythm: 0 }),
  preset("Fan 02", "fan", { open: true }, { count: 7, size: 1, rhythm: 0 }),
  preset("Wave 01", "wave", {}, { count: 12, size: 0.6, gap: 0.1 }),
  preset("Wave 02", "wave", { ribbon: true }, { count: 12, size: 0.7, gap: 0.02 }),
  preset("Stairs 01", "stairs", {}, { count: 9, size: 0.8, gap: 0.1 }),
  preset("Stairs 02", "stairs", {}, { count: 9, size: 0.8, gap: 0.1, tilt: 18 }, { yaw: -32 }),
  preset("Float 01", "float", {}, { count: 14, size: 0.6, rhythm: 0 }),
  preset("Float 02", "float", { drift: true }, { count: 14, size: 0.6, rhythm: 0 }),
  preset("Pulse 01", "pulse", {}, { count: 5, size: 1.3 }),
];

/** The settings that are about the brand, not the motion. They never reset. */
export interface Look {
  duration: number;
  radius: number;
  /** canvas size in pixels */
  width: number;
  height: number;
  /** card shape as a ratio, e.g. 4 by 5 */
  cardW: number;
  cardH: number;
  background: string;
}

export const CANVAS_MIN = 200;
export const CANVAS_MAX = 3000;
/** Canvas sides are kept even: H.264 cannot encode an odd one. */
export const canvasSide = (pixels: number) => clamp(Math.round(pixels / 2) * 2, CANVAS_MIN, CANVAS_MAX);
export const ratioPart = (value: number) => clamp(value, 0.1, 100);
/** Width over height, kept within 1:5 and 5:1 so a card never becomes a line. */
export const cardAspect = (look: Look) => clamp(look.cardW / look.cardH, 0.2, 5);

export const CANVAS_SIZES: { label: string; width: number; height: number }[] = [
  { label: "9:16", width: 1080, height: 1920 },
  { label: "4:5", width: 1080, height: 1350 },
  { label: "1:1", width: 1080, height: 1080 },
  { label: "16:9", width: 1920, height: 1080 },
  { label: "2:1", width: 2000, height: 1000 },
];

export const CARD_SHAPES: { label: string; w: number; h: number }[] = [
  { label: "9:16", w: 9, h: 16 },
  { label: "4:5", w: 4, h: 5 },
  { label: "1:1", w: 1, h: 1 },
  { label: "16:9", w: 16, h: 9 },
];

export const BASE_LOOK: Look = {
  duration: 8,
  radius: 0.08,
  width: 1080,
  height: 1920,
  cardW: 4,
  cardH: 5,
  background: "#0e0e10",
};

/** A saved setup: which preset, how it was tuned, and how it looks. No media. */
export interface SavedSetup {
  app: "motion-presets";
  version: 1;
  preset: string;
  motion: Motion;
  look: Look;
}

/** Reads a saved setup from untrusted JSON. Returns a message when it is not one. */
export function parseSetup(text: string): { preset: Preset; motion: Motion; look: Look } | string {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return "That file is not valid JSON.";
  }
  if (typeof data !== "object" || data === null) return "That file is not a saved setup.";
  const file = data as Record<string, unknown>;
  if (file.app !== "motion-presets") return "That file is not a saved setup.";
  const found = PRESETS.find((p) => p.name === file.preset);
  if (!found) return `This version has no preset called "${String(file.preset)}".`;

  const motion = presetMotion(found);
  const savedMotion = typeof file.motion === "object" && file.motion !== null ? (file.motion as Record<string, unknown>) : {};
  for (const key of MOTION_KEYS) {
    const value = savedMotion[key];
    if (typeof value !== "number" || !Number.isFinite(value)) continue;
    const { min, max, step } = MOTION_RANGES[key];
    motion[key] = clamp(step >= 1 ? Math.round(value) : value, min, max);
  }

  const look = { ...BASE_LOOK };
  const savedLook = typeof file.look === "object" && file.look !== null ? (file.look as Record<string, unknown>) : {};
  const number = (key: string) => {
    const value = savedLook[key];
    return typeof value === "number" && Number.isFinite(value) ? value : undefined;
  };
  const duration = number("duration");
  if (duration !== undefined) look.duration = clamp(Math.round(duration), 3, 120);
  const radius = number("radius");
  if (radius !== undefined) look.radius = clamp(radius, 0, 0.5);
  const width = number("width");
  if (width !== undefined) look.width = canvasSide(width);
  const height = number("height");
  if (height !== undefined) look.height = canvasSide(height);
  const cardW = number("cardW");
  if (cardW !== undefined && cardW > 0) look.cardW = ratioPart(cardW);
  const cardH = number("cardH");
  if (cardH !== undefined && cardH > 0) look.cardH = ratioPart(cardH);
  if (typeof savedLook.background === "string" && /^#[0-9a-f]{6}$/i.test(savedLook.background)) look.background = savedLook.background;
  return { preset: found, motion, look };
}
