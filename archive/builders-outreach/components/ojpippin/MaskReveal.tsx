"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Dir = "up" | "down" | "left" | "right";

// FROM clip per direction (the side it wipes open from).
const FROM: Record<Dir, string> = {
  up: "inset(100% 0% 0% 0%)",
  down: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)", // opens left → right
  right: "inset(0% 0% 0% 100%)", // opens right → left
};

/**
 * Clip mask-reveal: the frame wipes open in `direction` while the image settles
 * back from a slight scale-up. Slow and deliberate.
 */
export default function MaskReveal({
  children,
  className = "",
  direction = "left",
  delay = 0,
  start = "top 70%",
  duration = 1.6,
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
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay,
        scrollTrigger: { trigger: ref.current, start },
      });
      tl.fromTo(
        ref.current,
        { clipPath: FROM[direction] },
        { clipPath: "inset(0% 0% 0% 0%)", duration, ease: "power3.inOut" }
      ).fromTo(
        innerRef.current,
        { scale: 1.14 },
        { scale: 1, duration: duration + 0.2, ease: "power3.out" },
        0
      );
    }, ref);
    return () => ctx.revert();
  }, [direction, delay, start, duration]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div ref={innerRef} className="w-full h-full will-change-transform">
        {children}
      </div>
    </div>
  );
}
