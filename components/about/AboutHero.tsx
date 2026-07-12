"use client";

/**
 * AboutHero — the "Nice to meet you" statement with the isolated portrait in
 * a circular frame, centred BEHIND the type.
 *
 * Choreography (GSAP):
 *   1. The statement's characters stagger in.
 *   2. The circle pops in at the centre and a RIPPLE radiates outward: every
 *      character is hit in distance order. Characters inside the circle's
 *      footprint get shoved out past the rim and spring into place; the rest
 *      take a decaying impulse and swing back home. Translate only, no
 *      scale/filter/warp on the type.
 *
 * The circle crops the cutout tight, so the portrait has no hard bottom edge.
 * Reduced motion: final state, no animation.
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
      computePushes().forEach((p) => gsap.set(p.el, { x: p.x, y: p.y }));
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
    // 2 — the circle grows in
    // 3 — a ripple radiates from the centre: every character is hit in
    //     distance order (a wave). Characters inside the circle's footprint
    //     get shoved out and stay there (springy settle); characters beyond
    //     it take a decaying impulse and swing back home. Translate only.
    tl.add(() => {
      const c = circle.getBoundingClientRect();
      const cx = c.left + c.width / 2;
      const cy = c.top + c.height / 2;
      const R = c.width / 2 + PUSH_MARGIN;
      const WAVE_SPEED = 1600; // px per second
      const grow = gsap.timeline();
      grow.to(circle, { scale: 1, duration: 0.55, ease: "power2.out" }, 0);
      chars.forEach((el) => {
        const b = el.getBoundingClientRect();
        const dx = b.left + b.width / 2 - cx;
        const dy = b.top + b.height / 2 - cy;
        const d = Math.hypot(dx, dy) || 1;
        const ux = dx / d;
        const uy = dy / d;
        const delay = d / WAVE_SPEED;
        if (d < R) {
          // inside the impact zone: shoved out past the rim, springs into place
          const out = R - d;
          grow.to(
            el,
            { x: ux * out, y: uy * out, duration: 1.05, ease: "elastic.out(1, 0.55)" },
            delay
          );
        } else {
          // beyond the rim: the wave passes through, a decaying kick then home
          const kick = 30 * Math.exp(-(d - R) / 260);
          if (kick < 1.5) return;
          grow
            .to(el, { x: ux * kick, y: uy * kick, duration: 0.16, ease: "power2.out" }, delay)
            .to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.45)" }, delay + 0.16);
        }
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
      {/* Portrait — isolated cutout, circle-cropped tight, behind the type */}
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
          src="/images/about/finbar.webp"
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
