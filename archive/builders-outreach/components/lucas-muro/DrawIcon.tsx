"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface DrawIconProps {
  /** single-path line glyph (90×73 viewBox) */
  d: string;
  /** top line — the credential, e.g. "Registered" */
  title: string;
  /** bottom line — the detail, e.g. "Architect" */
  label: string;
  /** seconds to delay the draw, for stagger */
  delay?: number;
}

// A line glyph that draws itself in, then its two caption lines drop into
// view. Same choreography as the award laurels on the builder demos, but
// stroke-only: these are credentials, not trophies.
export default function DrawIcon({ d, title, label, delay = 0 }: DrawIconProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(pathRef.current, { strokeDashoffset: 1 });
      gsap.set(".lm-glyph-line", { yPercent: -120 });

      const tl = gsap.timeline({ delay });
      tl.to(pathRef.current, {
        strokeDashoffset: 0,
        duration: 1.1,
        ease: "power2.inOut",
      }).to(
        ".lm-glyph-line",
        { yPercent: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" },
        "-=0.35"
      );
    }, rootRef);

    return () => ctx.revert();
  }, [delay]);

  return (
    <div ref={rootRef} className="flex flex-col items-center gap-1.5 w-[86px] shrink-0">
      <div className="relative w-10 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 73" className="w-full h-auto">
          <path
            ref={pathRef}
            d={d}
            pathLength={1}
            fill="none"
            stroke="var(--ink)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={1}
            strokeDashoffset={1}
          />
        </svg>
      </div>

      <div className="overflow-hidden">
        <span className="lm-glyph-line block violet text-[8px] tracking-[0.14em] uppercase leading-none text-center [text-indent:0.14em] text-[var(--black)]">
          {title}
        </span>
      </div>

      <div className="overflow-hidden">
        <span className="lm-glyph-line block violet text-[var(--ink)]/70 text-[7.5px] tracking-[0.12em] uppercase leading-tight text-center [text-indent:0.12em]">
          {label}
        </span>
      </div>
    </div>
  );
}
