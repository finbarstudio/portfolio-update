"use client";

/**
 * EnglandHero — the full-bleed ENGLAND!!!!! wordmark (Archivo variable), sized by
 * JS to span exactly 100vw. Letters' weight reacts to the cursor: nearest letters
 * thicken toward 900, easing back to 250 with distance (smooth lerp). The looping
 * St George's flag + three-lions crest sit paired over the type.
 */

import { useCallback, useEffect, useRef } from "react";
import EnglandLions from "@/components/EnglandLions";

const TEXT = "ENGLAND!!!!!";
const RADIUS = 500;     // px of cursor influence
const REST = 250;       // resting weight
const MAX_ADD = 650;    // peak added weight at the cursor (-> 900)

export default function EnglandHero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const mouseX = useRef(0);
  const targetX = useRef(0);
  const raf = useRef(0);

  // Full-bleed the wrap to the viewport edges (the page isn't centred) and fit
  // the wordmark to exactly that width.
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
  }, []);

  useEffect(() => {
    mouseX.current = targetX.current = window.innerWidth / 2;
    fit();
    const onResize = () => fit();
    window.addEventListener("resize", onResize);
    document.fonts?.ready?.then(fit).catch(() => {});

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onMove = (e: MouseEvent) => { targetX.current = e.clientX; };
    if (!reduce) window.addEventListener("mousemove", onMove, { passive: true });

    const tick = () => {
      mouseX.current += (targetX.current - mouseX.current) * 0.08;
      const cs = innerRef.current?.children;
      if (cs) {
        for (let i = 0; i < cs.length; i++) {
          const el = cs[i] as HTMLElement;
          const r = el.getBoundingClientRect();
          const x = r.left + r.width / 2;
          let inf = Math.max(0, 1 - Math.abs(mouseX.current - x) / RADIUS);
          inf = inf * inf * inf; // smooth falloff
          el.style.fontVariationSettings = `"wght" ${Math.round(REST + inf * MAX_ADD)}`;
        }
      }
      raf.current = requestAnimationFrame(tick);
    };
    if (!reduce) raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [fit]);

  return (
    <div className="wc-hero-title-wrap" ref={wrapRef}>
      <h1 className="wc-hero-title" aria-label="England" ref={h1Ref}>
        <span className="wc-hero-inner" ref={innerRef} aria-hidden="true">
          {Array.from(TEXT).map((c, i) => (
            <span className="wc-hero-letter" key={i}>{c}</span>
          ))}
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
