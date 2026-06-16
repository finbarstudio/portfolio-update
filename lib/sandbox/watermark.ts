/**
 * watermark — the finbar✶studio mark stamped onto every exported frame.
 *
 * MVP is free but always watermarked: a corner wordmark + URL for attribution,
 * plus a faint tiled repeat so the mark can't simply be cropped out. Removing it
 * is the future paid unlock — every export/embed call sites this behind a single
 * `if (!licensed)` gate (see useMockupExport / embed-config), which is the whole
 * monetization seam.
 */

export type WatermarkOptions = {
  /** Resolution scale so the mark stays proportional at any export size. */
  scale?: number;
  /** Skip the faint tiled repeat (e.g. very small GIFs where it muddies). */
  tiled?: boolean;
};

const MARK = "finbar✱studio"; // ✶
const URL_TEXT = "finbar.studio";

/** Draw the watermark onto a 2D context sized `width`×`height` (device px). */
export function drawWatermark(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  opts: WatermarkOptions = {},
): void {
  const s = opts.scale ?? Math.max(1, Math.min(width, height) / 360);
  const tiled = opts.tiled ?? true;

  ctx.save();

  // Faint diagonal tiled repeat across the whole frame.
  if (tiled) {
    ctx.save();
    ctx.globalAlpha = 0.07;
    ctx.fillStyle = "#ffffff";
    ctx.font = `${12 * s}px ui-monospace, "Space Mono", Menlo, monospace`;
    ctx.textBaseline = "middle";
    const stepX = 180 * s;
    const stepY = 120 * s;
    ctx.translate(width / 2, height / 2);
    ctx.rotate(-Math.PI / 9);
    ctx.translate(-width / 2 - stepX, -height / 2 - stepY);
    for (let y = 0; y < height + stepY * 2; y += stepY) {
      for (let x = 0; x < width + stepX * 2; x += stepX) {
        ctx.fillText(URL_TEXT, x, y);
      }
    }
    ctx.restore();
  }

  // Solid corner badge (bottom-right) for legibility on any background.
  const padX = 12 * s;
  const padY = 8 * s;
  const markSize = 15 * s;
  const urlSize = 10 * s;
  const gap = 3 * s;

  ctx.font = `700 ${markSize}px ui-sans-serif, system-ui, sans-serif`;
  const markW = ctx.measureText(MARK).width;
  ctx.font = `${urlSize}px ui-monospace, "Space Mono", Menlo, monospace`;
  const urlW = ctx.measureText(URL_TEXT).width;

  const boxW = Math.max(markW, urlW) + padX * 2;
  const boxH = markSize + gap + urlSize + padY * 2;
  const margin = 14 * s;
  const bx = width - boxW - margin;
  const by = height - boxH - margin;

  // Pill background.
  const r = 8 * s;
  ctx.fillStyle = "rgba(20, 20, 20, 0.55)";
  roundRect(ctx, bx, by, boxW, boxH, r);
  ctx.fill();

  // Wordmark.
  ctx.fillStyle = "rgba(255,255,255,0.96)";
  ctx.textBaseline = "top";
  ctx.font = `700 ${markSize}px ui-sans-serif, system-ui, sans-serif`;
  ctx.fillText(MARK, bx + padX, by + padY);

  // URL.
  ctx.fillStyle = "rgba(255, 45, 120, 0.95)"; // brand pink
  ctx.font = `${urlSize}px ui-monospace, "Space Mono", Menlo, monospace`;
  ctx.fillText(URL_TEXT, bx + padX, by + padY + markSize + gap);

  ctx.restore();
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}
