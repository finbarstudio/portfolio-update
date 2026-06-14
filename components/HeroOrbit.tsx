"use client";

/**
 * HeroOrbit — a big, faint brand star that drifts along a looping motion path
 * behind the hero (GSAP MotionPathPlugin, à la the waypoints demo) and slowly
 * rotates. Pure decoration: aria-hidden, pointer-events none, behind the text.
 * No-ops under reduced motion or a background-tab load.
 */

import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import BrandStar from "./BrandStar";

export default function HeroOrbit() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (document.visibilityState === "hidden") return;
    gsap.registerPlugin(MotionPathPlugin);

    const ctx = gsap.context(() => {
      gsap.to(el, {
        duration: 20,
        repeat: -1,
        ease: "none",
        motionPath: {
          path: [
            { x: 0, y: 0 },
            { x: -170, y: 80 },
            { x: -320, y: -10 },
            { x: -220, y: -130 },
            { x: -40, y: -80 },
            { x: 0, y: 0 },
          ],
          curviness: 1.4,
        },
      });
      gsap.to(el, { rotation: 360, duration: 48, repeat: -1, ease: "none" });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div className="hero-orbit" aria-hidden="true">
      <div ref={ref} className="hero-orbit-star">
        <BrandStar size={120} />
      </div>
    </div>
  );
}
