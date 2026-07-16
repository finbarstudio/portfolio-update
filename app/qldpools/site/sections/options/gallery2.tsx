import { GALLERY_INTRO, GALLERY_IMGS, AREAS, TESTIMONIALS, type Section } from "../kit";

/**
 * Gallery / "Recent Pool Installations" — SECOND, WILDER batch of 20 design
 * options. gallery.tsx already covers the safe grids/mosaics; this file goes
 * further: colonnades, ink-framed arch windows, polaroid scatter, filmstrips,
 * radial fans, diamonds, ticket stubs. Every option is a single min-h-svh,
 * vertically centred viewport on a white ground — no exceptions.
 *
 * Server-rendered only: no hooks, no client directive, no event handlers.
 * Colours limited to white, var(--qpi-ink), var(--qpi-blue), var(--qpi-aqua)
 * (dark grounds only), and white/black opacity.
 */

const IMG_ALT = "A pool installed by QLD Pool Installs";
const ARCH = "9999px 9999px 0 0";
const HAIRLINE = "rgba(0,0,0,0.12)";

export const optionsGallery2: Section[] = [
  // 1 · Arch Colonnade — five uniform arches in a row like a portico, thin
  // ink pilasters between each column.
  {
    name: "Arch Colonnade",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="w-full mx-auto text-center" style={{ maxWidth: 1240 }}>
          <p className="qpi-caps mb-2" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {GALLERY_INTRO.kicker}
          </p>
          <h2
            className="qpi-display mb-8 md:mb-10"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.05 }}
          >
            {GALLERY_INTRO.heading}
          </h2>
          <div className="flex items-end justify-center">
            {GALLERY_IMGS.slice(0, 5).map((src, i) => (
              <div
                key={src}
                style={{
                  flex: "1 1 0",
                  minWidth: 0,
                  borderLeft: i > 0 ? `1px solid ${HAIRLINE}` : "none",
                  padding: "0 clamp(4px, 1vw, 12px)",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "clamp(200px, 30vh, 340px)",
                    overflow: "hidden",
                    borderRadius: ARCH,
                    background: "var(--qpi-ink)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 2 · Skyline Arches — arch columns of varied heights forming a skyline.
  {
    name: "Skyline Arches",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="w-full mx-auto text-center mb-8 md:mb-10" style={{ maxWidth: 640 }}>
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
        <div className="flex items-end justify-center gap-2 md:gap-4 mx-auto" style={{ maxWidth: 1100 }}>
          {[220, 300, 360, 260, 320].map((h, i) => (
            <div
              key={GALLERY_IMGS[i]}
              style={{
                flex: "1 1 0",
                minWidth: 0,
                height: `clamp(${h - 40}px, ${h / 10}vh, ${h}px)`,
                overflow: "hidden",
                borderRadius: ARCH,
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

  // 3 · Ink Arch Window — a deep ink "mat" frames a single arch photo like a
  // window cut into a solid block.
  {
    name: "Ink Arch Window",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="w-full mx-auto text-center mb-6" style={{ maxWidth: 500 }}>
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
          className="mx-auto"
          style={{
            background: "var(--qpi-ink)",
            padding: "clamp(16px, 3vw, 32px)",
            borderRadius: "9999px 9999px 20px 20px",
            width: "min(84vw, 420px)",
          }}
        >
          <div
            style={{
              aspectRatio: "3 / 4",
              overflow: "hidden",
              borderRadius: "9999px 9999px 8px 8px",
              maxHeight: "clamp(220px, 40vh, 400px)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GALLERY_IMGS[4]} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      </section>
    ),
  },

  // 4 · Scattered Polaroid Stack — five polaroid-style prints, loosely
  // overlapping at varied rotations.
  {
    name: "Scattered Polaroid Stack",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="w-full mx-auto text-center mb-8" style={{ maxWidth: 560 }}>
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
        <div className="relative mx-auto w-full" style={{ maxWidth: 760, height: "clamp(220px, 32vh, 320px)" }}>
          {[
            { left: "6%", top: "4%", rot: -8, z: 10 },
            { left: "24%", top: "-2%", rot: 5, z: 20 },
            { left: "42%", top: "8%", rot: -3, z: 30 },
            { left: "60%", top: "-4%", rot: 7, z: 20 },
            { left: "76%", top: "6%", rot: -6, z: 10 },
          ].map((p, i) => (
            <div
              key={GALLERY_IMGS[i]}
              className="absolute"
              style={{
                left: p.left,
                top: p.top,
                width: "20%",
                background: "#fff",
                padding: "8px 8px 24px",
                boxShadow: "0 14px 26px rgba(25,60,90,0.22)",
                transform: `rotate(${p.rot}deg)`,
                zIndex: p.z,
              }}
            >
              <div style={{ aspectRatio: "1 / 1", overflow: "hidden", background: "var(--qpi-ink)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={GALLERY_IMGS[i]} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 5 · Filmstrip Bleed — a strip of frames with sprocket-hole bands, bled
  // off both edges of the viewport via negative margins.
  {
    name: "Filmstrip Bleed",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20 overflow-hidden">
        <div className="text-center mb-8">
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
            marginLeft: "calc(-1 * clamp(20px, 4vw, 56px))",
            marginRight: "calc(-1 * clamp(20px, 4vw, 56px))",
          }}
        >
          <div
            style={{
              height: 10,
              background: "var(--qpi-ink)",
              backgroundImage: "radial-gradient(circle, #fff 2.5px, transparent 3px)",
              backgroundSize: "26px 100%",
              backgroundRepeat: "repeat-x",
              backgroundPosition: "center",
            }}
          />
          <div className="flex" style={{ gap: 4 }}>
            {GALLERY_IMGS.slice(0, 7).map((src) => (
              <div
                key={src}
                style={{
                  flex: "0 0 auto",
                  width: "min(24vw, 210px)",
                  aspectRatio: "4 / 3",
                  overflow: "hidden",
                  background: "var(--qpi-ink)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
          <div
            style={{
              height: 10,
              background: "var(--qpi-ink)",
              backgroundImage: "radial-gradient(circle, #fff 2.5px, transparent 3px)",
              backgroundSize: "26px 100%",
              backgroundRepeat: "repeat-x",
              backgroundPosition: "center",
            }}
          />
        </div>
      </section>
    ),
  },

  // 6 · Giant Arch + Satellites — one huge arch photo anchoring two small
  // circular satellite images.
  {
    name: "Giant Arch + Satellites",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="text-center mb-6">
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
        <div className="relative mx-auto w-full" style={{ maxWidth: 780, height: "clamp(280px, 40vh, 400px)" }}>
          <div
            className="absolute left-1/2"
            style={{
              transform: "translateX(-50%)",
              bottom: 0,
              width: "44%",
              height: "100%",
              overflow: "hidden",
              borderRadius: ARCH,
              background: "var(--qpi-ink)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GALLERY_IMGS[0]} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div
            className="absolute"
            style={{
              left: "2%",
              bottom: "4%",
              width: "20%",
              aspectRatio: "1 / 1",
              borderRadius: "50%",
              overflow: "hidden",
              background: "var(--qpi-ink)",
              boxShadow: "0 10px 22px rgba(25,60,90,0.24)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GALLERY_IMGS[1]} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div
            className="absolute"
            style={{
              right: "4%",
              top: "6%",
              width: "17%",
              aspectRatio: "1 / 1",
              borderRadius: "50%",
              overflow: "hidden",
              background: "var(--qpi-ink)",
              boxShadow: "0 10px 22px rgba(25,60,90,0.24)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GALLERY_IMGS[2]} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      </section>
    ),
  },

  // 7 · Diagonal Ribbon — four frames rotated together as one unit.
  {
    name: "Diagonal Ribbon",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20 overflow-hidden">
        <div className="text-center mb-10">
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
        <div className="mx-auto flex items-center justify-center" style={{ maxWidth: 1100, padding: "24px 0" }}>
          <div className="flex gap-3" style={{ transform: "rotate(-5deg)" }}>
            {GALLERY_IMGS.slice(0, 4).map((src) => (
              <div
                key={src}
                style={{
                  width: "min(20vw, 220px)",
                  aspectRatio: "4 / 3",
                  overflow: "hidden",
                  background: "var(--qpi-ink)",
                  boxShadow: "0 12px 24px rgba(25,60,90,0.18)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 8 · Quote Cell Grid — an image grid where one cell is replaced with a
  // real pull quote.
  {
    name: "Quote Cell Grid",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="w-full mx-auto" style={{ maxWidth: 1100 }}>
          <div className="grid grid-cols-3 gap-3">
            {GALLERY_IMGS.slice(0, 5).map((src) => (
              <div
                key={src}
                style={{ aspectRatio: "1 / 1", overflow: "hidden", background: "var(--qpi-ink)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
            <div
              className="flex flex-col items-start justify-center px-5"
              style={{ aspectRatio: "1 / 1", background: "var(--qpi-blue)" }}
            >
              <p style={{ color: "#fff", fontSize: "clamp(0.8125rem, 1.4vw, 1rem)", lineHeight: 1.5 }}>
                &ldquo;{TESTIMONIALS[0].short}&rdquo;
              </p>
              <p className="qpi-caps mt-3" style={{ color: "rgba(255,255,255,0.75)", fontSize: 9 }}>
                {TESTIMONIALS[0].name}
              </p>
            </div>
          </div>
        </div>
      </section>
    ),
  },

  // 9 · Porthole Row — circular windows set into an ink band, rivet ring detail.
  {
    name: "Porthole Row",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="text-center mb-8">
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
          className="mx-auto w-full"
          style={{ maxWidth: 1100, background: "var(--qpi-ink)", borderRadius: 24, padding: "clamp(20px, 3vw, 36px)" }}
        >
          <div className="flex justify-center flex-wrap gap-4 md:gap-6">
            {GALLERY_IMGS.slice(0, 5).map((src) => (
              <div
                key={src}
                style={{
                  width: "clamp(80px, 13vw, 130px)",
                  height: "clamp(80px, 13vw, 130px)",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "4px solid rgba(255,255,255,0.85)",
                  boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.25)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 10 · Arch Window Pan — a wide arch "doorway" with a placard-style caption.
  {
    name: "Arch Window Pan",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto text-center" style={{ width: "min(78vw, 520px)" }}>
          <div
            style={{
              aspectRatio: "4 / 5",
              overflow: "hidden",
              borderRadius: ARCH,
              background: "var(--qpi-ink)",
              border: "2px solid var(--qpi-ink)",
              maxHeight: "clamp(280px, 46vh, 460px)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GALLERY_IMGS[2]} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div style={{ width: 28, height: 1, background: "var(--qpi-blue)", margin: "18px auto 10px" }} />
          <p className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: 10 }}>
            {GALLERY_INTRO.kicker}
          </p>
          <h2
            className="qpi-display"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.25rem, 2.4vw, 1.75rem)", lineHeight: 1.1, marginTop: 6 }}
          >
            {GALLERY_INTRO.heading}
          </h2>
        </div>
      </section>
    ),
  },

  // 11 · Half Arch Duo — a tall arch left, a stacked pair right.
  {
    name: "Half Arch Duo",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-end" style={{ maxWidth: 1000 }}>
          <div>
            <p className="qpi-caps mb-2" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
              {GALLERY_INTRO.kicker}
            </p>
            <h2
              className="qpi-display mb-4"
              style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.05 }}
            >
              {GALLERY_INTRO.heading}
            </h2>
            <div
              style={{
                aspectRatio: "3 / 4",
                overflow: "hidden",
                borderRadius: ARCH,
                background: "var(--qpi-ink)",
                maxHeight: "clamp(220px, 36vh, 360px)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={GALLERY_IMGS[0]} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {GALLERY_IMGS.slice(1, 3).map((src) => (
              <div
                key={src}
                style={{ aspectRatio: "16 / 9", overflow: "hidden", background: "var(--qpi-ink)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 12 · Mosaic Radii — one grid, five different corner treatments per tile.
  {
    name: "Mosaic Radii",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="text-center mb-8">
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
        <div className="mx-auto grid grid-cols-3 sm:grid-cols-6 gap-3" style={{ maxWidth: 1100 }}>
          {GALLERY_IMGS.slice(0, 6).map((src, i) => {
            const radii = ["0", "50%", ARCH, "24px", "0 24px 0 24px", "50%"];
            return (
              <div
                key={src}
                style={{
                  aspectRatio: "1 / 1",
                  overflow: "hidden",
                  borderRadius: radii[i % radii.length],
                  background: "var(--qpi-ink)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
              </div>
            );
          })}
        </div>
      </section>
    ),
  },

  // 13 · Floating Card on Image Wall — dimmed photo wall behind a raised
  // white card carrying the heading and CTA.
  {
    name: "Floating Card on Image Wall",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="relative mx-auto w-full" style={{ maxWidth: 1140, height: "clamp(320px, 48vh, 460px)" }}>
          <div className="absolute inset-0 grid grid-cols-4 sm:grid-cols-6 gap-1" style={{ zIndex: 0 }}>
            {GALLERY_IMGS.slice(0, 12).map((src) => (
              <div key={src} className="relative" style={{ overflow: "hidden", background: "var(--qpi-ink)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0" style={{ background: "var(--qpi-ink)", opacity: 0.28 }} />
              </div>
            ))}
          </div>
          <div
            className="absolute left-1/2 top-1/2 flex flex-col items-center text-center px-8 py-8"
            style={{
              transform: "translate(-50%, -50%)",
              background: "#fff",
              width: "min(80vw, 460px)",
              boxShadow: "0 24px 50px rgba(25,60,90,0.28)",
              zIndex: 10,
            }}
          >
            <p className="qpi-caps mb-2" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
              {GALLERY_INTRO.kicker}
            </p>
            <h2
              className="qpi-display mb-4"
              style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.25rem, 2.6vw, 1.875rem)", lineHeight: 1.1 }}
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

  // 14 · Sunburst Fan — five frames fanned radially from a single pivot.
  {
    name: "Sunburst Fan",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="text-center mb-6">
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
        <div className="relative mx-auto w-full" style={{ maxWidth: 640, height: "clamp(220px, 32vh, 300px)" }}>
          {GALLERY_IMGS.slice(0, 5).map((src, i) => {
            const angle = (i - 2) * 13;
            return (
              <div
                key={src}
                className="absolute left-1/2 bottom-0"
                style={{
                  width: "min(20vw, 120px)",
                  aspectRatio: "3 / 4",
                  overflow: "hidden",
                  borderRadius: "9999px 9999px 4px 4px",
                  background: "var(--qpi-ink)",
                  transform: `translateX(-50%) rotate(${angle}deg) translateY(-8%)`,
                  transformOrigin: "bottom center",
                  boxShadow: "0 14px 26px rgba(25,60,90,0.22)",
                  zIndex: 10 + (5 - Math.abs(i - 2)),
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
              </div>
            );
          })}
        </div>
      </section>
    ),
  },

  // 15 · Arch Behind Ink Band — photos poke up over an ink band beneath them.
  {
    name: "Arch Behind Ink Band",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="relative mx-auto w-full" style={{ maxWidth: 1000, height: "clamp(300px, 44vh, 420px)" }}>
          <div className="absolute left-0 right-0 bottom-0" style={{ height: "50%", background: "var(--qpi-ink)" }} />
          <div className="relative flex justify-center gap-6" style={{ paddingTop: "6%" }}>
            {GALLERY_IMGS.slice(0, 3).map((src) => (
              <div
                key={src}
                style={{
                  width: "26%",
                  aspectRatio: "3 / 4",
                  overflow: "hidden",
                  borderRadius: ARCH,
                  boxShadow: "0 16px 30px rgba(25,60,90,0.3)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
          <div className="absolute left-0 right-0 text-center" style={{ bottom: "12%" }}>
            <p className="qpi-caps mb-1" style={{ color: "rgba(255,255,255,0.7)", fontSize: 10 }}>
              {GALLERY_INTRO.kicker}
            </p>
            <h2
              className="qpi-display"
              style={{ color: "#fff", fontSize: "clamp(1.125rem, 2.2vw, 1.625rem)", lineHeight: 1.1 }}
            >
              {GALLERY_INTRO.heading}
            </h2>
          </div>
        </div>
      </section>
    ),
  },

  // 16 · Vertical Arch Triptych — three arches of different widths forming a
  // grand doorway.
  {
    name: "Vertical Arch Triptych",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="text-center mb-8">
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
        <div className="flex items-end justify-center gap-3 mx-auto" style={{ maxWidth: 900 }}>
          {[
            { w: "24%", h: "clamp(180px, 26vh, 280px)" },
            { w: "34%", h: "clamp(240px, 36vh, 380px)" },
            { w: "24%", h: "clamp(180px, 26vh, 280px)" },
          ].map((cfg, i) => (
            <div
              key={GALLERY_IMGS[i]}
              style={{
                width: cfg.w,
                height: cfg.h,
                overflow: "hidden",
                borderRadius: ARCH,
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

  // 17 · Diamond Grid — square tiles rotated 45°, photos counter-rotated
  // upright inside.
  {
    name: "Diamond Grid",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="text-center mb-10">
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
        <div className="flex items-center justify-center gap-6 md:gap-10 flex-wrap mx-auto" style={{ maxWidth: 1000 }}>
          {GALLERY_IMGS.slice(0, 5).map((src) => (
            <div
              key={src}
              style={{
                width: "clamp(70px, 11vw, 110px)",
                height: "clamp(70px, 11vw, 110px)",
                overflow: "hidden",
                background: "var(--qpi-ink)",
                transform: "rotate(45deg)",
              }}
            >
              <div style={{ width: "100%", height: "100%", transform: "rotate(-45deg) scale(1.42)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 18 · Ticket Stub Row — frames with a perforated edge and a stub number,
  // like admission tickets to each project.
  {
    name: "Ticket Stub Row",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="text-center mb-8">
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
        <div className="mx-auto grid grid-cols-2 sm:grid-cols-4 gap-5" style={{ maxWidth: 1100 }}>
          {GALLERY_IMGS.slice(0, 4).map((src, i) => (
            <div key={src}>
              <div style={{ aspectRatio: "4 / 3", overflow: "hidden", background: "var(--qpi-ink)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div
                className="flex items-center justify-between"
                style={{
                  borderTop: `2px dashed ${HAIRLINE}`,
                  padding: "8px 2px 0",
                }}
              >
                <p className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: 9 }}>
                  No. 0{i + 1}
                </p>
                <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 9 }}>
                  {AREAS[i % AREAS.length]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 19 · Arch Spotlight — one huge arch photo with an ink vignette and a
  // minimal caption overlay.
  {
    name: "Arch Spotlight",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div
          className="relative mx-auto"
          style={{
            width: "min(74vw, 520px)",
            aspectRatio: "3 / 4",
            maxHeight: "clamp(280px, 50vh, 480px)",
            overflow: "hidden",
            borderRadius: ARCH,
            background: "var(--qpi-ink)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={GALLERY_IMGS[8]} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(25,60,90,0.55) 100%)" }}
          />
          <div className="absolute left-0 right-0 flex flex-col items-center text-center" style={{ bottom: "8%" }}>
            <p className="qpi-caps mb-2" style={{ color: "rgba(255,255,255,0.8)", fontSize: 10 }}>
              {GALLERY_INTRO.kicker}
            </p>
            <span className="qpi-cta" style={{ background: "#fff", color: "var(--qpi-ink)" }}>
              {GALLERY_INTRO.cta}
            </span>
          </div>
        </div>
      </section>
    ),
  },

  // 20 · Layered Depth Stack — three arches layered with increasing scale to
  // suggest depth, back frames dimmed.
  {
    name: "Layered Depth Stack",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="text-center mb-8">
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
        <div className="relative mx-auto w-full" style={{ maxWidth: 560, height: "clamp(240px, 36vh, 360px)" }}>
          <div
            className="absolute left-1/2"
            style={{
              transform: "translateX(-58%) scale(0.86)",
              bottom: 0,
              width: "70%",
              height: "82%",
              overflow: "hidden",
              borderRadius: ARCH,
              background: "var(--qpi-ink)",
              opacity: 0.5,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GALLERY_IMGS[3]} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div
            className="absolute left-1/2"
            style={{
              transform: "translateX(-42%) scale(0.93)",
              bottom: 0,
              width: "70%",
              height: "90%",
              overflow: "hidden",
              borderRadius: ARCH,
              background: "var(--qpi-ink)",
              opacity: 0.75,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GALLERY_IMGS[7]} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-0"
            style={{
              width: "70%",
              height: "100%",
              overflow: "hidden",
              borderRadius: ARCH,
              background: "var(--qpi-ink)",
              boxShadow: "0 20px 40px rgba(25,60,90,0.3)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GALLERY_IMGS[0]} alt={IMG_ALT} className="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      </section>
    ),
  },
];
