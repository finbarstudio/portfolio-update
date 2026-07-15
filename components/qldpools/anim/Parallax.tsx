"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Parallax — oversizes its content and drifts it against the scroll, scrubbed
 * through the site's Lenis-synced ScrollTrigger. Wrap any image container.
 *
 * The inner layer is grown by 2*amount% and starts offset by -amount%, so the
 * frame never reveals an edge at either end of the travel. Reduced motion just
 * leaves the (already correctly covering) still image in place.
 */
export default function Parallax({
  children,
  className = "",
  amount = 10,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  /** percent of the frame height to travel each way */
  amount?: number;
  style?: React.CSSProperties;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const f = frame.current;
    const i = inner.current;
    if (!f || !i) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        i,
        { yPercent: -amount / 2 },
        {
          yPercent: amount / 2,
          ease: "none",
          scrollTrigger: {
            trigger: f,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, f);

    return () => ctx.revert();
  }, [amount]);

  return (
    <div ref={frame} className={`relative overflow-hidden ${className}`} style={style}>
      <div
        ref={inner}
        className="absolute inset-0 will-change-transform"
        style={{ top: `-${amount}%`, height: `${100 + amount * 2}%` }}
      >
        {children}
      </div>
    </div>
  );
}
