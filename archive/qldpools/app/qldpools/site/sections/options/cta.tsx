import { CTA, PHONE, PHONE_HREF, EMAIL, AREAS, HERO_SRC, GALLERY_IMGS, LICENCES, type Section } from "../kit";

/**
 * Contact CTA — full wipe, round three. This is the one the client cares
 * most about: he asked for "20 new cta" and for more info to be capturable,
 * so most options below take a real enquiry (Name, Phone, Email, Suburb,
 * Project type, Message) instead of the old 4-field form. Forms are
 * presentational only — no handlers, no action, buttons are type="button".
 * Every root is locked to one 100vh viewport, vertically centred, white
 * ground, ink/blue/aqua for inner blocks only.
 */

type Variant = "light" | "dark" | "blue";

const PROJECT_TYPES = ["Fibreglass pool", "Concrete pool", "Pool renovation", "Not sure yet"];

function fieldStyles(variant: Variant) {
  if (variant === "dark") {
    return {
      label: "qpi-caps text-[10.5px] text-white/65",
      control:
        "h-11 w-full rounded-md border border-white/25 bg-white/10 px-3.5 text-[14.5px] text-white outline-none transition-colors focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white/30",
      textarea:
        "w-full rounded-md border border-white/25 bg-white/10 px-3.5 py-2.5 text-[14.5px] text-white outline-none transition-colors focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white/30",
    };
  }
  if (variant === "blue") {
    return {
      label: "qpi-caps text-[10.5px] text-white/80",
      control:
        "h-11 w-full rounded-md border-0 bg-white px-3.5 text-[14.5px] text-[var(--qpi-ink)] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/70",
      textarea:
        "w-full rounded-md border-0 bg-white px-3.5 py-2.5 text-[14.5px] text-[var(--qpi-ink)] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/70",
    };
  }
  return {
    label: "qpi-caps text-[10.5px] text-[var(--qpi-ink)]/70",
    control:
      "h-11 w-full rounded-md border border-[var(--qpi-ink)]/15 bg-white px-3.5 text-[14.5px] text-[var(--qpi-ink)] outline-none transition-colors focus-visible:border-[var(--qpi-blue)] focus-visible:ring-2 focus-visible:ring-[var(--qpi-blue)]/25",
    textarea:
      "w-full rounded-md border border-[var(--qpi-ink)]/15 bg-white px-3.5 py-2.5 text-[14.5px] text-[var(--qpi-ink)] outline-none transition-colors focus-visible:border-[var(--qpi-blue)] focus-visible:ring-2 focus-visible:ring-[var(--qpi-blue)]/25",
  };
}

