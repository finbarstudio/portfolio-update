"use client";

import Reveal from "@/components/qldpools/anim/Reveal";
import { TESTIMONIALS_INTRO, TESTIMONIALS, GALLERY_IMGS } from "@/app/qldpools/site/sections/kit";

/**
 * Testimonials — "Scattered Review Deck" (app/qldpools/site/sections/options/
 * testimonials2.tsx, entry 4 / gallery option 29). Five real Google reviews
 * as overlapping, rotated cards, scattered like a dropped deck.
 *
 * Rotation lives on an inner wrapper, never on the ".t-item" element itself:
 * Reveal writes its own transform (y/opacity) onto ".t-item", and a baked
 * rotate() on that same node would get clobbered by GSAP's transform. The
 * outer ".t-item" only carries position + z-index; the inner div carries the
 * card's background, border, shadow and rotation.
 */

const CARDS = [
  { t: TESTIMONIALS[0], rot: -6, top: 10, left: "4%", w: 300 },
  { t: TESTIMONIALS[1], rot: 4, top: 60, left: "30%", w: 320 },
  { t: TESTIMONIALS[2], rot: -3, top: 0, left: "58%", w: 300 },
  { t: TESTIMONIALS[3], rot: 7, top: 190, left: "12%", w: 300 },
  { t: TESTIMONIALS[4], rot: -8, top: 220, left: "62%", w: 300 },
] as const;

export default function Testimonials() {
  return (
    <section
      className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20"
      aria-label="Testimonials"
    >
      <p className="qpi-caps mb-10 text-center" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
        {TESTIMONIALS_INTRO.kicker} &nbsp;&middot;&nbsp; 5.0 on Google
      </p>
      <Reveal selector=".t-item" stagger={0.09}>
        <div className="relative mx-auto w-full max-w-[1100px]" style={{ height: 460 }}>
          {CARDS.map((c, i) => (
            <div
              key={c.t.name}
              className="t-item absolute"
              style={{ top: c.top, left: c.left, width: c.w, zIndex: 10 + i }}
            >
              <div
                className="p-6"
                style={{
                  background: "#fff",
                  border: "1px solid rgba(25,60,90,0.18)",
                  boxShadow: "0 14px 30px rgba(25,60,90,0.12)",
                  transform: `rotate(${c.rot}deg)`,
                }}
              >
                <p style={{ color: "var(--qpi-blue)", fontSize: 12, letterSpacing: "0.08em" }} aria-label="5 out of 5 stars">
                  ★★★★★
                </p>
                <p style={{ color: "var(--qpi-ink)", opacity: 0.8, fontSize: 13, lineHeight: 1.55, marginTop: 10 }}>{c.t.short}</p>
                <p className="qpi-caps mt-4" style={{ color: "var(--qpi-ink)", opacity: 0.45, fontSize: 9 }}>
                  {c.t.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
