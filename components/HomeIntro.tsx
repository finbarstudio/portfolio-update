"use client";

/**
 * HomeIntro — opening preloader + resting logo.
 *
 * Preloader (desktop, once per session) — the asterisk NEVER scales, only
 * translates:
 *   1. the brand asterisk outline traces itself (centre screen, at final size)
 *   2. it fills pink
 *   3. the intro screen "opens" — the opaque overlay fades to transparent
 *   4. the asterisk translates down to the middle-bottom of the screen
 *   5. then translates right into its slot (bottom-right of the lockup)
 *   6. FINBARSTUDIO slides in from the left to complete the logo
 *   7. scrolling unlocks
 * The resting lockup then scroll-shrinks up into the nav.
 *
 * Mobile: no preloader / no scroll-morph — a small static asterisk logo sits
 * top-right and the page content starts immediately (handled in CSS).
 */

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ASTERISK_POINTS, ASTERISK_PERIMETER } from "./brand-asterisk";
import { scrollToHero } from "@/lib/scroll";

const MOBILE_QUERY = "(max-width: 767px)";
const PLAYED_KEY = "finbar-intro-played";

export default function HomeIntro() {
  const lockupRef = useRef<HTMLAnchorElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const slotRef = useRef<HTMLSpanElement>(null);
  const flyRef = useRef<HTMLDivElement>(null);
  const starRef = useRef<SVGPolygonElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  // Resting logo: fit-to-width + scroll-shrink into the nav. This ALWAYS runs on
  // desktop — independent of whether the preloader plays — so the logo is always
  // correctly positioned (even on a revisit when the intro is skipped). Mobile is
  // skipped (CSS pins a static corner mark instead).
  useLayoutEffect(() => {
    if (window.matchMedia(MOBILE_QUERY).matches) return;
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
    document.fonts?.ready.then(() => { fit(); apply(); }).catch(() => {});
    const onScroll = () => apply();
    const onResize = () => { fit(); apply(); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Preloader choreography — desktop, once per browser session. Runs AFTER the fit
  // effect above (same commit, in order), so the slot is already laid out and we
  // measure it synchronously. sessionStorage gate: plays on the first visit of the
  // session, and does NOT replay on refresh (the browser restores your scroll
  // position; replaying the intro there would be jarring).
  useLayoutEffect(() => {
    if (window.matchMedia(MOBILE_QUERY).matches) { setDone(true); return; }
    let played = false;
    try { played = !!sessionStorage.getItem(PLAYED_KEY); } catch { /* ignore */ }
    if (played) { setDone(true); return; }

    const fly = flyRef.current, star = starRef.current, slot = slotRef.current,
      text = textRef.current, screen = screenRef.current;
    if (!fly || !star || !slot || !text || !screen) { setDone(true); return; }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.dataset.introLock = "1";
    window.__lenis?.stop();
    window.scrollTo(0, 0);

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      try { sessionStorage.setItem(PLAYED_KEY, "1"); } catch { /* ignore */ }
      text.classList.add("is-revealed");
      setDone(true);
      document.body.style.overflow = prevOverflow;
      delete document.documentElement.dataset.introLock;
      window.__lenis?.start();
    };
    const failsafe = setTimeout(finish, 7000);
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // Size the flying asterisk to EXACTLY the slot asterisk, so it only ever
    // translates — never scales (per spec). Both draw the same polygon, so a
    // matching width means a pixel-identical mark at the handoff.
    const sRect0 = slot.getBoundingClientRect();
    if (sRect0.width > 0) {
      fly.style.width = `${sRect0.width}px`;
      fly.style.height = `${sRect0.width}px`;
    }

    // Exact polygon perimeter (viewBox units) as the dash length — smooth trace
    // that completes fully (getTotalLength under-measured, leaving it short).
    const dash = ASTERISK_PERIMETER;
    gsap.set(fly, { xPercent: -50, yPercent: -50, x: 0, y: 0, opacity: 1 });
    gsap.set(star, { strokeDasharray: dash, strokeDashoffset: reduce ? 0 : dash, fillOpacity: reduce ? 1 : 0 });
    gsap.set(screen, { opacity: 1 });

    // Translation deltas (fly centre → slot centre), measured after sizing.
    const f = fly.getBoundingClientRect();
    const s = slot.getBoundingClientRect();
    const dx = (s.left + s.width / 2) - (f.left + f.width / 2);
    const dy = (s.top + s.height / 2) - (f.top + f.height / 2);

    if (reduce) {
      gsap.set(screen, { opacity: 0 });
      text.classList.add("is-revealed");
      const t = gsap.delayedCall(0.4, () => { clearTimeout(failsafe); finish(); });
      return () => { t.kill(); document.body.style.overflow = prevOverflow; delete document.documentElement.dataset.introLock; window.__lenis?.start(); };
    }

    const tl = gsap.timeline({ onComplete: () => { clearTimeout(failsafe); finish(); } });
    tl.to(star, { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut" })       // 1 trace
      .to(star, { fillOpacity: 1, duration: 0.3, ease: "power1.out" })               // 2 fill
      .to(screen, { opacity: 0, duration: 0.6, ease: "power2.inOut" }, "+=0.1")      // 3 screen opens
      .to(fly, { y: dy, duration: 0.55, ease: "power3.inOut" }, "-=0.15")            // 4 down to middle-bottom
      .to(fly, { x: dx, duration: 0.6, ease: "power3.inOut" }, "+=0.05")             // 5 right to the slot
      .call(() => { text.classList.add("is-revealed"); }, undefined, "-=0.1");       // 6 text slides in

    return () => {
      clearTimeout(failsafe);
      tl.kill();
      document.body.style.overflow = prevOverflow;
      delete document.documentElement.dataset.introLock;
      window.__lenis?.start();
    };
  }, []);

  return (
    <section className="home-intro" aria-label="finbarstudio">
      {!done && <div ref={screenRef} className="intro-screen" aria-hidden="true" />}
      {!done && (
        <div ref={flyRef} className="intro-fly" aria-hidden="true">
          <svg viewBox="0 0 100 100" className="intro-fly-star">
            <polygon ref={starRef} points={ASTERISK_POINTS} vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      )}

      <a
        href="/"
        className="home-intro-mark brand-wordmark"
        ref={lockupRef}
        aria-label="Back to top of the hero"
        onClick={(e) => {
          // The logo lives only on home — smooth-scroll up to the hero, not navigate.
          e.preventDefault();
          scrollToHero();
        }}
      >
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
      </a>
    </section>
  );
}
