"use client";

import Reveal from "@/components/qldpools/anim/Reveal";
import Parallax from "@/components/qldpools/anim/Parallax";
import { BLOG_INTRO, POSTS } from "@/app/qldpools/site/sections/kit";

/**
 * Blog — carries over the arch-tile design the client liked on the Gallery
 * (ported there from options/gallery.tsx entry 17, "Arch-Topped 3-Up"), now
 * driven by post content instead of photos + areas: an arch-cropped post
 * image that shrinks upward on hover, the tag + title lifting into the space
 * that opens (pure layout reflow — no transform on the label), and the
 * post's own excerpt sliding up from a mask underneath. Pure CSS (:hover),
 * so it costs nothing on scroll and degrades cleanly to a fully legible
 * resting state on touch devices, which never hover. The hover crop only
 * ever eases — matching height transitions on both the arch and the excerpt
 * mask, never a snap.
 */

export default function Blog() {
  return (
    <section
      className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20"
      aria-label="Blog"
    >
      <style>{css}</style>

      <div className="mx-auto w-full max-w-[1200px]">
        <div className="max-w-2xl mx-auto text-center mb-8 md:mb-10">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {BLOG_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-3"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)", lineHeight: 1.05 }}
          >
            {BLOG_INTRO.heading}
          </h2>
        </div>

        <Reveal
          as="div"
          selector=".b-card"
          variant="water"
          stagger={0.09}
          className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4"
        >
          {POSTS.map((post) => (
            <a key={post.title} href="#" className="b-card qb-tile block text-center">
              <div className="qb-arch">
                <Parallax amount={12} className="h-full w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.img}
                    alt={post.title}
                    className="h-full w-full object-cover object-top"
                    loading="lazy"
                  />
                </Parallax>
              </div>

              <p className="qpi-caps mt-4 text-[9px]" style={{ color: "var(--qpi-blue)" }}>
                {post.tag}
              </p>
              <p
                className="qb-title mt-1"
                style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "0.875rem", lineHeight: 1.35 }}
              >
                {post.title}
              </p>

              <div className="qb-body mx-auto w-full max-w-[260px]">
                <p className="qb-body-text">{post.body}</p>
              </div>
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

const css = `
.qb-title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.qb-arch {
  position: relative;
  overflow: hidden;
  background: var(--qpi-ink);
  border-radius: 9999px 9999px 6px 6px;
  height: clamp(170px, 17vw, 240px);
}

.qb-body {
  overflow: hidden;
  height: 0;
}

.qb-body-text {
  padding-top: 0.85em;
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  color: var(--qpi-ink);
  opacity: 0;
  transform: translateY(100%);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

@media (prefers-reduced-motion: no-preference) {
  .qb-arch {
    transition: height 600ms cubic-bezier(0.65, 0, 0.35, 1);
  }
  .qb-body {
    transition: height 600ms cubic-bezier(0.65, 0, 0.35, 1);
  }
  .qb-body-text {
    transition: transform 550ms cubic-bezier(0.65, 0, 0.35, 1), opacity 420ms ease 60ms;
  }
  .b-card:hover .qb-arch {
    height: calc(clamp(170px, 17vw, 240px) * 0.8);
  }
  .b-card:hover .qb-body {
    height: 4.8em;
  }
  .b-card:hover .qb-body-text {
    opacity: 1;
    transform: translateY(0);
  }
}
`;
