"use client";

/**
 * AboutHero — the "Nice to meet you" statement with the headshot masked into a
 * cycling brand symbol, centred over the type.
 *
 *   1. The statement's characters rise in.
 *   2. After a longer beat the symbol (headshot clipped inside it) scales in and
 *      a wave scatters the characters out of its footprint (translate only), so
 *      they explode outward and stay there.
 *   3. The symbol rotates through a set of shapes, flipping between them.
 *   4. Hovering the symbol REVERSES the scatter so the statement reads cleanly;
 *      leaving re-scatters it. The hover target is a fixed-size zone, so the
 *      symbol scaling can't make the pointer flicker on and off it.
 *
 * Reduced motion: readable statement, symbol hidden, no animation.
 */

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import InlineIcon from "@/components/InlineIcon";

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

// Solid-ish brand symbols the headshot masks into; easy to re-order/swap.
const SYMBOLS = ["●", "★", "♥", "✶", "✦"];

const PUSH_MARGIN = 28;   // px of clearance beyond the symbol's edge
const WAVE_SPEED = 1500;  // px/second the scatter wave travels outward
const MASK_ID = "ah-symbol-mask";

export default function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);   // scatter target (scales in)
  const svgRef = useRef<SVGSVGElement>(null);       // flip target (symbol swap)
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
    const startT = window.setTimeout(() => scatter.play(), 3000);

    // 3 — cycle the symbol: flip the svg edge-on, swap the glyph, flip back
    const cycle = window.setInterval(() => {
      const el = svgRef.current;
      if (!el) { setSymbol((i) => (i + 1) % SYMBOLS.length); return; }
      gsap.timeline()
        .to(el, { scaleX: 0, duration: 0.28, ease: "power2.in", onComplete: () => setSymbol((i) => (i + 1) % SYMBOLS.length) })
        .to(el, { scaleX: 1, duration: 0.34, ease: "power2.out" });
    }, 3200);

    // 4 — hover reverse, off a fixed-size zone with a guard so the symbol
    //     scaling never causes a flicker of enter/leave events.
    let hovering = false;
    const onEnter = () => { if (hovering) return; hovering = true; scatter.timeScale(1.6).reverse(); };
    const onLeave = () => { if (!hovering) return; hovering = false; scatter.timeScale(1).play(); };
    hit.addEventListener("pointerenter", onEnter);
    hit.addEventListener("pointerleave", onLeave);

    return () => {
      clearTimeout(startT);
      clearInterval(cycle);
      hit.removeEventListener("pointerenter", onEnter);
      hit.removeEventListener("pointerleave", onLeave);
      intro.kill();
      scatter.kill();
      gsap.killTweensOf([photo, svgRef.current, ...chars]);
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
        <svg ref={svgRef} viewBox="0 0 100 100" className="w-full h-full" style={{ transformOrigin: "center center" }}>
          <defs>
            <mask id={MASK_ID}>
              <rect x="0" y="0" width="100" height="100" fill="#000" />
              <text
                x="50"
                y="52"
                textAnchor="middle"
                dominantBaseline="central"
                fill="#fff"
                fontSize="96"
                style={{ fontFamily: "var(--font-dingbat), sans-serif" }}
              >
                {SYMBOLS[symbol]}
              </text>
            </mask>
          </defs>
          <image
            href="/images/about/finbar-full.webp"
            x="0"
            y="0"
            width="100"
            height="100"
            preserveAspectRatio="xMidYMid slice"
            mask={`url(#${MASK_ID})`}
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
