"use client";

import { useEffect, useRef, useState } from "react";
import { generatePathway, type Pathway } from "./pathway";
import { BRANDS, GRADIENT, colourName, textPresets, type BrandKey } from "./palette";
import { media, corsMedia } from "@/lib/media";
import { hasTransparency, makeSubject, type Mask, type Subject } from "./cutout";

/**
 * Share to Buy pathway maker. One screen, no scroll: controls on the left, the
 * canvas on the right.
 *
 * FORMATS. Three only, the ones social posts use: 1:1, 3:4 and the 9:16 reel,
 * each exported with its long side at 2048.
 *
 * CAROUSEL. One line drawn across 2 to 10 panels side by side, exported as one
 * file per panel that join edge to edge when swiped. The line is generated once
 * for the whole strip and each panel is a window onto it, so the
 * line, the gradient and the scrolling text all carry straight across the
 * joins. Every panel shares the same loop length, so each video loops cleanly
 * on its own and they all stay in step.
 *
 * The canvas on screen is a preview (the strip is drawn at half size, to keep
 * it quick). Every download is drawn fresh at full size, off screen.
 */

const LONG = 2048;
/** Shown under the title. Bump it with every release Finbar asks to push:
 *  1.0 first release (1 Oct 2026), 1.1 carousels and post preview (5 Oct),
 *  1.2 fixed thickness, upright text, pack, colour codes (15 Oct),
 *  1.3 LinkedIn 5:4 landscape (19 Oct), 1.4 photo with a cut-out, custom format (19 Oct). */
const VERSION = "1.4";
/** `stroke` is the line thickness, fixed per format (decided Oct 2026, no choice in the tool):
 *  px on a 1080 short side, and the same share of the short side at any size. */
const SIZES = [
  { label: "1:1", w: LONG, h: LONG, stroke: 150 },
  { label: "3:4", w: 1536, h: LONG, stroke: 150 },
  { label: "Reel 9:16", w: 1152, h: LONG, stroke: 200 },
  // LinkedIn landscape, 4:5 turned on its side
  { label: "LinkedIn 5:4", w: LONG, h: 1638, stroke: 150 },
];
/**
 * A custom format, typed in: a ratio ("4:3", "1.91:1") drawn with the long side
 * at LONG, or exact pixels ("1200x628"). Kept between 1:3 and 3:1, and 512 to
 * 4096 px on the long side. The line is the standard 150 thickness.
 */
const CUSTOM_RATIO_MAX = 3;
const CUSTOM_PX = [512, 4096];
function parseCustom(text: string): { w: number; h: number } | string {
  const m = text.trim().match(/^(\d+(?:\.\d+)?)\s*([:x×*])\s*(\d+(?:\.\d+)?)$/i);
  if (!m) return "A ratio like 4:3, or pixels like 1200x628";
  const a = Number(m[1]);
  const b = Number(m[3]);
  if (!a || !b) return "Both sides need a number";
  const r = a / b;
  if (r > CUSTOM_RATIO_MAX || r < 1 / CUSTOM_RATIO_MAX) return "Keep it between 1:3 and 3:1";
  if (m[2] === ":") return r >= 1 ? { w: LONG, h: Math.round(LONG / r) } : { w: Math.round(LONG * r), h: LONG };
  const long = Math.max(a, b);
  if (long < CUSTOM_PX[0] || long > CUSTOM_PX[1]) return `${CUSTOM_PX[0]} to ${CUSTOM_PX[1]} px on the long side`;
  return { w: Math.round(a), h: Math.round(b) };
}

/** Panels in a carousel: 2 to 10, 3 to start with. */
const PANELS_MIN = 2;
const PANELS_MAX = 10;

/** The gradient always runs ALONG the line, like water in a pipe. This is how
 *  much line one full run of the colours covers (short side = 1). */
const FLOW_PERIOD = 2.5;

const FONT = '"Share to Buy", system-ui, sans-serif';
/** The brand face lives in the media bucket, so it is registered from script
 *  (CSS may not point at /media). Fonts are always fetched with CORS. */
const FONT_FILES = [
  ["400", "/media/lab/pathway/share-to-buy-regular.woff2"],
  ["700", "/media/lab/pathway/share-to-buy-bold.woff2"],
] as const;

type Alpha = "none" | "bg" | "line";

interface Look {
  bg: string;
  line: string;
  alpha: Alpha;
  text: string;
  /** One colour per repeat of the text, in turn. */
  textColours: string[];
  /** Line thickness, as a share of the short side. */
  stroke: number;
  /** Turns every stretch of text the other way up (for when the automatic choice reads wrong). */
  flip: boolean;
  /** A photo in place of the background colour, and the subject cut out of it. */
  photo?: PhotoLook;
}

type Place = "behind" | "wrap" | "front";

interface PhotoLook {
  img: CanvasImageSource;
  /** the photo's size, px */
  pw: number;
  ph: number;
  /** the whole strip, in line units (short side of one panel = 1) */
  uw: number;
  uh: number;
  /** the cut-out, at the photo's size, or null until one is added */
  subject: HTMLCanvasElement | null;
  place: Place;
  /** stretches (point indices) drawn over the subject when the line wraps round it */
  front: [number, number][];
  /** draw only the cut-out, on grey, to judge a model */
  showMask: boolean;
}

/** Where the photo sits, covering the whole strip, in px at short side S. */
function photoRect(ph: PhotoLook, S: number) {
  const k = Math.max(ph.uw / ph.pw, ph.uh / ph.ph);
  const dw = ph.pw * k;
  const dh = ph.ph * k;
  return { x: ((ph.uw - dw) / 2) * S, y: ((ph.uh - dh) / 2) * S, w: dw * S, h: dh * S, k };
}

/**
 * Wrapping the line round the subject: every pass of the line across the subject
 * goes in front for its first half and behind for its second (or the other way
 * round), so it reads as passing round the person rather than over or under.
 */
function wrapRanges(path: Pathway, ph: PhotoLook, mask: Mask, stroke: number, swap: boolean): [number, number][] {
  const r = photoRect(ph, 1);
  const pts = path.pts;
  const last = pts.length / 2 - 1;
  const inside = (i: number) => {
    const px = Math.floor((pts[i * 2] - r.x) / r.k * (mask.width / ph.pw));
    const py = Math.floor((pts[i * 2 + 1] - r.y) / r.k * (mask.height / ph.ph));
    if (px < 0 || py < 0 || px >= mask.width || py >= mask.height) return false;
    return mask.data[py * mask.width + px] > 127;
  };
  const out: [number, number][] = [];
  let start = -1;
  for (let i = 0; i <= last + 1; i++) {
    const on = i <= last && inside(i);
    if (on && start < 0) start = i;
    if (!on && start >= 0) {
      const a = start, b = i - 1;
      // a pass shorter than the line is wide is just clipping an edge: leave it behind
      if (path.cum[b] - path.cum[a] > stroke) {
        const mid = Math.round((a + b) / 2);
        out.push(swap ? [mid, b] : [a, mid]);
      }
      start = -1;
    }
  }
  return out;
}

const RGB = GRADIENT.map((hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
});

