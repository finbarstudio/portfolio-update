/**
 * Motion presets: where every card sits at every moment.
 *
 * A layout places item i of n at loop position T. T runs from 0 to `speed`
 * and lands on a whole number at the loop point, which is what makes every
 * preset loop without a jump. On top of the layouts sits one shared set of
 * controls (direction, scale focus, card tilt, fade, solo, easing) so each
 * behaves the same way in every preset. Nothing here touches the DOM or WebGL.
 */

export const TAU = Math.PI * 2;
export const DEG = Math.PI / 180;

export const clamp = (x: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const mod = (a: number, n: number) => ((a % n) + n) % n;
/** Wraps into -n/2..n/2. */
const centred = (a: number, n: number) => mod(a + n / 2, n) - n / 2;
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
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

/** An easing curve as a CSS-style cubic bezier: x1, y1, x2, y2. */
export type Bezier = [number, number, number, number];

/** The curve's height at x. y1 and y2 may pass 0 or 1, which is how a move overshoots. */
export function bezier(curve: Bezier, x: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const [x1, y1, x2, y2] = curve;
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  // Newton's method finds the curve parameter whose x matches.
  let t = x;
  for (let step = 0; step < 8; step++) {
    const error = ((ax * t + bx) * t + cx) * t - x;
    const slope = (3 * ax * t + 2 * bx) * t + cx;
    if (Math.abs(error) < 1e-5 || Math.abs(slope) < 1e-6) break;
    t = clamp(t - error / slope);
  }
  return ((ay * t + by) * t + cy) * t;
}

export const EASINGS: { name: string; curve: Bezier }[] = [
  { name: "Glide", curve: [0.3, 0, 0.1, 1] },
  { name: "Settle", curve: [0.3, 1.3, 0.35, 1] },
  { name: "Spring", curve: [0.4, 1.9, 0.5, 0.9] },
  { name: "Snap", curve: [0.75, 0, 0.1, 1] },
  { name: "Wind up", curve: [0.6, -0.4, 0.3, 1.3] },
  { name: "Linear", curve: [0, 0, 1, 1] },
  { name: "Ease", curve: [0.25, 0.1, 0.25, 1] },
  { name: "Ease in", curve: [0.42, 0, 1, 1] },
  { name: "Ease out", curve: [0, 0, 0.58, 1] },
  { name: "Ease in out", curve: [0.42, 0, 0.58, 1] },
  { name: "Sine", curve: [0.37, 0, 0.63, 1] },
  { name: "Expo out", curve: [0.16, 1, 0.3, 1] },
];
export const BASE_EASING: Bezier = [0.3, 1.3, 0.35, 1];

export type LayoutName =
  | "slide"
  | "cover"
  | "ring"
  | "orbit"
  | "deck"
  | "wheel"
  | "grid"
  | "tour"
  | "proximity"
  | "zoom"
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
  inside?: boolean;
  vertical?: boolean;
  two?: boolean;
  flat?: boolean;
  fly?: "up" | "right" | "spin";
  side?: boolean;
  full?: boolean;
  pan?: "x" | "diag" | "alt" | "pulse";
  rows?: number;
  field?: boolean;
  /** zoom: cards arrive big and shrink away instead */
  out?: boolean;
  /** orbit: an upright wheel seen from an angle */
  wheel?: boolean;
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

/** The sliders. Each preset has its own defaults. */
export interface Motion {
  /** seconds for one loop */
  duration: number;
  speed: number;
  rhythm: number;
  stagger: number;
  hold: number;
  count: number;
  size: number;
  gap: number;
  /** how much bigger the card in focus is */
  scale: number;
  /** card rotation in degrees, used by the tilt mode */
  cardTilt: number;
  /** each card turned about its own upright axis, degrees */
  turn: number;
  /** whole turns each card makes per pass */
  spin: number;
  fade: number;
  offsetX: number;
  offsetY: number;
  /** camera: looking down or up, degrees */
  tilt: number;
  /** camera: looking from the side, degrees */
  yaw: number;
  /** camera: field of view, degrees */
  perspective: number;
  /** camera: distance, as a multiple of the default */
  distance: number;
  /** camera: turned about its own line of sight, degrees */
  roll: number;
  /** ring, orbit, wheel, globe and helix radius, as a multiple of the default */
  radius: number;
  /** how many cards either side of the focus grow */
  reach: number;
  /** how strongly a layout takes its shape: a fan's curve, a wave's height, a staircase's rise */
  shape: number;
  /** empty places left between the last card and the first, so the loop has a visible break */
  loopGap: number;
}
export type MotionKey = keyof Motion;

export type Direction = "left" | "right" | "up" | "down";
export type Origin = "centre" | Direction;
export type Focus = "off" | "start" | "centre" | "end";
export type TiltMode = "off" | "fan" | "uniform" | "alternate";

/** The switches. */
export interface Options {
  direction: Direction;
  /** where along the row cards grow */
  focus: Focus;
  tiltMode: TiltMode;
  /** only the card in focus shows */
  solo: boolean;
  /** orbit: a card in the middle */
  centre: boolean;
  /** orbit: cards face the viewer, or face outwards like a carousel */
  faceCamera: boolean;
  /** zoom: the point cards grow from */
  origin: Origin;
  /** everything fades out to the background at the end of the loop and back in at the start */
  loopFade: boolean;
}

export interface Preset {
  name: string;
  layout: LayoutName;
  variant: Variant;
  defaults: Partial<Motion>;
  options: Partial<Options>;
  /** the cells the camera or the focus visits, in order */
  path?: number[];
}

export interface Transform {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
  /** scale */
  s: number;
  /** opacity */
  a: number;
}

/**
 * What a layout hands back. `u` and `v` are along and across the direction of
 * travel, so one layout serves all four directions. `p` is how many cards the
 * item is from the middle of the row, which is what focus, fade, solo and fan
 * tilt measure from.
 */
interface Raw extends Partial<Transform> {
  u?: number;
  v?: number;
  p?: number;
  /** a focus point of the layout's own, in the same units as p */
  f?: number;
  /** the layout already applied the focus scale */
  scaled?: boolean;
}

interface Context {
  n: number;
  /** this item's own clock, signed by direction */
  T: number;
  /** the shared clock, signed by direction */
  Tg: number;
  w: number;
  h: number;
  /** gap between cards */
  g: number;
  /** card length along and across the direction of travel */
  pitch: number;
  cross: number;
  /** frame aspect, width over height */
  A: number;
  camZ: number;
  v: Variant;
  m: Motion;
  o: Options;
  focus: number;
  path: number[];
  ease: (x: number) => number;
  /** the shared clock in steps, with the stop-and-go rhythm applied */
  glide: (steps: number) => number;
}

/** How much a card `u` cards from the focus grows, 1 at the focus and 0 from `reach` cards away. */
const bump = (u: number, reach: number) => {
  const a = Math.abs(u);
  return a < reach ? (1 - a / reach) ** 2 : 0;
};
/** The area under `bump` from 0 to u: how far a grown card pushes its neighbours. */
const bumpArea = (u: number, reach: number) => (Math.sign(u) * reach * (1 - (1 - Math.min(Math.abs(u), reach) / reach) ** 3)) / 3;

/** Position along a row, with cards near the focus pushing the others apart. */
function along(p: number, c: Context): number {
  const growth = c.o.focus === "off" ? 0 : c.m.scale - 1;
  return p * (c.pitch + c.g) + c.pitch * growth * (bumpArea(p - c.focus, c.m.reach) - bumpArea(-c.focus, c.m.reach));
}

const ringRadius = (c: Context) =>
  (c.v.inside ? Math.max(2.4, ((c.w + c.g) * c.n) / TAU) : Math.max(c.w * 1.1, ((c.w + c.g) * c.n) / TAU)) * c.m.radius;
export const gridCols = (n: number) => Math.ceil(Math.sqrt(n));
const GOLDEN_ANGLE = 2.39996323;
/** An upright wheel's cards and radius: sized so the whole wheel sits inside the frame. */
const WHEEL_CARD = 0.5;
const wheelRadius = (c: Context, cards: number) => Math.max(0.95, ((c.w * WHEEL_CARD + c.g) * cards) / TAU) * c.m.radius;
/** A zoom card is born at ZOOM_MIN of its size and leaves at ZOOM_MAX. */
const ZOOM_MIN = 0.08;
const ZOOM_MAX = 3.4;
/** Pins for a field's focus path sit on a coarse grid this many cells wide and tall. */
export const PIN_COLS = 5;

/** The grid a preset's path is picked on, or null when it has no path. */
export function pathGrid(preset: Preset, count: number): { cells: number; cols: number } | null {
  if (preset.layout === "tour") {
    const cells = itemTotal("tour", count, preset.variant);
    return { cells, cols: gridCols(cells) };
  }
  if (preset.layout === "proximity" && preset.variant.field) return { cells: PIN_COLS * PIN_COLS, cols: PIN_COLS };
  return null;
}

/** A grid cell's centre, in world units. */
function cellCentre(cell: number, cols: number, rows: number, c: Context): [number, number] {
  const col = cell % cols;
  const row = Math.floor(cell / cols);
  return [(col - (cols - 1) / 2) * (c.w + c.g), -(row - (rows - 1) / 2) * (c.h + c.g)];
}

const layouts: Record<LayoutName, (i: number, c: Context) => Raw | null> = {
  slide(i, c) {
    const p = centred(i - c.T * c.n, c.n);
    return { u: along(p, c), p, a: edgeFade(p, c.n) };
  },
  cover(i, c) {
    const p = centred(i - c.T * c.n, c.n);
    const d = Math.min(1, Math.abs(p));
    const side = Math.sign(p);
    return {
      u: side * (d * c.pitch * 0.75 + Math.max(0, Math.abs(p) - 1) * (c.pitch * 0.3 + c.g)),
      z: -d * c.pitch * 0.6 * Math.min(1.5, c.m.shape) - Math.abs(p) * 0.02,
      ry: -side * d * Math.min(88, 65 * c.m.shape) * DEG,
      p,
      a: edgeFade(p, c.n),
    };
  },
  ring(i, c) {
    const angle = TAU * (i / c.n + c.T);
    const R = ringRadius(c);
    const p = centred(i + c.T * c.n, c.n);
    if (c.v.vertical) return { y: Math.sin(angle) * R, z: Math.cos(angle) * R, rx: -angle, p };
    if (c.v.inside) return { x: Math.sin(angle) * R, z: Math.cos(angle) * R, ry: angle + Math.PI };
    return { x: Math.sin(angle) * R, z: Math.cos(angle) * R, ry: angle, p };
  },
  orbit(i, c) {
    // Facing the viewer means square to the screen, whatever angle the camera looks from.
    const square = { rx: -c.m.tilt * DEG, ry: -c.m.yaw * DEG };
    if (c.o.centre && i === 0) return { ...square, s: 1.1 };
    const k = c.o.centre ? i - 1 : i;
    const m = Math.max(1, c.o.centre ? c.n - 1 : c.n);
    const small = c.o.centre ? 0.4 : 0.52;
    if (c.v.flat) {
      const angle = TAU * (k / m + c.T);
      const R = 0.8 * c.m.radius;
      return { ...square, x: Math.cos(angle) * Math.min(c.A, 1) * R, y: Math.sin(angle) * R, z: -0.05, s: small * 0.8, p: centred(k + (c.T - 0.25) * m, m) };
    }
    if (c.v.wheel) {
      // An upright wheel. The camera's yaw is what makes it sit in 3D space.
      const angle = TAU * (k / m + c.T) + Math.PI / 2;
      const R = wheelRadius(c, m);
      return { ...square, x: Math.cos(angle) * R, y: Math.sin(angle) * R, s: WHEEL_CARD, p: centred(k + c.T * m, m) };
    }
    const outer = Boolean(c.v.two) && k % 2 === 1;
    const turn = outer ? -c.T : c.T;
    // Two rings share the floor and turn against each other, each with half the cards.
    const ringCards = c.v.two ? Math.ceil(m / 2) : m;
    const slot = c.v.two ? Math.floor(k / 2) : k;
    const angle = TAU * (slot / ringCards + turn);
    const R = ((outer ? 1.7 : c.v.two ? 0.95 : 1.25) + c.g) * c.m.radius;
    const y = 0;
    // Facing outwards, a card at the side is edge-on, so the far row never crowds the near one.
    const facing = c.o.faceCamera ? square : { ry: Math.PI / 2 - angle };
    return { ...facing, x: Math.cos(angle) * R, y, z: Math.sin(angle) * R, s: small, p: centred(slot + (turn - 0.25) * ringCards, ringCards) };
  },
  deck(i, c) {
    const q = mod(i - c.T * c.n, c.n);
    // The front card leaves, travels to the back, and rejoins the stack.
    const leaving = q > c.n - 1 ? c.n - q : 0;
    const slot = leaving ? lerp(0, c.n - 1, easeInOut(leaving)) : q;
    const lift = Math.sin(Math.PI * leaving);
    const out = { x: slot * c.g * 0.25, y: slot * c.g * 0.2, z: -slot * 0.12, rz: 0, ry: 0, s: 1 - slot * 0.04, a: 1 - clamp((slot - 6) / 2) };
    if (c.v.fly === "up") out.y += lift * c.h * 1.15 * c.m.shape;
    if (c.v.fly === "right") out.x += lift * c.w * 1.25 * c.m.shape;
    if (c.v.fly === "spin") {
      // Swings out like a door and back in behind the stack.
      out.x -= lift * c.w * 1.1 * c.m.shape;
      out.ry = lift * 0.9;
    }
    return out;
  },
  wheel(i, c) {
    const angle = TAU * (i / c.n + c.T);
    const p = centred(i + c.T * c.n, c.n);
    if (c.v.full) {
      const R = 0.68 * Math.min(1, c.A) * c.m.radius;
      return { x: Math.sin(angle) * R, y: Math.cos(angle) * R, p };
    }
    const R = Math.max(1.6, ((c.w + c.g) * c.n) / TAU) * c.m.radius;
    if (c.v.side) return { x: Math.cos(angle) * R - R, y: Math.sin(angle) * R, p };
    return { x: Math.sin(angle) * R, y: Math.cos(angle) * R - R, p };
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
  // A still wall of cards. The camera does the moving: see `camera`.
  tour(i, c) {
    const cols = gridCols(c.n);
    const [x, y] = cellCentre(i, cols, Math.ceil(c.n / cols), c);
    return { x, y };
  },
  // Still cards that swell as a point of focus passes over them.
  proximity(i, c) {
    const growth = c.m.scale - 1;
    const reach = c.m.reach;
    if (c.v.field) {
      const cols = gridCols(c.n);
      const rows = Math.ceil(c.n / cols);
      // The focus travels pin to pin. Pins sit on a coarse grid laid over the whole field.
      const pin = (cell: number) => [((cell % PIN_COLS) / (PIN_COLS - 1)) * (cols - 1), (Math.floor(cell / PIN_COLS) / (PIN_COLS - 1)) * (rows - 1)];
      const pins = c.path.length ? c.path : [Math.floor((PIN_COLS * PIN_COLS) / 2)];
      const steps = c.glide(c.Tg * pins.length);
      const from = pin(pins[mod(Math.floor(steps), pins.length)]);
      const to = pin(pins[mod(Math.floor(steps) + 1, pins.length)]);
      const part = steps - Math.floor(steps);
      const dx = (i % cols) - lerp(from[0], to[0], part);
      const dy = Math.floor(i / cols) - lerp(from[1], to[1], part);
      const d = Math.hypot(dx, dy);
      const [x, y] = cellCentre(i, cols, rows, c);
      // Grown cards push the rest outwards, like a lens, so they do not pile up.
      const push = d > 1e-6 ? (growth * bumpArea(d, reach)) / d : 0;
      return { x: x + dx * push * c.w, y: y - dy * push * c.h, s: 1 + growth * bump(d, reach), p: d, f: 0, scaled: true };
    }
    // Back and forth along the row.
    const last = Math.max(1, c.n - 1);
    const travelled = mod(c.glide(c.Tg * 2 * last), 2 * last);
    const f = (travelled <= last ? travelled : 2 * last - travelled) - last / 2;
    const p = i - last / 2;
    const recentre = (bumpArea(-last / 2 - f, reach) + bumpArea(last / 2 - f, reach)) / 2; // keeps the row centred as it swells
    return { u: p * (c.pitch + c.g) + c.pitch * growth * (bumpArea(p - f, reach) - recentre), s: 1 + growth * bump(p - f, reach), p, f, scaled: true };
  },
  // A stream of cards growing out of one point: the newest, smallest card in
  // front, the older, bigger ones behind it, the biggest leaving past the frame.
  zoom(i, c) {
    const flow = c.glide(Math.abs(c.Tg) * c.n);
    const age = mod(flow - i, c.n); // 0 as a card is born, n as it leaves
    // The easing curve shapes the whole life, so cards at different stages move at
    // different rates and the gaps between them breathe. Each card also runs a
    // little faster or slower than its neighbours.
    const pace = 1 + (hash(i, 7) - 0.5) * 0.16;
    const stage = clamp(Math.pow(age / c.n, pace));
    const life = clamp(0.5 * c.ease(stage) + 0.5 * stage); // half the curve, so no curve starves the middle of the flow
    const grow = c.v.out ? 1 - life : life;
    // Geometric growth reads as a steady approach.
    const s = ZOOM_MIN * Math.pow(ZOOM_MAX / ZOOM_MIN, grow);
    const a = c.v.out ? smooth((1 - life) / 0.2) * smooth(life / 0.12) : smooth((1 - life) / 0.1) * smooth(life / 0.05);
    // The smallest cards sit in front: the newest when growing, the oldest when shrinking.
    const out = { x: 0, y: 0, z: (c.v.out ? age : c.n - age) * 0.004, s, a };
    // Growing from an edge: that edge of the card stays on the frame edge.
    const halfW = (c.w * s) / 2;
    const halfH = (c.h * s) / 2;
    if (c.o.origin === "up") out.y = 1 - halfH;
    if (c.o.origin === "down") out.y = -1 + halfH;
    if (c.o.origin === "left") out.x = -c.A + halfW;
    if (c.o.origin === "right") out.x = c.A - halfW;
    return out;
  },
  marquee(i, c) {
    const rows = c.v.rows ?? 2;
    const cols = Math.ceil(c.n / rows);
    const row = i % rows;
    const col = Math.floor(i / rows);
    const p = centred(col + (row % 2 ? 1 : -1) * c.T * cols + row * 0.5 * c.m.shape, cols);
    return { u: along(p, c), v: -(row - (rows - 1) / 2) * (c.cross + c.g), p, a: edgeFade(p, cols, 0.5) };
  },
  helix(i, c) {
    const along01 = mod(i / c.n + c.T, 1);
    const angle = TAU * 2 * along01 + TAU * c.T;
    const R = (c.v.tornado ? lerp(0.25, 1.5, along01) : 0.95) * c.m.radius;
    const a = smooth(along01 / 0.12) * smooth((1 - along01) / 0.12);
    const p = (along01 - 0.5) * c.n;
    if (c.v.horizontal) {
      // Square to the viewer: the depth shading alone says which side of the tube a card is on.
      const turns = TAU * 1.5 * along01 + TAU * c.T;
      return { x: (along01 - 0.5) * 2.6 * Math.max(1, c.A) * c.m.shape, y: Math.sin(turns) * R * 0.8, z: Math.cos(turns) * R * 0.8, a, p };
    }
    return { x: Math.sin(angle) * R, y: (along01 - 0.5) * 2.8 * c.m.shape, z: Math.cos(angle) * R, ry: angle, a, p };
  },
  globe(i, c) {
    const y = 1 - (2 * (i + 0.5)) / c.n;
    const r = Math.sqrt(1 - y * y);
    const theta = i * GOLDEN_ANGLE + TAU * c.T;
    const R = (c.v.close ? 1.7 : 1.05) * c.m.radius;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    return { x: x * R, y: y * R, z: z * R, ry: Math.atan2(x, z), rx: -Math.asin(y) };
  },
  flip(i, c) {
    const steps = c.T * c.n;
    const k = Math.floor(steps);
    const f = c.ease(clamp((steps - k) / (1 - c.m.hold)));
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
    const z = -Math.sin(Math.PI * clamp(f)) * 0.5;
    return c.v.axis === "x" ? { z, rx: turn } : { z, ry: turn };
  },
  tunnel(i, c) {
    const depth = mod(i / c.n + c.T, 1);
    const z = lerp(-11, c.camZ - 0.4, depth);
    const a = smooth(depth / 0.15) * smooth((1 - depth) / 0.1);
    if (c.v.sides) {
      const side = i % 2 ? 1 : -1;
      return { z, a, x: side * (0.55 * c.A + c.w * 0.35) * c.m.shape, ry: -side * 50 * DEG };
    }
    const angle = c.v.spiral ? TAU * 2 * depth : i * GOLDEN_ANGLE;
    return { z, a, x: Math.cos(angle) * 0.95 * Math.min(1.4, c.A) * c.m.shape, y: Math.sin(angle) * 0.95 * c.m.shape };
  },
  fan(i, c) {
    const breathing = c.v.open ? 0.55 + 0.45 * Math.sin(TAU * c.T - Math.PI / 2) : 1;
    const p = i - (c.n - 1) / 2;
    const R = 2.2;
    // Cards stay the same distance apart along the arc however tightly it curves.
    const step = Math.min(0.2 + c.g, 2.4 / c.n) * breathing * R;
    const curve = c.m.shape / R; // 0 is a straight row
    // The sway is a distance along the arc, so a flat fan still slides side to side.
    const arc = p * step + (c.v.sway ? 0.25 * Math.sin(TAU * c.T) * R : 0);
    const angle = arc * curve;
    const z = i * 0.002; // just enough to settle the overlap order, less than the lift a card in focus gets
    if (curve < 1e-4) return { x: arc, y: -0.1, z, p };
    return { x: Math.sin(angle) / curve, y: (Math.cos(angle) - 1) / curve - 0.1, z, rz: -angle, p };
  },
  wave(i, c) {
    const p = centred(i - c.T * c.n, c.n);
    const phase = (TAU * p * Math.max(1, Math.round(c.n / 6))) / c.n;
    const a = edgeFade(p, c.n);
    if (c.v.ribbon) return { u: along(p, c), z: -Math.cos(phase) * 0.35 * c.m.shape, ry: Math.sin(phase) * Math.min(1.5, c.m.shape), p, a };
    return { u: along(p, c), v: Math.sin(phase) * 0.4 * c.m.shape, p, a };
  },
  stairs(i, c) {
    const p = centred(i - c.T * c.n, c.n);
    return { u: p * (c.pitch + c.g), v: -p * c.cross * 0.35 * c.m.shape, z: -p * 0.3 * c.m.shape, p, a: edgeFade(p, c.n, 1.5) };
  },
  float(i, c) {
    const z = lerp(-3, 0.4, hash(i, 1)) * c.m.shape;
    const reach = (c.camZ - z) / c.camZ; // how much wider the view is at this depth
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
    const steps = c.T * c.n;
    const k = Math.floor(steps);
    const f = c.ease(clamp((steps - k) / (1 - c.m.hold)));
    if (i === mod(k, c.n)) return { s: 1 + 0.5 * f, a: clamp(1 - f), z: 0.01 };
    if (i === mod(k + 1, c.n)) return { s: 0.7 + 0.3 * f, a: clamp(f) };
    return null;
  },
};

/** Layouts that fill whole rows draw a few more items than asked for. */
export function itemTotal(layout: LayoutName, n: number, v: Variant): number {
  if (layout === "grid" || layout === "tour" || (layout === "proximity" && v.field)) return gridCols(n) * Math.ceil(n / gridCols(n));
  if (layout === "marquee") return (v.rows ?? 2) * Math.ceil(n / (v.rows ?? 2));
  return n;
}

/** These pace themselves from the shared clock: one card at a time, or still cards. */
const SHARED_CLOCK: ReadonlySet<LayoutName> = new Set<LayoutName>(["flip", "pulse", "proximity", "tour", "zoom"]);

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
    const spot = mod(Math.floor(i / rows) + (row % 2 ? 1 : -1) * k + cols / 2, cols) / cols;
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
 * steps (1); `hold` is the share of each step spent resting; `stagger` uses
 * that rest to delay items down the queue.
 */
function itemTime(layout: LayoutName, i: number, c: Context, T: number, reversed: boolean): number {
  if (SHARED_CLOCK.has(layout) || c.m.rhythm === 0) return T;
  const steps = stepsPerLoop(layout, c);
  const v = T * steps;
  const k = Math.floor(v);
  const spot = queuePlace(layout, i, c, k);
  // Cards do not all set off on the beat: a slight, fixed unevenness per card.
  const unevenness = (hash(i, 11) - 0.5) * 0.12;
  const wait = clamp((reversed ? 1 - spot : spot) + unevenness) * c.m.stagger * c.m.hold;
  return lerp(v, k + c.ease(clamp((v - k - wait) / (1 - c.m.hold))), c.m.rhythm) / steps;
}

export interface Settings {
  preset: Preset;
  motion: Motion;
  options: Options;
  easing: Bezier;
  /** tour: the cells the camera visits */
  path: number[];
}

export interface Frame {
  /** card size at scale 1 */
  w: number;
  h: number;
  items: ({ i: number } & Transform)[];
  camera: { x: number; y: number; distance: number; fov: number; tilt: number; yaw: number; roll: number };
}

/** Layouts where up and down mean something. The rest only run forwards or backwards. */
export const FOUR_WAY: ReadonlySet<LayoutName> = new Set<LayoutName>(["slide", "cover", "marquee", "wave", "stairs", "proximity"]);
/**
 * Layouts that show their cards one after another, where the last meeting the
 * first is a visible join. These can leave empty places between the two.
 */
export const HAS_LOOP_GAP: ReadonlySet<LayoutName> = new Set<LayoutName>(["slide", "cover", "ring", "wheel", "deck", "helix", "stairs", "wave", "tunnel", "flip", "pulse", "zoom"]);
/** How far the card in focus comes forward: enough to win the overlap, too little to see as movement. */
const FOCUS_LIFT = 0.03;
/** How long the fade out and the fade in each take, as a share of the loop. */
const LOOP_FADE = 0.07;

/** Layouts that know how far each card is from the middle, so focus, fade and solo apply. */
export const HAS_FOCUS: ReadonlySet<LayoutName> = new Set<LayoutName>(["slide", "cover", "marquee", "wave", "stairs", "ring", "wheel", "helix", "orbit", "fan"]);
export const HAS_RADIUS: ReadonlySet<LayoutName> = new Set<LayoutName>(["ring", "wheel", "orbit", "globe", "helix"]);

/** Everything the renderer needs to draw one moment of a preset. */
export function layoutFrame(settings: Settings, seconds: number, aspect: number, cardShape: number): Frame {
  const { preset, motion: m, options: o, easing } = settings;
  const { layout } = preset;
  const fourWay = FOUR_WAY.has(layout);
  const vertical = fourWay && (o.direction === "up" || o.direction === "down");
  const reversed = o.direction === "right" || o.direction === "down";
  const sign = reversed ? -1 : 1;
  const h = m.size;
  const w = h * cardShape;
  const cards = itemTotal(layout, Math.round(m.count), preset.variant);
  // Empty places after the last card: they take a turn in the loop like any card, but nothing is drawn in them.
  const n = cards + (HAS_LOOP_GAP.has(layout) ? Math.round(m.loopGap) : 0);
  const T = (seconds / m.duration) * Math.round(m.speed);
  const loopAt = mod(seconds / m.duration, 1);
  const curtain = o.loopFade ? smooth(loopAt / LOOP_FADE) * smooth((1 - loopAt) / LOOP_FADE) : 1;
  const hold = clamp(m.hold, 0, 0.9);
  const ease = (x: number) => bezier(easing, x);
  const camZ = 1 / Math.tan((m.perspective * DEG) / 2); // a card 2 units tall fills the frame at z = 0
  const reachable = Math.min(1.5, (n - 1) / 2);
  const c: Context = {
    n,
    T: sign * T,
    Tg: sign * T,
    w,
    h,
    g: m.gap * w,
    pitch: vertical ? h : w,
    cross: vertical ? w : h,
    A: aspect,
    camZ,
    v: preset.variant,
    m: { ...m, hold },
    o,
    focus: o.focus === "start" ? -reachable : o.focus === "end" ? reachable : 0,
    path: settings.path.filter((cell) => cell >= 0 && cell < (pathGrid(preset, Math.round(m.count))?.cells ?? 0)),
    ease,
    glide: (steps) => {
      const k = Math.floor(steps);
      return lerp(steps, k + ease(clamp((steps - k) / (1 - hold))), m.rhythm);
    },
  };

  const items: Frame["items"] = [];
  for (let i = 0; i < cards; i++) {
    c.T = sign * itemTime(layout, i, c, T, reversed);
    const raw = layouts[layout](i, c);
    if (!raw) continue;
    let { x = 0, y = 0, rx = 0, ry = 0, rz = 0, s = 1, a = 1 } = raw;
    let z = raw.z ?? 0;
    if (raw.u !== undefined || raw.v !== undefined) {
      const u = raw.u ?? 0;
      const v = raw.v ?? 0;
      if (vertical) {
        x = v;
        y = -u;
        rx = ry; // a card that turned to face along the row now turns up or down
        ry = 0;
      } else {
        x = u;
        y = v;
      }
    }
    const f = raw.f ?? c.focus;
    if (layout === "zoom") raw.p = undefined;
    if (raw.p !== undefined) {
      const d = Math.abs(raw.p - f);
      if (o.focus !== "off" && !raw.scaled) s *= 1 + (m.scale - 1) * bump(raw.p - f, m.reach);
      // The nearer a card is to the focus, the further forward it sits, so the
      // card in focus is always drawn over its neighbours when they overlap.
      if (o.focus !== "off" || raw.scaled) z += FOCUS_LIFT * bump(raw.p - f, m.reach);
      // Fade steepens with the slider until, at full, it is exactly Solo: only the card in focus shows.
      a *= clamp(1.5 - d * 2 * (o.solo ? 1 : m.fade));
    }
    const fromFocus = (raw.p ?? i - (n - 1) / 2) - f;
    if (o.tiltMode === "fan") rz -= fromFocus * m.cardTilt * DEG;
    if (o.tiltMode === "uniform") rz += m.cardTilt * DEG;
    if (o.tiltMode === "alternate") rz += (i % 2 ? -1 : 1) * m.cardTilt * DEG;
    ry += m.turn * DEG + TAU * Math.round(m.spin) * c.T;
    a *= curtain;
    if (a <= 0.003) continue;
    items.push({ i, x, y, z, rx, ry, rz, s, a });
  }

  const camera = { x: 0, y: 0, back: 0 };
  if (layout === "ring") camera.back = c.v.inside ? -camZ + 0.15 * ringRadius(c) : ringRadius(c);
  if (layout === "globe") camera.back = c.v.close ? 0.6 : 0.9;
  if (layout === "orbit") camera.back = c.v.flat ? 0 : c.v.wheel ? wheelRadius(c, o.centre ? n - 1 : n) * 1.15 + 0.4 : 0.9;
  if (layout === "helix") camera.back = 0.8;
  if (layout === "tour" && c.path.length) {
    // Cell to cell, pulling back a little on the way so the wall reads.
    const cols = gridCols(n);
    const rows = Math.ceil(n / cols);
    const steps = c.glide(c.Tg * c.path.length);
    const from = cellCentre(c.path[mod(Math.floor(steps), c.path.length)], cols, rows, c);
    const to = cellCentre(c.path[mod(Math.floor(steps) + 1, c.path.length)], cols, rows, c);
    const part = steps - Math.floor(steps);
    camera.x = lerp(from[0], to[0], part);
    camera.y = lerp(from[1], to[1], part);
    camera.back = Math.sin(Math.PI * clamp(part)) * 0.35 * Math.min(2.5, Math.hypot(to[0] - from[0], to[1] - from[1]));
  }

  return {
    w,
    h,
    items,
    camera: {
      x: camera.x - m.offsetX * aspect,
      y: camera.y - m.offsetY,
      distance: camZ * m.distance + camera.back,
      fov: m.perspective * DEG,
      tilt: m.tilt * DEG,
      yaw: m.yaw * DEG,
      roll: m.roll * DEG,
    },
  };
}

export const BASE_MOTION: Motion = {
  duration: 16,
  speed: 1,
  rhythm: 0,
  stagger: 0.7,
  hold: 0.4,
  count: 8,
  size: 1,
  gap: 0.1,
  scale: 1.6,
  cardTilt: 8,
  turn: 0,
  spin: 0,
  fade: 0,
  offsetX: 0,
  offsetY: 0,
  tilt: 0,
  yaw: 0,
  perspective: 35,
  distance: 1,
  roll: 0,
  radius: 1,
  reach: 1.6,
  shape: 1,
  loopGap: 0,
};

export const BASE_OPTIONS: Options = { direction: "left", focus: "off", tiltMode: "off", solo: false, centre: true, faceCamera: true, origin: "centre", loopFade: false };

export const MOTION_RANGES: Record<MotionKey, { label: string; min: number; max: number; step: number }> = {
  duration: { label: "Loop (sec)", min: 3, max: 120, step: 1 },
  speed: { label: "Passes", min: 1, max: 4, step: 1 },
  rhythm: { label: "Stop and go", min: 0, max: 1, step: 0.01 },
  stagger: { label: "Stagger", min: 0, max: 1, step: 0.01 },
  hold: { label: "Rest", min: 0, max: 0.8, step: 0.01 },
  count: { label: "Count", min: 2, max: 300, step: 1 },
  size: { label: "Card size", min: 0.04, max: 1.8, step: 0.01 },
  gap: { label: "Gap", min: 0, max: 1, step: 0.01 },
  scale: { label: "Scale amount", min: 0.4, max: 8, step: 0.01 },
  cardTilt: { label: "Tilt angle", min: -45, max: 45, step: 1 },
  turn: { label: "Turn", min: -90, max: 90, step: 1 },
  spin: { label: "Spins", min: 0, max: 3, step: 1 },
  fade: { label: "Fade", min: 0, max: 1, step: 0.01 },
  offsetX: { label: "Offset X", min: -1, max: 1, step: 0.01 },
  offsetY: { label: "Offset Y", min: -1, max: 1, step: 0.01 },
  tilt: { label: "Look down", min: -90, max: 90, step: 1 },
  yaw: { label: "Look across", min: -90, max: 90, step: 1 },
  perspective: { label: "Perspective", min: 10, max: 100, step: 1 },
  distance: { label: "Distance", min: 0.4, max: 3, step: 0.01 },
  roll: { label: "Roll", min: -90, max: 90, step: 1 },
  radius: { label: "Radius", min: 0.4, max: 2.5, step: 0.01 },
  reach: { label: "Reach", min: 0.5, max: 8, step: 0.1 },
  shape: { label: "Shape", min: 0, max: 2.5, step: 0.01 },
  loopGap: { label: "Loop gap", min: 0, max: 6, step: 1 },
};
export const MOTION_KEYS = Object.keys(MOTION_RANGES) as MotionKey[];

type Range = { label: string; min: number; max: number; step: number };

/** The most cards each layout can sensibly show. Past this a slider is all dead travel. */
const COUNT_MAX: Record<LayoutName, number> = {
  zoom: 12,
  flip: 12,
  pulse: 12,
  deck: 12,
  fan: 15,
  slide: 20,
  cover: 20,
  stairs: 20,
  wave: 24,
  proximity: 16,
  ring: 30,
  wheel: 30,
  orbit: 24,
  helix: 36,
  tunnel: 36,
  float: 48,
  tour: 36,
  marquee: 64,
  grid: 64,
  globe: 120,
};

/**
 * What the shape slider is called in each layout that has one. Layouts built
 * on a circle use Radius instead; the rest have no single shape to dial.
 */
export const SHAPE_LABEL: Partial<Record<LayoutName, string>> = {
  fan: "Curve",
  wave: "Wave height",
  stairs: "Rise",
  cover: "Fold",
  deck: "Lift",
  tunnel: "Spread",
  helix: "Length",
  float: "Depth",
  marquee: "Row offset",
};

/**
 * A slider's range for one preset. The wide limits in MOTION_RANGES only suit
 * the fields of tiny cards; everything else gets a range it can use end to end.
 */
export function rangeFor(preset: Preset, key: MotionKey): Range {
  const base = MOTION_RANGES[key];
  const field = preset.layout === "proximity" && Boolean(preset.variant.field);
  if (key === "count") return { ...base, max: field ? base.max : COUNT_MAX[preset.layout], min: field ? 16 : base.min };
  // Layouts built from many small cards get a size slider scaled to small cards.
  const smallCards = preset.layout === "globe" || (preset.layout === "wheel" && Boolean(preset.variant.full));
  if (key === "size") return field ? { ...base, max: 0.5 } : smallCards ? { ...base, min: 0.08, max: 0.8 } : { ...base, min: 0.2 };
  if (key === "scale") return field ? base : { ...base, max: 3 };
  if (key === "reach") return field ? base : { ...base, max: 4 };
  // Past 1.6 a fan's ends fold right over.
  if (key === "shape") return { ...base, label: SHAPE_LABEL[preset.layout] ?? base.label, max: preset.layout === "fan" ? 1.6 : base.max };
  return base;
}

/**
 * These carry between presets as a proportion ("a third bigger than this
 * preset's own size"); the rest carry as an offset.
 */
const PROPORTIONAL: ReadonlySet<MotionKey> = new Set<MotionKey>(["duration", "size", "count", "gap", "scale", "distance", "radius", "perspective", "reach", "shape"]);

export type Adjustments = Partial<Record<MotionKey, number>>;

/**
 * A loop length that gives each card an unhurried move: about two and a half
 * seconds per step, however many steps the preset has.
 */
function naturalDuration(preset: Preset): number {
  const n = itemTotal(preset.layout, preset.defaults.count ?? BASE_MOTION.count, preset.variant);
  const stops = preset.path?.length ?? 1;
  const seconds = (() => {
    switch (preset.layout) {
      case "marquee":
        return Math.ceil(n / (preset.variant.rows ?? 2)) * 3.2;
      case "grid":
        return gridCols(n) * 4.5;
      case "tour":
        return stops * 4.5;
      case "proximity":
        return preset.variant.field ? stops * 4.5 : (n - 1) * 2 * 1.6;
      case "globe":
        return 36;
      case "float":
        return 28;
      case "fan":
        return 9;
      case "helix":
      case "tunnel":
        return n * 1.8;
      case "orbit":
        return n * 3.2;
      default:
        return n * 2.6;
    }
  })();
  return clamp(Math.round(seconds), 3, 120);
}

export const presetMotion = (preset: Preset): Motion => ({ ...BASE_MOTION, duration: naturalDuration(preset), ...preset.defaults });
export const presetOptions = (preset: Preset, chosen: Partial<Options> = {}): Options => ({ ...BASE_OPTIONS, ...preset.options, ...chosen });

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
    const { min, max, step } = rangeFor(preset, key);
    const raw = PROPORTIONAL.has(key) ? motion[key] * change : motion[key] + change;
    motion[key] = clamp(step >= 1 ? Math.round(raw) : raw, min, max);
  }
  return motion;
}

