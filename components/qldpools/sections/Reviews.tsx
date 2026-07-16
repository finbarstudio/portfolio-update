"use client";

/**
 * Reviews — the client's pick, built as a scroll-driven MORPH between two of his
 * chosen options. (The option set they came from has since been retired; see git
 * history for `options/reviews2.tsx`.)
 *
 *   RESTING (opens the section) — "Star Sunburst" (his reviews option 44)
 *   END (settles as you scroll)  — "Oversized Quotation Mark" (his option 42)
 *
 * As the visitor scrolls through the section, the sunburst's stars + stat
 * block scatter outward, rotate slightly and fade, while the quote-card's
 * pieces arrive from scattered offsets into their resting positions — one
 * scrubbed GSAP ScrollTrigger timeline drives both halves at once.
 *
 * Content is real, verbatim Google reviews from REVIEW_STATS/TESTIMONIALS in
 * the shared kit — nothing here is invented or reworded. The Google "G" mark
 * and attribution link (kept from the previous rotating-panel build) are the
 * one exception to the demo's palette rule; Google's terms require them
 * alongside review content.
 */

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { REVIEW_STATS, TESTIMONIALS } from "@/app/qldpools/site/sections/kit";

gsap.registerPlugin(ScrollTrigger);

const GOOGLE_REVIEWS_URL = "https://www.google.com/search?q=QLD+Pool+Installs+reviews";
const FEATURED = TESTIMONIALS[4]; // Cathy W — same review the "Oversized Quotation Mark" option featured
const SUNBURST_STARS = 12;

function Star({ color, size = 14 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M12 2.5l2.9 6.4 6.9.6-5.3 4.7 1.6 6.8L12 17.6l-6.1 3.4 1.6-6.8-5.3-4.7 6.9-.6z" />
    </svg>
  );
}

function StarRow({
  color = "var(--qpi-blue)",
  size = 14,
  gap = 3,
}: {
  color?: string;
  size?: number;
  gap?: number;
}) {
  return (
    <span role="img" aria-label={`${REVIEW_STATS.rating} out of 5 stars`} style={{ display: "inline-flex", gap }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} color={color} size={size} />
      ))}
    </span>
  );
}

/* Google's real "G" mark, in Google's own brand colours — the one exception
 * to the demo's palette rule; their terms require it beside review content. */
function GoogleMark({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
    </svg>
  );
}

function GoogleAttribution() {
  return (
    <a
      href={GOOGLE_REVIEWS_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Read QLD Pool Installs reviews on Google, opens in a new tab"
      className="inline-flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
      style={{ outlineColor: "var(--qpi-blue)" }}
    >
      <GoogleMark size={16} />
      <span className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.65, fontSize: 10 }}>
        Google Reviews
      </span>
    </a>
  );
}

/* Radius each star sits at when resting — kept as a constant (rather than
 * re-derived) so the scatter tween can scale distance travelled by this same
 * radius per the "further out stars travel further" note. */
const STAR_RADIUS = 120;

/* ── Layout 44 · Star Sunburst — the RESTING state ── */
function SunburstLayout() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 20 }}>
      <div
        className="relative flex items-center justify-center"
        style={{ width: "min(70vw, 420px)", height: "clamp(260px, 36vh, 360px)" }}
      >
        {Array.from({ length: SUNBURST_STARS }).map((_, i) => {
          // Each star's own placement angle — baked onto the node as a data
          // attribute so the scatter tween can read back the SAME angle a
          // star was placed at, rather than recomputing a different formula.
          const angle = (360 / SUNBURST_STARS) * i;
          const rad = (angle * Math.PI) / 180;
          const px = Math.cos(rad) * STAR_RADIUS;
          const py = Math.sin(rad) * STAR_RADIUS;
          return (
            <div
              key={i}
              className="absolute"
              style={{ left: `calc(50% + ${px}px - 7px)`, top: `calc(50% + ${py}px - 7px)` }}
            >
              {/* Placement (left/top) lives on this outer node; GSAP only
               * ever animates the inner node's transform, so the two never
               * fight over the same property. */}
              <div className="r44-star" data-angle={angle} data-radius={STAR_RADIUS}>
                <Star color="var(--qpi-blue)" size={14} />
              </div>
            </div>
          );
        })}
        <div className="r44-center flex flex-col items-center text-center">
          <p className="qpi-display" style={{ color: "var(--qpi-ink)", fontSize: "clamp(2rem, 4vw, 2.75rem)", lineHeight: 1 }}>
            {REVIEW_STATS.rating}
          </p>
          <p className="qpi-caps mt-2" style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: 10 }}>
            {REVIEW_STATS.word} &middot; {REVIEW_STATS.count}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Layout 42 · Oversized Quotation Mark — the END state ──
 * Top-left anchored: the oversized mark sits at the top-left corner of the
 * quote block and the block itself reads left-aligned, not centred. */
