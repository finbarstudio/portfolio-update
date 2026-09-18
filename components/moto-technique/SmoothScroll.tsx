"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Lenis for this demo only.
 *
 * The portfolio's own SmoothScroll rides the shared Tempus loop, but this route
 * never mounts LayoutShell, so the demo brings its own instance and drives it
 * from the GSAP ticker. Parked on window.__mtLenis as a QA handle, because a
 * virtual scroll means a screenshot tool cannot follow the page down without it.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    (window as unknown as { __mtLenis?: Lenis }).__mtLenis = lenis;

    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      delete (window as unknown as { __mtLenis?: Lenis }).__mtLenis;
    };
  }, []);

  return null;
}
