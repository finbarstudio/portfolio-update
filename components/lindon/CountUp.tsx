"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * A stat number that counts up from 0 to `to` the first time it scrolls into
 * view. `delay` staggers a row of them; `suffix` (e.g. "+") trails the value.
 * Honours prefers-reduced-motion by rendering the final value outright.
 */
export default function CountUp({
  to,
  suffix = "",
  delay = 0,
  duration = 1.6,
  className,
}: {
  to: number;
  suffix?: string;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = `${to}${suffix}`;
      return;
    }

    const obj = { v: 0 };
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          v: to,
          duration,
          delay,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = `${Math.round(obj.v)}${suffix}`;
          },
        });
      },
    });
    return () => st.kill();
  }, [to, suffix, delay, duration]);

  return (
    <span ref={ref} className={className} aria-label={`${to}${suffix}`}>
      0{suffix}
    </span>
  );
}
