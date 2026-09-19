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

    // QA only, never in a production build: `?y=1200` opens the page already
    // scrolled to that point, so a screenshot tool that cannot scroll can still
    // capture the hero mid-split. In viewport heights with `?yvh=1.04`.
    let qa = 0;
    if (process.env.NODE_ENV !== "production") {
      const q = new URLSearchParams(location.search);
      const y = q.has("yvh") ? Number(q.get("yvh")) * window.innerHeight : Number(q.get("y"));
      if (y > 0) {
        // The preloader holds the scroll while it plays, so wait for it to let go.
        const site = document.querySelector(".mt-site");
        const jump = () => {
          if (site?.hasAttribute("data-intro")) return;
          window.clearInterval(qa);
          // Lenis clamps to the page height it last measured, which at mount is
          // still zero, so measure first. The native call covers the frame
          // before Lenis takes over.
          lenis.resize();
          window.scrollTo(0, y);
          lenis.scrollTo(y, { immediate: true, force: true });
        };
        qa = window.setInterval(jump, 80);
        jump();
      }
    }

    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.clearInterval(qa);
      gsap.ticker.remove(raf);
      lenis.destroy();
      delete (window as unknown as { __mtLenis?: Lenis }).__mtLenis;
    };
  }, []);

  return null;
}
