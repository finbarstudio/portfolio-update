"use client";

import { useEffect, useRef } from "react";
import type { ElementType } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Wipes its contents in from the left the first time it scrolls into view
 * (clip-path inset, right edge → 0). The trigger sits low enough (`start`) that
 * a ScrollText paragraph above it has finished revealing before the wipe runs,
 * so the two read in sequence. Honours prefers-reduced-motion.
 */
export default function MaskReveal({
  children,
  className,
  as,
  start = "top 70%",
  duration = 1.1,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  as?: ElementType;
  start?: string;
  duration?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(el, { clipPath: "inset(0 0% 0 0)" });
      return;
    }

    const tween = gsap.fromTo(
      el,
      { clipPath: "inset(0 100% 0 0)" },
      {
        clipPath: "inset(0 0% 0 0)",
        duration,
        delay,
        ease: "power3.inOut",
        scrollTrigger: { trigger: el, start, once: true },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [start, duration, delay]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag = (as ?? "div") as any;
  return (
    <Tag ref={ref} className={className} style={{ clipPath: "inset(0 100% 0 0)" }}>
      {children}
    </Tag>
  );
}
