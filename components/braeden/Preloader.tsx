"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import BraedenLogoFull from "./BraedenLogoFull";
import { alreadyPreloaded, fireIntro } from "./intro";

/**
 * Full-screen brand preloader (Lindon / OJ Pippin family). Shows once per browser
 * session: Braeden's real logo wipes in on the dark ground, holds, wipes out, then
 * the whole screen lifts away to reveal the site. On lift it sets the session flag
 * and dispatches the intro event so any page-entry reveals start in sync. A hard
 * safety timer guarantees the screen always lifts, even if a tween stalls.
 */
export default function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  // Decide on the client only (no SSR/hydration mismatch). Skip if already seen
  // this session, or if the user prefers reduced motion.
  useEffect(() => {
    if (alreadyPreloaded()) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      fireIntro();
      return;
    }
    setShow(true);
  }, []);

  useEffect(() => {
    if (!show) return;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      fireIntro();
      setShow(false);
    };
    // Hard safety: never leave the screen covered / the reveals waiting, even if a
    // tween stalls (e.g. a throttled rAF).
    const safety = window.setTimeout(finish, 5000);
    const ctx = gsap.context(() => {
      gsap.set(logoRef.current, { clipPath: "inset(0% 100% 0% 0%)" });
      gsap
        .timeline({ onComplete: finish })
        .to(logoRef.current, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.0, ease: "power3.inOut" })
        .to({}, { duration: 0.4 })
        .to(logoRef.current, { clipPath: "inset(0% 0% 0% 100%)", duration: 0.8, ease: "power3.inOut" })
        .to(ref.current, { yPercent: -100, duration: 0.9, ease: "power3.inOut" }, "-=0.15");
    });
    return () => {
      clearTimeout(safety);
      ctx.revert();
    };
  }, [show]);

  if (!show) return null;
  return (
    <div ref={ref} className="fixed inset-0 z-[120] flex items-center justify-center" style={{ background: "var(--ink)" }}>
      <div ref={logoRef} style={{ width: "min(70vw, 520px)", color: "var(--paper)" }}>
        <BraedenLogoFull className="w-full h-auto" />
      </div>
    </div>
  );
}
