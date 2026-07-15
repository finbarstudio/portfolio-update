"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Dir = "up" | "down" | "left" | "right";
const FROM: Record<Dir, string> = {
  up: "inset(100% 0% 0% 0%)",
  down: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
};

/** Clip mask-reveal: the frame wipes open while the inner settles from a slight
 *  scale-up. Honours prefers-reduced-motion (renders open, no motion). */
export default function MaskReveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
  start = "top 78%",
  duration = 1.4,
}: {
  children: React.ReactNode;
  className?: string;
  direction?: Dir;
  delay?: number;
  start?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay, scrollTrigger: { trigger: ref.current, start } });
      tl.fromTo(ref.current, { clipPath: FROM[direction] }, { clipPath: "inset(0% 0% 0% 0%)", duration, ease: "power3.inOut" })
        .fromTo(innerRef.current, { scale: 1.12 }, { scale: 1, duration: duration + 0.2, ease: "power3.out" }, 0);
    }, ref);
    return () => ctx.revert();
  }, [direction, delay, start, duration]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div ref={innerRef} className="w-full h-full will-change-transform">{children}</div>
    </div>
  );
}
