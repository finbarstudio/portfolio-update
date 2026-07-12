"use client";

/**
 * LensLab — a cursor-following optical lens over a photo, with a shelf of
 * 30 stacked looks (fisheye, chromatic aberration, grain, halftone, CRT…).
 *
 * Technique (no WebGL — all 2D canvas, studied from Standard Format's
 * lens-test page and rebuilt):
 *   1. Barrel distortion in two passes. warp(x) = x·(1−k+k·x²) remaps a
 *      normalised coordinate; pass one resamples the source COLUMN by column
 *      (horizontal warp), pass two resamples that intermediate ROW by row
 *      (vertical warp). Each output line samples a variable-width source
 *      slice, so pixels stretch at the centre and compress at the rim.
 *   2. The lens shows a source square of radius R/2 in a window of radius R —
 *      a 2× magnifier before the warp even starts.
 *   3. Optional passes stack on top: pixelate (downscale + nearest-neighbour
 *      upscale), chromatic aberration (R/G/B channels drawn at slightly
 *      different scales, composited `lighter`), CSS canvas filters (sepia,
 *      blur, contrast…), a tiled noise canvas for grain, and pure-CSS
 *      overlays (scanlines, RGB stripes, halftone dots, vignette).
 */

import { useEffect, useRef, useState } from "react";

type Look = {
  name: string;
  k: number;              // barrel strength (0 = flat zoom)
  ca?: number;            // chromatic aberration offset
  caX?: boolean;          // aberration on the x axis only (VHS)
  grain?: number;         // grain opacity
  pixel?: number;         // pixelate factor
  filter?: string;        // canvas CSS filter chain
  overlay?: "vignette" | "scan" | "rgb" | "crt" | "dots" | "dotsbig";
};

export const LOOKS: Look[] = [
  { name: "01 clean fisheye", k: 0.3 },
  { name: "02 flat zoom", k: 0 },
  { name: "03 strong fisheye", k: 0.5 },
  { name: "04 subtle fisheye", k: 0.15 },
  { name: "05 chrom-ab subtle", k: 0.3, ca: 0.004 },
  { name: "06 chrom-ab strong", k: 0.3, ca: 0.012 },
  { name: "07 chrom-ab + strong fish", k: 0.5, ca: 0.008 },
  { name: "08 fine grain", k: 0.3, grain: 0.12 },
  { name: "09 heavy grain", k: 0.3, grain: 0.28 },
  { name: "10 sepia", k: 0.3, filter: "sepia(0.55)" },
  { name: "11 faded film", k: 0.3, filter: "contrast(0.85) saturate(0.7) brightness(1.05)" },
  { name: "12 vignette", k: 0.3, overlay: "vignette" },
  { name: "13 vintage (sepia+grain+vig)", k: 0.3, filter: "sepia(0.4) contrast(0.9)", grain: 0.15, overlay: "vignette" },
  { name: "14 scanlines", k: 0.3, overlay: "scan" },
  { name: "15 rgb stripes", k: 0.3, overlay: "rgb" },
  { name: "16 crt (rgb+scan)", k: 0.3, overlay: "crt" },
  { name: "17 crt + chrom-ab", k: 0.3, ca: 0.006, overlay: "crt" },
  { name: "18 pixelate 4", k: 0.3, pixel: 4 },
  { name: "19 pixelate 8", k: 0.3, pixel: 8 },
  { name: "20 bitmap screen (pix+rgb)", k: 0.3, pixel: 6, overlay: "rgb" },
  { name: "21 halftone dots", k: 0.3, overlay: "dots" },
  { name: "22 halftone big", k: 0.3, overlay: "dotsbig" },
  { name: "23 mono bitmap", k: 0.3, pixel: 5, filter: "grayscale(1) contrast(2.5)" },
  { name: "24 grayscale", k: 0.3, filter: "grayscale(1)" },
  { name: "25 high contrast b/w", k: 0.3, filter: "grayscale(1) contrast(1.8)" },
  { name: "26 invert", k: 0.3, filter: "invert(1)" },
  { name: "27 soft focus", k: 0.3, filter: "blur(1.2px) brightness(1.03)" },
  { name: "28 dreamy", k: 0.3, filter: "blur(0.8px) saturate(1.15) brightness(1.08)", overlay: "vignette" },
  { name: "29 vhs (h-ab+scan+grain)", k: 0.2, ca: 0.01, caX: true, grain: 0.14, overlay: "scan" },
  { name: "30 microscope", k: 0.35, ca: 0.004, grain: 0.1, overlay: "crt" },
];

const N = 520;      // internal lens resolution
const LENS = 260;   // displayed lens diameter (css px)

let noiseTile: HTMLCanvasElement | null = null;
const getNoise = () => {
  if (noiseTile) return noiseTile;
  const cv = document.createElement("canvas");
  cv.width = 128; cv.height = 128;
  const c = cv.getContext("2d")!;
  const d = c.createImageData(128, 128);
  for (let i = 0; i < d.data.length; i += 4) {
    const v = Math.floor(255 * Math.random());
    d.data[i] = v; d.data[i + 1] = v; d.data[i + 2] = v; d.data[i + 3] = 255;
  }
  c.putImageData(d, 0, 0);
  noiseTile = cv;
  return cv;
};

