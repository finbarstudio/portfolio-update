import { BLOG_INTRO, POSTS, GALLERY_IMGS, type Section } from "../kit";

/**
 * Blog / "Latest Pool Insights & Projects" — 25 distinct design directions
 * for the 4-post blog index block. Each entry is a standalone in-page
 * section (no hero sizing, no client hooks) built only from BLOG_INTRO,
 * POSTS and GALLERY_IMGS.
 */

const RULE = "1px solid rgba(11,42,74,0.15)";
const RULE_STRONG = "1px solid rgba(11,42,74,0.25)";
const INK = "var(--qpi-ink)";
const BLUE = "var(--qpi-blue)";

export const optionsBlog: Section[] = [
  // 1 · Clean 4-up card grid, 16:9 images, tag + title + body, heading above left
  {
    name: "Clean Card Grid",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-3xl mb-16">
          <p className="qpi-caps" style={{ color: BLUE, fontSize: 11 }}>
            {BLOG_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-4"
            style={{ color: INK, fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05 }}
          >
            {BLOG_INTRO.heading}
          </h2>
          <p className="text-pretty mt-5" style={{ color: INK, opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.65, maxWidth: 620 }}>
            {BLOG_INTRO.sub}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {POSTS.map((p) => (
            <div key={p.title}>
              <div className="relative aspect-[16/9] overflow-hidden mb-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <p className="qpi-caps" style={{ color: BLUE, fontSize: 10 }}>{p.tag}</p>
              <h3 className="mt-2" style={{ color: INK, fontWeight: 700, fontSize: "1.0625rem", lineHeight: 1.3 }}>{p.title}</h3>
              <p className="text-pretty mt-3" style={{ color: INK, opacity: 0.6, fontSize: "0.875rem", lineHeight: 1.6 }}>
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 2 · Feature post large left, remaining 3 as compact rows right
  {
    name: "Feature + Compact List",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-3xl mb-14">
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
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12">
          <div>
            <div className="relative aspect-[16/9] overflow-hidden mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={POSTS[0].img} alt={POSTS[0].title} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <p className="qpi-caps" style={{ color: BLUE, fontSize: 11 }}>{POSTS[0].tag}</p>
            <h3 className="mt-2" style={{ color: INK, fontWeight: 700, fontSize: "1.5rem", lineHeight: 1.2 }}>{POSTS[0].title}</h3>
            <p className="text-pretty mt-3" style={{ color: INK, opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.6, maxWidth: 460 }}>
              {POSTS[0].body}
            </p>
          </div>
          <div>
            {POSTS.slice(1).map((p, i) => (
              <div
                key={p.title}
                className="flex items-start gap-4 py-6"
                style={{ borderTop: i === 0 ? RULE : undefined, borderBottom: RULE }}
              >
                <div className="relative flex-shrink-0 overflow-hidden" style={{ width: 76, height: 76 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div>
                  <p className="qpi-caps" style={{ color: BLUE, fontSize: 9 }}>{p.tag}</p>
                  <h3 className="mt-1" style={{ color: INK, fontWeight: 700, fontSize: "0.9375rem", lineHeight: 1.35 }}>{p.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 3 · List rows: square thumb left, tag/title/body right, hairline rules
  {
    name: "List Rows With Thumbs",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-2xl mx-auto text-center mb-14">
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
        <div className="max-w-3xl mx-auto">
          {POSTS.map((p, i) => (
            <div
              key={p.title}
              className="flex items-start gap-6 py-7"
              style={{ borderTop: i === 0 ? RULE_STRONG : undefined, borderBottom: RULE }}
            >
              <div className="relative flex-shrink-0 overflow-hidden" style={{ width: 96, height: 96 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div>
                <p className="qpi-caps" style={{ color: BLUE, fontSize: 10 }}>{p.tag}</p>
                <h3 className="mt-1" style={{ color: INK, fontWeight: 700, fontSize: "1.0625rem", lineHeight: 1.3 }}>{p.title}</h3>
                <p className="text-pretty mt-2" style={{ color: INK, opacity: 0.6, fontSize: "0.875rem", lineHeight: 1.6 }}>
                  {p.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 4 · Magazine spread: two rows of two large posts, tall 4:5 images
  {
    name: "Magazine Two-Up",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-3xl mb-16">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16 max-w-5xl mx-auto">
          {POSTS.map((p) => (
            <div key={p.title}>
              <div className="relative aspect-[4/5] overflow-hidden mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <p className="qpi-caps" style={{ color: BLUE, fontSize: 10 }}>{p.tag}</p>
              <h3 className="mt-2" style={{ color: INK, fontWeight: 700, fontSize: "1.375rem", lineHeight: 1.2 }}>{p.title}</h3>
              <p className="text-pretty mt-3" style={{ color: INK, opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.6 }}>
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 5 · Editorial index: no images, tag + title rows in very large type
  {
    name: "Editorial Index",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <p className="qpi-caps mb-4" style={{ color: BLUE, fontSize: 11 }}>
          {BLOG_INTRO.kicker}
        </p>
        <h2
          className="qpi-display text-balance mb-16"
          style={{ color: INK, fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05, maxWidth: 720 }}
        >
          {BLOG_INTRO.heading}
        </h2>
        <div className="max-w-5xl">
          {POSTS.map((p, i) => (
            <div
              key={p.title}
              className="py-8"
              style={{ borderTop: i === 0 ? RULE_STRONG : undefined, borderBottom: RULE }}
            >
              <p className="qpi-caps" style={{ color: BLUE, fontSize: 11 }}>{p.tag}</p>
              <h3
                className="qpi-display text-balance mt-3"
                style={{ color: INK, fontSize: "clamp(1.375rem, 3.2vw, 2.25rem)", lineHeight: 1.08 }}
              >
                {p.title}
              </h3>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 6 · Navy full-bleed band, white type, 4-up compact cards, faint texture photo
  {
    name: "Navy Full-Bleed Band",
    node: (
      <section className="relative w-full py-20 md:py-28 px-6 md:px-14 overflow-hidden" style={{ background: INK }}>
        <div className="absolute inset-0" style={{ opacity: 0.14 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={GALLERY_IMGS[7]} alt="" className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="absolute inset-0" style={{ background: INK, opacity: 0.75 }} />
        <div className="max-w-3xl mb-16 relative">
          <p className="qpi-caps" style={{ color: "#fff", opacity: 0.55, fontSize: 11 }}>
            {BLOG_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-4"
            style={{ color: "#fff", fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05 }}
          >
            {BLOG_INTRO.heading}
          </h2>
          <p className="text-pretty mt-5" style={{ color: "#fff", opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.65, maxWidth: 560 }}>
            {BLOG_INTRO.sub}
          </p>
        </div>
        <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
          {POSTS.map((p) => (
            <div key={p.title}>
              <div style={{ height: 1, background: "#fff", opacity: 0.25, marginBottom: 20 }} />
              <p className="qpi-caps" style={{ color: "#fff", opacity: 0.5, fontSize: 10 }}>{p.tag}</p>
              <h3 className="mt-2" style={{ color: "#fff", fontWeight: 700, fontSize: "1rem", lineHeight: 1.35 }}>{p.title}</h3>
              <p className="text-pretty mt-3" style={{ color: "#fff", opacity: 0.55, fontSize: "0.8125rem", lineHeight: 1.6 }}>
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 7 · Full-bleed 2x2 image cards edge-to-edge, titles overlaid on a bottom scrim
  {
    name: "Full-Bleed Scrim Cards",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28">
        <div className="max-w-3xl mb-14 px-6 md:px-14">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
          {POSTS.map((p) => (
            <div key={p.title} className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
              <div
                className="absolute inset-x-0 bottom-0"
                style={{ height: "60%", background: "linear-gradient(to top, rgba(11,42,74,0.85), rgba(11,42,74,0))" }}
              />
              <div className="absolute left-0 bottom-0 p-6">
                <p className="qpi-caps" style={{ color: "#fff", opacity: 0.8, fontSize: 10 }}>{p.tag}</p>
                <h3 className="mt-1" style={{ color: "#fff", fontWeight: 700, fontSize: "1.125rem", lineHeight: 1.25, maxWidth: 320 }}>
                  {p.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 8 · Offset grid: alternating vertical offsets across 4 cards
  {
    name: "Offset Grid",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {POSTS.map((p, i) => (
            <div key={p.title} style={{ marginTop: i % 2 === 1 ? 40 : 0 }}>
              <div className="relative aspect-[3/4] overflow-hidden mb-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <p className="qpi-caps" style={{ color: BLUE, fontSize: 9 }}>{p.tag}</p>
              <h3 className="mt-2" style={{ color: INK, fontWeight: 700, fontSize: "0.9375rem", lineHeight: 1.35 }}>{p.title}</h3>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 9 · Heading in a sticky-feel left column, posts stacked right with wide images
  {
    name: "Sticky Heading + Wide List",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-12 md:gap-16">
          <div className="md:sticky md:top-24 md:self-start">
            <p className="qpi-caps" style={{ color: BLUE, fontSize: 11 }}>
              {BLOG_INTRO.kicker}
            </p>
            <h2
              className="qpi-display text-balance mt-4"
              style={{ color: INK, fontSize: "clamp(1.75rem, 3.2vw, 2.5rem)", lineHeight: 1.08 }}
            >
              {BLOG_INTRO.heading}
            </h2>
            <p className="text-pretty mt-5" style={{ color: INK, opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.65, maxWidth: 340 }}>
              {BLOG_INTRO.sub}
            </p>
          </div>
          <div>
            {POSTS.map((p, i) => (
              <div key={p.title} className="py-8" style={{ borderTop: i === 0 ? RULE_STRONG : undefined, borderBottom: RULE }}>
                <div className="relative aspect-[16/7] overflow-hidden mb-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <p className="qpi-caps" style={{ color: BLUE, fontSize: 10 }}>{p.tag}</p>
                <h3 className="mt-2" style={{ color: INK, fontWeight: 700, fontSize: "1.1875rem", lineHeight: 1.25 }}>{p.title}</h3>
                <p className="text-pretty mt-2" style={{ color: INK, opacity: 0.6, fontSize: "0.875rem", lineHeight: 1.6 }}>
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 10 · 4-up thin columns, tall portrait images, tiny type
  {
    name: "Thin Portrait Columns",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-2xl mx-auto text-center mb-16">
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {POSTS.map((p) => (
            <div key={p.title}>
              <div className="relative overflow-hidden mb-4" style={{ aspectRatio: "3/5" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <p className="qpi-caps" style={{ color: BLUE, fontSize: 8 }}>{p.tag}</p>
              <h3 className="mt-1" style={{ color: INK, fontWeight: 600, fontSize: "0.75rem", lineHeight: 1.4 }}>{p.title}</h3>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 11 · Alternating rows: image left / text right, then flipped
  {
    name: "Alternating Image Rows",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-3xl mb-16">
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
        <div className="max-w-5xl mx-auto flex flex-col gap-16">
          {POSTS.map((p, i) => (
            <div
              key={p.title}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center"
              style={{ direction: i % 2 === 1 ? "rtl" : "ltr" }}
            >
              <div className="relative aspect-[4/3] overflow-hidden" style={{ direction: "ltr" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div style={{ direction: "ltr" }}>
                <p className="qpi-caps" style={{ color: BLUE, fontSize: 10 }}>{p.tag}</p>
                <h3 className="mt-2" style={{ color: INK, fontWeight: 700, fontSize: "1.375rem", lineHeight: 1.2 }}>{p.title}</h3>
                <p className="text-pretty mt-3" style={{ color: INK, opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.65, maxWidth: 420 }}>
                  {p.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 12 · Cards with 1px navy borders, image inset within padding
  {
    name: "Navy-Bordered Cards",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-2xl mx-auto text-center mb-16">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {POSTS.map((p) => (
            <div key={p.title} className="p-4" style={{ border: `1px solid ${INK}` }}>
              <div className="relative aspect-[4/3] overflow-hidden mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <p className="qpi-caps" style={{ color: BLUE, fontSize: 9 }}>{p.tag}</p>
              <h3 className="mt-2" style={{ color: INK, fontWeight: 700, fontSize: "0.9375rem", lineHeight: 1.35 }}>{p.title}</h3>
              <p className="text-pretty mt-2" style={{ color: INK, opacity: 0.6, fontSize: "0.8125rem", lineHeight: 1.55 }}>
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 13 · Tag-led: the tag huge in blue above each title, images small
  {
    name: "Tag-Led Blue",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-3xl mb-16">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-14 max-w-5xl mx-auto">
          {POSTS.map((p) => (
            <div key={p.title} className="flex gap-6 items-start">
              <div className="relative flex-shrink-0 overflow-hidden" style={{ width: 88, height: 88 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div>
                <p className="qpi-display" style={{ color: BLUE, fontSize: "1.75rem", lineHeight: 1, letterSpacing: "0.01em" }}>
                  {p.tag}
                </p>
                <h3 className="mt-2" style={{ color: INK, fontWeight: 700, fontSize: "1rem", lineHeight: 1.35 }}>{p.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 14 · Numbered index (01-04), hairline rules, one small thumb per row
  {
    name: "Numbered Index With Thumb",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-3xl mb-16">
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
        <div className="max-w-4xl">
          {POSTS.map((p, i) => (
            <div
              key={p.title}
              className="flex items-center gap-6 py-6"
              style={{ borderTop: i === 0 ? RULE_STRONG : undefined, borderBottom: RULE }}
            >
              <span className="qpi-caps flex-shrink-0" style={{ color: INK, opacity: 0.3, fontSize: 12, width: 32 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="relative flex-shrink-0 overflow-hidden" style={{ width: 56, height: 56 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
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

  // 15 · One giant featured post, others as a tiny footer index
  {
    name: "Giant Feature + Footer Index",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <p className="qpi-caps mb-4" style={{ color: BLUE, fontSize: 11 }}>
          {BLOG_INTRO.kicker}
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 items-center mb-16">
          <div className="relative aspect-[16/10] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={POSTS[0].img} alt={POSTS[0].title} className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div>
            <p className="qpi-caps" style={{ color: BLUE, fontSize: 11 }}>{POSTS[0].tag}</p>
            <h2
              className="qpi-display text-balance mt-3"
              style={{ color: INK, fontSize: "clamp(2rem, 4.5vw, 3.25rem)", lineHeight: 1.02 }}
            >
              {POSTS[0].title}
            </h2>
            <p className="text-pretty mt-4" style={{ color: INK, opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.65, maxWidth: 420 }}>
              {POSTS[0].body}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8" style={{ borderTop: RULE }}>
          {POSTS.slice(1).map((p, i) => (
            <div key={p.title} className="flex items-baseline gap-3">
              <span className="qpi-caps flex-shrink-0" style={{ color: BLUE, fontSize: 10 }}>
                {String(i + 2).padStart(2, "0")}
              </span>
              <h3 style={{ color: INK, fontWeight: 600, fontSize: "0.8125rem", lineHeight: 1.4 }}>{p.title}</h3>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 16 · Bento grid: three post cells + one navy accent cell carrying the kicker large
  {
    name: "Bento With Navy Block",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-3xl mb-14">
          <h2
            className="qpi-display text-balance"
            style={{ color: INK, fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05 }}
          >
            {BLOG_INTRO.heading}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div
            className="flex flex-col justify-center p-8 lg:row-span-1"
            style={{ background: INK, minHeight: 220 }}
          >
            <p className="qpi-caps" style={{ color: "#fff", opacity: 0.6, fontSize: 10 }}>{BLOG_INTRO.kicker}</p>
            <p className="qpi-display text-balance mt-3" style={{ color: "#fff", fontSize: "1.375rem", lineHeight: 1.15 }}>
              {BLOG_INTRO.heading}
            </p>
          </div>
          {POSTS.slice(0, 3).map((p) => (
            <div key={p.title}>
              <div className="relative aspect-[4/3] overflow-hidden mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <p className="qpi-caps" style={{ color: BLUE, fontSize: 9 }}>{p.tag}</p>
              <h3 className="mt-2" style={{ color: INK, fontWeight: 700, fontSize: "0.9375rem", lineHeight: 1.35 }}>{p.title}</h3>
            </div>
          ))}
        </div>
        <div className="mt-8 max-w-xl">
          <p className="qpi-caps" style={{ color: BLUE, fontSize: 9 }}>{POSTS[3].tag}</p>
          <h3 className="mt-2" style={{ color: INK, fontWeight: 700, fontSize: "1rem", lineHeight: 1.35 }}>{POSTS[3].title}</h3>
          <p className="text-pretty mt-2" style={{ color: INK, opacity: 0.6, fontSize: "0.875rem", lineHeight: 1.6 }}>
            {POSTS[3].body}
          </p>
        </div>
      </section>
    ),
  },

  // 17 · Contact-sheet feel: 4 small images in a row, titles beneath in a matching grid
  {
    name: "Contact Sheet",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-2xl mx-auto text-center mb-16">
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
        <div className="grid grid-cols-4 gap-2 max-w-4xl mx-auto mb-6">
          {POSTS.map((p) => (
            <div key={p.title} className="relative overflow-hidden" style={{ aspectRatio: "1/1" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.img}
                alt={p.title}
                className="w-full h-full object-cover"
                loading="lazy"
                style={{ filter: "grayscale(0.3)" }}
              />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-2 max-w-4xl mx-auto">
          {POSTS.map((p) => (
            <div key={p.title} className="px-1">
              <p className="qpi-caps" style={{ color: BLUE, fontSize: 8 }}>{p.tag}</p>
              <h3 className="mt-1" style={{ color: INK, fontWeight: 600, fontSize: "0.6875rem", lineHeight: 1.4 }}>{p.title}</h3>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 18 · Editorial spread: heading spanning the top, posts as newspaper columns
  {
    name: "Newspaper Spread",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <h2
          className="qpi-display text-balance mb-3"
          style={{ color: INK, fontSize: "clamp(2.25rem, 5.5vw, 4.5rem)", lineHeight: 0.95, maxWidth: 900 }}
        >
          {BLOG_INTRO.heading}
        </h2>
        <p className="text-pretty mb-16" style={{ color: INK, opacity: 0.55, fontSize: "1rem", lineHeight: 1.6, maxWidth: 620 }}>
          {BLOG_INTRO.sub}
        </p>
        <div
          className="columns-1 sm:columns-2 lg:columns-4 gap-10"
          style={{ columnRuleWidth: 1, columnRuleStyle: "solid", columnRuleColor: "rgba(11,42,74,0.15)" }}
        >
          {POSTS.map((p) => (
            <div key={p.title} className="mb-10 break-inside-avoid">
              <div className="relative aspect-[4/3] overflow-hidden mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <p className="qpi-caps" style={{ color: BLUE, fontSize: 9 }}>{p.tag}</p>
              <h3 className="mt-2" style={{ color: INK, fontWeight: 700, fontSize: "1rem", lineHeight: 1.35 }}>{p.title}</h3>
              <p className="text-pretty mt-2" style={{ color: INK, opacity: 0.6, fontSize: "0.8125rem", lineHeight: 1.55 }}>
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 19 · Arch-topped images (rounded top) above each title
  {
    name: "Arch-Topped Images",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-2xl mx-auto text-center mb-16">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {POSTS.map((p) => (
            <div key={p.title} className="text-center">
              <div
                className="relative overflow-hidden mx-auto mb-5"
                style={{ aspectRatio: "3/4", borderRadius: "9999px 9999px 4px 4px", maxWidth: 200 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <p className="qpi-caps" style={{ color: BLUE, fontSize: 9 }}>{p.tag}</p>
              <h3 className="mt-2" style={{ color: INK, fontWeight: 700, fontSize: "0.9375rem", lineHeight: 1.35 }}>{p.title}</h3>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 20 · Compact: two columns of two, tight rows, small images, restrained
  {
    name: "Compact Two-By-Two",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-10">
            <h2 style={{ color: INK, fontWeight: 700, fontSize: "1.375rem" }}>{BLOG_INTRO.heading}</h2>
            <p className="qpi-caps" style={{ color: BLUE, fontSize: 10 }}>{BLOG_INTRO.kicker}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-1">
            {POSTS.map((p, i) => (
              <div
                key={p.title}
                className="flex items-center gap-4 py-4"
                style={{ borderBottom: i < 2 ? undefined : RULE, borderTop: RULE }}
              >
                <div className="relative flex-shrink-0 overflow-hidden" style={{ width: 44, height: 44 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <span style={{ color: INK, fontWeight: 600, fontSize: "0.8125rem", lineHeight: 1.35 }}>{p.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 21 · Image-led: 4 large images in a 2x2, titles overlaid bottom-left on scrims
  {
    name: "Image-Led 2x2 Scrims",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-3xl mb-14">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {POSTS.map((p) => (
            <div key={p.title} className="relative overflow-hidden" style={{ aspectRatio: "16/11" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
              <div
                className="absolute inset-x-0 bottom-0"
                style={{ height: "55%", background: "linear-gradient(to top, rgba(11,42,74,0.8), rgba(11,42,74,0))" }}
              />
              <div className="absolute left-0 bottom-0 p-7">
                <p className="qpi-caps" style={{ color: "#fff", opacity: 0.85, fontSize: 10 }}>{p.tag}</p>
                <h3 className="mt-1" style={{ color: "#fff", fontWeight: 700, fontSize: "1.25rem", lineHeight: 1.2, maxWidth: 340 }}>
                  {p.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 22 · Off-white ground, generous whitespace cards, blue tags
  {
    name: "Off-White Generous Cards",
    node: (
      <section className="relative w-full py-20 md:py-28 px-6 md:px-14" style={{ background: "rgba(11,42,74,0.035)" }}>
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
          <p className="text-pretty mt-5" style={{ color: INK, opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.65 }}>
            {BLOG_INTRO.sub}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-16 max-w-4xl mx-auto">
          {POSTS.map((p) => (
            <div key={p.title} className="bg-white p-8">
              <div className="relative aspect-[16/9] overflow-hidden mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <p className="qpi-caps" style={{ color: BLUE, fontSize: 10 }}>{p.tag}</p>
              <h3 className="mt-2" style={{ color: INK, fontWeight: 700, fontSize: "1.125rem", lineHeight: 1.3 }}>{p.title}</h3>
              <p className="text-pretty mt-3" style={{ color: INK, opacity: 0.6, fontSize: "0.875rem", lineHeight: 1.6 }}>
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 23 · Split: navy heading panel left, white post list right
  {
    name: "Split Navy Panel",
    node: (
      <section className="relative w-full bg-white flex flex-col md:flex-row">
        <div className="md:w-2/5 flex flex-col justify-center py-16 md:py-28 px-6 md:px-14" style={{ background: INK }}>
          <p className="qpi-caps" style={{ color: "#fff", opacity: 0.55, fontSize: 11 }}>
            {BLOG_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-5"
            style={{ color: "#fff", fontSize: "clamp(1.875rem, 3.4vw, 2.75rem)", lineHeight: 1.05 }}
          >
            {BLOG_INTRO.heading}
          </h2>
          <p className="text-pretty mt-5" style={{ color: "#fff", opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.65, maxWidth: 360 }}>
            {BLOG_INTRO.sub}
          </p>
        </div>
        <div className="md:w-3/5 py-16 md:py-28 px-6 md:px-14">
          {POSTS.map((p, i) => (
            <div key={p.title} className="flex items-start gap-6 py-6" style={{ borderTop: i === 0 ? RULE_STRONG : undefined, borderBottom: RULE }}>
              <div className="relative flex-shrink-0 overflow-hidden" style={{ width: 84, height: 84 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div>
                <p className="qpi-caps" style={{ color: BLUE, fontSize: 9 }}>{p.tag}</p>
                <h3 className="mt-1" style={{ color: INK, fontWeight: 700, fontSize: "1rem", lineHeight: 1.35 }}>{p.title}</h3>
                <p className="text-pretty mt-2" style={{ color: INK, opacity: 0.6, fontSize: "0.8125rem", lineHeight: 1.55 }}>
                  {p.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 24 · Wide ledger rows, tag right-aligned per row, no images
  {
    name: "Wide Ledger Rows",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
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
          <p style={{ color: INK, opacity: 0.4, fontSize: "0.8125rem" }}>{POSTS.length} posts</p>
        </div>
        <div className="max-w-5xl">
          {POSTS.map((p, i) => (
            <div
              key={p.title}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-6"
              style={{ borderTop: i === 0 ? RULE_STRONG : undefined, borderBottom: RULE }}
            >
              <div className="flex-1">
                <h3 style={{ color: INK, fontWeight: 700, fontSize: "1.0625rem" }}>{p.title}</h3>
                <p className="text-pretty mt-1 hidden sm:block" style={{ color: INK, opacity: 0.55, fontSize: "0.8125rem", lineHeight: 1.5, maxWidth: 520 }}>
                  {p.body}
                </p>
              </div>
              <span className="qpi-caps flex-shrink-0 sm:text-right" style={{ color: BLUE, fontSize: 11 }}>{p.tag}</span>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 25 · Duotone-blue treated images (grayscale + blue multiply) in a 4-up grid
  {
    name: "Duotone Blue Images",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-2xl mx-auto text-center mb-16">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {POSTS.map((p) => (
            <div key={p.title}>
              <div className="relative aspect-[4/5] overflow-hidden mb-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.img}
                  alt={p.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  style={{ filter: "grayscale(1) contrast(1.05)" }}
                />
                <div className="absolute inset-0" style={{ background: BLUE, opacity: 0.42, mixBlendMode: "multiply" }} />
                <div className="absolute inset-0" style={{ background: INK, opacity: 0.12, mixBlendMode: "multiply" }} />
              </div>
              <p className="qpi-caps" style={{ color: BLUE, fontSize: 10 }}>{p.tag}</p>
              <h3 className="mt-2" style={{ color: INK, fontWeight: 700, fontSize: "1rem", lineHeight: 1.3 }}>{p.title}</h3>
            </div>
          ))}
        </div>
      </section>
    ),
  },
];
