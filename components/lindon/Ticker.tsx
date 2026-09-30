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

  // Tens reel: only the distinct values the tens digit passes through as the
  // count climbs (blank → 1 → 2 → 3 for a target of 32), so it ticks slowly
  // through those few states rather than rolling a long 0-9-style reel.
  const tensSeq: string[] = [];
  for (const t of tens) {
    if (tensSeq[tensSeq.length - 1] !== t) tensSeq.push(t);
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Each reel lands on its own last cell, so the travel is sized to that
      // reel's length (the tens reel is short; the units reel is the full set).
      const landTens = -(100 * (tensSeq.length - 1)) / tensSeq.length;
      const landUnits = -(100 * (units.length - 1)) / units.length;
      const DUR = 2.4;
      const DELAY = 0.3;
      // Tens: a slow, even tick (linear) through its handful of values.
      gsap.fromTo(
        tensRef.current,
        { yPercent: 0 },
        { yPercent: landTens, duration: DUR, delay: DELAY, ease: "none" }
      );
      // Units: cycle fast, then decelerate dramatically into the final digit.
      gsap.fromTo(
        unitsRef.current,
        { yPercent: 0 },
        { yPercent: landUnits, duration: DUR, delay: DELAY, ease: "expo.out" }
      );
    });
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      {reel(tensRef, tensSeq)}
      {reel(unitsRef, units)}
    </span>
  );
}
