"use client";

/**
 * HeroHeadline — the hero H1, treated as kinetic type.
 *
 *  - each word is masked and rises into place on load (staggered, with a little
 *    rotation), like a letterpress slab dropping in;
 *  - the words then respond to the cursor, drifting at three different depths so
 *    the line feels layered and alive;
 *  - hovering a word flicks it pink.
 *
 * Stays a real <h1> (aria-label carries the full text; the split spans are
 * aria-hidden). No-ops under reduced motion or a background-tab load.
 */

import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";

export default function HeroHeadline({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const words = text.split(" ");

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const wordEls = gsap.utils.toArray<HTMLElement>(el.querySelectorAll(".hh-word"));
    const innerEls = el.querySelectorAll<HTMLElement>(".hh-inner");
    const host = el.closest("section") ?? el;

    const ctx = gsap.context(() => {
      // Entrance — only when the tab is actually visible (rAF runs), else the
      // words would set their "from" state and never play, leaving them hidden.
      if (document.visibilityState !== "hidden") {
        gsap.fromTo(
          innerEls,
          { yPercent: 120, rotate: 6, opacity: 0 },
          { yPercent: 0, rotate: 0, opacity: 1, ease: "power4.out", duration: 1.05, stagger: 0.07, delay: 0.05 }
        );
      }
    }, ref);

    // Pointer parallax: each word drifts, depth cycling 1/2/3 so the line layers.
    const quick = wordEls.map((w) => ({
      x: gsap.quickTo(w, "x", { duration: 0.7, ease: "power3" }),
      y: gsap.quickTo(w, "y", { duration: 0.7, ease: "power3" }),
    }));

    const onMove = (e: Event) => {
      const ev = e as PointerEvent;
      const r = el.getBoundingClientRect();
      const cx = (ev.clientX - r.left) / r.width - 0.5;
      const cy = (ev.clientY - r.top) / r.height - 0.5;
      wordEls.forEach((_, i) => {
        const depth = ((i % 3) + 1) * 7;
        quick[i].x(cx * depth);
        quick[i].y(cy * depth * 0.55);
      });
    };
    const onLeave = () => wordEls.forEach((_, i) => { quick[i].x(0); quick[i].y(0); });

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      ctx.revert();
    };
  }, []);

  return (
    <h1 ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span className="hh-word" key={`${w}-${i}`} aria-hidden="true">
          <span className="hh-inner">{w}</span>
        </span>
      ))}
    </h1>
  );
}
