"use client";

/**
 * HeroHeadline — the hero H1 as kinetic 3D type.
 *
 *  - words flip up into place on load (3D rotateX, staggered);
 *  - the whole line tilts in 3D toward the cursor while each word sits at its own
 *    depth (translateZ in three layers) for real parallax;
 *  - a cursor "heat" tints nearby words toward pink by proximity;
 *  - hovering a word pops it forward + pink.
 *
 * Stays a real <h1> (aria-label carries the text; split spans are aria-hidden).
 * No-ops under reduced motion or a background-tab load.
 */

import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";

const INK = [20, 20, 20];
const PINK = [255, 31, 143];
const HEAT_RADIUS = 240;

function mix(a: number[], b: number[], t: number) {
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

export default function HeroHeadline({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const words = text.split(" ");

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const wordEls = gsap.utils.toArray<HTMLElement>(el.querySelectorAll(".hh-word"));
    const innerEls = gsap.utils.toArray<HTMLElement>(el.querySelectorAll(".hh-inner"));
    const host = (el.closest("section") as HTMLElement) ?? el;

    const ctx = gsap.context(() => {
      if (document.visibilityState !== "hidden") {
        // 3D flip-up entrance.
        gsap.set(el, { transformPerspective: 1000 });
        gsap.fromTo(
          innerEls,
          { rotationX: -95, y: 44, z: -80, opacity: 0, transformOrigin: "50% 100%" },
          { rotationX: 0, y: 0, z: 0, opacity: 1, ease: "power3.out", duration: 1.1, stagger: 0.08, delay: 0.05 }
        );
      }
      // resting depth per word: three layers, front to back.
      wordEls.forEach((w, i) => gsap.set(w, { z: (((i % 3) - 1) * 26) }));
    }, ref);

    // Smooth pointer-driven 3D tilt of the whole line.
    const rotY = gsap.quickTo(el, "rotationY", { duration: 0.8, ease: "power3" });
    const rotX = gsap.quickTo(el, "rotationX", { duration: 0.8, ease: "power3" });
    // Per-word drift (depth keeps its resting z; we add x/y).
    const drift = wordEls.map((w) => ({
      x: gsap.quickTo(w, "x", { duration: 0.7, ease: "power3" }),
      y: gsap.quickTo(w, "y", { duration: 0.7, ease: "power3" }),
    }));

    let raf = 0;
    let mx = 0, my = 0, active = false;
    const paint = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const cx = (mx - r.left) / r.width - 0.5;
      const cy = (my - r.top) / r.height - 0.5;
      rotY(cx * 14);
      rotX(-cy * 9);
      wordEls.forEach((w, i) => {
        const depth = ((i % 3) + 1) * 6;
        drift[i].x(cx * depth);
        drift[i].y(cy * depth * 0.5);
        // proximity heat → pink
        const wr = w.getBoundingClientRect();
        const dx = mx - (wr.left + wr.width / 2);
        const dy = my - (wr.top + wr.height / 2);
        const dist = Math.hypot(dx, dy);
        const heat = active ? Math.max(0, 1 - dist / HEAT_RADIUS) : 0;
        (innerEls[i] as HTMLElement).style.color = heat > 0.02 ? mix(INK, PINK, heat) : "";
      });
    };
    const onMove = (e: Event) => {
      const ev = e as PointerEvent;
      mx = ev.clientX; my = ev.clientY; active = true;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const onLeave = () => {
      active = false;
      rotY(0); rotX(0);
      drift.forEach((d) => { d.x(0); d.y(0); });
      innerEls.forEach((n) => { (n as HTMLElement).style.color = ""; });
    };

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      ctx.revert();
    };
  }, []);

  return (
    <h1 ref={ref} className={`hh-3d ${className ?? ""}`} aria-label={text}>
      {words.map((w, i) => (
        <span className="hh-word" key={`${w}-${i}`} aria-hidden="true">
          <span className="hh-inner">{w}</span>
        </span>
      ))}
    </h1>
  );
}
