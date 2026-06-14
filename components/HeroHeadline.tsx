"use client";

/**
 * HeroHeadline — the hero H1 (Bookmania serif), revealed word by word.
 *
 * Each word sits in a clip mask and springs up into place (back.out overshoot)
 * while its colour resolves from pink to ink — a kinetic, sticker-flyer reveal
 * that echoes the card channel animation. Words stay in normal flow (no
 * horizontal drift), so the left edge stays clean. Hovering a word flicks it
 * pink. Real <h1> via aria-label; no-ops under reduced motion / background tab.
 */

import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";

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
        { yPercent: 118, rotate: 5, opacity: 0, color: "#FF1F8F" },
        {
          yPercent: 0,
          rotate: 0,
          opacity: 1,
          color: "#141414",
          duration: 1.0,
          ease: "back.out(1.5)",
          stagger: 0.075,
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
          <span className="hh-inner">{w}</span>
        </span>
      ))}
    </h1>
  );
}
