"use client";

// Lenis smooth scroll — the same buttery inertial wheel/trackpad feel as
// studioagriculture.co. A single instance drives the whole portfolio shell;
// it's parked on window so the "menu" tag and the intro preloader can steer it
// (lenis.scrollTo / stop / start). Respects prefers-reduced-motion.

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      // A longish, easing-out glide — heavier than a native scroll, like the
      // reference site. exp ease-out is Lenis's own default curve.
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });
    window.__lenis = lenis;

    // Keep ScrollTrigger in lockstep with Lenis so scrubbed triggers track the
    // smooth scroll position (not the native one).
    lenis.on("scroll", ScrollTrigger.update);

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // If the home preloader is still running it locks scrolling; honour that.
    if (document.documentElement.dataset.introLock === "1") lenis.stop();

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      if (window.__lenis === lenis) delete window.__lenis;
    };
  }, []);

  return null;
}