/** The gradient as a loop: t = 0 and t = 1 are the same colour. */
function flowColour(t: number) {
  const f = (((t % 1) + 1) % 1) * RGB.length;
  const i = Math.floor(f) % RGB.length;
  const a = RGB[i];
  const b = RGB[(i + 1) % RGB.length];
  const k = f - Math.floor(f);
  return `rgb(${a.map((v, c) => Math.round(v + (b[c] - v) * k)).join(",")})`;
}

/** Index of the last point at or before distance d along the line. */
function locate(cum: number[], d: number) {
  let lo = 0;
  let hi = cum.length - 2;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (cum[mid] <= d) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

/**
 * Add points from..to to the current path as smooth curves, not straight
 * pieces. Each curve leaves a point in the direction the next one arrives in
 * (a Catmull-Rom spline through the walk's points), so there is no corner at
 * any point and nothing for the renderer to join.
 *
 * That matters: fed hundreds of short straight pieces, Safari and iOS treat
 * the tiny turn between two of them as no turn at all and skip the join, which
 * leaves a long thin wedge of background showing on the outside of every bend.
 * Chrome does not. With curves there is no join to skip.
 *
 * The directions always come from the whole line, never from the stretch being
 * drawn, so a stretch laid over the line sits exactly on it.
 */
function trace(ctx: CanvasRenderingContext2D, pts: number[], S: number, from: number, to: number) {
  const last = pts.length / 2 - 1;
  const x = (i: number) => pts[Math.max(0, Math.min(last, i)) * 2] * S;
  const y = (i: number) => pts[Math.max(0, Math.min(last, i)) * 2 + 1] * S;
  ctx.moveTo(x(from), y(from));
  for (let i = from; i < to; i++) {
    ctx.bezierCurveTo(
      x(i) + (x(i + 1) - x(i - 1)) / 6,
      y(i) + (y(i + 1) - y(i - 1)) / 6,
      x(i + 1) - (x(i + 2) - x(i)) / 6,
      y(i + 1) - (y(i + 2) - y(i)) / 6,
      x(i + 1),
      y(i + 1),
    );
  }
}

/** Stroke points from..to of the line. */
function strokeLine(ctx: CanvasRenderingContext2D, path: Pathway, S: number, from: number, to: number, look: Look, gPhase: number) {
  const { pts, cum } = path;
  if (look.alpha === "line") ctx.globalCompositeOperation = "destination-out"; // cut the line out of the background
  if (look.line === "gradient" && look.alpha !== "line") {
    // No canvas gradient can follow a curve, so the line goes down as short
    // pieces, each its own colour, each overlapping the next to hide the seams.
    for (let i = from; i < to; i++) {
      ctx.strokeStyle = flowColour(cum[i] / FLOW_PERIOD - gPhase);
      ctx.beginPath();
      trace(ctx, pts, S, i, Math.min(i + 2, to));
      ctx.stroke();
    }
  } else {
    ctx.strokeStyle = look.line === "gradient" ? "#000" : look.line; // (a cut-out line has no colour of its own)
    ctx.beginPath();
    trace(ctx, pts, S, from, to);
    ctx.stroke();
  }
  ctx.globalCompositeOperation = "source-over";
}

/**
 * How far either side of a crossing (in line units) the upper stretch has to be
 * laid down again to cover the lower one completely. Two bands of width w that
 * cross at an angle a overlap for (w / 2)(1 / sin a + 1 / tan a) either side of
 * the crossing along the upper one, so a shallow crossing needs a much longer
 * patch than a square one. A little extra covers the curve of the line.
 */
function overWindow(path: Pathway, k: number, stroke: number) {
  const { pts } = path;
  const last = pts.length / 2 - 1;
  const heading = (i: number) => {
    const a = Math.max(0, i - 3), b = Math.min(last, i + 3);
    return Math.atan2(pts[b * 2 + 1] - pts[a * 2 + 1], pts[b * 2] - pts[a * 2]);
  };
  const sin = Math.max(Math.abs(Math.sin(heading(path.over[k]) - heading(path.under[k]))), 0.42);
  return (stroke / 2) * (1 / sin + Math.sqrt(1 - sin * sin) / sin) + stroke * 0.35;
}

interface Stretch {
  /** px along the line */
  a: number;
  b: number;
  /** true: text reads from a towards b. false: it reads from b back towards a. */
  fwd: boolean;
}

/**
 * The line cut into stretches by which way it heads, so every letter sits the
 * right way up: where the line runs right to left, that stretch's text is laid
 * out from its far end and turned round. It only switches once the line is
 * clearly heading the other way, so a near-vertical wobble does not flip it back
 * and forth, and a stretch shorter than two line-widths takes its neighbour's
 * way. `flip` turns every stretch round.
 */
function stretches(path: Pathway, S: number, strokePx: number, flip: boolean): Stretch[] {
  const { pts, cum } = path;
  const last = pts.length / 2 - 1;
  const across = (i: number) => {
    const a = Math.max(0, i - 3), b = Math.min(last, i + 3);
    return (pts[b * 2] - pts[a * 2]) / (Math.hypot(pts[b * 2] - pts[a * 2], pts[b * 2 + 1] - pts[a * 2 + 1]) || 1);
  };
  let fwd = across(0) >= 0;
  let list: Stretch[] = [{ a: 0, b: cum[last] * S, fwd }];
  for (let i = 1; i < last; i++) {
    const c = across(i);
    if ((fwd && c < -0.3) || (!fwd && c > 0.3)) {
      fwd = !fwd;
      list[list.length - 1].b = cum[i] * S;
      list.push({ a: cum[i] * S, b: cum[last] * S, fwd });
    }
  }
  const fuse = (l: Stretch[]) =>
    l.reduce<Stretch[]>((out, st) => {
      const prev = out[out.length - 1];
      if (prev && prev.fwd === st.fwd) prev.b = st.b;
      else out.push({ ...st });
      return out;
    }, []);
  for (let guard = 0; guard < 50; guard++) {
    const k = list.findIndex((st) => st.b - st.a < strokePx * 2);
    if (k < 0 || list.length < 2) break;
    list[k].fwd = (list[k - 1] ?? list[k + 1]).fwd;
    list = fuse(list);
  }
  return flip ? list.map((st) => ({ ...st, fwd: !st.fwd })) : list;
}

/**
 * The ticker: the text repeated along the line, each repeat in the next colour.
 * tPhase 0 to 1 slides it forward by one full set of colours, so a loop joins up.
 * `range` (px along the line) limits it to the letters around one stretch.
 */
function ticker(ctx: CanvasRenderingContext2D, text: string, strokePx: number) {
  const size = strokePx * 0.42;
  ctx.font = `700 ${size}px ${FONT}`;
  const chars = [...text.toUpperCase()];
  const widths = chars.map((ch) => ctx.measureText(ch).width);
  const tracking = size * 0.1;
  /** One repeat of the text plus the gap after it, in px. */
  const period = widths.reduce((a, b) => a + b + tracking, 0) + size * 1.5;
  return { size, chars, widths, tracking, period };
}

interface Glyph {
  ch: string;
  x: number;
  y: number;
  /** radians */
  angle: number;
  colour: string;
}

/**
 * Where every letter of the ticker goes. Shared by the canvas and the SVG export.
 * Each stretch reads the right way up (see stretches()); a forwards stretch uses
 * the layout measured from the start of the line, a turned one the layout
 * measured from the end, so both scroll and loop exactly as before. Letters keep
 * a small gap either side of a change of way.
 */
function layoutText(ctx: CanvasRenderingContext2D, path: Pathway, S: number, look: Look, strokePx: number, tPhase: number, range?: [number, number]) {
  const { size, chars, widths, tracking, period } = ticker(ctx, look.text, strokePx);
  const { pts, cum } = path;
  const total = cum[cum.length - 1] * S;
  const n = look.textColours.length;
  const shift = tPhase * n * period;
  const pad = size * 0.35;
  const glyphs: Glyph[] = [];
  for (const st of stretches(path, S, strokePx, look.flip)) {
    const lo = st.a > 0 ? st.a + pad : -Infinity;
    const hi = st.b < total ? st.b - pad : Infinity;
    // the repeats that can land in this stretch, measured from whichever end it reads from
    const from = st.fwd ? st.a : total - st.b;
    const to = st.fwd ? st.b : total - st.a;
    for (let k = Math.floor((from - shift) / period) - 1; k * period + shift < to; k++) {
      const colour = look.textColours[((k % n) + n) % n];
      let s = k * period + shift;
      for (let c = 0; c < chars.length; c++) {
        const half = widths[c] / 2;
        const at = st.fwd ? s + half : total - (s + half);
        s += widths[c] + tracking;
        if (at - half < lo || at + half > hi) continue;
        if (at < 0 || at >= total || (range && (at < range[0] || at > range[1]))) continue;
        const i = locate(cum, at / S);
        const t = (at / S - cum[i]) / (cum[i + 1] - cum[i] || 1);
        const x0 = pts[i * 2], y0 = pts[i * 2 + 1], x1 = pts[i * 2 + 2], y1 = pts[i * 2 + 3];
        glyphs.push({
          ch: chars[c],
          x: (x0 + (x1 - x0) * t) * S,
          y: (y0 + (y1 - y0) * t) * S,
          angle: Math.atan2(y1 - y0, x1 - x0) + (st.fwd ? 0 : Math.PI),
          colour,
        });
      }
    }
  }
  return { size, glyphs };
}

function drawText(ctx: CanvasRenderingContext2D, path: Pathway, S: number, look: Look, strokePx: number, tPhase: number, range?: [number, number]) {
  const { size, glyphs } = layoutText(ctx, path, S, look, strokePx, tPhase, range);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const g of glyphs) {
    ctx.fillStyle = g.colour;
    ctx.save();
    ctx.translate(g.x, g.y);
    ctx.rotate(g.angle);
    // The face sits a touch high on its middle line; nudge to centre the caps.
    ctx.fillText(g.ch, 0, size * 0.04);
    ctx.restore();
  }
}

