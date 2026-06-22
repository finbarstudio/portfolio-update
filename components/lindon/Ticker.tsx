"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Two-digit odometer that rolls up to `target` on load. Each digit is its own
 * reel: the units cycle fast (0-9 repeatedly), the tens tick slowly through its
 * few values — both reels land together so the timing lines up.
 */
export default function Ticker({
  target = 32,
  className = "",
}: {
  target?: number;
  className?: string;
}) {
  const tensRef = useRef<HTMLSpanElement>(null);
  const unitsRef = useRef<HTMLSpanElement>(null);

  // Per-count digit sequences for 1..target (tens blank for single digits).
  const tens: string[] = [];
  const units: string[] = [];
  for (let n = 1; n <= target; n++) {
    const s = String(n);
    if (s.length === 1) {
      tens.push("");
      units.push(s);
    } else {
      tens.push(s[0]);
      units.push(s[1]);
    }
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      const land = -(100 * (target - 1)) / target;
      const DUR = 2.4;
      const DELAY = 0.3;
      // Tens: a slow, even tick (linear) — no delayed-then-fast jump.
      gsap.fromTo(
        tensRef.current,
        { yPercent: 0 },
        { yPercent: land, duration: DUR, delay: DELAY, ease: "none" }
      );
      // Units: cycle fast, then decelerate dramatically into the final digit.
      gsap.fromTo(
        unitsRef.current,
        { yPercent: 0 },
        { yPercent: land, duration: DUR, delay: DELAY, ease: "expo.out" }
      );
    });
    return () => ctx.revert();
  }, [target]);

  const cell = { height: "1em", lineHeight: 1, width: "0.62em" } as const;
  const reel = (ref: React.RefObject<HTMLSpanElement | null>, arr: string[]) => (
    <span
      className="inline-block overflow-hidden align-bottom"
      style={{ height: "1em", lineHeight: 1 }}
    >
      <span ref={ref} className="flex flex-col">
        {arr.map((d, i) => (
          <span key={i} className="block text-center" style={cell}>
            {d || " "}
          </span>
        ))}
      </span>
    </span>
  );

  return (
    <span className={`inline-flex ${className}`} aria-label={String(target)}>
      {reel(tensRef, tens)}
      {reel(unitsRef, units)}
    </span>
  );
}
