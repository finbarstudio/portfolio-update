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
  const [bangs, setBangs] = useState(8);
  const mouseX = useRef(0);
  const targetX = useRef(0);
  const raf = useRef(0);

  // Size the font so ENGLAND spans the padded content width (the wrap sits inside
  // the page padding), then fill the second line with enough "!" to span it too.
  // Incremental (nudge current size toward target) so it's a no-op once exact —
  // a ResizeObserver re-runs it when the webfont swaps in or the column resizes,
  // and it self-stabilises without flicker.
  const fit = useCallback(() => {
    const wrap = wrapRef.current, h1 = h1Ref.current, word = wordRef.current, bg = bangsRef.current;
    if (!wrap || !h1 || !word || !bg) return;
    const target = wrap.clientWidth;
    if (!target) return;
    const cur = parseFloat(getComputedStyle(h1).fontSize) || 100;
    const wpx = word.getBoundingClientRect().width;
    if (wpx > 0 && Math.abs(wpx - target) > 0.5) {
      h1.style.fontSize = `${(cur * target) / wpx}px`;
    }
    const per = bg.getBoundingClientRect().width / Math.max(1, bangs);
    if (per > 0) {
      const n = Math.max(1, Math.floor(target / per));
      if (n !== bangs) setBangs(n);
    }
  }, [bangs]);

  useEffect(() => {
    fit();
    const ro = new ResizeObserver(() => fit());
    if (wrapRef.current) ro.observe(wrapRef.current);
    if (wordRef.current) ro.observe(wordRef.current);
    window.addEventListener("resize", fit);
    document.fonts?.ready?.then(fit).catch(() => {});
    return () => { ro.disconnect(); window.removeEventListener("resize", fit); };
  }, [fit]);

  useEffect(() => {
    mouseX.current = targetX.current = window.innerWidth / 2;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onMove = (e: MouseEvent) => { targetX.current = e.clientX; };
    if (!reduce) window.addEventListener("mousemove", onMove, { passive: true });
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
    if (!reduce) raf.current = requestAnimationFrame(tick);
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
