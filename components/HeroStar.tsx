"use client";

/**
 * HeroStar — a big brand star sitting behind the hero, cropped off the bottom by
 * the section edge. It's an outline (like the loader) that self-traces in a
 * glowing pink stroke, rotates slowly, and parallaxes on scroll. Pure backdrop:
 * aria-hidden, pointer-events none. No-ops under reduced motion / background tab.
 */

import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STAR_POINTS } from "@/components/brand-star";

export default function HeroStar() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const svg = svgRef.current;
    if (!wrap || !svg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (document.visibilityState === "hidden") return;
    gsap.registerPlugin(ScrollTrigger);
    const host = (wrap.closest("section") as HTMLElement) ?? wrap;

    const ctx = gsap.context(() => {
      // Continuous slow spin (the stroke self-traces via CSS).
      gsap.to(svg, { rotation: 360, duration: 90, ease: "none", repeat: -1, transformOrigin: "50% 50%" });
      // Scroll parallax: drifts up and grows a touch as the hero scrolls away.
      gsap.fromTo(
        wrap,
        { yPercent: 0, scale: 1 },
        {
          yPercent: -22,
          scale: 1.12,
          ease: "none",
          scrollTrigger: { trigger: host, start: "top top", end: "bottom top", scrub: 0.6 },
        }
      );
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} className="hero-star" aria-hidden="true">
      <svg ref={svgRef} className="hero-star-svg" viewBox="0 0 100 100">
        <polygon className="hero-star-track" points={STAR_POINTS} pathLength={1} />
        <polygon className="hero-star-draw" points={STAR_POINTS} pathLength={1} />
      </svg>
    </div>
  );
}
