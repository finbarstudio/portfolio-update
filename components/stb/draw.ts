/**
 * Drawing the line in and out: eight presets, each saying which stretches of
 * the line are showing and how thick it is, as it draws in and as it draws out
 * (Snake only runs through). The loop plays in and out, just in, or just out. Stretches are fractions of the part of the line that is on the
 * artwork, so every preset times the same on any format, carousel or seed.
 * Reversed, a preset runs from the other end of the line.
 */
import type { Pathway } from "./pathway";

export type Span = [number, number];
export interface DrawFrame {
  spans: Span[];
  /** thickness, 1 = the format's line */
  width: number;
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
}

const clamp = (v: number) => Math.max(0, Math.min(1, v));
/** progress through the part of the loop from a to b */
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const inOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
const easeIn = (x: number) => x * x * x;
const easeOut = (x: number) => 1 - (1 - x) ** 3;
const back = (x: number) => 1 + 2.7 * (x - 1) ** 3 + 1.7 * (x - 1) ** 2;
const backIn = (x: number) => 2.7 * x * x * x - 1.7 * x * x;
function bounce(x: number) {
  const n = 7.5625, d = 2.75;
  if (x < 1 / d) return n * x * x;
  if (x < 2 / d) return n * (x -= 1.5 / d) * x + 0.75;
  if (x < 2.5 / d) return n * (x -= 2.25 / d) * x + 0.9375;
  return n * (x -= 2.625 / d) * x + 0.984375;
}

const one = (a: number, b: number, width = 1): DrawFrame => ({ spans: [[a, b]], width });
const DASHES = 7;

export const DRAW_PRESETS: DrawPreset[] = [
  { id: "through", label: "Draw through", in: (p) => one(0, inOut(p)), out: (q) => one(inOut(q), 1) },
  { id: "rewind", label: "Rewind", in: (p) => one(0, inOut(p)), out: (q) => one(0, 1 - inOut(q)) },
  {
    id: "snake",
    label: "Snake",
    loop: (t) => {
      const head = inOut(t) * 1.4;
      return one(Math.max(0, head - 0.4), Math.min(1, head));
    },
  },
  {
    id: "middle",
    label: "From the middle",
    in: (p) => one(0.5 - easeOut(p) / 2, 0.5 + easeOut(p) / 2),
    out: (q) => one(easeIn(q) / 2, 1 - easeIn(q) / 2),
  },
  {
    id: "ends",
    label: "From both ends",
    in: (p) => ({ spans: [[0, easeOut(p) / 2], [1 - easeOut(p) / 2, 1]], width: 1 }),
    out: (q) => ({ spans: [[0, (1 - easeIn(q)) / 2], [(1 + easeIn(q)) / 2, 1]], width: 1 }),
  },
  { id: "bounce", label: "Bounce", in: (p) => one(0, bounce(p)), out: (q) => one(easeIn(q), 1) },
  { id: "pop", label: "Pop", in: (p) => one(0, 1, Math.max(0, back(p))), out: (q) => one(0, 1, Math.max(0, 1 - backIn(q))) },
  {
    id: "dashes",
    label: "Dashes",
    in: (p) => ({ spans: Array.from({ length: DASHES }, (_, k) => [k / DASHES, (k + inOut(p)) / DASHES] as Span), width: 1 }),
    out: (q) => ({ spans: Array.from({ length: DASHES }, (_, k) => [(k + inOut(q)) / DASHES, (k + 1) / DASHES] as Span), width: 1 }),
  },
];

/**
 * The preset at t through the loop. In and out: in over the first 40%, a hold,
 * out over the last 40%. In: in over 60%, then hold. Out: hold, then out over
 * the last 60%. Reversed, a stretch from a to b becomes 1 - b to 1 - a.
 */
export function drawFrame(preset: DrawPreset, t: number, mode: DrawMode, reverse: boolean): DrawFrame {
  let f: DrawFrame;
  if (preset.loop) f = preset.loop(t);
  else if (mode === "in") f = preset.in!(seg(t, 0, 0.6));
  else if (mode === "out") f = preset.out!(seg(t, 0.4, 1));
  else f = t < 0.5 ? preset.in!(seg(t, 0, 0.4)) : preset.out!(seg(t, 0.6, 1));
  return reverse ? { ...f, spans: f.spans.map(([a, b]) => [1 - b, 1 - a]) } : f;
}

/**
 * Where the line is on the artwork, as distances along it: from the point it
 * first comes within a line's width of the frame to the point it last leaves.
 * The line runs on beyond the frame at both ends, and the presets should spend
 * their time where it can be seen.
 */
export function onFrame(path: Pathway, uw: number, uh: number, stroke: number): Span {
  const { pts, cum } = path;
  const m = stroke;
  let first = -1;
  let last = -1;
  for (let i = 0; i < pts.length / 2; i++) {
    const x = pts[i * 2], y = pts[i * 2 + 1];
    if (x > -m && x < uw + m && y > -m && y < uh + m) {
      if (first < 0) first = i;
      last = i;
    }
  }
  return first < 0 ? [0, cum[cum.length - 1]] : [cum[first], cum[last]];
}
