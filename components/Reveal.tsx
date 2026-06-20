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
  /** Richer editorial entrance: the section heading wipes in left-to-right while
   *  the section's blocks rise and stagger up. Used for the home sections. */
  section?: boolean;
} & Record<string, unknown>;

export default function Reveal({
  children,
  className,
  as: Tag = "div",
  y = 28,
  delay = 0,
  immediate = false,
  section = false,
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

    // If the element is already on screen when we mount (e.g. a section sitting
    // right at the fold on load), reveal it immediately rather than gating it
    // behind a ScrollTrigger whose start line lands right at the viewport border —
    // that borderline state flickers as fonts/layout settle.
    const inViewOnLoad = el.getBoundingClientRect().top < window.innerHeight;

    const ctx = gsap.context(() => {
      if (section) {
        // Stagger the section's blocks up, and wipe the heading in from the left.
        // toggleActions replays it: it reverses out when you scroll back up past
        // the top and plays again on re-entry.
        const kids = Array.from(el.children) as HTMLElement[];
        const head = el.querySelector<HTMLElement>(".home-display-sm");
        const tl = gsap.timeline(
          inViewOnLoad
            ? {} // already visible → just play in on mount, no borderline trigger
            : {
                // Replays both ways: plays in on the way down, reverses out the top
                // on the way up, and re-plays when you scroll back into it.
                scrollTrigger: { trigger: el, start: "top 78%", toggleActions: "restart none restart reverse" },
              }
        );
        tl.fromTo(
          kids,
          { opacity: 0, y: 46 },
          { opacity: 1, y: 0, duration: 0.85, ease: "power3.out", stagger: 0.12 }
        );
        if (head) {
          tl.fromTo(
            head,
            { clipPath: "inset(0 100% 0 0)" },
            { clipPath: "inset(0 0% 0 0)", duration: 0.7, ease: "power3.inOut" },
            0.12
          );
        }
        return;
      }
      const to: gsap.TweenVars = { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay };
      if (!immediate && !inViewOnLoad) {
        // Replay on re-scroll: reverse out on scroll-up, play again on re-entry.
        to.scrollTrigger = { trigger: el, start: "top 78%", toggleActions: "play none none reverse" };
      }
      gsap.fromTo(el, { opacity: 0, y }, to);
    }, ref);

    return () => ctx.revert();
  }, [y, delay, immediate, section]);

  return createElement(Tag, { ref, className, ...rest }, children);
}
