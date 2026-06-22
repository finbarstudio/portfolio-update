"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { LAUREL_PATH } from "@/components/lindon/laurelPath";

interface AwardIconProps {
  /** small inner mark — usually the 2-digit year */
  mark: string;
  /** awarding body, e.g. HIA / Houzz */
  body: string;
  /** Winner | Finalist */
  status: "Winner" | "Finalist";
  /** shorthand label under the laurel */
  label: string;
  /** seconds to delay the draw, for stagger */
  delay?: number;
}

export default function AwardIcon({
  mark,
  body,
  status,
  label,
  delay = 0,
}: AwardIconProps) {
  const isWinner = status === "Winner";
  const rootRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(pathRef.current, { strokeDashoffset: 1, fillOpacity: 0 });
      gsap.set(markRef.current, { opacity: 0 });
      gsap.set(".award-line", { yPercent: -120 });

      const tl = gsap.timeline({ delay });
      tl.to(pathRef.current, {
        strokeDashoffset: 0,
        duration: 0.9,
        ease: "power2.inOut",
      })
        .to(
          pathRef.current,
          { fillOpacity: 1, duration: 0.4, ease: "power2.out" },
          "-=0.2"
        )
        .to(markRef.current, { opacity: 1, duration: 0.35 }, "-=0.15")
        // text masks down (drops into view), staggered
        .to(
          ".award-line",
          { yPercent: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" },
          "-=0.1"
        );
    }, rootRef);

    return () => ctx.revert();
  }, [delay]);

  return (
    <div
      ref={rootRef}
      className="flex flex-col items-center gap-1.5 w-[80px] shrink-0"
    >
      <div className="relative w-12 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 90 73.04"
          className="w-full h-auto"
        >
          <path
            ref={pathRef}
            d={LAUREL_PATH}
            pathLength={1}
            fill="var(--ink)"
            fillOpacity={0}
            stroke="var(--ink)"
            strokeWidth={0.7}
            strokeDasharray={1}
            strokeDashoffset={1}
          />
        </svg>
        <span
          ref={markRef}
          className="absolute inset-0 flex items-center justify-center violet text-[var(--ink)] text-[11px] pt-0.5"
        >
          {mark}
        </span>
      </div>

      {/* Body + status — masked */}
      <div className="overflow-hidden">
        <span
          className={`award-line block violet text-[8px] tracking-[0.14em] uppercase leading-none ${
            isWinner ? "text-[var(--black)]" : "text-[var(--ink)]/55"
          }`}
        >
          {body} {status}
        </span>
      </div>

      {/* Label — masked */}
      <div className="overflow-hidden">
        <span className="award-line block violet text-[var(--ink)]/70 text-[7.5px] tracking-[0.12em] uppercase leading-tight text-center">
          {label}
        </span>
      </div>
    </div>
  );
}
