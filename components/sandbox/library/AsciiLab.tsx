"use client";

/**
 * AsciiLab — character-based imagery, aniso-style: a photo resampled into a
 * grid of glyphs, each cell's character picked by luminance along a ramp.
 *
 * Technique (2D canvas):
 *   1. Draw the image once into a tiny offscreen canvas at grid resolution —
 *      one getImageData gives every cell's average colour for free.
 *   2. Map each cell's luminance into a character ramp (dark → dense glyph,
 *      light → sparse), then fillText the grid.
 *   3. A gentle "boil" re-rolls each cell's glyph one ramp-step at ~7fps, so
 *      the image shimmers like hand-set type. Paused off-screen and under
 *      prefers-reduced-motion.
 *
 * Colour modes: ink on paper, brand pink, or the photo's own per-cell colour.
 */

import { useCallback, useEffect, useRef, useState } from "react";

const RAMPS: { key: string; label: string; chars: string }[] = [
  { key: "standard", label: "ascii", chars: " .:-=+*#%@" },
  { key: "blocks", label: "blocks", chars: " ░▒▓█" },
  { key: "dots", label: "dots", chars: " .·:•●" },
  { key: "brand", label: "brand ✶", chars: " .·:*✶" },
];

const MODES: { key: "ink" | "pink" | "photo"; label: string }[] = [
  { key: "ink", label: "ink" },
  { key: "pink", label: "pink" },
  { key: "photo", label: "photo" },
];

const PINK = "#e8718b";
const MAX_W = 1400; // internal canvas width cap

export default function AsciiLab({ src }: { src: string }) {
  const [cell, setCell] = useState(10);
  const [ramp, setRamp] = useState(0);
  const [mode, setMode] = useState<"ink" | "pink" | "photo">("ink");
  const [invert, setInvert] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const seedRef = useRef(0);

  useEffect(() => {
    const img = new window.Image();
    img.src = src;
    imgRef.current = img;
  }, [src]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !img.naturalWidth) return;

    const chars = RAMPS[ramp].chars;
    const W = Math.min(MAX_W, img.naturalWidth);
    const H = Math.round(W * (img.naturalHeight / img.naturalWidth));
    if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }

    const cols = Math.max(1, Math.floor(W / cell));
    const rows = Math.max(1, Math.floor(H / cell));

    // One pass: the image at grid resolution IS the per-cell average.
    const tiny = document.createElement("canvas");
    tiny.width = cols; tiny.height = rows;
    const tc = tiny.getContext("2d", { willReadFrequently: true })!;
    tc.drawImage(img, 0, 0, cols, rows);
    const data = tc.getImageData(0, 0, cols, rows).data;

    // Auto-contrast: stretch the 2nd–98th luminance percentiles to the full
    // ramp, so a low-contrast photo still uses every glyph.
    const lums = new Float32Array(cols * rows);
    for (let i = 0; i < cols * rows; i++) {
      lums[i] = (0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]) / 255;
    }
    const sorted = Float32Array.from(lums).sort();
    const lo = sorted[Math.floor(sorted.length * 0.02)];
    const hi = sorted[Math.floor(sorted.length * 0.98)];
    const span = Math.max(hi - lo, 0.001);

    const ctx = canvas.getContext("2d")!;
    // Paper ground: transparent so the stage colour shows through.
    ctx.clearRect(0, 0, W, H);
    ctx.font = `${cell}px 'Space Mono', ui-monospace, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // The sandbox runs dark, so "ink" is the cream on the dark ground.
    if (mode !== "photo") ctx.fillStyle = mode === "pink" ? PINK : "#F6EFE1";

    const seed = seedRef.current;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = (y * cols + x) * 4;
        const r = data[i], g = data[i + 1], b = data[i + 2];
        let lum = Math.min(1, Math.max(0, (lums[y * cols + x] - lo) / span));
        if (invert) lum = 1 - lum;
        // Light glyphs on the dark ground: BRIGHT cells get the dense end of
        // the ramp (terminal-art polarity), so the image reads positive.
        let idx = Math.min(chars.length - 1, Math.floor(lum * chars.length));
        // boil: cells shimmer one ramp step, deterministic per (cell, seed)
        if (seed && idx > 0 && ((x * 7349 + y * 1913 + seed * 421) % 11) === 0) idx -= 1;
        const ch = chars[idx];
        if (ch === " ") continue;
        if (mode === "photo") ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillText(ch, x * cell + cell / 2, y * cell + cell / 2);
      }
    }
  }, [cell, ramp, mode, invert]);

  // Initial render once the image decodes, re-render on control change.
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.complete && img.naturalWidth) render();
    else img.onload = () => render();
  }, [render]);

  // Boil loop — visible + motion-tolerant only.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);
    const t = window.setInterval(() => {
      if (!visible) return;
      seedRef.current = (seedRef.current + 1) % 9973;
      render();
    }, 140);
    return () => { clearInterval(t); io.disconnect(); };
  }, [render]);

  return (
    <div className="sb-ascii-lab">
      <div className="sb-ascii-controls">
        <div className="sb-ascii-group">
          <span className="sb-ascii-key">ramp</span>
          {RAMPS.map((r, i) => (
            <button key={r.key} className={i === ramp ? "on" : ""} onClick={() => setRamp(i)}>{r.label}</button>
          ))}
        </div>
        <div className="sb-ascii-group">
          <span className="sb-ascii-key">colour</span>
          {MODES.map((m) => (
            <button key={m.key} className={mode === m.key ? "on" : ""} onClick={() => setMode(m.key)}>{m.label}</button>
          ))}
        </div>
        <div className="sb-ascii-group">
          <span className="sb-ascii-key">cell {cell}px</span>
          <input
            type="range" min={6} max={22} step={1} value={cell}
            onChange={(e) => setCell(Number(e.target.value))}
            aria-label="Cell size"
          />
          <button className={invert ? "on" : ""} onClick={() => setInvert(!invert)}>invert</button>
        </div>
      </div>
      <div className="sb-ascii-stage">
        <canvas ref={canvasRef} aria-label="ASCII-rendered photo" role="img" />
      </div>
    </div>
  );
}
