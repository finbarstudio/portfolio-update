"use client";

/**
 * HeroHeadline — the hero H1 in Bookmania.
 *
 * Words rise and resolve from pink to ink, together (small stagger). The entrance
 * runs ONCE per page load (module guard, so React's double-invoke / remounts can't
 * replay it) and waits for the webfont to be ready first, so it never animates in
 * the fallback face and then jump when Bookmania swaps in. No-ops (shows instantly)
 * under reduced motion or a backgrounded tab. One word is italic for contrast.
 */

import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";

const ITALIC_WORDS = new Set(["editorial,"]);

// Survives Strict Mode's double-invoke and any remount within the session, so the
// headline pops in exactly once.
let played = false;

export default function HeroHeadline({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const words = text.split(" ");

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || played) return;
    const inners = el.querySelectorAll<HTMLElement>(".hh-inner");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || document.visibilityState === "hidden") {
      played = true;
      return; // leave the raw text visible, no animation
    }

    played = true;
    // Hide synchronously (before paint) so there's no flash before the run.
    gsap.set(inners, { opacity: 0, yPercent: 36, color: "#E8718B" });

    let cancelled = false;
    const run = () => {
      if (cancelled || !ref.current) return;
      gsap.to(inners, {
        opacity: 1,
        yPercent: 0,
        color: "#211E1A",
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.045,
      });
    };

    // Wait for the webfont (capped) so the words animate in their real shapes.
    const fonts = (document as unknown as { fonts?: FontFaceSet }).fonts;
    if (fonts && fonts.status !== "loaded") {
      Promise.race([
        fonts.ready,
        new Promise((r) => setTimeout(r, 350)),
      ]).then(run);
    } else {
      run();
    }

    return () => { cancelled = true; };
  }, []);

  return (
    <h1 ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span className="hh-word" key={`${w}-${i}`} aria-hidden="true">
          <span className={`hh-inner${ITALIC_WORDS.has(w) ? " hh-em" : ""}`}>{w}</span>
        </span>
      ))}
    </h1>
  );
}
