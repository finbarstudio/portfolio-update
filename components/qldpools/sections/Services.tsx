"use client";

import Reveal from "@/components/qldpools/anim/Reveal";
import Parallax from "@/components/qldpools/anim/Parallax";
import { SERVICES_INTRO, SERVICES, GALLERY_IMGS } from "@/app/qldpools/site/sections/kit";

/**
 * Services — full redesign per client feedback: "complete solutions, which I
 * don't like at all... I want more of a 200vh and grid section."
 *
 * Replaces the old two-column numbered-list layout with a tall, true
 * editorial grid: a sticky heading column on the left (unchanged pattern
 * from the rest of the demo), and on the right a hairline-ruled grid of all
 * nine services — a wide feature cell for Design Consultation (paired with
 * a photo in the brand's signature arch frame) followed by the remaining
 * eight running two-per-row across four rows.
 *
 * Client requests baked in:
 *  1. ~200vh — the section carries a tall min-height at md+ so the grid has
 *     real room to run; mobile drops the forced height entirely and stacks
 *     normally instead of leaving huge blank gaps.
 *  2. A real GRID, not rows — a single hairline-ruled grid (shared dividing
 *     lines, not nine separate card boxes), 2-up at md+, feature cell
 *     spanning both columns as the opening row.
 *  3. Breathing room — generous section padding, column gap, and per-cell
 *     padding, on top of the tall cell min-heights themselves.
 *
 * The heading column is sticky at md+ (same stretch-column trick used
 * elsewhere in the demo — grid default align-items: stretch gives the
 * sticky INNER block real travel across the tall grid). The feature cell's
 * photo uses Reveal's "water" variant (rises into its arch frame on entry)
 * plus Parallax for a slow drift while scrolling; both already guard
 * prefers-reduced-motion and animate FROM a hidden state internally, so
 * content is never stuck invisible if JS never runs.
 */
export default function Services() {
  const [feature, ...rest] = SERVICES;

  return (
    <section
      className="relative w-full bg-white py-24 md:py-36 md:min-h-[190vh] qpi-gutter"
      aria-label="Services"
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-y-14 md:grid-cols-12 md:gap-x-16">
        {/* Heading column — stretches to the row's full height so the sticky
            inner block has real travel across the tall grid */}
        <div className="md:col-span-4">
          <Reveal as="div" className="md:sticky md:top-28">
            <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
              {SERVICES_INTRO.kicker}
            </p>
            <h2
              className="qpi-display text-balance mt-4"
              style={{
                color: "var(--qpi-ink)",
                fontSize: "clamp(2rem, 4vw, 3.25rem)",
                lineHeight: 1.05,
              }}
            >
              {SERVICES_INTRO.heading}
            </h2>
            <p
              className="text-pretty mt-5"
              style={{
                color: "var(--qpi-ink)",
                opacity: 0.6,
                fontSize: "1rem",
                lineHeight: 1.65,
                maxWidth: 380,
              }}
            >
              {SERVICES_INTRO.sub}
            </p>
          </Reveal>
        </div>

        {/* Services grid — one hairline-ruled grid, feature cell + 2-up */}
        <div className="md:col-span-8">
          <Reveal
            as="ul"
            selector=".s-cell"
            stagger={0.06}
            className="grid grid-cols-1 border-t border-l border-[var(--qpi-ink)]/15 sm:grid-cols-2"
          >
            {/* Feature cell — Design Consultation, paired with an arch-framed photo */}
            <li
              className="s-cell col-span-full flex flex-col gap-8 border-r border-b border-[var(--qpi-ink)]/15 p-8 sm:flex-row sm:items-center md:min-h-[min(40vh,420px)] md:p-12"
            >
              <div className="flex-1">
                <span className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
                  01
                </span>
                <h3
                  className="mt-3"
                  style={{
                    color: "var(--qpi-ink)",
                    fontWeight: 700,
                    fontSize: "clamp(1.375rem, 2.2vw, 1.75rem)",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-pretty mt-3"
                  style={{
                    color: "var(--qpi-ink)",
                    opacity: 0.6,
                    fontSize: "0.9375rem",
                    lineHeight: 1.65,
                    maxWidth: 440,
                  }}
                >
                  {feature.body}
                </p>
              </div>

              <div className="relative h-64 w-full flex-shrink-0 overflow-hidden rounded-t-full sm:h-56 sm:w-48 md:h-[min(34vh,340px)] md:w-60">
                <Reveal variant="water" className="h-full w-full">
                  <Parallax amount={10} className="h-full w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={GALLERY_IMGS[0]}
                      alt="A pool installed by QLD Pool Installs"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </Parallax>
                </Reveal>
              </div>
            </li>

            {/* Remaining eight services — 2-up hairline grid, generous cells */}
            {rest.map((s, i) => (
              <li
                key={s.title}
                className="s-cell flex flex-col justify-between border-r border-b border-[var(--qpi-ink)]/15 p-8 md:min-h-[min(30vh,320px)] md:p-10"
              >
                <span className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
                  {String(i + 2).padStart(2, "0")}
                </span>
                <div>
                  <h3 style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1.125rem" }}>
                    {s.title}
                  </h3>
                  <p
                    className="text-pretty mt-3"
                    style={{
                      color: "var(--qpi-ink)",
                      opacity: 0.6,
                      fontSize: "0.9375rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
