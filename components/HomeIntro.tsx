"use client";

/**
 * HomeIntro — the opening screen + preloader sequence.
 *
 * 1. A pink star outline draws itself (traces) in the centre of a blank brand-bg
 *    screen, fills pink, then flies down into its slot in the FINBAR ✶ STUDIO
 *    wordmark (a FLIP from screen-centre to the measured slot).
 * 2. The wordmark is uppercase and scaled to fill the screen width (uniform
 *    scale, natural spacing). Scrolling continues into the rest of the site.
 *
 * The canonical lockup is the open-sidebar logo (see memory/brand-logo.md); this
 * is the caps, full-width version. Plays on every load for now (no session gate).
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { STAR_POINTS } from "./brand-star";

type Phase = "trace" | "fill" | "fly" | "done";

const TRACE_MS = 2000;
const FILL_MS = 450;
const FLY_MS = 850;

export default function HomeIntro() {
  const lockupRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLSpanElement>(null);
  const flyRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("trace");
  const [flyTransform, setFlyTransform] = useState<string | null>(null);

  // The star trims itself in pure CSS (one path, pathLength=100, dash 100→0) —
  // see .intro-fly-star path in globals.css. No JS getTotalLength needed.

  // Fit the wordmark to the available width, then drive a scroll-linked morph:
  // as you scroll through the first screen it shrinks and rises from the bottom
  // into the centre of the top nav (where it stays as the small logo).
  useLayoutEffect(() => {
    const el = lockupRef.current;
    if (!el) return;

    let bigFont = 0;
    let natH = 0;

    const fit = () => {
      const parent = el.parentElement;
      if (!parent) return;
      const cs = getComputedStyle(parent);
      // Full width of the screen minus the section's L/R padding.
      const avail = parent.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      el.style.fontSize = "100px";
      const natural = el.scrollWidth;
      if (natural > 0 && avail > 0) el.style.fontSize = `${Math.max(20, (avail / natural) * 100)}px`;
      bigFont = parseFloat(getComputedStyle(el).fontSize) || 100;
      // Unscaled height at scale(1), for the rest position near the bottom.
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
      const startCenterY = vh - natH / 2 - 34;   // big, near the bottom
      const endCenterY = navH / 2;                // small, centred in the nav
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

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Tell Lenis to hold still while the preloader plays (it may mount after us).
    document.documentElement.dataset.introLock = "1";
    window.__lenis?.stop();
    window.scrollTo(0, 0);

    const toFill = setTimeout(() => setPhase("fill"), TRACE_MS);
    const toFly = setTimeout(() => {
      const fly = flyRef.current;
      const slot = slotRef.current;
      if (fly && slot) {
        const f = fly.getBoundingClientRect();
        const s = slot.getBoundingClientRect();
        const dx = s.left + s.width / 2 - (f.left + f.width / 2);
        const dy = s.top + s.height / 2 - (f.top + f.height / 2);
        const scale = f.width ? s.width / f.width : 0.1;
        setFlyTransform(`translate(-50%, -50%) translate(${dx}px, ${dy}px) scale(${scale})`);
      }
      setPhase("fly");
    }, TRACE_MS + FILL_MS);
    const toDone = setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = prevOverflow;
      delete document.documentElement.dataset.introLock;
      window.__lenis?.start();
    }, TRACE_MS + FILL_MS + FLY_MS);

    return () => {
      clearTimeout(toFill);
      clearTimeout(toFly);
      clearTimeout(toDone);
      document.body.style.overflow = prevOverflow;
      delete document.documentElement.dataset.introLock;
      window.__lenis?.start();
    };
  }, []);

  const veilOut = phase === "fly" || phase === "done";

  return (
    <section className="home-intro" aria-label="finbar studio">
      {phase !== "done" && <div className={`intro-veil ${veilOut ? "is-out" : ""}`} aria-hidden="true" />}

      {phase !== "done" && (
        <div
          ref={flyRef}
          className={`intro-fly is-${phase}`}
          aria-hidden="true"
          style={flyTransform ? { transform: flyTransform } : undefined}
        >
          {/* Preloader star: a crisp 1px outline that trims itself on (see
              .intro-fly-star in globals). */}
          <svg viewBox="0 0 100 100" className="intro-fly-star">
            <polygon points={STAR_POINTS} pathLength={1} vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      )}

      <div className="home-intro-mark" ref={lockupRef}>
        <span className="home-intro-word">FINBAR</span>
        <span className={`home-intro-slot ${phase === "done" ? "is-shown" : ""}`} ref={slotRef}>
          <svg viewBox="0 0 100 100" className="home-intro-star" aria-hidden="true">
            <polygon points={STAR_POINTS} fill="var(--pink)" />
          </svg>
        </span>
        <span className="home-intro-word">STUDIO</span>
      </div>
    </section>
  );
}