/** The full 6-field enquiry form: Name, Phone, Email, Suburb, Project type, Message. */
function FullFormFields({
  prefix,
  variant = "light",
  wrapClass = "flex flex-col gap-1.5",
  rows = 2,
}: {
  prefix: string;
  variant?: Variant;
  wrapClass?: string;
  rows?: number;
}) {
  const s = fieldStyles(variant);
  return (
    <>
      {[
        { name: "name", label: "Name", type: "text" as const },
        { name: "phone", label: "Phone", type: "tel" as const },
        { name: "email", label: "Email", type: "email" as const },
        { name: "suburb", label: "Suburb", type: "text" as const },
      ].map((f) => {
        const id = `${prefix}-${f.name}`;
        return (
          <div key={id} className={wrapClass}>
            <label htmlFor={id} className={s.label}>
              {f.label}
            </label>
            <input id={id} name={f.name} type={f.type} className={s.control} />
          </div>
        );
      })}
      <div className={wrapClass}>
        <label htmlFor={`${prefix}-project-type`} className={s.label}>
          Project type
        </label>
        <select id={`${prefix}-project-type`} name="project-type" className={s.control}>
          {PROJECT_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className={wrapClass}>
        <label htmlFor={`${prefix}-message`} className={s.label}>
          Message
        </label>
        <textarea id={`${prefix}-message`} name="message" rows={rows} className={s.textarea} />
      </div>
    </>
  );
}

function SubmitButton({ variant = "light", className }: { variant?: Variant; className: string }) {
  const styles: Record<Variant, string> = {
    light: "bg-[var(--qpi-blue)] text-white hover:bg-[var(--qpi-ink)]",
    dark: "bg-[var(--qpi-blue)] text-white hover:bg-white hover:text-[var(--qpi-ink)]",
    blue: "bg-[var(--qpi-ink)] text-white hover:opacity-90",
  };
  return (
    <button
      type="button"
      className={`h-11 min-w-[44px] rounded-md text-[12.5px] font-semibold uppercase tracking-[0.08em] transition-colors ${styles[variant]} ${className}`}
    >
      {CTA.button}
    </button>
  );
}

export const optionsCta: Section[] = [
  // 1 · Intake dossier — numbered field manifest inside a ruled ink box.
  {
    name: "Intake Dossier",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-lg rounded-2xl p-7 md:p-9" style={{ border: "1px solid rgba(25,60,90,0.18)" }}>
          <span className="qpi-caps text-[10.5px]" style={{ color: "var(--qpi-blue)" }}>{CTA.kicker}</span>
          <h2 className="qpi-display mt-3 text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.3rem,2.6vw,1.8rem)", lineHeight: 1.1 }}>
            {CTA.heading}
          </h2>
          <p className="mt-2 text-[13.5px] leading-relaxed" style={{ color: "var(--qpi-ink)", opacity: 0.65 }}>{CTA.sub}</p>
          <form className="mt-5 flex flex-col gap-3">
            <FullFormFields prefix="o1" rows={2} />
          </form>
          <SubmitButton className="mt-4 w-full" />
        </div>
      </section>
    ),
  },

  // 2 · Modular grid ledger — every field its own bordered cell.
  {
    name: "Modular Grid Ledger",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-2xl">
          <div className="text-center">
            <span className="qpi-caps text-[10.5px]" style={{ color: "var(--qpi-blue)" }}>{CTA.kicker}</span>
            <h2 className="qpi-display mt-3 text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem,3vw,2.25rem)", lineHeight: 1.08 }}>
              {CTA.heading}
            </h2>
          </div>
          <form className="mt-6 grid grid-cols-1 gap-0 rounded-xl sm:grid-cols-2" style={{ border: "1px solid rgba(25,60,90,0.15)" }}>
            <div className="flex flex-col gap-1.5 p-4" style={{ borderRight: "1px solid rgba(25,60,90,0.12)", borderBottom: "1px solid rgba(25,60,90,0.12)" }}>
              <label htmlFor="o2-name" className="qpi-caps text-[10.5px] text-[var(--qpi-ink)]/70">Name</label>
              <input id="o2-name" name="name" type="text" className="h-11 w-full rounded-md border border-[var(--qpi-ink)]/15 bg-white px-3 text-[14.5px] text-[var(--qpi-ink)] outline-none focus-visible:border-[var(--qpi-blue)] focus-visible:ring-2 focus-visible:ring-[var(--qpi-blue)]/25" />
            </div>
            <div className="flex flex-col gap-1.5 p-4" style={{ borderBottom: "1px solid rgba(25,60,90,0.12)" }}>
              <label htmlFor="o2-phone" className="qpi-caps text-[10.5px] text-[var(--qpi-ink)]/70">Phone</label>
              <input id="o2-phone" name="phone" type="tel" className="h-11 w-full rounded-md border border-[var(--qpi-ink)]/15 bg-white px-3 text-[14.5px] text-[var(--qpi-ink)] outline-none focus-visible:border-[var(--qpi-blue)] focus-visible:ring-2 focus-visible:ring-[var(--qpi-blue)]/25" />
            </div>
            <div className="flex flex-col gap-1.5 p-4" style={{ borderRight: "1px solid rgba(25,60,90,0.12)", borderBottom: "1px solid rgba(25,60,90,0.12)" }}>
              <label htmlFor="o2-email" className="qpi-caps text-[10.5px] text-[var(--qpi-ink)]/70">Email</label>
              <input id="o2-email" name="email" type="email" className="h-11 w-full rounded-md border border-[var(--qpi-ink)]/15 bg-white px-3 text-[14.5px] text-[var(--qpi-ink)] outline-none focus-visible:border-[var(--qpi-blue)] focus-visible:ring-2 focus-visible:ring-[var(--qpi-blue)]/25" />
            </div>
            <div className="flex flex-col gap-1.5 p-4" style={{ borderBottom: "1px solid rgba(25,60,90,0.12)" }}>
              <label htmlFor="o2-suburb" className="qpi-caps text-[10.5px] text-[var(--qpi-ink)]/70">Suburb</label>
              <input id="o2-suburb" name="suburb" type="text" className="h-11 w-full rounded-md border border-[var(--qpi-ink)]/15 bg-white px-3 text-[14.5px] text-[var(--qpi-ink)] outline-none focus-visible:border-[var(--qpi-blue)] focus-visible:ring-2 focus-visible:ring-[var(--qpi-blue)]/25" />
            </div>
            <div className="flex flex-col gap-1.5 p-4 sm:col-span-2" style={{ borderRight: "1px solid rgba(25,60,90,0.12)" }}>
              <label htmlFor="o2-project-type" className="qpi-caps text-[10.5px] text-[var(--qpi-ink)]/70">Project type</label>
              <select id="o2-project-type" name="project-type" className="h-11 w-full rounded-md border border-[var(--qpi-ink)]/15 bg-white px-3 text-[14.5px] text-[var(--qpi-ink)] outline-none focus-visible:border-[var(--qpi-blue)] focus-visible:ring-2 focus-visible:ring-[var(--qpi-blue)]/25">
                {PROJECT_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </form>
          <SubmitButton className="mx-auto mt-5 block px-10" />
        </div>
      </section>
    ),
  },

  // 3 · Full-width enquiry bar — ink bar, wrapped compact row.
  {
    name: "Full-Width Enquiry Bar",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-4xl text-center">
          <span className="qpi-caps text-[10.5px]" style={{ color: "var(--qpi-blue)" }}>{CTA.kicker}</span>
          <h2 className="qpi-display mt-3 text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem,3.4vw,2.5rem)", lineHeight: 1.06 }}>
            {CTA.heading}
          </h2>
        </div>
        <form className="mt-7 rounded-2xl px-6 py-6 md:px-8" style={{ background: "var(--qpi-ink)" }}>
          <div className="flex flex-wrap items-end justify-center gap-4">
            <div className="flex min-w-[140px] flex-1 flex-col gap-1.5">
              <label htmlFor="o3-name" className="qpi-caps text-[10.5px] text-white/65">Name</label>
              <input id="o3-name" name="name" type="text" className="h-11 w-full rounded-md border border-white/25 bg-white/10 px-3 text-[14.5px] text-white outline-none focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white/30" />
            </div>
            <div className="flex min-w-[120px] flex-1 flex-col gap-1.5">
              <label htmlFor="o3-phone" className="qpi-caps text-[10.5px] text-white/65">Phone</label>
              <input id="o3-phone" name="phone" type="tel" className="h-11 w-full rounded-md border border-white/25 bg-white/10 px-3 text-[14.5px] text-white outline-none focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white/30" />
            </div>
            <div className="flex min-w-[140px] flex-1 flex-col gap-1.5">
              <label htmlFor="o3-suburb" className="qpi-caps text-[10.5px] text-white/65">Suburb</label>
              <input id="o3-suburb" name="suburb" type="text" className="h-11 w-full rounded-md border border-white/25 bg-white/10 px-3 text-[14.5px] text-white outline-none focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white/30" />
            </div>
            <div className="flex min-w-[150px] flex-1 flex-col gap-1.5">
              <label htmlFor="o3-project-type" className="qpi-caps text-[10.5px] text-white/65">Project type</label>
              <select id="o3-project-type" name="project-type" className="h-11 w-full rounded-md border border-white/25 bg-white/10 px-3 text-[14.5px] text-white outline-none focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white/30">
                {PROJECT_TYPES.map((t) => (
                  <option key={t} className="text-[var(--qpi-ink)]">{t}</option>
                ))}
              </select>
            </div>
            <SubmitButton variant="dark" className="shrink-0 px-8" />
          </div>
        </form>
      </section>
    ),
  },

  // 4 · Quote manifest — dotted leader lines, ledger listing.
  {
    name: "Quote Manifest",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-lg">
          <span className="qpi-caps text-[10.5px]" style={{ color: "var(--qpi-blue)" }}>{CTA.kicker}</span>
          <h2 className="qpi-display mt-3 text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.4rem,2.8vw,2rem)", lineHeight: 1.08 }}>
            {CTA.heading}
          </h2>
          <form className="mt-6 flex flex-col">
            {["Name", "Phone", "Email", "Suburb"].map((label, i) => (
              <div key={label} className="flex items-baseline gap-3 border-b py-2.5" style={{ borderColor: "rgba(25,60,90,0.12)" }}>
                <label htmlFor={`o4-${label.toLowerCase()}`} className="qpi-caps w-16 shrink-0 text-[10.5px]" style={{ color: "var(--qpi-ink)", opacity: 0.55 }}>
                  {label}
                </label>
                <input
                  id={`o4-${label.toLowerCase()}`}
                  name={label.toLowerCase()}
                  type={i === 1 ? "tel" : i === 2 ? "email" : "text"}
                  className="h-9 w-full border-0 bg-transparent px-0 text-[14.5px] text-[var(--qpi-ink)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--qpi-blue)]/25"
                />
              </div>
            ))}
            <div className="flex items-baseline gap-3 border-b py-2.5" style={{ borderColor: "rgba(25,60,90,0.12)" }}>
              <label htmlFor="o4-project-type" className="qpi-caps w-16 shrink-0 text-[10.5px]" style={{ color: "var(--qpi-ink)", opacity: 0.55 }}>
                Project
              </label>
              <select id="o4-project-type" name="project-type" className="h-9 w-full border-0 bg-transparent px-0 text-[14.5px] text-[var(--qpi-ink)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--qpi-blue)]/25">
                {PROJECT_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="flex items-start gap-3 py-2.5">
              <label htmlFor="o4-message" className="qpi-caps w-16 shrink-0 pt-1 text-[10.5px]" style={{ color: "var(--qpi-ink)", opacity: 0.55 }}>
                Message
              </label>
              <textarea id="o4-message" name="message" rows={1} className="w-full border-0 bg-transparent px-0 text-[14.5px] text-[var(--qpi-ink)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--qpi-blue)]/25" />
            </div>
          </form>
          <SubmitButton className="mt-5 w-full" />
        </div>
      </section>
    ),
  },

  // 5 · Negative-space monolith — giant heading, tiny form pinned bottom-right.
  {
    name: "Negative Space Monolith",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-start gap-10 md:flex-row md:items-end md:justify-between">
          <h2 className="qpi-display text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(2rem,6vw,4.25rem)", lineHeight: 0.98, maxWidth: "12ch" }}>
            {CTA.heading}
          </h2>
          <form className="w-full max-w-[260px] shrink-0 rounded-xl p-5" style={{ border: "1px solid rgba(25,60,90,0.18)" }}>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <label htmlFor="o5-name" className="qpi-caps text-[9.5px] text-[var(--qpi-ink)]/60">Name</label>
                <input id="o5-name" name="name" type="text" className="h-10 w-full rounded-md border border-[var(--qpi-ink)]/15 bg-white px-3 text-[13.5px] text-[var(--qpi-ink)] outline-none focus-visible:border-[var(--qpi-blue)] focus-visible:ring-2 focus-visible:ring-[var(--qpi-blue)]/25" />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="o5-phone" className="qpi-caps text-[9.5px] text-[var(--qpi-ink)]/60">Phone</label>
                <input id="o5-phone" name="phone" type="tel" className="h-10 w-full rounded-md border border-[var(--qpi-ink)]/15 bg-white px-3 text-[13.5px] text-[var(--qpi-ink)] outline-none focus-visible:border-[var(--qpi-blue)] focus-visible:ring-2 focus-visible:ring-[var(--qpi-blue)]/25" />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="o5-suburb" className="qpi-caps text-[9.5px] text-[var(--qpi-ink)]/60">Suburb</label>
                <input id="o5-suburb" name="suburb" type="text" className="h-10 w-full rounded-md border border-[var(--qpi-ink)]/15 bg-white px-3 text-[13.5px] text-[var(--qpi-ink)] outline-none focus-visible:border-[var(--qpi-blue)] focus-visible:ring-2 focus-visible:ring-[var(--qpi-blue)]/25" />
              </div>
            </div>
            <SubmitButton className="mt-3 w-full" />
          </form>
        </div>
      </section>
    ),
  },

  // 6 · Suburb-first hero — suburb and project type lead, contact fields smaller row beneath.
  {
    name: "Suburb-First Hero",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-lg text-center">
          <span className="qpi-caps text-[10.5px]" style={{ color: "var(--qpi-blue)" }}>{CTA.kicker}</span>
          <h2 className="qpi-display mt-3 text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem,3vw,2.1rem)", lineHeight: 1.1 }}>
            {CTA.heading}
          </h2>
          <form className="mt-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5 text-left">
                <label htmlFor="o6-suburb" className="qpi-caps text-[10.5px] text-[var(--qpi-ink)]/70">Your suburb</label>
                <input id="o6-suburb" name="suburb" type="text" className="h-12 w-full rounded-md border border-[var(--qpi-ink)]/15 bg-white px-3.5 text-[15px] text-[var(--qpi-ink)] outline-none focus-visible:border-[var(--qpi-blue)] focus-visible:ring-2 focus-visible:ring-[var(--qpi-blue)]/25" />
              </div>
              <div className="flex flex-col gap-1.5 text-left">
                <label htmlFor="o6-project-type" className="qpi-caps text-[10.5px] text-[var(--qpi-ink)]/70">Project type</label>
                <select id="o6-project-type" name="project-type" className="h-12 w-full rounded-md border border-[var(--qpi-ink)]/15 bg-white px-3.5 text-[15px] text-[var(--qpi-ink)] outline-none focus-visible:border-[var(--qpi-blue)] focus-visible:ring-2 focus-visible:ring-[var(--qpi-blue)]/25">
                  {PROJECT_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5 text-left">
                <label htmlFor="o6-name" className="qpi-caps text-[10.5px] text-[var(--qpi-ink)]/70">Name</label>
                <input id="o6-name" name="name" type="text" className="h-10 w-full rounded-md border border-[var(--qpi-ink)]/15 bg-white px-3 text-[13.5px] text-[var(--qpi-ink)] outline-none focus-visible:border-[var(--qpi-blue)] focus-visible:ring-2 focus-visible:ring-[var(--qpi-blue)]/25" />
              </div>
              <div className="flex flex-col gap-1.5 text-left">
                <label htmlFor="o6-phone" className="qpi-caps text-[10.5px] text-[var(--qpi-ink)]/70">Phone</label>
                <input id="o6-phone" name="phone" type="tel" className="h-10 w-full rounded-md border border-[var(--qpi-ink)]/15 bg-white px-3 text-[13.5px] text-[var(--qpi-ink)] outline-none focus-visible:border-[var(--qpi-blue)] focus-visible:ring-2 focus-visible:ring-[var(--qpi-blue)]/25" />
              </div>
            </div>
          </form>
          <SubmitButton className="mt-5 w-full" />
        </div>
      </section>
    ),
  },

  // 7 · Framed certificate panel — double-rule frame, warranty-document feel.
  {
    name: "Framed Certificate Panel",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-lg p-2" style={{ border: "1px solid rgba(25,60,90,0.2)" }}>
          <div className="p-6 md:p-8" style={{ border: "1px solid rgba(25,60,90,0.2)" }}>
            <p className="qpi-caps text-center text-[10.5px]" style={{ color: "var(--qpi-blue)" }}>{CTA.kicker}</p>
            <h2 className="qpi-display mt-2 text-balance text-center" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.3rem,2.4vw,1.7rem)", lineHeight: 1.1 }}>
              {CTA.heading}
            </h2>
            <p className="mt-2 text-center text-[13px] leading-relaxed" style={{ color: "var(--qpi-ink)", opacity: 0.6 }}>{CTA.sub}</p>
            <form className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FullFormFields prefix="o7" rows={2} />
            </form>
            <SubmitButton className="mx-auto mt-5 block w-full" />
          </div>
        </div>
      </section>
    ),
  },

  // 8 · Phone marquee bleed — giant phone number as edge-bleeding texture, form beneath.
  {
    name: "Phone Marquee Bleed",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="relative w-full overflow-hidden">
          <p
            aria-hidden="true"
            className="qpi-display select-none whitespace-nowrap"
            style={{ color: "var(--qpi-ink)", opacity: 0.06, fontSize: "clamp(4rem,14vw,9rem)", lineHeight: 1, marginLeft: "-2vw" }}
          >
            {PHONE} {PHONE} {PHONE}
          </p>
          <div className="mx-auto -mt-10 w-full max-w-xl text-center md:-mt-14">
            <span className="qpi-caps text-[10.5px]" style={{ color: "var(--qpi-blue)" }}>{CTA.kicker}</span>
            <h2 className="qpi-display mt-3 text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem,3.2vw,2.25rem)", lineHeight: 1.08 }}>
              {CTA.heading}
            </h2>
            <form className="mx-auto mt-6 grid max-w-md grid-cols-1 gap-3 sm:grid-cols-2">
              <FullFormFields prefix="o8" wrapClass="flex flex-col gap-1.5 text-left" rows={2} />
            </form>
            <SubmitButton className="mt-4 px-9" />
          </div>
        </div>
      </section>
    ),
  },

  // 9 · Layered depth cards — offset solid card stacked behind the form card.
  {
    name: "Layered Depth Cards",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto grid w-full max-w-4xl grid-cols-1 items-center gap-10 md:grid-cols-2">
          <div>
            <span className="qpi-caps text-[10.5px]" style={{ color: "var(--qpi-blue)" }}>{CTA.kicker}</span>
            <h2 className="qpi-display mt-3 text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.6rem,3.4vw,2.5rem)", lineHeight: 1.06 }}>
              {CTA.heading}
            </h2>
            <p className="mt-4 max-w-sm text-[14px] leading-relaxed" style={{ color: "var(--qpi-ink)", opacity: 0.65 }}>{CTA.sub}</p>
          </div>
          <div className="relative">
            <div className="absolute -bottom-3 -right-3 h-full w-full rounded-2xl" style={{ background: "var(--qpi-blue)", opacity: 0.18 }} aria-hidden="true" />
            <form className="relative rounded-2xl bg-white p-6" style={{ border: "1px solid rgba(25,60,90,0.15)" }}>
              <div className="flex flex-col gap-3">
                <FullFormFields prefix="o9" rows={2} />
              </div>
              <SubmitButton className="mt-4 w-full" />
            </form>
          </div>
        </div>
      </section>
    ),
  },

  // 10 · Big numeral field count — oversized "6" beside a compact form.
  {
    name: "Big Numeral Field Count",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 md:flex-row md:items-start md:gap-10">
          <div className="shrink-0 text-center md:text-left">
            <span className="qpi-display block leading-none" style={{ color: "var(--qpi-blue)", fontSize: "clamp(4rem,10vw,7rem)" }}>6</span>
            <span className="qpi-caps -mt-2 block text-[10.5px]" style={{ color: "var(--qpi-ink)", opacity: 0.5 }}>fields, one quote</span>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="qpi-display text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.4rem,2.8vw,2rem)", lineHeight: 1.1 }}>
              {CTA.heading}
            </h2>
            <form className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FullFormFields prefix="o10" rows={2} />
            </form>
            <SubmitButton className="mt-4 w-full sm:w-auto sm:px-9" />
          </div>
        </div>
      </section>
    ),
  },

  // 11 · Dense editorial index — margin numerals, kicker/heading/licences left, form right.
  {
    name: "Dense Editorial Index",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-10 md:grid-cols-[0.9fr_1.1fr]">
          <div>
            <span className="qpi-caps text-[10.5px]" style={{ color: "var(--qpi-blue)" }}>{CTA.kicker}</span>
            <h2 className="qpi-display mt-3 text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem,3vw,2.1rem)", lineHeight: 1.08 }}>
              {CTA.heading}
            </h2>
            <p className="mt-3 max-w-xs text-[13.5px] leading-relaxed" style={{ color: "var(--qpi-ink)", opacity: 0.65 }}>{CTA.sub}</p>
            <div className="mt-5 flex flex-col gap-1 border-t pt-3 text-[11px]" style={{ borderColor: "rgba(25,60,90,0.12)", color: "var(--qpi-ink)", opacity: 0.5 }}>
              <span>{LICENCES.qbcc}</span>
              <span>{LICENCES.nsw}</span>
            </div>
          </div>
          <form className="flex flex-col gap-3">
            <FullFormFields prefix="o11" rows={2} />
            <SubmitButton className="mt-1 w-full" />
          </form>
        </div>
      </section>
    ),
  },

  // 12 · Vertical split aqua card — dark ink card, aqua accent labels, white inputs.
  {
    name: "Aqua Accent Dark Card",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-lg rounded-2xl p-7 md:p-9" style={{ background: "var(--qpi-ink)" }}>
          <span className="qpi-caps text-[10.5px]" style={{ color: "var(--qpi-aqua)" }}>{CTA.kicker}</span>
          <h2 className="qpi-display mt-3 text-balance text-white" style={{ fontSize: "clamp(1.4rem,2.8vw,2rem)", lineHeight: 1.08 }}>
            {CTA.heading}
          </h2>
          <form className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FullFormFields prefix="o12" variant="dark" rows={2} />
          </form>
          <SubmitButton variant="dark" className="mt-4 w-full" />
        </div>
      </section>
    ),
  },

  // 13 · Underlined manifest grid — dense 3-column bottom-border inputs with numerals.
  {
    name: "Underlined Manifest Grid",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-2xl text-center">
          <span className="qpi-caps text-[10.5px]" style={{ color: "var(--qpi-blue)" }}>{CTA.kicker}</span>
          <h2 className="qpi-display mt-3 text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem,3vw,2.25rem)", lineHeight: 1.08 }}>
            {CTA.heading}
          </h2>
        </div>
        <form className="mx-auto mt-7 grid max-w-2xl grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3">
          {[
            { n: "01", label: "Name", id: "o13-name", type: "text" as const },
            { n: "02", label: "Phone", id: "o13-phone", type: "tel" as const },
            { n: "03", label: "Email", id: "o13-email", type: "email" as const },
            { n: "04", label: "Suburb", id: "o13-suburb", type: "text" as const },
          ].map((f) => (
            <div key={f.id} className="flex flex-col gap-1.5 text-left">
              <label htmlFor={f.id} className="qpi-caps flex items-baseline gap-2 text-[10.5px] text-[var(--qpi-ink)]/60">
                <span style={{ color: "var(--qpi-blue)" }}>{f.n}</span>
                {f.label}
              </label>
              <input id={f.id} name={f.label.toLowerCase()} type={f.type} className="h-10 w-full border-0 border-b bg-transparent px-0 text-[14.5px] text-[var(--qpi-ink)] outline-none focus-visible:ring-0" style={{ borderColor: "rgba(25,60,90,0.25)" }} />
            </div>
          ))}
          <div className="flex flex-col gap-1.5 text-left">
            <label htmlFor="o13-project-type" className="qpi-caps flex items-baseline gap-2 text-[10.5px] text-[var(--qpi-ink)]/60">
              <span style={{ color: "var(--qpi-blue)" }}>05</span>
              Project type
            </label>
            <select id="o13-project-type" name="project-type" className="h-10 w-full border-0 border-b bg-transparent px-0 text-[14.5px] text-[var(--qpi-ink)] outline-none focus-visible:ring-0" style={{ borderColor: "rgba(25,60,90,0.25)" }}>
              {PROJECT_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5 text-left sm:col-span-2">
            <label htmlFor="o13-message" className="qpi-caps flex items-baseline gap-2 text-[10.5px] text-[var(--qpi-ink)]/60">
              <span style={{ color: "var(--qpi-blue)" }}>06</span>
              Message
            </label>
            <input id="o13-message" name="message" type="text" className="h-10 w-full border-0 border-b bg-transparent px-0 text-[14.5px] text-[var(--qpi-ink)] outline-none focus-visible:ring-0" style={{ borderColor: "rgba(25,60,90,0.25)" }} />
          </div>
        </form>
        <SubmitButton className="mx-auto mt-6 block px-9" />
      </section>
    ),
  },

  // 14 · Statement bleed, no form — huge heading running off the right edge, phone-led.
  {
    name: "Statement Bleed, No Form",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="w-full overflow-hidden">
          <span className="qpi-caps text-[10.5px]" style={{ color: "var(--qpi-blue)" }}>{CTA.kicker}</span>
          <h2 className="qpi-display mt-4 whitespace-nowrap" style={{ color: "var(--qpi-ink)", fontSize: "clamp(2.25rem,7vw,5.5rem)", lineHeight: 0.98 }}>
            {CTA.heading}
          </h2>
          <p className="mt-6 max-w-md text-[14.5px] leading-relaxed" style={{ color: "var(--qpi-ink)", opacity: 0.65 }}>{CTA.sub}</p>
          <a href={PHONE_HREF} className="mt-6 inline-flex h-12 w-fit items-center rounded-md px-8 text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:opacity-90" style={{ background: "var(--qpi-blue)" }}>
            Call {PHONE}
          </a>
        </div>
      </section>
    ),
  },

  // 15 · Minimal ticket card — thin border, phone + email only, extreme negative space.
  {
    name: "Minimal Ticket Card",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-xs rounded-xl p-8 text-center" style={{ border: "1px solid rgba(25,60,90,0.18)" }}>
          <span className="qpi-caps text-[10px]" style={{ color: "var(--qpi-ink)", opacity: 0.45 }}>{CTA.kicker}</span>
          <p className="qpi-display mt-3 text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.1rem,2vw,1.4rem)", lineHeight: 1.15 }}>
            {CTA.heading}
          </p>
          <a href={PHONE_HREF} className="qpi-display mt-6 block text-[clamp(1.5rem,3.4vw,2rem)] leading-tight" style={{ color: "var(--qpi-blue)" }}>
            {PHONE}
          </a>
          <a href={`mailto:${EMAIL}`} className="mt-2 block text-[12.5px]" style={{ color: "var(--qpi-ink)", opacity: 0.6 }}>{EMAIL}</a>
        </div>
      </section>
    ),
  },

  // 16 · Two-tone reversed card — ink top half, white bottom half, form spans the seam.
  {
    name: "Two-Tone Reversed Card",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-lg overflow-hidden rounded-2xl" style={{ border: "1px solid rgba(25,60,90,0.15)" }}>
          <div className="px-7 pb-8 pt-7 text-center" style={{ background: "var(--qpi-ink)" }}>
            <span className="qpi-caps text-[10.5px]" style={{ color: "var(--qpi-aqua)" }}>{CTA.kicker}</span>
            <h2 className="qpi-display mt-2 text-balance text-white" style={{ fontSize: "clamp(1.4rem,2.6vw,1.8rem)", lineHeight: 1.1 }}>
              {CTA.heading}
            </h2>
          </div>
          <form className="grid grid-cols-1 gap-3 bg-white p-7 sm:grid-cols-2">
            <FullFormFields prefix="o16" rows={2} />
          </form>
          <SubmitButton className="mx-7 mb-7 block" />
        </div>
      </section>
    ),
  },

  // 17 · Wide belt form — one full-gutter row of all fields, wraps on mobile.
  {
    name: "Wide Belt Form",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="text-center">
          <span className="qpi-caps text-[10.5px]" style={{ color: "var(--qpi-blue)" }}>{CTA.kicker}</span>
          <h2 className="qpi-display mt-3 text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem,3.4vw,2.5rem)", lineHeight: 1.06 }}>
            {CTA.heading}
          </h2>
        </div>
        <form className="mt-7 flex w-full flex-wrap items-end justify-center gap-4 border-t border-b py-6" style={{ borderColor: "rgba(25,60,90,0.12)" }}>
          <div className="flex min-w-[130px] flex-1 flex-col gap-1.5">
            <label htmlFor="o17-name" className="qpi-caps text-[10.5px] text-[var(--qpi-ink)]/60">Name</label>
            <input id="o17-name" name="name" type="text" className="h-11 w-full rounded-md border border-[var(--qpi-ink)]/15 bg-white px-3 text-[14.5px] text-[var(--qpi-ink)] outline-none focus-visible:border-[var(--qpi-blue)] focus-visible:ring-2 focus-visible:ring-[var(--qpi-blue)]/25" />
          </div>
          <div className="flex min-w-[120px] flex-1 flex-col gap-1.5">
            <label htmlFor="o17-phone" className="qpi-caps text-[10.5px] text-[var(--qpi-ink)]/60">Phone</label>
            <input id="o17-phone" name="phone" type="tel" className="h-11 w-full rounded-md border border-[var(--qpi-ink)]/15 bg-white px-3 text-[14.5px] text-[var(--qpi-ink)] outline-none focus-visible:border-[var(--qpi-blue)] focus-visible:ring-2 focus-visible:ring-[var(--qpi-blue)]/25" />
          </div>
          <div className="flex min-w-[140px] flex-1 flex-col gap-1.5">
            <label htmlFor="o17-email" className="qpi-caps text-[10.5px] text-[var(--qpi-ink)]/60">Email</label>
            <input id="o17-email" name="email" type="email" className="h-11 w-full rounded-md border border-[var(--qpi-ink)]/15 bg-white px-3 text-[14.5px] text-[var(--qpi-ink)] outline-none focus-visible:border-[var(--qpi-blue)] focus-visible:ring-2 focus-visible:ring-[var(--qpi-blue)]/25" />
          </div>
          <div className="flex min-w-[130px] flex-1 flex-col gap-1.5">
            <label htmlFor="o17-suburb" className="qpi-caps text-[10.5px] text-[var(--qpi-ink)]/60">Suburb</label>
            <input id="o17-suburb" name="suburb" type="text" className="h-11 w-full rounded-md border border-[var(--qpi-ink)]/15 bg-white px-3 text-[14.5px] text-[var(--qpi-ink)] outline-none focus-visible:border-[var(--qpi-blue)] focus-visible:ring-2 focus-visible:ring-[var(--qpi-blue)]/25" />
          </div>
          <div className="flex min-w-[160px] flex-1 flex-col gap-1.5">
            <label htmlFor="o17-project-type" className="qpi-caps text-[10.5px] text-[var(--qpi-ink)]/60">Project type</label>
            <select id="o17-project-type" name="project-type" className="h-11 w-full rounded-md border border-[var(--qpi-ink)]/15 bg-white px-3 text-[14.5px] text-[var(--qpi-ink)] outline-none focus-visible:border-[var(--qpi-blue)] focus-visible:ring-2 focus-visible:ring-[var(--qpi-blue)]/25">
              {PROJECT_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <SubmitButton className="shrink-0 px-8" />
        </form>
      </section>
    ),
  },

  // 18 · Centred pill cluster — rounded-full inputs arranged as a wrapped cluster.
  {
    name: "Centred Pill Cluster Form",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-xl text-center">
          <span className="qpi-caps text-[10.5px]" style={{ color: "var(--qpi-blue)" }}>{CTA.kicker}</span>
          <h2 className="qpi-display mt-3 text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem,3vw,2.25rem)", lineHeight: 1.08 }}>
            {CTA.heading}
          </h2>
          <form className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <input id="o18-name" name="name" type="text" aria-label="Name" className="h-11 w-36 rounded-full border border-[var(--qpi-ink)]/15 bg-white px-4 text-center text-[13.5px] text-[var(--qpi-ink)] outline-none focus-visible:border-[var(--qpi-blue)] focus-visible:ring-2 focus-visible:ring-[var(--qpi-blue)]/25" />
            <input id="o18-phone" name="phone" type="tel" aria-label="Phone" className="h-11 w-36 rounded-full border border-[var(--qpi-ink)]/15 bg-white px-4 text-center text-[13.5px] text-[var(--qpi-ink)] outline-none focus-visible:border-[var(--qpi-blue)] focus-visible:ring-2 focus-visible:ring-[var(--qpi-blue)]/25" />
            <input id="o18-suburb" name="suburb" type="text" aria-label="Suburb" className="h-11 w-36 rounded-full border border-[var(--qpi-ink)]/15 bg-white px-4 text-center text-[13.5px] text-[var(--qpi-ink)] outline-none focus-visible:border-[var(--qpi-blue)] focus-visible:ring-2 focus-visible:ring-[var(--qpi-blue)]/25" />
            <select id="o18-project-type" name="project-type" aria-label="Project type" className="h-11 w-44 rounded-full border border-[var(--qpi-ink)]/15 bg-white px-4 text-center text-[13.5px] text-[var(--qpi-ink)] outline-none focus-visible:border-[var(--qpi-blue)] focus-visible:ring-2 focus-visible:ring-[var(--qpi-blue)]/25">
              {PROJECT_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </form>
          <p className="mt-4 text-[11.5px]" style={{ color: "var(--qpi-ink)", opacity: 0.5 }}>Name, phone, suburb and project type is all we need</p>
          <SubmitButton className="mt-3 px-9" />
        </div>
      </section>
    ),
  },

  // 19 · Data strip sidebar — thin ink sidebar with contact facts, wide white form beside.
  {
    name: "Data Strip Sidebar",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto grid w-full max-w-3xl grid-cols-1 overflow-hidden rounded-2xl md:grid-cols-[0.7fr_1.3fr]" style={{ border: "1px solid rgba(25,60,90,0.15)" }}>
          <div className="flex flex-col justify-center gap-4 p-6" style={{ background: "var(--qpi-ink)" }}>
            <a href={PHONE_HREF} className="qpi-display block text-[clamp(1.2rem,2.2vw,1.6rem)] leading-tight text-white">{PHONE}</a>
            <a href={`mailto:${EMAIL}`} className="block text-[12px] text-white/70">{EMAIL}</a>
            <div className="flex flex-col gap-1 border-t border-white/15 pt-3 text-[10.5px] text-white/50">
              <span>{LICENCES.qbcc}</span>
              <span>{LICENCES.nsw}</span>
            </div>
          </div>
          <form className="flex flex-col justify-center gap-3 p-6">
            <FullFormFields prefix="o19" rows={2} />
            <SubmitButton className="mt-1 w-full" />
          </form>
        </div>
      </section>
    ),
  },

  // 20 · Whisper quiet, big button — tiny copy, one oversized button, no fields.
  {
    name: "Whisper Quiet, Big Button",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-md text-center">
          <p className="text-[12px]" style={{ color: "var(--qpi-ink)", opacity: 0.55 }}>{CTA.sub}</p>
          <a
            href={PHONE_HREF}
            className="mt-6 inline-flex h-16 w-full items-center justify-center rounded-full text-[15px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[var(--qpi-ink)]"
            style={{ background: "var(--qpi-blue)" }}
          >
            {CTA.button}
          </a>
          <p className="mt-4 text-[11.5px]" style={{ color: "var(--qpi-ink)", opacity: 0.45 }}>Or call {PHONE}</p>
        </div>
      </section>
    ),
  },
];
