"use client";

/**
 * SandboxHome — the sandbox landing animation. The FINBARSTUDIO wordmark
 * materialises dead-centre behind a pink "decode head" that sweeps left→right:
 * each glyph clicks from a coarse scrambled pixel mosaic into crisp condensed
 * type as the head passes, the brand asterisk catches a pulse at centre, it holds
 * legible under a faint pixel-grid breathe, then the head retreats and crumbles
 * it back. Move the cursor over it to scrub a crisp "decode lens" across the
 * pixelation — a focus window that always shows the real wordmark.
 *
 * The pixelation is a real filter: the whole composition is drawn into a low-res
 * offscreen buffer (W/S × H/S, S an integer) and upscaled nearest-neighbour, so
 * everything shares one crisp pixel grid. A single grid-locked pink REC block in
 * the top-left corner keeps time — the readout signature, the opposite of a spinner.
 */

import { useEffect, useRef } from "react";
import { ASTERISK_POINTS } from "@/components/brand-asterisk";

const MARK: [number, number][] = ASTERISK_POINTS.trim().split(/\s+/).map((p) => p.split(",").map(Number) as [number, number]);
const SCRAMBLE = "#%@&*0123456789ABCDEF";
const LEFT = "FINBAR";
const RIGHT = "STUDIO";
const SLOT = "*"; // internal sentinel for the asterisk slot (never drawn as text)

const INK = "#F6EFE1";
const PINK = "#E8718B";
const BG = "#211E1A";

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutBack = (t: number) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };

