"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Wraps an image (or any block) and brings it in with a quiet fade-up on
 * scroll. Deliberately NOT a clip/swipe reveal, only the hero swipes; every
 * other image just settles in.
 *
 * The `direction` prop is accepted for call-site compatibility but no longer
 * changes the motion (kept a simple fade so the page reads calm).
 */
export default function MaskReveal({
  children,
  className = "",
  delay = 0,
  start = "top 85%",
}: {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  start?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          delay,
          scrollTrigger: { trigger: ref.current, start },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [delay, start]);

  return <div ref={ref} className={`overflow-hidden ${className}`}>{children}</div>;
}