interface PresetExtras {
  options?: Partial<Options>;
  path?: number[];
}
const preset = (name: string, layout: LayoutName, variant: Variant, defaults: Partial<Motion>, extras: PresetExtras = {}): Preset => ({
  name,
  layout,
  variant,
  defaults,
  options: extras.options ?? {},
  path: extras.path,
});

export const PRESETS: Preset[] = [
  preset("Slide 01", "slide", {}, { count: 7, size: 0.9, gap: 0.1 }),
  preset("Slide 02", "slide", {}, { count: 7, size: 0.9, gap: 0.1, rhythm: 1 }),
  preset("Slide 03", "slide", {}, { count: 7, size: 0.8, gap: 0.1, rhythm: 1, stagger: 1 }, { options: { direction: "up" } }),
  preset("Slide 04", "slide", {}, { count: 9, size: 0.7, gap: 0.14, rhythm: 1, fade: 0.3 }),
  preset("Slide 05", "slide", {}, { count: 8, size: 0.75, gap: 0.14, rhythm: 1, stagger: 1, hold: 0.55 }, { options: { direction: "right" } }),
  preset("Focus 01", "slide", {}, { count: 9, size: 0.5, gap: 0.16, rhythm: 1, scale: 2 }, { options: { focus: "centre" } }),
  preset("Focus 02", "slide", {}, { count: 9, size: 0.4, gap: 0.16, rhythm: 1, scale: 2, stagger: 1 }, { options: { focus: "centre", direction: "up" } }),
  preset("Focus 03", "slide", {}, { count: 9, size: 0.48, gap: 0.14, rhythm: 1, scale: 1.9, fade: 0.25 }, { options: { focus: "start" } }),
  preset("Focus 04", "slide", {}, { count: 7, size: 0.7, gap: 0.12, rhythm: 1, scale: 1.6 }, { options: { focus: "centre", solo: true } }),
  preset("Proximity 01", "proximity", {}, { count: 7, size: 0.4, gap: 0.16, scale: 2.1, rhythm: 1, hold: 0.2 }),
  preset("Proximity 02", "proximity", {}, { count: 6, size: 0.32, gap: 0.16, scale: 2.1, rhythm: 1, hold: 0.2 }, { options: { direction: "up" } }),
  preset("Proximity 03", "proximity", { field: true }, { count: 196, size: 0.085, gap: 0.5, scale: 3.6, reach: 3.5, rhythm: 1, hold: 0.15 }, { path: [6, 8, 18, 16] }),
  preset("Proximity 04", "proximity", { field: true }, { count: 144, size: 0.11, gap: 0.45, scale: 3.2, reach: 3.2, rhythm: 1, hold: 0.15, tilt: 40, fade: 0.08 }, { path: [0, 12, 24, 20, 4] }),
  preset("Proximity 05", "proximity", { field: true }, { count: 64, size: 0.2, gap: 0.3, scale: 2.2, reach: 2.4, rhythm: 1, hold: 0.25 }, { path: [12, 2, 14, 22, 10] }),
  preset("Scale 01", "zoom", {}, { count: 6, size: 1, duration: 14 }),
  preset("Scale 02", "zoom", { out: true }, { count: 6, size: 1, duration: 14 }),
  preset("Scale 03", "zoom", {}, { count: 6, size: 1, duration: 14 }, { options: { origin: "up" } }),
  preset("Scale 04", "zoom", {}, { count: 6, size: 1, duration: 14 }, { options: { origin: "left" } }),
  preset("Scale 05", "zoom", {}, { count: 5, size: 1, rhythm: 1, hold: 0.35, duration: 15 }),
  preset("Coverflow 01", "cover", {}, { count: 9, size: 1 }),
  preset("Coverflow 02", "cover", {}, { count: 9, size: 1, rhythm: 1 }),
  preset("Coverflow 03", "cover", {}, { count: 9, size: 0.8, gap: 0.25, tilt: 12, rhythm: 1 }),
  preset("Coverflow 04", "cover", {}, { count: 9, size: 0.75, rhythm: 1, stagger: 1 }, { options: { direction: "up" } }),
  preset("Ring 01", "ring", {}, { count: 10, size: 0.8, gap: 0.14, rhythm: 1 }),
  preset("Ring 02", "ring", {}, { count: 12, size: 0.7, gap: 0.14, tilt: 22 }),
  preset("Ring 03", "ring", { inside: true }, { count: 12, size: 1.1, gap: 0.1 }),
  preset("Ring 04", "ring", { vertical: true }, { count: 10, size: 0.7, gap: 0.16, rhythm: 1 }),
  preset("Ring 05", "ring", {}, { count: 14, size: 0.6, gap: 0.34, tilt: 14, scale: 1.25, perspective: 55, rhythm: 1 }, { options: { focus: "centre" } }),
  preset("Orbit 01", "orbit", {}, { count: 7, size: 0.9, tilt: 28 }, { options: { centre: false } }),
  preset("Orbit 02", "orbit", {}, { count: 8, size: 0.9, tilt: 28 }),
  preset("Orbit 03", "orbit", { two: true }, { count: 12, size: 0.7, tilt: 34, perspective: 40, radius: 0.88 }, { options: { centre: false } }),
  preset("Orbit 04", "orbit", { flat: true }, { count: 7, size: 0.8 }, { options: { centre: false } }),
  preset("Orbit 05", "orbit", {}, { count: 8, size: 0.9, tilt: 20, gap: 0.2, perspective: 50 }, { options: { centre: false, faceCamera: false } }),
  preset("Orbit 06", "orbit", {}, { count: 9, size: 0.7, tilt: 36, radius: 1.25, perspective: 50 }, { options: { centre: false } }),
  preset("Orbit 07", "orbit", { wheel: true }, { count: 10, size: 0.8, gap: 0.3, yaw: 40, tilt: 6, perspective: 45 }, { options: { centre: false } }),
  preset("Orbit 08", "orbit", { wheel: true }, { count: 8, size: 0.8, gap: 0.4, yaw: 28, tilt: 12, perspective: 40, scale: 1.35, rhythm: 1 }, { options: { centre: false, focus: "centre" } }),
  preset("Deck 01", "deck", { fly: "up" }, { count: 6, size: 1.05, gap: 0.3, rhythm: 1 }),
  preset("Deck 02", "deck", { fly: "right" }, { count: 6, size: 1.05, gap: 0.3, rhythm: 1 }),
  preset("Deck 03", "deck", { fly: "spin" }, { count: 6, size: 1, gap: 0.4, rhythm: 1 }),
  preset("Wheel 01", "wheel", {}, { count: 12, size: 0.7, gap: 0.3, rhythm: 1 }),
  preset("Wheel 02", "wheel", { side: true }, { count: 12, size: 0.6, gap: 0.35, rhythm: 1 }),
  preset("Wheel 03", "wheel", { full: true }, { count: 8, size: 0.24, gap: 0.1 }),
  preset("Grid 01", "grid", { pan: "x" }, { count: 24, size: 0.6, gap: 0.1 }),
  preset("Grid 02", "grid", { pan: "diag" }, { count: 36, size: 0.6, gap: 0.1, tilt: 48 }),
  preset("Grid 03", "grid", { pan: "alt" }, { count: 24, size: 0.6, gap: 0.1 }),
  preset("Grid 04", "grid", { pan: "pulse" }, { count: 24, size: 0.55, gap: 0.24 }),
  preset("Grid 05", "tour", {}, { count: 9, size: 1.1, gap: 0.12, rhythm: 1, hold: 0.45 }, { path: [0, 4, 8, 6, 2] }),
  preset("Grid 06", "tour", {}, { count: 16, size: 0.9, gap: 0.1, rhythm: 1, hold: 0.4, tilt: 24 }, { path: [0, 5, 10, 15, 12, 9, 6, 3] }),
  preset("Grid 07", "tour", {}, { count: 12, size: 0.8, gap: 0.1, rhythm: 1, hold: 0.3, distance: 1.5 }, { path: [0, 3, 11, 8] }),
  preset("Marquee 01", "marquee", { rows: 2 }, { count: 16, size: 0.85, gap: 0.1 }),
  preset("Marquee 02", "marquee", { rows: 3 }, { count: 24, size: 0.6, gap: 0.1 }),
  preset("Marquee 03", "marquee", { rows: 4 }, { count: 32, size: 0.6, gap: 0.1, yaw: 26 }),
  preset("Marquee 04", "marquee", { rows: 3 }, { count: 18, size: 0.7, gap: 0.1 }, { options: { direction: "up" } }),
  preset("Marquee 05", "marquee", { rows: 4 }, { count: 32, size: 0.6, gap: 0.1, tilt: 55 }),
  preset("Helix 01", "helix", {}, { count: 12, size: 0.5 }),
  preset("Helix 02", "helix", { horizontal: true }, { count: 12, size: 0.42 }),
  preset("Helix 03", "helix", { tornado: true }, { count: 14, size: 0.4 }),
  preset("Globe 01", "globe", {}, { count: 32, size: 0.22 }),
  preset("Globe 02", "globe", {}, { count: 32, size: 0.22, tilt: 24 }),
  preset("Globe 03", "globe", { close: true }, { count: 48, size: 0.28 }),
  preset("Flip 01", "flip", { axis: "y" }, { count: 5, size: 1.3 }),
  preset("Flip 02", "flip", { axis: "x" }, { count: 5, size: 1.3 }),
  preset("Flip 03", "flip", { cube: true }, { count: 5, size: 1.1 }),
  preset("Tunnel 01", "tunnel", {}, { count: 8, size: 0.55 }),
  preset("Tunnel 02", "tunnel", { spiral: true }, { count: 10, size: 0.5 }),
  preset("Tunnel 03", "tunnel", { sides: true }, { count: 12, size: 1 }),
  preset("Fan 01", "fan", { sway: true }, { count: 7, size: 0.9, gap: 0.2 }),
  preset("Fan 02", "fan", { open: true }, { count: 7, size: 0.9, gap: 0.2 }),
  preset("Wave 01", "wave", {}, { count: 12, size: 0.6, gap: 0.14 }),
  preset("Wave 02", "wave", { ribbon: true }, { count: 12, size: 0.7, gap: 0.1 }),
  preset("Stairs 01", "stairs", {}, { count: 9, size: 0.6, gap: 0.3, rhythm: 1 }),
  preset("Stairs 02", "stairs", {}, { count: 9, size: 0.6, gap: 0.3, tilt: 18, yaw: -32, rhythm: 1 }),
  preset("Float 01", "float", {}, { count: 10, size: 0.5 }),
  preset("Float 02", "float", { drift: true }, { count: 16, size: 0.45 }),
  preset("Pulse 01", "pulse", {}, { count: 5, size: 1.2, hold: 0.5 }),
];

