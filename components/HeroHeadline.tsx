"use client";

/**
 * HeroHeadline — the hero H1 in Bookmania, as a considered type composition.
 *
 * Words swing up from the lower-left with a springy ease and resolve from pink
 * to ink, staggered (GSAP). No clip mask, so serifs/descenders are never cropped.
 * One word is set in italic for contrast (Bookmania's italic carries the nicest
 * swashes), and discretionary ligatures/swashes are on. Real <h1> via aria-label.
 * No-ops under reduced motion / background tab.
 */

import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";

const ITALIC_WORDS = new Set(["editorial,"]);

export default function HeroHeadline({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const words = text.split(" ");

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (document.visibilityState === "hidden") return;

    const inners = el.querySelectorAll<HTMLElement>(".hh-inner");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        inners,
        { opacity: 0, yPercent: 64, rotation: -5, transformOrigin: "0% 100%", color: "#E8718B" },
        {
          opacity: 1,
          yPercent: 0,
          rotation: 0,
          color: "#211E1A",
          duration: 1.05,
          ease: "back.out(1.7)",
          stagger: 0.08,
          delay: 0.05,
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <h1 ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span className="hh-word" key={`${w}-${i}`} aria-hidden="true">
          <span className={`hh-inner${ITALIC_WORDS.has(w) ? " hh-em" : ""}`}>{w}</span>
        </span>
      ))}
    </h1>
  );
}
