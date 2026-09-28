"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Lenis for this demo only, driven by its own requestAnimationFrame loop (no
 * GSAP/ScrollTrigger here: nothing on this page is scroll-linked, every
 * entrance is a one-shot IntersectionObserver reveal, see Reveal.tsx).
 *
 * Skipped under prefers-reduced-motion, on phones (native momentum scroll is
 * better than any script's) and behind the `?nosmooth` dev query, which lets a
 * screenshot tool drive the native scrollbar when Lenis would otherwise eat
 * programmatic scrollTo calls mid-page.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 760px)").matches) return;
    if (process.env.NODE_ENV !== "production" && /[?&]nosmooth\b/.test(location.search)) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // in-page links (the quote button to #contact) glide too
      anchors: true,
    });
    // the bar's home icon scrolls back to the top through this
    (window as unknown as { __llLenis?: Lenis }).__llLenis = lenis;

    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete (window as unknown as { __llLenis?: Lenis }).__llLenis;
    };
  }, []);

  return null;
}
