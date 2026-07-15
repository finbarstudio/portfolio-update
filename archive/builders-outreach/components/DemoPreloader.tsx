"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * Shared branded preloader for the builder demos (Lindon / OJ Pippin style):
 * a full-screen panel holds the brand mark, clip-wipes it in, holds, wipes it
 * out, then lifts the panel away to reveal the page. Session-gated — it plays
 * once per browser session (flag set on finish, checked on mount) so it never
 * replays on refresh or internal navigation. Honours reduced-motion.
 *
 * Mount inside the scoped demo wrapper so tokens + fonts cascade:
 *   <DemoPreloader storageKey="foundation-homes:preloaded"><img .../></DemoPreloader>
 */
export default function DemoPreloader({
  storageKey,
  bg = "#ffffff",
  children,
}: {
  storageKey: string;
  bg?: string;
  children: React.ReactNode;
}) {
  const [done, setDone] = useState(false);
  const screenRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let seen = false;
    try {
      seen = !!sessionStorage.getItem(storageKey);
    } catch {
      /* storage blocked */
    }
    const finish = () => {
      try {
        sessionStorage.setItem(storageKey, "1");
      } catch {
        /* ignore */
      }
      setDone(true);
    };

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (seen || reduced) {
      finish();
      return;
    }

    const tl = gsap.timeline({ onComplete: finish });
    gsap.set(markRef.current, { clipPath: "inset(0% 100% 0% 0%)" });
    tl.to(markRef.current, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.0, ease: "power3.inOut" })
      .to({}, { duration: 0.45 })
      .to(markRef.current, { clipPath: "inset(0% 0% 0% 100%)", duration: 0.85, ease: "power3.inOut" })
      .to(screenRef.current, { yPercent: -100, duration: 0.9, ease: "power3.inOut" }, "-=0.15");

    return () => {
      tl.kill();
    };
  }, [storageKey]);

  if (done) return null;

  return (
    <div
      ref={screenRef}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: bg }}
      aria-hidden="true"
    >
      <div ref={markRef} className="flex items-center justify-center will-change-[clip-path]">
        {children}
      </div>
    </div>
  );
}
