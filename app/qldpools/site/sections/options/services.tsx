import { SERVICES_INTRO, SERVICES, PROCESS, GALLERY_IMGS, PHONE, PHONE_HREF, type Section } from "../kit";

/**
 * Services / "Complete Pool Solutions" — 25 distinct design directions for
 * the what-we-offer block. Each entry is a standalone in-page section (no
 * hero sizing, no client hooks) built only from SERVICES_INTRO, SERVICES,
 * PROCESS, GALLERY_IMGS, PHONE and PHONE_HREF.
 */
export const optionsServices: Section[] = [
  // 1 · Clean 3x3 grid, hairline top rule per cell, kicker+heading left-aligned above
  {
    name: "Clean 3x3 Grid",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-3xl mb-16">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {SERVICES_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-4"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05 }}
          >
            {SERVICES_INTRO.heading}
          </h2>
          <p className="text-pretty mt-5" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "clamp(0.9375rem, 1.3vw, 1.0625rem)", lineHeight: 1.65, maxWidth: 620 }}>
            {SERVICES_INTRO.sub}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-12">
          {SERVICES.map((s) => (
            <div key={s.title}>
              <div style={{ height: 1, background: "var(--qpi-ink)", opacity: 0.15, marginBottom: 20 }} />
              <h3 style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1.0625rem" }}>{s.title}</h3>
              <p className="text-pretty mt-3" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.6 }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 2 · Two-column: heading block left, services list right with divider rules
  {
    name: "Heading Left, List Right",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-12 md:gap-20">
          <div>
            <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
              {SERVICES_INTRO.kicker}
            </p>
            <h2
              className="qpi-display text-balance mt-5"
              style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 3.6vw, 2.875rem)", lineHeight: 1.05 }}
            >
              {SERVICES_INTRO.heading}
            </h2>
            <p className="text-pretty mt-5" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.65, maxWidth: 380 }}>
              {SERVICES_INTRO.sub}
            </p>
          </div>
          <div>
            {SERVICES.map((s, i) => (
              <div
                key={s.title}
                className="flex items-start gap-6 py-6"
                style={{ borderTop: i === 0 ? "1px solid rgba(11,42,74,0.15)" : undefined, borderBottom: "1px solid rgba(11,42,74,0.15)" }}
              >
                <span className="qpi-caps flex-shrink-0" style={{ color: "var(--qpi-blue)", fontSize: 11, paddingTop: 3 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1.0625rem" }}>{s.title}</h3>
                  <p className="text-pretty mt-2" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.6 }}>
                    {s.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 3 · Numbered ledger, full-width rows, generous line height
  {
    name: "Ledger Rows",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {SERVICES_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-4"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05 }}
          >
            {SERVICES_INTRO.heading}
          </h2>
        </div>
        <div className="max-w-4xl mx-auto">
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-10 py-8"
              style={{ borderBottom: "1px solid rgba(11,42,74,0.15)" }}
            >
              <span
                className="qpi-caps flex-shrink-0"
                style={{ color: "var(--qpi-ink)", opacity: 0.3, fontSize: 12, width: 44 }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1.25rem", flexShrink: 0, width: 220 }}>
                {s.title}
              </h3>
              <p className="text-pretty" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.7 }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 4 · Big-type list: huge titles, small body beside
  {
    name: "Big-Type List",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <p className="qpi-caps text-center mb-3" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
          {SERVICES_INTRO.kicker}
        </p>
        <h2
          className="qpi-display text-balance text-center mb-16"
          style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05 }}
        >
          {SERVICES_INTRO.heading}
        </h2>
        <div className="max-w-5xl mx-auto">
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className="flex flex-col md:flex-row md:items-center justify-between gap-3 py-7"
              style={{ borderTop: i === 0 ? "1px solid var(--qpi-ink)" : undefined, borderBottom: "1px solid rgba(11,42,74,0.2)" }}
            >
              <h3
                className="qpi-display"
                style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem, 3vw, 2.375rem)", lineHeight: 1 }}
              >
                {s.title}
              </h3>
              <p className="text-pretty" style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: "0.875rem", lineHeight: 1.6, maxWidth: 360 }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 5 · Alternating rows, title left / body right, thin rule between
  {
    name: "Alternating Rows",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-3xl mb-16">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {SERVICES_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-4"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05 }}
          >
            {SERVICES_INTRO.heading}
          </h2>
        </div>
        <div className="max-w-4xl">
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-2 md:gap-10 py-7"
              style={{
                borderTop: i === 0 ? "1px solid rgba(11,42,74,0.2)" : undefined,
                borderBottom: "1px solid rgba(11,42,74,0.2)",
                flexDirection: i % 2 === 1 ? "row-reverse" : "row",
              }}
            >
              <h3
                style={{
                  color: "var(--qpi-ink)",
                  fontWeight: 700,
                  fontSize: "1.125rem",
                  order: i % 2 === 1 ? 2 : 1,
                  textAlign: i % 2 === 1 ? "right" : "left",
                }}
              >
                {s.title}
              </h3>
              <p
                className="text-pretty"
                style={{
                  color: "var(--qpi-ink)",
                  opacity: 0.6,
                  fontSize: "0.9375rem",
                  lineHeight: 1.65,
                  order: i % 2 === 1 ? 1 : 2,
                  textAlign: i % 2 === 1 ? "right" : "left",
                }}
              >
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 6 · Bento grid: first service spans two cells with a photo, rest compact
  {
    name: "Bento With Photo",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-3xl mb-14">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {SERVICES_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-4"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05 }}
          >
            {SERVICES_INTRO.heading}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="sm:col-span-2 lg:col-span-2 lg:row-span-2 overflow-hidden" style={{ border: "1px solid rgba(11,42,74,0.15)" }}>
            <div className="relative aspect-[4/3]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={GALLERY_IMGS[0]} alt="A pool installed by QLD Pool Installs" className="w-full h-full object-cover" />
            </div>
            <div className="p-6">
              <h3 style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1.25rem" }}>{SERVICES[0].title}</h3>
              <p className="text-pretty mt-2" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.6 }}>
                {SERVICES[0].body}
              </p>
            </div>
          </div>
          {SERVICES.slice(1).map((s) => (
            <div key={s.title} className="p-6" style={{ border: "1px solid rgba(11,42,74,0.15)" }}>
              <h3 style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1rem" }}>{s.title}</h3>
              <p className="text-pretty mt-2" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.875rem", lineHeight: 1.55 }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 7 · Card grid, 1px navy borders, generous internal padding
  {
    name: "Bordered Card Grid",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {SERVICES_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-4"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05 }}
          >
            {SERVICES_INTRO.heading}
          </h2>
          <p className="text-pretty mt-5" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.65 }}>
            {SERVICES_INTRO.sub}
          </p>
        </div>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
          style={{ border: "1px solid var(--qpi-ink)", borderCollapse: "collapse" as const }}
        >
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className="p-8"
              style={{
                borderRight: (i + 1) % 3 !== 0 ? "1px solid var(--qpi-ink)" : undefined,
                borderBottom: i < 6 ? "1px solid var(--qpi-ink)" : undefined,
              }}
            >
              <h3 style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1.0625rem" }}>{s.title}</h3>
              <p className="text-pretty mt-3" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.875rem", lineHeight: 1.6 }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 8 · Navy ground, white type, 3x3 grid
  {
    name: "Navy Ground Grid",
    node: (
      <section className="relative w-full py-20 md:py-28 px-6 md:px-14" style={{ background: "var(--qpi-ink)" }}>
        <div className="max-w-3xl mb-16">
          <p className="qpi-caps" style={{ color: "#fff", opacity: 0.55, fontSize: 11 }}>
            {SERVICES_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-4"
            style={{ color: "#fff", fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05 }}
          >
            {SERVICES_INTRO.heading}
          </h2>
          <p className="text-pretty mt-5" style={{ color: "#fff", opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.65, maxWidth: 560 }}>
            {SERVICES_INTRO.sub}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-12">
          {SERVICES.map((s) => (
            <div key={s.title}>
              <div style={{ height: 1, background: "#fff", opacity: 0.25, marginBottom: 20 }} />
              <h3 style={{ color: "#fff", fontWeight: 700, fontSize: "1.0625rem" }}>{s.title}</h3>
              <p className="text-pretty mt-3" style={{ color: "#fff", opacity: 0.55, fontSize: "0.9375rem", lineHeight: 1.6 }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 9 · Photo left half, services list right half
  {
    name: "Photo + List Split",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="relative aspect-[4/5] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GALLERY_IMGS[2]} alt="A pool installed by QLD Pool Installs" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
              {SERVICES_INTRO.kicker}
            </p>
            <h2
              className="qpi-display text-balance mt-4"
              style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", lineHeight: 1.05 }}
            >
              {SERVICES_INTRO.heading}
            </h2>
            <div className="mt-10">
              {SERVICES.map((s, i) => (
                <div key={s.title} className="py-5" style={{ borderBottom: i < SERVICES.length - 1 ? "1px solid rgba(11,42,74,0.15)" : undefined }}>
                  <h3 style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1rem" }}>{s.title}</h3>
                  <p className="text-pretty mt-2" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.875rem", lineHeight: 1.6 }}>
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    ),
  },

  // 10 · Three columns of three, each headed by a qpi-caps label
  {
    name: "Three Labelled Columns",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {SERVICES_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-4"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05 }}
          >
            {SERVICES_INTRO.heading}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {["Design & Build", "Finish & Colour", "Care & Support"].map((label, col) => (
            <div key={label}>
              <p className="qpi-caps mb-6" style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.18em" }}>
                {label}
              </p>
              {SERVICES.slice(col * 3, col * 3 + 3).map((s) => (
                <div key={s.title} className="mb-8">
                  <h3 style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1rem" }}>{s.title}</h3>
                  <p className="text-pretty mt-2" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.875rem", lineHeight: 1.6 }}>
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 11 · Minimal index: titles only in a wide column, numbers in blue
  {
    name: "Minimal Index",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-xl">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {SERVICES_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-4 mb-16"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05 }}
          >
            {SERVICES_INTRO.heading}
          </h2>
          {SERVICES.map((s, i) => (
            <div key={s.title} className="flex items-baseline gap-6 py-4" style={{ borderTop: "1px solid rgba(11,42,74,0.12)" }}>
              <span className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 12, width: 32, flexShrink: 0 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1.375rem" }}>{s.title}</h3>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 12 · PROCESS as horizontal timeline, services as compact grid beneath
  {
    name: "Process Timeline + Grid",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {SERVICES_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-4"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05 }}
          >
            {SERVICES_INTRO.heading}
          </h2>
        </div>
        <div className="max-w-5xl mx-auto mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative">
            <div
              className="hidden md:block absolute"
              style={{ top: 14, left: "12.5%", right: "12.5%", height: 1, background: "rgba(11,42,74,0.2)" }}
            />
            {PROCESS.map((p) => (
              <div key={p.step} className="relative text-center">
                <div
                  className="mx-auto mb-4"
                  style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--qpi-blue)", position: "relative" }}
                />
                <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>{p.step}</p>
                <h3 className="mt-2" style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1rem" }}>{p.title}</h3>
                <p className="text-pretty mt-1" style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: "0.8125rem", lineHeight: 1.5 }}>
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-9 gap-3 max-w-5xl mx-auto">
          {SERVICES.map((s) => (
            <div key={s.title} className="p-3 text-center" style={{ border: "1px solid rgba(11,42,74,0.15)" }}>
              <p style={{ color: "var(--qpi-ink)", fontWeight: 600, fontSize: "0.75rem", lineHeight: 1.35 }}>{s.title}</p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 13 · PROCESS as big stacked numbered steps, services listed small at the side
  {
    name: "Stacked Process + Side List",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-16">
          <div>
            <p className="qpi-caps mb-10" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
              Our Process
            </p>
            {PROCESS.map((p) => (
              <div key={p.step} className="flex items-start gap-6 mb-10">
                <span
                  className="qpi-display flex-shrink-0"
                  style={{ color: "var(--qpi-ink)", opacity: 0.15, fontSize: "clamp(2.5rem, 5vw, 4rem)", lineHeight: 1 }}
                >
                  {p.step}
                </span>
                <div className="pt-2">
                  <h3 style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1.25rem" }}>{p.title}</h3>
                  <p className="text-pretty mt-1" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.6 }}>
                    {p.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div>
            <h2
              className="qpi-display text-balance mb-8"
              style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem, 2.6vw, 2rem)", lineHeight: 1.1 }}
            >
              {SERVICES_INTRO.heading}
            </h2>
            {SERVICES.map((s, i) => (
              <div key={s.title} className="py-3" style={{ borderTop: i === 0 ? "1px solid rgba(11,42,74,0.15)" : undefined, borderBottom: "1px solid rgba(11,42,74,0.15)" }}>
                <p style={{ color: "var(--qpi-ink)", fontWeight: 600, fontSize: "0.875rem" }}>{s.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 14 · Editorial: heading spanning top, services as newspaper columns
  {
    name: "Newspaper Columns",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <h2
          className="qpi-display text-balance mb-3"
          style={{ color: "var(--qpi-ink)", fontSize: "clamp(2.25rem, 5.5vw, 4.5rem)", lineHeight: 0.95, maxWidth: 900 }}
        >
          {SERVICES_INTRO.heading}
        </h2>
        <p className="text-pretty mb-16" style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: "1rem", lineHeight: 1.6, maxWidth: 620 }}>
          {SERVICES_INTRO.sub}
        </p>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-10" style={{ columnRuleWidth: 1, columnRuleStyle: "solid", columnRuleColor: "rgba(11,42,74,0.15)" }}>
          {SERVICES.map((s) => (
            <div key={s.title} className="mb-8 break-inside-avoid">
              <h3 style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1rem" }}>{s.title}</h3>
              <p className="text-pretty mt-2" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.875rem", lineHeight: 1.6 }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 15 · Services as <details> disclosures, title as summary
  {
    name: "Disclosure Accordion",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {SERVICES_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-4"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05 }}
          >
            {SERVICES_INTRO.heading}
          </h2>
        </div>
        <div className="max-w-3xl mx-auto">
          {SERVICES.map((s, i) => (
            <details key={s.title} style={{ borderTop: i === 0 ? "1px solid var(--qpi-ink)" : undefined, borderBottom: "1px solid var(--qpi-ink)" }}>
              <summary
                className="flex items-center justify-between gap-6 py-6 cursor-pointer"
                style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1.0625rem", listStyle: "none" }}
              >
                <span className="flex items-center gap-6">
                  <span className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.title}
                </span>
                <span aria-hidden="true" style={{ color: "var(--qpi-blue)", fontSize: 20, lineHeight: 1 }}>+</span>
              </summary>
              <p className="text-pretty pb-6" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.65, paddingLeft: 40 }}>
                {s.body}
              </p>
            </details>
          ))}
        </div>
      </section>
    ),
  },

  // 16 · Blue accent: alternating titles in brand blue
  {
    name: "Alternating Blue Titles",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-3xl mb-16">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {SERVICES_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-4"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05 }}
          >
            {SERVICES_INTRO.heading}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-14">
          {SERVICES.map((s, i) => (
            <div key={s.title}>
              <h3 style={{ color: i % 2 === 0 ? "var(--qpi-blue)" : "var(--qpi-ink)", fontWeight: 700, fontSize: "1.125rem" }}>
                {s.title}
              </h3>
              <p className="text-pretty mt-3" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.6 }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 17 · Wide table/ledger with right-aligned index number
  {
    name: "Ledger Table",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
              {SERVICES_INTRO.kicker}
            </p>
            <h2
              className="qpi-display text-balance mt-4"
              style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05 }}
            >
              {SERVICES_INTRO.heading}
            </h2>
          </div>
          <p style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: "0.8125rem" }}>{SERVICES.length} services</p>
        </div>
        <div className="max-w-5xl">
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className="flex items-center justify-between gap-6 py-5"
              style={{ borderTop: i === 0 ? "1px solid var(--qpi-ink)" : undefined, borderBottom: "1px solid rgba(11,42,74,0.2)" }}
            >
              <div className="flex-1">
                <h3 style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1rem" }}>{s.title}</h3>
                <p className="text-pretty mt-1 hidden sm:block" style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: "0.8125rem", lineHeight: 1.5, maxWidth: 480 }}>
                  {s.body}
                </p>
              </div>
              <span className="qpi-caps flex-shrink-0" style={{ color: "var(--qpi-ink)", opacity: 0.35, fontSize: 12 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 18 · Feature row: 3 hero services large with photo each, remaining 6 as text list
  {
    name: "Featured Trio + List",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-3xl mb-16">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {SERVICES_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-4"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05 }}
          >
            {SERVICES_INTRO.heading}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {SERVICES.slice(0, 3).map((s, i) => (
            <div key={s.title}>
              <div className="relative aspect-[4/3] overflow-hidden mb-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={GALLERY_IMGS[i]} alt="A pool installed by QLD Pool Installs" className="w-full h-full object-cover" />
              </div>
              <h3 style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1.125rem" }}>{s.title}</h3>
              <p className="text-pretty mt-2" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.6 }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-6 pt-10" style={{ borderTop: "1px solid rgba(11,42,74,0.15)" }}>
          {SERVICES.slice(3).map((s) => (
            <div key={s.title} className="flex items-start gap-3">
              <span style={{ color: "var(--qpi-blue)", flexShrink: 0, marginTop: 6 }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <circle cx="5" cy="5" r="4" stroke="currentColor" />
                </svg>
              </span>
              <p style={{ color: "var(--qpi-ink)", fontWeight: 600, fontSize: "0.9375rem" }}>{s.title}</p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 19 · Off-grid: services staggered with varying indents
  {
    name: "Staggered Rhythm",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-3xl mb-16">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {SERVICES_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-4"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05 }}
          >
            {SERVICES_INTRO.heading}
          </h2>
        </div>
        <div className="max-w-3xl">
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className="py-6"
              style={{
                marginLeft: `${(i % 3) * 6}%`,
                borderBottom: "1px solid rgba(11,42,74,0.15)",
                maxWidth: 560,
              }}
            >
              <div className="flex items-baseline gap-4">
                <span className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1.0625rem" }}>{s.title}</h3>
              </div>
              <p className="text-pretty mt-2" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.875rem", lineHeight: 1.6, paddingLeft: 32 }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 20 · Compact: two columns, tight rows, hairlines, small type, very restrained
  {
    name: "Compact Two-Column",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-10">
            <h2 style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1.375rem" }}>{SERVICES_INTRO.heading}</h2>
            <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>
              {SERVICES_INTRO.kicker}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12">
            {[SERVICES.slice(0, 5), SERVICES.slice(5)].map((col, ci) => (
              <div key={ci}>
                {col.map((s) => (
                  <div key={s.title} className="flex items-center justify-between gap-4 py-3" style={{ borderBottom: "1px solid rgba(11,42,74,0.12)" }}>
                    <span style={{ color: "var(--qpi-ink)", fontWeight: 600, fontSize: "0.8125rem" }}>{s.title}</span>
                    <span aria-hidden="true" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>&rarr;</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 21 · Photo band across the top, services grid below on white
  {
    name: "Photo Band + Grid",
    node: (
      <section className="relative w-full bg-white pb-20 md:pb-28">
        <div className="relative w-full" style={{ aspectRatio: "16/5" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={GALLERY_IMGS[4]} alt="A pool installed by QLD Pool Installs" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "rgba(11,42,74,0.35)" }} />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <p className="qpi-caps" style={{ color: "#fff", opacity: 0.85, fontSize: 11 }}>
              {SERVICES_INTRO.kicker}
            </p>
            <h2
              className="qpi-display text-balance mt-3"
              style={{ color: "#fff", fontSize: "clamp(1.5rem, 4vw, 2.75rem)", lineHeight: 1.05 }}
            >
              {SERVICES_INTRO.heading}
            </h2>
          </div>
        </div>
        <div className="pt-16 px-6 md:px-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-12 max-w-6xl mx-auto">
          {SERVICES.map((s) => (
            <div key={s.title}>
              <h3 style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1.0625rem" }}>{s.title}</h3>
              <p className="text-pretty mt-3" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.6 }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 22 · Heading centred, services centred 3-up with vertical dividers
  {
    name: "Centred Vertical Dividers",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {SERVICES_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-4"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05 }}
          >
            {SERVICES_INTRO.heading}
          </h2>
          <p className="text-pretty mt-5" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.65 }}>
            {SERVICES_INTRO.sub}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 max-w-5xl mx-auto">
          {SERVICES.slice(0, 3).map((s, i) => (
            <div
              key={s.title}
              className="text-center px-8 py-6"
              style={{ borderLeft: i > 0 ? "1px solid rgba(11,42,74,0.15)" : undefined }}
            >
              <h3 style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1.0625rem" }}>{s.title}</h3>
              <p className="text-pretty mt-3" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.875rem", lineHeight: 1.6 }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 max-w-5xl mx-auto" style={{ borderTop: "1px solid rgba(11,42,74,0.15)" }}>
          {SERVICES.slice(3, 6).map((s, i) => (
            <div
              key={s.title}
              className="text-center px-8 py-6"
              style={{ borderLeft: i > 0 ? "1px solid rgba(11,42,74,0.15)" : undefined }}
            >
              <h3 style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1.0625rem" }}>{s.title}</h3>
              <p className="text-pretty mt-3" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.875rem", lineHeight: 1.6 }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 max-w-5xl mx-auto" style={{ borderTop: "1px solid rgba(11,42,74,0.15)" }}>
          {SERVICES.slice(6, 9).map((s, i) => (
            <div
              key={s.title}
              className="text-center px-8 py-6"
              style={{ borderLeft: i > 0 ? "1px solid rgba(11,42,74,0.15)" : undefined }}
            >
              <h3 style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1.0625rem" }}>{s.title}</h3>
              <p className="text-pretty mt-3" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.875rem", lineHeight: 1.6 }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 23 · Serif-free poster: kicker huge, heading huge, services tiny in 3 rows
  {
    name: "Poster + Tiny Rows",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14 text-center">
        <p
          className="qpi-caps"
          style={{ color: "var(--qpi-blue)", fontSize: "clamp(0.75rem, 1.4vw, 1rem)", letterSpacing: "0.24em" }}
        >
          {SERVICES_INTRO.kicker}
        </p>
        <h2
          className="qpi-display text-balance mt-6 mb-20"
          style={{ color: "var(--qpi-ink)", fontSize: "clamp(2.75rem, 8vw, 6.5rem)", lineHeight: 0.92, letterSpacing: "-0.02em" }}
        >
          {SERVICES_INTRO.heading}
        </h2>
        <div className="max-w-4xl mx-auto">
          {[SERVICES.slice(0, 3), SERVICES.slice(3, 6), SERVICES.slice(6, 9)].map((row, ri) => (
            <div key={ri} className="flex flex-wrap justify-center gap-x-10 gap-y-3 py-4" style={{ borderTop: ri === 0 ? "1px solid rgba(11,42,74,0.15)" : undefined, borderBottom: "1px solid rgba(11,42,74,0.15)" }}>
              {row.map((s) => (
                <span key={s.title} className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: 11 }}>
                  {s.title}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 24 · Split navy/white: heading on navy block left, services on white right
  {
    name: "Split Navy Panel",
    node: (
      <section className="relative w-full bg-white flex flex-col md:flex-row">
        <div
          className="md:w-2/5 flex flex-col justify-center py-16 md:py-28 px-6 md:px-14"
          style={{ background: "var(--qpi-ink)" }}
        >
          <p className="qpi-caps" style={{ color: "#fff", opacity: 0.55, fontSize: 11 }}>
            {SERVICES_INTRO.kicker}
          </p>
          <h2
            className="qpi-display text-balance mt-5"
            style={{ color: "#fff", fontSize: "clamp(1.875rem, 3.4vw, 2.75rem)", lineHeight: 1.05 }}
          >
            {SERVICES_INTRO.heading}
          </h2>
          <p className="text-pretty mt-5" style={{ color: "#fff", opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.65, maxWidth: 360 }}>
            {SERVICES_INTRO.sub}
          </p>
          <a
            href={PHONE_HREF}
            className="qpi-caps mt-10 inline-block w-fit"
            style={{ color: "#fff", fontSize: 12, letterSpacing: "0.14em", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.4)", paddingBottom: 4 }}
          >
            {PHONE}
          </a>
        </div>
        <div className="md:w-3/5 py-16 md:py-28 px-6 md:px-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-10">
            {SERVICES.map((s) => (
              <div key={s.title}>
                <h3 style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1rem" }}>{s.title}</h3>
                <p className="text-pretty mt-2" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.875rem", lineHeight: 1.6 }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 25 · Full-bleed navy with a white inner card holding the grid
  {
    name: "Navy Full-Bleed, White Card",
    node: (
      <section className="relative w-full py-20 md:py-28 px-6 md:px-14" style={{ background: "var(--qpi-ink)" }}>
        <div className="max-w-6xl mx-auto bg-white p-8 sm:p-12 md:p-16">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
              {SERVICES_INTRO.kicker}
            </p>
            <h2
              className="qpi-display text-balance mt-4"
              style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)", lineHeight: 1.05 }}
            >
              {SERVICES_INTRO.heading}
            </h2>
            <p className="text-pretty mt-5" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.65 }}>
              {SERVICES_INTRO.sub}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-10">
            {SERVICES.map((s, i) => (
              <div key={s.title}>
                <span className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2" style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1rem" }}>{s.title}</h3>
                <p className="text-pretty mt-2" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.875rem", lineHeight: 1.6 }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },
];