export default function SandboxHome() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current, canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    const buf = document.createElement("canvas");
    const bctx = buf.getContext("2d");
    // Lens buffers (hover fisheye): crisp full-res scene + two warp passes.
    const crisp = document.createElement("canvas");
    const crispCtx = crisp.getContext("2d");
    const LENS_N = 440;
    const lensP1 = document.createElement("canvas");
    const lensC1 = lensP1.getContext("2d");
    const lensP2 = document.createElement("canvas");
    const lensC2 = lensP2.getContext("2d");
    if (!ctx || !bctx || !crispCtx || !lensC1 || !lensC2) return;

    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    let reduce = mq?.matches ?? false;
    const onMq = (e: MediaQueryListEvent) => { reduce = e.matches; };
    mq?.addEventListener?.("change", onMq);

    let W = 0, H = 0, dpr = 1;
    const resize = () => {
      W = wrap.clientWidth || 1; H = wrap.clientHeight || 1;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(wrap);

    // Cursor → crisp "decode lens" position (in wrap CSS pixels).
    const ptr = { x: -1, y: -1, active: false };
    const onPointer = (e: PointerEvent) => { const r = wrap.getBoundingClientRect(); ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top; ptr.active = true; };
    const onLeave = () => { ptr.active = false; };
    wrap.addEventListener("pointermove", onPointer);
    wrap.addEventListener("pointerdown", onPointer);
    wrap.addEventListener("pointerleave", onLeave);

    const drawMark = (c: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string, rot = 0, alpha = 1) => {
      const s = size / 100;
      c.save(); c.globalAlpha = alpha; c.translate(cx, cy); c.rotate(rot); c.scale(s, s); c.translate(-50, -50);
      c.beginPath(); MARK.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.closePath();
      c.fillStyle = color; c.fill(); c.restore();
    };

    function compose(c: CanvasRenderingContext2D, now: number, S: number, headX: number, scramble: boolean, p: number) {
      const fontPx = Math.max(34, Math.min(92, W * 0.082));
      const tracking = 0.04 * fontPx;
      const markSlot = fontPx * 1.18; // total horizontal room the asterisk occupies
      const cy = H / 2 + fontPx * 0.04;

      // Layout slots from the true (Archivo Narrow) metrics so the line never shifts.
      c.font = `600 ${fontPx}px 'Archivo Narrow', ui-sans-serif, sans-serif`;
      const chars = [...LEFT, SLOT, ...RIGHT];
      const adv = chars.map((ch) => (ch === SLOT ? markSlot : c.measureText(ch).width + tracking));
      const total = adv.reduce((a, b) => a + b, 0);
      let x = W / 2 - total / 2;
      const centers = adv.map((a) => { const cx = x + a / 2; x += a; return cx; });

      // Kicker + crop ticks (quantised UI furniture).
      const inset = Math.max(16, Math.min(30, W * 0.03)), arm = inset * 0.62;
      c.strokeStyle = INK; c.globalAlpha = 0.22; c.lineWidth = Math.max(1, fontPx * 0.02);
      const tick = (ox: number, oy: number, sx: number, sy: number) => { c.beginPath(); c.moveTo(ox, oy + sy * arm); c.lineTo(ox, oy); c.lineTo(ox + sx * arm, oy); c.stroke(); };
      tick(inset, inset, 1, 1); tick(W - inset, inset, -1, 1); tick(inset, H - inset, 1, -1); tick(W - inset, H - inset, -1, -1);
      c.globalAlpha = 1;

      c.font = `400 ${Math.max(10, fontPx * 0.16)}px 'Space Mono', ui-monospace, monospace`;
      c.fillStyle = INK; c.globalAlpha = 0.42; c.textAlign = "center"; c.textBaseline = "alphabetic";
      drawTracked(c, "[ SANDBOX · CREATIVE TOOLS ]", W / 2, cy - fontPx * 0.92, Math.max(2, fontPx * 0.05));
      c.globalAlpha = 1;

      // Wordmark glyphs.
      c.textBaseline = "middle"; c.textAlign = "center";
      for (let i = 0; i < chars.length; i++) {
        const ch = chars[i], cx = centers[i];
        if (ch === SLOT) continue; // the asterisk is drawn after, on top
        const locked = cx < headX;
        if (locked && scramble && cx > headX - adv[i] * 1.4) {
          // just crossed by the head → pink "click" + underline wipe
          c.fillStyle = PINK;
          c.font = `600 ${fontPx}px 'Archivo Narrow', ui-sans-serif, sans-serif`;
          c.fillText(ch, cx, cy);
          c.fillRect(cx - adv[i] * 0.4, cy + fontPx * 0.48, adv[i] * 0.8, Math.max(1, fontPx * 0.045));
        } else if (locked || !scramble) {
          c.fillStyle = INK;
          c.font = `600 ${fontPx}px 'Archivo Narrow', ui-sans-serif, sans-serif`;
          c.fillText(ch, cx, cy);
        } else {
          c.fillStyle = INK;
          c.font = `700 ${fontPx * 0.9}px 'Space Mono', ui-monospace, monospace`;
          const g = SCRAMBLE[(i * 7 + Math.floor(now / 60) + i * i) % SCRAMBLE.length];
          c.fillText(g, cx, cy);
        }
      }

      // The asterisk — never scrambles, catches a pulse as the head crosses centre.
      const markCx = centers[LEFT.length];
      let markScale = 1, markRot = 0;
      if (p >= 0) {
        if (p >= 2700 && p < 3050) { const t = (p - 2700) / 350; markScale = 1 + 0.5 * easeOutBack(Math.min(1, Math.sin(t * Math.PI))); markRot = (Math.PI / 6) * (1 - t); }
        else if (p >= 3050 && p < 5300) markScale = 1 + 0.035 * Math.sin(now * 2 * Math.PI / 2400);
      }
      drawMark(c, markCx, cy, fontPx * 0.74 * markScale, PINK, markRot, 1);

      // Decode-head line + trailing tick (one block wide).
      if (headX > 0 && headX < W) {
        c.fillStyle = PINK; c.globalAlpha = 0.85; c.fillRect(headX - S / 2, cy - fontPx * 0.78, S, fontPx * 1.56);
        c.globalAlpha = 0.28; c.fillStyle = INK; c.fillRect(headX - S * 1.5, cy - fontPx * 0.7, S, fontPx * 1.4);
        c.globalAlpha = 1;
      }

      // Signature: grid-locked pink REC block in the top-left crop corner.
      c.fillStyle = PINK; c.globalAlpha = 0.55 + 0.45 * Math.sin(now * 2 * Math.PI / 1000);
      c.fillRect(inset, inset - S, S, S);
      c.globalAlpha = 1;
    }

    let raf = 0, lastBw = -1, lastBh = -1;
    const T = 7200;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      let S: number, headX: number, scramble: boolean, p: number;
      if (reduce) { S = 2; headX = W + 9999; scramble = false; p = -1; }
      else {
        p = now % T;
        if (p < 300) { S = 8; headX = -1; scramble = true; }
        else if (p < 2700) { const lt = (p - 300) / 2400; headX = W * easeInOutCubic(lt); S = Math.max(1, Math.round(1 + 7 * (1 - lt))); scramble = true; }   // mosaic 8→1 across the sweep
        else if (p < 3050) { headX = W * 1.04; S = 1; scramble = false; }
        else if (p < 5300) { headX = W * 1.2; S = Math.sin(now * 2 * Math.PI / 6000) > 0 ? 2 : 1; scramble = false; }
        else if (p < 6800) { const lt = (p - 5300) / 1500; headX = W * (1 - easeInOutCubic(lt)); S = Math.max(1, Math.round(1 + 7 * lt)); scramble = true; }       // crumble 1→8
        else { S = 8; headX = -1; scramble = true; }
      }

      const bw = Math.max(1, Math.ceil(W / S)), bh = Math.max(1, Math.ceil(H / S));
      if (bw !== lastBw || bh !== lastBh) { buf.width = bw; buf.height = bh; lastBw = bw; lastBh = bh; }
      bctx.setTransform(1 / S, 0, 0, 1 / S, 0, 0);
      bctx.clearRect(0, 0, W, H);
      compose(bctx, now, S, headX, scramble, p);

      ctx.imageSmoothingEnabled = false;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = BG; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(buf, 0, 0, bw, bh, 0, 0, canvas.width, canvas.height);

      // Cursor lens: a clean-fisheye magnifier (the "01 clean fisheye" look from
      // the library's lens test — k=0.3 barrel warp, 2× zoom) over the CRISP
      // wordmark, so hovering focuses AND magnifies through the pixelation.
      if (ptr.active && !reduce) {
        const R = Math.max(96, W * 0.13);
        // 1 — crisp scene at CSS resolution.
        if (crisp.width !== W || crisp.height !== H) { crisp.width = W; crisp.height = H; }
        crispCtx.setTransform(1, 0, 0, 1, 0, 0);
        crispCtx.fillStyle = BG; crispCtx.fillRect(0, 0, W, H);
        compose(crispCtx, now, 1, W * 2, false, -1);

        // 2 — two-pass barrel resample of the R-radius square around the
        //     cursor (source radius R/2 → 2× magnification).
        const k = 0.3;
        const warp = (x: number) => x * (1 - k + k * x * x);
        const half = R / 2;
        if (lensP1.width !== LENS_N) { lensP1.width = LENS_N; lensP1.height = LENS_N; lensP2.width = LENS_N; lensP2.height = LENS_N; }
        lensC1.clearRect(0, 0, LENS_N, LENS_N);
        const srcY = ptr.y - half, srcH = half * 2;
        for (let e = 0; e < LENS_N; e++) {
          const t0 = warp(e / (LENS_N / 2) - 1);
          const t1 = warp((e + 1) / (LENS_N / 2) - 1);
          const x0 = ptr.x + half * t0;
          const x1 = ptr.x + half * t1;
          lensC1.drawImage(crisp, x0, srcY, Math.max(x1 - x0, 0.01), srcH, e, 0, 1, LENS_N);
        }
        lensC2.fillStyle = BG; lensC2.fillRect(0, 0, LENS_N, LENS_N);
        for (let e = 0; e < LENS_N; e++) {
          const t0 = warp(e / (LENS_N / 2) - 1);
          const t1 = warp((e + 1) / (LENS_N / 2) - 1);
          const y0 = ((t0 + 1) / 2) * LENS_N;
          const y1 = ((t1 + 1) / 2) * LENS_N;
          lensC2.drawImage(lensP1, 0, y0, LENS_N, Math.max(y1 - y0, 0.01), 0, e, LENS_N, 1);
        }

        // 3 — clip the circle, draw the warped glass, pink focus ring.
        ctx.save();
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.beginPath(); ctx.arc(ptr.x, ptr.y, R, 0, Math.PI * 2); ctx.clip();
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(lensP2, ptr.x - R, ptr.y - R, R * 2, R * 2);
        ctx.restore();
        ctx.save();
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.strokeStyle = PINK; ctx.globalAlpha = 0.5; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(ptr.x, ptr.y, R, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
      }
    };
    raf = requestAnimationFrame(frame);
    // Re-measure once fonts are ready (the loop redraws every frame, so this just
    // ensures correct metrics land as soon as Archivo Narrow / Space Mono swap in).
    document.fonts?.ready?.then(() => { lastBw = -1; });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mq?.removeEventListener?.("change", onMq);
      wrap.removeEventListener("pointermove", onPointer);
      wrap.removeEventListener("pointerdown", onPointer);
      wrap.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section className="sb-home" ref={wrapRef}>
      <canvas ref={canvasRef} className="sb-home-canvas" aria-label="finbar studio sandbox" role="img" />
    </section>
  );
}

/** Centred text with manual letter-spacing (caps tracking). */
function drawTracked(c: CanvasRenderingContext2D, text: string, cx: number, y: number, tracking: number) {
  const widths = [...text].map((ch) => c.measureText(ch).width + tracking);
  const total = widths.reduce((a, b) => a + b, 0) - tracking;
  let x = cx - total / 2;
  const prevAlign: CanvasTextAlign = c.textAlign; c.textAlign = "left";
  for (let i = 0; i < text.length; i++) { c.fillText(text[i], x, y); x += widths[i]; }
  c.textAlign = prevAlign;
}
