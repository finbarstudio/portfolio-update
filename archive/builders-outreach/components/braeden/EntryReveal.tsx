"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { playOnIntro } from "./intro";

/**
 * Page-entry reveal: its children start hidden (CSS, .brd-reveal) and ease up + in
 * once the intro fires — after the preloader lifts on first load, immediately on
 * later navigation, or on a guaranteed fallback. CSS-driven, so it never depends
 * on the animation ticker and can't get stuck hidden. Pass --reveal-delay via
 * `style` to stagger a group. Used to wrap page intros (about / projects).
 */
export default function EntryReveal({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reveal = () => {
      if (ref.current) ref.current.dataset.revealed = "1";
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reveal();
      return;
    }
    return playOnIntro(reveal);
  }, []);

  return (
    <div ref={ref} className={`brd-reveal ${className}`} style={style}>
      {children}
    </div>
  );
}
