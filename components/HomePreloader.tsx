"use client";

/**
 * HomePreloader — the landing load animation, rebuilt from the brief:
 *
 *   - The WHOLE intro is this overlay. It sits fixed over the page, plays the
 *     brand mark's centre-out pulse, then fades away to reveal the landing
 *     frame (the hero line). It occupies no document height, so there is
 *     nothing to scroll back to and nothing reverses.
 *   - Fast: ~1.2s total. Scroll is locked only while it plays.
 *   - Once per browser session (sessionStorage, set in finish, never on
 *     mount, so a refresh mid-play replays it).
 *   - Reduced motion or a background tab: skipped entirely. A failsafe
 *     timeout guarantees the page is never stuck behind the overlay.
 *
 * Deliberately shares NO code with the old HomeIntro (lockup/dock/flight) —
 * only the canonical mark itself (BrandMark shapes, the one loading icon).
 */

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import BrandMark from "./BrandMark";

const PLAYED_KEY = "finbar-intro-played";

export default function HomePreloader() {
  // null = undecided (SSR renders the overlay so there's no flash of content
  // before hydration on a first visit; decided immediately on mount).
  const [show, setShow] = useState<boolean | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let played = false;
    try { played = sessionStorage.getItem(PLAYED_KEY) === "1"; } catch { /* ignore */ }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hidden = document.visibilityState === "hidden";
    if (played || reduce || hidden) { setShow(false); return; }
    setShow(true);
  }, []);

  useEffect(() => {
    if (!show) return;
    const root = rootRef.current;
    const mark = markRef.current;
    if (!root || !mark) return;

    // Scroll locked only while the overlay plays.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();

    const finish = () => {
      try { sessionStorage.setItem(PLAYED_KEY, "1"); } catch { /* ignore */ }
      document.body.style.overflow = prevOverflow;
      window.__lenis?.start();
      setShow(false);
    };
    const failsafe = setTimeout(finish, 4000);

    // Centre-out pulse: the mark's six shapes, innermost first (MARK paint
    // order is outer-to-inner, so reverse walks from the middle out).
    const layers = [...mark.querySelectorAll<SVGElement>("polygon, path, circle")].reverse();
    const svg = mark.querySelector("svg");
    const vb = svg?.getAttribute("viewBox")?.split(" ").map(Number) ?? [0, 0, 832, 832];
    const centre = `${vb[2] / 2} ${vb[3] / 2}`;

    const ctx = gsap.context(() => {
      gsap.set(layers, { svgOrigin: centre, scale: 0, opacity: 0 });
      gsap.timeline({ onComplete: () => { clearTimeout(failsafe); finish(); } })
        .to(layers, { scale: 1, opacity: 1, duration: 0.32, ease: "back.out(1.7)", stagger: 0.05 })
        .to(root, { opacity: 0, duration: 0.4, ease: "power2.inOut" }, "+=0.15");
    }, root);

    return () => {
      clearTimeout(failsafe);
      ctx.revert();
      document.body.style.overflow = prevOverflow;
      window.__lenis?.start();
    };
  }, [show]);

  if (show === false) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, zIndex: 70, background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}
    >
      <span ref={markRef} style={{ width: "clamp(72px, 10vw, 120px)", display: "block" }}>
        <BrandMark />
      </span>
    </div>
  );
}
