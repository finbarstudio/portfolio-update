"use client";

/**
 * Reveal — animates its element in with GSAP. Two modes:
 *   - default: reveals when scrolled into view (ScrollTrigger).
 *   - immediate: reveals on mount (used for the hero, above the fold).
 *
 * Self-contained and route-safe (gsap.context reverts on unmount, restoring the
 * element). No-op under prefers-reduced-motion. Falls back to visible if GSAP
 * never runs, so content is never stuck hidden.
 */

import { createElement, useRef, useLayoutEffect, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  y?: number;
  delay?: number;
  immediate?: boolean;
} & Record<string, unknown>;

export default function Reveal({
  children,
  className,
  as: Tag = "div",
  y = 28,
  delay = 0,
  immediate = false,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // If the tab loads in the background, GSAP's rAF ticker is throttled, so a
    // tween would set the "from" (hidden) state but never play — leaving content
    // invisible. Skip the animation entirely in that case; content stays visible.
    if (document.visibilityState === "hidden") return;
    if (!registered) { gsap.registerPlugin(ScrollTrigger); registered = true; }

    const ctx = gsap.context(() => {
      const to: gsap.TweenVars = { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay };
      if (!immediate) {
        to.scrollTrigger = { trigger: el, start: "top 88%", once: true };
      }
      gsap.fromTo(el, { opacity: 0, y }, to);
    }, ref);

    return () => ctx.revert();
  }, [y, delay, immediate]);

  return createElement(Tag, { ref, className, ...rest }, children);
}
