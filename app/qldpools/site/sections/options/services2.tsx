import { SERVICES_INTRO, SERVICES, PROCESS, GALLERY_IMGS, type Section } from "../kit";

/**
 * Services / "Complete Pool Solutions" — batch 2, the "go crazy" set.
 * Finbar already has a safe 25-option set (./services.tsx). This is a second,
 * wilder batch: 20 options that lean hard into the arch motif, unusual
 * compositions (fans, colonnades, ribbons, dials, ledgers-as-monuments) while
 * staying inside one 100vh viewport, vertically centred, white ground with
 * real breathing room top and bottom. All nine SERVICES appear in every
 * option (some titles-only where the composition demands restraint) — no
 * copy invented, nothing beyond SERVICES_INTRO / SERVICES / PROCESS /
 * GALLERY_IMGS.
 */
export const optionsServices2: Section[] = [
  // 1 · Arch Colonnade — nine tall arch-topped "columns" in a single row,
  // titles only, reading like the pillars of a poolside pavilion.
  {
    name: "Arch Colonnade",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-8 md:mb-10">
            <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.18em" }}>
              {SERVICES_INTRO.kicker}
            </p>
            <h2 className="mt-2" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.375rem, 2.8vw, 2.125rem)", lineHeight: 1.1 }}>
              {SERVICES_INTRO.heading}
            </h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-9 gap-2.5 md:gap-3 items-end">
            {SERVICES.map((s) => (
              <div key={s.title} className="flex flex-col items-center text-center">
                <div
                  aria-hidden="true"
                  style={{
                    width: "100%",
                    height: 64,
                    background: "rgba(25,60,90,0.07)",
                    borderTop: "1.5px solid var(--qpi-blue)",
                    borderLeft: "1.5px solid var(--qpi-blue)",
                    borderRight: "1.5px solid var(--qpi-blue)",
                    borderRadius: "9999px 9999px 0 0",
                  }}
                />
                <p className="mt-2.5" style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: 10.5, lineHeight: 1.3 }}>
                  {s.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 2 · Contents Page — dotted leaders like a book's table of contents,
  // service titles left, dotted rule, index number right.
  {
    name: "Contents Page",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-2xl mx-auto w-full">
          <p className="qpi-caps mb-1" style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.18em" }}>
            {SERVICES_INTRO.kicker}
          </p>
          <h2 className="mb-8" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.1 }}>
            {SERVICES_INTRO.heading}
          </h2>
          <div className="flex flex-col">
            {SERVICES.map((s, i) => (
              <div key={s.title} className="flex items-baseline gap-3 py-2">
                <span style={{ color: "var(--qpi-ink)", fontWeight: 600, fontSize: 13.5, whiteSpace: "nowrap" }}>{s.title}</span>
                <span
                  aria-hidden="true"
                  style={{ flex: 1, borderBottom: "1.5px dotted rgba(25,60,90,0.35)", height: 0, transform: "translateY(-3px)" }}
                />
                <span className="tabular-nums" style={{ color: "var(--qpi-blue)", fontSize: 12, fontWeight: 700 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 3 · Marquee Bleed — services bleeding off both edges of the section on
  // a single line, oversized type, no wrap, overflow clipped.
  {
    name: "Marquee Bleed",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20 overflow-hidden">
        <div className="text-center mb-10 md:mb-12">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.18em" }}>
            {SERVICES_INTRO.kicker}
          </p>
          <h2 className="mt-2" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem, 3.2vw, 2.5rem)", lineHeight: 1.1 }}>
            {SERVICES_INTRO.heading}
          </h2>
        </div>
        <div
          className="w-full whitespace-nowrap overflow-hidden"
          style={{ maskImage: "linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%)" }}
        >
          <div style={{ marginLeft: "-4vw", marginRight: "-4vw" }}>
            <p style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "clamp(1.5rem, 4.2vw, 3.25rem)", letterSpacing: "-0.01em" }}>
              {SERVICES.map((s) => s.title).join("   •   ")}
            </p>
          </div>
        </div>
      </section>
    ),
  },

  // 4 · 3x3 Arch Wells — nine arch-topped wells, title + one clamped line
  // of body copy each, tight and disciplined.
  {
    name: "3x3 Arch Wells",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-8">
            <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.18em" }}>
              {SERVICES_INTRO.kicker}
            </p>
            <h2 className="mt-2" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.375rem, 2.6vw, 2rem)", lineHeight: 1.1 }}>
              {SERVICES_INTRO.heading}
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {SERVICES.map((s) => (
              <div key={s.title} className="p-3.5 md:p-4" style={{ background: "rgba(25,60,90,0.05)", borderRadius: "9999px 9999px 6px 6px" }}>
                <p style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: 12.5, lineHeight: 1.25 }}>{s.title}</p>
                <p className="line-clamp-2 mt-1" style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: 10.5, lineHeight: 1.4 }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 5 · Radial Fan — nine services fanned around a central hub, each on a
  // small rotated spoke.
  {
    name: "Radial Fan",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-4xl mx-auto w-full text-center mb-6">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.18em" }}>
            {SERVICES_INTRO.kicker}
          </p>
        </div>
        <div className="relative mx-auto" style={{ width: "min(92vw, 620px)", height: 340 }}>
          <div
            className="absolute flex items-center justify-center text-center"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: 132,
              height: 132,
              borderRadius: "9999px 9999px 0 0",
              background: "var(--qpi-ink)",
              padding: 10,
            }}
          >
            <h2 style={{ color: "#fff", fontSize: 14, lineHeight: 1.15, fontWeight: 700 }}>{SERVICES_INTRO.heading}</h2>
          </div>
          {SERVICES.map((s, i) => {
            const angle = (i / SERVICES.length) * 360 - 90;
            const rad = (angle * Math.PI) / 180;
            const radius = 200;
            const x = Math.cos(rad) * radius;
            const y = Math.sin(rad) * radius;
            return (
              <div
                key={s.title}
                className="absolute text-center"
                style={{
                  left: "50%",
                  top: "50%",
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  width: 110,
                }}
              >
                <div aria-hidden="true" style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--qpi-blue)", margin: "0 auto 6px" }} />
                <p style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: 11, lineHeight: 1.25 }}>{s.title}</p>
              </div>
            );
          })}
        </div>
      </section>
    ),
  },

  // 6 · Poster + Fine Print — the heading fills half the viewport, services
  // reduced to three tiny fine-print columns beneath.
  {
    name: "Poster + Fine Print",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <p className="qpi-caps text-center" style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.2em" }}>
          {SERVICES_INTRO.kicker}
        </p>
        <h2
          className="text-center mx-auto"
          style={{ color: "var(--qpi-ink)", fontSize: "clamp(2.5rem, 8vw, 6rem)", lineHeight: 0.94, letterSpacing: "-0.02em", maxWidth: 900 }}
        >
          {SERVICES_INTRO.heading}
        </h2>
        <div className="max-w-3xl mx-auto w-full mt-8 md:mt-10" style={{ borderTop: "1px solid rgba(25,60,90,0.18)" }}>
          <div className="grid grid-cols-3 gap-x-6 gap-y-2 pt-4">
            {[SERVICES.slice(0, 3), SERVICES.slice(3, 6), SERVICES.slice(6, 9)].map((col, ci) => (
              <div key={ci} className="flex flex-col gap-1.5">
                {col.map((s) => (
                  <p key={s.title} className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: 9.5, letterSpacing: "0.08em" }}>
                    {s.title}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 7 · Stepped Staircase — services cascade down and to the right, each
  // step indented further, evoking a pool's entry steps.
  {
    name: "Stepped Staircase",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-3xl mb-6">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.18em" }}>
            {SERVICES_INTRO.kicker}
          </p>
          <h2 className="mt-2" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.375rem, 2.6vw, 2rem)", lineHeight: 1.1 }}>
            {SERVICES_INTRO.heading}
          </h2>
        </div>
        <div className="max-w-3xl">
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className="flex items-center gap-3 py-1.5"
              style={{ marginLeft: `${i * 3.4}%`, borderBottom: "1px solid rgba(25,60,90,0.15)", maxWidth: 460 }}
            >
              <span className="qpi-caps flex-none" style={{ color: "var(--qpi-blue)", fontSize: 9.5, width: 20 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <p style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: 12.5 }}>{s.title}</p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 8 · Ink Band Reversed — a full-bleed navy band inside the white section,
  // services reversed out in white, generous white space above and below
  // the band itself.
  {
    name: "Ink Band Reversed",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center mb-6 md:mb-8">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.18em" }}>
            {SERVICES_INTRO.kicker}
          </p>
          <h2 className="mt-2" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.375rem, 2.6vw, 2rem)", lineHeight: 1.1 }}>
            {SERVICES_INTRO.heading}
          </h2>
        </div>
        <div className="w-full max-w-5xl mx-auto p-6 md:p-8" style={{ background: "var(--qpi-ink)", borderRadius: "9999px 9999px 24px 24px" }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-4">
            {SERVICES.map((s) => (
              <div key={s.title}>
                <p style={{ color: "#fff", fontWeight: 700, fontSize: 12.5, lineHeight: 1.3 }}>{s.title}</p>
                <p className="line-clamp-1 mt-1" style={{ color: "#fff", opacity: 0.55, fontSize: 10.5, lineHeight: 1.4 }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 9 · Diagonal Ribbon — a slightly rotated ink ribbon cuts across the
  // section carrying all nine services on one line.
  {
    name: "Diagonal Ribbon",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20 overflow-hidden">
        <div className="text-center mb-10 md:mb-12">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.18em" }}>
            {SERVICES_INTRO.kicker}
          </p>
          <h2 className="mt-2" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.1 }}>
            {SERVICES_INTRO.heading}
          </h2>
        </div>
        <div
          className="w-[130%] py-3 md:py-4"
          style={{ marginLeft: "-15%", background: "var(--qpi-ink)", transform: "rotate(-2.5deg)" }}
        >
          <p className="whitespace-nowrap text-center overflow-hidden" style={{ color: "#fff", fontWeight: 700, fontSize: "clamp(0.8125rem, 1.6vw, 1.0625rem)" }}>
            {SERVICES.map((s) => s.title).join("   •   ")}
          </p>
        </div>
      </section>
    ),
  },

  // 10 · Process Spine — the four PROCESS steps form a horizontal spine;
  // the nine services hang beneath it as small alternating tags.
  {
    name: "Process Spine",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center mb-10 md:mb-12">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.18em" }}>
            {SERVICES_INTRO.kicker}
          </p>
          <h2 className="mt-2" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.375rem, 2.6vw, 2rem)", lineHeight: 1.1 }}>
            {SERVICES_INTRO.heading}
          </h2>
        </div>
        <div className="relative max-w-4xl mx-auto w-full">
          <div className="absolute left-0 right-0" style={{ top: 5, height: 1.5, background: "var(--qpi-blue)", opacity: 0.4 }} aria-hidden="true" />
          <div className="grid grid-cols-4 gap-2 mb-10">
            {PROCESS.map((p) => (
              <div key={p.step} className="text-center">
                <div className="mx-auto" style={{ width: 11, height: 11, borderRadius: "50%", background: "var(--qpi-blue)" }} />
                <p className="mt-2" style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: 11 }}>{p.title}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {SERVICES.map((s, i) => (
              <span
                key={s.title}
                className="qpi-caps"
                style={{
                  color: "var(--qpi-ink)",
                  fontSize: 9.5,
                  letterSpacing: "0.08em",
                  border: "1px solid rgba(25,60,90,0.3)",
                  borderRadius: 999,
                  padding: "5px 11px",
                  transform: i % 2 === 0 ? "translateY(-2px)" : "translateY(2px)",
                }}
              >
                {s.title}
              </span>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 11 · Menu Card — a restaurant-menu treatment: dotted leaders, service
  // "dishes" numbered, kicker doubling as a menu header rule.
  {
    name: "Menu Card",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-xl mx-auto w-full">
          <div className="text-center mb-6" style={{ borderBottom: "1px solid var(--qpi-ink)", paddingBottom: 12 }}>
            <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.2em" }}>
              {SERVICES_INTRO.kicker}
            </p>
            <h2 className="mt-1" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.25rem, 2.4vw, 1.75rem)", lineHeight: 1.1 }}>
              {SERVICES_INTRO.heading}
            </h2>
          </div>
          <div className="flex flex-col gap-2.5">
            {SERVICES.map((s, i) => (
              <div key={s.title}>
                <div className="flex items-baseline gap-2">
                  <span style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: 12.5 }}>{s.title}</span>
                  <span aria-hidden="true" style={{ flex: 1, borderBottom: "1px dotted rgba(25,60,90,0.35)", transform: "translateY(-3px)" }} />
                  <span className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 9.5 }}>{String(i + 1).padStart(2, "0")}</span>
                </div>
                <p className="line-clamp-1" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 10, lineHeight: 1.4 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 12 · Photo Captions — a single project photo, nine service captions
  // scattered over it as small pill chips.
  {
    name: "Photo Captions",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-6xl mx-auto w-full">
          <div className="mb-5 text-center">
            <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.18em" }}>
              {SERVICES_INTRO.kicker}
            </p>
            <h2 className="mt-2" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.375rem, 2.6vw, 2rem)", lineHeight: 1.1 }}>
              {SERVICES_INTRO.heading}
            </h2>
          </div>
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: "20 / 8", borderRadius: "9999px 9999px 12px 12px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GALLERY_IMGS[0]} alt="A pool installed by QLD Pool Installs" className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0" style={{ background: "rgba(25,60,90,0.42)" }} aria-hidden="true" />
            <div className="absolute inset-0 flex flex-wrap content-center justify-center gap-2 p-6 md:p-10">
              {SERVICES.map((s) => (
                <span
                  key={s.title}
                  className="qpi-caps"
                  style={{
                    color: "var(--qpi-ink)",
                    background: "#fff",
                    fontSize: 9.5,
                    letterSpacing: "0.07em",
                    borderRadius: 999,
                    padding: "6px 12px",
                  }}
                >
                  {s.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    ),
  },

  // 13 · Orbit Hub — services as small labelled dots orbiting a heading hub,
  // laid out on a wide horizontal band rather than a full circle.
  {
    name: "Orbit Band",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-6xl mx-auto w-full">
          <div className="relative flex items-center" style={{ minHeight: 260 }}>
            <div className="absolute left-0 right-0" style={{ top: "50%", height: 1, background: "rgba(25,60,90,0.2)" }} aria-hidden="true" />
            <div
              className="relative flex-none flex flex-col items-center justify-center text-center mx-auto"
              style={{ width: 148, height: 148, borderRadius: "9999px 9999px 0 0", background: "var(--qpi-ink)", padding: 12 }}
            >
              <p className="qpi-caps" style={{ color: "var(--qpi-aqua)", fontSize: 9, letterSpacing: "0.16em" }}>{SERVICES_INTRO.kicker}</p>
              <h2 className="mt-1" style={{ color: "#fff", fontSize: 13.5, lineHeight: 1.2 }}>{SERVICES_INTRO.heading}</h2>
            </div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-9 gap-3 mt-6">
            {SERVICES.map((s, i) => (
              <div key={s.title} className="relative text-center">
                <div
                  aria-hidden="true"
                  className="mx-auto mb-2"
                  style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--qpi-blue)", transform: i % 2 === 0 ? "translateY(-4px)" : "translateY(4px)" }}
                />
                <p style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: 10.5, lineHeight: 1.3 }}>{s.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 14 · Diagonal Split — an ink wedge (clip-path) holds the heading, white
  // remainder holds a tight services grid.
  {
    name: "Diagonal Split",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-6 md:gap-10 items-center">
          <div
            className="relative flex flex-col justify-center p-6 md:p-8"
            style={{ background: "var(--qpi-ink)", clipPath: "polygon(0 0, 100% 0, 88% 100%, 0% 100%)", minHeight: 220 }}
          >
            <p className="qpi-caps" style={{ color: "var(--qpi-aqua)", fontSize: 10, letterSpacing: "0.16em" }}>
              {SERVICES_INTRO.kicker}
            </p>
            <h2 className="mt-2" style={{ color: "#fff", fontSize: "clamp(1.25rem, 2.2vw, 1.75rem)", lineHeight: 1.15 }}>
              {SERVICES_INTRO.heading}
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-x-5 gap-y-3.5">
            {SERVICES.map((s) => (
              <div key={s.title}>
                <p style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: 11.5, lineHeight: 1.3 }}>{s.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 15 · Blueprint Callouts — a dotted-grid backdrop with services set as
  // numbered technical-drawing callouts.
  {
    name: "Blueprint Callouts",
    node: (
      <section
        className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20"
        style={{ backgroundImage: "radial-gradient(rgba(25,60,90,0.14) 1px, transparent 1px)", backgroundSize: "18px 18px" }}
      >
        <div className="max-w-5xl mx-auto w-full">
          <div className="mb-8 flex items-baseline justify-between gap-4 flex-wrap">
            <h2 style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.375rem, 2.6vw, 2rem)", lineHeight: 1.1 }}>
              {SERVICES_INTRO.heading}
            </h2>
            <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.18em" }}>
              {SERVICES_INTRO.kicker}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-x-6 gap-y-4" style={{ background: "#fff" }}>
            {SERVICES.map((s, i) => (
              <div key={s.title} className="flex items-start gap-2">
                <span
                  className="qpi-caps flex-none"
                  style={{ color: "var(--qpi-blue)", fontSize: 9.5, border: "1px solid var(--qpi-blue)", borderRadius: "9999px 9999px 2px 2px", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  {i + 1}
                </span>
                <p style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: 11.5, lineHeight: 1.3, paddingTop: 2 }}>{s.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 16 · Wave Baseline — service titles ride an undulating baseline for a
  // playful, water-like rhythm.
  {
    name: "Wave Baseline",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center mb-10 md:mb-12">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.18em" }}>
            {SERVICES_INTRO.kicker}
          </p>
          <h2 className="mt-2" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.375rem, 2.6vw, 2rem)", lineHeight: 1.1 }}>
            {SERVICES_INTRO.heading}
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-6 max-w-4xl mx-auto">
          {SERVICES.map((s, i) => {
            const lift = Math.round(Math.sin((i / SERVICES.length) * Math.PI * 2) * 14);
            return (
              <p
                key={s.title}
                style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "clamp(0.9375rem, 1.6vw, 1.25rem)", transform: `translateY(${lift}px)` }}
              >
                {s.title}
              </p>
            );
          })}
        </div>
      </section>
    ),
  },

  // 17 · Compact Tabs — nine <details> summaries in a single tight row,
  // arch-topped tabs; the first is open by default to demonstrate the
  // interaction while everything still reads statically.
  {
    name: "Compact Arch Tabs",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center mb-6">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.18em" }}>
            {SERVICES_INTRO.kicker}
          </p>
          <h2 className="mt-2" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.375rem, 2.6vw, 2rem)", lineHeight: 1.1 }}>
            {SERVICES_INTRO.heading}
          </h2>
        </div>
        <div className="max-w-6xl mx-auto w-full grid grid-cols-3 sm:grid-cols-9 gap-2">
          {SERVICES.map((s, i) => (
            <details key={s.title} open={i === 0} style={{ background: "rgba(25,60,90,0.05)", borderRadius: "9999px 9999px 6px 6px" }}>
              <summary
                className="cursor-pointer text-center"
                style={{ listStyle: "none", padding: "10px 6px 8px", color: "var(--qpi-ink)", fontWeight: 700, fontSize: 10 }}
              >
                {s.title}
              </summary>
              <p className="line-clamp-3 px-2 pb-3" style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: 9, lineHeight: 1.35 }}>
                {s.body}
              </p>
            </details>
          ))}
        </div>
      </section>
    ),
  },

  // 18 · Ticket Stubs — nine perforated "ticket" shapes in an overlapping
  // row, arch top, dashed tear-line, service title as the ticket's name.
  {
    name: "Ticket Stubs",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.18em" }}>
            {SERVICES_INTRO.kicker}
          </p>
          <h2 className="mt-2" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.375rem, 2.6vw, 2rem)", lineHeight: 1.1 }}>
            {SERVICES_INTRO.heading}
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-3 max-w-6xl mx-auto">
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className="flex flex-col items-center text-center"
              style={{ width: 128, border: "1.5px solid var(--qpi-ink)", borderRadius: "9999px 9999px 6px 6px", overflow: "hidden" }}
            >
              <div className="w-full" style={{ padding: "10px 8px 6px", background: "rgba(25,60,90,0.06)" }}>
                <span className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 8.5 }}>{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="w-full" style={{ borderTop: "1.5px dashed rgba(25,60,90,0.4)" }} />
              <p className="px-2 py-2.5" style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: 10.5, lineHeight: 1.3 }}>{s.title}</p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 19 · Compass Dial — services set around a circular ink ring like
  // compass points, heading in the centre.
  {
    name: "Compass Dial",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="relative mx-auto" style={{ width: "min(90vw, 560px)", height: "min(90vw, 560px)", maxHeight: 560 }}>
          <div
            className="absolute inset-0 rounded-full"
            style={{ border: "1.5px solid rgba(25,60,90,0.25)" }}
            aria-hidden="true"
          />
          <div
            className="absolute flex flex-col items-center justify-center text-center"
            style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: 168, textAlign: "center" }}
          >
            <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 9.5, letterSpacing: "0.16em" }}>{SERVICES_INTRO.kicker}</p>
            <h2 className="mt-2" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.125rem, 2vw, 1.5rem)", lineHeight: 1.1 }}>
              {SERVICES_INTRO.heading}
            </h2>
          </div>
          {SERVICES.map((s, i) => {
            const angle = (i / SERVICES.length) * 360 - 90;
            const rad = (angle * Math.PI) / 180;
            const radius = 46; // percent
            const x = 50 + Math.cos(rad) * radius;
            const y = 50 + Math.sin(rad) * radius;
            return (
              <div
                key={s.title}
                className="absolute text-center"
                style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)", width: 96 }}
              >
                <p style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: 10, lineHeight: 1.25 }}>{s.title}</p>
              </div>
            );
          })}
        </div>
      </section>
    ),
  },

  // 20 · Layered Depth Cards — three overlapping, gently staggered panels
  // of three services each, evoking pool decking laid in courses.
  {
    name: "Layered Depth Cards",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-3xl mb-8">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.18em" }}>
            {SERVICES_INTRO.kicker}
          </p>
          <h2 className="mt-2" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.375rem, 2.6vw, 2rem)", lineHeight: 1.1 }}>
            {SERVICES_INTRO.heading}
          </h2>
        </div>
        <div className="relative max-w-5xl">
          {[SERVICES.slice(0, 3), SERVICES.slice(3, 6), SERVICES.slice(6, 9)].map((row, ri) => (
            <div
              key={ri}
              className="grid grid-cols-3 gap-4 p-4 md:p-5 mb-2"
              style={{
                background: ri % 2 === 0 ? "rgba(25,60,90,0.05)" : "#fff",
                border: "1px solid rgba(25,60,90,0.15)",
                borderRadius: 8,
                marginLeft: ri * 20,
                width: `calc(100% - ${ri * 20}px)`,
              }}
            >
              {row.map((s) => (
                <div key={s.title}>
                  <p style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: 11.5, lineHeight: 1.3 }}>{s.title}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    ),
  },
];
