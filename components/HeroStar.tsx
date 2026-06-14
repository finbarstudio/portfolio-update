"use client";

/**
 * HeroStar — a big brand star behind the hero, cropped off the bottom. It's an
 * outline (like the loader) that self-traces in a glowing pink stroke and spins
 * slowly. On scroll it shrinks and travels up toward the top-left, "docking"
 * into the star at the top of the sidebar logo — linking the two marks.
 *
 * Outer element holds the static centering; an inner element takes the GSAP
 * transform so the two don't fight. aria-hidden, behind text, reduced-motion /
 * background-tab safe.
 */

import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STAR_POINTS } from "@/components/brand-star";

export default function HeroStar() {
  const moveRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const move = moveRef.current;
    const svg = svgRef.current;
    if (!move || !svg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (document.visibilityState === "hidden") return;
    gsap.registerPlugin(ScrollTrigger);
    const host = (move.closest("section") as HTMLElement) ?? move;

    const ctx = gsap.context(() => {
      // Continuous slow spin (the stroke self-traces via CSS).
      gsap.to(svg, { rotation: 360, duration: 90, ease: "none", repeat: -1, transformOrigin: "50% 50%" });

      // Scroll dock: shrink + travel up-left toward the sidebar logo, fading.
      gsap.fromTo(
        move,
        { x: 0, y: 0, scale: 1, opacity: 1 },
        {
          x: () => -window.innerWidth * 0.46,
          y: () => -window.innerHeight * 0.52,
          scale: 0.14,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: host,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        }
      );
    }, moveRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="hero-star" aria-hidden="true">
      <div ref={moveRef} className="hero-star-move">
        <svg ref={svgRef} className="hero-star-svg" viewBox="0 0 100 100">
          <polygon className="hero-star-track" points={STAR_POINTS} pathLength={1} />
          <polygon className="hero-star-draw" points={STAR_POINTS} pathLength={1} />
        </svg>
      </div>
    </div>
  );
}
