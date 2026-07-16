import { GALLERY_INTRO, GALLERY_IMGS, AREAS, TESTIMONIALS, type Section } from "../kit";

/**
 * Gallery / "Recent Pool Installations" — THIRD batch, fully replacing the
 * previous 25 rejected experiments. 20 fresh design directions, each a single
 * min-h-svh, vertically centred viewport on a white ground. Server-rendered
 * only: no hooks, no client directive, no event handlers. Colours limited to
 * white, var(--qpi-ink), var(--qpi-blue), var(--qpi-aqua) (dark grounds
 * only), and opacity variants of those.
 */

const IMG_ALT = "A pool installed by QLD Pool Installs";

export const optionsGallery: Section[] = [
  // 1 · Extreme scale contrast — one dominant tall image with a small square
  // counterpoint tucked over its bottom-right corner, framed in white.
  {
    name: "Scale Collision",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div
          className="mx-auto grid w-full grid-cols-1 md:grid-cols-[1.2fr_1fr] items-center gap-10 md:gap-14"
          style={{ maxWidth: 1080 }}
        >
          <div className="relative mx-auto w-full" style={{ maxWidth: 440 }}>
            <div
              style={{
                aspectRatio: "4 / 5",
                overflow: "hidden",
                background: "var(--qpi-ink)",
                maxHeight: "clamp(320px, 52vh, 480px)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={GALLERY_IMGS[1]} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div
              className="absolute"
              style={{
                width: "34%",
                aspectRatio: "1 / 1",
                overflow: "hidden",
                background: "var(--qpi-ink)",
                right: "-10%",
                bottom: "-10%",
                border: "6px solid #fff",
                boxShadow: "0 14px 28px rgba(25,60,90,0.24)",
                zIndex: 10,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={GALLERY_IMGS[6]} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
          <div>
            <p className="qpi-caps mb-3" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
              {GALLERY_INTRO.kicker}
            </p>
            <h2
              className="qpi-display mb-4"
              style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.4vw, 2.75rem)", lineHeight: 1.05 }}
            >
              {GALLERY_INTRO.heading}
            </h2>
            <p style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
              {GALLERY_INTRO.sub}
            </p>
            <span className="qpi-cta" style={{ background: "var(--qpi-ink)", color: "#fff" }}>
              {GALLERY_INTRO.cta}
            </span>
          </div>
        </div>
      </section>
    ),
  },

  // 2 · Asymmetric off-grid placement — three images, three different
  // widths, three different vertical anchors, no overlap, big air between.
  {
    name: "Off-Grid Trio",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto text-center mb-10 md:mb-14" style={{ maxWidth: 620 }}>
          <p className="qpi-caps mb-2" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {GALLERY_INTRO.kicker}
          </p>
          <h2
            className="qpi-display"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.05 }}
          >
            {GALLERY_INTRO.heading}
          </h2>
        </div>
        <div
          className="mx-auto flex w-full items-stretch justify-between gap-6 md:gap-10"
          style={{ maxWidth: 1100, height: "clamp(240px, 34vh, 340px)" }}
        >
          <div style={{ width: "36%", alignSelf: "flex-start", height: "72%", overflow: "hidden", background: "var(--qpi-ink)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GALLERY_IMGS[0]} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div style={{ width: "24%", alignSelf: "center", height: "58%", overflow: "hidden", background: "var(--qpi-ink)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GALLERY_IMGS[5]} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div style={{ width: "28%", alignSelf: "flex-end", height: "84%", overflow: "hidden", background: "var(--qpi-ink)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GALLERY_IMGS[9]} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      </section>
    ),
  },

  // 3 · One ultra-wide letterbox image with a vertical, rotated caption
  // running along its left outside edge like a spine label.
  {
    name: "Letterbox Index",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full text-center mb-8" style={{ maxWidth: 560 }}>
          <p className="qpi-caps mb-2" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {GALLERY_INTRO.kicker}
          </p>
          <h2
            className="qpi-display"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.05 }}
          >
            {GALLERY_INTRO.heading}
          </h2>
        </div>
        <div className="mx-auto flex w-full items-stretch gap-4 md:gap-6" style={{ maxWidth: 1100 }}>
          <div className="flex items-center justify-center" style={{ flex: "0 0 auto" }}>
            <p
              className="qpi-caps"
              style={{
                color: "var(--qpi-ink)",
                opacity: 0.45,
                fontSize: 10,
                letterSpacing: "0.2em",
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
                whiteSpace: "nowrap",
              }}
            >
              {AREAS[2]}
            </p>
          </div>
          <div
            style={{
              flex: 1,
              aspectRatio: "32 / 9",
              overflow: "hidden",
              background: "var(--qpi-ink)",
              maxHeight: "clamp(200px, 32vh, 320px)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GALLERY_IMGS[2]} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      </section>
    ),
  },

  // 4 · 80/20 split screen — a wide image column, a thin vertical-type
  // column carrying the kicker, heading and CTA rotated on-edge.
  {
    name: "Eighty Twenty",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto flex w-full items-stretch" style={{ maxWidth: 1200, height: "clamp(320px, 52vh, 480px)" }}>
          <div style={{ width: "80%", overflow: "hidden", background: "var(--qpi-ink)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GALLERY_IMGS[3]} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div className="flex flex-col items-center justify-between" style={{ width: "20%", padding: "28px 12px" }}>
            <p
              className="qpi-caps"
              style={{
                color: "var(--qpi-blue)",
                fontSize: 11,
                letterSpacing: "0.2em",
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
            >
              {GALLERY_INTRO.kicker}
            </p>
            <h2
              className="qpi-display"
              style={{
                color: "var(--qpi-ink)",
                fontSize: "clamp(1rem, 1.8vw, 1.375rem)",
                lineHeight: 1.15,
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
            >
              {GALLERY_INTRO.heading}
            </h2>
            <span className="qpi-cta" style={{ background: "var(--qpi-ink)", color: "#fff" }}>
              {GALLERY_INTRO.cta}
            </span>
          </div>
        </div>
      </section>
    ),
  },

  // 5 · A single panoramic image bleeding off only the right physical edge,
  // heading sitting alone in the whitespace above it.
  {
    name: "Single Edge Bleed",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mb-8 md:mb-10" style={{ maxWidth: 560 }}>
          <p className="qpi-caps mb-2" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {GALLERY_INTRO.kicker}
          </p>
          <h2
            className="qpi-display"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.05 }}
          >
            {GALLERY_INTRO.heading}
          </h2>
        </div>
        <div
          style={{
            aspectRatio: "21 / 9",
            overflow: "hidden",
            background: "var(--qpi-ink)",
            maxHeight: "clamp(220px, 34vh, 340px)",
            marginRight: "calc(-1 * clamp(20px, 4vw, 56px))",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={GALLERY_IMGS[10]} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
        </div>
      </section>
    ),
  },

  // 6 · One dominant feature image with a slim vertical rail of three
  // stacked thumbnails running alongside it.
  {
    name: "Rail & Feature",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto text-center mb-8 md:mb-10" style={{ maxWidth: 560 }}>
          <p className="qpi-caps mb-2" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {GALLERY_INTRO.kicker}
          </p>
          <h2
            className="qpi-display"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.05 }}
          >
            {GALLERY_INTRO.heading}
          </h2>
        </div>
        <div className="mx-auto flex w-full gap-3" style={{ maxWidth: 1100, height: "clamp(280px, 44vh, 400px)" }}>
          <div style={{ flex: 1, overflow: "hidden", background: "var(--qpi-ink)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GALLERY_IMGS[4]} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div className="flex flex-col gap-3" style={{ width: "18%" }}>
            {GALLERY_IMGS.slice(11, 14).map((src) => (
              <div key={src} style={{ flex: 1, overflow: "hidden", background: "var(--qpi-ink)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 7 · A horizontal row where each image's width steps up in a clear
  // rhythm, left to right, all sharing the same baseline.
  {
    name: "Staircase Rhythm",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto text-center mb-8 md:mb-10" style={{ maxWidth: 560 }}>
          <p className="qpi-caps mb-2" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {GALLERY_INTRO.kicker}
          </p>
          <h2
            className="qpi-display"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.05 }}
          >
            {GALLERY_INTRO.heading}
          </h2>
        </div>
        <div className="mx-auto flex items-end gap-3 md:gap-4" style={{ maxWidth: 1100 }}>
          {[14, 19, 24, 30].map((w, i) => (
            <div
              key={GALLERY_IMGS[i]}
              style={{
                width: `${w}%`,
                aspectRatio: "3 / 4",
                overflow: "hidden",
                background: "var(--qpi-ink)",
                maxHeight: "clamp(180px, 30vh, 280px)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={GALLERY_IMGS[i]} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 8 · Three ultra-tall slivers with generous gaps between them, a quiet,
  // spare composition.
  {
    name: "Sliver Trio",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto text-center mb-10 md:mb-12" style={{ maxWidth: 560 }}>
          <p className="qpi-caps mb-2" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {GALLERY_INTRO.kicker}
          </p>
          <h2
            className="qpi-display"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.05 }}
          >
            {GALLERY_INTRO.heading}
          </h2>
        </div>
        <div className="mx-auto flex justify-center gap-10 md:gap-16" style={{ maxWidth: 900 }}>
          {[GALLERY_IMGS[0], GALLERY_IMGS[7], GALLERY_IMGS[12]].map((src) => (
            <div
              key={src}
              style={{ width: "18%", aspectRatio: "2 / 5", overflow: "hidden", background: "var(--qpi-ink)", maxHeight: "clamp(220px, 36vh, 340px)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 9 · A small, single centred image swimming in vast whitespace, the
  // heading doing the compositional weight above it.
  {
    name: "Whisper Frame",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto text-center" style={{ maxWidth: 620 }}>
          <p className="qpi-caps mb-4" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {GALLERY_INTRO.kicker}
          </p>
          <h2
            className="qpi-display mb-8 md:mb-10"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 4vw, 3rem)", lineHeight: 1.05 }}
          >
            {GALLERY_INTRO.heading}
          </h2>
          <div className="mx-auto" style={{ width: "22%", minWidth: 140, aspectRatio: "1 / 1", overflow: "hidden", background: "var(--qpi-ink)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GALLERY_IMGS[13]} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
          </div>
          <p
            className="mt-8 md:mt-10"
            style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: 15, lineHeight: 1.7, maxWidth: 420, marginLeft: "auto", marginRight: "auto" }}
          >
            {GALLERY_INTRO.sub}
          </p>
        </div>
      </section>
    ),
  },

  // 10 · Heading typography overlapping the boundary between the white
  // ground and an image panel, using a blend mode so it reads on both.
  {
    name: "Text Through Image",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="relative mx-auto w-full" style={{ maxWidth: 1140, height: "clamp(300px, 46vh, 440px)" }}>
          <div className="absolute inset-y-0 right-0" style={{ width: "56%", overflow: "hidden", background: "var(--qpi-ink)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GALLERY_IMGS[8]} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div className="absolute left-0" style={{ top: "50%", transform: "translateY(-50%)", zIndex: 10, width: "78%" }}>
            <p className="qpi-caps mb-3" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
              {GALLERY_INTRO.kicker}
            </p>
            <h2
              className="qpi-display"
              style={{
                color: "#fff",
                mixBlendMode: "exclusion",
                fontSize: "clamp(2.25rem, 6vw, 4.5rem)",
                lineHeight: 0.98,
              }}
            >
              {GALLERY_INTRO.heading}
            </h2>
          </div>
        </div>
      </section>
    ),
  },

  // 11 · A single dominant image with a raised white quote card overlapping
  // only its bottom edge.
  {
    name: "Quote & Frame",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="relative mx-auto w-full" style={{ maxWidth: 760 }}>
          <div style={{ aspectRatio: "4 / 3", overflow: "hidden", background: "var(--qpi-ink)", maxHeight: "clamp(280px, 44vh, 420px)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GALLERY_IMGS[9]} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div
            className="mx-auto"
            style={{
              width: "84%",
              transform: "translateY(-40%)",
              background: "#fff",
              padding: "24px 28px",
              boxShadow: "0 18px 36px rgba(25,60,90,0.2)",
            }}
          >
            <p style={{ color: "var(--qpi-ink)", fontSize: "clamp(1rem, 1.8vw, 1.25rem)", lineHeight: 1.5, marginBottom: 10 }}>
              &ldquo;{TESTIMONIALS[2].short}&rdquo;
            </p>
            <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>
              {TESTIMONIALS[2].name}
            </p>
          </div>
        </div>
      </section>
    ),
  },

  // 12 · A single row of squares that step up then down in size, a
  // deliberate visual "bump" centred on the middle image.
  {
    name: "Uneven Squares",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto text-center mb-10 md:mb-12" style={{ maxWidth: 560 }}>
          <p className="qpi-caps mb-2" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {GALLERY_INTRO.kicker}
          </p>
          <h2
            className="qpi-display"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.05 }}
          >
            {GALLERY_INTRO.heading}
          </h2>
        </div>
        <div className="mx-auto flex items-end justify-center gap-4 md:gap-6" style={{ maxWidth: 1000 }}>
          {[70, 96, 130, 96, 70].map((size, i) => (
            <div
              key={GALLERY_IMGS[i]}
              style={{
                width: `clamp(${size - 20}px, ${size / 8}vw, ${size}px)`,
                aspectRatio: "1 / 1",
                overflow: "hidden",
                background: "var(--qpi-ink)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={GALLERY_IMGS[i]} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 13 · One portrait image pulled up above its own block via negative
  // margin, pinned right, with heading and kicker in the space beneath it.
  {
    name: "Corner Anchor",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="relative mx-auto w-full" style={{ maxWidth: 1100 }}>
          <div
            className="ml-auto"
            style={{
              width: "44%",
              aspectRatio: "3 / 4",
              overflow: "hidden",
              background: "var(--qpi-ink)",
              marginTop: "calc(-1 * clamp(24px, 6vh, 64px))",
              maxHeight: "clamp(260px, 44vh, 420px)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GALLERY_IMGS[11]} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div className="mt-8" style={{ maxWidth: 420 }}>
            <p className="qpi-caps mb-2" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
              {GALLERY_INTRO.kicker}
            </p>
            <h2
              className="qpi-display"
              style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.05 }}
            >
              {GALLERY_INTRO.heading}
            </h2>
          </div>
        </div>
      </section>
    ),
  },

  // 14 · Two ultra-wide letterboxed images stacked with a thin hairline
  // gap, a quiet panoramic pairing.
  {
    name: "Panorama Pair",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto text-center mb-8 md:mb-10" style={{ maxWidth: 560 }}>
          <p className="qpi-caps mb-2" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {GALLERY_INTRO.kicker}
          </p>
          <h2
            className="qpi-display"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.05 }}
          >
            {GALLERY_INTRO.heading}
          </h2>
        </div>
        <div className="mx-auto flex flex-col gap-1" style={{ maxWidth: 1000 }}>
          {[GALLERY_IMGS[3], GALLERY_IMGS[14]].map((src) => (
            <div key={src} style={{ aspectRatio: "32 / 9", overflow: "hidden", background: "var(--qpi-ink)", maxHeight: "clamp(120px, 18vh, 170px)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 15 · A huge portrait image shifted off-centre to the right, heading and
  // CTA filling the negative space it leaves on the left.
  {
    name: "Shifted Portrait",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div
          className="mx-auto grid w-full grid-cols-1 md:grid-cols-[1fr_1.1fr] items-center gap-10"
          style={{ maxWidth: 1100 }}
        >
          <div>
            <p className="qpi-caps mb-3" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
              {GALLERY_INTRO.kicker}
            </p>
            <h2
              className="qpi-display mb-4"
              style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.4vw, 2.75rem)", lineHeight: 1.05 }}
            >
              {GALLERY_INTRO.heading}
            </h2>
            <p style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
              {GALLERY_INTRO.sub}
            </p>
            <span className="qpi-cta" style={{ background: "var(--qpi-ink)", color: "#fff" }}>
              {GALLERY_INTRO.cta}
            </span>
          </div>
          <div
            className="ml-auto"
            style={{ width: "82%", aspectRatio: "4 / 5", overflow: "hidden", background: "var(--qpi-ink)", maxHeight: "clamp(320px, 52vh, 480px)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GALLERY_IMGS[6]} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      </section>
    ),
  },

  // 16 · Four uniform images placed along a diagonal line, each stepping
  // further right and down than the last.
  {
    name: "Diagonal Cascade",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto text-center mb-10 md:mb-12" style={{ maxWidth: 560 }}>
          <p className="qpi-caps mb-2" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {GALLERY_INTRO.kicker}
          </p>
          <h2
            className="qpi-display"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.05 }}
          >
            {GALLERY_INTRO.heading}
          </h2>
        </div>
        <div className="relative mx-auto w-full" style={{ maxWidth: 900, height: "clamp(220px, 32vh, 300px)" }}>
          {GALLERY_IMGS.slice(0, 4).map((src, i) => (
            <div
              key={src}
              className="absolute"
              style={{
                left: `${i * 22}%`,
                top: `${i * 20}%`,
                width: "22%",
                aspectRatio: "1 / 1",
                overflow: "hidden",
                background: "var(--qpi-ink)",
                zIndex: 10 + i,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 17 · A small square anchor image left, a wide 16:9 image right filling
  // the remaining width, an asymmetric 30/70-feel pairing.
  {
    name: "Wide Then Narrow",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto flex items-end gap-4 md:gap-6" style={{ maxWidth: 1100 }}>
          <div style={{ width: "22%", aspectRatio: "1 / 1", overflow: "hidden", background: "var(--qpi-ink)", maxHeight: "clamp(160px, 24vh, 220px)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GALLERY_IMGS[12]} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div style={{ flex: 1 }}>
            <p className="qpi-caps mb-2" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
              {GALLERY_INTRO.kicker}
            </p>
            <h2
              className="qpi-display mb-4"
              style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.25rem, 2.6vw, 1.875rem)", lineHeight: 1.1 }}
            >
              {GALLERY_INTRO.heading}
            </h2>
            <div style={{ aspectRatio: "16 / 9", overflow: "hidden", background: "var(--qpi-ink)", maxHeight: "clamp(200px, 30vh, 280px)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={GALLERY_IMGS[13]} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </section>
    ),
  },

  // 18 · Captions treated as an oversized ghost numeral sitting behind and
  // peeking out from each image's top-left corner.
  {
    name: "Numbered Frame Row",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto text-center mb-10 md:mb-12" style={{ maxWidth: 560 }}>
          <p className="qpi-caps mb-2" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {GALLERY_INTRO.kicker}
          </p>
          <h2
            className="qpi-display"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.05 }}
          >
            {GALLERY_INTRO.heading}
          </h2>
        </div>
        <div className="mx-auto grid grid-cols-4 gap-8 md:gap-10" style={{ maxWidth: 1000 }}>
          {GALLERY_IMGS.slice(0, 4).map((src, i) => (
            <div key={src} className="relative">
              <p
                className="qpi-display absolute"
                style={{
                  color: "var(--qpi-ink)",
                  opacity: 0.08,
                  fontSize: "clamp(3rem, 8vw, 5.5rem)",
                  lineHeight: 1,
                  left: -10,
                  top: -18,
                  zIndex: 0,
                }}
              >
                0{i + 1}
              </p>
              <div style={{ position: "relative", aspectRatio: "4 / 5", overflow: "hidden", background: "var(--qpi-ink)", zIndex: 10 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 19 · Five squares in a single row with dramatically uneven gaps between
  // them, spacing itself carrying the rhythm rather than size.
  {
    name: "Breathing Grid",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto text-center mb-10 md:mb-12" style={{ maxWidth: 560 }}>
          <p className="qpi-caps mb-2" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {GALLERY_INTRO.kicker}
          </p>
          <h2
            className="qpi-display"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.05 }}
          >
            {GALLERY_INTRO.heading}
          </h2>
        </div>
        <div className="mx-auto flex items-center justify-center" style={{ maxWidth: 1100 }}>
          {[
            { src: GALLERY_IMGS[0], ml: 0 },
            { src: GALLERY_IMGS[1], ml: 8 },
            { src: GALLERY_IMGS[2], ml: 64 },
            { src: GALLERY_IMGS[3], ml: 12 },
            { src: GALLERY_IMGS[4], ml: 72 },
          ].map((item) => (
            <div
              key={item.src}
              style={{
                width: "clamp(90px, 13vw, 150px)",
                aspectRatio: "1 / 1",
                overflow: "hidden",
                background: "var(--qpi-ink)",
                marginLeft: item.ml,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 20 · A single hairline-bordered ribbon strip holding one image on one
  // side and a large-set testimonial quote on the other.
  {
    name: "Testimonial Ribbon",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto text-center mb-10 md:mb-12" style={{ maxWidth: 560 }}>
          <p className="qpi-caps mb-2" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {GALLERY_INTRO.kicker}
          </p>
          <h2
            className="qpi-display"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.05 }}
          >
            {GALLERY_INTRO.heading}
          </h2>
        </div>
        <div
          className="mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-10"
          style={{
            maxWidth: 1100,
            borderTop: "1px solid rgba(25,60,90,0.15)",
            borderBottom: "1px solid rgba(25,60,90,0.15)",
            padding: "clamp(20px, 4vh, 40px) 0",
          }}
        >
          <div style={{ width: "100%", maxWidth: 420, aspectRatio: "16 / 9", overflow: "hidden", background: "var(--qpi-ink)", flexShrink: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GALLERY_IMGS[5]} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: "var(--qpi-ink)", fontWeight: 600, fontSize: "clamp(1.25rem, 2.6vw, 1.875rem)", lineHeight: 1.3 }}>
              &ldquo;{TESTIMONIALS[0].short}&rdquo;
            </p>
            <p className="qpi-caps mt-4" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>
              {TESTIMONIALS[0].name}
            </p>
          </div>
        </div>
      </section>
    ),
  },
];
