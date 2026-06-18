"use client";

/**
 * Preloader — on the first arrival of a session, a blank page in the brand bg
 * with the star mark drawing itself as a 1px outline (no fill). When the trace
 * completes it fades out to reveal the page. Scroll is locked to the top while
 * it plays. Skipped on later same-session navigations (sessionStorage flag).
 */

import { useEffect, useState } from "react";
import { STAR_POINTS } from "./brand-star";

const TRACE_MS = 1800; // star outline draw
const HOLD_MS = 250; // beat after the trace completes
const FADE_MS = 600; // overlay fade-out

export default function Preloader() {
  const [phase, setPhase] = useState<"play" | "out" | "hidden">("play");

  useEffect(() => {
    // Once per session — first arrival only.
    if (sessionStorage.getItem("fs-preloaded")) {
      setPhase("hidden");
      return;
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    const toFade = setTimeout(() => setPhase("out"), TRACE_MS + HOLD_MS);
    const toHide = setTimeout(() => {
      setPhase("hidden");
      sessionStorage.setItem("fs-preloaded", "1");
      document.body.style.overflow = prevOverflow;
    }, TRACE_MS + HOLD_MS + FADE_MS);

    return () => {
      clearTimeout(toFade);
      clearTimeout(toHide);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div className={`preloader ${phase === "out" ? "is-out" : ""}`} aria-hidden="true">
      <svg className="preloader-star" viewBox="0 0 100 100" fill="none">
        <polygon
          points={STAR_POINTS}
          pathLength={1}
          fill="none"
          stroke="var(--ink)"
          strokeWidth={1}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
