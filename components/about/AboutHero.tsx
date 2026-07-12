"use client";

/**
 * AboutHero — the "Nice to meet you" statement with the headshot masked into a
 * cycling brand symbol, centred over the type.
 *
 *   1. The statement's characters rise in and the page rests as plain text.
 *   2. HOVERING the centre zone activates the takeover: the symbol (headshot
 *      clipped inside it) scales in and a wave scatters the characters out of
 *      its footprint (translate only). Leaving reverses back to plain text.
 *   3. The mask cycles through the brand icon batch with instant swaps,
 *      the same glyphs (and feel) as the statement's hovering inline icons.
 *   The hover target is a fixed-size zone, so the symbol scaling can't make
 *   the pointer flicker on and off it.
 *
 * Reduced motion: readable statement, symbol hidden, no animation.
 */

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import InlineIcon, { ICON_BATCH } from "@/components/InlineIcon";

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

// The headshot masks into the same brand icon batch the statement's inline
// icons reel through (InlineIcon.ICON_BATCH).

const PUSH_MARGIN = 28;   // px of clearance beyond the symbol's edge
const WAVE_SPEED = 1500;  // px/second the scatter wave travels outward
const MASK_ID = "ah-symbol-mask";

export default function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);   // scatter target (scales in)
  const hitRef = useRef<HTMLDivElement>(null);      // fixed-size hover zone
  const [symbol, setSymbol] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const photo = photoRef.current;
    const hit = hitRef.current;
    if (!section || !photo || !hit) return;

    const chars = Array.from(section.querySelectorAll<HTMLElement>(".ah-char"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Per-character scatter offsets, from the resting layout, so the symbol's
    // footprint clears and the wave reads through the whole line.
    const buildScatter = () => {
      const c = photo.getBoundingClientRect();
      const cx = c.left + c.width / 2;
      const cy = c.top + c.height / 2;
      const R = c.width / 2 + PUSH_MARGIN;
      return chars.map((el) => {
        const b = el.getBoundingClientRect();
        const dx = b.left + b.width / 2 - cx;
        const dy = b.top + b.height / 2 - cy;
        const d = Math.hypot(dx, dy) || 1;
        const ux = dx / d;
        const uy = dy / d;
        const clear = d < R ? R - d + 70 + gsap.utils.random(20, 110) : 0;
        const shove = 150 * Math.exp(-Math.max(d - R, 0) / 320) + gsap.utils.random(6, 26);
        const out = clear + shove;
        const side = gsap.utils.random(-0.35, 0.35) * out;
        return { el, x: ux * out - uy * side, y: uy * out + ux * side, delay: d / WAVE_SPEED };
      });
    };

    if (reduce) {
      gsap.set(chars, { opacity: 1, yPercent: 0 });
      gsap.set(photo, { opacity: 0 });
      return;
    }

    gsap.set(chars, { opacity: 0, yPercent: 90 });
    gsap.set(photo, { xPercent: -50, yPercent: -50, scale: 0, opacity: 1, transformOrigin: "center center" });

    // 1 — statement rises in (once, stays)
    const intro = gsap.timeline({ delay: 0.15 });
    intro.to(chars, { opacity: 1, yPercent: 0, duration: 0.7, stagger: 0.012, ease: "power3.out" });

    // 2 — symbol scales in + scatter, paused so hover can reverse it
    const scatter = gsap.timeline({ paused: true });
    scatter.to(photo, { scale: 1, duration: 0.5, ease: "power2.out" }, 0);
    buildScatter().forEach((s) => {
      scatter.to(s.el, { x: s.x, y: s.y, duration: 1.05, ease: "elastic.out(1, 0.5)" }, s.delay);
    });

    // 3 — cycle the mask symbol: instant swaps through the batch, no flip,
    //     exactly like the statement icons switching glyphs.
    const cycle = window.setInterval(() => {
      setSymbol((i) => (i + 1) % ICON_BATCH.length);
    }, 1200);

    // 4 — FLIPPED: plain readable text is the default; hovering the centre
    //     zone ACTIVATES the takeover (symbol in, characters scatter), and
    //     leaving reverses back to text. Fixed-size zone + guard so the
    //     symbol scaling never causes enter/leave flicker.
    let hovering = false;
    const onEnter = () => { if (hovering) return; hovering = true; scatter.timeScale(1).play(); };
    const onLeave = () => { if (!hovering) return; hovering = false; scatter.timeScale(1.6).reverse(); };
    hit.addEventListener("pointerenter", onEnter);
    hit.addEventListener("pointerleave", onLeave);

    return () => {
      clearInterval(cycle);
      hit.removeEventListener("pointerenter", onEnter);
      hit.removeEventListener("pointerleave", onLeave);
      intro.kill();
      scatter.kill();
      gsap.killTweensOf([photo, ...chars]);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[78svh] flex items-center justify-center py-16 md:py-24 overflow-hidden"
      aria-label="Introduction"
    >
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

      {/* Headshot masked into the current symbol, centred over the type. */}
      <div
        ref={photoRef}
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 z-20 pointer-events-none"
        style={{ width: "clamp(280px, 32vw, 440px)", aspectRatio: "1 / 1" }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" style={{ overflow: "visible" }}>
          <defs>
            {/* Generous mask region so wide/tall glyphs are never clipped. */}
            <mask id={MASK_ID} maskUnits="userSpaceOnUse" x="-40" y="-40" width="180" height="180">
              <rect x="-40" y="-40" width="180" height="180" fill="#000" />
              <text
                x="50"
                y="52"
                textAnchor="middle"
                dominantBaseline="central"
                fill="#fff"
                fontSize="90"
                style={{ fontFamily: "var(--font-dingbat), sans-serif" }}
              >
                {ICON_BATCH[symbol]}
              </text>
            </mask>
            {/* Pink duotone: map the b&w headshot onto the brand pink (dark
                shadows -> #e8718b highlights). */}
            <filter id="ah-pink" x="-40%" y="-40%" width="180%" height="180%" colorInterpolationFilters="sRGB">
              <feColorMatrix
                type="matrix"
                values="0.2413 0.4737 0.0920 0 0.102
                        0.1124 0.2207 0.0429 0 0.067
                        0.1405 0.2759 0.0536 0 0.075
                        0      0      0      1 0"
              />
            </filter>
          </defs>
          <image
            href="/images/about/finbar-full.webp"
            x="-40"
            y="-40"
            width="180"
            height="180"
            preserveAspectRatio="xMidYMid slice"
            mask={`url(#${MASK_ID})`}
            filter="url(#ah-pink)"
          />
        </svg>
      </div>

      {/* Fixed-size hover zone: never scales, so no enter/leave flicker. */}
      <div
        ref={hitRef}
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
        style={{ width: "clamp(300px, 34vw, 470px)", aspectRatio: "1 / 1" }}
      />
    </section>
  );
}
