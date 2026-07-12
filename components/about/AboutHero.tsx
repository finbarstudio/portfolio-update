"use client";

/**
 * AboutHero — the "Nice to meet you" statement with the full headshot centred
 * over it.
 *
 *   1. The statement's characters rise in.
 *   2. After a longer beat the photo (full, not cropped, not isolated) scales
 *      in and a wave scatters the characters out of its footprint (translate
 *      only) so they explode outward and stay there.
 *   3. Hovering the photo REVERSES that scatter: the characters slide back to
 *      their normal positions and the photo recedes, so the statement reads
 *      cleanly. Leaving re-scatters it.
 *
 * Reduced motion: final scattered state, no animation, no hover.
 */

import { useEffect, useRef } from "react";
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

const PUSH_MARGIN = 28; // px of clearance beyond the photo's edge
const WAVE_SPEED = 1500; // px per second (wave travels out from the centre)

export default function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const photo = photoRef.current;
    if (!section || !photo) return;

    const chars = Array.from(section.querySelectorAll<HTMLElement>(".ah-char"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Per-character scatter offsets, measured from the resting layout, so the
    // photo's footprint clears and the wave reads through the whole line.
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
        return {
          el,
          x: ux * out - uy * side,
          y: uy * out + ux * side,
          delay: d / WAVE_SPEED,
        };
      });
    };

    if (reduce) {
      // No animation and no hover reverse, so keep the statement readable and
      // leave the photo hidden rather than trapping the type scattered.
      gsap.set(chars, { opacity: 1, yPercent: 0 });
      gsap.set(photo, { opacity: 0 });
      return;
    }

    gsap.set(chars, { opacity: 0, yPercent: 90 });
    gsap.set(photo, { xPercent: -50, yPercent: -50, scale: 0, opacity: 1, transformOrigin: "center center" });

    // 1 — the statement rises in (plays once, stays)
    const intro = gsap.timeline({ delay: 0.15 });
    intro.to(chars, { opacity: 1, yPercent: 0, duration: 0.7, stagger: 0.012, ease: "power3.out" });

    // 2 — photo scales in + the scatter, as a paused timeline we reverse on hover
    const scatter = gsap.timeline({ paused: true });
    scatter.to(photo, { scale: 1, duration: 0.5, ease: "power2.out" }, 0);
    buildScatter().forEach((s) => {
      scatter.to(s.el, { x: s.x, y: s.y, duration: 1.05, ease: "elastic.out(1, 0.5)" }, s.delay);
    });

    // start the scatter after a longer beat
    const startT = window.setTimeout(() => scatter.play(), 3000);

    // hover the photo -> reverse to normal, readable text; leave -> re-scatter
    const onEnter = () => scatter.timeScale(1.6).reverse();
    const onLeave = () => scatter.timeScale(1).play();
    photo.style.pointerEvents = "auto";
    photo.addEventListener("mouseenter", onEnter);
    photo.addEventListener("mouseleave", onLeave);

    return () => {
      clearTimeout(startT);
      photo.removeEventListener("mouseenter", onEnter);
      photo.removeEventListener("mouseleave", onLeave);
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

      {/* Full photo, centred over the type; hover reverses the scatter. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={photoRef}
        src="/images/about/finbar-full.webp"
        alt=""
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 z-20 pointer-events-none"
        style={{ width: "clamp(280px, 32vw, 440px)", borderRadius: "4px" }}
      />
    </section>
  );
}
