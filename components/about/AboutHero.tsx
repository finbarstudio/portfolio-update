"use client";

/**
 * AboutHero — the "Nice to meet you" statement with an isolated photo of Finbar
 * centred over the type.
 *
 *   1. The statement mask-reveals WORD by word from the bottom (Finbar's call:
 *      not the old per-character rise, a per-word mask), then rests as plain
 *      text.
 *   2. HOVERING the centre zone activates the takeover: the photo (a b/w
 *      cutout on a transparent ground) scales in and a wave scatters the
 *      characters out of its footprint (translate only). Leaving reverses
 *      back to plain text.
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
// Isolated b/w cutout on a transparent ground — head + shoulders sitting over
// the type, no disc/backing. (finbar.webp carries a real alpha channel; the old
// finbar-long-hair.webp was an opaque photo whose light ground read as white.)
const PHOTO_SRC = "/images/about/finbar.webp";
const PHOTO_ASPECT = "900 / 863";

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
        // NOTE this measures the rect while the photo sits at scale(0), so R is
        // effectively just PUSH_MARGIN and characters get only the gentle
        // exponential shove — that IS the wave Finbar likes. A "fixed" version
        // using offsetWidth pushed the text a full disc-radius away and he
        // called it off: characters brushing the photo's edge is the design.
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

      // 1 — entrance: each WORD mask-reveals from the bottom, staggered along
      //     the statement. The mask is a clip-path on the word wrapper (never
      //     overflow: hidden — that changes an inline-block's baseline and
      //     shifts the whole line), and it's cleared when the intro lands so
      //     the hover scatter can fly characters out of the word boxes.
      //     .from() + immediateRender:false keeps the natural visible layout
      //     as the default: if the ticker never runs (unfocused/headless tab)
      //     the statement stays readable rather than stranded mid-mask.
      const words = gsap.utils.toArray<HTMLElement>(".ah-word");
      gsap.set(words, { clipPath: "inset(0% -0.1em -0.06em -0.1em)" });
      const intro = gsap.timeline({
        onComplete: () => gsap.set(words, { clearProps: "clipPath" }),
      });
      words.forEach((w, i) => {
        intro.from(w.querySelectorAll(".ah-char"), {
          yPercent: 115, duration: 0.65, ease: "power3.out", immediateRender: false,
        }, i * 0.04);
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
      handlers.enter = () => {
        if (hovering) return;
        hovering = true;
        // Hovering mid-entrance: land the intro instantly (which also clears
        // the word masks via its onComplete) so the scatter is never clipped.
        if (intro.progress() < 1) intro.progress(1);
        scatter.timeScale(1).play();
      };
      handlers.leave = () => { if (!hovering) return; hovering = false; scatter.timeScale(1.6).reverse(); };

      // Touch devices have no hover, so the photo would never appear: play the
      // takeover automatically once the word reveal has landed. Tapping the
      // centre zone then toggles photo <-> readable text.
      if (window.matchMedia("(hover: none)").matches) {
        gsap.delayedCall(1.8, () => handlers.enter());
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
            {/* .ah-word doubles as the entrance mask: the intro clips each word
                to its own box while its characters rise in from below (see the
                timeline), then the clip is cleared so the hover scatter can fly
                characters out of it freely. */}
            {t.icon ? (
              <span className="ah-word inline-block">
                <span className="ah-char inline-block will-change-transform">
                  <InlineIcon char={t.icon} className="home-disc-icon" />
                </span>
              </span>
            ) : (
              <span className="ah-word inline-block whitespace-nowrap" aria-hidden="true">
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
        className="absolute left-1/2 top-1/2 z-20 pointer-events-none"
        style={{
          width: "clamp(300px, 34vw, 460px)",
          aspectRatio: PHOTO_ASPECT,
        }}
      >
        {/* Transparent cutout — sits directly over the type, no disc/backing. */}
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
