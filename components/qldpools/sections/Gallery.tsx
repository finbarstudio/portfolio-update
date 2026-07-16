"use client";

import Reveal from "@/components/qldpools/anim/Reveal";
import { GALLERY_IMGS, AREAS, TESTIMONIALS } from "@/app/qldpools/site/sections/kit";

/**
 * Gallery — ported from options/gallery2.tsx entry 4 ("Scattered Polaroid
 * Stack"): five real project photos loosely overlapping at varied
 * rotations, like prints tipped out of an envelope. No heading here on
 * purpose — the client had this stripped before and wants it to stay that
 * way. The work speaks, a small caption sits in each polaroid's own white
 * border (an area name for four of them, a verbatim one-line Google review
 * on the print riding highest in the stack), and a single "View all
 * projects" button follows. No parallax on the photos: a scattered, rotated
 * stack already has plenty of its own visual movement, so a scroll-scrub on
 * top of five different rotation angles reads as noisy rather than premium.
 */

const STACK = GALLERY_IMGS.slice(0, 5).map((src, i) => ({
  src,
  area: AREAS[i % AREAS.length],
}));

const POLAROIDS = [
  { left: "6%", top: "4%", rot: -8, z: 10 },
  { left: "24%", top: "-2%", rot: 5, z: 20 },
  { left: "42%", top: "8%", rot: -3, z: 30 },
  { left: "60%", top: "-4%", rot: 7, z: 20 },
  { left: "76%", top: "6%", rot: -6, z: 10 },
];

// The print riding highest in the stack (index 2, z:30) carries a verbatim
// review instead of an area name.
const FEATURED_INDEX = 2;
const FEATURED_REVIEW = TESTIMONIALS[2].short;

export default function Gallery() {
  return (
    <section
      className="qpi-sec-work qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20"
      aria-label="Recent pool installations"
    >
      <style>{css}</style>

      <div className="mx-auto w-full max-w-[900px]">
        <Reveal
          as="div"
          selector=".g-tile"
          variant="water"
          stagger={0.09}
          className="relative mx-auto w-full max-w-[760px] h-[clamp(260px,38vh,380px)]"
        >
          {STACK.map((tile, i) => {
            const pos = POLAROIDS[i];
            const isFeatured = i === FEATURED_INDEX;
            return (
              <div
                key={tile.src}
                className="g-tile absolute"
                style={{
                  left: pos.left,
                  top: pos.top,
                  width: "20%",
                  background: "#fff",
                  padding: "8px 8px 10px",
                  boxShadow: "0 14px 26px rgba(25,60,90,0.22)",
                  transform: `rotate(${pos.rot}deg)`,
                  zIndex: pos.z,
                }}
              >
                <div style={{ aspectRatio: "1 / 1", overflow: "hidden", background: "var(--qpi-ink)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={tile.src}
                    alt={`A pool installed by QLD Pool Installs in ${tile.area}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <p
                  className={isFeatured ? "mt-2 text-center" : "qpi-caps mt-2 text-center"}
                  style={{
                    color: "var(--qpi-ink)",
                    opacity: isFeatured ? 0.85 : 0.5,
                    fontSize: isFeatured ? 9 : 8,
                    lineHeight: 1.3,
                  }}
                >
                  {isFeatured ? <>&ldquo;{FEATURED_REVIEW}&rdquo;</> : tile.area}
                </p>
              </div>
            );
          })}
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
