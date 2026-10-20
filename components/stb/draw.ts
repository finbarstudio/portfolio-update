/**
 * Drawing the line in and out: five presets, each saying which stretches of
 * the line are showing and how thick it is, as it draws in and as it draws out
 * (Snake only runs through). Some change the thickness as they go, and the
 * letters grow and shrink with it. The loop plays in and out, just in, or just out. Stretches are fractions of the part of the line that is on the
 * artwork, so every preset times the same on any format, carousel or seed.
 * Reversed, a preset runs from the other end of the line.
 */
import type { Pathway } from "./pathway";

export type Span = [number, number];
export interface DrawFrame {
  spans: Span[];
  /** thickness, 1 = the format's line */
  width: number;
  /** per stretch, where along the line (0 to 1) its letters stay put as the
   *  thickness changes; the middle of the stretch when left out */
  anchors?: number[];
  /** faint copies of the line drawn first, behind it: a trail */
  ghosts?: Ghost[];
}
/** A faint copy of part of the line. `over`: it is a later part of the line than
 *  the solid one, so it lies on top where they cross; otherwise underneath. */
export interface Ghost {
  spans: Span[];
  alpha: number;
  over: boolean;
  /** rounded ends at the start and end of its stretch: none where it meets the solid line */
  caps: [boolean, boolean];
}
export type DrawMode = "both" | "in" | "out";
export interface DrawPreset {
  id: string;
  label: string;
  /** drawing in, p from 0 (nothing) to 1 (the whole line) */
  in?: (p: number) => DrawFrame;
  /** drawing out, q from 0 (the whole line) to 1 (nothing) */
  out?: (q: number) => DrawFrame;
  /** a preset that only runs through, with no separate in and out */
  loop?: (t: number) => DrawFrame;
  /** what Reverse plays, for a preset that is the same both ways round (otherwise it runs from the other end) */
  reversed?: { in: (p: number) => DrawFrame; out: (q: number) => DrawFrame };
}

const clamp = (v: number) => Math.max(0, Math.min(1, v));
/** progress through the part of the loop from a to b */
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const inOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
const easeIn = (x: number) => x * x * x;
const easeOut = (x: number) => 1 - (1 - x) ** 3;
const back = (x: number) => 1 + 2.7 * (x - 1) ** 3 + 1.7 * (x - 1) ** 2;
/** Trail: faint copies run ahead of the solid line (drawing in) or linger behind it (drawing out) */
const TRAIL = 16;
const LAG = 0.022;
const GHOST = 0.08;
const trailIn = (p: number): DrawFrame => {
  const at = (k: number) => inOut(clamp(p * (1 + TRAIL * LAG) - k * LAG));
  const solid = at(TRAIL);
  return { ...one(0, solid), ghosts: Array.from({ length: TRAIL }, (_, k) => ({ spans: [[solid, at(k)]] as Span[], alpha: GHOST, over: true, caps: [false, true] as [boolean, boolean] })) };
};
const trailOut = (q: number): DrawFrame => {
  const at = (k: number) => inOut(clamp(q * (1 + TRAIL * LAG) - (TRAIL - k) * LAG));
  const solid = at(TRAIL);
  return { ...one(solid, 1), ghosts: Array.from({ length: TRAIL }, (_, k) => ({ spans: [[at(k), solid]] as Span[], alpha: GHOST, over: false, caps: [true, false] as [boolean, boolean] })) };
};
const backIn = (x: number) => 2.7 * x * x * x - 1.7 * x * x;
const one = (a: number, b: number, width = 1): DrawFrame => ({ spans: [[a, b]], width });

