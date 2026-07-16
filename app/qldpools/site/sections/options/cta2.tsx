import { CTA, PHONE, PHONE_HREF, EMAIL, AREAS, HERO_SRC, GALLERY_IMGS, LICENCES, type Section } from "../kit";

/**
 * Contact CTA — SECOND, WILDER batch of 20 design options. The client
 * rejected the entire first batch (cta.tsx) outright, so this file pushes
 * hardest: arch doorways, postcards, receipts, boarding-pass perforations,
 * porthole photos, drawer pulls, compass bands. Every option is a single
 * min-h-svh, vertically centred viewport on a white ground, arch-shaped
 * elements throughout, and every form is presentational only.
 *
 * Server-rendered only: no hooks, no client directive, no event handlers.
 * <form> renders with no `action`; every <button> is type="button"; every
 * <input> has an id, matching htmlFor, and a name; every input has a
 * visible label. Nothing beyond CTA/PHONE/EMAIL/AREAS/LICENCES is invented.
 */

const ARCH = "9999px 9999px 0 0";
const HAIRLINE = "rgba(25,60,90,0.16)";

type FieldMeta = { id: string; name: string; label: string; type: "text" | "tel" | "email" };

function inputType(field: string): "text" | "tel" | "email" {
  if (field === "Phone") return "tel";
  if (field === "Email") return "email";
  return "text";
}

function fieldMeta(prefix: string): FieldMeta[] {
  return CTA.fields.map((f) => ({
    id: `${prefix}-${f.toLowerCase()}`,
    name: f.toLowerCase(),
    label: f,
    type: inputType(f),
  }));
}

function InputField({
  f,
  wrapClass = "flex flex-col gap-1.5",
  labelClass = "qpi-caps text-[10px] text-[var(--qpi-ink)]/65",
  inputClass = "h-11 w-full rounded-md border border-black/15 bg-white px-3.5 text-[14px] text-[var(--qpi-ink)] outline-none transition-colors focus-visible:border-[var(--qpi-blue)] focus-visible:ring-2 focus-visible:ring-[var(--qpi-blue)]/25",
}: {
  f: FieldMeta;
  wrapClass?: string;
  labelClass?: string;
  inputClass?: string;
}) {
  return (
    <div className={wrapClass}>
      <label htmlFor={f.id} className={labelClass}>
        {f.label}
      </label>
      <input id={f.id} name={f.name} type={f.type} className={inputClass} />
    </div>
  );
}

function CtaButton({ className }: { className: string }) {
  return (
    <button type="button" className={className}>
      {CTA.button}
    </button>
  );
}

