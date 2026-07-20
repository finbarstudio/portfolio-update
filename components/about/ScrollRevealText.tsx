"use client";

/**
 * ScrollRevealText — the block of text sits FADED (low opacity), and as the
 * section scrolls through the viewport each word brightens to full, left to
 * right and line by line, driven by scroll position (GSAP ScrollTrigger scrub).
 * The faded text is always there; scrolling just "inks it in".
 *
 * Words (not characters) so the reveal reads line by line as they fill. Renders
 * the full text server-side; the fade is applied client-side in useLayoutEffect
 * (below the fold, so no flash), and reduced motion / no-JS just shows it solid.
 */

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export default function ScrollRevealText({
  text,
  className,
  faded = 0.14,
}: {
  text: string;
  className?: string;
  faded?: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!registered) {
      gsap.registerPlugin(ScrollTrigger);
      registered = true;
    }
    const words = el.querySelectorAll<HTMLElement>(".srt-word");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: faded },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.5,
          scrollTrigger: {
            trigger: el,
            // Inks in across the middle of the scroll: begins as the block
            // enters the lower third, finishes as it passes the upper third.
            start: "top 82%",
            end: "bottom 58%",
            scrub: true,
          },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [faded]);

  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i} className="srt-word">
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
