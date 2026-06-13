"use client";

/**
 * HeroLogo — the wordmark sits at the top of the homepage hero, then on scroll
 * it rises, shrinks and fades, settling toward the permanent logo at the top of
 * the sidebar (native scroll; GSAP ScrollTrigger scrub). Skipped under reduced
 * motion or when the tab loads in the background (so it never gets stuck).
 */

import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BrandStar from "./BrandStar";

export default function HeroLogo() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (document.visibilityState === "hidden") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: 0, x: 0, scale: 1, opacity: 1 },
        {
          y: -64,
          x: -24,
          scale: 0.32,
          opacity: 0,
          transformOrigin: "left top",
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: el,
            start: "top top+=24",
            end: "+=320",
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        }
      );
      ScrollTrigger.refresh();
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="hero-logo" aria-hidden="true">
      finbar<BrandStar className="pixel-star" size="0.82em" />studio
    </div>
  );
}
