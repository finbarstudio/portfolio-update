"use client";

/**
 * AboutHero — the "Nice to meet you" statement with an isolated photo of Finbar
 * centred over the type.
 *
 *   1. The statement's characters rise in and the page rests as plain text.
 *   2. HOVERING the centre zone activates the takeover: the photo (a regular
 *      head-and-shoulders cut-out on a transparent background) scales in and a
 *      wave scatters the characters out of its footprint (translate only).
 *      Leaving reverses back to plain text.
 *   The hover target is a fixed-size zone, so the photo scaling can't make the
 *   pointer flicker on and off it.
 *
 * Reduced motion: readable statement, photo hidden, no animation.
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

const PUSH_MARGIN = 28;   // px of clearance beyond the photo's edge
const WAVE_SPEED = 1500;  // px/second the scatter wave travels outward
// Transparent cutout, trimmed to the subject's real bounds (900x858).
const PHOTO_SRC = "/images/about/finbar-hero.webp";
const PHOTO_ASPECT = "900 / 858";

export default function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);   // scatter target (scales in)
  const hitRef = useRef<HTMLDivElement>(null);      // fixed-size hover zone

  useEffect(() => {
    const section = sectionRef.current;
    const photo = photoRef.current;
    const hit = hitRef.current;
    if (!section || !photo || !hit) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let hovering = false;
    const onEnter = () => {};
    const handlers: { enter: () => void; leave: () => void; toggle?: () => void } = { enter: onEnter, leave: onEnter };

    // Scoped to the section: ctx.revert() on cleanup restores the natural inline
    // styles (readable text, no transforms), so a Strict-Mode double-invoke or
    // an HMR teardown can never leave the statement stuck invisible.
    const ctx = gsap.context(() => {
      const chars = gsap.utils.toArray<HTMLElement>(".ah-char");

      // Per-character scatter offsets, from the resting layout, so the photo's
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
        gsap.set(photo, { xPercent: -50, yPercent: -50, opacity: 0 });
        return;
      }

      gsap.set(photo, { xPercent: -50, yPercent: -50, scale: 0, opacity: 1, transformOrigin: "center center" });

      // 1 — statement rises in from below (once, then rests as plain text).
      //     .from() + immediateRender:false means the DEFAULT is the natural,
      //     visible layout: the characters are only hidden once the tween
      //     actually starts ticking, so if the ticker never runs (e.g. an
      //     unfocused/headless tab) the statement simply stays readable rather
      //     than stranded invisible.
      const intro = gsap.timeline();
      intro.from(chars, {
        opacity: 0, yPercent: 90, duration: 0.7, stagger: 0.012,
        ease: "power3.out", immediateRender: false,
      });

      // 2 — photo scales in + scatter, paused so hover can reverse it
      const scatter = gsap.timeline({ paused: true });
      scatter.to(photo, { scale: 1, duration: 0.5, ease: "power2.out" }, 0);
      buildScatter().forEach((s) => {
        scatter.to(s.el, { x: s.x, y: s.y, duration: 1.05, ease: "elastic.out(1, 0.5)" }, s.delay);
      });

      // 3 — plain readable text is the default; hovering the centre zone
      //     ACTIVATES the takeover (photo in, characters scatter), and leaving
      //     reverses back to text. Fixed-size zone + guard so the photo scaling
      //     never causes enter/leave flicker.
      handlers.enter = () => { if (hovering) return; hovering = true; scatter.timeScale(1).play(); };
      handlers.leave = () => { if (!hovering) return; hovering = false; scatter.timeScale(1.6).reverse(); };

      // Touch devices have no hover, so the photo would never appear: after
      // the intro settles, play the takeover automatically. Tapping the centre
      // zone then toggles between photo and readable text.
      if (window.matchMedia("(hover: none)").matches) {
        gsap.delayedCall(1.4, () => handlers.enter());
        handlers.toggle = () => { if (hovering) handlers.leave(); else handlers.enter(); };
      }
    }, section);

    const enter = () => handlers.enter();
    const leave = () => handlers.leave();
    const tap = () => handlers.toggle?.();
    if (window.matchMedia("(hover: none)").matches) {
      hit.addEventListener("click", tap);
    } else {
      hit.addEventListener("pointerenter", enter);
      hit.addEventListener("pointerleave", leave);
    }

    return () => {
      hit.removeEventListener("pointerenter", enter);
      hit.removeEventListener("pointerleave", leave);
      hit.removeEventListener("click", tap);
      ctx.revert();
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

      {/* Isolated head-and-shoulders photo, centred over the type. */}
      <div
        ref={photoRef}
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 z-20 pointer-events-none overflow-hidden"
        style={{ width: "clamp(300px, 34vw, 460px)", aspectRatio: PHOTO_ASPECT, borderRadius: "50%" }}
      >
        {/* Transparent cutout (whites in the hair fringe pre-mapped to the page
            colour), trimmed to the subject — no box, and the scatter samples
            this image's alpha to wrap the silhouette. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PHOTO_SRC}
          alt="Finbar"
          className="w-full h-full"
          style={{ objectFit: "contain" }}
        />
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
