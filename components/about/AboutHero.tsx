"use client";

/**
 * AboutHero — the "Nice to meet you" statement with Finbar's photo.
 *
 *   1. On load NOTHING is visible. The statement then reveals WORD by word, one
 *      at a time, each rising up through a clean bottom mask. Translation only:
 *      the mask is a clip-path, never opacity or scale. When it finishes it
 *      dispatches "about:intro-done" so the page content below can load in
 *      (AboutRevealGate).
 *   2. HOVERING the centre zone activates the takeover: the photo — a b/w cutout
 *      in a circular frame (a ring, no fill) — scales in and a wave scatters the
 *      characters out of its footprint (translate only). Leaving reverses it.
 *   The hover target is a fixed-size zone, so the photo scaling can't make the
 *   pointer flicker on and off it.
 *
 * Reduced motion / background tab: readable statement, photo hidden, gate released.
 */

import { useLayoutEffect, useRef } from "react";
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
// Isolated b/w cutout on a transparent ground, shown in a circular frame (the
// ring has no fill, so the type reads through where the cutout is transparent).
const PHOTO_SRC = "/images/about/finbar.webp";
const PHOTO_ASPECT = "1 / 1";

export default function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);   // scatter target (scales in)
  const hitRef = useRef<HTMLDivElement>(null);      // fixed-size hover zone

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const photo = photoRef.current;
    const hit = hitRef.current;
    if (!section || !photo || !hit) return;

    // Fired once when the statement lands (or is skipped): the content below
    // stays gated behind this (AboutRevealGate).
    let signalled = false;
    const signalDone = () => {
      if (signalled) return;
      signalled = true;
      window.dispatchEvent(new Event("about:intro-done"));
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Background tab: GSAP's ticker is throttled, so the intro would set the
    // hidden state and never play. Skip the reveal and release the gate.
    const inactive = document.visibilityState === "hidden";

    let hovering = false;
    const noop = () => {};
    const handlers: { enter: () => void; leave: () => void; toggle?: () => void } = { enter: noop, leave: noop };

    // Scoped to the section: ctx.revert() on cleanup restores the natural inline
    // styles (readable text, no transforms), so a Strict-Mode double-invoke or
    // an HMR teardown can never leave the statement stuck invisible.
    const ctx = gsap.context(() => {
      const chars = gsap.utils.toArray<HTMLElement>(".ah-char");
      const words = gsap.utils.toArray<HTMLElement>(".ah-word");

      // Per-character scatter offsets, measured from the RESTING layout (before
      // the intro hides the chars), so the photo's footprint clears and the wave
      // reads through the whole line.
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

      // Photo starts hidden (scale 0), centred.
      gsap.set(photo, { xPercent: -50, yPercent: -50, scale: 0, opacity: reduce ? 0 : 1, transformOrigin: "center center" });

      if (reduce || inactive) {
        gsap.set(photo, { opacity: 0 });
        signalDone();
        return;
      }

      // Measure the scatter from the resting positions FIRST...
      const scatterData = buildScatter();

      // ...then hide the statement: clip each word to its box with a hard BOTTOM
      // edge (a hair of top/side room for descenders + side bearing), and drop
      // every char below that edge so nothing shows on load.
      gsap.set(words, { clipPath: "inset(-0.06em -0.2em 0em -0.2em)" });
      gsap.set(chars, { yPercent: 118 });

      // 1 — entrance: each WORD rises in, one at a time, translate only.
      const intro = gsap.timeline({
        onComplete: () => { gsap.set(words, { clearProps: "clipPath" }); signalDone(); },
      });
      words.forEach((w, i) => {
        intro.to(w.querySelectorAll(".ah-char"), {
          yPercent: 0, duration: 0.52, ease: "power3.out",
        }, i * 0.085);
      });

      // 2 — photo scales in + scatter, paused so hover can reverse it.
      const scatter = gsap.timeline({ paused: true });
      scatter.to(photo, { scale: 1, duration: 0.5, ease: "power2.out" }, 0);
      scatterData.forEach((s) => {
        scatter.to(s.el, { x: s.x, y: s.y, duration: 1.05, ease: "elastic.out(1, 0.5)" }, s.delay);
      });

      // 3 — plain readable text is the default; hovering the centre zone
      //     ACTIVATES the takeover (photo in, characters scatter), and leaving
      //     reverses back to text.
      handlers.enter = () => {
        if (hovering) return;
        hovering = true;
        // Hovering mid-entrance: land the intro instantly (its onComplete clears
        // the masks + releases the gate) so the scatter is never clipped.
        if (intro.progress() < 1) intro.progress(1);
        scatter.timeScale(1).play();
      };
      handlers.leave = () => { if (!hovering) return; hovering = false; scatter.timeScale(1.6).reverse(); };

      // Touch devices have no hover: play the takeover once the word reveal has
      // landed, then let a tap on the centre zone toggle photo <-> text.
      if (window.matchMedia("(hover: none)").matches) {
        gsap.delayedCall(intro.duration() + 0.4, () => handlers.enter());
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
                to its own box while its characters rise in from below, then the
                clip is cleared so the hover scatter can fly characters out. */}
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

      {/* Photo in a circular frame (ring only, transparent fill), centred over
          the type. Scales in on hover; the type shows through the clear parts. */}
      <div
        ref={photoRef}
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 z-20 pointer-events-none overflow-hidden"
        style={{
          width: "clamp(300px, 34vw, 460px)",
          aspectRatio: PHOTO_ASPECT,
          borderRadius: "50%",
          border: "1.5px solid var(--line)",
          background: "transparent",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PHOTO_SRC}
          alt="Finbar"
          className="w-full h-full"
          style={{ objectFit: "cover", objectPosition: "center 18%" }}
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