/**
 * Draw one picture: a window w by h onto the line, starting `ox` px along it
 * from the left. S is the px size of the short side of ONE panel, which is the
 * unit the line is measured in. A single image is ox = 0; the second panel of
 * a carousel is ox = one panel's width, and so on.
 */
function render(ctx: CanvasRenderingContext2D, w: number, h: number, S: number, ox: number, path: Pathway, look: Look, gPhase: number, tPhase: number) {
  const last = path.pts.length / 2 - 1;
  const ph = look.photo;
  const pr = ph && photoRect(ph, S);
  ctx.globalCompositeOperation = "source-over";
  ctx.clearRect(0, 0, w, h);
  ctx.save();
  ctx.translate(-ox, 0);
  if (ph && pr && ph.showMask) {
    ctx.fillStyle = "#8a8a8a";
    ctx.fillRect(ox, 0, w, h);
    if (ph.subject) ctx.drawImage(ph.subject, pr.x, pr.y, pr.w, pr.h);
    ctx.restore();
    return;
  }
  if (look.alpha !== "bg") {
    if (ph && pr) ctx.drawImage(ph.img, pr.x, pr.y, pr.w, pr.h);
    else {
      ctx.fillStyle = look.bg;
      ctx.fillRect(ox, 0, w, h);
    }
  }
  const STROKE = look.stroke;
  ctx.lineWidth = STROKE * S;
  ctx.lineJoin = "round";
  ctx.lineCap = "butt";
  strokeLine(ctx, path, S, 0, last, look, gPhase);
  if (look.text) {
    drawText(ctx, path, S, look, STROKE * S, tPhase);
    // Where the line passes over itself, two runs of text would collide. Lay the
    // upper stretch down again over the whole overlap, then its own letters on
    // top, so the text underneath slides out of sight beneath it.
    for (const [k, j] of path.over.entries()) {
      const win = overWindow(path, k, STROKE);
      const at = path.cum[j];
      strokeLine(ctx, path, S, locate(path.cum, at - win), Math.min(last, locate(path.cum, at + win) + 1), look, gPhase);
      drawText(ctx, path, S, look, STROKE * S, tPhase, [(at - win - STROKE) * S, (at + win + STROKE) * S]);
    }
  }
  // The subject laid back over the line, so the line passes behind them. On a
  // transparent export it punches the line out instead. Wrapping then lays the
  // in-front halves down again on top.
  if (ph && pr && ph.subject && ph.place !== "front" && look.alpha !== "line") {
    if (look.alpha === "bg") ctx.globalCompositeOperation = "destination-out";
    ctx.drawImage(ph.subject, pr.x, pr.y, pr.w, pr.h);
    ctx.globalCompositeOperation = "source-over";
    if (ph.place === "wrap") {
      for (const [a, b] of ph.front) {
        strokeLine(ctx, path, S, a, Math.min(last, b + 1), look, gPhase);
        if (look.text) drawText(ctx, path, S, look, STROKE * S, tPhase, [path.cum[a] * S, path.cum[b] * S]);
      }
    }
  }
  ctx.restore();
}

/**
 * The same picture as an SVG, for Illustrator or Figma.
 *
 * The line is ONE path with a stroke, so its width and colour stay editable.
 * It is drawn as smooth curves through every sixth point of the walk rather
 * than hundreds of tiny straight pieces. The gradient is the one exception:
 * SVG has no gradient that follows a curve, so a gradient line exports as
 * short coloured pieces, exactly as the canvas draws it.
 *
 * `ox` picks the window, as in render(): the file shows w by h starting ox px
 * along, by its viewBox, so a carousel panel is the same drawing cropped.
 *
 * Text stays live text in Share to Buy Bold (the font must be installed where
 * the file is opened), one letter each, already placed and turned.
 */
