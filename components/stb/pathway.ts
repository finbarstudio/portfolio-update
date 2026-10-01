/**
 * The Share to Buy pathway: one thick line of constant width that meanders like
 * a river, may loop over itself once or twice, and runs off the canvas at both
 * ends so the frame reads as a crop of something bigger.
 *
 * It is drawn by walking: a point moves forward in small steps while its turn
 * rate eases between a series of bends (each a radius and a sweep). Easing the
 * turn rate, not the heading, is what keeps it free of kinks, and no bend is
 * ever tighter than the tightest radius allowed.
 *
 * A walk is random, so most are not good compositions. Each seed tries walks
 * in a fixed order and keeps the first that passes the checks in `score`, which
 * makes a seed always give the same line.
 *
 * Units: the short side of the canvas is 1. A 16:9 canvas is 1.78 by 1.
 */

export interface PathParams {
  /** Line thickness. Fixed by the tool: 150px on a 1080 x 1920 reel, the same share of the short side elsewhere. */
  stroke: number;
  /** Tightest and widest bend radius. */
  rMin: number;
  rMax: number;
  /** How much line to lay down before heading for an edge. */
  length: number;
  /** 0 to 1: how often a bend carries on round into a loop. */
  loop: number;
  /** How many times the line may cross itself inside the frame. */
  maxCross: number;
}

export interface Pathway {
  /** x0, y0, x1, y1 ... */
  pts: number[];
  /** Distance along the line at each point. */
  cum: number[];
  crossings: number;
  /** Where the line passes over itself: the point index on the upper (later) stretch. */
  over: number[];
  /** False when no walk passed every check and the closest one was used. */
  clean: boolean;
}

const DS = 0.01;
const ATTEMPTS = 500;

