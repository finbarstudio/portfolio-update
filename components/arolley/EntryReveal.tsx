"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { playOnIntro } from "./intro";

/**
 * Page-entry reveal: staggers its direct children up + in once the intro fires
 * (after the preloader lifts on first load, or immediately on later navigations).
 * Used on hero/intro blocks so pages enter smoothly instead of popping in.
 */
export default function EntryReveal({
  children,
  className,
  style,
  stagger = 0.12,
  y = 26,
  duration = 0.9,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  stagger?: number;
  y?: number;
  duration?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = Array.from(el.children) as HTMLElement[];
    if (!targets.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cleanup = () => {};
    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y });
      cleanup = playOnIntro(() => {
        gsap.to(targets, { opacity: 1, y: 0, duration, ease: "power3.out", stagger, delay });
      });
    }, el);
    return () => {
      cleanup();
      ctx.revert();
    };
  }, [stagger, y, duration, delay]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
