"use client";

/**
 * EnglandHero — the full-bleed ENGLAND wordmark (with a load of exclamation
 * marks) sized by JS to span exactly 100vw, the looping St George's flag drawn
 * over it, and a mouse-following italic: letters near the cursor lean into
 * italic + skew, falling off with distance.
 */

import { useCallback, useEffect, useRef } from "react";

const TEXT = "ENGLAND" + "!".repeat(8);
const RADIUS = 150; // px around the cursor that leans italic

export default function EnglandHero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const centers = useRef<number[]>([]);
  const raf = useRef(0);

  const measureCenters = useCallback(() => {
    const inner = innerRef.current;
    if (!inner) return;
    centers.current = Array.from(inner.children).map((c) => {
      const r = c.getBoundingClientRect();
      return r.left + r.width / 2;
    });
  }, []);

  // Full-bleed the wrap to the viewport edges (the page isn't centred, so pure
  // CSS can't do it reliably), then fit the wordmark to exactly that width.
  const fit = useCallback(() => {
    const wrap = wrapRef.current, h1 = h1Ref.current, inner = innerRef.current;
    if (!wrap || !h1 || !inner) return;
    const vw = document.documentElement.clientWidth;
    wrap.style.marginLeft = "0px";
    wrap.style.width = "auto";
    const left = wrap.getBoundingClientRect().left;
    wrap.style.marginLeft = `${-left}px`;
    wrap.style.width = `${vw}px`;
    h1.style.fontSize = "100px";
    const contentW = inner.getBoundingClientRect().width;
    if (contentW > 0) h1.style.fontSize = `${(100 * vw) / contentW}px`;
    measureCenters();
  }, [measureCenters]);

  useEffect(() => {
    fit();
    const onResize = () => fit();
    window.addEventListener("resize", onResize);
    // Webfont can land after first paint and change the metrics → refit.
    document.fonts?.ready?.then(fit).catch(() => {});
    return () => window.removeEventListener("resize", onResize);
  }, [fit]);

  const onMove = useCallback((e: React.MouseEvent) => {
    const mx = e.clientX;
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const inner = innerRef.current;
      if (!inner) return;
      if (!centers.current.length) measureCenters();
      const ch = inner.children;
      for (let i = 0; i < ch.length; i++) {
        const el = ch[i] as HTMLElement;
        const t = Math.max(0, 1 - Math.abs(mx - centers.current[i]) / RADIUS);
        if (t > 0) {
          el.style.fontStyle = "italic";
          el.style.transform = `skewX(${(-14 * t).toFixed(2)}deg)`;
        } else {
          el.style.fontStyle = "";
          el.style.transform = "";
        }
      }
    });
  }, [measureCenters]);

  const onLeave = useCallback(() => {
    const inner = innerRef.current;
    if (!inner) return;
    for (const c of Array.from(inner.children)) {
      (c as HTMLElement).style.fontStyle = "";
      (c as HTMLElement).style.transform = "";
    }
  }, []);

  return (
    <div className="wc-hero-title-wrap" ref={wrapRef}>
      <h1 className="wc-hero-title" aria-label="England" ref={h1Ref} onMouseMove={onMove} onMouseLeave={onLeave}>
        <span className="wc-hero-inner" ref={innerRef} aria-hidden="true">
          {Array.from(TEXT).map((c, i) => (
            <span className="wc-hero-letter" key={i}>{c}</span>
          ))}
        </span>
      </h1>
      {/* Looping St George's flag drawn over the wordmark. */}
      <svg className="wc-stgeorge" viewBox="0 0 500 300" aria-hidden="true">
        <g fill="none" stroke="var(--pink)">
          <rect className="wc-flag-border" x="2" y="2" width="496" height="296" strokeWidth="4" pathLength={1} />
          <line className="wc-flag-vert" x1="250" y1="0" x2="250" y2="300" strokeWidth="60" strokeLinecap="square" pathLength={1} />
          <line className="wc-flag-horiz" x1="0" y1="150" x2="500" y2="150" strokeWidth="60" strokeLinecap="square" pathLength={1} />
        </g>
      </svg>
    </div>
  );
}
