"use client";

/**
 * HomeIntro — the opening screen + preloader sequence.
 *
 * The brand asterisk outline traces itself in the centre of a blank brand-bg
 * screen, fills pink, drops to the centre-bottom (the wordmark line), slides
 * right into its slot, and FINBARSTUDIO mask-reveals to its left. Then the
 * wordmark is the resting logo, which scroll-shrinks up into the nav.
 *
 * Plays once per browser session.
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ASTERISK_POINTS } from "./brand-asterisk";

export default function HomeIntro() {
  const lockupRef = useRef<HTMLAnchorElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const slotRef = useRef<HTMLSpanElement>(null);
  const flyRef = useRef<HTMLDivElement>(null);
  const starRef = useRef<SVGPolygonElement>(null);
  const [done, setDone] = useState(false);

  // Play once per session — on later home visits the wordmark is just there.
  const playedRef = useRef(false);
  useLayoutEffect(() => {
    try {
      if (sessionStorage.getItem("finbar-intro-played")) {
        playedRef.current = true;
        setDone(true);
      }
      // Note: the "played" flag is set in finish() (not here) so a remount —
      // e.g. React Strict Mode's double-invoke in dev — doesn't skip the run.
    } catch { /* sessionStorage unavailable — just play */ }
  }, []);

  // Fit the wordmark to the available width, then drive the scroll-linked morph:
  // as you scroll the first screen it shrinks and rises into the centre of the nav.
  useLayoutEffect(() => {
    const el = lockupRef.current;
    if (!el) return;
    let bigFont = 0;
    let natH = 0;
    const fit = () => {
      const parent = el.parentElement;
      if (!parent) return;
      const cs = getComputedStyle(parent);
      const avail = parent.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      el.style.fontSize = "100px";
      const natural = el.scrollWidth;
      if (natural > 0 && avail > 0) el.style.fontSize = `${Math.max(20, (avail / natural) * 100)}px`;
      bigFont = parseFloat(getComputedStyle(el).fontSize) || 100;
      const prev = el.style.transform;
      el.style.transform = "translate(-50%, -50%) scale(1)";
      natH = el.offsetHeight;
      el.style.transform = prev;
    };
    const apply = () => {
      const vh = window.innerHeight;
      const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--menubar-h")) || 56;
      const span = Math.max(1, vh * 0.7);
      const p = Math.min(1, Math.max(0, window.scrollY / span));
      const startCenterY = vh - natH / 2 - 34;
      const endCenterY = navH / 2;
      const cy = startCenterY + (endCenterY - startCenterY) * p;
      const target = Math.min(1, 18 / (bigFont || 18));
      const scale = 1 + (target - 1) * p;
      el.style.transform = `translate(-50%, calc(-50% + ${cy}px)) scale(${scale})`;
    };
    fit();
    apply();
    const onScroll = () => apply();
    const onResize = () => { fit(); apply(); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // The preloader choreography (GSAP timeline).
  useLayoutEffect(() => {
    if (playedRef.current) return;
    const fly = flyRef.current, star = starRef.current, slot = slotRef.current, text = textRef.current;
    if (!fly || !star || !slot || !text) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.dataset.introLock = "1";
    window.__lenis?.stop();
    window.scrollTo(0, 0);

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      text.classList.add("is-revealed"); // failsafe: ensure text is visible
      try { sessionStorage.setItem("finbar-intro-played", "1"); } catch { /* ignore */ }
      setDone(true);
      document.body.style.overflow = prevOverflow;
      delete document.documentElement.dataset.introLock;
      window.__lenis?.start();
    };
    // Failsafe: never leave scroll locked if the GSAP ticker stalls (e.g. the
    // tab loads in the background and rAF is throttled).
    const failsafe = setTimeout(finish, 5000);

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    gsap.set(fly, { xPercent: -50, yPercent: -50, x: 0, y: 0, scale: 1, opacity: 1 });

    if (reduce) { text.classList.add("is-revealed"); clearTimeout(failsafe); finish(); return; }

    let tl: gsap.core.Timeline | undefined;
    let cancelled = false;
    // Two rAF frames: first lets the fixed elements settle layout, second measures.
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => {
      if (cancelled) return;
      // getTotalLength() needs the SVG to be in a laid-out document.
      const len = star.getTotalLength() || 0;
      gsap.set(star, { strokeDasharray: len, strokeDashoffset: len, fillOpacity: 0 });

      const f = fly.getBoundingClientRect();
      const s = slot.getBoundingClientRect();
      const dyDown = (s.top + s.height / 2) - (f.top + f.height / 2);
      const dxRight = (s.left + s.width / 2) - (f.left + f.width / 2);
      const scale = f.height ? s.height / f.height : 0.12;

      tl = gsap.timeline({ onComplete: () => { clearTimeout(failsafe); finish(); } });
      tl.to(star, { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut" })         // trace
        .to(star, { fillOpacity: 1, duration: 0.28, ease: "power1.out" })                // fill
        .to(fly, { y: dyDown, duration: 0.5, ease: "power3.inOut" }, "+=0.05")           // drop
        .to(fly, { x: dxRight, scale, duration: 0.6, ease: "power3.inOut" })             // slide to slot
        .call(() => { text.classList.add("is-revealed"); }, undefined, "-=0.12");        // wordmark reveal
    }));

    return () => {
      cancelled = true;
      clearTimeout(failsafe);
      cancelAnimationFrame(raf);
      tl?.kill();
      document.body.style.overflow = prevOverflow;
      delete document.documentElement.dataset.introLock;
      window.__lenis?.start();
    };
  }, []);

  return (
    <section className="home-intro" aria-label="finbarstudio">
      {!done && (
        <div ref={flyRef} className="intro-fly" aria-hidden="true">
          <svg viewBox="0 0 100 100" className="intro-fly-star">
            <polygon ref={starRef} points={ASTERISK_POINTS} vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      )}

      <Link href="/" className="home-intro-mark brand-wordmark" ref={lockupRef} aria-label="finbarstudio home">
        <span className={`home-intro-text ${done ? "is-revealed" : ""}`} ref={textRef} aria-hidden="true">FINBARSTUDIO</span>
        <span
          className={`brand-wordmark-mark home-intro-slot ${done ? "is-shown" : ""}`}
          ref={slotRef}
          aria-hidden="true"
        >
          <svg viewBox="0 0 100 100" className="home-intro-slot-star brand-wordmark-asterisk">
            <polygon points={ASTERISK_POINTS} fill="var(--pink)" />
          </svg>
        </span>
      </Link>
    </section>
  );
}
