"use client";

/**
 * EnglandHero — full-bleed ENGLAND wordmark (Archivo variable) sized by JS so the
 * word spans exactly the viewport width, flush to the left edge. The exclamation
 * line below it is filled with however many "!" it takes to span the screen at
 * that size. Letters' weight reacts to the cursor (lerped, smooth falloff). The
 * looping St George's flag + three-lions crest sit paired over the type.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import EnglandLions from "@/components/EnglandLions";

const WORD = "ENGLAND";
const RADIUS = 500;     // px of cursor influence
const REST = 250;       // resting weight
const MAX_ADD = 650;    // peak added weight at the cursor (-> 900)

export default function EnglandHero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const bangsRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [bangs, setBangs] = useState(8);
  const mouseX = useRef(0);
  const targetX = useRef(0);
  const raf = useRef(0);
  const lastW = useRef(0);

  // Full-bleed the hero to the viewport (keeping the page padding), then size +
  // offset ENGLAND by its measured INK bounds (not the advance box) so the
  // visible glyphs touch the padding on both sides. Canvas measureText gives the
  // ink box + side bearings; we fit ink-width to the column and pull the word
  // left by its leading bearing. A ResizeObserver re-runs it on font swap/resize.
  const fit = useCallback(() => {
    const wrap = wrapRef.current, h1 = h1Ref.current, word = wordRef.current, bg = bangsRef.current;
    if (!wrap || !h1 || !word || !bg) return;
    const pageEl = wrap.closest(".wc-page") as HTMLElement | null;
    const pad = pageEl ? parseFloat(getComputedStyle(pageEl).paddingLeft) || 0 : 0;
    const vw = document.documentElement.clientWidth;
    // Break out to the full viewport width, re-apply the page padding inside.
    wrap.style.marginLeft = "0px";
    wrap.style.paddingLeft = "0px";
    wrap.style.paddingRight = "0px";
    wrap.style.width = "auto";
    wrap.style.boxSizing = "border-box";
    const nat = wrap.getBoundingClientRect().left;
    wrap.style.marginLeft = `${-nat}px`;
    wrap.style.paddingLeft = `${pad}px`;
    wrap.style.paddingRight = `${pad}px`;
    wrap.style.width = `${vw}px`;
    const target = vw - pad * 2;
    if (target <= 0) return;

    const ctx = (canvasRef.current ??= document.createElement("canvas")).getContext("2d");
    if (!ctx) return;
    const hasLS = "letterSpacing" in ctx;
    const measure = (text: string, px: number) => {
      ctx.font = `250 ${px}px Archivo, sans-serif`;
      if (hasLS) (ctx as CanvasRenderingContext2D).letterSpacing = `${-0.03 * px}px`;
      const m = ctx.measureText(text);
      return { ink: m.actualBoundingBoxRight + m.actualBoundingBoxLeft, lead: -m.actualBoundingBoxLeft, adv: m.width };
    };

    // Fit ENGLAND so its INK width == the column.
    const probe = measure(WORD, 200);
    if (probe.ink <= 0) return;
    const fs = (200 * target) / probe.ink;
    h1.style.fontSize = `${fs}px`;
    const w = measure(WORD, fs);
    word.style.marginLeft = `${-w.lead}px`;   // pull the E's ink to the left padding

    // Fill the second line with "!" so its ink spans the column too.
    const oneAdv = measure("!!!!!!!!!!", fs).adv / 10;   // per-bang advance at this size
    if (oneAdv > 0) {
      const n = Math.max(1, Math.floor(target / oneAdv));
      if (n !== bangs) setBangs(n);
      bg.style.marginLeft = `${-measure("!".repeat(n), fs).lead}px`;
    }
  }, [bangs]);

  useEffect(() => {
    fit();
    lastW.current = document.documentElement.clientWidth;
    // Only re-fit when the viewport WIDTH actually changes. On mobile, scrolling
    // shows/hides the URL bar, which fires resize for a height-only change — and
    // re-running the fit there made ENGLAND jitter left/right. Width-gate it.
    const onResize = () => {
      const w = document.documentElement.clientWidth;
      if (w === lastW.current) return;
      lastW.current = w;
      fit();
    };
    const ro = new ResizeObserver(onResize);
    if (wrapRef.current) ro.observe(wrapRef.current);
    if (wordRef.current) ro.observe(wordRef.current);
    window.addEventListener("resize", onResize);
    document.fonts?.ready?.then(() => fit()).catch(() => {});
    return () => { ro.disconnect(); window.removeEventListener("resize", onResize); };
  }, [fit]);

  useEffect(() => {
    // Cursor-reactive weight is a pointer affordance only. On touch devices the
    // synthesised mousemove (and tap) made the letters' weight — and so the
    // word's width — jump, glitching it left/right. Skip it without a fine pointer.
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    mouseX.current = targetX.current = window.innerWidth / 2;
    const onMove = (e: MouseEvent) => { targetX.current = e.clientX; };
    window.addEventListener("mousemove", onMove, { passive: true });
    const tick = () => {
      mouseX.current += (targetX.current - mouseX.current) * 0.08;
      const letters = innerRef.current?.querySelectorAll<HTMLElement>(".wc-hero-letter");
      if (letters) {
        letters.forEach((el) => {
          const r = el.getBoundingClientRect();
          const x = r.left + r.width / 2;
          let inf = Math.max(0, 1 - Math.abs(mouseX.current - x) / RADIUS);
          inf = inf * inf * inf;
          el.style.fontVariationSettings = `"wght" ${Math.round(REST + inf * MAX_ADD)}`;
        });
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div className="wc-hero-title-wrap" ref={wrapRef}>
      <h1 className="wc-hero-title" aria-label="England" ref={h1Ref}>
        <span className="wc-hero-inner" ref={innerRef} aria-hidden="true">
          <span className="wc-hero-grp" ref={wordRef}>
            {Array.from(WORD).map((c, i) => (
              <span className="wc-hero-letter" key={`w${i}`}>{c}</span>
            ))}
          </span>
          <wbr />
          <span className="wc-hero-grp wc-hero-bangs" ref={bangsRef}>
            {Array.from({ length: bangs }).map((_, i) => (
              <span className="wc-hero-letter" key={`b${i}`}>!</span>
            ))}
          </span>
        </span>
      </h1>
      {/* Looping St George's flag + three-lions crest, paired over the wordmark. */}
      <div className="wc-hero-marks" aria-hidden="true">
        <svg className="wc-stgeorge" viewBox="0 0 500 300">
          <g fill="none" stroke="var(--pink)">
            <rect className="wc-flag-border" x="2" y="2" width="496" height="296" strokeWidth="4" pathLength={1} />
            <line className="wc-flag-vert" x1="250" y1="0" x2="250" y2="300" strokeWidth="60" strokeLinecap="square" pathLength={1} />
            <line className="wc-flag-horiz" x1="0" y1="150" x2="500" y2="150" strokeWidth="60" strokeLinecap="square" pathLength={1} />
          </g>
        </svg>
        <EnglandLions />
      </div>
    </div>
  );
}
