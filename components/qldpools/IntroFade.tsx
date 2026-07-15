"use client";

import { useEffect, useState } from "react";

/**
 * Fade-up for the hero's supporting copy — holds hidden until the preloader's
 * `qpi:intro-done`, then rises after `delay` ms (Lows HeroIntro pattern).
 */
export default function IntroFade({
  delay,
  className = "",
  children,
}: {
  delay: number;
  className?: string;
  children: React.ReactNode;
}) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    let t = 0;
    const arm = () => {
      t = window.setTimeout(() => setShown(true), delay);
    };
    const w = window as unknown as { __qpiPreloaderLifted?: boolean };
    if (w.__qpiPreloaderLifted) {
      arm();
      return () => window.clearTimeout(t);
    }
    window.addEventListener("qpi:intro-done", arm, { once: true });
    const fallback = window.setTimeout(() => setShown(true), 7000);
    return () => {
      window.removeEventListener("qpi:intro-done", arm);
      window.clearTimeout(t);
      window.clearTimeout(fallback);
    };
  }, [delay]);

  return (
    <div
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(14px)",
        transition:
          "opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {children}
    </div>
  );
}
