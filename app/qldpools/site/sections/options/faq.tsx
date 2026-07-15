import { FAQ_INTRO, FAQS, PHONE, PHONE_HREF, GALLERY_IMGS, type Section } from "../kit";

/**
 * FAQ / "Frequently Asked Questions" — 25 distinct design directions for
 * the closing objection-handling block. Every question and answer is
 * verbatim from FAQS; no copy is invented beyond structural glyphs (row
 * numbers, "Q."/"A." labels) and the literal "Still have questions?" prompt
 * paired with PHONE. Server rendered, static, no hooks — accordions use
 * native <details>/<summary> only. Numbered label chip is added by the
 * gallery wrapper, so every z-index in here stays <= 40.
 */
export const optionsFaq: Section[] = [
  // 1 · Classic accordion, all closed, hairline rules, + marker right
  {
    name: "Classic Accordion",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-2xl mb-14">
          <h2 className="qpi-display text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05 }}>
            {FAQ_INTRO.heading}
          </h2>
          <p className="text-pretty mt-5" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "clamp(0.9375rem, 1.3vw, 1.0625rem)", lineHeight: 1.65, maxWidth: 620 }}>
            {FAQ_INTRO.sub}
          </p>
        </div>
        <div className="max-w-3xl">
          {FAQS.map((f, i) => (
            <details
              key={f.q}
              className="group"
              style={{ borderTop: i === 0 ? "1px solid rgba(11,42,74,0.15)" : undefined, borderBottom: "1px solid rgba(11,42,74,0.15)" }}
            >
              <summary
                className="list-none [&::-webkit-details-marker]:hidden flex items-center justify-between gap-6 py-6 cursor-pointer"
                style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1.0625rem" }}
              >
                <span>{f.q}</span>
                <span
                  aria-hidden="true"
                  className="shrink-0 transition-transform duration-300 group-open:rotate-45"
                  style={{ color: "var(--qpi-blue)", fontSize: 22, lineHeight: 1 }}
                >
                  +
                </span>
              </summary>
              <p className="text-pretty pb-6 pr-10" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.65 }}>
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    ),
  },

  // 2 · First item open by default, chevron marker, generous padding
  {
    name: "First-Open Chevron",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-2xl mb-16 mx-auto text-center">
          <h2 className="qpi-display text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05 }}>
            {FAQ_INTRO.heading}
          </h2>
          <p className="text-pretty mt-5 mx-auto" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "clamp(0.9375rem, 1.3vw, 1.0625rem)", lineHeight: 1.65, maxWidth: 560 }}>
            {FAQ_INTRO.sub}
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          {FAQS.map((f, i) => (
            <details key={f.q} open={i === 0} className="group" style={{ borderBottom: "1px solid rgba(11,42,74,0.15)" }}>
              <summary
                className="list-none [&::-webkit-details-marker]:hidden flex items-center justify-between gap-8 py-8 cursor-pointer"
                style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1.125rem" }}
              >
                <span>{f.q}</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="shrink-0 transition-transform duration-300 group-open:rotate-180"
                  style={{ width: 18, height: 18, color: "var(--qpi-blue)" }}
                >
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </summary>
              <p className="text-pretty pb-8 pr-10" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.7, maxWidth: 640 }}>
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    ),
  },

  // 3 · Two columns: heading block left, accordion right
  {
    name: "Heading Left Split",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-[340px_1fr] gap-12 md:gap-20 items-start">
          <div>
            <h2 className="qpi-display text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 3.2vw, 2.5rem)", lineHeight: 1.1 }}>
              {FAQ_INTRO.heading}
            </h2>
            <p className="text-pretty mt-5" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.65 }}>
              {FAQ_INTRO.sub}
            </p>
          </div>
          <div>
            {FAQS.map((f, i) => (
              <details
                key={f.q}
                className="group"
                style={{ borderTop: i === 0 ? "1px solid rgba(11,42,74,0.15)" : undefined, borderBottom: "1px solid rgba(11,42,74,0.15)" }}
              >
                <summary
                  className="list-none [&::-webkit-details-marker]:hidden flex items-center justify-between gap-6 py-5 cursor-pointer"
                  style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1rem" }}
                >
                  <span>{f.q}</span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 transition-transform duration-300 group-open:rotate-45"
                    style={{ color: "var(--qpi-blue)", fontSize: 20, lineHeight: 1 }}
                  >
                    +
                  </span>
                </summary>
                <p className="text-pretty pb-5" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.65 }}>
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 4 · All expanded: Q navy bold, A grey beneath, thin rules between
  {
    name: "Expanded Navy Ledger",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-2xl mb-14 mx-auto text-center">
          <h2 className="qpi-display text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05 }}>
            {FAQ_INTRO.heading}
          </h2>
          <p className="text-pretty mt-5 mx-auto" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "1rem", lineHeight: 1.6, maxWidth: 560 }}>
            {FAQ_INTRO.sub}
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          {FAQS.map((f, i) => (
            <div key={f.q} className="py-7" style={{ borderTop: i === 0 ? "1px solid rgba(11,42,74,0.15)" : undefined, borderBottom: "1px solid rgba(11,42,74,0.15)" }}>
              <h3 style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1.0625rem" }}>{f.q}</h3>
              <p className="text-pretty mt-3" style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: "0.9375rem", lineHeight: 1.65, maxWidth: 640 }}>
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 5 · Numbered (01-08) Q&A ledger, numbers in blue, all expanded
  {
    name: "Numbered Blue Ledger",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-2xl mb-14">
          <h2 className="qpi-display text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05 }}>
            {FAQ_INTRO.heading}
          </h2>
          <p className="text-pretty mt-5" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "1rem", lineHeight: 1.6, maxWidth: 620 }}>
            {FAQ_INTRO.sub}
          </p>
        </div>
        <div className="max-w-3xl">
          {FAQS.map((f, i) => (
            <div
              key={f.q}
              className="flex gap-6 py-7"
              style={{ borderTop: i === 0 ? "1px solid rgba(11,42,74,0.15)" : undefined, borderBottom: "1px solid rgba(11,42,74,0.15)" }}
            >
              <span className="qpi-caps shrink-0" style={{ color: "var(--qpi-blue)", fontSize: 12, paddingTop: 3 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1.0625rem" }}>{f.q}</h3>
                <p className="text-pretty mt-3" style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: "0.9375rem", lineHeight: 1.65, maxWidth: 600 }}>
                  {f.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 6 · Two-column grid of Q&A pairs, no accordion, hairline top rules
  {
    name: "Two-Column Static Grid",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-2xl mb-16 mx-auto text-center">
          <h2 className="qpi-display text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05 }}>
            {FAQ_INTRO.heading}
          </h2>
          <p className="text-pretty mt-5 mx-auto" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "1rem", lineHeight: 1.6, maxWidth: 560 }}>
            {FAQ_INTRO.sub}
          </p>
        </div>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-12">
          {FAQS.map((f) => (
            <div key={f.q} className="pt-6" style={{ borderTop: "1px solid rgba(11,42,74,0.15)" }}>
              <h3 style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1.0625rem" }}>{f.q}</h3>
              <p className="text-pretty mt-3" style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: "0.9375rem", lineHeight: 1.65 }}>
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 7 · Big-type questions, answers small and indented far right
  {
    name: "Big Question, Small Answer",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-2xl mb-16">
          <h2 className="qpi-display text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05 }}>
            {FAQ_INTRO.heading}
          </h2>
        </div>
        <div className="max-w-[1100px]">
          {FAQS.map((f, i) => (
            <div key={f.q} className="py-9 grid grid-cols-1 md:grid-cols-[1fr_360px] gap-4 md:gap-10 items-start" style={{ borderTop: i === 0 ? "1px solid rgba(11,42,74,0.15)" : undefined, borderBottom: "1px solid rgba(11,42,74,0.15)" }}>
              <h3 className="text-balance" style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "clamp(1.375rem, 2.4vw, 1.875rem)", lineHeight: 1.15 }}>
                {f.q}
              </h3>
              <p className="text-pretty md:justify-self-end" style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: "0.8125rem", lineHeight: 1.65, maxWidth: 340 }}>
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 8 · Navy full-bleed band, white type, accordion with white rules
  {
    name: "Navy Full-Bleed Accordion",
    node: (
      <section className="relative w-full py-20 md:py-28 px-6 md:px-14" style={{ background: "var(--qpi-ink)" }}>
        <div className="max-w-2xl mb-14 mx-auto text-center">
          <h2 className="qpi-display text-balance" style={{ color: "#fff", fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05 }}>
            {FAQ_INTRO.heading}
          </h2>
          <p className="text-pretty mt-5 mx-auto" style={{ color: "#fff", opacity: 0.6, fontSize: "1rem", lineHeight: 1.6, maxWidth: 560 }}>
            {FAQ_INTRO.sub}
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          {FAQS.map((f, i) => (
            <details key={f.q} open={i === 0} className="group" style={{ borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
              <summary
                className="list-none [&::-webkit-details-marker]:hidden flex items-center justify-between gap-6 py-7 cursor-pointer"
                style={{ color: "#fff", fontWeight: 700, fontSize: "1.0625rem" }}
              >
                <span>{f.q}</span>
                <span aria-hidden="true" className="shrink-0 transition-transform duration-300 group-open:rotate-45" style={{ fontSize: 22, lineHeight: 1, color: "#fff" }}>
                  +
                </span>
              </summary>
              <p className="text-pretty pb-7 pr-10" style={{ color: "#fff", opacity: 0.65, fontSize: "0.9375rem", lineHeight: 1.65 }}>
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    ),
  },

  // 9 · Q as a large blue heading, A in a narrow measure column beneath
  {
    name: "Blue Heading Column",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-2xl mb-16">
          <h2 className="qpi-display text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05 }}>
            {FAQ_INTRO.heading}
          </h2>
          <p className="text-pretty mt-5" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "1rem", lineHeight: 1.6, maxWidth: 560 }}>
            {FAQ_INTRO.sub}
          </p>
        </div>
        <div className="max-w-2xl flex flex-col gap-14">
          {FAQS.map((f) => (
            <div key={f.q}>
              <h3 className="text-balance" style={{ color: "var(--qpi-blue)", fontWeight: 700, fontSize: "clamp(1.25rem, 2.2vw, 1.625rem)", lineHeight: 1.2 }}>
                {f.q}
              </h3>
              <p className="text-pretty mt-4" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.7, maxWidth: 440 }}>
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 10 · Compact: tight rows, small type, dense rules, very restrained
  {
    name: "Compact Dense Rows",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-2xl mx-auto mb-10 text-center">
          <h2 className="qpi-display text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem, 3vw, 2.125rem)", lineHeight: 1.1 }}>
            {FAQ_INTRO.heading}
          </h2>
        </div>
        <div className="max-w-xl mx-auto">
          {FAQS.map((f, i) => (
            <details
              key={f.q}
              className="group"
              style={{ borderTop: i === 0 ? "1px solid rgba(11,42,74,0.15)" : undefined, borderBottom: "1px solid rgba(11,42,74,0.15)" }}
            >
              <summary
                className="list-none [&::-webkit-details-marker]:hidden flex items-center justify-between gap-4 py-3.5 cursor-pointer"
                style={{ color: "var(--qpi-ink)", fontWeight: 600, fontSize: "0.8125rem" }}
              >
                <span>{f.q}</span>
                <span aria-hidden="true" className="shrink-0 transition-transform duration-300 group-open:rotate-45" style={{ color: "var(--qpi-blue)", fontSize: 15, lineHeight: 1 }}>
                  +
                </span>
              </summary>
              <p className="text-pretty pb-3.5 pr-8" style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: "0.75rem", lineHeight: 1.6 }}>
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    ),
  },

  // 11 · Accordion inside a bordered card, one open
  {
    name: "Bordered Card Accordion",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-2xl mb-14 mx-auto text-center">
          <h2 className="qpi-display text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05 }}>
            {FAQ_INTRO.heading}
          </h2>
          <p className="text-pretty mt-5 mx-auto" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "1rem", lineHeight: 1.6, maxWidth: 560 }}>
            {FAQ_INTRO.sub}
          </p>
        </div>
        <div className="max-w-3xl mx-auto px-6 md:px-10" style={{ border: "1px solid rgba(11,42,74,0.2)" }}>
          {FAQS.map((f, i) => (
            <details key={f.q} open={i === 1} className="group" style={{ borderBottom: i === FAQS.length - 1 ? undefined : "1px solid rgba(11,42,74,0.15)" }}>
              <summary
                className="list-none [&::-webkit-details-marker]:hidden flex items-center justify-between gap-6 py-6 cursor-pointer"
                style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1rem" }}
              >
                <span>{f.q}</span>
                <span aria-hidden="true" className="shrink-0 transition-transform duration-300 group-open:rotate-45" style={{ color: "var(--qpi-blue)", fontSize: 20, lineHeight: 1 }}>
                  +
                </span>
              </summary>
              <p className="text-pretty pb-6" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.65 }}>
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    ),
  },

  // 12 · Heading centred, accordion centred with a max-width measure
  {
    name: "Centered Measure Accordion",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-xl mx-auto mb-14 text-center">
          <h2 className="qpi-display text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 4vw, 2.875rem)", lineHeight: 1.1 }}>
            {FAQ_INTRO.heading}
          </h2>
          <p className="text-pretty mt-5" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.65 }}>
            {FAQ_INTRO.sub}
          </p>
        </div>
        <div className="max-w-xl mx-auto">
          {FAQS.map((f, i) => (
            <details
              key={f.q}
              className="group"
              style={{ borderTop: i === 0 ? "1px solid rgba(11,42,74,0.15)" : undefined, borderBottom: "1px solid rgba(11,42,74,0.15)" }}
            >
              <summary
                className="list-none [&::-webkit-details-marker]:hidden flex items-center justify-between gap-5 py-5 cursor-pointer text-center"
                style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "0.9375rem" }}
              >
                <span>{f.q}</span>
                <span aria-hidden="true" className="shrink-0 transition-transform duration-300 group-open:rotate-45" style={{ color: "var(--qpi-blue)", fontSize: 18, lineHeight: 1 }}>
                  +
                </span>
              </summary>
              <p className="text-pretty pb-5" style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: "0.875rem", lineHeight: 1.65 }}>
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    ),
  },

  // 13 · Photo left half, FAQ accordion right half
  {
    name: "Photo Split Accordion",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          <div className="flex flex-col gap-8">
            <div style={{ aspectRatio: "4 / 5", overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={GALLERY_IMGS[4]} alt="A pool installed by QLD Pool Installs" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div>
              <h2 className="qpi-display text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.2vw, 2.375rem)", lineHeight: 1.1 }}>
                {FAQ_INTRO.heading}
              </h2>
              <p className="text-pretty mt-4" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.65 }}>
                {FAQ_INTRO.sub}
              </p>
            </div>
          </div>
          <div>
            {FAQS.map((f, i) => (
              <details
                key={f.q}
                open={i === 2}
                className="group"
                style={{ borderTop: i === 0 ? "1px solid rgba(11,42,74,0.15)" : undefined, borderBottom: "1px solid rgba(11,42,74,0.15)" }}
              >
                <summary
                  className="list-none [&::-webkit-details-marker]:hidden flex items-center justify-between gap-5 py-5 cursor-pointer"
                  style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "0.9375rem" }}
                >
                  <span>{f.q}</span>
                  <span aria-hidden="true" className="shrink-0 transition-transform duration-300 group-open:rotate-45" style={{ color: "var(--qpi-blue)", fontSize: 18, lineHeight: 1 }}>
                    +
                  </span>
                </summary>
                <p className="text-pretty pb-5" style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: "0.875rem", lineHeight: 1.6 }}>
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 14 · Alternating: question left / answer right across a wide grid
  {
    name: "Alternating Row Grid",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-2xl mb-16">
          <h2 className="qpi-display text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05 }}>
            {FAQ_INTRO.heading}
          </h2>
          <p className="text-pretty mt-5" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "1rem", lineHeight: 1.6, maxWidth: 560 }}>
            {FAQ_INTRO.sub}
          </p>
        </div>
        <div className="max-w-[1200px]">
          {FAQS.map((f, i) => (
            <div
              key={f.q}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-16 py-8"
              style={{ borderTop: i === 0 ? "1px solid rgba(11,42,74,0.15)" : undefined, borderBottom: "1px solid rgba(11,42,74,0.15)" }}
            >
              <h3 className="text-balance" style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1.125rem", lineHeight: 1.3 }}>
                {f.q}
              </h3>
              <p className="text-pretty" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.7 }}>
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 15 · Numbered big index left (a column of 01-08), the questions listed right
  {
    name: "Big Index Column",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-2xl mb-16">
          <h2 className="qpi-display text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05 }}>
            {FAQ_INTRO.heading}
          </h2>
          <p className="text-pretty mt-5" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "1rem", lineHeight: 1.6, maxWidth: 560 }}>
            {FAQ_INTRO.sub}
          </p>
        </div>
        <div className="max-w-[1100px]">
          {FAQS.map((f, i) => (
            <div
              key={f.q}
              className="grid grid-cols-[64px_1fr] md:grid-cols-[120px_1fr] gap-4 md:gap-10 py-8 items-start"
              style={{ borderTop: i === 0 ? "1px solid rgba(11,42,74,0.15)" : undefined, borderBottom: "1px solid rgba(11,42,74,0.15)" }}
            >
              <span style={{ color: "var(--qpi-blue)", fontWeight: 700, fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-balance" style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1.0625rem", lineHeight: 1.3 }}>
                  {f.q}
                </h3>
                <p className="text-pretty mt-3" style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: "0.875rem", lineHeight: 1.65, maxWidth: 560 }}>
                  {f.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 16 · Off-white ground, accordion with generous 32px+ vertical padding per row
  {
    name: "Off-White Generous Rows",
    node: (
      <section className="relative w-full py-20 md:py-28 px-6 md:px-14" style={{ background: "rgba(11,42,74,0.035)" }}>
        <div className="max-w-2xl mb-16 mx-auto text-center">
          <h2 className="qpi-display text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05 }}>
            {FAQ_INTRO.heading}
          </h2>
          <p className="text-pretty mt-5 mx-auto" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "1rem", lineHeight: 1.6, maxWidth: 560 }}>
            {FAQ_INTRO.sub}
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          {FAQS.map((f, i) => (
            <details
              key={f.q}
              className="group"
              style={{ borderTop: i === 0 ? "1px solid rgba(11,42,74,0.15)" : undefined, borderBottom: "1px solid rgba(11,42,74,0.15)" }}
            >
              <summary
                className="list-none [&::-webkit-details-marker]:hidden flex items-center justify-between gap-6 py-9 cursor-pointer"
                style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1.0625rem" }}
              >
                <span>{f.q}</span>
                <span aria-hidden="true" className="shrink-0 transition-transform duration-300 group-open:rotate-45" style={{ color: "var(--qpi-blue)", fontSize: 22, lineHeight: 1 }}>
                  +
                </span>
              </summary>
              <p className="text-pretty pb-9 pr-10" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.65 }}>
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    ),
  },

  // 17 · Questions only as a scannable list, answers as small footnotes beneath each
  {
    name: "Footnote List",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-2xl mb-14">
          <h2 className="qpi-display text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05 }}>
            {FAQ_INTRO.heading}
          </h2>
          <p className="text-pretty mt-5" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "1rem", lineHeight: 1.6, maxWidth: 560 }}>
            {FAQ_INTRO.sub}
          </p>
        </div>
        <div className="max-w-2xl">
          {FAQS.map((f, i) => (
            <div key={f.q} className="pt-6 pb-2" style={{ borderTop: i === 0 ? undefined : "1px solid rgba(11,42,74,0.1)" }}>
              <p style={{ color: "var(--qpi-ink)", fontWeight: 600, fontSize: "1rem", lineHeight: 1.4 }}>{f.q}</p>
              <p className="text-pretty mt-2 mb-5" style={{ color: "var(--qpi-ink)", opacity: 0.45, fontSize: "0.8125rem", lineHeight: 1.6, maxWidth: 520 }}>
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 18 · Split: heading + phone CTA sticky-feel left, accordion right
  {
    name: "Sticky CTA Split",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-[320px_1fr] gap-12 md:gap-16 items-start">
          <div>
            <h2 className="qpi-display text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.2vw, 2.375rem)", lineHeight: 1.1 }}>
              {FAQ_INTRO.heading}
            </h2>
            <p className="text-pretty mt-4" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.65 }}>
              {FAQ_INTRO.sub}
            </p>
            <a
              href={PHONE_HREF}
              className="mt-8 inline-flex items-center gap-3"
              style={{ color: "var(--qpi-blue)", fontWeight: 700, fontSize: "1.0625rem", textDecoration: "none" }}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ width: 18, height: 18 }}>
                <path
                  d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.2 2.2Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {PHONE}
            </a>
          </div>
          <div>
            {FAQS.map((f, i) => (
              <details
                key={f.q}
                className="group"
                style={{ borderTop: i === 0 ? "1px solid rgba(11,42,74,0.15)" : undefined, borderBottom: "1px solid rgba(11,42,74,0.15)" }}
              >
                <summary
                  className="list-none [&::-webkit-details-marker]:hidden flex items-center justify-between gap-6 py-6 cursor-pointer"
                  style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1rem" }}
                >
                  <span>{f.q}</span>
                  <span aria-hidden="true" className="shrink-0 transition-transform duration-300 group-open:rotate-45" style={{ color: "var(--qpi-blue)", fontSize: 20, lineHeight: 1 }}>
                    +
                  </span>
                </summary>
                <p className="text-pretty pb-6" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.65 }}>
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 19 · Every question with a hanging blue "Q." and answers a hanging "A."
  {
    name: "Hanging Q & A Labels",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-2xl mb-16">
          <h2 className="qpi-display text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05 }}>
            {FAQ_INTRO.heading}
          </h2>
          <p className="text-pretty mt-5" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "1rem", lineHeight: 1.6, maxWidth: 560 }}>
            {FAQ_INTRO.sub}
          </p>
        </div>
        <div className="max-w-2xl flex flex-col gap-10">
          {FAQS.map((f) => (
            <div key={f.q}>
              <div className="flex gap-4">
                <span aria-hidden="true" style={{ color: "var(--qpi-blue)", fontWeight: 700, fontSize: "1.0625rem", width: 24, flexShrink: 0 }}>
                  Q.
                </span>
                <p style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1.0625rem", lineHeight: 1.4 }}>{f.q}</p>
              </div>
              <div className="flex gap-4 mt-3">
                <span aria-hidden="true" style={{ color: "var(--qpi-ink)", opacity: 0.35, fontWeight: 700, fontSize: "0.9375rem", width: 24, flexShrink: 0 }}>
                  A.
                </span>
                <p className="text-pretty" style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: "0.9375rem", lineHeight: 1.65 }}>
                  {f.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 20 · Full-width rows where the open state shows a blue left border
  {
    name: "Blue Left-Border Rows",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-2xl mb-14">
          <h2 className="qpi-display text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05 }}>
            {FAQ_INTRO.heading}
          </h2>
          <p className="text-pretty mt-5" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "1rem", lineHeight: 1.6, maxWidth: 560 }}>
            {FAQ_INTRO.sub}
          </p>
        </div>
        <div className="max-w-3xl">
          {FAQS.map((f, i) => (
            <details
              key={f.q}
              open={i === 1 || i === 4}
              className="group border-l-[3px] open:border-[var(--qpi-blue)] transition-colors duration-300"
              style={{ borderLeftColor: i === 1 || i === 4 ? undefined : "transparent", borderTop: i === 0 ? "1px solid rgba(11,42,74,0.15)" : undefined, borderBottom: "1px solid rgba(11,42,74,0.15)" }}
            >
              <summary
                className="list-none [&::-webkit-details-marker]:hidden flex items-center justify-between gap-6 py-6 pl-6 cursor-pointer"
                style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1.0625rem" }}
              >
                <span>{f.q}</span>
                <span aria-hidden="true" className="shrink-0 mr-2 transition-transform duration-300 group-open:rotate-45" style={{ color: "var(--qpi-blue)", fontSize: 22, lineHeight: 1 }}>
                  +
                </span>
              </summary>
              <p className="text-pretty pb-6 pl-6 pr-10" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.65 }}>
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    ),
  },

  // 21 · Two accordions side by side (4 questions each)
  {
    name: "Twin Accordions",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-2xl mb-14 mx-auto text-center">
          <h2 className="qpi-display text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05 }}>
            {FAQ_INTRO.heading}
          </h2>
          <p className="text-pretty mt-5 mx-auto" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "1rem", lineHeight: 1.6, maxWidth: 560 }}>
            {FAQ_INTRO.sub}
          </p>
        </div>
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-x-16">
          {[FAQS.slice(0, 4), FAQS.slice(4, 8)].map((col, c) => (
            <div key={c}>
              {col.map((f, i) => (
                <details
                  key={f.q}
                  open={i === 0}
                  className="group"
                  style={{ borderTop: i === 0 ? "1px solid rgba(11,42,74,0.15)" : undefined, borderBottom: "1px solid rgba(11,42,74,0.15)" }}
                >
                  <summary
                    className="list-none [&::-webkit-details-marker]:hidden flex items-center justify-between gap-5 py-6 cursor-pointer"
                    style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "0.9375rem" }}
                  >
                    <span>{f.q}</span>
                    <span aria-hidden="true" className="shrink-0 transition-transform duration-300 group-open:rotate-45" style={{ color: "var(--qpi-blue)", fontSize: 18, lineHeight: 1 }}>
                      +
                    </span>
                  </summary>
                  <p className="text-pretty pb-6" style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: "0.875rem", lineHeight: 1.6 }}>
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 22 · Editorial: heading huge across the top, Q&As as newspaper columns
  {
    name: "Editorial Newspaper Columns",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <h2 className="qpi-display text-balance mb-14 max-w-[1100px]" style={{ color: "var(--qpi-ink)", fontSize: "clamp(2.25rem, 6vw, 5rem)", lineHeight: 0.98 }}>
          {FAQ_INTRO.heading}
        </h2>
        <div className="max-w-[1300px] columns-1 md:columns-2 lg:columns-3 gap-10">
          {FAQS.map((f) => (
            <div key={f.q} className="mb-10" style={{ breakInside: "avoid" }}>
              <h3 className="text-balance" style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1rem", lineHeight: 1.35 }}>
                {f.q}
              </h3>
              <p className="text-pretty mt-3" style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: "0.8125rem", lineHeight: 1.6 }}>
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 23 · Minimal: no rules at all, pure spacing rhythm, all expanded
  {
    name: "Minimal Rhythm",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-xl mx-auto flex flex-col gap-16">
          <div className="text-center">
            <h2 className="qpi-display text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 4vw, 2.75rem)", lineHeight: 1.1 }}>
              {FAQ_INTRO.heading}
            </h2>
            <p className="text-pretty mt-5" style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: "0.9375rem", lineHeight: 1.65 }}>
              {FAQ_INTRO.sub}
            </p>
          </div>
          {FAQS.map((f) => (
            <div key={f.q} className="text-center">
              <h3 className="text-balance" style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1.125rem", lineHeight: 1.35 }}>
                {f.q}
              </h3>
              <p className="text-pretty mt-4 mx-auto" style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: "0.9375rem", lineHeight: 1.7, maxWidth: 460 }}>
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 24 · Card grid 2x4, each card a Q&A, 1px navy borders
  {
    name: "Bordered Card Grid",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-2xl mb-14 mx-auto text-center">
          <h2 className="qpi-display text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05 }}>
            {FAQ_INTRO.heading}
          </h2>
          <p className="text-pretty mt-5 mx-auto" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "1rem", lineHeight: 1.6, maxWidth: 560 }}>
            {FAQ_INTRO.sub}
          </p>
        </div>
        <div
          className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2"
          style={{ border: "1px solid rgba(11,42,74,0.25)" }}
        >
          {FAQS.map((f, i) => (
            <div
              key={f.q}
              className="p-8"
              style={{
                borderRight: i % 2 === 0 ? "1px solid rgba(11,42,74,0.25)" : undefined,
                borderTop: i < 2 ? undefined : "1px solid rgba(11,42,74,0.25)",
              }}
            >
              <h3 className="text-balance" style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1rem", lineHeight: 1.35 }}>
                {f.q}
              </h3>
              <p className="text-pretty mt-3" style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: "0.875rem", lineHeight: 1.6 }}>
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 25 · Accordion + a small "Still have questions? {PHONE}" row pinned at the bottom
  {
    name: "Accordion + Contact Row",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="max-w-2xl mb-14">
          <h2 className="qpi-display text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.05 }}>
            {FAQ_INTRO.heading}
          </h2>
          <p className="text-pretty mt-5" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "1rem", lineHeight: 1.6, maxWidth: 620 }}>
            {FAQ_INTRO.sub}
          </p>
        </div>
        <div className="max-w-3xl">
          {FAQS.map((f, i) => (
            <details
              key={f.q}
              open={i === 0}
              className="group"
              style={{ borderTop: i === 0 ? "1px solid rgba(11,42,74,0.15)" : undefined, borderBottom: "1px solid rgba(11,42,74,0.15)" }}
            >
              <summary
                className="list-none [&::-webkit-details-marker]:hidden flex items-center justify-between gap-6 py-6 cursor-pointer"
                style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1.0625rem" }}
              >
                <span>{f.q}</span>
                <span aria-hidden="true" className="shrink-0 transition-transform duration-300 group-open:rotate-45" style={{ color: "var(--qpi-blue)", fontSize: 22, lineHeight: 1 }}>
                  +
                </span>
              </summary>
              <p className="text-pretty pb-6 pr-10" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.65 }}>
                {f.a}
              </p>
            </details>
          ))}
          <div className="mt-4 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" style={{ borderTop: "1px solid rgba(11,42,74,0.15)" }}>
            <p style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.9375rem" }}>Still have questions?</p>
            <a
              href={PHONE_HREF}
              className="inline-flex items-center gap-3"
              style={{ color: "var(--qpi-blue)", fontWeight: 700, fontSize: "1.0625rem", textDecoration: "none" }}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ width: 18, height: 18 }}>
                <path
                  d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.2 2.2Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {PHONE}
            </a>
          </div>
        </div>
      </section>
    ),
  },
];
