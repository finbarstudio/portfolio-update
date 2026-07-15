import { CTA, PHONE, PHONE_HREF, EMAIL, AREAS, HERO_SRC, GALLERY_IMGS, LICENCES, type Section } from "../kit";

/**
 * Design gallery — Section 9 · Contact CTA ("Ready to Start Your Pool Project?").
 * 25 distinct layout directions built only from kit copy/data. Every form is
 * presentational (no state, no handlers, no action) — this is a static mock.
 */

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
  labelClass = "qpi-caps text-[11px] text-[var(--qpi-ink)]/70",
  inputClass = "h-11 w-full rounded-md border border-black/15 bg-white px-3.5 text-[15px] text-[var(--qpi-ink)] outline-none transition-colors focus-visible:border-[var(--qpi-blue)] focus-visible:ring-2 focus-visible:ring-[var(--qpi-blue)]/25",
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

export const optionsCta: Section[] = [
  // 1 · Split: heading + sub left, 4-field form card right on white.
  {
    name: "Split heading / form card",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-12 px-6 md:grid-cols-2 md:gap-16">
          <div>
            <span className="qpi-caps text-[var(--qpi-blue)]">{CTA.kicker}</span>
            <h2 className="qpi-display mt-4 text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] text-[var(--qpi-ink)]">
              {CTA.heading}
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[var(--qpi-ink)]/70">{CTA.sub}</p>
          </div>
          <form className="rounded-2xl border border-black/10 bg-white p-8 shadow-[0_20px_60px_-30px_rgba(11,42,74,0.25)]">
            <div className="flex flex-col gap-5">
              {fieldMeta("o1").map((f) => (
                <InputField key={f.id} f={f} />
              ))}
            </div>
            <CtaButton className="mt-6 h-12 w-full rounded-md bg-[var(--qpi-blue)] text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[var(--qpi-ink)]" />
          </form>
        </div>
      </section>
    ),
  },

  // 2 · Full-bleed dusk photo with a white form card floating right.
  {
    name: "Full-bleed photo, floating card",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28">
        <div className="relative mx-auto aspect-[16/9] w-full max-w-[1400px] overflow-hidden md:aspect-[21/9]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/20" />
          <form className="absolute top-1/2 right-4 z-10 w-[calc(100%-2rem)] max-w-sm -translate-y-1/2 rounded-2xl bg-white p-7 md:right-10 md:w-auto">
            <span className="qpi-caps text-[var(--qpi-blue)]">{CTA.kicker}</span>
            <h2 className="qpi-display mt-2 text-[clamp(1.4rem,2.4vw,1.9rem)] leading-tight text-[var(--qpi-ink)]">
              {CTA.heading}
            </h2>
            <div className="mt-5 flex flex-col gap-4">
              {fieldMeta("o2").map((f) => (
                <InputField key={f.id} f={f} />
              ))}
            </div>
            <CtaButton className="mt-5 h-12 w-full rounded-md bg-[var(--qpi-blue)] text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[var(--qpi-ink)]" />
          </form>
        </div>
      </section>
    ),
  },

  // 3 · Navy full-bleed band, white type centred, form in one row of inputs.
  {
    name: "Navy band, centred row",
    node: (
      <section className="relative w-full bg-[var(--qpi-ink)] py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <span className="qpi-caps text-white/60">{CTA.kicker}</span>
          <h2 className="qpi-display mt-4 text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05] text-white">
            {CTA.heading}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/70">{CTA.sub}</p>
          <form className="mx-auto mt-9 flex max-w-3xl flex-col gap-4 md:flex-row md:items-end">
            {fieldMeta("o3").map((f) => (
              <InputField
                key={f.id}
                f={f}
                wrapClass="flex flex-1 flex-col gap-1.5 text-left"
                labelClass="qpi-caps text-[11px] text-white/60"
                inputClass="h-11 w-full rounded-md border border-white/25 bg-white/10 px-3.5 text-[15px] text-white outline-none transition-colors focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white/30"
              />
            ))}
            <CtaButton className="h-11 shrink-0 rounded-md bg-[var(--qpi-blue)] px-6 text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-white hover:text-[var(--qpi-ink)]" />
          </form>
        </div>
      </section>
    ),
  },

  // 4 · No form: enormous heading + a huge phone number as the CTA.
  {
    name: "Giant phone number, no form",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="qpi-caps text-[var(--qpi-blue)]">{CTA.kicker}</span>
          <h2 className="qpi-display mt-4 text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] text-[var(--qpi-ink)]">
            {CTA.heading}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-[var(--qpi-ink)]/70">{CTA.sub}</p>
          <a
            href={PHONE_HREF}
            className="qpi-display mt-10 inline-block text-[clamp(2.75rem,9vw,6.5rem)] leading-none text-[var(--qpi-blue)] transition-colors hover:text-[var(--qpi-ink)]"
          >
            {PHONE}
          </a>
          <p className="mt-4 text-[13px] text-[var(--qpi-ink)]/60">{EMAIL}</p>
        </div>
      </section>
    ),
  },

  // 5 · Heading left, a single stacked form column right, hairline-ruled inputs.
  {
    name: "Hairline-ruled form, split",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 md:grid-cols-2 md:gap-20">
          <div>
            <span className="qpi-caps text-[var(--qpi-blue)]">{CTA.kicker}</span>
            <h2 className="qpi-display mt-4 text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] text-[var(--qpi-ink)]">
              {CTA.heading}
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[var(--qpi-ink)]/70">{CTA.sub}</p>
          </div>
          <div>
            <div className="flex flex-col">
              {fieldMeta("o5").map((f) => (
                <InputField
                  key={f.id}
                  f={f}
                  wrapClass="flex flex-col gap-1.5 border-b border-black/15 py-4"
                  labelClass="qpi-caps text-[11px] text-[var(--qpi-ink)]/60"
                  inputClass="h-11 w-full border-0 bg-transparent px-0 text-[16px] text-[var(--qpi-ink)] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--qpi-blue)]/25"
                />
              ))}
            </div>
            <CtaButton className="mt-7 h-12 w-full rounded-md bg-[var(--qpi-blue)] text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[var(--qpi-ink)]" />
          </div>
        </div>
      </section>
    ),
  },

  // 6 · Centred: heading, sub, and a single row (Name / Phone / button).
  {
    name: "Centred single-row form",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <span className="qpi-caps text-[var(--qpi-blue)]">{CTA.kicker}</span>
          <h2 className="qpi-display mt-4 text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] text-[var(--qpi-ink)]">
            {CTA.heading}
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-[var(--qpi-ink)]/70">{CTA.sub}</p>
          <form className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
            {fieldMeta("o6")
              .slice(0, 2)
              .map((f) => (
                <InputField key={f.id} f={f} wrapClass="flex flex-1 flex-col gap-1.5 text-left" />
              ))}
            <CtaButton className="h-11 shrink-0 rounded-md bg-[var(--qpi-blue)] px-6 text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[var(--qpi-ink)] sm:self-end" />
          </form>
        </div>
      </section>
    ),
  },

  // 7 · Blue block CTA card inset on a white ground, form inside.
  {
    name: "Inset blue card",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-[28px] bg-[var(--qpi-blue)] px-8 py-12 md:px-16 md:py-16">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
              <div>
                <span className="qpi-caps text-white/70">{CTA.kicker}</span>
                <h2 className="qpi-display mt-4 text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[1.05] text-white">
                  {CTA.heading}
                </h2>
                <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/80">{CTA.sub}</p>
              </div>
              <form className="flex flex-col gap-4 rounded-2xl bg-white p-7">
                {fieldMeta("o7").map((f) => (
                  <InputField key={f.id} f={f} />
                ))}
                <CtaButton className="mt-1 h-12 w-full rounded-md bg-[var(--qpi-ink)] text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:opacity-90" />
              </form>
            </div>
          </div>
        </div>
      </section>
    ),
  },

  // 8 · Photo left half, form right half, edge to edge.
  {
    name: "Edge-to-edge photo split",
    node: (
      <section className="relative w-full bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative h-72 w-full md:h-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover" />
          </div>
          <div className="flex flex-col justify-center px-6 py-16 md:px-14 md:py-24">
            <span className="qpi-caps text-[var(--qpi-blue)]">{CTA.kicker}</span>
            <h2 className="qpi-display mt-4 text-[clamp(1.8rem,3.4vw,2.75rem)] leading-[1.08] text-[var(--qpi-ink)]">
              {CTA.heading}
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[var(--qpi-ink)]/70">{CTA.sub}</p>
            <form className="mt-7 flex flex-col gap-4">
              {fieldMeta("o8").map((f) => (
                <InputField key={f.id} f={f} />
              ))}
              <CtaButton className="mt-1 h-12 w-full rounded-md bg-[var(--qpi-blue)] text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[var(--qpi-ink)] md:w-auto md:self-start md:px-8" />
            </form>
          </div>
        </div>
      </section>
    ),
  },

  // 9 · Underlined (bottom-border only) inputs, very editorial, on off-white wash.
  {
    name: "Editorial underline, washed panel",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <div className="rounded-2xl bg-black/[0.03] px-6 py-12 md:px-14 md:py-16">
            <span className="qpi-caps text-[var(--qpi-blue)]">{CTA.kicker}</span>
            <h2 className="qpi-display mt-4 text-[clamp(1.9rem,3.6vw,2.75rem)] leading-[1.05] text-[var(--qpi-ink)]">
              {CTA.heading}
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-[var(--qpi-ink)]/70">{CTA.sub}</p>
            <form className="mt-8 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
              {fieldMeta("o9").map((f) => (
                <InputField
                  key={f.id}
                  f={f}
                  inputClass="h-11 w-full border-0 border-b border-black/20 bg-transparent px-0 text-[16px] text-[var(--qpi-ink)] outline-none transition-colors focus-visible:border-[var(--qpi-blue)] focus-visible:ring-0"
                />
              ))}
            </form>
            <CtaButton className="mt-8 h-12 rounded-md bg-[var(--qpi-blue)] px-8 text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[var(--qpi-ink)]" />
          </div>
        </div>
      </section>
    ),
  },

  // 10 · Big heading over a navy band with the AREAS listed as a quiet row beneath.
  {
    name: "Navy band with service areas",
    node: (
      <section className="relative w-full bg-[var(--qpi-ink)] py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <span className="qpi-caps text-white/60">{CTA.kicker}</span>
          <h2 className="qpi-display mt-4 text-[clamp(2.1rem,5vw,3.75rem)] leading-[1.03] text-white">
            {CTA.heading}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/70">{CTA.sub}</p>
          <CtaButton className="mt-8 h-12 rounded-md bg-[var(--qpi-blue)] px-8 text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-white hover:text-[var(--qpi-ink)]" />
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-white/15 pt-6">
            {AREAS.map((area, i) => (
              <span key={area} className="qpi-caps flex items-center gap-4 text-[11px] text-white/50">
                {area}
                {i < AREAS.length - 1 && <span className="text-white/25">/</span>}
              </span>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 11 · Two columns: form left, "call instead" phone + email + licences right.
  {
    name: "Form + call-instead panel",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 gap-10 rounded-2xl border border-black/10 md:grid-cols-2">
            <div className="p-8 md:p-10">
              <span className="qpi-caps text-[var(--qpi-blue)]">{CTA.kicker}</span>
              <h2 className="qpi-display mt-3 text-[clamp(1.6rem,2.8vw,2.25rem)] leading-[1.08] text-[var(--qpi-ink)]">
                {CTA.heading}
              </h2>
              <form className="mt-6 flex flex-col gap-4">
                {fieldMeta("o11").map((f) => (
                  <InputField key={f.id} f={f} />
                ))}
                <CtaButton className="mt-1 h-12 w-full rounded-md bg-[var(--qpi-blue)] text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[var(--qpi-ink)]" />
              </form>
            </div>
            <div className="flex flex-col justify-center border-t border-black/10 bg-black/[0.02] p-8 md:border-t-0 md:border-l md:p-10">
              <a
                href={PHONE_HREF}
                className="qpi-display block text-[clamp(1.6rem,3vw,2.25rem)] leading-tight text-[var(--qpi-ink)] hover:text-[var(--qpi-blue)]"
              >
                {PHONE}
              </a>
              <a href={`mailto:${EMAIL}`} className="mt-2 block text-[15px] text-[var(--qpi-ink)]/70 hover:text-[var(--qpi-blue)]">
                {EMAIL}
              </a>
              <div className="mt-6 flex flex-col gap-1 border-t border-black/10 pt-5 text-[12px] text-[var(--qpi-ink)]/50">
                <span>{LICENCES.qbcc}</span>
                <span>{LICENCES.nsw}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    ),
  },

  // 12 · Minimal: heading, sub, one button, vast whitespace, no form.
  {
    name: "Minimal, no form",
    node: (
      <section className="relative w-full bg-white py-28 md:py-40">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <span className="qpi-caps text-[var(--qpi-blue)]">{CTA.kicker}</span>
          <h2 className="qpi-display mt-5 text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] text-[var(--qpi-ink)]">
            {CTA.heading}
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-[15px] leading-relaxed text-[var(--qpi-ink)]/70">{CTA.sub}</p>
          <CtaButton className="mt-10 h-12 rounded-md bg-[var(--qpi-blue)] px-9 text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[var(--qpi-ink)]" />
        </div>
      </section>
    ),
  },

  // 13 · Full-bleed photo, dark scrim, centred white heading + outline button.
  {
    name: "Full-bleed scrim, outline button",
    node: (
      <section className="relative w-full">
        <div className="relative flex min-h-[440px] w-full items-center justify-center overflow-hidden md:min-h-[560px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
            <span className="qpi-caps text-white/70">{CTA.kicker}</span>
            <h2 className="qpi-display mt-4 text-[clamp(2rem,5vw,3.75rem)] leading-[1.05] text-white">
              {CTA.heading}
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-white/80">{CTA.sub}</p>
            <CtaButton className="mt-9 h-12 rounded-md border border-white bg-transparent px-9 text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-white hover:text-[var(--qpi-ink)]" />
          </div>
        </div>
      </section>
    ),
  },

  // 14 · Form as a wide 4-across grid of inputs with the button spanning beneath.
  {
    name: "Four-across grid form",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <span className="qpi-caps text-[var(--qpi-blue)]">{CTA.kicker}</span>
          <h2 className="qpi-display mt-4 text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] text-[var(--qpi-ink)]">
            {CTA.heading}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-[var(--qpi-ink)]/70">{CTA.sub}</p>
          <form className="mx-auto mt-9 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
            {fieldMeta("o14").map((f) => (
              <InputField key={f.id} f={f} wrapClass="flex flex-col gap-1.5 text-left" />
            ))}
            <CtaButton className="col-span-1 mt-1 h-12 w-full rounded-md bg-[var(--qpi-blue)] text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[var(--qpi-ink)] sm:col-span-2 md:col-span-4" />
          </form>
        </div>
      </section>
    ),
  },

  // 15 · Card with a thin navy border, heading inside, form beneath, on white.
  {
    name: "Thin-border card",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28">
        <div className="mx-auto max-w-2xl px-6">
          <div className="rounded-2xl border border-[var(--qpi-ink)]/20 px-7 py-10 text-center md:px-12 md:py-14">
            <span className="qpi-caps text-[var(--qpi-blue)]">{CTA.kicker}</span>
            <h2 className="qpi-display mt-4 text-[clamp(1.8rem,3.6vw,2.5rem)] leading-[1.08] text-[var(--qpi-ink)]">
              {CTA.heading}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-[var(--qpi-ink)]/70">{CTA.sub}</p>
            <form className="mt-8 flex flex-col gap-4 text-left">
              {fieldMeta("o15").map((f) => (
                <InputField key={f.id} f={f} />
              ))}
              <CtaButton className="mt-1 h-12 w-full rounded-md bg-[var(--qpi-blue)] text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[var(--qpi-ink)]" />
            </form>
          </div>
        </div>
      </section>
    ),
  },

  // 16 · Navy left panel (heading + licences), white right panel (form).
  {
    name: "Navy / white panel split",
    node: (
      <section className="relative w-full">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col justify-center bg-[var(--qpi-ink)] px-6 py-16 md:px-14 md:py-24">
            <span className="qpi-caps text-white/60">{CTA.kicker}</span>
            <h2 className="qpi-display mt-4 text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[1.05] text-white">
              {CTA.heading}
            </h2>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/70">{CTA.sub}</p>
            <div className="mt-8 flex flex-col gap-1 border-t border-white/15 pt-5 text-[12px] text-white/50">
              <span>{LICENCES.qbcc}</span>
              <span>{LICENCES.nsw}</span>
            </div>
          </div>
          <div className="flex flex-col justify-center bg-white px-6 py-16 md:px-14 md:py-24">
            <form className="flex flex-col gap-4">
              {fieldMeta("o16").map((f) => (
                <InputField key={f.id} f={f} />
              ))}
              <CtaButton className="mt-1 h-12 w-full rounded-md bg-[var(--qpi-blue)] text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[var(--qpi-ink)]" />
            </form>
          </div>
        </div>
      </section>
    ),
  },

  // 17 · Stacked: heading huge, then inputs as a single-line ruled ledger.
  {
    name: "Ledger-style stacked form",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28">
        <div className="mx-auto max-w-2xl px-6">
          <span className="qpi-caps text-[var(--qpi-blue)]">{CTA.kicker}</span>
          <h2 className="qpi-display mt-4 text-[clamp(2.1rem,5vw,3.75rem)] leading-[1.02] text-[var(--qpi-ink)]">
            {CTA.heading}
          </h2>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-[var(--qpi-ink)]/70">{CTA.sub}</p>
          <form className="mt-9 flex flex-col border-t border-[var(--qpi-ink)]/15">
            {fieldMeta("o17").map((f) => (
              <div
                key={f.id}
                className="flex items-center justify-between gap-6 border-b border-[var(--qpi-ink)]/15 py-4"
              >
                <label htmlFor={f.id} className="qpi-caps shrink-0 text-[12px] text-[var(--qpi-ink)]/60">
                  {f.label}
                </label>
                <input
                  id={f.id}
                  name={f.name}
                  type={f.type}
                  className="h-11 w-full max-w-xs border-0 bg-transparent px-0 text-right text-[16px] text-[var(--qpi-ink)] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--qpi-blue)]/25"
                />
              </div>
            ))}
          </form>
          <CtaButton className="mt-8 h-12 w-full rounded-md bg-[var(--qpi-blue)] text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[var(--qpi-ink)] sm:w-auto sm:px-9" />
        </div>
      </section>
    ),
  },

  // 18 · Phone-led: giant tappable phone number, form collapsed to Name + Phone.
  {
    name: "Phone-led, minimal fields",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <span className="qpi-caps text-[var(--qpi-blue)]">{CTA.kicker}</span>
          <h2 className="qpi-display mt-4 text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] text-[var(--qpi-ink)]">
            {CTA.heading}
          </h2>
          <a
            href={PHONE_HREF}
            className="qpi-display mt-6 inline-block text-[clamp(2.25rem,7vw,4.5rem)] leading-none text-[var(--qpi-blue)] transition-colors hover:text-[var(--qpi-ink)]"
          >
            {PHONE}
          </a>
          <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-[var(--qpi-ink)]/70">{CTA.sub}</p>
          <form className="mx-auto mt-8 flex max-w-md flex-col gap-4 sm:flex-row">
            {fieldMeta("o18")
              .slice(0, 2)
              .map((f) => (
                <InputField key={f.id} f={f} wrapClass="flex flex-1 flex-col gap-1.5 text-left" />
              ))}
          </form>
          <CtaButton className="mx-auto mt-5 h-12 w-full max-w-md rounded-md bg-[var(--qpi-blue)] text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[var(--qpi-ink)]" />
        </div>
      </section>
    ),
  },

  // 19 · Heading centred with AREAS as a hairline-separated row above it.
  {
    name: "Areas strip above heading",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <div className="mb-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-b border-black/10 pb-6">
            {AREAS.map((area, i) => (
              <span key={area} className="qpi-caps flex items-center gap-4 text-[11px] text-[var(--qpi-ink)]/50">
                {area}
                {i < AREAS.length - 1 && <span className="text-black/20">/</span>}
              </span>
            ))}
          </div>
          <span className="qpi-caps text-[var(--qpi-blue)]">{CTA.kicker}</span>
          <h2 className="qpi-display mt-4 text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] text-[var(--qpi-ink)]">
            {CTA.heading}
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-[var(--qpi-ink)]/70">{CTA.sub}</p>
          <CtaButton className="mt-9 h-12 rounded-md bg-[var(--qpi-blue)] px-9 text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[var(--qpi-ink)]" />
        </div>
      </section>
    ),
  },

  // 20 · Photo strip along the top, form beneath on white, centred measure.
  {
    name: "Photo strip + centred form",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28">
        <div className="mx-auto grid max-w-3xl grid-cols-5 gap-2 px-6">
          {GALLERY_IMGS.slice(0, 5).map((src) => (
            <div key={src} className="relative aspect-square overflow-hidden rounded-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="Pool installation project" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          ))}
        </div>
        <div className="mx-auto mt-12 max-w-xl px-6 text-center">
          <span className="qpi-caps text-[var(--qpi-blue)]">{CTA.kicker}</span>
          <h2 className="qpi-display mt-4 text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] text-[var(--qpi-ink)]">
            {CTA.heading}
          </h2>
          <p className="mx-auto mt-4 text-[15px] leading-relaxed text-[var(--qpi-ink)]/70">{CTA.sub}</p>
          <form className="mt-7 flex flex-col gap-4 text-left">
            {fieldMeta("o20").map((f) => (
              <InputField key={f.id} f={f} />
            ))}
            <CtaButton className="mt-1 h-12 w-full rounded-md bg-[var(--qpi-blue)] text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[var(--qpi-ink)]" />
          </form>
        </div>
      </section>
    ),
  },

  // 21 · Blue ground, white inputs with navy text, confident and bold.
  {
    name: "Blue ground, bold",
    node: (
      <section className="relative w-full bg-[var(--qpi-blue)] py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <span className="qpi-caps text-white/70">{CTA.kicker}</span>
          <h2 className="qpi-display mt-4 text-[clamp(2.1rem,5vw,3.75rem)] leading-[1.03] text-white">
            {CTA.heading}
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-white/85">{CTA.sub}</p>
          <form className="mx-auto mt-9 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
            {fieldMeta("o21").map((f) => (
              <InputField
                key={f.id}
                f={f}
                wrapClass="flex flex-col gap-1.5 text-left"
                labelClass="qpi-caps text-[11px] text-white/70"
                inputClass="h-11 w-full rounded-md border-0 bg-white px-3.5 text-[15px] text-[var(--qpi-ink)] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/60"
              />
            ))}
          </form>
          <CtaButton className="mt-6 h-12 rounded-md bg-[var(--qpi-ink)] px-9 text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-white hover:text-[var(--qpi-ink)]" />
        </div>
      </section>
    ),
  },

  // 22 · Split with a tall image column on the far right, form centre, heading left.
  {
    name: "Three-column: heading / form / image",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-stretch gap-10 px-6 md:grid-cols-[1fr_1fr_0.8fr] md:gap-8">
          <div className="flex flex-col justify-center">
            <span className="qpi-caps text-[var(--qpi-blue)]">{CTA.kicker}</span>
            <h2 className="qpi-display mt-4 text-[clamp(1.8rem,3.2vw,2.5rem)] leading-[1.08] text-[var(--qpi-ink)]">
              {CTA.heading}
            </h2>
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-[var(--qpi-ink)]/70">{CTA.sub}</p>
          </div>
          <form className="flex flex-col justify-center gap-4">
            {fieldMeta("o22").map((f) => (
              <InputField key={f.id} f={f} />
            ))}
            <CtaButton className="mt-1 h-12 w-full rounded-md bg-[var(--qpi-blue)] text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[var(--qpi-ink)]" />
          </form>
          <div className="relative hidden min-h-[420px] overflow-hidden rounded-2xl md:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </div>
      </section>
    ),
  },

  // 23 · Editorial: kicker + heading spanning full width, form in a narrow column.
  {
    name: "Editorial full-width heading, narrow form",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="border-b border-black/10 pb-10">
            <span className="qpi-caps text-[var(--qpi-blue)]">{CTA.kicker}</span>
            <h2 className="qpi-display mt-4 max-w-4xl text-[clamp(2.1rem,5vw,4rem)] leading-[1.02] text-[var(--qpi-ink)]">
              {CTA.heading}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-10 pt-10 md:grid-cols-2">
            <p className="max-w-md text-[15px] leading-relaxed text-[var(--qpi-ink)]/70">{CTA.sub}</p>
            <form className="mx-auto flex w-full max-w-sm flex-col gap-4 md:mr-0 md:ml-auto">
              {fieldMeta("o23").map((f) => (
                <InputField key={f.id} f={f} />
              ))}
              <CtaButton className="mt-1 h-12 w-full rounded-md bg-[var(--qpi-blue)] text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[var(--qpi-ink)]" />
            </form>
          </div>
        </div>
      </section>
    ),
  },

  // 24 · Compact strip: one line, heading left, button right, thin rules above/below.
  {
    name: "Compact bordered strip",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-5 border-y border-black/10 px-6 py-7 md:flex-row">
          <h2 className="qpi-display text-[clamp(1.25rem,2.2vw,1.75rem)] leading-tight text-[var(--qpi-ink)]">
            {CTA.heading}
          </h2>
          <CtaButton className="h-12 shrink-0 rounded-md bg-[var(--qpi-blue)] px-8 text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[var(--qpi-ink)]" />
        </div>
      </section>
    ),
  },

  // 25 · Two cards side by side: request-a-quote (form) and call-us (phone + email).
  {
    name: "Two cards: quote + call",
    node: (
      <section className="relative w-full bg-white py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-10 text-center">
            <span className="qpi-caps text-[var(--qpi-blue)]">{CTA.kicker}</span>
            <h2 className="qpi-display mt-4 text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] text-[var(--qpi-ink)]">
              {CTA.heading}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-[var(--qpi-ink)]/70">{CTA.sub}</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <form className="flex flex-col gap-4 rounded-2xl border border-black/10 p-8">
              {fieldMeta("o25").map((f) => (
                <InputField key={f.id} f={f} />
              ))}
              <CtaButton className="mt-1 h-12 w-full rounded-md bg-[var(--qpi-blue)] text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[var(--qpi-ink)]" />
            </form>
            <div className="flex flex-col justify-center gap-5 rounded-2xl border border-black/10 bg-black/[0.02] p-8">
              <a
                href={PHONE_HREF}
                className="qpi-display block text-[clamp(1.8rem,3.2vw,2.5rem)] leading-tight text-[var(--qpi-ink)] hover:text-[var(--qpi-blue)]"
              >
                {PHONE}
              </a>
              <a href={`mailto:${EMAIL}`} className="block text-[15px] text-[var(--qpi-ink)]/70 hover:text-[var(--qpi-blue)]">
                {EMAIL}
              </a>
              <div className="flex flex-col gap-1 border-t border-black/10 pt-5 text-[12px] text-[var(--qpi-ink)]/50">
                <span>{LICENCES.qbcc}</span>
                <span>{LICENCES.nsw}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    ),
  },
];
