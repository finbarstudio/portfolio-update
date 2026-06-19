"use client";

/**
 * FooterClock — the AUS/BNE live clock, mirror of FooterCopyright but bottom-LEFT.
 *
 * Pinned bottom-left of the viewport while scrolling (on home only after the
 * intro logo has gone up), masked reveal, and DOCKS into its slot in the footer's
 * Brisbane column when that slot rises to the pin's resting line — so it ends up
 * in place rather than jumping. "AUS/BNE" over a 24h day+time line.
 */

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useClock } from "./LiveTime";

export default function FooterClock() {
  const pathname = usePathname();
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(false);
  const [docked, setDocked] = useState(false);
  const time = useClock("Australia/Brisbane");

  // Reveal gate: home shows it only after the intro logo scrolls up; else always.
  useEffect(() => {
    if (pathname !== "/") { setShown(true); return; }
    setShown(false);
    const update = () => setShown(window.scrollY > window.innerHeight * 0.7);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  // Dock seamlessly when the slot rises to the pin's resting line (bottom:16px).
  useEffect(() => {
    const el = anchorRef.current;
    if (!el) return;
    const ph = el.querySelector<HTMLElement>(".sf-clock-ph");
    if (!ph) return;
    const PIN_BOTTOM = 16;
    const check = () => {
      setDocked(ph.getBoundingClientRect().bottom <= window.innerHeight - PIN_BOTTOM + 0.5);
    };
    check();
    const lenis = window.__lenis;
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    lenis?.on?.("scroll", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      lenis?.off?.("scroll", check);
    };
  }, [pathname]);

  return (
    <span className="sf-clock" ref={anchorRef}>
      {/* Reserves the two lines in the Brisbane column so the layout holds. */}
      <span className="sf-clock-ph" aria-hidden="true">
        <span className="sf-value">AUS/BNE</span>
        <span className="sf-value tabular-nums">{time || " "}</span>
      </span>
      <span className={`sf-clock-pin ${shown ? "is-shown" : ""} ${docked ? "is-docked" : ""}`}>
        <span className="sf-clock-inner">
          <span className="sf-label">AUS/BNE</span>
          <span className="sf-value tabular-nums" suppressHydrationWarning>{time || " "}</span>
        </span>
      </span>
    </span>
  );
}
