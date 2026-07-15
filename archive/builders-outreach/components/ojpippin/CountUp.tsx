"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Counts from 0 → `to` when it scrolls into view, with thousands grouping.
 * Used for the heritage figures (30 years, 1,000 homes), the brand's flex in
 * place of award laurels.
 */
export default function CountUp({
  to,
  suffix = "",
  prefix = "",
  duration = 2.2,
  className = "",
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obj = { v: 0 };
    const fmt = (n: number) => Math.round(n).toLocaleString("en-AU");

    const ctx = gsap.context(() => {
      gsap.to(obj, {
        v: to,
        duration,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
        onUpdate: () => {
          el.textContent = `${prefix}${fmt(obj.v)}${suffix}`;
        },
      });
    });
    el.textContent = `${prefix}${fmt(0)}${suffix}`;
    return () => ctx.revert();
  }, [to, suffix, prefix, duration]);

  return <span ref={ref} className={className} aria-label={`${prefix}${to}${suffix}`} />;
}
