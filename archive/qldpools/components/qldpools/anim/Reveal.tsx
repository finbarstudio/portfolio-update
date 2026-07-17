"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Reveal — the demo's global entrance primitive. Staggers its children in as
 * the block scrolls into view, synced to Lenis via the site's ScrollTrigger.
 *
 * Variants:
 *  - "rise"  : words/blocks lift and fade (default, for type)
 *  - "water" : the child fills upward behind a clip, like water rising into the
 *              frame, with a touch of scale. Used for the pool photography.
 *
 * Always animates FROM a hidden state, so if JS never runs the content is
 * simply visible. Reduced motion opts out entirely.
 */
export default function Reveal({
  children,
  className,
  variant = "rise",
  stagger = 0.08,
  y = 24,
  delay = 0,
  duration = 0.9,
  start = "top 82%",
  selector,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "rise" | "water";
  stagger?: number;
  y?: number;
  delay?: number;
  duration?: number;
  start?: string;
  /** Target descendants instead of direct children (e.g. ".card") */
  selector?: string;
  as?: "div" | "section" | "ul" | "header";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const targets: ArrayLike<Element> = selector
        ? el.querySelectorAll(selector)
        : el.children;
      if (!targets.length) return;

      const from =
        variant === "water"
          ? {
              clipPath: "inset(100% 0% 0% 0%)",
              scale: 1.06,
              opacity: 1,
              transformOrigin: "center bottom",
            }
          : { y, opacity: 0 };
      const to =
        variant === "water"
          ? { clipPath: "inset(0% 0% 0% 0%)", scale: 1, ease: "power2.inOut" }
          : { y: 0, opacity: 1, ease: "power3.out" };

      gsap.fromTo(targets, from, {
        ...to,
        duration,
        delay,
        stagger,
        scrollTrigger: { trigger: el, start, once: true },
      });
    }, el);

    return () => ctx.revert();
  }, [variant, stagger, y, delay, duration, start, selector]);

  return (
    // @ts-expect-error -- ref type narrows per tag; all are HTMLElement here
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
