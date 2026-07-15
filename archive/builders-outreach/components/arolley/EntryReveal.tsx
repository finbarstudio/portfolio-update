"use client";

import { useEffect, useRef } from "react";
import { playOnIntro } from "./intro";

/**
 * Page-entry reveal: its direct children start hidden (CSS, .arl-reveal) and
 * transition up + in once the intro fires (after the preloader lifts on first
 * load, immediately on later navigations, or a guaranteed fallback). CSS-driven
 * so it never depends on the animation ticker and can't get stuck hidden.
 */
export default function EntryReveal({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
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
    <div ref={ref} className={`arl-reveal ${className}`} style={style}>
      {children}
    </div>
  );
}