export const optionsCta2: Section[] = [
  // 1 · Arch Doorway Photo — a monumental arch-framed dusk photo as the
  // literal "come on in" doorway, single-line ruled form beneath.
  {
    name: "Arch Doorway Photo",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-lg text-center">
          <div className="mx-auto overflow-hidden" style={{ width: "min(220px, 40vw)", height: "clamp(160px, 24vh, 220px)", borderRadius: ARCH }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={HERO_SRC} alt="Pool at dusk" className="h-full w-full object-cover" />
          </div>
          <span className="qpi-caps mt-6 block text-[var(--qpi-blue)]">{CTA.kicker}</span>
          <h2 className="qpi-display mt-2 text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.05] text-[var(--qpi-ink)]">{CTA.heading}</h2>
          <form className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-end" style={{ borderTop: `1px solid ${HAIRLINE}`, paddingTop: 16 }}>
            {fieldMeta("w1").map((f) => (
              <InputField key={f.id} f={f} wrapClass="flex flex-1 flex-col gap-1.5 text-left" />
            ))}
            <CtaButton className="h-11 shrink-0 rounded-full bg-[var(--qpi-blue)] px-6 text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[var(--qpi-ink)]" />
          </form>
        </div>
      </section>
    ),
  },

  // 2 · Monumental Phone — the phone number set colossal, a tiny hairline
  // form crouched beneath it.
  {
    name: "Monumental Phone",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-3xl text-center">
          <span className="qpi-caps text-[var(--qpi-blue)]">{CTA.kicker}</span>
          <a href={PHONE_HREF} className="qpi-display mt-4 block leading-none text-[var(--qpi-ink)] transition-colors hover:text-[var(--qpi-blue)]" style={{ fontSize: "clamp(2.75rem, 10vw, 7rem)" }}>
            {PHONE}
          </a>
          <p className="text-pretty mx-auto mt-4 max-w-md text-[13px] leading-relaxed text-[var(--qpi-ink)]/60">{CTA.sub}</p>
          <form className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row" style={{ borderTop: `1px solid ${HAIRLINE}`, paddingTop: 16 }}>
            {fieldMeta("w2").map((f) => (
              <InputField key={f.id} f={f} wrapClass="flex flex-1 flex-col gap-1.5 text-left" />
            ))}
            <CtaButton className="h-11 shrink-0 rounded-md bg-[var(--qpi-ink)] px-6 text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[var(--qpi-blue)]" />
          </form>
        </div>
      </section>
    ),
  },

  // 3 · Form Inside the Arch — the form panel itself is arch-topped, a
  // literal doorway you fill in.
  {
    name: "Form Inside the Arch",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <span className="qpi-caps mx-auto block text-center text-[var(--qpi-blue)]">{CTA.kicker}</span>
        <h2 className="qpi-display text-balance mx-auto mt-3 max-w-lg text-center text-[clamp(1.5rem,3.2vw,2.25rem)] leading-[1.05] text-[var(--qpi-ink)]">
          {CTA.heading}
        </h2>
        <form
          className="mx-auto mt-7 flex w-full max-w-sm flex-col gap-4 px-8 pt-12 pb-8"
          style={{ background: "rgba(24,120,166,0.06)", borderRadius: ARCH }}
        >
          {fieldMeta("w3").map((f) => (
            <InputField key={f.id} f={f} />
          ))}
          <CtaButton className="mt-1 h-12 w-full rounded-md bg-[var(--qpi-blue)] text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[var(--qpi-ink)]" />
        </form>
      </section>
    ),
  },

  // 4 · Single Rule Form — one continuous horizontal rule, all 4 fields as
  // segments along it, the button a round arrow at the end.
  {
    name: "Single Rule Form",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-4xl text-center">
          <span className="qpi-caps text-[var(--qpi-blue)]">{CTA.kicker}</span>
          <h2 className="qpi-display mt-3 text-[clamp(1.5rem,3.4vw,2.5rem)] leading-[1.05] text-[var(--qpi-ink)]">{CTA.heading}</h2>
          <form className="mx-auto mt-9 flex w-full items-end gap-0" style={{ borderBottom: `2px solid var(--qpi-ink)` }}>
            {fieldMeta("w4").map((f, i) => (
              <div key={f.id} className="flex flex-1 flex-col gap-1.5 py-3 text-left" style={{ borderLeft: i === 0 ? undefined : `1px solid ${HAIRLINE}`, paddingLeft: i === 0 ? 0 : 16 }}>
                <label htmlFor={f.id} className="qpi-caps text-[10px] text-[var(--qpi-ink)]/55">{f.label}</label>
                <input id={f.id} name={f.name} type={f.type} className="h-9 w-full border-0 bg-transparent px-0 text-[15px] text-[var(--qpi-ink)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--qpi-blue)]/25" />
              </div>
            ))}
            <button
              type="button"
              aria-label={CTA.button}
              className="ml-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--qpi-blue)] text-white transition-colors hover:bg-[var(--qpi-ink)]"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ width: 18, height: 18 }}>
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </div>
      </section>
    ),
  },

  // 5 · Ink Block Reversed — a solid ink slab, arch-cut at the top, the
  // heading and form both reversed out in white.
  {
    name: "Ink Block Reversed",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-2xl px-8 pt-14 pb-10 md:px-12" style={{ background: "var(--qpi-ink)", borderRadius: ARCH }}>
          <div className="text-center">
            <span className="qpi-caps text-white/60">{CTA.kicker}</span>
            <h2 className="qpi-display mt-3 text-[clamp(1.625rem,3.4vw,2.5rem)] leading-[1.05] text-white">{CTA.heading}</h2>
          </div>
          <form className="mx-auto mt-8 grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-2">
            {fieldMeta("w5").map((f) => (
              <InputField
                key={f.id}
                f={f}
                wrapClass="flex flex-col gap-1.5 text-left"
                labelClass="qpi-caps text-[10px] text-white/60"
                inputClass="h-11 w-full rounded-md border border-white/25 bg-white/10 px-3.5 text-[14px] text-white outline-none transition-colors focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white/30"
              />
            ))}
          </form>
          <CtaButton className="mx-auto mt-6 block h-12 w-full max-w-lg rounded-md bg-[var(--qpi-blue)] text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-white hover:text-[var(--qpi-ink)]" />
        </div>
      </section>
    ),
  },

  // 6 · Postcard Composition — a small stamp-style photo top right, ruled
  // "address" fields on the left like the front of a postcard.
  {
    name: "Postcard Composition",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-3xl" style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12 }}>
          <div className="grid grid-cols-1 sm:grid-cols-[1.3fr_1fr]">
            <div className="p-8 md:p-10">
              <span className="qpi-caps text-[var(--qpi-blue)]">{CTA.kicker}</span>
              <h2 className="qpi-display mt-3 text-[clamp(1.375rem,2.6vw,1.875rem)] leading-[1.08] text-[var(--qpi-ink)]">{CTA.heading}</h2>
              <form className="mt-6 flex flex-col gap-0">
                {fieldMeta("w6").map((f) => (
                  <div key={f.id} className="flex items-baseline gap-3 py-2" style={{ borderBottom: `1px dotted ${HAIRLINE}` }}>
                    <label htmlFor={f.id} className="qpi-caps shrink-0 text-[9.5px] text-[var(--qpi-ink)]/50" style={{ width: 52 }}>{f.label}</label>
                    <input id={f.id} name={f.name} type={f.type} className="h-8 w-full border-0 bg-transparent px-0 text-[13px] text-[var(--qpi-ink)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--qpi-blue)]/25" />
                  </div>
                ))}
              </form>
              <CtaButton className="mt-5 h-11 rounded-md bg-[var(--qpi-blue)] px-7 text-[11px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[var(--qpi-ink)]" />
            </div>
            <div className="relative hidden sm:block p-8 md:p-10">
              <div className="absolute inset-6 overflow-hidden" style={{ border: `2px dashed ${HAIRLINE}`, borderRadius: 4 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={HERO_SRC} alt="Pool at dusk" className="h-full w-full object-cover" style={{ margin: 4, width: "calc(100% - 8px)", height: "calc(100% - 8px)" }} />
              </div>
            </div>
          </div>
        </div>
      </section>
    ),
  },

  // 7 · Colossal Statement — the heading set enormous and nearly edge to
  // edge, a very small compact form tucked in the corner.
  {
    name: "Colossal Statement",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <h2 className="qpi-display text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(2.5rem, 8vw, 6rem)", lineHeight: 0.95, maxWidth: 1100 }}>
          {CTA.heading}
        </h2>
        <div className="mt-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <p className="text-pretty max-w-sm text-[13px] leading-relaxed text-[var(--qpi-ink)]/55">{CTA.sub}</p>
          <form className="flex w-full max-w-xs flex-col gap-3 sm:w-auto">
            {fieldMeta("w7")
              .slice(0, 2)
              .map((f) => (
                <InputField key={f.id} f={f} inputClass="h-10 w-full rounded-md border border-black/15 bg-white px-3 text-[13px] text-[var(--qpi-ink)] outline-none transition-colors focus-visible:border-[var(--qpi-blue)] focus-visible:ring-2 focus-visible:ring-[var(--qpi-blue)]/25" />
              ))}
            <CtaButton className="h-10 w-full rounded-md bg-[var(--qpi-blue)] text-[11px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[var(--qpi-ink)]" />
          </form>
        </div>
      </section>
    ),
  },

  // 8 · Receipt Form — a printed-receipt aesthetic: dashed top edge,
  // itemised dotted-leader rows, tabular figures, a bottom "total" button.
  {
    name: "Receipt Form",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-sm px-7 pt-8 pb-7" style={{ border: `1px solid ${HAIRLINE}`, borderTop: `3px dashed ${HAIRLINE}` }}>
          <p className="qpi-caps text-center text-[var(--qpi-blue)]">{CTA.kicker}</p>
          <h2 className="qpi-display text-balance mt-2 text-center text-[clamp(1.125rem,2vw,1.5rem)] leading-[1.15] text-[var(--qpi-ink)]">
            {CTA.heading}
          </h2>
          <form className="mt-6 flex flex-col" style={{ borderTop: `1px dashed ${HAIRLINE}`, paddingTop: 14 }}>
            {fieldMeta("w8").map((f) => (
              <div key={f.id} className="flex items-center justify-between gap-4 py-2">
                <label htmlFor={f.id} className="qpi-caps shrink-0 text-[10px] text-[var(--qpi-ink)]/55">{f.label}</label>
                <input
                  id={f.id}
                  name={f.name}
                  type={f.type}
                  style={{ fontVariantNumeric: "tabular-nums" }}
                  className="h-9 w-full max-w-[160px] border-0 border-b border-black/15 bg-transparent px-0 text-right text-[13px] text-[var(--qpi-ink)] outline-none focus-visible:border-[var(--qpi-blue)]"
                />
              </div>
            ))}
          </form>
          <CtaButton className="mt-6 h-11 w-full rounded-sm bg-[var(--qpi-ink)] text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[var(--qpi-blue)]" />
        </div>
      </section>
    ),
  },

  // 9 · Arch / White Split — a full-height arch-shaped photo meets a crisp
  // white form panel, edge to edge.
  {
    name: "Arch / White Split",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto grid w-full max-w-4xl grid-cols-1 md:grid-cols-[0.9fr_1.1fr] items-center gap-10 md:gap-14">
          <div className="mx-auto overflow-hidden" style={{ width: "min(280px, 60vw)", height: "clamp(220px, 32vh, 340px)", borderRadius: ARCH }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={HERO_SRC} alt="Pool at dusk" className="h-full w-full object-cover" />
          </div>
          <div>
            <span className="qpi-caps text-[var(--qpi-blue)]">{CTA.kicker}</span>
            <h2 className="qpi-display mt-3 text-[clamp(1.375rem,2.6vw,2rem)] leading-[1.08] text-[var(--qpi-ink)]">{CTA.heading}</h2>
            <form className="mt-6 flex flex-col gap-4">
              {fieldMeta("w9").map((f) => (
                <InputField key={f.id} f={f} />
              ))}
              <CtaButton className="mt-1 h-12 w-full rounded-md bg-[var(--qpi-blue)] text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[var(--qpi-ink)]" />
            </form>
          </div>
        </div>
      </section>
    ),
  },

  // 10 · Areas Band Beneath — no form at all; the button and the phone are
  // the ask, AREAS run beneath as a quiet typographic band.
  {
    name: "Areas Band Beneath",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-2xl text-center">
          <span className="qpi-caps text-[var(--qpi-blue)]">{CTA.kicker}</span>
          <h2 className="qpi-display mt-4 text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] text-[var(--qpi-ink)]">{CTA.heading}</h2>
          <p className="text-pretty mx-auto mt-5 max-w-lg text-[14px] leading-relaxed text-[var(--qpi-ink)]/60">{CTA.sub}</p>
          <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <CtaButton className="h-12 rounded-md bg-[var(--qpi-blue)] px-9 text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[var(--qpi-ink)]" />
            <a href={PHONE_HREF} className="text-[15px] font-semibold text-[var(--qpi-ink)] hover:text-[var(--qpi-blue)]" style={{ textDecoration: "none" }}>{PHONE}</a>
          </div>
          <div className="mx-auto mt-10 flex max-w-lg flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-6" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
            {AREAS.map((a, i) => (
              <span key={a} className="qpi-caps flex items-center gap-4 text-[10px] text-[var(--qpi-ink)]/45">
                {a}
                {i < AREAS.length - 1 && <span aria-hidden="true" className="text-[var(--qpi-ink)]/20">/</span>}
              </span>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 11 · Phone Portal — a giant arch outline frames the tappable phone
  // number like a portal you step into; no form.
  {
    name: "Phone Portal",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto text-center">
          <span className="qpi-caps text-[var(--qpi-blue)]">{CTA.kicker}</span>
          <h2 className="qpi-display text-balance mx-auto mt-3 max-w-md text-[clamp(1.375rem,2.6vw,2rem)] leading-[1.1] text-[var(--qpi-ink)]">
            {CTA.heading}
          </h2>
          <a
            href={PHONE_HREF}
            className="qpi-display mx-auto mt-7 flex items-center justify-center transition-colors hover:border-[var(--qpi-ink)]"
            style={{
              width: "min(300px, 72vw)",
              height: "clamp(190px, 26vh, 240px)",
              borderRadius: ARCH,
              border: "2px solid var(--qpi-blue)",
              color: "var(--qpi-ink)",
              fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
              textDecoration: "none",
            }}
          >
            {PHONE}
          </a>
          <p className="mt-5 text-[12px] text-[var(--qpi-ink)]/50">{EMAIL}</p>
        </div>
      </section>
    ),
  },

  // 12 · Boarding Pass — a dashed perforation splits the ask from the
  // form, tab-stub styled with punched circles at the seam.
  {
    name: "Boarding Pass",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto grid w-full max-w-3xl grid-cols-1 sm:grid-cols-[1.2fr_1fr] overflow-hidden" style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 14 }}>
          <div className="flex flex-col justify-center p-8 md:p-10">
            <span className="qpi-caps text-[var(--qpi-blue)]">{CTA.kicker}</span>
            <h2 className="qpi-display mt-3 text-[clamp(1.375rem,2.6vw,2rem)] leading-[1.1] text-[var(--qpi-ink)]">{CTA.heading}</h2>
            <p className="text-pretty mt-3 max-w-sm text-[12.5px] leading-relaxed text-[var(--qpi-ink)]/55">{CTA.sub}</p>
          </div>
          <div className="relative flex flex-col justify-center p-8 md:p-10" style={{ borderLeft: `2px dashed ${HAIRLINE}` }}>
            <span aria-hidden="true" className="absolute rounded-full bg-white" style={{ width: 20, height: 20, top: -10, left: -10, border: `1px solid ${HAIRLINE}` }} />
            <span aria-hidden="true" className="absolute rounded-full bg-white" style={{ width: 20, height: 20, bottom: -10, left: -10, border: `1px solid ${HAIRLINE}` }} />
            <form className="flex flex-col gap-3">
              {fieldMeta("w12")
                .slice(0, 2)
                .map((f) => (
                  <InputField key={f.id} f={f} />
                ))}
              <CtaButton className="mt-1 h-11 w-full rounded-md bg-[var(--qpi-blue)] text-[11px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[var(--qpi-ink)]" />
            </form>
          </div>
        </div>
      </section>
    ),
  },

  // 13 · Diagonal Wedge — a diagonally clipped photo wedge sits behind a
  // ruled form panel offset to the right.
  {
    name: "Diagonal Wedge",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 hidden md:block"
          style={{ width: "55%", clipPath: "polygon(0 0, 100% 0, 70% 100%, 0 100%)", overflow: "hidden" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_SRC} alt="Pool at dusk" className="h-full w-full object-cover" style={{ opacity: 0.9 }} />
        </div>
        <div className="relative ml-auto w-full max-w-md px-2 md:pr-4" style={{ zIndex: 10 }}>
          <span className="qpi-caps text-[var(--qpi-blue)]">{CTA.kicker}</span>
          <h2 className="qpi-display mt-3 text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.05] text-[var(--qpi-ink)]">{CTA.heading}</h2>
          <form className="mt-6 flex flex-col gap-4">
            {fieldMeta("w13").map((f) => (
              <InputField key={f.id} f={f} />
            ))}
            <CtaButton className="mt-1 h-12 w-full rounded-md bg-[var(--qpi-blue)] text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[var(--qpi-ink)]" />
          </form>
        </div>
      </section>
    ),
  },

  // 14 · Arch Peek — an arch photo cropped at the bottom edge peeks up
  // behind a centred floating form card.
  {
    name: "Arch Peek",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute left-1/2 bottom-0 overflow-hidden"
          style={{ width: "min(360px, 70vw)", height: "38%", borderRadius: `${ARCH}`, transform: "translateX(-50%)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_SRC} alt="Pool at dusk" className="h-full w-full object-cover" style={{ opacity: 0.35 }} />
        </div>
        <div className="relative mx-auto w-full max-w-sm rounded-2xl bg-white px-7 py-8 text-center" style={{ zIndex: 10, boxShadow: "0 20px 60px -30px rgba(25,60,90,0.35)", border: `1px solid ${HAIRLINE}` }}>
          <span className="qpi-caps text-[var(--qpi-blue)]">{CTA.kicker}</span>
          <h2 className="qpi-display mt-2 text-[clamp(1.25rem,2.2vw,1.625rem)] leading-[1.1] text-[var(--qpi-ink)]">{CTA.heading}</h2>
          <form className="mt-5 flex flex-col gap-3 text-left">
            {fieldMeta("w14")
              .slice(0, 3)
              .map((f) => (
                <InputField key={f.id} f={f} />
              ))}
            <CtaButton className="mt-1 h-11 w-full rounded-md bg-[var(--qpi-blue)] text-[11px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[var(--qpi-ink)]" />
          </form>
        </div>
      </section>
    ),
  },

  // 15 · Drawer Pull — the form reads as a drawer pulled out from the
  // right edge, the phone anchor sitting to its left.
  {
    name: "Drawer Pull",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto flex w-full max-w-4xl flex-col md:flex-row md:items-center gap-0">
          <div className="flex-1 md:pr-10">
            <span className="qpi-caps text-[var(--qpi-blue)]">{CTA.kicker}</span>
            <h2 className="qpi-display mt-3 text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.05] text-[var(--qpi-ink)]">{CTA.heading}</h2>
            <a href={PHONE_HREF} className="mt-4 inline-block text-[16px] font-semibold text-[var(--qpi-ink)] hover:text-[var(--qpi-blue)]" style={{ textDecoration: "none" }}>{PHONE}</a>
          </div>
          <form
            className="mt-8 md:mt-0 flex w-full max-w-xs shrink-0 flex-col gap-4 p-7"
            style={{ background: "#fff", border: `1px solid ${HAIRLINE}`, borderRadius: "16px 0 0 16px", boxShadow: "-16px 0 40px -28px rgba(25,60,90,0.4)" }}
          >
            {fieldMeta("w15").map((f) => (
              <InputField key={f.id} f={f} />
            ))}
            <CtaButton className="mt-1 h-11 w-full rounded-md bg-[var(--qpi-blue)] text-[11px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[var(--qpi-ink)]" />
          </form>
        </div>
      </section>
    ),
  },

  // 16 · Giant Arch Backdrop — a huge pale-blue arch silhouette behind a
  // minimal, centred form.
  {
    name: "Giant Arch Backdrop",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute left-1/2"
          style={{ bottom: 0, width: "min(620px, 90vw)", height: "62%", background: "rgba(24,120,166,0.07)", borderRadius: ARCH, transform: "translateX(-50%)", zIndex: 0 }}
        />
        <div className="relative mx-auto w-full max-w-md text-center" style={{ zIndex: 10 }}>
          <span className="qpi-caps text-[var(--qpi-blue)]">{CTA.kicker}</span>
          <h2 className="qpi-display mt-3 text-[clamp(1.625rem,3.2vw,2.375rem)] leading-[1.05] text-[var(--qpi-ink)]">{CTA.heading}</h2>
          <form className="mx-auto mt-7 flex flex-col gap-4 text-left">
            {fieldMeta("w16").map((f) => (
              <InputField key={f.id} f={f} />
            ))}
            <CtaButton className="mt-1 h-12 w-full rounded-md bg-[var(--qpi-blue)] text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[var(--qpi-ink)]" />
          </form>
        </div>
      </section>
    ),
  },

  // 17 · Classifieds Box Ad — a thin-bordered box, dense typographic
  // hierarchy, small form inside like a listing in the paper.
  {
    name: "Classifieds Box Ad",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-md px-7 py-8" style={{ border: `1.5px solid var(--qpi-ink)` }}>
          <div className="flex items-center justify-between" style={{ borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: 10 }}>
            <span className="qpi-caps text-[var(--qpi-blue)]">{CTA.kicker}</span>
            <span className="qpi-caps text-[var(--qpi-ink)]/40">{LICENCES.qbcc}</span>
          </div>
          <h2 className="qpi-display text-balance mt-4 text-[clamp(1.25rem,2.4vw,1.75rem)] leading-[1.1] text-[var(--qpi-ink)]">
            {CTA.heading}
          </h2>
          <p className="text-pretty mt-2 text-[12px] leading-relaxed text-[var(--qpi-ink)]/55">{CTA.sub}</p>
          <form className="mt-5 grid grid-cols-2 gap-3">
            {fieldMeta("w17").map((f) => (
              <InputField key={f.id} f={f} inputClass="h-10 w-full rounded-sm border border-black/15 bg-white px-3 text-[13px] text-[var(--qpi-ink)] outline-none transition-colors focus-visible:border-[var(--qpi-blue)] focus-visible:ring-2 focus-visible:ring-[var(--qpi-blue)]/25" />
            ))}
          </form>
          <CtaButton className="mt-4 h-11 w-full rounded-sm bg-[var(--qpi-ink)] text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[var(--qpi-blue)]" />
        </div>
      </section>
    ),
  },

  // 18 · Porthole Form — a contained circular dusk-photo porthole on a
  // white ground, a small round form plate overlapping its lower edge.
  {
    name: "Porthole Form",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="relative mx-auto" style={{ width: "min(280px, 60vw)" }}>
          <div className="overflow-hidden" style={{ width: "100%", aspectRatio: "1 / 1", borderRadius: "50%", border: "6px solid var(--qpi-ink)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={HERO_SRC} alt="Pool at dusk" className="h-full w-full object-cover" />
          </div>
          <form
            className="absolute flex flex-col items-center gap-3 px-6 py-6 text-center"
            style={{ right: "-18%", bottom: "-6%", width: 156, background: "#fff", borderRadius: "50%", aspectRatio: "1 / 1", justifyContent: "center", boxShadow: "0 16px 40px -20px rgba(25,60,90,0.4)", border: `1px solid ${HAIRLINE}` }}
          >
            <span className="qpi-caps text-[var(--qpi-blue)]" style={{ fontSize: 8 }}>{CTA.kicker}</span>
            <label htmlFor="w18-phone" className="sr-only">Phone</label>
            <input id="w18-phone" name="phone" type="tel" aria-label="Phone" className="h-9 w-full max-w-[112px] rounded-full border border-black/15 bg-white px-3 text-center text-[11px] text-[var(--qpi-ink)] outline-none transition-colors focus-visible:border-[var(--qpi-blue)] focus-visible:ring-2 focus-visible:ring-[var(--qpi-blue)]/25" />
            <CtaButton className="h-9 w-full max-w-[112px] rounded-full bg-[var(--qpi-blue)] text-[9px] font-semibold uppercase tracking-[0.06em] text-white transition-colors hover:bg-[var(--qpi-ink)]" />
          </form>
        </div>
        <div className="mx-auto mt-10 text-center">
          <span className="qpi-caps text-[var(--qpi-blue)]">{CTA.kicker}</span>
          <h2 className="qpi-display mt-2 text-[clamp(1.375rem,2.6vw,2rem)] leading-[1.08] text-[var(--qpi-ink)]">{CTA.heading}</h2>
        </div>
      </section>
    ),
  },

  // 19 · Compass Band — AREAS wrap in a ring around a centred phone and
  // button, no form fields at all.
  {
    name: "Compass Band",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-xl text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pb-7" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
            {AREAS.map((a, i) => (
              <span key={a} className="qpi-caps flex items-center gap-4 text-[10px] text-[var(--qpi-ink)]/45">
                {a}
                {i < AREAS.length - 1 && <span aria-hidden="true" className="text-[var(--qpi-ink)]/20">/</span>}
              </span>
            ))}
          </div>
          <span className="qpi-caps mt-7 block text-[var(--qpi-blue)]">{CTA.kicker}</span>
          <h2 className="qpi-display mt-3 text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.05] text-[var(--qpi-ink)]">{CTA.heading}</h2>
          <a href={PHONE_HREF} className="qpi-display mt-5 inline-block text-[clamp(1.5rem,3.6vw,2.25rem)] text-[var(--qpi-blue)] transition-colors hover:text-[var(--qpi-ink)]" style={{ textDecoration: "none" }}>
            {PHONE}
          </a>
          <CtaButton className="mx-auto mt-6 block h-12 rounded-md bg-[var(--qpi-ink)] px-9 text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[var(--qpi-blue)]" />
        </div>
      </section>
    ),
  },

  // 20 · Split Arch Gateway — two mirrored arches bookend the heading like
  // a gateway, the form standing centred beneath as if walking through.
  {
    name: "Split Arch Gateway",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto flex w-full max-w-2xl items-end justify-center gap-4">
          <div className="hidden sm:block overflow-hidden" style={{ width: 90, height: 130, borderRadius: ARCH, background: "rgba(24,120,166,0.08)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GALLERY_IMGS[2]} alt="A pool installed by QLD Pool Installs" className="h-full w-full object-cover" style={{ opacity: 0.9 }} />
          </div>
          <div className="text-center px-4">
            <span className="qpi-caps text-[var(--qpi-blue)]">{CTA.kicker}</span>
            <h2 className="qpi-display mt-2 text-[clamp(1.375rem,2.8vw,2rem)] leading-[1.05] text-[var(--qpi-ink)]">{CTA.heading}</h2>
          </div>
          <div className="hidden sm:block overflow-hidden" style={{ width: 90, height: 130, borderRadius: ARCH, background: "rgba(24,120,166,0.08)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GALLERY_IMGS[3]} alt="A pool installed by QLD Pool Installs" className="h-full w-full object-cover" style={{ opacity: 0.9 }} />
          </div>
        </div>
        <form className="mx-auto mt-8 grid w-full max-w-md grid-cols-2 gap-4">
          {fieldMeta("w20").map((f) => (
            <InputField key={f.id} f={f} />
          ))}
          <CtaButton className="col-span-2 mt-1 h-12 w-full rounded-md bg-[var(--qpi-blue)] text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[var(--qpi-ink)]" />
        </form>
      </section>
    ),
  },
];
