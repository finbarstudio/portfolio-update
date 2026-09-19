"use client";

import { useEffect, useRef } from "react";
import { LOGOMARK_PATHS, LOGOMARK_VIEWBOX } from "./logomarkPath";

/**
 * The preloader: a white screen, the logomark, and a wipe.
 *
 *   1. the screen is white
 *   2. the mark comes in: small, black, against the left edge, halfway down
 *   3. it holds for a beat
 *   4. the white is wiped off from right to left, so the page appears from the
 *      right and the mark, on the left, is the last thing to go
 *
 * Every move is one transition in the stylesheet; this file only flips the
 * states at the right moments and tidies up. `data-stage` on the root is the
 * whole interface between the two:
 *   (none)  white, mark hidden
 *   "in"    the mark comes in
 *   "out"   the wipe runs
 *
 * ONCE PER SESSION. layout.tsx runs a one-line script before first paint that
 * marks the page `data-intro` only if this session has not seen it (in
 * development, always), and the stylesheet shows this component only under that
 * mark. So a refresh on the live site never flashes white. `?intro` forces it.
 */

/** The sequence, in milliseconds. Keep WIPE in step with the stylesheet. */
const BEFORE = 150;
const MARK_IN = 700;
const HOLD = 650;
const WIPE = 1100;

const SEEN_KEY = "mt-intro-seen";

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const site = el?.closest<HTMLElement>(".mt-site");
    if (!el || !site || !site.hasAttribute("data-intro")) return;

    const lenis = (window as unknown as { __mtLenis?: { stop(): void; start(): void } }).__mtLenis;
    lenis?.stop();

    const timers: number[] = [];
    const after = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));

    const finish = () => {
      site.removeAttribute("data-intro");
      lenis?.start();
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        // private mode: it will simply play again next load
      }
    };

    // Reduced motion: no wipe travelling across the screen. The stylesheet
    // turns it into a plain fade, and it starts straight away.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lead = reduce ? 0 : BEFORE + MARK_IN + HOLD;

    if (!reduce) after(BEFORE, () => (el.dataset.stage = "in"));
    after(lead, () => {
      el.dataset.stage = "out";
      // The page is about to show, so let the hero start its own entrance.
      site.setAttribute("data-intro", "open");
    });
    after(lead + WIPE, finish);

    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  return (
    <div ref={root} className="mt-pre" aria-hidden="true">
      <svg viewBox={LOGOMARK_VIEWBOX} className="mt-pre-mark">
        {LOGOMARK_PATHS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </svg>
    </div>
  );
}