export default function LensLab({ src }: { src: string }) {
  const [look, setLook] = useState(0);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = src;
    imgRef.current = img;
  }, [src]);

  useEffect(() => {
    const lens = lensRef.current;
    const stage = stageRef.current;
    const img = imgRef.current;
    if (!lens || !stage || !img || !pos) return;

    const raf = requestAnimationFrame(() => {
      if (!img.naturalWidth) return;
      const L = LOOKS[look];

      // Map the cursor from stage space into source-image space (the image is
      // object-fit: contain inside the stage).
      const r = stage.getBoundingClientRect();
      const g = Math.min(r.width / img.naturalWidth, r.height / img.naturalHeight);
      const offX = (r.width - img.naturalWidth * g) / 2;
      const offY = (r.height - img.naturalHeight * g) / 2;
      const bx = pos.x - offX;
      const by = pos.y - offY;

      if (lens.width !== N) { lens.width = N; lens.height = N; }

      const k = L.k;
      const warp = (x: number) => x * (1 - k + k * x * x);
      const half = LENS / 4; // source radius (css px): half the lens radius = 2x zoom

      // Pass 1 — horizontal warp, column by column.
      const p1 = document.createElement("canvas");
      p1.width = N; p1.height = N;
      const c1 = p1.getContext("2d")!;
      const srcY = (by - half) / g;
      const srcH = (half * 2) / g;
      for (let e = 0; e < N; e++) {
        const t0 = warp(e / (N / 2) - 1);
        const t1 = warp((e + 1) / (N / 2) - 1);
        const x0 = (bx + half * t0) / g;
        const x1 = (bx + half * t1) / g;
        c1.drawImage(img, x0, srcY, Math.max(x1 - x0, 0.01), srcH, e, 0, 1, N);
      }

      // Pass 2 — vertical warp, row by row, from the intermediate.
      const p2 = document.createElement("canvas");
      p2.width = N; p2.height = N;
      const c2 = p2.getContext("2d")!;
      c2.fillStyle = "#fff";
      c2.fillRect(0, 0, N, N);
      for (let e = 0; e < N; e++) {
        const t0 = warp(e / (N / 2) - 1);
        const t1 = warp((e + 1) / (N / 2) - 1);
        const y0 = ((t0 + 1) / 2) * N;
        const y1 = ((t1 + 1) / 2) * N;
        c2.drawImage(p1, 0, y0, N, Math.max(y1 - y0, 0.01), 0, e, N, 1);
      }

      // Pixelate — bounce through a tiny canvas, upscale nearest-neighbour.
      let warped: HTMLCanvasElement = p2;
      if (L.pixel) {
        const tiny = document.createElement("canvas");
        const tn = Math.max(2, Math.round(N / L.pixel / 2));
        tiny.width = tn; tiny.height = tn;
        tiny.getContext("2d")!.drawImage(warped, 0, 0, tn, tn);
        const up = document.createElement("canvas");
        up.width = N; up.height = N;
        const uc = up.getContext("2d")!;
        uc.imageSmoothingEnabled = false;
        uc.drawImage(tiny, 0, 0, N, N);
        warped = up;
      }

      const out = lens.getContext("2d")!;
      out.clearRect(0, 0, N, N);
      out.filter = L.filter ?? "none";

      if (L.ca) {
        // Chromatic aberration: tint each channel, draw at offset scales,
        // recombine additively.
        const channels: [string, number, number][] = [
          ["#f00", 1 + L.ca, L.caX ? 0 : 1 + L.ca],
          ["#0f0", 1, 1],
          ["#00f", 1 - L.ca, L.caX ? 0 : 1 - L.ca],
        ];
        out.fillStyle = "#000";
        out.fillRect(0, 0, N, N);
        for (const [tint, sx, sy] of channels) {
          const ch = document.createElement("canvas");
          ch.width = N; ch.height = N;
          const cc = ch.getContext("2d")!;
          const w = N * sx;
          const h = N * (L.caX ? 1 : sy);
          // Pre-fill with the unscaled image: the shrunk channel (scale < 1)
          // would otherwise leave a transparent border that the multiply tint
          // turns into a saturated ring around the lens rim.
          cc.drawImage(warped, 0, 0);
          cc.drawImage(warped, (N - w) / 2, (N - h) / 2, w, h);
          cc.globalCompositeOperation = "multiply";
          cc.fillStyle = tint;
          cc.fillRect(0, 0, N, N);
          out.globalCompositeOperation = "lighter";
          out.drawImage(ch, 0, 0);
        }
        out.globalCompositeOperation = "source-over";
      } else {
        out.drawImage(warped, 0, 0);
      }
      out.filter = "none";

      if (L.grain) {
        out.globalAlpha = L.grain;
        out.globalCompositeOperation = "overlay";
        const tile = getNoise();
        for (let y = 0; y < N; y += 128) for (let x = 0; x < N; x += 128) out.drawImage(tile, x, y);
        out.globalAlpha = 1;
        out.globalCompositeOperation = "source-over";
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [pos, look]);

  const active = LOOKS[look];

  return (
    <div className="sb-lens-lab">
      <div className="sb-lens-picker">
        {LOOKS.map((l, i) => (
          <button key={l.name} className={i === look ? "on" : ""} onClick={() => setLook(i)}>
            {l.name}
          </button>
        ))}
      </div>
      <div
        ref={stageRef}
        className="sb-lens-stage"
        onMouseMove={(e) => {
          const r = stageRef.current!.getBoundingClientRect();
          setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
        }}
        onMouseLeave={() => setPos(null)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="Lens test subject" />
        {pos && (
          <div
            className={`sb-lens-glass${active.overlay ? ` sb-lo-${active.overlay}` : ""}`}
            style={{ left: pos.x - LENS / 2, top: pos.y - LENS / 2 }}
          >
            <canvas ref={lensRef} style={{ width: LENS, height: LENS }} />
          </div>
        )}
        <p className="sb-lens-label">{active.name}</p>
      </div>
    </div>
  );
}
