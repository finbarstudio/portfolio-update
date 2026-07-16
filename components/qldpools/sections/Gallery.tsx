"use client";

import Reveal from "@/components/qldpools/anim/Reveal";
import Parallax from "@/components/qldpools/anim/Parallax";
import { GALLERY_IMGS, TESTIMONIALS, AREAS } from "@/app/qldpools/site/sections/kit";

/**
 * Gallery — ported from options/gallery.tsx entry 17 ("Arch-Topped 3-Up"):
 * arch-cropped photo tiles (border-radius on the top corners only) under a
 * No heading here on purpose: the work speaks, and a single "View all
 * projects" button follows the tiles. Adds the hover the client asked for: the arch
 * crops up from the bottom, the area label moves into the space that opens,
 * and a verbatim one-line Google review slides up from a mask underneath.
 * Pure CSS (:hover), so it costs nothing on scroll and degrades cleanly to a
 * fully legible resting state on touch devices.
 */

const TILES = GALLERY_IMGS.slice(0, 3).map((src, i) => ({
  src,
  area: AREAS[i % AREAS.length],
  review: TESTIMONIALS[i % TESTIMONIALS.length].short,
}));

export default function Gallery() {
  return (
    <section
      className="qg relative flex w-full flex-col justify-center bg-white qpi-gutter min-h-svh py-16 md:py-20"
      aria-label="Recent pool installations"
    >
      <style>{css}</style>

      <div className="mx-auto max-w-[1200px]">
        <Reveal
          as="div"
          selector=".g-tile"
          variant="water"
          stagger={0.09}
          className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:grid-cols-3 md:gap-x-10"
        >
          {TILES.map((tile) => (
            <div key={tile.src} className="g-tile qg-tile text-center">
              <div className="qg-arch">
                <Parallax amount={12} className="h-full w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={tile.src}
                    alt={`A pool installed by QLD Pool Installs in ${tile.area}`}
                    className="h-full w-full object-cover object-top"
                    loading="lazy"
                  />
                </Parallax>
              </div>

              <p className="qg-title qpi-caps mt-5 text-[11px]" style={{ color: "var(--qpi-ink)", opacity: 0.7 }}>
                {tile.area}
              </p>

              <div className="qg-review mx-auto w-full max-w-[240px]">
                <p className="qg-review-text">&ldquo;{tile.review}&rdquo;</p>
              </div>
            </div>
          ))}
        </Reveal>

        <div className="mt-12 flex justify-center md:mt-14">
          <a href="#" className="qg-cta qpi-caps text-[10px]">
            View all projects &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}

const css = `
.qg-arch {
  position: relative;
  overflow: hidden;
  background: var(--qpi-ink);
  border-radius: 9999px 9999px 6px 6px;
  height: clamp(200px, 22vw, 300px);
}

.qg-review {
  overflow: hidden;
  height: 0;
}

.qg-review-text {
  padding-top: 0.85em;
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--qpi-ink);
  opacity: 0;
  transform: translateY(100%);
}

@media (prefers-reduced-motion: no-preference) {
  .qg-arch {
    transition: height 600ms cubic-bezier(0.65, 0, 0.35, 1);
  }
  .qg-review {
    transition: height 600ms cubic-bezier(0.65, 0, 0.35, 1);
  }
  .qg-review-text {
    transition: transform 550ms cubic-bezier(0.65, 0, 0.35, 1), opacity 420ms ease 60ms;
  }
  .qg-tile:hover .qg-arch {
    height: calc(clamp(200px, 22vw, 300px) * 0.82);
  }
  .qg-tile:hover .qg-review {
    height: 3.6em;
  }
  .qg-tile:hover .qg-review-text {
    opacity: 1;
    transform: translateY(0);
  }
}

.qg-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  color: var(--qpi-ink);
  background: transparent;
  border: 1px solid rgba(30, 63, 74, 0.25);
  padding: 0.85em 1.5em;
  border-radius: 999px;
  text-decoration: none;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.qg-cta:hover {
  background: var(--qpi-ink);
  color: #fff;
  border-color: var(--qpi-ink);
}
`;
