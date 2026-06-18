"use client";

/**
 * HomeIntro — the opening screen + preloader sequence.
 *
 * 1. A pink star outline draws itself (traces) in the centre of a blank brand-bg
 *    screen, fills pink, then flies down into its slot in the FINBAR ✶ STUDIO
 *    wordmark (a FLIP from screen-centre to the measured slot).
 * 2. The wordmark is uppercase and scaled to fill the screen width (uniform
 *    scale, natural spacing). Scrolling continues into the rest of the site.
 *
 * The canonical lockup is the open-sidebar logo (see memory/brand-logo.md); this
 * is the caps, full-width version. Plays on every load for now (no session gate).
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { STAR_POINTS } from "./brand-star";

type Phase = "trace" | "fill" | "fly" | "done";

const TRACE_MS = 1700;
const FILL_MS = 450;
const FLY_MS = 850;

export default function HomeIntro() {
  const lockupRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLSpanElement>(null);
  const flyRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("trace");
  const [flyTransform, setFlyTransform] = useState<string | null>(null);

  // Fit the wordmark to the available width: measure at a reference size, then
  // scale the font-size so the lockup spans the row (keeps the natural spacing).
  useLayoutEffect(() => {
    const el = lockupRef.current;
    if (!el) return;
    const fit = () => {
      const avail = el.parentElement?.clientWidth ?? el.clientWidth;
      el.style.fontSize = "100px";
      const natural = el.scrollWidth;
      if (natural > 0) el.style.fontSize = `${Math.max(28, (avail / natural) * 100)}px`;
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    const toFill = setTimeout(() => setPhase("fill"), TRACE_MS);
    const toFly = setTimeout(() => {
      const fly = flyRef.current;
      const slot = slotRef.current;
      if (fly && slot) {
        const f = fly.getBoundingClientRect();
        const s = slot.getBoundingClientRect();
        const dx = s.left + s.width / 2 - (f.left + f.width / 2);
        const dy = s.top + s.height / 2 - (f.top + f.height / 2);
        const scale = f.width ? s.width / f.width : 0.1;
        setFlyTransform(`translate(-50%, -50%) translate(${dx}px, ${dy}px) scale(${scale})`);
      }
      setPhase("fly");
    }, TRACE_MS + FILL_MS);
    const toDone = setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = prevOverflow;
    }, TRACE_MS + FILL_MS + FLY_MS);

    return () => {
      clearTimeout(toFill);
      clearTimeout(toFly);
      clearTimeout(toDone);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const veilOut = phase === "fly" || phase === "done";

  return (
    <section className="home-intro" aria-label="finbar studio">
      {phase !== "done" && <div className={`intro-veil ${veilOut ? "is-out" : ""}`} aria-hidden="true" />}

      {phase !== "done" && (
        <div
          ref={flyRef}
          className={`intro-fly is-${phase}`}
          aria-hidden="true"
          style={flyTransform ? { transform: flyTransform } : undefined}
        >
          <svg viewBox="0 0 100 100" className="intro-fly-star">
            <polygon
              points={STAR_POINTS}
              pathLength={1}
              fill="var(--pink)"
              stroke="var(--pink)"
              strokeWidth={1}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      )}

      <div className="home-intro-mark" ref={lockupRef}>
        <span className="home-intro-word">FINBAR</span>
        <span className={`home-intro-slot ${phase === "done" ? "is-shown" : ""}`} ref={slotRef}>
          <svg viewBox="0 0 100 100" className="home-intro-star" aria-hidden="true">
            <polygon points={STAR_POINTS} fill="var(--pink)" />
          </svg>
        </span>
        <span className="home-intro-word">STUDIO</span>
      </div>
    </section>
  );
}
