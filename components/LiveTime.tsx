"use client";

/**
 * Live 24-hour clock for a given timezone — "FRI 21:37:42" (weekday + seconds).
 * useClock() ticks every second; <LiveTime> renders it as a pink footer value.
 */

import { useEffect, useState } from "react";

function format(tz: string): string {
  const now = new Date();
  const wd = new Intl.DateTimeFormat("en-GB", { timeZone: tz, weekday: "short" }).format(now);
  const t = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  }).format(now);
  return `${wd} ${t}`.toUpperCase();
}

export function useClock(tz: string): string {
  // Empty on first render (server + client match), filled on mount, then ticks.
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => setTime(format(tz));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tz]);
  return time;
}

export default function LiveTime({ tz, className }: { tz: string; className?: string }) {
  const time = useClock(tz);
  return (
    <span className={`sf-value tabular-nums ${className ?? ""}`} suppressHydrationWarning>
      {time || " "}
    </span>
  );
}
