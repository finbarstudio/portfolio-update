import { CTA, PHONE, PHONE_HREF, EMAIL, HERO_SRC, GALLERY_IMGS, AREAS } from "@/app/qldpools/site/sections/kit";

/**
 * Contact CTA — "Porthole Form" (gallery #43), ported from
 * app/qldpools/site/sections/options/cta2.tsx (entry index 17). The client
 * called this one out specifically, but flagged the original porthole form
 * as too minimal ("need more contact form info allowed"). The porthole
 * photo + overlapping circular quick-call plate stays intact as the visual
 * anchor; the actual enquiry form (Name, Phone, Email, Suburb, Project type,
 * Message) now sits in a comfortable column beside it rather than being
 * crammed into the round shape.
 *
 * Presentational only: no action/onSubmit/onChange, submit is a plain
 * type="button". Every field has a visible label with matching id/htmlFor
 * and a name, 44px+ touch targets, and a visible focus ring.
 */

const PROJECT_TYPES = ["Fibreglass pool", "Concrete pool", "Pool renovation", "Not sure yet"];

function fieldType(label: string): "text" | "tel" | "email" {
  if (label === "Phone") return "tel";
  if (label === "Email") return "email";
  return "text";
}

export default function Cta() {
  return (
    <section className="qpi-sec-cta qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
      <div className="mx-auto grid w-full max-w-4xl grid-cols-1 md:grid-cols-[240px_1fr] items-center gap-10 md:gap-14">
        {/* Porthole visual */}
        <div className="relative mx-auto md:mx-0" style={{ width: "min(220px, 55vw)" }}>
          <div
            aria-hidden="true"
            className="absolute overflow-hidden"
            style={{ width: "62%", aspectRatio: "1 / 1", borderRadius: "50%", left: "-14%", top: "10%", opacity: 0.5, zIndex: 0 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GALLERY_IMGS[1]} alt="" className="h-full w-full object-cover" />
          </div>
          <div
            className="relative overflow-hidden"
            style={{ width: "100%", aspectRatio: "1 / 1", borderRadius: "50%", border: "6px solid var(--qpi-ink)", zIndex: 10 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={HERO_SRC} alt="Pool at dusk" className="h-full w-full object-cover" />
          </div>
          <a
            href={PHONE_HREF}
            aria-label={`Call ${PHONE}`}
            className="absolute flex items-center justify-center text-center transition-colors hover:bg-[var(--qpi-ink)]"
            style={{
              right: "-10%",
              bottom: "-6%",
              width: 92,
              height: 92,
              background: "var(--qpi-blue)",
              borderRadius: "50%",
              boxShadow: "0 16px 40px -20px rgba(25,60,90,0.4)",
              zIndex: 20,
              textDecoration: "none",
            }}
          >
            <span className="qpi-caps text-white" style={{ fontSize: 9, lineHeight: 1.35 }}>
              {PHONE}
            </span>
          </a>
        </div>

        {/* Enquiry form */}
        <div>
          <span className="qpi-caps text-[var(--qpi-blue)]">{CTA.kicker}</span>
          <h2 className="qpi-display mt-2 text-[clamp(1.375rem,2.6vw,2rem)] leading-[1.08] text-[var(--qpi-ink)]">{CTA.heading}</h2>
          <p className="text-pretty mt-2 max-w-md text-[13px] leading-relaxed text-[var(--qpi-ink)]/60">{CTA.sub}</p>
          <a
            href={`mailto:${EMAIL}`}
            className="mt-2 inline-block text-[12px] text-[var(--qpi-ink)]/50 hover:text-[var(--qpi-blue)]"
            style={{ textDecoration: "none" }}
          >
            {EMAIL}
          </a>

          <form className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {CTA.fields.map((label) => {
              const id = `cta-${label.toLowerCase()}`;
              return (
                <div key={id} className="flex flex-col gap-1.5">
                  <label htmlFor={id} className="qpi-caps text-[10px] text-[var(--qpi-ink)]/65">
                    {label}
                  </label>
                  <input
                    id={id}
                    name={label.toLowerCase()}
                    type={fieldType(label)}
                    className="h-11 w-full rounded-md border border-[var(--qpi-ink)]/15 bg-white px-3.5 text-[14px] text-[var(--qpi-ink)] outline-none transition-colors focus-visible:border-[var(--qpi-blue)] focus-visible:ring-2 focus-visible:ring-[var(--qpi-blue)]/25"
                  />
                </div>
              );
            })}

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="cta-project-type" className="qpi-caps text-[10px] text-[var(--qpi-ink)]/65">
                Project type
              </label>
              <select
                id="cta-project-type"
                name="project-type"
                className="h-11 w-full rounded-md border border-[var(--qpi-ink)]/15 bg-white px-3.5 text-[14px] text-[var(--qpi-ink)] outline-none transition-colors focus-visible:border-[var(--qpi-blue)] focus-visible:ring-2 focus-visible:ring-[var(--qpi-blue)]/25"
              >
                <option value="">Select an option</option>
                {PROJECT_TYPES.map((t) => (
                  <option key={t} value={t.toLowerCase().replace(/\s+/g, "-")}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="cta-message" className="qpi-caps text-[10px] text-[var(--qpi-ink)]/65">
                Tell us about your project
              </label>
              <textarea
                id="cta-message"
                name="message"
                rows={2}
                className="w-full rounded-md border border-[var(--qpi-ink)]/15 bg-white px-3.5 py-3 text-[14px] leading-relaxed text-[var(--qpi-ink)] outline-none transition-colors focus-visible:border-[var(--qpi-blue)] focus-visible:ring-2 focus-visible:ring-[var(--qpi-blue)]/25"
              />
            </div>

            <button
              type="button"
              className="sm:col-span-2 mt-1 h-11 w-full rounded-full bg-[var(--qpi-blue)] px-6 text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[var(--qpi-ink)]"
            >
              {CTA.button}
            </button>
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
            {AREAS.map((a, i) => (
              <span key={a} className="qpi-caps flex items-center gap-3 text-[10px] text-[var(--qpi-ink)]/40">
                {a}
                {i < AREAS.length - 1 && <span aria-hidden="true" className="text-[var(--qpi-ink)]/20">/</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
