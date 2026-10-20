/**
 * Drawing the line in and out: eight presets, each a function of t (0 to 1
 * through the loop) that says which stretches of the line are showing and how
 * thick it is. Stretches are fractions of the part of the line that is on the
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
export interface DrawPreset {
  id: string;
  label: string;
  frame: (t: number) => DrawFrame;
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
/** in over 0 to 0.4, hold, out over 0.6 to 1 */
const IN: [number, number] = [0, 0.4];
const OUT: [number, number] = [0.6, 1];

export const DRAW_PRESETS: DrawPreset[] = [
  { id: "draw", label: "Draw in", frame: (t) => one(0, inOut(seg(t, 0, 0.5))) },
  {
    id: "through",
    label: "Draw through",
    frame: (t) => one(inOut(seg(t, ...OUT)), inOut(seg(t, ...IN))),
  },
  {
    id: "rewind",
    label: "Rewind",
    frame: (t) => one(0, inOut(seg(t, ...IN)) * (1 - inOut(seg(t, ...OUT)))),
  },
  {
    id: "snake",
    label: "Snake",
    frame: (t) => {
      const head = inOut(t) * 1.4;
      return one(Math.max(0, head - 0.4), Math.min(1, head));
    },
  },
  {
    id: "middle",
    label: "From the middle",
    frame: (t) => {
      const r = (easeOut(seg(t, ...IN)) - easeIn(seg(t, ...OUT))) / 2;
      return one(0.5 - r, 0.5 + r);
    },
  },
  {
    id: "ends",
    label: "From both ends",
    frame: (t) => {
      const r = (easeOut(seg(t, ...IN)) - easeIn(seg(t, ...OUT))) / 2;
      return { spans: [[0, r], [1 - r, 1]], width: 1 };
    },
  },
  {
    id: "bounce",
    label: "Bounce",
    frame: (t) => one(easeIn(seg(t, 0.65, 1)), bounce(seg(t, 0, 0.5))),
  },
  {
    id: "pop",
    label: "Pop",
    frame: (t) => one(0, 1, Math.max(0, back(seg(t, 0, 0.3)) - backIn(seg(t, 0.75, 1)))),
  },
];

/** The preset at t, reversed if asked: a stretch from a to b becomes 1 - b to 1 - a. */
export function drawFrame(preset: DrawPreset, t: number, reverse: boolean): DrawFrame {
  const f = preset.frame(t);
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
