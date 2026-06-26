"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import LogoMark from "./LogoMark";
import { INTRO_EVENT, PRELOAD_KEY, alreadyPreloaded } from "./intro";

/**
 * Full-screen brand preloader (Lindon / OJ Pippin family). Shows once per browser
 * session: the wordmark wipes in, holds, wipes out, then the whole screen lifts
 * away to reveal the site. On lift it sets the session flag and dispatches the
 * intro event so the page-entry reveals start in sync. Theme-aware (ink ground,
 * paper mark), so it works on both the signature and editorial directions.
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
      try { sessionStorage.setItem(PRELOAD_KEY, "1"); } catch {}
      window.dispatchEvent(new Event(INTRO_EVENT));
      return;
    }
    setShow(true);
  }, []);

  useEffect(() => {
    if (!show) return;
    const finish = () => {
      try { sessionStorage.setItem(PRELOAD_KEY, "1"); } catch {}
      window.dispatchEvent(new Event(INTRO_EVENT));
      setShow(false);
    };
    const ctx = gsap.context(() => {
      gsap.set(logoRef.current, { clipPath: "inset(0% 100% 0% 0%)" });
      gsap
        .timeline({ onComplete: finish })
        .to(logoRef.current, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.0, ease: "power3.inOut" })
        .to({}, { duration: 0.4 })
        .to(logoRef.current, { clipPath: "inset(0% 0% 0% 100%)", duration: 0.8, ease: "power3.inOut" })
        .to(ref.current, { yPercent: -100, duration: 0.9, ease: "power3.inOut" }, "-=0.15");
    });
    return () => ctx.revert();
  }, [show]);

  if (!show) return null;
  return (
    <div ref={ref} className="fixed inset-0 z-[120] flex items-center justify-center" style={{ background: "var(--ink)" }}>
      <div ref={logoRef} style={{ width: "min(62vw, 440px)", color: "var(--paper)" }}>
        <LogoMark className="w-full h-auto" />
      </div>
    </div>
  );
}
