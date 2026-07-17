"use client";

import Reveal from "@/components/qldpools/anim/Reveal";
import { SERVICES_INTRO, SERVICES } from "@/app/qldpools/site/sections/kit";

/**
 * Services — ported from options/services.tsx entry 22 ("Centred Vertical
 * Dividers"), the design the client picked: a centred kicker + heading over
 * three rows of three services, each row a hairline-divided trio (vertical
 * rules between cells, one horizontal rule between rows).
 *
 * Client requests baked in:
 *  1. Shorter lead-in — SERVICES_INTRO.sub (the "From initial concept to
 *     final splash..." paragraph) is dropped. Only the kicker + heading run
 *     above the grid, so the section reads tighter and fits one viewport.
 *  2. Staggered entrance — the grid is wrapped in the shared Reveal kit
 *     (selector=".s-cell"), which lifts each cell in as the section scrolls
 *     into view. Reveal animates FROM hidden, so content stays visible if
 *     JS never runs, and it already respects prefers-reduced-motion.
 */
export default function Services() {
  const rows = [SERVICES.slice(0, 3), SERVICES.slice(3, 6), SERVICES.slice(6, 9)];

  return (
    <section
      className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20"
      aria-label="Services"
    >
      <div className="mx-auto max-w-5xl w-full">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {SERVICES_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-4"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05 }}
          >
            {SERVICES_INTRO.heading}
          </h2>
        </div>

        <Reveal as="div" selector=".s-cell" stagger={0.07}>
          {rows.map((row, ri) => (
            <div
              key={ri}
              className="grid grid-cols-1 sm:grid-cols-3"
              style={{ borderTop: ri > 0 ? "1px solid rgba(25,60,90,0.15)" : undefined }}
            >
              {row.map((s, i) => (
                <div
                  key={s.title}
                  className="s-cell text-center px-8 py-6"
                  style={{ borderLeft: i > 0 ? "1px solid rgba(25,60,90,0.15)" : undefined }}
                >
                  <h3 style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1.0625rem" }}>
                    {s.title}
                  </h3>
                  <p
                    className="text-pretty mt-3"
                    style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.875rem", lineHeight: 1.6 }}
                  >
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
