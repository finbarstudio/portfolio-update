import { BLOG_INTRO, POSTS, GALLERY_IMGS, type Section } from "../kit";

/**
 * Blog / "Latest Pool Insights & Projects" — round 3: 20 fresh design
 * directions for the 4-post blog index block. The client has already picked
 * arch-topped tiles as the winner for this section, so none of these use the
 * arch shape — they explore everything else that could sit alongside it for
 * comparison. Each entry is a standalone in-page section (no hero sizing, no
 * client hooks) built only from BLOG_INTRO, POSTS and GALLERY_IMGS.
 */

const INK = "var(--qpi-ink)";
const BLUE = "var(--qpi-blue)";
const RULE = "1px solid rgba(25,60,90,0.15)";
const RULE_STRONG = "1px solid rgba(25,60,90,0.28)";

// avoid unused-import lint on GALLERY_IMGS if a future edit trims usage
void GALLERY_IMGS;

export const optionsBlog: Section[] = [
  // 1 · Four cards stepping diagonally down the page, decreasing scale
  {
    name: "Diagonal Staircase Cards",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="w-full mx-auto" style={{ maxWidth: 1280 }}>
          <p className="qpi-caps" style={{ color: BLUE, fontSize: 11 }}>
            {BLOG_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-4 mb-16"
            style={{ color: INK, fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)", lineHeight: 1.05, maxWidth: 620 }}
          >
            {BLOG_INTRO.heading}
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {POSTS.map((p, i) => (
              <div key={p.title} style={{ transform: `translateY(${i * 28}px)` }}>
                <div className="relative overflow-hidden mb-4" style={{ aspectRatio: "1/1" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <p className="qpi-caps" style={{ color: BLUE, fontSize: 9 }}>{p.tag}</p>
                <h3 className="mt-1" style={{ color: INK, fontWeight: 700, fontSize: "0.8125rem", lineHeight: 1.3 }}>{p.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 2 · Ultra-wide letterbox crops stacked in a thin vertical strip
  {
    name: "Letterbox Filmstrip",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="w-full mx-auto" style={{ maxWidth: 1000 }}>
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="qpi-display text-balance" style={{ color: INK, fontSize: "clamp(1.375rem, 2.6vw, 1.875rem)", lineHeight: 1.1 }}>
              {BLOG_INTRO.heading}
            </h2>
            <p className="qpi-caps flex-shrink-0 ml-6" style={{ color: BLUE, fontSize: 10 }}>{BLOG_INTRO.kicker}</p>
          </div>
          <div className="flex flex-col gap-4">
            {POSTS.map((p, i) => (
              <div key={p.title} className="flex items-center gap-6" style={{ borderTop: i === 0 ? RULE_STRONG : RULE, paddingTop: 14 }}>
                <div className="relative overflow-hidden flex-shrink-0" style={{ width: "56%", aspectRatio: "21/6" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="qpi-caps" style={{ color: BLUE, fontSize: 9 }}>{p.tag}</p>
                  <h3 className="mt-1 truncate" style={{ color: INK, fontWeight: 700, fontSize: "0.9375rem" }}>{p.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 3 · One post's title enormous, the other three reduced to a whisper of type
  {
    name: "Extreme Type Scale Contrast",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="w-full mx-auto" style={{ maxWidth: 1280 }}>
          <p className="qpi-caps mb-6" style={{ color: BLUE, fontSize: 11 }}>
            {BLOG_INTRO.kicker}
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12">
            <h2
              className="qpi-display text-balance"
              style={{ color: INK, fontSize: "clamp(3rem, 8.5vw, 7rem)", lineHeight: 0.9, maxWidth: 880 }}
            >
              {POSTS[0].title}
            </h2>
            <div className="flex flex-col gap-5 flex-shrink-0" style={{ maxWidth: 220 }}>
              {POSTS.slice(1).map((p) => (
                <div key={p.title}>
                  <span className="qpi-caps" style={{ color: BLUE, fontSize: 8 }}>{p.tag}</span>
                  <p className="mt-1" style={{ color: INK, opacity: 0.65, fontSize: "0.75rem", lineHeight: 1.4 }}>{p.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    ),
  },

  // 4 · Small square crops floating in a sea of white, negative space as the star
  {
    name: "Square Mosaic Negative Space",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="w-full mx-auto text-center" style={{ maxWidth: 620 }}>
          <p className="qpi-caps" style={{ color: BLUE, fontSize: 11 }}>
            {BLOG_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-4"
            style={{ color: INK, fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.1 }}
          >
            {BLOG_INTRO.heading}
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-14 md:gap-20 mx-auto mt-16" style={{ maxWidth: 480 }}>
          {POSTS.map((p) => (
            <div key={p.title} className="text-center">
              <div className="relative overflow-hidden mx-auto mb-4" style={{ aspectRatio: "1/1", width: 128 }}>
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

  // 5 · Lead post's image bleeds off the right edge, inset thumbnail strip along its base
  {
    name: "Right-Bleed Hero Panel",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="w-full mx-auto flex flex-col md:flex-row-reverse md:items-center gap-10" style={{ maxWidth: 1280 }}>
          <div
            className="relative overflow-hidden -mr-5 md:-mr-14 flex-shrink-0"
            style={{ width: "min(50vw, 540px)", aspectRatio: "4/5" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={POSTS[0].img} alt={POSTS[0].title} className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute left-0 right-0 bottom-0 flex">
              {POSTS.slice(1).map((p) => (
                <div key={p.title} className="relative overflow-hidden flex-1" style={{ aspectRatio: "1/1" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="qpi-caps" style={{ color: BLUE, fontSize: 11 }}>
              {BLOG_INTRO.kicker}
            </p>
            <h2
              className="qpi-display text-balance mt-3"
              style={{ color: INK, fontSize: "clamp(1.75rem, 3.4vw, 2.75rem)", lineHeight: 1.05 }}
            >
              {POSTS[0].title}
            </h2>
            <p className="text-pretty mt-4" style={{ color: INK, opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.65, maxWidth: 420 }}>
              {POSTS[0].body}
            </p>
            <p className="qpi-caps mt-6" style={{ color: BLUE, fontSize: 9 }}>{POSTS[0].tag}</p>
          </div>
        </div>
      </section>
    ),
  },

  // 6 · Alternating slanted (chevron) clip-path tiles
  {
    name: "Chevron Cut Tiles",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="w-full mx-auto" style={{ maxWidth: 1200 }}>
          <p className="qpi-caps" style={{ color: BLUE, fontSize: 11 }}>
            {BLOG_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-4 mb-14"
            style={{ color: INK, fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)", lineHeight: 1.05, maxWidth: 620 }}
          >
            {BLOG_INTRO.heading}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {POSTS.map((p, i) => (
              <div key={p.title}>
                <div
                  className="relative overflow-hidden mb-4"
                  style={{
                    aspectRatio: "4/5",
                    clipPath: i % 2 === 0 ? "polygon(0% 10%, 100% 0%, 100% 90%, 0% 100%)" : "polygon(0% 0%, 100% 10%, 100% 100%, 0% 90%)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <p className="qpi-caps" style={{ color: BLUE, fontSize: 9 }}>{p.tag}</p>
                <h3 className="mt-1" style={{ color: INK, fontWeight: 700, fontSize: "0.8125rem", lineHeight: 1.3 }}>{p.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 7 · Cards with one cut corner via clip-path, flat and quiet
  {
    name: "Corner-Notch Cards",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="w-full mx-auto text-center mb-14" style={{ maxWidth: 620, marginInline: "auto" }}>
          <p className="qpi-caps" style={{ color: BLUE, fontSize: 11 }}>
            {BLOG_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-4"
            style={{ color: INK, fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)", lineHeight: 1.05 }}
          >
            {BLOG_INTRO.heading}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mx-auto" style={{ maxWidth: 1200 }}>
          {POSTS.map((p) => (
            <div key={p.title}>
              <div
                className="relative overflow-hidden mb-5"
                style={{ aspectRatio: "4/3", clipPath: "polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 0 100%)" }}
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

  // 8 · Title straddles the image's bottom edge, half on white, half on the photo
  {
    name: "Straddle-Type Overlap",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="w-full mx-auto" style={{ maxWidth: 1280 }}>
          <p className="qpi-caps" style={{ color: BLUE, fontSize: 11 }}>
            {BLOG_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-4 mb-14"
            style={{ color: INK, fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)", lineHeight: 1.05, maxWidth: 620 }}
          >
            {BLOG_INTRO.heading}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            {POSTS.map((p) => (
              <div key={p.title} className="relative">
                <div className="relative overflow-hidden" style={{ aspectRatio: "4/5" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div style={{ marginTop: -22, position: "relative", zIndex: 5 }}>
                  <div className="bg-white inline-block px-2 py-1">
                    <h3 style={{ color: INK, fontWeight: 700, fontSize: "0.9375rem", lineHeight: 1.25 }}>{p.title}</h3>
                  </div>
                </div>
                <p className="qpi-caps mt-2" style={{ color: BLUE, fontSize: 9 }}>{p.tag}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 9 · Extremely tall narrow crops with generous gaps between them
  {
    name: "Tall Sliver Portraits",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="w-full mx-auto text-center mb-14" style={{ maxWidth: 620 }}>
          <p className="qpi-caps" style={{ color: BLUE, fontSize: 11 }}>
            {BLOG_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-4"
            style={{ color: INK, fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)", lineHeight: 1.05 }}
          >
            {BLOG_INTRO.heading}
          </h2>
        </div>
        <div className="flex justify-center gap-6 md:gap-10 mx-auto" style={{ maxWidth: 900 }}>
          {POSTS.map((p) => (
            <div key={p.title} className="flex-1" style={{ maxWidth: 140 }}>
              <div className="relative overflow-hidden mb-3" style={{ aspectRatio: "9/16" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <p className="qpi-caps" style={{ color: BLUE, fontSize: 8 }}>{p.tag}</p>
              <h3 className="mt-1" style={{ color: INK, fontWeight: 600, fontSize: "0.6875rem", lineHeight: 1.35 }}>{p.title}</h3>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 10 · Asymmetric scattered placement, different sizes, no shared grid line
  {
    name: "Off-Grid Scatter",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="w-full mx-auto" style={{ maxWidth: 1280 }}>
          <p className="qpi-caps" style={{ color: BLUE, fontSize: 11 }}>
            {BLOG_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-4 mb-12"
            style={{ color: INK, fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)", lineHeight: 1.05, maxWidth: 620 }}
          >
            {BLOG_INTRO.heading}
          </h2>
          <div className="hidden md:block relative" style={{ height: 400 }}>
            <div className="absolute" style={{ left: "0%", top: 0, width: 250 }}>
              <div className="relative overflow-hidden mb-3" style={{ aspectRatio: "4/3" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={POSTS[0].img} alt={POSTS[0].title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <p className="qpi-caps" style={{ color: BLUE, fontSize: 9 }}>{POSTS[0].tag}</p>
              <h3 className="mt-1" style={{ color: INK, fontWeight: 700, fontSize: "0.875rem", lineHeight: 1.3 }}>{POSTS[0].title}</h3>
            </div>
            <div className="absolute" style={{ left: "32%", top: 90, width: 170 }}>
              <div className="relative overflow-hidden mb-3" style={{ aspectRatio: "1/1" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={POSTS[1].img} alt={POSTS[1].title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <p className="qpi-caps" style={{ color: BLUE, fontSize: 8 }}>{POSTS[1].tag}</p>
            </div>
            <div className="absolute" style={{ left: "56%", top: 6, width: 210 }}>
              <div className="relative overflow-hidden mb-3" style={{ aspectRatio: "5/4" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={POSTS[2].img} alt={POSTS[2].title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <p className="qpi-caps" style={{ color: BLUE, fontSize: 8 }}>{POSTS[2].tag}</p>
              <h3 className="mt-1" style={{ color: INK, fontWeight: 700, fontSize: "0.8125rem", lineHeight: 1.3 }}>{POSTS[2].title}</h3>
            </div>
            <div className="absolute" style={{ right: 0, top: 150, width: 150 }}>
              <div className="relative overflow-hidden mb-3" style={{ aspectRatio: "3/4" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={POSTS[3].img} alt={POSTS[3].title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <p className="qpi-caps" style={{ color: BLUE, fontSize: 8 }}>{POSTS[3].tag}</p>
            </div>
          </div>
          <div className="flex md:hidden flex-col gap-10">
            {POSTS.map((p) => (
              <div key={p.title}>
                <div className="relative overflow-hidden mb-3" style={{ aspectRatio: "4/3" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <p className="qpi-caps" style={{ color: BLUE, fontSize: 9 }}>{p.tag}</p>
                <h3 className="mt-1" style={{ color: INK, fontWeight: 700, fontSize: "0.875rem", lineHeight: 1.3 }}>{p.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 11 · No images, four columns divided by hairline vertical rules, type only
  {
    name: "Vertical Rule Ledger",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="w-full mx-auto" style={{ maxWidth: 1200 }}>
          <p className="qpi-caps" style={{ color: BLUE, fontSize: 11 }}>
            {BLOG_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-4 mb-16"
            style={{ color: INK, fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)", lineHeight: 1.05, maxWidth: 620 }}
          >
            {BLOG_INTRO.heading}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {POSTS.map((p, i) => (
              <div key={p.title} className="px-6 py-2" style={{ borderLeft: i === 0 ? undefined : RULE }}>
                <p className="qpi-caps" style={{ color: BLUE, fontSize: 9 }}>{p.tag}</p>
                <h3 className="mt-4" style={{ color: INK, fontWeight: 700, fontSize: "1.0625rem", lineHeight: 1.35 }}>{p.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 12 · Small stamp-sized crops with a dashed perforation border, generously spaced
  {
    name: "Postage Stamp Grid",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="w-full mx-auto" style={{ maxWidth: 1100 }}>
          <p className="qpi-caps" style={{ color: BLUE, fontSize: 11 }}>
            {BLOG_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-4 mb-16"
            style={{ color: INK, fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)", lineHeight: 1.05, maxWidth: 620 }}
          >
            {BLOG_INTRO.heading}
          </h2>
          <div className="flex flex-wrap justify-center gap-x-14 gap-y-10">
            {POSTS.map((p) => (
              <div key={p.title} className="text-center" style={{ width: 150 }}>
                <div
                  className="relative mx-auto mb-3"
                  style={{ width: 110, padding: 6, outline: "1px dashed rgba(25,60,90,0.35)", outlineOffset: 4 }}
                >
                  <div className="relative overflow-hidden" style={{ aspectRatio: "1/1" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                </div>
                <p className="qpi-caps" style={{ color: BLUE, fontSize: 8 }}>{p.tag}</p>
                <p className="mt-1" style={{ color: INK, fontWeight: 600, fontSize: "0.6875rem", lineHeight: 1.4 }}>{p.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 13 · A single row of trapezoid-skewed image tiles, slanted left and right edges
  {
    name: "Trapezoid Skew Row",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="w-full mx-auto" style={{ maxWidth: 1280 }}>
          <p className="qpi-caps" style={{ color: BLUE, fontSize: 11 }}>
            {BLOG_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-4 mb-14"
            style={{ color: INK, fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)", lineHeight: 1.05, maxWidth: 620 }}
          >
            {BLOG_INTRO.heading}
          </h2>
          <div className="flex" style={{ gap: 2 }}>
            {POSTS.map((p) => (
              <div key={p.title} className="flex-1">
                <div
                  className="relative overflow-hidden mb-4"
                  style={{ aspectRatio: "3/4", clipPath: "polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <p className="qpi-caps" style={{ color: BLUE, fontSize: 9 }}>{p.tag}</p>
                <h3 className="mt-1" style={{ color: INK, fontWeight: 700, fontSize: "0.8125rem", lineHeight: 1.3 }}>{p.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 14 · One large centered image with the other three as marginalia in the corners
  {
    name: "Framed Center + Marginalia",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="w-full mx-auto flex flex-col items-center text-center" style={{ maxWidth: 640 }}>
          <p className="qpi-caps" style={{ color: BLUE, fontSize: 11 }}>
            {BLOG_INTRO.kicker}
          </p>
          <div className="relative overflow-hidden mt-6" style={{ width: 300, aspectRatio: "4/5" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={POSTS[0].img} alt={POSTS[0].title} className="w-full h-full object-cover" loading="lazy" />
          </div>
          <p className="qpi-caps mt-6" style={{ color: BLUE, fontSize: 10 }}>{POSTS[0].tag}</p>
          <h3 className="mt-1" style={{ color: INK, fontWeight: 700, fontSize: "1.0625rem", lineHeight: 1.3, maxWidth: 420 }}>
            {POSTS[0].title}
          </h3>
        </div>
        <div className="absolute hidden md:block" style={{ top: 32, left: "clamp(20px,4vw,56px)", maxWidth: 180 }}>
          <p className="qpi-caps" style={{ color: BLUE, fontSize: 8 }}>{POSTS[1].tag}</p>
          <p className="mt-1" style={{ color: INK, opacity: 0.65, fontSize: "0.75rem", lineHeight: 1.4 }}>{POSTS[1].title}</p>
        </div>
        <div className="absolute hidden md:block" style={{ bottom: 32, left: "clamp(20px,4vw,56px)", maxWidth: 180 }}>
          <p className="qpi-caps" style={{ color: BLUE, fontSize: 8 }}>{POSTS[2].tag}</p>
          <p className="mt-1" style={{ color: INK, opacity: 0.65, fontSize: "0.75rem", lineHeight: 1.4 }}>{POSTS[2].title}</p>
        </div>
        <div className="absolute hidden md:block text-right" style={{ bottom: 32, right: "clamp(20px,4vw,56px)", maxWidth: 180 }}>
          <p className="qpi-caps" style={{ color: BLUE, fontSize: 8 }}>{POSTS[3].tag}</p>
          <p className="mt-1" style={{ color: INK, opacity: 0.65, fontSize: "0.75rem", lineHeight: 1.4 }}>{POSTS[3].title}</p>
        </div>
      </section>
    ),
  },

  // 15 · All four images touching edge to edge in one strip, hard grid of text below
  {
    name: "Horizontal Bleed Strip",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="w-full mx-auto" style={{ maxWidth: 1280 }}>
          <p className="qpi-caps" style={{ color: BLUE, fontSize: 11 }}>
            {BLOG_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-4 mb-10"
            style={{ color: INK, fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.1, maxWidth: 620 }}
          >
            {BLOG_INTRO.heading}
          </h2>
          <div className="grid grid-cols-4" style={{ gap: 0 }}>
            {POSTS.map((p) => (
              <div key={p.title} className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4" style={{ borderTop: RULE_STRONG }}>
            {POSTS.map((p, i) => (
              <div key={p.title} className="p-5" style={{ borderRight: i < 3 ? RULE : undefined, borderBottom: RULE }}>
                <p className="qpi-caps" style={{ color: BLUE, fontSize: 8 }}>{p.tag}</p>
                <h3 className="mt-2" style={{ color: INK, fontWeight: 700, fontSize: "0.8125rem", lineHeight: 1.3 }}>{p.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 16 · Four panels of ascending width in one row, each with a cut top-right corner
  {
    name: "Cut-Corner Ascending Bars",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="w-full mx-auto" style={{ maxWidth: 1280 }}>
          <p className="qpi-caps" style={{ color: BLUE, fontSize: 11 }}>
            {BLOG_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-4 mb-14"
            style={{ color: INK, fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)", lineHeight: 1.05, maxWidth: 620 }}
          >
            {BLOG_INTRO.heading}
          </h2>
          <div className="flex items-end gap-3" style={{ height: 300 }}>
            {POSTS.map((p, i) => (
              <div key={p.title} className="h-full flex flex-col justify-end" style={{ flex: i + 1, minWidth: 0 }}>
                <div
                  className="relative overflow-hidden mb-3"
                  style={{ height: "100%", clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <p className="qpi-caps truncate" style={{ color: BLUE, fontSize: 8 }}>{p.tag}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 17 · The intro copy rendered huge as a pull-quote centerpiece, posts as a quiet baseline
  {
    name: "Pull-Quote Centerpiece",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="w-full mx-auto text-center" style={{ maxWidth: 760 }}>
          <p className="qpi-caps" style={{ color: BLUE, fontSize: 11 }}>
            {BLOG_INTRO.kicker}
          </p>
          <h2 className="qpi-display text-balance mt-4" style={{ color: INK, fontSize: "1.25rem", lineHeight: 1.2 }}>
            {BLOG_INTRO.heading}
          </h2>
          <p
            className="text-balance mt-10"
            style={{ color: INK, fontWeight: 600, fontSize: "clamp(1.5rem, 3.4vw, 2.5rem)", lineHeight: 1.3 }}
          >
            {BLOG_INTRO.sub}
          </p>
        </div>
        <div
          className="w-full mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-3 mt-16 pt-8"
          style={{ maxWidth: 900, borderTop: RULE }}
        >
          {POSTS.map((p) => (
            <div key={p.title} className="flex items-baseline gap-2">
              <span className="qpi-caps" style={{ color: BLUE, fontSize: 8 }}>{p.tag}</span>
              <span style={{ color: INK, opacity: 0.6, fontSize: "0.75rem" }}>{p.title}</span>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 18 · One thin row of four tiny entries, deliberately swallowed by whitespace
  {
    name: "Extreme Whitespace Single Row",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="w-full mx-auto" style={{ maxWidth: 1100 }}>
          <div className="flex items-center justify-between mb-24">
            <p className="qpi-caps" style={{ color: BLUE, fontSize: 10 }}>{BLOG_INTRO.kicker}</p>
            <h2 className="qpi-display" style={{ color: INK, fontSize: "1rem" }}>{BLOG_INTRO.heading}</h2>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 sm:gap-4">
            {POSTS.map((p) => (
              <div key={p.title} className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative overflow-hidden flex-shrink-0" style={{ width: 48, height: 48 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="min-w-0">
                  <p className="qpi-caps" style={{ color: BLUE, fontSize: 7 }}>{p.tag}</p>
                  <p className="truncate" style={{ color: INK, fontWeight: 600, fontSize: "0.75rem" }}>{p.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 19 · Strict modular grid, one lead cell spanning double width/height, rule borders
  {
    name: "Hard Modular Swiss Grid",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="w-full mx-auto" style={{ maxWidth: 1200 }}>
          <p className="qpi-caps mb-4" style={{ color: BLUE, fontSize: 11 }}>
            {BLOG_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mb-12"
            style={{ color: INK, fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.05, maxWidth: 560 }}
          >
            {BLOG_INTRO.heading}
          </h2>
          <div className="grid grid-cols-4" style={{ border: RULE }}>
            <div className="col-span-4 md:col-span-2 md:row-span-2 p-6 md:p-8" style={{ borderRight: RULE, borderBottom: RULE }}>
              <div className="relative overflow-hidden mb-5" style={{ aspectRatio: "4/3" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={POSTS[0].img} alt={POSTS[0].title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <p className="qpi-caps" style={{ color: BLUE, fontSize: 9 }}>{POSTS[0].tag}</p>
              <h3 className="mt-2" style={{ color: INK, fontWeight: 700, fontSize: "1.0625rem", lineHeight: 1.3 }}>{POSTS[0].title}</h3>
            </div>
            {POSTS.slice(1).map((p, i) => (
              <div
                key={p.title}
                className="col-span-4 md:col-span-2 p-6"
                style={{ borderBottom: i < 1 ? RULE : undefined }}
              >
                <p className="qpi-caps" style={{ color: BLUE, fontSize: 8 }}>{p.tag}</p>
                <h3 className="mt-1" style={{ color: INK, fontWeight: 700, fontSize: "0.875rem", lineHeight: 1.35 }}>{p.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 20 · Lead post's image bleeds off the left edge, other posts as a right-hand ledger
  {
    name: "Left-Bleed Lead Ledger",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="w-full mx-auto flex flex-col md:flex-row md:items-center gap-10" style={{ maxWidth: 1280 }}>
          <div
            className="relative overflow-hidden -ml-5 md:-ml-14 flex-shrink-0"
            style={{ width: "min(48vw, 500px)", aspectRatio: "4/5" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={POSTS[0].img} alt={POSTS[0].title} className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="qpi-caps" style={{ color: BLUE, fontSize: 11 }}>
              {BLOG_INTRO.kicker}
            </p>
            <h2
              className="qpi-display text-balance mt-3 mb-8"
              style={{ color: INK, fontSize: "clamp(1.375rem, 2.6vw, 2rem)", lineHeight: 1.1 }}
            >
              {BLOG_INTRO.heading}
            </h2>
            {POSTS.map((p, i) => (
              <div key={p.title} className="py-4" style={{ borderTop: i === 0 ? RULE_STRONG : undefined, borderBottom: RULE }}>
                <p className="qpi-caps" style={{ color: BLUE, fontSize: 9 }}>{p.tag}</p>
                <h3
                  className="mt-1"
                  style={{ color: INK, fontWeight: 700, fontSize: i === 0 ? "1.0625rem" : "0.9375rem", lineHeight: 1.3 }}
                >
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