export const DRAW_PRESETS: DrawPreset[] = [
  {
    id: "grow",
    label: "Grow",
    in: (p) => ({ ...one(0, inOut(p), 0.15 + 0.85 * easeOut(p)), anchors: [0] }),
    // out: it rewinds, back the way it came, thinning as it goes
    out: (q) => ({ ...one(0, 1 - inOut(q), 1 - 0.85 * easeIn(q)), anchors: [0] }),
  },
  {
    id: "snake",
    label: "Snake",
    loop: (t) => {
      const head = inOut(t) * 1.4;
      return one(Math.max(0, head - 0.4), Math.min(1, head));
    },
  },


  {
    id: "burst",
    label: "Burst",
    in: (p) => one(0.5 - easeOut(p) / 2, 0.5 + easeOut(p) / 2, Math.max(0, back(p))),
    out: (q) => one(easeIn(q) / 2, 1 - easeIn(q) / 2, Math.max(0, 1 - backIn(q))),
    // reversed it bursts in from both ends to meet in the middle, and draws back out to them
    reversed: {
      in: (p) => ({ spans: [[0, easeOut(p) / 2], [1 - easeOut(p) / 2, 1]], width: Math.max(0, back(p)), anchors: [0, 1] }),
      out: (q) => ({ spans: [[0, (1 - easeIn(q)) / 2], [(1 + easeIn(q)) / 2, 1]], width: Math.max(0, 1 - backIn(q)), anchors: [0, 1] }),
    },
  },
  { id: "pop", label: "Pop", in: (p) => one(0, 1, Math.max(0, back(p))), out: (q) => one(0, 1, Math.max(0, 1 - backIn(q))) },
  { id: "trail", label: "Trail", in: trailIn, out: trailOut },

];

/**
 * The preset at t through the loop. In and out: in over the first 40%, a hold,
 * out over the last 40%. In: in over 60%, then hold. Out: hold, then out over
 * the last 60%. Reversed, a stretch from a to b becomes 1 - b to 1 - a.
 */
export function drawFrame(preset: DrawPreset, t: number, mode: DrawMode, reverse: boolean): DrawFrame {
  const own = reverse && preset.reversed;
  const into = own ? preset.reversed!.in : preset.in!;
  const outof = own ? preset.reversed!.out : preset.out!;
  let f: DrawFrame;
  if (preset.loop) f = preset.loop(t);
  else if (mode === "in") f = into(seg(t, 0, 0.6));
  else if (mode === "out") f = outof(seg(t, 0.4, 1));
  else f = t < 0.5 ? into(seg(t, 0, 0.4)) : outof(seg(t, 0.6, 1));
  if (!reverse || own) return f;
  const turn = (spans: Span[]) => spans.map(([a, b]) => [1 - b, 1 - a] as Span);
  return {
    ...f,
    anchors: f.anchors?.map((u) => 1 - u),
    spans: turn(f.spans),
    ghosts: f.ghosts?.map((g) => ({ ...g, spans: turn(g.spans), caps: [g.caps[1], g.caps[0]] })),
  };
}

/**
 * Where the line is on the artwork, as a way to turn a fraction (0 to 1) of
 * the line you can see into a distance along it. Only the pieces on the
 * artwork count, so a preset spends its time where it can be seen, and "the
 * middle" is the middle of what shows, even when the line leaves the artwork
 * and comes back. A piece counts from where the line comes within a line's
 * width of the frame, which runs from x0 to x1 across and 0 to uh down (one
 * panel of a carousel, or the whole artwork).
 */
export function onFrame(path: Pathway, x0: number, x1: number, uh: number, stroke: number): (u: number) => number {
  const { pts, cum } = path;
  const m = stroke;
  const runs: Span[] = [];
  let open = -1;
  const n = pts.length / 2;
  for (let i = 0; i <= n; i++) {
    const on = i < n && pts[i * 2] > x0 - m && pts[i * 2] < x1 + m && pts[i * 2 + 1] > -m && pts[i * 2 + 1] < uh + m;
    if (on && open < 0) open = i;
    if (!on && open >= 0) {
      runs.push([cum[open], cum[i - 1]]);
      open = -1;
    }
  }
  if (!runs.length) runs.push([0, cum[n - 1]]);
  const seen = runs.reduce((sum, [a, b]) => sum + b - a, 0);
  return (u: number) => {
    let left = Math.max(0, Math.min(1, u)) * seen;
    for (const [a, b] of runs) {
      if (left <= b - a) return a + left;
      left -= b - a;
    }
    return runs[runs.length - 1][1];
  };
}