function buildSvg(ctx: CanvasRenderingContext2D, w: number, h: number, S: number, ox: number, path: Pathway, look: Look) {
  const r = (v: number) => Math.round(v * 10) / 10;
  const { pts, cum } = path;
  const last = pts.length / 2 - 1;
  const sw = r(look.stroke * S);

  /** Points from..to as one smooth path (Catmull-Rom through every `step`th point). */
  const curve = (from: number, to: number, step = 6) => {
    const idx: number[] = [];
    for (let i = from; i < to; i += step) idx.push(i);
    idx.push(to);
    const P = idx.map((i) => [pts[i * 2] * S, pts[i * 2 + 1] * S]);
    let d = `M${r(P[0][0])} ${r(P[0][1])}`;
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
      d += `C${r(p1[0] + (p2[0] - p0[0]) / 6)} ${r(p1[1] + (p2[1] - p0[1]) / 6)} ${r(p2[0] - (p3[0] - p1[0]) / 6)} ${r(p2[1] - (p3[1] - p1[1]) / 6)} ${r(p2[0])} ${r(p2[1])}`;
    }
    return d;
  };

  const flow = look.line === "gradient" && look.alpha !== "line";
  const defs: string[] = [];
  const paint = look.line === "gradient" ? "#000" : look.line;

  /** The line, or a stretch of it, as markup. */
  const line = (from: number, to: number, stroke = paint) => {
    if (!flow) return `<path d="${curve(from, to)}" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;
    let out = "";
    for (let i = from; i < to; i++) {
      const e = Math.min(i + 2, to);
      let d = `M${r(pts[i * 2] * S)} ${r(pts[i * 2 + 1] * S)}`;
      for (let j = i + 1; j <= e; j++) d += `L${r(pts[j * 2] * S)} ${r(pts[j * 2 + 1] * S)}`;
      out += `<path d="${d}" stroke="${flowColour(cum[i] / FLOW_PERIOD)}"/>`;
    }
    return `<g fill="none" stroke-width="${sw}">${out}</g>`;
  };

  const text = (range?: [number, number]) => {
    const { size, glyphs } = layoutText(ctx, path, S, look, look.stroke * S, 0, range);
    const letters = glyphs
      .map((g) => `<text fill="${g.colour}" transform="translate(${r(g.x)} ${r(g.y)}) rotate(${r((g.angle * 180) / Math.PI)})">${g.ch === "&" ? "&amp;" : g.ch === "<" ? "&lt;" : g.ch}</text>`)
      .join("");
    return `<g font-family="Share to Buy" font-weight="700" font-size="${r(size)}" text-anchor="middle" dominant-baseline="central">${letters}</g>`;
  };

  // The stretches that pass over another, and so hide its text.
  const overs = look.text
    ? path.over.map((j, k) => {
        const win = overWindow(path, k, look.stroke);
        return {
          from: locate(cum, cum[j] - win),
          to: Math.min(last, locate(cum, cum[j] + win) + 1),
          range: [(cum[j] - win - look.stroke) * S, (cum[j] + win + look.stroke) * S] as [number, number],
        };
      })
    : [];

  const body: string[] = [];
  const box = `x="${ox}" y="0" width="${w}" height="${h}"`;
  const rect = `<rect ${box} fill="${look.bg}"/>`;
  if (look.alpha === "line") {
    // The line is a hole in the background: a mask, still one stroked path.
    defs.push(`<mask id="cut" maskUnits="userSpaceOnUse" ${box}><rect ${box} fill="#fff"/>${line(0, last, "#000")}</mask>`);
    body.push(`<g mask="url(#cut)">${rect}</g>`);
    if (look.text) {
      if (overs.length) {
        defs.push(`<mask id="under" maskUnits="userSpaceOnUse" ${box}><rect ${box} fill="#fff"/>${overs.map((o) => line(o.from, o.to, "#000")).join("")}</mask>`);
        body.push(`<g mask="url(#under)">${text()}</g>`);
        for (const o of overs) body.push(text(o.range));
      } else body.push(text());
    }
  } else {
    if (look.alpha !== "bg") body.push(rect);
    body.push(line(0, last));
    if (look.text) {
      body.push(text());
      for (const o of overs) body.push(line(o.from, o.to), text(o.range));
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${ox} 0 ${w} ${h}">${defs.length ? `<defs>${defs.join("")}</defs>` : ""}${body.join("")}</svg>`;
}

const pause = (ms = 0) => new Promise((r) => setTimeout(r, ms));

