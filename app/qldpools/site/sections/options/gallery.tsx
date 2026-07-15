import { GALLERY_INTRO, GALLERY_IMGS, AREAS, type Section } from "../kit";

/**
 * Gallery / "Recent Pool Installations" - 25 distinct design options for the
 * work-showcase section. Server-rendered, no hooks, no client JS. Colours
 * limited to white, var(--qpi-ink), var(--qpi-blue), and opacity variants.
 */
export const optionsGallery: Section[] = [
  // 1 · Clean 3-up grid of 4:3 crops, heading above left-aligned.
  {
    name: "Clean 3-Up Grid",
    node: (
      <section className="relative w-full py-20 md:py-28 bg-white">
        <div className="px-6 md:px-12" style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
            <div>
              <p className="qpi-caps mb-3" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
                {GALLERY_INTRO.kicker}
              </p>
              <h2
                className="qpi-display"
                style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.5vw, 3rem)", lineHeight: 1.05 }}
              >
                {GALLERY_INTRO.heading}
              </h2>
            </div>
            <p style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: 14, maxWidth: 320, lineHeight: 1.6 }}>
              {GALLERY_INTRO.sub}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {GALLERY_IMGS.slice(0, 6).map((src) => (
              <div key={src} style={{ aspectRatio: "4 / 3", overflow: "hidden", background: "var(--qpi-ink)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt="A pool installed by QLD Pool Installs"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 2 · Masonry-feel: mixed tall/wide tiles in a 4-column CSS columns layout.
  {
    name: "Masonry Columns",
    node: (
      <section className="relative w-full py-20 md:py-28 bg-white">
        <div className="px-6 md:px-12 text-center mb-12">
          <p className="qpi-caps mb-3" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {GALLERY_INTRO.kicker}
          </p>
          <h2
            className="qpi-display"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.5vw, 3rem)", lineHeight: 1.05 }}
          >
            {GALLERY_INTRO.heading}
          </h2>
        </div>
        <div
          className="px-6 md:px-12"
          style={{ columnCount: 4, columnGap: 16, maxWidth: 1280, margin: "0 auto" }}
        >
          {GALLERY_IMGS.slice(0, 10).map((src, i) => (
            <div
              key={src}
              style={{
                breakInside: "avoid",
                marginBottom: 16,
                aspectRatio: i % 3 === 0 ? "3 / 4" : "4 / 3",
                overflow: "hidden",
                background: "var(--qpi-ink)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt="A pool installed by QLD Pool Installs"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 3 · One large feature image + a strip of small thumbs beneath.
  {
    name: "Feature + Thumb Strip",
    node: (
      <section className="relative w-full py-20 md:py-28 bg-white">
        <div className="px-6 md:px-12" style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="text-center mb-10">
            <p className="qpi-caps mb-3" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
              {GALLERY_INTRO.kicker}
            </p>
            <h2
              className="qpi-display"
              style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.5vw, 3rem)", lineHeight: 1.05 }}
            >
              {GALLERY_INTRO.heading}
            </h2>
          </div>
          <div style={{ aspectRatio: "16 / 9", overflow: "hidden", background: "var(--qpi-ink)", marginBottom: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={GALLERY_IMGS[0]}
              alt="A pool installed by QLD Pool Installs"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {GALLERY_IMGS.slice(1, 6).map((src) => (
              <div key={src} style={{ aspectRatio: "1 / 1", overflow: "hidden", background: "var(--qpi-ink)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt="A pool installed by QLD Pool Installs"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 4 · Full-bleed edge-to-edge 2-up, no padding, captions overlaid.
  {
    name: "Full-Bleed 2-Up",
    node: (
      <section className="relative w-full py-20 md:py-28 bg-white">
        <div className="px-6 md:px-12 text-center mb-10">
          <p className="qpi-caps mb-3" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {GALLERY_INTRO.kicker}
          </p>
          <h2
            className="qpi-display"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.5vw, 3rem)", lineHeight: 1.05 }}
          >
            {GALLERY_INTRO.heading}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {GALLERY_IMGS.slice(0, 2).map((src, i) => (
            <div key={src} className="relative" style={{ aspectRatio: "4 / 5", overflow: "hidden", background: "var(--qpi-ink)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt="A pool installed by QLD Pool Installs"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div
                className="absolute"
                style={{
                  left: 20,
                  bottom: 20,
                  background: "rgba(255,255,255,0.92)",
                  padding: "8px 16px",
                }}
              >
                <p className="qpi-caps" style={{ color: "var(--qpi-ink)", fontSize: 10 }}>
                  {AREAS[i % AREAS.length]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 5 · Offset grid: alternating vertical offsets for a designed stagger.
  {
    name: "Staggered Offset Grid",
    node: (
      <section className="relative w-full py-20 md:py-28 bg-white overflow-hidden">
        <div className="px-6 md:px-12 mb-14" style={{ maxWidth: 1280, margin: "0 auto" }}>
          <p className="qpi-caps mb-3" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {GALLERY_INTRO.kicker}
          </p>
          <h2
            className="qpi-display"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.5vw, 3rem)", lineHeight: 1.05 }}
          >
            {GALLERY_INTRO.heading}
          </h2>
        </div>
        <div
          className="px-6 md:px-12 grid grid-cols-2 sm:grid-cols-4 gap-6"
          style={{ maxWidth: 1280, margin: "0 auto" }}
        >
          {GALLERY_IMGS.slice(0, 4).map((src, i) => (
            <div
              key={src}
              style={{
                aspectRatio: "3 / 4",
                overflow: "hidden",
                background: "var(--qpi-ink)",
                marginTop: i % 2 === 1 ? 48 : 0,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt="A pool installed by QLD Pool Installs"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 6 · Mosaic: a 2x2 large + 4 small in a bento arrangement.
  {
    name: "Bento Mosaic",
    node: (
      <section className="relative w-full py-20 md:py-28 bg-white">
        <div className="px-6 md:px-12" style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="text-center mb-12">
            <p className="qpi-caps mb-3" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
              {GALLERY_INTRO.kicker}
            </p>
            <h2
              className="qpi-display"
              style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.5vw, 3rem)", lineHeight: 1.05 }}
            >
              {GALLERY_INTRO.heading}
            </h2>
          </div>
          <div
            className="grid grid-cols-4 gap-4"
            style={{ gridTemplateRows: "repeat(2, minmax(160px, 1fr))" }}
          >
            <div style={{ gridColumn: "span 2", gridRow: "span 2", overflow: "hidden", background: "var(--qpi-ink)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={GALLERY_IMGS[0]} alt="A pool installed by QLD Pool Installs" className="w-full h-full object-cover" loading="lazy" />
            </div>
            {GALLERY_IMGS.slice(1, 5).map((src) => (
              <div key={src} style={{ overflow: "hidden", background: "var(--qpi-ink)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="A pool installed by QLD Pool Installs" className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 7 · Static "carousel" row: images in a horizontal row bleeding off the right edge.
  {
    name: "Bleeding Carousel Row",
    node: (
      <section className="relative w-full py-20 md:py-28 bg-white overflow-hidden">
        <div className="px-6 md:px-12 mb-10 flex items-end justify-between flex-wrap gap-4" style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div>
            <p className="qpi-caps mb-3" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
              {GALLERY_INTRO.kicker}
            </p>
            <h2
              className="qpi-display"
              style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.5vw, 3rem)", lineHeight: 1.05 }}
            >
              {GALLERY_INTRO.heading}
            </h2>
          </div>
          <p className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: 10 }}>
            {GALLERY_IMGS.length} Projects
          </p>
        </div>
        <div className="flex gap-5 pl-6 md:pl-12" style={{ overflow: "hidden" }}>
          {GALLERY_IMGS.slice(0, 5).map((src) => (
            <div
              key={src}
              style={{
                flex: "0 0 auto",
                width: "min(70vw, 420px)",
                aspectRatio: "4 / 3",
                overflow: "hidden",
                background: "var(--qpi-ink)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="A pool installed by QLD Pool Installs" className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
          <div style={{ flex: "0 0 auto", width: 1 }} />
        </div>
      </section>
    ),
  },

  // 8 · Framed: each image inset with a wide white mat and a thin navy rule.
  {
    name: "White Mat Frames",
    node: (
      <section className="relative w-full py-20 md:py-28 bg-white">
        <div className="px-6 md:px-12" style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="text-center mb-12">
            <p className="qpi-caps mb-3" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
              {GALLERY_INTRO.kicker}
            </p>
            <h2
              className="qpi-display"
              style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.5vw, 3rem)", lineHeight: 1.05 }}
            >
              {GALLERY_INTRO.heading}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {GALLERY_IMGS.slice(0, 3).map((src, i) => (
              <div key={src}>
                <div
                  style={{
                    border: "1px solid rgba(11,42,74,0.15)",
                    padding: 10,
                  }}
                >
                  <div style={{ aspectRatio: "4 / 3", overflow: "hidden", background: "var(--qpi-ink)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="A pool installed by QLD Pool Installs" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                </div>
                <div style={{ width: 24, height: 1, background: "var(--qpi-blue)", margin: "14px auto 8px" }} />
                <p className="qpi-caps text-center" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 10 }}>
                  {AREAS[i % AREAS.length]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 9 · Navy ground, images in a tight 3-up with white type above.
  {
    name: "Navy Ground 3-Up",
    node: (
      <section className="relative w-full py-20 md:py-28" style={{ background: "var(--qpi-ink)" }}>
        <div className="px-6 md:px-12" style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="text-center mb-12">
            <p className="qpi-caps mb-3" style={{ color: "#fff", opacity: 0.6, fontSize: 11 }}>
              {GALLERY_INTRO.kicker}
            </p>
            <h2
              className="qpi-display"
              style={{ color: "#fff", fontSize: "clamp(1.75rem, 3.5vw, 3rem)", lineHeight: 1.05 }}
            >
              {GALLERY_INTRO.heading}
            </h2>
            <p style={{ color: "#fff", opacity: 0.55, fontSize: 14, marginTop: 16, maxWidth: 460, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
              {GALLERY_INTRO.sub}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
            {GALLERY_IMGS.slice(0, 3).map((src) => (
              <div key={src} style={{ aspectRatio: "4 / 3", overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="A pool installed by QLD Pool Installs" className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 10 · Big single hero-ish image with the heading overlaid, thumbs below.
  {
    name: "Overlaid Heading + Thumbs",
    node: (
      <section className="relative w-full py-20 md:py-28 bg-white">
        <div className="px-6 md:px-12" style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="relative" style={{ aspectRatio: "21 / 9", overflow: "hidden", background: "var(--qpi-ink)", marginBottom: 20 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GALLERY_IMGS[0]} alt="A pool installed by QLD Pool Installs" className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0" style={{ background: "rgba(11,42,74,0.42)" }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
              <p className="qpi-caps mb-3" style={{ color: "#fff", opacity: 0.85, fontSize: 11 }}>
                {GALLERY_INTRO.kicker}
              </p>
              <h2
                className="qpi-display"
                style={{ color: "#fff", fontSize: "clamp(1.75rem, 4vw, 3.25rem)", lineHeight: 1.05 }}
              >
                {GALLERY_INTRO.heading}
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {GALLERY_IMGS.slice(1, 7).map((src) => (
              <div key={src} style={{ aspectRatio: "1 / 1", overflow: "hidden", background: "var(--qpi-ink)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="A pool installed by QLD Pool Installs" className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 11 · 5-up thin strip of tall portrait crops, heading centred above.
  {
    name: "Portrait Strip 5-Up",
    node: (
      <section className="relative w-full py-20 md:py-28 bg-white">
        <div className="text-center px-6 mb-12">
          <p className="qpi-caps mb-3" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {GALLERY_INTRO.kicker}
          </p>
          <h2
            className="qpi-display"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.5vw, 3rem)", lineHeight: 1.05 }}
          >
            {GALLERY_INTRO.heading}
          </h2>
        </div>
        <div className="px-6 md:px-12 grid grid-cols-5 gap-2" style={{ maxWidth: 1280, margin: "0 auto" }}>
          {GALLERY_IMGS.slice(0, 5).map((src) => (
            <div key={src} style={{ aspectRatio: "2 / 3", overflow: "hidden", background: "var(--qpi-ink)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="A pool installed by QLD Pool Installs" className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 12 · Captioned index: image left, area label + number right, as ledger rows.
  {
    name: "Ledger Index Rows",
    node: (
      <section className="relative w-full py-20 md:py-28 bg-white">
        <div className="px-6 md:px-12" style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="mb-12">
            <p className="qpi-caps mb-3" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
              {GALLERY_INTRO.kicker}
            </p>
            <h2
              className="qpi-display"
              style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.5vw, 3rem)", lineHeight: 1.05 }}
            >
              {GALLERY_INTRO.heading}
            </h2>
          </div>
          {GALLERY_IMGS.slice(0, 5).map((src, i) => (
            <div
              key={src}
              className="flex items-center gap-6 py-5"
              style={{ borderTop: i === 0 ? "1px solid rgba(11,42,74,0.15)" : undefined, borderBottom: "1px solid rgba(11,42,74,0.15)" }}
            >
              <div style={{ width: 120, height: 80, flexShrink: 0, overflow: "hidden", background: "var(--qpi-ink)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="A pool installed by QLD Pool Installs" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <p className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.35, fontSize: 11, flexShrink: 0 }}>
                0{i + 1}
              </p>
              <p style={{ color: "var(--qpi-ink)", fontSize: 16, fontWeight: 600, flex: 1 }}>
                {AREAS[i % AREAS.length]}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 13 · Two columns: heading + CTA sticky-feel left, tall image stack right.
  {
    name: "Sticky Heading, Image Stack",
    node: (
      <section className="relative w-full py-20 md:py-28 bg-white">
        <div className="px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-10" style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div>
            <p className="qpi-caps mb-4" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
              {GALLERY_INTRO.kicker}
            </p>
            <h2
              className="qpi-display"
              style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 4vw, 3.25rem)", lineHeight: 1.05, marginBottom: 20 }}
            >
              {GALLERY_INTRO.heading}
            </h2>
            <p style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: 15, lineHeight: 1.7, maxWidth: 380, marginBottom: 28 }}>
              {GALLERY_INTRO.sub}
            </p>
            <span className="qpi-cta" style={{ background: "var(--qpi-ink)", color: "#fff" }}>
              {GALLERY_INTRO.cta}
            </span>
          </div>
          <div className="flex flex-col gap-4">
            {GALLERY_IMGS.slice(0, 3).map((src) => (
              <div key={src} style={{ aspectRatio: "16 / 9", overflow: "hidden", background: "var(--qpi-ink)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="A pool installed by QLD Pool Installs" className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 14 · Full-bleed mosaic with zero gaps (seamless tiles).
  {
    name: "Seamless Full-Bleed Mosaic",
    node: (
      <section className="relative w-full py-20 md:py-28 bg-white">
        <div className="px-6 md:px-12 text-center mb-10">
          <p className="qpi-caps mb-3" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {GALLERY_INTRO.kicker}
          </p>
          <h2
            className="qpi-display"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.5vw, 3rem)", lineHeight: 1.05 }}
          >
            {GALLERY_INTRO.heading}
          </h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5">
          {GALLERY_IMGS.slice(0, 10).map((src) => (
            <div key={src} style={{ aspectRatio: "1 / 1", overflow: "hidden", background: "var(--qpi-ink)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="A pool installed by QLD Pool Installs" className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 15 · Wide 16:9 stack, one per row, generous vertical spacing, editorial.
  {
    name: "Editorial Wide Stack",
    node: (
      <section className="relative w-full py-20 md:py-28 bg-white">
        <div className="px-6 md:px-12 text-center mb-16" style={{ maxWidth: 700, margin: "0 auto 4rem" }}>
          <p className="qpi-caps mb-3" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {GALLERY_INTRO.kicker}
          </p>
          <h2
            className="qpi-display"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.5vw, 3rem)", lineHeight: 1.05, marginBottom: 16 }}
          >
            {GALLERY_INTRO.heading}
          </h2>
          <p style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: 15, lineHeight: 1.7 }}>{GALLERY_INTRO.sub}</p>
        </div>
        <div className="px-6 md:px-16 flex flex-col gap-16" style={{ maxWidth: 1100, margin: "0 auto" }}>
          {GALLERY_IMGS.slice(0, 3).map((src, i) => (
            <div key={src}>
              <div style={{ aspectRatio: "16 / 9", overflow: "hidden", background: "var(--qpi-ink)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="A pool installed by QLD Pool Installs" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <p className="qpi-caps mt-4" style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: 10 }}>
                {AREAS[i % AREAS.length]}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 16 · Grid with one cell replaced by a navy block holding the CTA.
  {
    name: "CTA-in-Grid",
    node: (
      <section className="relative w-full py-20 md:py-28 bg-white">
        <div className="px-6 md:px-12" style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {GALLERY_IMGS.slice(0, 5).map((src) => (
              <div key={src} style={{ aspectRatio: "1 / 1", overflow: "hidden", background: "var(--qpi-ink)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="A pool installed by QLD Pool Installs" className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
            <div
              className="flex flex-col items-start justify-center px-6"
              style={{ aspectRatio: "1 / 1", background: "var(--qpi-ink)" }}
            >
              <p className="qpi-caps mb-2" style={{ color: "#fff", opacity: 0.6, fontSize: 10 }}>
                {GALLERY_INTRO.kicker}
              </p>
              <h2
                className="qpi-display"
                style={{ color: "#fff", fontSize: "clamp(1.125rem, 2vw, 1.5rem)", lineHeight: 1.15, marginBottom: 16 }}
              >
                {GALLERY_INTRO.heading}
              </h2>
              <span className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.14em" }}>
                {GALLERY_INTRO.cta} &rarr;
              </span>
            </div>
          </div>
        </div>
      </section>
    ),
  },

  // 17 · Arch-topped image crops (border-radius on top corners) in a 3-up.
  {
    name: "Arch-Topped 3-Up",
    node: (
      <section className="relative w-full py-20 md:py-28 bg-white">
        <div className="px-6 md:px-12 text-center mb-14">
          <p className="qpi-caps mb-3" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {GALLERY_INTRO.kicker}
          </p>
          <h2
            className="qpi-display"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.5vw, 3rem)", lineHeight: 1.05 }}
          >
            {GALLERY_INTRO.heading}
          </h2>
        </div>
        <div className="px-6 md:px-12 grid grid-cols-1 sm:grid-cols-3 gap-8" style={{ maxWidth: 1100, margin: "0 auto" }}>
          {GALLERY_IMGS.slice(0, 3).map((src, i) => (
            <div key={src} className="text-center">
              <div
                style={{
                  aspectRatio: "3 / 4",
                  overflow: "hidden",
                  background: "var(--qpi-ink)",
                  borderRadius: "999px 999px 8px 8px",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="A pool installed by QLD Pool Installs" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <p className="qpi-caps mt-4" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 10 }}>
                {AREAS[i % AREAS.length]}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 18 · Circle crops in a row, heading beneath.
  {
    name: "Circle Row",
    node: (
      <section className="relative w-full py-20 md:py-28 bg-white">
        <div className="px-6 md:px-12" style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div className="flex justify-center flex-wrap gap-6 mb-14">
            {GALLERY_IMGS.slice(0, 5).map((src) => (
              <div
                key={src}
                style={{
                  width: "clamp(96px, 16vw, 160px)",
                  height: "clamp(96px, 16vw, 160px)",
                  borderRadius: "50%",
                  overflow: "hidden",
                  background: "var(--qpi-ink)",
                  flexShrink: 0,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="A pool installed by QLD Pool Installs" className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="qpi-caps mb-3" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
              {GALLERY_INTRO.kicker}
            </p>
            <h2
              className="qpi-display"
              style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.5vw, 3rem)", lineHeight: 1.05 }}
            >
              {GALLERY_INTRO.heading}
            </h2>
          </div>
        </div>
      </section>
    ),
  },

  // 19 · Overlapping images (slight negative margins, layered z-index) collage.
  {
    name: "Overlapping Collage",
    node: (
      <section className="relative w-full py-20 md:py-28 bg-white">
        <div className="px-6 md:px-12 text-center mb-16">
          <p className="qpi-caps mb-3" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {GALLERY_INTRO.kicker}
          </p>
          <h2
            className="qpi-display"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.5vw, 3rem)", lineHeight: 1.05 }}
          >
            {GALLERY_INTRO.heading}
          </h2>
        </div>
        <div className="relative flex justify-center items-center" style={{ maxWidth: 900, margin: "0 auto", height: "clamp(280px, 40vw, 420px)" }}>
          <div
            className="absolute"
            style={{ width: "42%", aspectRatio: "4 / 3", overflow: "hidden", background: "var(--qpi-ink)", left: "6%", top: "8%", zIndex: 10, boxShadow: "0 12px 32px rgba(11,42,74,0.18)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GALLERY_IMGS[0]} alt="A pool installed by QLD Pool Installs" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div
            className="absolute"
            style={{ width: "46%", aspectRatio: "4 / 3", overflow: "hidden", background: "var(--qpi-ink)", left: "30%", top: "26%", zIndex: 20, boxShadow: "0 12px 32px rgba(11,42,74,0.22)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GALLERY_IMGS[1]} alt="A pool installed by QLD Pool Installs" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div
            className="absolute"
            style={{ width: "40%", aspectRatio: "4 / 3", overflow: "hidden", background: "var(--qpi-ink)", right: "6%", top: "4%", zIndex: 15, boxShadow: "0 12px 32px rgba(11,42,74,0.18)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GALLERY_IMGS[2]} alt="A pool installed by QLD Pool Installs" className="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      </section>
    ),
  },

  // 20 · 4-up small grid + a big feature to its right.
  {
    name: "Small Grid + Big Feature",
    node: (
      <section className="relative w-full py-20 md:py-28 bg-white">
        <div className="px-6 md:px-12" style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="mb-12">
            <p className="qpi-caps mb-3" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
              {GALLERY_INTRO.kicker}
            </p>
            <h2
              className="qpi-display"
              style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.5vw, 3rem)", lineHeight: 1.05 }}
            >
              {GALLERY_INTRO.heading}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid grid-cols-2 gap-4" style={{ gridColumn: "span 1" }}>
              {GALLERY_IMGS.slice(0, 4).map((src) => (
                <div key={src} style={{ aspectRatio: "1 / 1", overflow: "hidden", background: "var(--qpi-ink)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="A pool installed by QLD Pool Installs" className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
            <div style={{ gridColumn: "span 2", overflow: "hidden", background: "var(--qpi-ink)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={GALLERY_IMGS[4]} alt="A pool installed by QLD Pool Installs" className="w-full h-full object-cover" loading="lazy" style={{ minHeight: 320 }} />
            </div>
          </div>
        </div>
      </section>
    ),
  },

  // 21 · Alternating image / area-label rows, very minimal, hairline rules.
  {
    name: "Alternating Minimal Rows",
    node: (
      <section className="relative w-full py-20 md:py-28 bg-white">
        <div className="px-6 md:px-12 text-center mb-14">
          <p className="qpi-caps mb-3" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {GALLERY_INTRO.kicker}
          </p>
          <h2
            className="qpi-display"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.5vw, 3rem)", lineHeight: 1.05 }}
          >
            {GALLERY_INTRO.heading}
          </h2>
        </div>
        <div style={{ borderTop: "1px solid rgba(11,42,74,0.15)" }}>
          {GALLERY_IMGS.slice(0, 4).map((src, i) => (
            <div key={src}>
              {i % 2 === 0 ? (
                <div className="px-6 md:px-12 py-8" style={{ aspectRatio: "21 / 9", overflow: "hidden", background: "var(--qpi-ink)", borderBottom: "1px solid rgba(11,42,74,0.15)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="A pool installed by QLD Pool Installs" className="w-full h-full object-cover" loading="lazy" />
                </div>
              ) : (
                <div className="px-6 md:px-12 py-10 flex items-center justify-center" style={{ borderBottom: "1px solid rgba(11,42,74,0.15)" }}>
                  <p className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: 12, letterSpacing: "0.2em" }}>
                    {AREAS[i % AREAS.length]}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 22 · Duotone-blue treated grid (grayscale + blue multiply overlay per tile).
  {
    name: "Duotone Blue Grid",
    node: (
      <section className="relative w-full py-20 md:py-28 bg-white">
        <div className="px-6 md:px-12 text-center mb-12">
          <p className="qpi-caps mb-3" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {GALLERY_INTRO.kicker}
          </p>
          <h2
            className="qpi-display"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.5vw, 3rem)", lineHeight: 1.05 }}
          >
            {GALLERY_INTRO.heading}
          </h2>
        </div>
        <div className="px-6 md:px-12 grid grid-cols-2 sm:grid-cols-4 gap-3" style={{ maxWidth: 1200, margin: "0 auto" }}>
          {GALLERY_IMGS.slice(0, 8).map((src) => (
            <div key={src} className="relative" style={{ aspectRatio: "4 / 3", overflow: "hidden", background: "var(--qpi-ink)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt="A pool installed by QLD Pool Installs"
                className="w-full h-full object-cover"
                loading="lazy"
                style={{ filter: "grayscale(1) contrast(1.05)" }}
              />
              <div className="absolute inset-0" style={{ background: "var(--qpi-blue)", opacity: 0.42, mixBlendMode: "multiply" }} />
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 23 · Image grid inside a navy full-bleed band with a white inner margin.
  {
    name: "Navy Band, White Margin",
    node: (
      <section className="relative w-full py-20 md:py-28" style={{ background: "var(--qpi-ink)" }}>
        <div className="text-center mb-10 px-6">
          <p className="qpi-caps mb-3" style={{ color: "#fff", opacity: 0.6, fontSize: 11 }}>
            {GALLERY_INTRO.kicker}
          </p>
          <h2
            className="qpi-display"
            style={{ color: "#fff", fontSize: "clamp(1.75rem, 3.5vw, 3rem)", lineHeight: 1.05 }}
          >
            {GALLERY_INTRO.heading}
          </h2>
        </div>
        <div className="px-8 md:px-16" style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ background: "#fff", padding: "clamp(12px, 2vw, 24px)" }}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {GALLERY_IMGS.slice(0, 3).map((src) => (
                <div key={src} style={{ aspectRatio: "4 / 3", overflow: "hidden", background: "var(--qpi-ink)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="A pool installed by QLD Pool Installs" className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    ),
  },

  // 24 · Heading huge across the top, images as a dense 5-column contact sheet.
  {
    name: "Contact Sheet",
    node: (
      <section className="relative w-full py-20 md:py-28 bg-white">
        <div className="px-6 md:px-12 mb-10" style={{ maxWidth: 1280, margin: "0 auto" }}>
          <h2
            className="qpi-display"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(2.5rem, 7vw, 5.5rem)", lineHeight: 0.95, letterSpacing: "-0.02em" }}
          >
            {GALLERY_INTRO.heading}
          </h2>
          <p className="qpi-caps mt-4" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {GALLERY_INTRO.kicker}
          </p>
        </div>
        <div className="px-6 md:px-12 grid grid-cols-3 sm:grid-cols-5 gap-2" style={{ maxWidth: 1280, margin: "0 auto" }}>
          {GALLERY_IMGS.map((src) => (
            <div key={src} style={{ aspectRatio: "1 / 1", overflow: "hidden", background: "var(--qpi-ink)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="A pool installed by QLD Pool Installs" className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 25 · Split: one enormous tall image left (full height of section), 2x2 grid right.
  {
    name: "Split: Tall Left, 2x2 Right",
    node: (
      <section className="relative w-full py-20 md:py-28 bg-white">
        <div className="px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-6" style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div>
            <p className="qpi-caps mb-3" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
              {GALLERY_INTRO.kicker}
            </p>
            <h2
              className="qpi-display mb-6"
              style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.5vw, 3rem)", lineHeight: 1.05 }}
            >
              {GALLERY_INTRO.heading}
            </h2>
            <div style={{ aspectRatio: "3 / 4", overflow: "hidden", background: "var(--qpi-ink)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={GALLERY_IMGS[0]} alt="A pool installed by QLD Pool Installs" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6" style={{ alignContent: "end" }}>
            {GALLERY_IMGS.slice(1, 5).map((src) => (
              <div key={src} style={{ aspectRatio: "1 / 1", overflow: "hidden", background: "var(--qpi-ink)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="A pool installed by QLD Pool Installs" className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },
];