function QuoteLayout() {
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 10 }}>
      <div className="relative mx-auto text-left" style={{ maxWidth: 700 }}>
        <p
          aria-hidden="true"
          className="r42-piece qpi-display absolute"
          style={{
            color: "var(--qpi-blue)",
            opacity: 0.12,
            fontSize: "clamp(5rem, 11vw, 8.5rem)",
            lineHeight: 1,
            top: "-2.2rem",
            left: "-0.35rem",
          }}
        >
          &ldquo;
        </p>
        <div className="relative" style={{ paddingTop: "1.5rem" }}>
          <p className="r42-piece" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.25rem, 2.6vw, 1.75rem)", lineHeight: 1.4, fontWeight: 600 }}>
            {FEATURED.quote}
          </p>
          <p className="r42-piece qpi-caps mt-5" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {FEATURED.name}
          </p>
          <div className="r42-piece flex items-center justify-start gap-2 mt-4">
            <StarRow size={11} />
            <span className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 9 }}>
              {REVIEW_STATS.rating} &middot; {REVIEW_STATS.count}
            </span>
          </div>
          <div className="r42-piece flex justify-start mt-4">
            <GoogleAttribution />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Reviews() {
  const sectionRef = useRef<HTMLElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Layout 42 starts scattered + hidden — applied here, never in the
      // JSX, so a visitor without JS still sees it in its normal, legible
      // resting state (stacked under the sunburst, but present and legible).
      gsap.set(".r42-piece", {
        opacity: 0,
        x: (i: number) => (i % 2 === 0 ? -1 : 1) * (36 + i * 16),
        y: (i: number) => (i % 2 === 0 ? 1 : -1) * (26 + i * 12),
        scale: 0.95,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=120%",
          scrub: 0.5,
        },
      });

      // Sequential, never overlapping: the sunburst fully scatters and
      // clears over the first ~55% of the scroll, THEN the testimonial
      // arrives from ~60%. Gap between 0.55 and 0.6 keeps the two layers
      // from ever being visible on top of each other mid-scrub.
      const SCATTER_END = 0.55;
      const QUOTE_START = 0.6;

      // Each star scatters OUTWARD along its own placement angle (baked as
      // data-angle/data-radius on the node) — never a separately-computed
      // formula — so it travels dead away from the sunburst's centre.
      // Distance scales with the star's own radius, so stars further out
      // travel further.
      tl.to(
        ".r44-star",
        {
          x: (_i: number, target: Element) => {
            const el = target as HTMLElement;
            const angle = Number(el.dataset.angle);
            const radius = Number(el.dataset.radius) || STAR_RADIUS;
            const rad = (angle * Math.PI) / 180;
            return Math.round(Math.cos(rad) * radius * 0.85);
          },
          y: (_i: number, target: Element) => {
            const el = target as HTMLElement;
            const angle = Number(el.dataset.angle);
            const radius = Number(el.dataset.radius) || STAR_RADIUS;
            const rad = (angle * Math.PI) / 180;
            return Math.round(Math.sin(rad) * radius * 0.85);
          },
          rotation: (i: number) => (i % 2 === 0 ? 10 : -10),
          opacity: 0,
          scale: 0.9,
          duration: SCATTER_END,
          stagger: { each: 0.025, from: "center" },
          ease: "power2.in",
        },
        0
      );

      // Centre rating block has no placement angle of its own — it just
      // settles back and fades in place as the stars fly outward from it.
      tl.to(
        ".r44-center",
        {
          y: -12,
          opacity: 0,
          scale: 0.85,
          duration: SCATTER_END,
          ease: "power2.in",
        },
        0
      );

      // Quote card only starts arriving once the scatter has fully cleared.
      tl.to(
        ".r42-piece",
        {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1 - QUOTE_START,
          stagger: { each: 0.03, from: "center" },
          ease: "power3.out",
        },
        QUOTE_START
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <h2 className="sr-only">{REVIEW_STATS.heading}</h2>
        <div className="relative mx-auto text-left" style={{ maxWidth: 700 }}>
          <p
            aria-hidden="true"
            className="qpi-display absolute"
            style={{
              color: "var(--qpi-blue)",
              opacity: 0.12,
              fontSize: "clamp(5rem, 11vw, 8.5rem)",
              lineHeight: 1,
              top: "-2.2rem",
              left: "-0.35rem",
            }}
          >
            &ldquo;
          </p>
          <div className="relative" style={{ paddingTop: "1.5rem" }}>
            <p style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.25rem, 2.6vw, 1.75rem)", lineHeight: 1.4, fontWeight: 600 }}>
              {FEATURED.quote}
            </p>
            <p className="qpi-caps mt-5" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
              {FEATURED.name}
            </p>
            <div className="flex items-center justify-start gap-2 mt-4">
              <StarRow size={11} />
              <span className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 9 }}>
                {REVIEW_STATS.rating} &middot; {REVIEW_STATS.count}
              </span>
            </div>
            <div className="flex justify-start mt-4">
              <GoogleAttribution />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="qpi-gutter relative w-full bg-white min-h-[220vh]">
      <h2 className="sr-only">{REVIEW_STATS.heading}</h2>
      <div className="sticky top-0 h-svh flex flex-col justify-center overflow-hidden">
        <SunburstLayout />
        <QuoteLayout />
      </div>
    </section>
  );
}