function save(blob: Blob, name: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(d: Uint8Array) {
  let c = 0xffffffff;
  for (let i = 0; i < d.length; i++) c = CRC[(c ^ d[i]) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/** A zip with every file stored as it is (PNGs are compressed already, so there is nothing to gain). */
function zip(files: { name: string; data: Uint8Array<ArrayBuffer> }[]) {
  const now = new Date();
  const time = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
  const date = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
  const out: Uint8Array<ArrayBuffer>[] = [];
  const central: Uint8Array<ArrayBuffer>[] = [];
  let offset = 0;
  for (const f of files) {
    const name = new TextEncoder().encode(f.name);
    const crc = crc32(f.data);
    const local = new Uint8Array(30 + name.length);
    const l = new DataView(local.buffer);
    l.setUint32(0, 0x04034b50, true);
    l.setUint16(4, 20, true);
    l.setUint16(6, 0x0800, true); // names are UTF-8
    l.setUint16(10, time, true);
    l.setUint16(12, date, true);
    l.setUint32(14, crc, true);
    l.setUint32(18, f.data.length, true);
    l.setUint32(22, f.data.length, true);
    l.setUint16(26, name.length, true);
    local.set(name, 30);
    const entry = new Uint8Array(46 + name.length);
    const e = new DataView(entry.buffer);
    e.setUint32(0, 0x02014b50, true);
    e.setUint16(4, 20, true);
    e.setUint16(6, 20, true);
    e.setUint16(8, 0x0800, true);
    e.setUint16(12, time, true);
    e.setUint16(14, date, true);
    e.setUint32(16, crc, true);
    e.setUint32(20, f.data.length, true);
    e.setUint32(24, f.data.length, true);
    e.setUint16(28, name.length, true);
    e.setUint32(42, offset, true);
    entry.set(name, 46);
    out.push(local, f.data);
    central.push(entry);
    offset += local.length + f.data.length;
  }
  const size = central.reduce((a, c) => a + c.length, 0);
  const end = new Uint8Array(22);
  const d = new DataView(end.buffer);
  d.setUint32(0, 0x06054b50, true);
  d.setUint16(8, files.length, true);
  d.setUint16(10, files.length, true);
  d.setUint32(12, size, true);
  d.setUint32(16, offset, true);
  return new Blob([...out, ...central, end], { type: "application/zip" });
}

/** The colour codes, to copy. A gradient is one row that opens to show its colours. */
function Colours({ bg, line, text }: { bg: string; line: string; text: string[] }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState("");
  // open from the start on a wide screen; on a phone it would cover the picture
  useEffect(() => setOpen(window.innerWidth > 760), []);
  const copy = (hex: string) => {
    navigator.clipboard?.writeText(hex).then(() => {
      setCopied(hex);
      setTimeout(() => setCopied((c) => (c === hex ? "" : c)), 1200);
    });
  };
  const row = (label: string, hex: string, key = label + hex) => (
    <div className="stb-crow" key={key}>
      <i style={{ background: hex }} />
      <span>
        {label}
        <small>{colourName(hex)}</small>
      </span>
      <button type="button" onClick={() => copy(hex)} title="Copy">
        {copied === hex ? "Copied" : hex}
      </button>
    </div>
  );
  return (
    <div className="stb-colours" data-open={open ? "1" : "0"}>
      <button type="button" className="stb-colours-head" aria-expanded={open} onClick={() => setOpen(!open)}>
        Colours
      </button>
      {open && (
        <div className="stb-colours-body">
          {row("Background", bg)}
          {line === "gradient" ? (
            <details>
              <summary>
                <i style={{ background: `linear-gradient(90deg, ${GRADIENT.join(",")})` }} />
                <span>
                  Line
                  <small>Live gradient</small>
                </span>
              </summary>
              {GRADIENT.map((hex) => row("", hex))}
            </details>
          ) : (
            row("Line", line)
          )}
          {text.map((hex) => row("Text", hex, `t${hex}`))}
        </div>
      )}
    </div>
  );
}

function Slider({ label, value, min, max, step, onChange, show }: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; show?: string;
}) {
  return (
    <label className="stb-slider">
      <span>{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      <output>{show ?? value}</output>
    </label>
  );
}

export default function PathwayTool() {
  const [brand, setBrand] = useState<BrandKey>("stb");
  const [combo, setCombo] = useState(0);
  /** an index into SIZES, or SIZES.length for the custom format */
  const [size, setSize] = useState(0);
  const [customText, setCustomText] = useState("4:3");
  const [custom, setCustom] = useState({ w: LONG, h: 1536 });
  const [carousel, setCarousel] = useState(false);
  /** The panel count as typed, so the box can be cleared while typing. */
  const [panelsText, setPanelsText] = useState("3");
  /** Show the canvas inside a mock social post, one panel at a time. */
  const [social, setSocial] = useState(false);
  const [slide, setSlide] = useState(0);
  const [seed, setSeed] = useState(1);
  const [p, setP] = useState({ rMin: 0.28, rMax: 0.75, length: 5, loop: 0.3, maxCross: 1 });
  const [text, setText] = useState("");
  const [textPreset, setTextPreset] = useState(0);
  const [flipText, setFlipText] = useState(false);
  /** How fast the text travels: % of the short side per second. */
  const [textSpeed, setTextSpeed] = useState(5);
  const [alpha, setAlpha] = useState<Alpha>("none");
  const [animateGradient, setAnimateGradient] = useState(false);
  /** The gradient flows back towards the start of the line instead of away from it. */
  const [reverseFlow, setReverseFlow] = useState(false);
  const [scrollText, setScrollText] = useState(false);
  const [gradientSecs, setGradientSecs] = useState(8);
  /** The length of one seamless loop, worked out in the draw effect. */
  const [loopSecs, setLoopSecs] = useState(8);
  /** null, or how far through an export we are (0 to 1). */
  const [progress, setProgress] = useState<number | null>(null);
  const [packing, setPacking] = useState(false);
  // A photo behind the line, and the subject cut out of it (made elsewhere, brought in as a PNG)
  const [photo, setPhoto] = useState<{ bmp: ImageBitmap; name: string } | null>(null);
  const [cutoutPng, setCutoutPng] = useState<{ bmp: ImageBitmap; name: string } | null>(null);
  const [place, setPlace] = useState<Place>("behind");
  const [swapWrap, setSwapWrap] = useState(false);
  const [showMask, setShowMask] = useState(false);
  const recording = progress !== null;
  const [fontReady, setFontReady] = useState(false);

  useEffect(() => {
    Promise.all(
      FONT_FILES.map(([weight, file]) => new FontFace("Share to Buy", `url("${corsMedia(media(file))}")`, { weight }).load()),
    )
      .then((faces) => {
        for (const face of faces) document.fonts.add(face);
        setFontReady(true);
      })
      .catch(() => setFontReady(true)); // draw in the fallback face rather than not at all
  }, []);

  // The cut-out is laid over the background at the background's size.
  const [subject, setSubject] = useState<Subject | null>(null);
  useEffect(() => {
    setSubject(photo && cutoutPng ? makeSubject(cutoutPng.bmp, photo.bmp.width, photo.bmp.height) : null);
  }, [photo, cutoutPng]);

  const loadImage = async (file: File) => {
    const raw = await createImageBitmap(file, { imageOrientation: "from-image" });
    // 2560 on the long side is plenty for a 2048 export
    const k = Math.min(1, 2560 / Math.max(raw.width, raw.height));
    return k < 1 ? createImageBitmap(raw, { resizeWidth: Math.round(raw.width * k), resizeHeight: Math.round(raw.height * k), resizeQuality: "high" }) : raw;
  };

  const addPhoto = async (file: File | undefined) => {
    if (!file?.type.startsWith("image/")) return;
    setPhoto({ bmp: await loadImage(file), name: file.name });
  };

  const addCutout = async (file: File | undefined) => {
    if (!file?.type.startsWith("image/")) return;
    setCutoutPng({ bmp: await loadImage(file), name: file.name });
  };

  /** Files dropped on the stage: one with a transparent background is the cut-out, any other the photo. */
  const addDropped = async (files: FileList | undefined) => {
    for (const file of Array.from(files ?? [])) {
      if (!file.type.startsWith("image/")) continue;
      const bmp = await loadImage(file);
      if (hasTransparency(bmp)) setCutoutPng({ bmp, name: file.name });
      else setPhoto({ bmp, name: file.name });
    }
  };

  const canvas = useRef<HTMLCanvasElement>(null);
  const clock = useRef(0); // when the loop last started
  const drag = useRef<number | null>(null);

  const customError = (() => {
    const c = parseCustom(customText);
    return typeof c === "string" ? c : null;
  })();
  const format = size < SIZES.length ? SIZES[size] : { label: `Custom ${customText.trim()}`, ...custom, stroke: 150 };
  const { w, h } = format;
  const short = Math.min(w, h);
  const panels = Math.min(PANELS_MAX, Math.max(PANELS_MIN, Math.round(Number(panelsText)) || 3));
  const n = carousel ? panels : 1;
  /** The whole strip: one panel, or n side by side. */
  const stripW = w * n;
  /** The canvas on screen: full size for one image, smaller for a strip. */
  const view = carousel ? Math.min(0.5, 1.5 / n) : 1;
  const colours = BRANDS[brand].combos[combo];
  const live = brand === "live";
  const isGradient = colours.line === "gradient";
  const shownText = live ? text.trim() : "";
  const gradientMoves = animateGradient && isGradient;
  const textMoves = scrollText && shownText !== "";
  const moving = gradientMoves || textMoves;
  const stroke = format.stroke / 1080;
  const presets = textPresets(colours.line);
  // A strip is n panels of ground to cover, so the line is that much longer.
  const path = generatePathway(seed, stripW / short, h / short, { ...p, length: p.length * (carousel ? 0.8 * n : 1), stroke, panels: n });
  const at = Math.min(slide, n - 1);

  const photoLook: PhotoLook | undefined = photo
    ? {
        img: photo.bmp,
        pw: photo.bmp.width,
        ph: photo.bmp.height,
        uw: stripW / short,
        uh: h / short,
        subject: subject?.layer ?? null,
        place,
        front: [],
        showMask: showMask && !!subject,
      }
    : undefined;
  if (photoLook && subject && place === "wrap") photoLook.front = wrapRanges(path, photoLook, subject.mask, stroke, swapWrap);

  const look: Look = {
    bg: colours.bg,
    line: colours.line,
    // Video has no transparency, so anything that moves is always solid.
    alpha: moving ? "none" : alpha,
    text: shownText,
    textColours: (presets[textPreset] ?? presets[0]).colours,
    flip: flipText,
    stroke,
    photo: photoLook,
  };

  /**
   * One loop, so that a video always joins up with itself. Scrolling text sets
   * the length: the time it takes to travel one full set of its colours at the
   * chosen speed, after which every letter and colour is back where it began.
   * The gradient then fits a whole number of runs into that time. With no
   * scrolling text the loop is simply the gradient's own length. It is the
   * same for every panel of a carousel. S is the short side being drawn at.
   */
  const timing = (ctx: CanvasRenderingContext2D, S: number) => {
    if (!textMoves) return { secs: gradientSecs, cycles: 1 };
    const set = ticker(ctx, look.text, stroke * S).period * look.textColours.length;
    const secs = set / ((textSpeed / 100) * S);
    return { secs, cycles: Math.max(1, Math.round(secs / gradientSecs)) };
  };
  /** Where the gradient is, t (0 to 1) through the loop. Reversed, it runs the other way. */
  const flowAt = (t: number, cycles: number) => {
    if (!gradientMoves) return 0;
    const at = (t * cycles) % 1;
    return reverseFlow ? (1 - at) % 1 : at;
  };
  /** Draw panel `i` at full size, at t (0 to 1) through the loop. */
  const drawPanel = (ctx: CanvasRenderingContext2D, i: number, t: number, cycles: number) =>
    render(ctx, w, h, short, i * w, path, look, flowAt(t, cycles), textMoves ? t : 0);

  useEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    const S = short * view;
    const { secs, cycles } = timing(ctx, S);
    if (Math.abs(secs - loopSecs) > 0.01) setLoopSecs(secs);
    let raf = 0;
    const draw = () => {
      const t = moving ? ((performance.now() - clock.current) / 1000 / secs) % 1 : 0;
      render(ctx, stripW * view, h * view, S, 0, path, look, flowAt(t, cycles), textMoves ? t : 0);
      if (moving && !recording) raf = requestAnimationFrame(draw); // an export takes the processor; the preview holds
    };
    draw();
    return () => cancelAnimationFrame(raf);
    // Runs after every render: any control changing, or the font arriving, redraws.
  });

  const set = (patch: Partial<typeof p>) => setP({ ...p, ...patch });
  const restart = () => { clock.current = performance.now(); };
  const base = `${brand}-pathway-${seed}-${w}x${h}`;
  const fileName = (i: number, ext: string) => `${base}${n > 1 ? `-${i + 1}of${n}` : ""}.${ext}`;
  const files = n > 1 ? ` · ${n} files` : "";

  /** A full-size canvas, off screen, for the downloads. */
  const sheet = () => {
    const el = document.createElement("canvas");
    el.width = w;
    el.height = h;
    return { el, ctx: el.getContext("2d")! };
  };

  // Stills: a moving gradient or text exports as its first frame. A carousel
  // saves one file per panel, a moment apart so the browser lets them all through.
  const downloadPng = async () => {
    const { el, ctx } = sheet();
    for (let i = 0; i < n; i++) {
      drawPanel(ctx, i, 0, 1);
      const blob = await new Promise<Blob | null>((r) => el.toBlob(r, "image/png"));
      if (blob) save(blob, fileName(i, "png"));
      await pause(350);
    }
  };
  const downloadSvg = async () => {
    const { ctx } = sheet();
    for (let i = 0; i < n; i++) {
      save(new Blob([buildSvg(ctx, w, h, short, i * w, path, look)], { type: "image/svg+xml" }), fileName(i, "svg"));
      await pause(350);
    }
  };

  /**
   * Everything in one zip: per panel the artwork, the line on its own and the
   * background with the line cut out; one plain background (the same for every
   * panel); and a README with the colours. Stills, at the first frame.
   */
  const downloadPack = async () => {
    setPacking(true);
    try {
      const { el, ctx } = sheet();
      const png = async () => {
        const blob = await new Promise<Blob | null>((r) => el.toBlob(r, "image/png"));
        return new Uint8Array(await blob!.arrayBuffer());
      };
      const tag = (i: number) => (n > 1 ? `-${i + 1}of${n}` : "");
      const files: { name: string; data: Uint8Array<ArrayBuffer> }[] = [];
      const kinds: [Alpha, string][] = [["none", "artwork"], ["bg", "line"], ["line", "cut-out"]];
      for (const [alpha, kind] of kinds) {
        for (let i = 0; i < n; i++) {
          render(ctx, w, h, short, i * w, path, { ...look, alpha }, 0, 0);
          files.push({ name: `${base}-${kind}${tag(i)}.png`, data: await png() });
          await pause();
        }
      }
      ctx.globalCompositeOperation = "source-over";
      if (look.photo) {
        // a photo differs slide to slide, so each gets its own background, and the subject on its own
        const pr = photoRect(look.photo, short);
        for (let i = 0; i < n; i++) {
          ctx.clearRect(0, 0, w, h);
          ctx.drawImage(look.photo.img, pr.x - i * w, pr.y, pr.w, pr.h);
          files.push({ name: `${base}-background${tag(i)}.png`, data: await png() });
          if (look.photo.subject) {
            ctx.clearRect(0, 0, w, h);
            ctx.drawImage(look.photo.subject, pr.x - i * w, pr.y, pr.w, pr.h);
            files.push({ name: `${base}-subject${tag(i)}.png`, data: await png() });
          }
        }
      } else {
        ctx.fillStyle = look.bg;
        ctx.fillRect(0, 0, w, h);
        files.push({ name: `${base}-background.png`, data: await png() });
      }
      const lineColours = look.line === "gradient" ? `Live gradient: ${GRADIENT.map((c) => `${colourName(c)} ${c}`).join(", ")}` : `${colourName(look.line)} ${look.line}`;
      const readme = [
        `Share to Buy pathway, seed ${seed}`,
        `${format.label}, ${w} x ${h} px${n > 1 ? `, carousel of ${n} (1of${n} is the first slide)` : ""}`,
        "",
        "FILES",
        `${base}-artwork*.png     the finished artwork`,
        `${base}-line*.png        the line on its own, on a transparent background`,
        `${base}-cut-out*.png     the background with the line cut out of it`,
        ...(look.photo
          ? [`${base}-background*.png  the photo on its own`, `${base}-subject*.png     the cut-out on its own, on a transparent background`]
          : [`${base}-background.png   the plain background colour${n > 1 ? ", the same for every slide" : ""}`]),
        "",
        "COLOURS",
        `Background  ${colourName(look.bg)} ${look.bg}`,
        `Line        ${lineColours}`,
        ...(look.text ? [`Text        ${look.textColours.map((c) => `${colourName(c)} ${c}`).join(", ")}`] : []),
        "",
        "These are a colour pairing from the brand guidelines. Keep them together as they are.",
        "",
      ].join("\r\n");
      files.push({ name: "README.txt", data: new TextEncoder().encode(readme) });
      save(zip(files), `${base}-pack.zip`);
    } finally {
      setPacking(false);
    }
  };

  /**
   * MP4, one loop per panel. Frames are drawn and encoded one at a time, not
   * filmed off the screen, so frame N is exactly t = N / total and the last
   * frame runs straight back into the first, whatever the computer's speed.
   * Every panel gets the same frames at the same times, so they stay in step.
   */
  const exportVideo = async () => {
    if (recording) return;
    if (typeof VideoEncoder === "undefined") {
      window.alert("This browser cannot export video. Use Chrome, Edge or Safari.");
      return;
    }
    setProgress(0);
    try {
      const { Muxer, ArrayBufferTarget } = await import("mp4-muxer");
      const { el, ctx } = sheet();
      const fps = 30;
      const { secs, cycles } = timing(ctx, short);
      const total = Math.max(1, Math.round(secs * fps));
      for (let panel = 0; panel < n; panel++) {
        const muxer = new Muxer({ target: new ArrayBufferTarget(), video: { codec: "avc", width: w, height: h }, fastStart: "in-memory" });
        const encoder = new VideoEncoder({
          output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
          error: (e) => console.error(e),
        });
        encoder.configure({ codec: "avc1.640033", width: w, height: h, bitrate: 16_000_000, framerate: fps });
        for (let i = 0; i < total; i++) {
          drawPanel(ctx, panel, i / total, cycles);
          const picture = new VideoFrame(el, { timestamp: (i * 1e6) / fps, duration: 1e6 / fps });
          encoder.encode(picture, { keyFrame: i % 60 === 0 });
          picture.close();
          if (i % 5 === 0) {
            setProgress((panel + i / total) / n);
            await pause(); // let the encoder and the screen catch up
          }
          while (encoder.encodeQueueSize > 8) await pause(5);
        }
        await encoder.flush();
        muxer.finalize();
        save(new Blob([muxer.target.buffer], { type: "video/mp4" }), fileName(panel, "mp4"));
        await pause(350);
      }
    } finally {
      restart();
      setProgress(null);
    }
  };

  const go = (to: number) => setSlide(Math.max(0, Math.min(n - 1, to)));

  return (
    <div className="stb-tool" data-font={fontReady ? "in" : "wait"}>
      <aside className="stb-panel">
        <h1>
          Pathway maker <span className="stb-version">v{VERSION}</span>
        </h1>

        <section>
          <h2>Brand</h2>
          <div className="stb-seg">
            {(Object.keys(BRANDS) as BrandKey[]).map((b) => (
              <button key={b} type="button" aria-pressed={brand === b} onClick={() => { setBrand(b); setCombo(0); }}>
                {BRANDS[b].label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2>Colours</h2>
          <div className="stb-swatches">
            {BRANDS[brand].combos.map((c, i) => (
              <button
                key={c.name}
                type="button"
                title={c.name}
                aria-label={c.name}
                aria-pressed={combo === i}
                style={{
                  background: c.bg,
                  ["--line" as string]: c.line === "gradient" ? `linear-gradient(90deg, ${GRADIENT.join(",")})` : c.line,
                }}
                onClick={() => setCombo(i)}
              />
            ))}
          </div>
          <p className="stb-note">{colours.name}</p>
        </section>

        <section>
          <h2>Photo</h2>
          <div className="stb-photo-row">
            <label className="stb-file">
              <input type="file" accept="image/*" onChange={(e) => { addPhoto(e.target.files?.[0]); e.target.value = ""; }} />
              {photo ? "Change background" : "Add background"}
            </label>
            <label className="stb-file">
              <input type="file" accept="image/png,image/webp" onChange={(e) => { addCutout(e.target.files?.[0]); e.target.value = ""; }} />
              {cutoutPng ? "Change cut-out" : "Add cut-out"}
            </label>
            {(photo || cutoutPng) && (
              <button type="button" className="stb-link" onClick={() => { setPhoto(null); setCutoutPng(null); setShowMask(false); }}>
                Remove
              </button>
            )}
          </div>
          {subject && (
            <>
              <div className="stb-seg stb-seg-gap">
                {(["behind", "wrap", "front"] as Place[]).map((pl) => (
                  <button key={pl} type="button" aria-pressed={place === pl} onClick={() => setPlace(pl)}>
                    {pl === "behind" ? "Behind" : pl === "wrap" ? "Round" : "In front"}
                  </button>
                ))}
              </div>
              {place === "wrap" && (
                <label className="stb-check">
                  <input type="checkbox" checked={swapWrap} onChange={(e) => setSwapWrap(e.target.checked)} />
                  Swap which half goes in front
                </label>
              )}
              <label className="stb-check">
                <input type="checkbox" checked={showMask} onChange={(e) => setShowMask(e.target.checked)} />
                Show the cut-out
              </label>
            </>
          )}
        </section>

        <section>
          <h2>Format</h2>
          <div className="stb-seg stb-seg-wrap">
            {SIZES.map((s, i) => (
              <button key={s.label} type="button" aria-pressed={size === i} onClick={() => setSize(i)}>
                {s.label}
              </button>
            ))}
            <button type="button" aria-pressed={size === SIZES.length} onClick={() => setSize(SIZES.length)}>
              Custom
            </button>
          </div>
          {size === SIZES.length && (
            <label className="stb-custom">
              <input
                type="text"
                className="stb-text"
                value={customText}
                aria-label="Ratio or size, for example 4:3 or 1200x628"
                placeholder="4:3 or 1200x628"
                spellCheck={false}
                onChange={(e) => {
                  setCustomText(e.target.value);
                  const c = parseCustom(e.target.value);
                  if (typeof c !== "string") setCustom(c);
                }}
              />
              <span className="stb-note" data-warn={customError ? "1" : undefined}>{customError ?? `${custom.w} × ${custom.h}`}</span>
            </label>
          )}
          <div className="stb-seg stb-seg-gap">
            <button type="button" aria-pressed={!carousel} onClick={() => { setCarousel(false); setSlide(0); }}>Single</button>
            <button type="button" aria-pressed={carousel} onClick={() => setCarousel(true)}>Carousel</button>
            {carousel && (
              <label className="stb-panels">
                <input
                  type="number"
                  min={PANELS_MIN}
                  max={PANELS_MAX}
                  value={panelsText}
                  aria-label={`Slides, ${PANELS_MIN} to ${PANELS_MAX}`}
                  onChange={(e) => { setPanelsText(e.target.value); setSlide(0); }}
                  onBlur={() => setPanelsText(String(panels))}
                />
                <span>slides</span>
              </label>
            )}
          </div>
        </section>

        <section>
          <h2>Pathway</h2>
          <div className="stb-seed">
            <button type="button" className="stb-primary" onClick={() => setSeed(Math.floor(Math.random() * 1_000_000))}>
              New pathway
            </button>
            <label>
              <span>Seed</span>
              <input type="number" value={seed} onChange={(e) => setSeed(Number(e.target.value) || 0)} />
            </label>
          </div>
          <Slider label="Tightest bend" value={p.rMin} min={0.15} max={0.5} step={0.01} onChange={(v) => set({ rMin: v, rMax: Math.max(p.rMax, v) })} />
          <Slider label="Widest bend" value={p.rMax} min={0.2} max={1.5} step={0.01} onChange={(v) => set({ rMax: v, rMin: Math.min(p.rMin, v) })} />
          <Slider label="Length" value={p.length} min={2} max={10} step={0.25} onChange={(v) => set({ length: v })} />
          <Slider label="Loops" value={p.loop} min={0} max={1} step={0.05} onChange={(v) => set({ loop: v })} />
          <Slider label="Overlaps" value={p.maxCross} min={0} max={2} step={1} onChange={(v) => set({ maxCross: v })} show={`up to ${p.maxCross}`} />
        </section>

        {live && (
          <section>
            <h2>Ticker text</h2>
            <input className="stb-text" type="text" placeholder="FREE EVENT" value={text} onChange={(e) => setText(e.target.value)} />
            <div className="stb-presets">
              {presets.map((t, i) => (
                <button key={t.name} type="button" title={t.name} aria-label={`Text colour: ${t.name}`} aria-pressed={(presets[textPreset] ? textPreset : 0) === i} onClick={() => setTextPreset(i)}>
                  {t.colours.map((c) => (
                    <i key={c} style={{ background: c }} />
                  ))}
                </button>
              ))}
              <span className="stb-note">{(presets[textPreset] ?? presets[0]).name}</span>
            </div>
            <label className="stb-check">
              <input type="checkbox" checked={flipText} onChange={(e) => setFlipText(e.target.checked)} />
              Flip the text
            </label>
            <label className="stb-check">
              <input type="checkbox" checked={scrollText} onChange={(e) => { restart(); setScrollText(e.target.checked); }} />
              Scroll the text
            </label>
            {scrollText && <Slider label="Speed" value={textSpeed} min={1} max={25} step={1} onChange={setTextSpeed} />}
          </section>
        )}

        {isGradient && (
          <section>
            <h2>Gradient</h2>
            <label className="stb-check">
              <input type="checkbox" checked={animateGradient} onChange={(e) => { restart(); setAnimateGradient(e.target.checked); }} />
              Flow along the path
            </label>
            {animateGradient && (
              <label className="stb-check">
                <input type="checkbox" checked={reverseFlow} onChange={(e) => setReverseFlow(e.target.checked)} />
                Reverse the flow
              </label>
            )}
            {animateGradient && (
              <Slider label="One run" value={gradientSecs} min={2} max={20} step={1} onChange={setGradientSecs} show={textMoves ? `~${gradientSecs}s` : `${gradientSecs}s`} />
            )}
          </section>
        )}

        <section className="stb-export">
          <h2>Export</h2>
          <div className="stb-seg">
            {(["none", "bg", "line"] as Alpha[]).map((a) => (
              <button key={a} type="button" aria-pressed={look.alpha === a} disabled={moving} onClick={() => setAlpha(a)}>
                {a === "none" ? "Solid" : a === "bg" ? "No background" : "No line"}
              </button>
            ))}
          </div>
          <div className="stb-pair">
            <button type="button" className="stb-primary" onClick={downloadPng} disabled={recording}>
              Download PNG
            </button>
            <button type="button" className="stb-primary" onClick={downloadSvg} disabled={recording || !!photo} title={photo ? "Not with a photo: use the PNG or the pack" : undefined}>
              Download SVG
            </button>
          </div>
          <button type="button" className="stb-primary stb-pack" onClick={downloadPack} disabled={recording || packing}>
            {packing ? "Making the pack" : "Download pack (zip)"}
          </button>
          {moving && (
            <button type="button" className="stb-primary" onClick={exportVideo} disabled={recording}>
              {recording ? `Making the video ${Math.round((progress ?? 0) * 100)}%` : `Download MP4 · ${loopSecs.toFixed(1)}s loop`}
            </button>
          )}
          <p className="stb-note">
            {w} × {h}{files} · seed {seed} · {path.crossings} overlap{path.crossings === 1 ? "" : "s"}
            {path.clean ? "" : " · closest fit, try another"}
          </p>
          <a className="stb-back" href="/" target="_blank" rel="noopener">Back to the lab</a>
        </section>
      </aside>

      <main
        className="stb-stage"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); addDropped(e.dataTransfer.files); }}
      >
        <Colours bg={colours.bg} line={colours.line} text={look.text ? look.textColours : []} />
        <button type="button" className="stb-toggle" aria-pressed={social} onClick={() => { setSocial(!social); setSlide(0); }}>
          {social ? "Show the artwork" : "Preview as a post"}
        </button>
        <div
          className="stb-frame"
          data-social={social ? "1" : "0"}
          style={{ ["--r" as string]: (social ? w : stripW) / h, ["--n" as string]: n, ["--at" as string]: social ? at : 0 }}
        >
          {social && (
            <div className="stb-post-head">
              <i aria-hidden="true" />
              <b>sharetobuy</b>
            </div>
          )}
          <div
            className="stb-view"
            onPointerDown={(e) => { drag.current = e.clientX; }}
            onPointerUp={(e) => {
              // a swipe moves one panel, as it does on a phone
              if (social && drag.current !== null && Math.abs(e.clientX - drag.current) > 30) go(at + (e.clientX < drag.current ? 1 : -1));
              drag.current = null;
            }}
          >
            <canvas ref={canvas} width={Math.round(stripW * view)} height={Math.round(h * view)} />
            {/* where one panel ends and the next begins */}
            {!social && Array.from({ length: n - 1 }, (_, i) => <span key={i} className="stb-cut" style={{ left: `${((i + 1) / n) * 100}%` }} aria-hidden="true" />)}
            {social && n > 1 && at > 0 && <button type="button" className="stb-nav is-prev" aria-label="Previous" onClick={() => go(at - 1)}>‹</button>}
            {social && n > 1 && at < n - 1 && <button type="button" className="stb-nav is-next" aria-label="Next" onClick={() => go(at + 1)}>›</button>}
            {social && n > 1 && <span className="stb-count">{at + 1}/{n}</span>}
          </div>
          {social && (
            <div className="stb-post-foot">
              <span className="stb-icons" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M12 20.5s-7.5-4.4-7.5-10A4.3 4.3 0 0 1 12 8a4.3 4.3 0 0 1 7.5 2.5c0 5.600-7.5 10-7.500 10z" /></svg>
                <svg viewBox="0 0 24 24"><path d="M20.500 11.500a8.500 8.500 0 0 1-12.600 7.400L3.500 20.500l1.600-4.400A8.500 8.500 0 1 1 20.500 11.500z" /></svg>
                <svg viewBox="0 0 24 24"><path d="M21 3 10.500 13.500M21 3l-6.500 18-4-7.500L3 9.500z" /></svg>
              </span>
              {n > 1 && (
                <span className="stb-pips" aria-hidden="true">
                  {Array.from({ length: n }, (_, i) => <i key={i} data-on={i === at ? "1" : "0"} />)}
                </span>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
