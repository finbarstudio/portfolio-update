/**
 * watermark — the finbar✶studio mark stamped onto every exported frame.
 *
 * MVP is free but always watermarked: a large, centred wordmark at ~30% opacity
 * (using the real brand star, not a font glyph) plus a subtle finbar.studio
 * backlink in the bottom-right. Removing it is the future paid unlock — every
 * export call sites this behind a single `if (!licensed)` gate (see
 * useMockupExport), which is the whole monetization seam.
 */

import { STAR_POINTS } from "@/components/brand-star";

export type WatermarkOptions = {
  /** Resolution scale so the mark stays proportional at any export size. */
  scale?: number;
  /** Reserved (kept for call-site compatibility). */
  tiled?: boolean;
};

const URL_TEXT = "finbar.studio";
const PRE = "finbar";
const POST = "studio";
const PINK = "#E8718B";

/** Draw the brand star (the real polygon mark) centred at (cx,cy), `size` wide. */
function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  fill: string,
): void {
  const pts = STAR_POINTS.split(" ");
  ctx.beginPath();
  for (let i = 0; i < pts.length; i++) {
    const [px, py] = pts[i].split(",").map(Number);
    const X = cx + (px / 100 - 0.5) * size;
    const Y = cy + (py / 100 - 0.5) * size;
    if (i === 0) ctx.moveTo(X, Y);
    else ctx.lineTo(X, Y);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

/** Draw the watermark onto a 2D context sized `width`×`height` (device px). */
export function drawWatermark(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  opts: WatermarkOptions = {},
): void {
  const s = opts.scale ?? Math.max(1, Math.min(width, height) / 360);

  // ── Big centred wordmark at ~5% opacity (barely-there) ─────────────────────
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";

  // Size the wordmark to ~72% of the frame width (star ≈ 0.8em, small gaps).
  const starRatio = 0.8;
  const gapRatio = 0.14;
  const base = 100;
  ctx.font = `700 ${base}px ui-sans-serif, system-ui, sans-serif`;
  const unit =
    (ctx.measureText(PRE).width + ctx.measureText(POST).width) / base +
    starRatio +
    gapRatio * 2;
  const fs = (width * 0.72) / unit;
  const starSize = fs * starRatio;
  const gap = fs * gapRatio;

  ctx.font = `700 ${fs}px ui-sans-serif, system-ui, sans-serif`;
  const preW = ctx.measureText(PRE).width;
  const postW = ctx.measureText(POST).width;
  const totalW = preW + gap + starSize + gap + postW;
  let x = (width - totalW) / 2;
  const cy = height / 2;

  // A soft shadow keeps the mark legible over both light and dark content.
  ctx.shadowColor = "rgba(0,0,0,0.18)";
  ctx.shadowBlur = fs * 0.04;

  ctx.fillStyle = "#ffffff";
  ctx.fillText(PRE, x, cy);
  x += preW + gap;
  drawStar(ctx, x + starSize / 2, cy, starSize, PINK);
  x += starSize + gap;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(POST, x, cy);
  ctx.restore();

  // ── finbar.studio backlink, bottom-right — legible on white AND black via a
  //    dark outline (for light backgrounds) + a harsh drop shadow (for dark). ──
  ctx.save();
  const urlSize = 12 * s;
  const margin = 14 * s;
  ctx.font = `700 ${urlSize}px ui-monospace, "Space Mono", Menlo, monospace`;
  ctx.textAlign = "right";
  ctx.textBaseline = "alphabetic";
  ctx.lineJoin = "round";
  ctx.lineWidth = 3 * s;
  ctx.strokeStyle = "rgba(0,0,0,0.6)";
  ctx.strokeText(URL_TEXT, width - margin, height - margin);
  ctx.shadowColor = "rgba(0,0,0,0.9)";
  ctx.shadowBlur = 4 * s;
  ctx.shadowOffsetY = 1 * s;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(URL_TEXT, width - margin, height - margin);
  ctx.restore();
}
