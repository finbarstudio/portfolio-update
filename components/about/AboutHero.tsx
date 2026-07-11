"use client";

/**
 * AboutHero — the "Nice to meet you" statement with the thresholded portrait
 * in a circular frame, centred BEHIND the type.
 *
 * Choreography (GSAP):
 *   1. The statement's characters stagger in (masked rise, word by word).
 *   2. The portrait circle scales in from nothing at the section's centre.
 *   3. As it grows, only the characters sitting inside the circle's final
 *      footprint get pushed radially outward (with a little scatter), so the
 *      type visibly gives the portrait its space. Everything else stays put.
 *
 * The circle also crops the cutout tight, so the portrait has no hard bottom
 * edge. Reduced motion: everything renders in its final state, no animation.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import InlineIcon from "@/components/InlineIcon";

// The statement, tokenised: words become per-character spans; icons are one
// unit each so their hover reel keeps working.
type Token = { word?: string; icon?: string; pink?: boolean };
const TOKENS: Token[] = [
  { word: "Nice" }, { word: "to" }, { word: "meet" }, { word: "you" },
  { icon: "👪" },
  { word: "I’m" }, { word: "Finbar", pink: true },
  { icon: "⦿" },
  { word: "one" }, { word: "day" }, { word: "I" }, { word: "woke" }, { word: "up" },
  { icon: "❉" },
  { word: "and" }, { word: "found" }, { word: "my" }, { word: "feet" },
  { icon: "🮲🮳" },
  { word: "in" }, { word: "design" },
  { icon: "✎" },
  { word: "and" }, { word: "I" }, { word: "haven’t" }, { word: "moved" }, { word: "since" },
  { icon: "♡" },
];

const PUSH_MARGIN = 28; // px of clearance beyond the circle's edge

export default function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const circle = circleRef.current;
    if (!section || !circle) return;

    const chars = Array.from(section.querySelectorAll<HTMLElement>(".ah-char"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Radial push for every char whose box intersects the circle's final
    // footprint. Measured from resting layout, so run before any transforms.
    const computePushes = () => {
      const c = circle.getBoundingClientRect();
      const cx = c.left + c.width / 2;
      const cy = c.top + c.height / 2;
      const R = c.width / 2 + PUSH_MARGIN;
      return chars.map((el) => {
        const b = el.getBoundingClientRect();
        const ex = b.left + b.width / 2;
        const ey = b.top + b.height / 2;
        const dx = ex - cx;
        const dy = ey - cy;
        const d = Math.hypot(dx, dy) || 1;
        if (d >= R) return null;
        const out = R - d;
        return {
          el,
          x: (dx / d) * out,
          y: (dy / d) * out,
          r: gsap.utils.random(-9, 9), // a touch of scatter
        };
      }).filter(Boolean) as { el: HTMLElement; x: number; y: number; r: number }[];
    };

    if (reduce) {
      gsap.set(chars, { opacity: 1, yPercent: 0 });
      gsap.set(circle, { scale: 1, opacity: 1 });
      computePushes().forEach((p) => gsap.set(p.el, { x: p.x, y: p.y, rotation: p.r }));
      return;
    }

    gsap.set(chars, { opacity: 0, yPercent: 90 });
    gsap.set(circle, { scale: 0, opacity: 1 });

    const tl = gsap.timeline({ delay: 0.15 });
    // 1 — the statement rises in
    tl.to(chars, {
      opacity: 1,
      yPercent: 0,
      duration: 0.7,
      stagger: 0.012,
      ease: "power3.out",
    });
    // 2 + 3 — the circle grows while the affected characters clear out of its way
    tl.add(() => {
      const pushes = computePushes();
      const grow = gsap.timeline();
      grow.to(circle, { scale: 1, duration: 1.15, ease: "power3.inOut" }, 0);
      pushes.forEach((p) => {
        grow.to(p.el, { x: p.x, y: p.y, rotation: p.r, duration: 1.15, ease: "power3.inOut" }, 0);
      });
    }, ">+0.15");

    return () => {
      tl.kill();
      gsap.killTweensOf([circle, ...chars]);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[78svh] flex items-center justify-center py-16 md:py-24 overflow-hidden"
      aria-label="Introduction"
    >
      {/* Portrait — thresholded, circle-cropped tight, centred behind the type */}
      <div
        ref={circleRef}
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden pointer-events-none"
        style={{
          width: "clamp(270px, 32vw, 430px)",
          aspectRatio: "1 / 1",
          background: "var(--surface-sunken)",
          border: "1px solid var(--line)",
          opacity: 0, // GSAP takes over immediately; avoids a pre-hydration flash
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/about/finbar-threshold.webp"
          alt=""
          className="absolute inset-x-0 top-[8%] w-full h-auto"
          style={{ transform: "scale(1.24)", transformOrigin: "top center" }}
        />
      </div>

      <h1
        className="home-disc relative z-10 text-center max-w-[24ch]"
        aria-label="Nice to meet you, I'm Finbar. One day I woke up and found my feet in design and I haven't moved since."
      >
        {TOKENS.map((t, i) => (
          <span key={i}>
            {t.icon ? (
              <span className="ah-char inline-block will-change-transform">
                <InlineIcon char={t.icon} className="home-disc-icon" />
              </span>
            ) : (
              <span className="inline-block whitespace-nowrap" aria-hidden="true">
                {[...(t.word as string)].map((ch, j) => (
                  <span
                    key={j}
                    className={`ah-char inline-block will-change-transform ${t.pink ? "home-disc-pink" : ""}`}
                  >
                    {ch}
                  </span>
                ))}
              </span>
            )}
            {i < TOKENS.length - 1 ? " " : ""}
          </span>
        ))}
      </h1>
    </section>
  );
}
