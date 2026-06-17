/**
 * demo-cards — procedurally-drawn placeholder "media" for the Sandbox tools.
 *
 * Instead of seeding the mockups with real portfolio footage, the default reel is
 * ten generated cards (numbers 1–10): a softly drifting gradient in the studio
 * palette, a frosted-glass panel, and a glowing outlined numeral. They animate on
 * a 2D canvas that feeds the screen texture — so there are no asset files to ship
 * or 404 — and the moment a user adds their own media the placeholders are dropped.
 *
 * A generated item is just a MediaAsset whose `src` is the token `gen:<n>`; the
 * texture hooks detect that and render with `drawNumberCard` instead of loading a
 * file.
 */

export const GEN_PREFIX = "gen:";
export const GENERATED_DEMO_COUNT = 10;

export function isGeneratedSrc(src: string): boolean {
  return src.startsWith(GEN_PREFIX);
}

export function parseCardNumber(src: string): number {
  const n = parseInt(src.slice(GEN_PREFIX.length), 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

// Studio palette (mirrors the CSS custom properties in globals.css).
const CREAM = "#F6EFE1";
const INK = "#211E1A";
const PINK_SOFT = "#F6C9D1";
// Per-card accent, cycled for a little variety while staying on-brand:
// coral-rose, dusty blue, mustard, terracotta, mauve.
const ACCENTS = ["#E8718B", "#6E8CB0", "#E0B24A", "#DD8A5C", "#C58BB0"];

/** "#RRGGBB" + alpha → "rgba(r,g,b,a)". */
function rgba(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

/** Resolve the page's Archivo Narrow family (next/font assigns a hashed name to
 *  the CSS variable), falling back to a narrow system stack. */
function fontFamily(): string {
  if (typeof document !== "undefined") {
    const v = getComputedStyle(document.documentElement)
      .getPropertyValue("--font-archivo-narrow")
      .trim();
    if (v) return `${v}, "Arial Narrow", system-ui, sans-serif`;
  }
  return '"Arial Narrow", system-ui, sans-serif';
}

/** Draw one animated numbered card filling the (w×h) canvas at time `timeMs`. */
export function drawNumberCard(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  n: number,
  timeMs: number,
): void {
  const t = timeMs / 1000;
  const accent = ACCENTS[(n - 1) % ACCENTS.length];
  const min = Math.min(w, h);

  // Base cream ground.
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, w, h);

  // Two soft drifting blobs — the slow "moving gradient".
  const blob = (cx: number, cy: number, rad: number, color: string, alpha: number) => {
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
    g.addColorStop(0, rgba(color, alpha));
    g.addColorStop(1, rgba(color, 0));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  };
  const rad = min * 0.95;
  blob(w * (0.32 + 0.12 * Math.sin(t * 0.5)), h * (0.3 + 0.1 * Math.cos(t * 0.4)), rad, accent, 0.45);
  blob(w * (0.7 + 0.12 * Math.cos(t * 0.45 + 1)), h * (0.72 + 0.1 * Math.sin(t * 0.55 + 2)), rad, PINK_SOFT, 0.5);

  // A clean solid numeral over the drifting gradient — no glow, no glass.
  const label = String(n);
  const fontSize = min * 0.4;
  ctx.font = `700 ${fontSize}px ${fontFamily()}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = rgba(INK, 0.92);
  ctx.fillText(label, w / 2, h / 2 + fontSize * 0.02);
}
