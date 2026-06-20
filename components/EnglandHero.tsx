"use client";

/**
 * EnglandHero — the ENGLAND!!!!! wordmark (Archivo variable). Letters' weight
 * reacts to the cursor: nearest letters thicken toward 900, easing back to 250
 * with distance (smooth lerp). The word and the exclamations are separate groups
 * with a <wbr> between, so on narrow screens it wraps to two lines rather than
 * overflowing. The looping St George's flag + three-lions crest sit paired over
 * the type.
 */

import { useEffect, useRef } from "react";
import EnglandLions from "@/components/EnglandLions";

const WORD = "ENGLAND";
const BANGS = "!!!!!";
const RADIUS = 500;     // px of cursor influence
const REST = 250;       // resting weight
const MAX_ADD = 650;    // peak added weight at the cursor (-> 900)

export default function EnglandHero() {
  const innerRef = useRef<HTMLSpanElement>(null);
  const mouseX = useRef(0);
  const targetX = useRef(0);
  const raf = useRef(0);

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
          inf = inf * inf * inf; // smooth falloff
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
    <div className="wc-hero-title-wrap">
      <h1 className="wc-hero-title" aria-label="England">
        <span className="wc-hero-inner" ref={innerRef} aria-hidden="true">
          <span className="wc-hero-grp">
            {Array.from(WORD).map((c, i) => (
              <span className="wc-hero-letter" key={`w${i}`}>{c}</span>
            ))}
          </span>
          <wbr />
          <span className="wc-hero-grp">
            {Array.from(BANGS).map((c, i) => (
              <span className="wc-hero-letter" key={`b${i}`}>{c}</span>
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
