"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { playOnIntro } from "./intro";

gsap.registerPlugin(ScrollTrigger);

type Dir = "up" | "down" | "left" | "right";
const FROM: Record<Dir, string> = {
  up: "inset(100% 0% 0% 0%)",
  down: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
};

/** Clip mask-reveal: the frame wipes open while the inner settles from a slight
 *  scale-up. Elements already in view at load reveal on the page-entry intro
 *  (so nothing stays stuck clipped, e.g. a project image peeking above the
 *  fold); below-fold elements reveal on scroll. Honours prefers-reduced-motion. */
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
    let cleanup = () => {};
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      tl.fromTo(ref.current, { clipPath: FROM[direction] }, { clipPath: "inset(0% 0% 0% 0%)", duration, ease: "power3.inOut" })
        .fromTo(innerRef.current, { scale: 1.12 }, { scale: 1, duration: duration + 0.2, ease: "power3.out" }, 0);
      const play = () => gsap.delayedCall(delay, () => tl.play());

      const rect = ref.current?.getBoundingClientRect();
      const inView = !!rect && rect.top < window.innerHeight * 0.95 && rect.bottom > 0;
      if (inView) {
        // Already on screen at load — reveal once the page-entry intro fires.
        cleanup = playOnIntro(play);
      } else {
        const st = ScrollTrigger.create({ trigger: ref.current, start, once: true, onEnter: play });
        cleanup = () => st.kill();
      }
    }, ref);
    return () => {
      cleanup();
      ctx.revert();
    };
  }, [direction, delay, start, duration]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div ref={innerRef} className="w-full h-full will-change-transform">{children}</div>
    </div>
  );
}