function mulberry32(a: number) {
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rad = (deg: number) => (deg * Math.PI) / 180;

function walk(rng: () => number, W: number, H: number, p: PathParams): number[] | null {
  const out = p.stroke / 2 + 0.04; // both ends must be at least this far outside
  const far = 0.9; // how far it may wander off before coming back
  const rMin = Math.max(p.rMin, p.stroke * 1.25); // a loop must keep a hole in it
  const rMax = Math.max(p.rMax, rMin);

  // Start just outside one edge, pointed at somewhere in the middle.
  const edge = Math.floor(rng() * 4);
  const t = 0.15 + 0.7 * rng();
  let x = edge === 0 ? -out : edge === 1 ? W + out : t * W;
  let y = edge === 2 ? -out : edge === 3 ? H + out : t * H;
  const tx = W * (0.25 + 0.5 * rng());
  const ty = H * (0.25 + 0.5 * rng());
  let th = Math.atan2(ty - y, tx - x) + (rng() - 0.5) * 0.6;

  const pts = [x, y];
  let k = 0;
  let sign = rng() < 0.5 ? 1 : -1;
  let total = 0;

  const step = (target: number, ease: number) => {
    k += (target - k) * Math.min(1, DS / ease);
    th += k * DS;
    x += Math.cos(th) * DS;
    y += Math.sin(th) * DS;
    pts.push(x, y);
  };

  while (total < p.length) {
    const loop = rng() < p.loop;
    const r = loop ? lerp(rMin, Math.min(rMax, rMin * 1.5), rng()) : lerp(rMin, rMax, rng());
    const sweep = loop ? rad(210 + 110 * rng()) : rad(60 + 110 * rng());
    const len = r * sweep;
    for (let s = 0; s < len; s += DS) {
      step(sign / r, 0.6 * r);
      if (x < -far || x > W + far || y < -far || y > H + far) return null;
    }
    total += len;
    if (rng() < 0.8) sign = -sign;
  }

  // Straighten out and leave.
  const tail = k * 0.25;
  let extra = 0;
  while (x > -out && x < W + out && y > -out && y < H + out) {
    step(tail, 0.2);
    extra += DS;
    if (extra > 4) return null;
  }
  return pts;
}

function crosses(
  ax: number, ay: number, bx: number, by: number,
  cx: number, cy: number, dx: number, dy: number,
) {
  const d1 = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
  const d2 = (bx - ax) * (dy - ay) - (by - ay) * (dx - ax);
  const d3 = (dx - cx) * (ay - cy) - (dy - cy) * (ax - cx);
  const d4 = (dx - cx) * (by - cy) - (dy - cy) * (bx - cx);
  return d1 * d2 < 0 && d3 * d4 < 0;
}

/** Number of problems with a walk (0 is a keeper) and its visible crossings. */
function score(pts: number[], W: number, H: number, p: PathParams) {
  const every = 3;
  const n = Math.floor(pts.length / 2 / every);
  const xs = new Array<number>(n);
  const ys = new Array<number>(n);
  for (let i = 0; i < n; i++) {
    xs[i] = pts[i * every * 2];
    ys[i] = pts[i * every * 2 + 1];
  }
  const sp = DS * every;
  const pad = p.stroke / 2;
  const vis = (i: number) => xs[i] > -pad && xs[i] < W + pad && ys[i] > -pad && ys[i] < H + pad;

  let bad = 0;

  // Crossings: counted only where they show, and they must cross cleanly, not
  // slide along each other.
  const cross: [number, number][] = [];
  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 3; j < n - 1; j++) {
      if (!crosses(xs[i], ys[i], xs[i + 1], ys[i + 1], xs[j], ys[j], xs[j + 1], ys[j + 1])) continue;
      if (!vis(i)) continue;
      cross.push([i, j]);
      const a = Math.atan2(ys[i + 1] - ys[i], xs[i + 1] - xs[i]);
      const b = Math.atan2(ys[j + 1] - ys[j], xs[j + 1] - xs[j]);
      const between = Math.abs(Math.asin(Math.sin(a - b)));
      if (between < rad(50)) bad += 2;
    }
  }
  if (cross.length > p.maxCross) bad += 3 * (cross.length - p.maxCross);

  // Clearance: away from a crossing, two stretches of line keep a gap between
  // them so they never merge into a blob.
  const need = p.stroke * 1.35;
  const skip = Math.ceil((1.2 * need) / sp);
  const win = Math.ceil((1.3 * need) / sp);
  let tight = 0;
  for (let i = 0; i < n; i++) {
    if (!vis(i)) continue;
    for (let j = i + skip; j < n; j++) {
      if (!vis(j)) continue;
      const dx = xs[i] - xs[j];
      const dy = ys[i] - ys[j];
      if (dx * dx + dy * dy >= need * need) continue;
      if (!cross.some(([ci, cj]) => Math.abs(i - ci) <= win && Math.abs(j - cj) <= win)) tight++;
    }
  }
  if (tight > 0) bad += 1 + Math.floor(tight / 20);

  // Composition: enough line on show, and spread across the frame.
  let seen = 0;
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (let i = 0; i < n; i++) {
    if (xs[i] < 0 || xs[i] > W || ys[i] < 0 || ys[i] > H) continue;
    seen++;
    x0 = Math.min(x0, xs[i]); x1 = Math.max(x1, xs[i]);
    y0 = Math.min(y0, ys[i]); y1 = Math.max(y1, ys[i]);
  }
  if (seen * sp < Math.max(1.2, 0.4 * p.length)) bad += 2;
  if (x1 - x0 < 0.6 * W || y1 - y0 < 0.6 * H) bad += 1;

  return { bad, crossings: cross.length, over: cross.map(([, j]) => j * every) };
}

export function generatePathway(seed: number, W: number, H: number, p: PathParams): Pathway {
  let best: { pts: number[]; bad: number; crossings: number; over: number[] } | null = null;
  for (let a = 0; a < ATTEMPTS; a++) {
    const rng = mulberry32((Math.imul(seed | 0, 2654435761) + Math.imul(a, 40503)) | 0);
    const pts = walk(rng, W, H, p);
    if (!pts) continue;
    const s = score(pts, W, H, p);
    if (!best || s.bad < best.bad) best = { pts, ...s };
    if (s.bad === 0) break;
  }
  const pts = best?.pts ?? [0, H / 2, W, H / 2];
  const cum = [0];
  for (let i = 2; i < pts.length; i += 2) {
    cum.push(cum[cum.length - 1] + Math.hypot(pts[i] - pts[i - 2], pts[i + 1] - pts[i - 1]));
  }
  return { pts, cum, crossings: best?.crossings ?? 0, over: best?.over ?? [], clean: best?.bad === 0 };
}
