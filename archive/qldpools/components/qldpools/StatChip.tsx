"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Hero credential chip — stands in for the Lindon demo's award laurels.
 * A big value with masked label lines that drop in on a stagger.
 * All facts come from the client's own site (QBCC licence, pools count…).
 */
export default function StatChip({
  value,
  label,
  delay = 0,
}: {
  value: string;
  label: string;
  delay?: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(valueRef.current, { opacity: 0, yPercent: 40 });
      gsap.set(".stat-line", { yPercent: -120 });

      const tl = gsap.timeline({ delay });
      tl.to(valueRef.current, {
        opacity: 1,
        yPercent: 0,
        duration: 0.7,
        ease: "power3.out",
      }).to(
        ".stat-line",
        { yPercent: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" },
        "-=0.35"
      );
    }, rootRef);

    return () => ctx.revert();
  }, [delay]);

  return (
    <div ref={rootRef} className="flex flex-col items-center gap-1.5 w-[104px] shrink-0">
      <div className="overflow-hidden">
        <span
          ref={valueRef}
          className="block qpi-caps text-[var(--qpi-blue)] text-lg md:text-xl leading-none"
          style={{ opacity: 0 }}
        >
          {value}
        </span>
      </div>
      <div className="overflow-hidden">
        <span className="stat-line block qpi-caps text-[var(--qpi-ink)]/60 text-[8px] leading-tight text-center [text-indent:0.12em]">
          {label}
        </span>
      </div>
    </div>
  );
}
