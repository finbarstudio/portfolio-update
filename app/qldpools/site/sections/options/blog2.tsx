import { BLOG_INTRO, POSTS, GALLERY_IMGS, type Section } from "../kit";

/**
 * Blog / "Latest Pool Insights & Projects" — SECOND batch, 20 wilder design
 * directions for the 4-post blog index block. The client approved the safe
 * 25-option batch in ./blog.tsx and asked for a genuinely creative second
 * pass: unusual grids, overlap, rotation, clip-path, asymmetry, varying
 * column heights. Same content-only constraint as blog.tsx — built purely
 * from BLOG_INTRO, POSTS and GALLERY_IMGS, no invented or reworded copy.
 */

const RULE = "1px solid rgba(11,42,74,0.15)";
const RULE_STRONG = "1px solid rgba(11,42,74,0.25)";
const INK = "var(--qpi-ink)";
const BLUE = "var(--qpi-blue)";

export const optionsBlog2: Section[] = [
  // 1 · Arch-topped columns of noticeably varying heights, skyline rhythm
  {
    name: "Arch Skyline",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-3xl mb-10">
          <p className="qpi-caps" style={{ color: BLUE, fontSize: 11 }}>
            {BLOG_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-3"
            style={{ color: INK, fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)", lineHeight: 1.05 }}
          >
            {BLOG_INTRO.heading}
          </h2>
        </div>
        <div className="flex items-end gap-5 md:gap-6 max-w-6xl mx-auto w-full">
          {POSTS.map((p, i) => {
            const heights = [280, 340, 220, 300];
            return (
              <div key={p.title} className="flex-1 flex flex-col justify-end min-w-0">
                <div
                  className="relative overflow-hidden mb-4 w-full"
                  style={{ height: heights[i], borderRadius: "9999px 9999px 0 0" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <p className="qpi-caps" style={{ color: BLUE, fontSize: 9 }}>{p.tag}</p>
                <h3 className="mt-1" style={{ color: INK, fontWeight: 700, fontSize: "0.8125rem", lineHeight: 1.35 }}>
                  {p.title}
                </h3>
              </div>
            );
          })}
        </div>
      </section>
    ),
  },

  // 2 · Contents-page index: hairline rules, one feature image, rest pure text rows
  {
    name: "Contents Page",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-5xl mx-auto w-full">
          <div
            className="flex items-baseline justify-between mb-10"
            style={{ borderBottom: RULE_STRONG, paddingBottom: 20 }}
          >
            <h2 className="qpi-display" style={{ color: INK, fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}>
              {BLOG_INTRO.heading}
            </h2>
            <p className="qpi-caps" style={{ color: BLUE, fontSize: 10 }}>{BLOG_INTRO.kicker}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-12">
            <div
              className="relative overflow-hidden mx-auto md:mx-0 w-full"
              style={{ aspectRatio: "3/4", borderRadius: "9999px 9999px 0 0", maxWidth: 320 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={POSTS[0].img} alt={POSTS[0].title} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div>
              {POSTS.map((p, i) => (
                <div
                  key={p.title}
                  className="flex items-baseline gap-4 py-5"
                  style={{ borderTop: i === 0 ? RULE_STRONG : undefined, borderBottom: RULE }}
                >
                  <span className="qpi-caps flex-shrink-0" style={{ color: INK, opacity: 0.3, fontSize: 11 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="flex-1" style={{ color: INK, fontWeight: 700, fontSize: "1rem", lineHeight: 1.35 }}>
                    {p.title}
                  </h3>
                  <span className="qpi-caps flex-shrink-0" style={{ color: BLUE, fontSize: 9 }}>{p.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    ),
  },

  // 3 · Horizontal ribbon of images bleeding off the right edge of the viewport
  {
    name: "Bleeding Ribbon",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-2xl mb-10">
          <p className="qpi-caps" style={{ color: BLUE, fontSize: 11 }}>
            {BLOG_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-3"
            style={{ color: INK, fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)", lineHeight: 1.05 }}
          >
            {BLOG_INTRO.heading}
          </h2>
        </div>
        <div className="flex gap-6" style={{ width: "130%" }}>
          {POSTS.map((p) => (
            <div key={p.title} className="flex-shrink-0" style={{ width: 260 }}>
              <div className="relative overflow-hidden mb-4" style={{ aspectRatio: "3/4" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <p className="qpi-caps" style={{ color: BLUE, fontSize: 9 }}>{p.tag}</p>
              <h3 className="mt-1" style={{ color: INK, fontWeight: 700, fontSize: "0.875rem", lineHeight: 1.35 }}>
                {p.title}
              </h3>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 4 · One feature post as a big arch shape, other 3 as tiny satellite thumbnails
  {
    name: "Arch + Satellites",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative mx-auto" style={{ maxWidth: 360 }}>
            <div
              className="relative overflow-hidden"
              style={{ aspectRatio: "3/4", borderRadius: "9999px 9999px 0 0" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={POSTS[0].img} alt={POSTS[0].title} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <p className="qpi-caps mt-4" style={{ color: BLUE, fontSize: 11 }}>{POSTS[0].tag}</p>
            <h3
              className="mt-2 text-balance"
              style={{ color: INK, fontWeight: 700, fontSize: "1.375rem", lineHeight: 1.2 }}
            >
              {POSTS[0].title}
            </h3>
          </div>
          <div>
            <p className="qpi-caps mb-6" style={{ color: BLUE, fontSize: 11 }}>
              {BLOG_INTRO.kicker}
            </p>
            <div className="flex flex-col gap-6">
              {POSTS.slice(1).map((p) => (
                <div key={p.title} className="flex items-center gap-4">
                  <div
                    className="relative flex-shrink-0 overflow-hidden"
                    style={{ width: 64, height: 64, borderRadius: "9999px 9999px 6px 6px" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div>
                    <p className="qpi-caps" style={{ color: BLUE, fontSize: 8 }}>{p.tag}</p>
                    <h4
                      className="mt-1"
                      style={{ color: INK, fontWeight: 600, fontSize: "0.8125rem", lineHeight: 1.35, maxWidth: 320 }}
                    >
                      {p.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    ),
  },

  // 5 · Oversized display titles with small round thumbnails inline before each
  {
    name: "Inline Thumb Type",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <p className="qpi-caps mb-8" style={{ color: BLUE, fontSize: 11 }}>
          {BLOG_INTRO.kicker}
        </p>
        <div className="max-w-4xl mx-auto w-full flex flex-col gap-5">
          {POSTS.map((p, i) => (
            <div key={p.title} className="flex items-center gap-5">
              <span
                className="relative inline-block overflow-hidden flex-shrink-0"
                style={{
                  width: "clamp(48px,6vw,72px)",
                  height: "clamp(48px,6vw,72px)",
                  borderRadius: "9999px 9999px 8px 8px",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
              </span>
              <h3
                className="qpi-display text-balance"
                style={{
                  color: i % 2 === 0 ? INK : BLUE,
                  fontSize: "clamp(1.125rem, 3vw, 2rem)",
                  lineHeight: 1.05,
                  maxWidth: 780,
                }}
              >
                {p.title}
              </h3>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 6 · Masthead-style newspaper fold with column-divided classified rows below
  {
    name: "Newspaper Fold",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center" style={{ borderTop: `3px solid ${INK}`, borderBottom: RULE_STRONG, padding: "14px 0" }}>
            <h2 className="qpi-display" style={{ color: INK, fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "0.02em" }}>
              {BLOG_INTRO.heading}
            </h2>
            <p className="qpi-caps mt-2" style={{ color: BLUE, fontSize: 10 }}>{BLOG_INTRO.kicker}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 mt-10" style={{ borderTop: RULE }}>
            {POSTS.map((p, i) => (
              <div key={p.title} className="p-6" style={{ borderRight: i < 3 ? RULE : undefined }}>
                <p className="qpi-caps" style={{ color: BLUE, fontSize: 9 }}>{p.tag}</p>
                <h3 className="mt-2" style={{ color: INK, fontWeight: 700, fontSize: "0.9375rem", lineHeight: 1.35 }}>
                  {p.title}
                </h3>
                <p className="text-pretty mt-2" style={{ color: INK, opacity: 0.6, fontSize: "0.75rem", lineHeight: 1.55 }}>
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 7 · Ink-navy band with white arch-shaped post cards floating on it
  {
    name: "Floating Arches On Navy",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="relative w-full max-w-6xl mx-auto" style={{ background: INK, padding: "48px 32px" }}>
          <p className="qpi-caps mb-6" style={{ color: "#fff", opacity: 0.6, fontSize: 11 }}>
            {BLOG_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mb-10"
            style={{ color: "#fff", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", maxWidth: 640 }}
          >
            {BLOG_INTRO.heading}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {POSTS.map((p) => (
              <div key={p.title} className="bg-white p-4" style={{ borderRadius: "9999px 9999px 4px 4px" }}>
                <div
                  className="relative overflow-hidden mb-4"
                  style={{ aspectRatio: "3/4", borderRadius: "9999px 9999px 2px 2px" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <p className="qpi-caps" style={{ color: BLUE, fontSize: 9 }}>{p.tag}</p>
                <h3 className="mt-1" style={{ color: INK, fontWeight: 700, fontSize: "0.8125rem", lineHeight: 1.35 }}>
                  {p.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 8 · Overlapping polaroid-style photo cards at slight rotation with captions
  {
    name: "Polaroid Scatter",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-2xl mb-12">
          <p className="qpi-caps" style={{ color: BLUE, fontSize: 11 }}>
            {BLOG_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-3"
            style={{ color: INK, fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)", lineHeight: 1.05 }}
          >
            {BLOG_INTRO.heading}
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-10 max-w-5xl mx-auto" style={{ paddingTop: 10 }}>
          {POSTS.map((p, i) => {
            const rot = [-6, 4, -3, 7][i];
            return (
              <div
                key={p.title}
                className="bg-white"
                style={{
                  width: 220,
                  padding: "12px 12px 18px",
                  boxShadow: "0 10px 24px rgba(11,42,74,0.18)",
                  border: RULE,
                  transform: `rotate(${rot}deg)`,
                  marginTop: i % 2 === 1 ? 18 : 0,
                }}
              >
                <div className="relative overflow-hidden mb-3" style={{ aspectRatio: "1/1" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <p className="qpi-caps" style={{ color: BLUE, fontSize: 8 }}>{p.tag}</p>
                <h3 className="mt-1" style={{ color: INK, fontWeight: 600, fontSize: "0.75rem", lineHeight: 1.3 }}>
                  {p.title}
                </h3>
              </div>
            );
          })}
        </div>
      </section>
    ),
  },

  // 9 · A tilted ribbon of cards cutting diagonally across the section
  {
    name: "Diagonal Cut Ribbon",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-2xl mb-16">
          <p className="qpi-caps" style={{ color: BLUE, fontSize: 11 }}>
            {BLOG_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-3"
            style={{ color: INK, fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)", lineHeight: 1.05 }}
          >
            {BLOG_INTRO.heading}
          </h2>
        </div>
        <div className="w-full flex justify-center" style={{ padding: "20px 0" }}>
          <div className="flex gap-6" style={{ transform: "rotate(-4deg)", width: "100%", maxWidth: 1100 }}>
            {POSTS.map((p) => (
              <div key={p.title} className="flex-1 min-w-0" style={{ background: INK, padding: 1 }}>
                <div className="bg-white p-4 h-full">
                  <div className="relative overflow-hidden mb-3" style={{ aspectRatio: "4/3" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <p className="qpi-caps" style={{ color: BLUE, fontSize: 8 }}>{p.tag}</p>
                  <h3 className="mt-1" style={{ color: INK, fontWeight: 600, fontSize: "0.75rem", lineHeight: 1.3 }}>
                    {p.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 10 · Tags rendered as huge graphic type, the primary visual anchor per row
  {
    name: "Tag Monument",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <p className="qpi-caps mb-8" style={{ color: BLUE, fontSize: 11 }}>
          {BLOG_INTRO.kicker}
        </p>
        <div className="max-w-6xl mx-auto w-full flex flex-col">
          {POSTS.map((p, i) => (
            <div
              key={p.title}
              className="flex items-center gap-6 md:gap-8 py-4"
              style={{ borderTop: i === 0 ? RULE_STRONG : undefined, borderBottom: RULE }}
            >
              <span
                className="qpi-display flex-shrink-0"
                style={{ color: i % 2 === 0 ? BLUE : INK, fontSize: "clamp(2rem, 6vw, 4.5rem)", lineHeight: 0.9, opacity: 0.9 }}
              >
                {p.tag}
              </span>
              <div
                className="relative flex-shrink-0 overflow-hidden hidden sm:block"
                style={{ width: 68, height: 68, borderRadius: "9999px 9999px 6px 6px" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <h3 className="flex-1" style={{ color: INK, fontWeight: 700, fontSize: "0.875rem", lineHeight: 1.35 }}>
                {p.title}
              </h3>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 11 · Hexagon clip-path image containers in a compact 4-up grid
  {
    name: "Hex-Clipped Grid",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <p className="qpi-caps" style={{ color: BLUE, fontSize: 11 }}>
            {BLOG_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-3"
            style={{ color: INK, fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)", lineHeight: 1.05 }}
          >
            {BLOG_INTRO.heading}
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {POSTS.map((p) => (
            <div key={p.title} className="text-center">
              <div
                className="relative overflow-hidden mx-auto mb-4"
                style={{
                  aspectRatio: "1/1",
                  maxWidth: 190,
                  clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <p className="qpi-caps" style={{ color: BLUE, fontSize: 9 }}>{p.tag}</p>
              <h3 className="mt-1" style={{ color: INK, fontWeight: 700, fontSize: "0.8125rem", lineHeight: 1.35 }}>
                {p.title}
              </h3>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 12 · Extreme asymmetric bento: one huge scrim cell + 3 wildly different ratios
  {
    name: "Extreme Bento",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div
          className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-5"
          style={{ height: "min(64vh, 560px)" }}
        >
          <div className="relative overflow-hidden" style={{ borderRadius: "9999px 9999px 4px 4px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={POSTS[0].img} alt={POSTS[0].title} className="w-full h-full object-cover" loading="lazy" />
            <div
              className="absolute inset-x-0 bottom-0 p-7"
              style={{ background: "linear-gradient(to top, rgba(11,42,74,0.85), rgba(11,42,74,0))" }}
            >
              <p className="qpi-caps" style={{ color: "#fff", opacity: 0.85, fontSize: 10 }}>{POSTS[0].tag}</p>
              <h3
                className="mt-1"
                style={{ color: "#fff", fontWeight: 700, fontSize: "1.25rem", lineHeight: 1.2, maxWidth: 380 }}
              >
                {POSTS[0].title}
              </h3>
            </div>
          </div>
          <div className="grid grid-rows-[1.4fr_0.8fr_1fr] gap-5 min-h-0">
            {POSTS.slice(1).map((p) => (
              <div key={p.title} className="relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                <div
                  className="absolute inset-x-0 bottom-0 p-4"
                  style={{ background: "linear-gradient(to top, rgba(11,42,74,0.8), rgba(11,42,74,0))" }}
                >
                  <p className="qpi-caps" style={{ color: "#fff", opacity: 0.85, fontSize: 8 }}>{p.tag}</p>
                  <h4 className="mt-1" style={{ color: "#fff", fontWeight: 700, fontSize: "0.75rem", lineHeight: 1.25 }}>
                    {p.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 13 · Ticket-stub cards: dashed perforation and punched notch circles
  {
    name: "Ticket Stub",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-2xl mb-14">
          <p className="qpi-caps" style={{ color: BLUE, fontSize: 11 }}>
            {BLOG_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-3"
            style={{ color: INK, fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)", lineHeight: 1.05 }}
          >
            {BLOG_INTRO.heading}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {POSTS.map((p) => (
            <div key={p.title} style={{ border: RULE_STRONG }}>
              <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="relative" style={{ borderTop: "1px dashed rgba(11,42,74,0.35)" }}>
                <span
                  className="absolute rounded-full bg-white"
                  style={{ width: 16, height: 16, left: -9, top: -8, border: RULE_STRONG }}
                />
                <span
                  className="absolute rounded-full bg-white"
                  style={{ width: 16, height: 16, right: -9, top: -8, border: RULE_STRONG }}
                />
              </div>
              <div className="p-4">
                <p className="qpi-caps" style={{ color: BLUE, fontSize: 9 }}>{p.tag}</p>
                <h3 className="mt-1" style={{ color: INK, fontWeight: 700, fontSize: "0.8125rem", lineHeight: 1.35 }}>
                  {p.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 14 · Vertical timeline spine with posts alternating left and right
  {
    name: "Timeline Spine",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <p className="qpi-caps" style={{ color: BLUE, fontSize: 11 }}>
            {BLOG_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-3"
            style={{ color: INK, fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.05 }}
          >
            {BLOG_INTRO.heading}
          </h2>
        </div>
        <div className="relative max-w-4xl mx-auto w-full">
          <div
            className="absolute left-1/2 top-0 bottom-0 hidden sm:block"
            style={{ width: 1, background: "rgba(11,42,74,0.2)", transform: "translateX(-0.5px)" }}
          />
          <div className="flex flex-col gap-8">
            {POSTS.map((p, i) => (
              <div key={p.title} className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div className={i % 2 === 1 ? "sm:order-2" : ""}>
                  <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                </div>
                <div className={i % 2 === 1 ? "sm:order-1 sm:text-right" : ""}>
                  <p className="qpi-caps" style={{ color: BLUE, fontSize: 9 }}>{p.tag}</p>
                  <h3 className="mt-1" style={{ color: INK, fontWeight: 700, fontSize: "0.9375rem", lineHeight: 1.35 }}>
                    {p.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 15 · Big outline numerals as a ledger anchor, titles run alongside
  {
    name: "Big Numeral Ledger",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <p className="qpi-caps mb-10" style={{ color: BLUE, fontSize: 11 }}>
          {BLOG_INTRO.kicker}
        </p>
        <div className="max-w-5xl mx-auto w-full">
          {POSTS.map((p, i) => (
            <div
              key={p.title}
              className="flex items-center gap-6"
              style={{ borderTop: i === 0 ? RULE_STRONG : undefined, borderBottom: RULE, padding: "10px 0" }}
            >
              <span
                className="qpi-display flex-shrink-0"
                style={{
                  color: "transparent",
                  WebkitTextStroke: `1.5px ${INK}`,
                  fontSize: "clamp(2.5rem, 5.5vw, 4rem)",
                  lineHeight: 1,
                  opacity: 0.5,
                  width: 96,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1">
                <h3 style={{ color: INK, fontWeight: 700, fontSize: "1.0625rem", lineHeight: 1.3 }}>{p.title}</h3>
              </div>
              <span className="qpi-caps flex-shrink-0" style={{ color: BLUE, fontSize: 10 }}>{p.tag}</span>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 16 · Posts arranged radially around a central navy heading circle
  {
    name: "Radial Orbit",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <p className="qpi-caps" style={{ color: BLUE, fontSize: 11 }}>
            {BLOG_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-3"
            style={{ color: INK, fontSize: "clamp(1.375rem, 2.6vw, 2rem)", lineHeight: 1.05 }}
          >
            {BLOG_INTRO.heading}
          </h2>
        </div>
        <div className="relative mx-auto hidden sm:block" style={{ width: 560, height: 420 }}>
          <div
            className="absolute rounded-full flex items-center justify-center text-center p-6"
            style={{
              width: 200,
              height: 200,
              left: "50%",
              top: "50%",
              transform: "translate(-50%,-50%)",
              background: INK,
            }}
          >
            <p className="qpi-caps" style={{ color: "#fff", fontSize: 9, opacity: 0.75, lineHeight: 1.5 }}>
              {BLOG_INTRO.heading}
            </p>
          </div>
          {POSTS.map((p, i) => {
            const pos = [
              { left: 0, top: 0 },
              { left: "calc(100% - 150px)", top: 0 },
              { left: 0, top: "calc(100% - 150px)" },
              { left: "calc(100% - 150px)", top: "calc(100% - 150px)" },
            ][i];
            return (
              <div key={p.title} className="absolute" style={{ width: 150, ...pos }}>
                <div
                  className="relative overflow-hidden mb-2"
                  style={{ aspectRatio: "1/1", borderRadius: "9999px" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <p className="qpi-caps" style={{ color: BLUE, fontSize: 8 }}>{p.tag}</p>
              </div>
            );
          })}
        </div>
        <div className="sm:hidden grid grid-cols-2 gap-4 max-w-sm mx-auto">
          {POSTS.map((p) => (
            <div key={p.title}>
              <div className="relative overflow-hidden mb-2" style={{ aspectRatio: "1/1", borderRadius: "9999px" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <p className="qpi-caps" style={{ color: BLUE, fontSize: 8 }}>{p.tag}</p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 17 · Section split into a diagonal-edged navy zone and a plain white zone
  {
    name: "Diagonal Split Zones",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div
          className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-10"
          style={{ minHeight: 480 }}
        >
          <div
            className="relative p-8 md:p-10 flex flex-col justify-center"
            style={{ background: INK, clipPath: "polygon(0 0, 100% 0, 88% 100%, 0% 100%)" }}
          >
            <p className="qpi-caps mb-4" style={{ color: "#fff", opacity: 0.6, fontSize: 10 }}>
              {BLOG_INTRO.kicker}
            </p>
            <h2
              className="qpi-display text-balance mb-8"
              style={{ color: "#fff", fontSize: "clamp(1.375rem, 2.6vw, 2rem)" }}
            >
              {BLOG_INTRO.heading}
            </h2>
            <div className="flex flex-col gap-6">
              {POSTS.slice(0, 2).map((p) => (
                <div key={p.title}>
                  <p className="qpi-caps" style={{ color: "#fff", opacity: 0.55, fontSize: 8 }}>{p.tag}</p>
                  <h3 className="mt-1" style={{ color: "#fff", fontWeight: 700, fontSize: "0.9375rem", lineHeight: 1.3 }}>
                    {p.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
          <div className="relative p-8 md:p-10 flex flex-col justify-center">
            <div className="flex flex-col gap-6">
              {POSTS.slice(2).map((p) => (
                <div key={p.title} className="flex items-center gap-4">
                  <div
                    className="relative flex-shrink-0 overflow-hidden"
                    style={{ width: 68, height: 68, borderRadius: "9999px 9999px 6px 6px" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div>
                    <p className="qpi-caps" style={{ color: BLUE, fontSize: 8 }}>{p.tag}</p>
                    <h3 className="mt-1" style={{ color: INK, fontWeight: 700, fontSize: "0.875rem", lineHeight: 1.3 }}>
                      {p.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    ),
  },

  // 18 · A fanned deck of overlapping rotated cards, like a hand of playing cards
  {
    name: "Fanned Deck",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-2xl mb-16">
          <p className="qpi-caps" style={{ color: BLUE, fontSize: 11 }}>
            {BLOG_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-3"
            style={{ color: INK, fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)", lineHeight: 1.05 }}
          >
            {BLOG_INTRO.heading}
          </h2>
        </div>
        <div className="relative mx-auto" style={{ width: 320, height: 420 }}>
          {POSTS.map((p, i) => {
            const rot = [-10, -3, 4, 11][i];
            const offset = [0, 10, 20, 30][i];
            return (
              <div
                key={p.title}
                className="absolute bg-white"
                style={{
                  width: 260,
                  left: 30,
                  top: offset,
                  padding: 10,
                  border: RULE_STRONG,
                  transform: `rotate(${rot}deg)`,
                  transformOrigin: "bottom center",
                  zIndex: i,
                }}
              >
                <div className="relative overflow-hidden mb-2" style={{ aspectRatio: "4/3" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <p className="qpi-caps" style={{ color: BLUE, fontSize: 8 }}>{p.tag}</p>
                <h3 className="mt-1" style={{ color: INK, fontWeight: 600, fontSize: "0.75rem", lineHeight: 1.3 }}>
                  {p.title}
                </h3>
              </div>
            );
          })}
        </div>
      </section>
    ),
  },

  // 19 · A frozen ticker band of tag type above a plain 4-up post grid
  {
    name: "Frozen Ticker Band",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="w-full max-w-6xl mx-auto" style={{ background: INK, padding: "18px 0", marginBottom: 44 }}>
          <div className="flex items-center gap-10 overflow-hidden whitespace-nowrap px-4">
            {[...POSTS, ...POSTS].map((p, i) => (
              <span
                key={`${p.title}-${i}`}
                className="qpi-display flex-shrink-0 flex items-center gap-10"
                style={{ color: "#fff", opacity: i % 2 === 0 ? 1 : 0.35, fontSize: "1.5rem" }}
              >
                {p.tag}
                <span aria-hidden="true" style={{ opacity: 0.5 }}>·</span>
              </span>
            ))}
          </div>
        </div>
        <div className="max-w-2xl mx-auto w-full mb-10">
          <h2
            className="qpi-display text-balance"
            style={{ color: INK, fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.05 }}
          >
            {BLOG_INTRO.heading}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto w-full">
          {POSTS.map((p) => (
            <div key={p.title}>
              <div className="relative overflow-hidden mb-3" style={{ aspectRatio: "4/3" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <h3 style={{ color: INK, fontWeight: 700, fontSize: "0.8125rem", lineHeight: 1.35 }}>{p.title}</h3>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 20 · Blueprint / technical-drawing grid backdrop with bordered arch frames
  {
    name: "Blueprint Grid",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(11,42,74,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(11,42,74,0.08) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-6xl mx-auto w-full">
          <div
            className="flex items-baseline justify-between mb-12"
            style={{ borderBottom: RULE_STRONG, paddingBottom: 16 }}
          >
            <h2 className="qpi-display" style={{ color: INK, fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}>
              {BLOG_INTRO.heading}
            </h2>
            <span className="qpi-caps" style={{ color: BLUE, fontSize: 10 }}>{BLOG_INTRO.kicker}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {POSTS.map((p) => (
              <div key={p.title} className="relative">
                <div
                  className="relative overflow-hidden mb-4"
                  style={{ aspectRatio: "3/4", borderRadius: "9999px 9999px 0 0", border: `1px solid ${INK}` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.img}
                    alt={p.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    style={{ opacity: 0.92 }}
                  />
                </div>
                <p className="qpi-caps" style={{ color: BLUE, fontSize: 9 }}>{p.tag}</p>
                <h3 className="mt-1" style={{ color: INK, fontWeight: 700, fontSize: "0.8125rem", lineHeight: 1.35 }}>
                  {p.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },
];
