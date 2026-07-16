"use client";

import Parallax from "@/components/qldpools/anim/Parallax";
import Reveal from "@/components/qldpools/anim/Reveal";
import { TESTIMONIALS_INTRO, TESTIMONIALS, GALLERY_IMGS } from "@/app/qldpools/site/sections/kit";

/**
 * Testimonials — gallery option 16, "Floating Card on Photo": a full-bleed
 * dusk shot with a single white quote card floating over it.
 *
 * Client asked for parallax on the photo, so the background now drifts
 * against the scroll inside the shared Parallax frame instead of sitting
 * pinned as a plain absolute <img>. Reveal staggers the card in on scroll.
 */
export default function Testimonials() {
  return (
    <section
      className="relative w-full overflow-hidden py-24 md:py-32"
      aria-label="Testimonials"
    >
      {/* Full-bleed background photo — deliberately NOT inside the gutter,
          it should run edge to edge. Only the card below respects it. */}
      <div className="absolute inset-0">
        <Parallax amount={12} className="h-full w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={GALLERY_IMGS[4]}
            alt="A pool installed by QLD Pool Installs, lit at dusk"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </Parallax>
      </div>
      <div className="absolute inset-0" style={{ background: "rgba(11,42,74,0.35)" }} />

      <div className="relative z-10 qpi-gutter">
        <Reveal selector=".t-item" stagger={0.09} className="mx-auto max-w-[640px]">
          <div className="t-item bg-white p-10 md:p-14">
            <p className="qpi-caps mb-6" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
              {TESTIMONIALS_INTRO.kicker}
            </p>
            <p
              className="text-balance"
              style={{
                color: "var(--qpi-ink)",
                fontSize: "clamp(1.375rem, 2.6vw, 2rem)",
                lineHeight: 1.4,
                fontWeight: 600,
              }}
            >
              &ldquo;{TESTIMONIALS[2].short}&rdquo;
            </p>
            <p className="qpi-caps mt-7" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 11 }}>
              {TESTIMONIALS[2].name}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
