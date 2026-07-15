"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Mask-reveals a line one word at a time — each word rises from behind its own
 * baseline (clip + translateY 110% → 0), staggered. Ported from the Lows
 * WordReveal, but armed by the preloader's `qpi:intro-done` event (plus a
 * window flag for the race where the event fired before mount) instead of
 * scroll position, since the hero is on screen from the first paint.
 */
export default function WordReveal({
  text,
  className = "",
  stagger = 120,
  duration = 0.7,
  delay = 0,
}: {
  text: string;
  className?: string;
  /** per-word delay step in ms */
  stagger?: number;
  /** each word's transition duration in seconds */
  duration?: number;
  /** ms after intro-done before the first word starts */
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    let t = 0;
    const arm = () => {
      t = window.setTimeout(() => setShown(true), delay);
    };
    const w = window as unknown as { __qpiPreloaderLifted?: boolean };
    if (w.__qpiPreloaderLifted) {
      arm();
      return () => window.clearTimeout(t);
    }
    window.addEventListener("qpi:intro-done", arm, { once: true });
    // Fail-open if the preloader never fires (e.g. direct nav to another page).
    const fallback = window.setTimeout(() => setShown(true), 6500);
    return () => {
      window.removeEventListener("qpi:intro-done", arm);
      window.clearTimeout(t);
      window.clearTimeout(fallback);
    };
  }, [delay]);

  const words = text.split(" ");

  return (
    <span ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden="true"
          className="inline-block overflow-hidden align-bottom"
        >
          <span
            className="inline-block will-change-transform"
            style={{
              transform: shown ? "translateY(0)" : "translateY(110%)",
              transition: `transform ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${i * stagger}ms`,
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </span>
  );
}