/** The settings that are about the brand, not the motion. They never reset. */
export interface Look {
  /** corner radius, as a share of the card's short side */
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
  radius: 0,
  width: 1080,
  height: 1920,
  cardW: 4,
  cardH: 5,
  background: "#0e0e10",
};

/** A saved setup: which preset, how it was tuned, and how it looks. No media. */
export interface SavedSetup {
  app: "motion-presets";
  version: 2;
  preset: string;
  motion: Motion;
  options: Options;
  easing: Bezier;
  path: number[];
  look: Look;
}

const record = (value: unknown): Record<string, unknown> => (typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {});
const finite = (value: unknown): number | undefined => (typeof value === "number" && Number.isFinite(value) ? value : undefined);
const oneOf = <T extends string>(value: unknown, allowed: readonly T[]): T | undefined => allowed.find((item) => item === value);

/** Reads a saved setup from untrusted JSON. Returns a message when it is not one. */
export function parseSetup(text: string): (Settings & { look: Look }) | string {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return "That file is not valid JSON.";
  }
  const file = record(data);
  if (file.app !== "motion-presets") return "That file is not a saved setup.";
  const found = PRESETS.find((p) => p.name === file.preset);
  if (!found) return `This version has no preset called "${String(file.preset)}".`;

  const motion = presetMotion(found);
  const savedMotion = record(file.motion);
  for (const key of MOTION_KEYS) {
    const value = finite(savedMotion[key]);
    if (value === undefined) continue;
    const { min, max, step } = rangeFor(found, key);
    motion[key] = clamp(step >= 1 ? Math.round(value) : value, min, max);
  }

  const options = presetOptions(found);
  const savedOptions = record(file.options);
  options.direction = oneOf(savedOptions.direction, ["left", "right", "up", "down"] as const) ?? options.direction;
  options.focus = oneOf(savedOptions.focus, ["off", "start", "centre", "end"] as const) ?? options.focus;
  options.tiltMode = oneOf(savedOptions.tiltMode, ["off", "fan", "uniform", "alternate"] as const) ?? options.tiltMode;
  if (typeof savedOptions.solo === "boolean") options.solo = savedOptions.solo;
  if (typeof savedOptions.centre === "boolean") options.centre = savedOptions.centre;
  if (typeof savedOptions.faceCamera === "boolean") options.faceCamera = savedOptions.faceCamera;
  if (typeof savedOptions.loopFade === "boolean") options.loopFade = savedOptions.loopFade;
  options.origin = oneOf(savedOptions.origin, ["centre", "left", "right", "up", "down"] as const) ?? options.origin;

  let easing = BASE_EASING;
  if (Array.isArray(file.easing) && file.easing.length === 4 && file.easing.every((part) => finite(part) !== undefined)) {
    const [x1, y1, x2, y2] = file.easing as number[];
    easing = [clamp(x1), clamp(y1, -1, 2), clamp(x2), clamp(y2, -1, 2)];
  }

  const path = Array.isArray(file.path)
    ? file.path.filter((cell): cell is number => Number.isInteger(cell) && cell >= 0 && cell < 64).slice(0, 64)
    : (found.path ?? []);

  const look = { ...BASE_LOOK };
  const savedLook = record(file.look);
  const radius = finite(savedLook.radius);
  if (radius !== undefined) look.radius = clamp(radius, 0, 0.5);
  const width = finite(savedLook.width);
  if (width !== undefined) look.width = canvasSide(width);
  const height = finite(savedLook.height);
  if (height !== undefined) look.height = canvasSide(height);
  const cardW = finite(savedLook.cardW);
  if (cardW !== undefined && cardW > 0) look.cardW = ratioPart(cardW);
  const cardH = finite(savedLook.cardH);
  if (cardH !== undefined && cardH > 0) look.cardH = ratioPart(cardH);
  if (typeof savedLook.background === "string" && /^#[0-9a-f]{6}$/i.test(savedLook.background)) look.background = savedLook.background;

  return { preset: found, motion, options, easing, path, look };
}
