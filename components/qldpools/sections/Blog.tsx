"use client";

import Reveal from "@/components/qldpools/anim/Reveal";
import { BLOG_INTRO, POSTS } from "@/app/qldpools/site/sections/kit";

const INK = "var(--qpi-ink)";
const BLUE = "var(--qpi-blue)";

/**
 * Blog — gallery option 8, "Offset Grid": four posts in a grid, alternating
 * cards dropped down for rhythm.
 *
 * Client asked for the hover to crop each post's image frame into the
 * brand's arch shape. Driven entirely by CSS group-hover (no JS state) so
 * touch devices, which never hover, are left on the correct resting
 * rectangle. `rounded-t-full` is Tailwind's border-top-left/right-radius:
 * 9999px, which is exactly the site's ARCH_RADIUS with the bottom staying
 * square.
 */
export default function Blog() {
  return (
    <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14" aria-label="Blog">
      <div className="max-w-2xl mx-auto text-center mb-20">
        <p className="qpi-caps" style={{ color: BLUE, fontSize: 11 }}>
          {BLOG_INTRO.kicker}
        </p>
        <h2
          className="qpi-display text-balance mt-4"
          style={{ color: INK, fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05 }}
        >
          {BLOG_INTRO.heading}
        </h2>
      </div>

      <Reveal
        selector=".b-card"
        stagger={0.08}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
      >
        {POSTS.map((p, i) => (
          <div key={p.title} className="b-card group" style={{ marginTop: i % 2 === 1 ? 40 : 0 }}>
            <div
              className="relative aspect-[3/4] overflow-hidden mb-5 rounded-none transition-[border-radius] duration-[600ms] ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:rounded-t-full"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.img}
                alt={p.title}
                className="w-full h-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <p className="qpi-caps" style={{ color: BLUE, fontSize: 9 }}>
              {p.tag}
            </p>
            <h3 className="mt-2" style={{ color: INK, fontWeight: 700, fontSize: "0.9375rem", lineHeight: 1.35 }}>
              {p.title}
            </h3>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
