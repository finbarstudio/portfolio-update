import { FOOTER, AREAS, LICENCES, PHONE, PHONE_HREF, EMAIL, LOGO_DARK, LOGO_WHITE, TAGLINE, GALLERY_IMGS, type Section } from "../kit";

/**
 * Footer — full wipe, round three. All prior experiments (the 45 options
 * previously in this file + footer2.tsx) are retired; every layout below is
 * a new structural idea. Two fixes from his review of the earlier set: the
 * footer read "much too narrow" (fixed here — every option runs the full
 * gutter width, inner max-width 1400px+ or none at all, justify-between
 * layouts pushed to the true edges instead of centred narrow columns), and
 * it had "way too much bottom space, up against bottom" (fixed by keeping
 * the root's own py-16/md:py-20 as the only air, never adding more beneath
 * the content). Every root is a <footer>, one 100vh viewport, vertically
 * centred, white ground, ink/blue/aqua for inner blocks only. Every option
 * keeps the "Site by finbar.studio" credit and the literal "© 2026 QLD Pool
 * Installs" copyright line.
 */

function Credit({ tone = "ink" }: { tone?: "ink" | "white" }) {
  const c = tone === "white" ? "text-white/45" : "text-[var(--qpi-ink)]/45";
  return (
    <p className={`text-[11px] ${c}`}>
      © 2026 QLD Pool Installs · Site by finbar.studio
    </p>
  );
}

export const optionsFooter: Section[] = [
  // 1 · Three-belt rows — logo/tagline, nav spread edge to edge, legal, each a full-width band.
  {
    name: "Three-Belt Rows",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto flex w-full max-w-none flex-col gap-5">
          <div className="flex flex-col items-start justify-between gap-3 border-t pt-5 sm:flex-row sm:items-center" style={{ borderColor: "rgba(25,60,90,0.12)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-7 w-auto" />
            <span className="text-[13px]" style={{ color: "var(--qpi-ink)", opacity: 0.6 }}>{TAGLINE}</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-5" style={{ borderColor: "rgba(25,60,90,0.12)" }}>
            {FOOTER.nav.map((item) => (
              <span key={item} className="qpi-caps text-[11px]" style={{ color: "var(--qpi-ink)" }}>{item}</span>
            ))}
          </div>
          <div className="flex flex-col items-start justify-between gap-2 border-t pt-5 sm:flex-row sm:items-center" style={{ borderColor: "rgba(25,60,90,0.12)" }}>
            <Credit />
            <span className="text-[11px]" style={{ color: "var(--qpi-ink)", opacity: 0.45 }}>{LICENCES.qbcc}</span>
          </div>
        </div>
      </footer>
    ),
  },

  // 2 · Mega nav marquee row — logo left, nav spread large, contact right, one wide line.
  {
    name: "Mega Nav Marquee Row",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto flex w-full max-w-none flex-col gap-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-8 w-auto" />
            <a href={PHONE_HREF} className="qpi-display text-[clamp(1.25rem,2.6vw,1.9rem)] leading-none" style={{ color: "var(--qpi-blue)" }}>{PHONE}</a>
          </div>
          <nav className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3 border-t pt-6" style={{ borderColor: "rgba(25,60,90,0.12)" }} aria-label="Footer">
            {FOOTER.nav.map((item) => (
              <span key={item} className="qpi-display" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1rem,2vw,1.4rem)" }}>{item}</span>
            ))}
          </nav>
          <div className="flex items-center justify-between border-t pt-4" style={{ borderColor: "rgba(25,60,90,0.12)" }}>
            <Credit />
            <span className="text-[11px]" style={{ color: "var(--qpi-ink)", opacity: 0.4 }}>{LICENCES.qbcc} · {LICENCES.nsw}</span>
          </div>
        </div>
      </footer>
    ),
  },

  // 3 · Directory columns wide — five equal columns spanning the full width.
  {
    name: "Directory Columns Wide",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto grid w-full max-w-none grid-cols-2 gap-x-6 gap-y-8 border-t pt-8 sm:grid-cols-3 md:grid-cols-5" style={{ borderColor: "rgba(25,60,90,0.12)" }}>
          <div className="col-span-2 sm:col-span-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-7 w-auto" />
            <p className="mt-3 max-w-[22ch] text-[12px] leading-relaxed" style={{ color: "var(--qpi-ink)", opacity: 0.6 }}>{FOOTER.blurb}</p>
          </div>
          <div>
            <p className="qpi-caps text-[10px]" style={{ color: "var(--qpi-ink)", opacity: 0.4 }}>Navigate</p>
            <ul className="m-0 mt-2.5 flex list-none flex-col gap-1.5 p-0">
              {FOOTER.nav.slice(0, 3).map((item) => (
                <li key={item} className="text-[12.5px]" style={{ color: "var(--qpi-ink)" }}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="qpi-caps text-[10px]" style={{ color: "var(--qpi-ink)", opacity: 0.4 }}>More</p>
            <ul className="m-0 mt-2.5 flex list-none flex-col gap-1.5 p-0">
              {FOOTER.nav.slice(3).map((item) => (
                <li key={item} className="text-[12.5px]" style={{ color: "var(--qpi-ink)" }}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="qpi-caps text-[10px]" style={{ color: "var(--qpi-ink)", opacity: 0.4 }}>Contact</p>
            <a href={PHONE_HREF} className="mt-2.5 block text-[12.5px]" style={{ color: "var(--qpi-ink)" }}>{PHONE}</a>
            <a href={`mailto:${EMAIL}`} className="mt-1 block text-[12.5px]" style={{ color: "var(--qpi-ink)" }}>{EMAIL}</a>
          </div>
        </div>
        <div className="mx-auto mt-8 flex w-full max-w-none items-center justify-between border-t pt-4" style={{ borderColor: "rgba(25,60,90,0.12)" }}>
          <Credit />
          <span className="text-[11px]" style={{ color: "var(--qpi-ink)", opacity: 0.4 }}>{LICENCES.qbcc}</span>
        </div>
      </footer>
    ),
  },

  // 4 · Contact bar full bleed — ink bar, phone/email/licences spread wide.
  {
    name: "Contact Bar Full Bleed",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="w-full rounded-2xl px-6 py-6 md:px-10 md:py-8" style={{ background: "var(--qpi-ink)" }}>
          <div className="flex flex-wrap items-center justify-between gap-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_WHITE} alt="QLD Pool Installs" className="h-7 w-auto" />
            <a href={PHONE_HREF} className="qpi-display text-[clamp(1.1rem,2.2vw,1.6rem)] leading-none text-white">{PHONE}</a>
            <a href={`mailto:${EMAIL}`} className="text-[13px] text-white/70">{EMAIL}</a>
            <span className="text-[11px] text-white/50">{LICENCES.qbcc}</span>
            <span className="text-[11px] text-white/50">{LICENCES.nsw}</span>
          </div>
        </div>
        <div className="mx-auto mt-6 flex w-full max-w-none flex-wrap items-center justify-between gap-3">
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
            {FOOTER.nav.map((item) => (
              <span key={item} className="qpi-caps text-[10.5px]" style={{ color: "var(--qpi-ink)", opacity: 0.6 }}>{item}</span>
            ))}
          </nav>
          <Credit />
        </div>
      </footer>
    ),
  },

  // 5 · Split baseline wide — logo/tagline flush left, legal/credit flush right, one baseline.
  {
    name: "Split Baseline Wide",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto flex w-full max-w-none flex-col items-start justify-between gap-8 border-t pt-8 md:flex-row md:items-end" style={{ borderColor: "rgba(25,60,90,0.12)" }}>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-7 w-auto" />
            <p className="mt-3 text-[13px]" style={{ color: "var(--qpi-ink)", opacity: 0.6 }}>{TAGLINE}</p>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 md:mb-1" aria-label="Footer">
            {FOOTER.nav.map((item) => (
              <span key={item} className="qpi-caps text-[10.5px]" style={{ color: "var(--qpi-ink)" }}>{item}</span>
            ))}
          </nav>
          <div className="text-left md:text-right">
            <Credit />
            <p className="mt-1 text-[11px]" style={{ color: "var(--qpi-ink)", opacity: 0.4 }}>{LICENCES.qbcc} · {LICENCES.nsw}</p>
          </div>
        </div>
      </footer>
    ),
  },

  // 6 · Areas full-width ticker row — AREAS spread edge to edge as one justified line.
  {
    name: "Areas Full Width Row",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-none">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-7 w-auto" />
            <a href={PHONE_HREF} className="text-[13px] font-semibold" style={{ color: "var(--qpi-blue)" }}>{PHONE}</a>
          </div>
          <div className="mt-6 flex w-full flex-wrap items-center justify-between gap-y-2 border-y py-4" style={{ borderColor: "rgba(25,60,90,0.12)" }}>
            {AREAS.map((area) => (
              <span key={area} className="qpi-caps text-[11px]" style={{ color: "var(--qpi-ink)", opacity: 0.6 }}>{area}</span>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <Credit />
            <nav className="hidden gap-x-5 sm:flex" aria-label="Footer">
              {FOOTER.nav.slice(0, 4).map((item) => (
                <span key={item} className="text-[11px]" style={{ color: "var(--qpi-ink)", opacity: 0.55 }}>{item}</span>
              ))}
            </nav>
          </div>
        </div>
      </footer>
    ),
  },

  // 7 · Nav + legal two-row wide stack, warranty banner between.
  {
    name: "Warranty Banner Wide Stack",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-none">
          <nav className="flex flex-wrap items-center justify-between gap-4 pb-6" aria-label="Footer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-7 w-auto" />
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {FOOTER.nav.map((item) => (
                <span key={item} className="qpi-caps text-[10.5px]" style={{ color: "var(--qpi-ink)" }}>{item}</span>
              ))}
            </div>
          </nav>
          <div className="w-full rounded-xl px-5 py-4 text-center md:px-8" style={{ background: "var(--qpi-blue)" }}>
            <p className="text-[12.5px] leading-relaxed text-white/90">{FOOTER.warranty}</p>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <Credit />
            <span className="text-[11px]" style={{ color: "var(--qpi-ink)", opacity: 0.4 }}>{LICENCES.qbcc}</span>
          </div>
        </div>
      </footer>
    ),
  },

  // 8 · Aqua underline wide bar — thin aqua rule, three-part row beneath.
  {
    name: "Aqua Underline Wide Bar",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-none">
          <div className="h-[3px] w-full" style={{ background: "var(--qpi-aqua)" }} />
          <div className="mt-7 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-7 w-auto" />
            <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
              {FOOTER.nav.map((item) => (
                <span key={item} className="qpi-caps text-[10.5px]" style={{ color: "var(--qpi-ink)" }}>{item}</span>
              ))}
            </nav>
            <a href={PHONE_HREF} className="text-[13px] font-semibold" style={{ color: "var(--qpi-blue)" }}>{PHONE}</a>
          </div>
          <div className="mt-6 flex items-center justify-between border-t pt-4" style={{ borderColor: "rgba(25,60,90,0.1)" }}>
            <Credit />
          </div>
        </div>
      </footer>
    ),
  },

  // 9 · Numbered nav strip wide — nav items with tabular index, dividers, one edge-to-edge row.
  {
    name: "Numbered Nav Strip Wide",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-7 w-auto" />
          <div className="mt-6 flex w-full flex-wrap items-center gap-x-8 gap-y-3 border-y py-5" style={{ borderColor: "rgba(25,60,90,0.12)" }}>
            {FOOTER.nav.map((item, i) => (
              <span key={item} className="flex items-baseline gap-2">
                <span className="qpi-caps tabular-nums text-[10px]" style={{ color: "var(--qpi-blue)" }}>{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[13px]" style={{ color: "var(--qpi-ink)" }}>{item}</span>
              </span>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <Credit />
            <span className="text-[11px]" style={{ color: "var(--qpi-ink)", opacity: 0.4 }}>{LICENCES.qbcc} · {LICENCES.nsw}</span>
          </div>
        </div>
      </footer>
    ),
  },

  // 10 · Big contact duo, wide nav beneath.
  {
    name: "Big Contact Duo Wide",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-none">
          <div className="grid grid-cols-1 gap-4 border-b pb-6 sm:grid-cols-2" style={{ borderColor: "rgba(25,60,90,0.12)" }}>
            <div>
              <span className="qpi-caps text-[10px]" style={{ color: "var(--qpi-ink)", opacity: 0.4 }}>Call</span>
              <a href={PHONE_HREF} className="qpi-display mt-1 block text-[clamp(1.5rem,3vw,2.1rem)] leading-none" style={{ color: "var(--qpi-blue)" }}>{PHONE}</a>
            </div>
            <div>
              <span className="qpi-caps text-[10px]" style={{ color: "var(--qpi-ink)", opacity: 0.4 }}>Email</span>
              <a href={`mailto:${EMAIL}`} className="qpi-display mt-1 block text-[clamp(1.5rem,3vw,2.1rem)] leading-none" style={{ color: "var(--qpi-ink)" }}>{EMAIL}</a>
            </div>
          </div>
          <nav className="mt-5 flex flex-wrap items-center justify-between gap-4" aria-label="Footer">
            {FOOTER.nav.map((item) => (
              <span key={item} className="qpi-caps text-[10.5px]" style={{ color: "var(--qpi-ink)" }}>{item}</span>
            ))}
          </nav>
          <div className="mt-5 flex items-center justify-between border-t pt-4" style={{ borderColor: "rgba(25,60,90,0.1)" }}>
            <Credit />
            <span className="text-[11px]" style={{ color: "var(--qpi-ink)", opacity: 0.4 }}>{LICENCES.qbcc}</span>
          </div>
        </div>
      </footer>
    ),
  },

  // 11 · Grid manifest wide — dense CSS grid, tabular index, edge to edge.
  {
    name: "Grid Manifest Wide",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto grid w-full max-w-none grid-cols-1 gap-x-8 gap-y-6 border-t pt-6 sm:grid-cols-4" style={{ borderColor: "rgba(25,60,90,0.12)" }}>
          <div className="sm:col-span-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-7 w-auto" />
            <p className="mt-3 max-w-[30ch] text-[12px] leading-relaxed" style={{ color: "var(--qpi-ink)", opacity: 0.6 }}>{FOOTER.warranty}</p>
          </div>
          <div>
            <span className="qpi-caps tabular-nums text-[10px]" style={{ color: "var(--qpi-blue)" }}>01 · Nav</span>
            <ul className="m-0 mt-2 flex list-none flex-col gap-1.5 p-0">
              {FOOTER.nav.slice(0, 3).map((item) => (
                <li key={item} className="text-[12px]" style={{ color: "var(--qpi-ink)" }}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <span className="qpi-caps tabular-nums text-[10px]" style={{ color: "var(--qpi-blue)" }}>02 · Contact</span>
            <a href={PHONE_HREF} className="mt-2 block text-[12px]" style={{ color: "var(--qpi-ink)" }}>{PHONE}</a>
            <a href={`mailto:${EMAIL}`} className="mt-1 block text-[12px]" style={{ color: "var(--qpi-ink)" }}>{EMAIL}</a>
          </div>
        </div>
        <div className="mx-auto mt-6 flex w-full max-w-none items-center justify-between border-t pt-4" style={{ borderColor: "rgba(25,60,90,0.1)" }}>
          <Credit />
          <span className="text-[11px]" style={{ color: "var(--qpi-ink)", opacity: 0.4 }}>{LICENCES.qbcc} · {LICENCES.nsw}</span>
        </div>
      </footer>
    ),
  },

  // 12 · Full-width rule ladder — stacked hairline bands, one idea per band.
  {
    name: "Full-Width Rule Ladder",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto flex w-full max-w-none flex-col">
          <div className="flex items-center justify-between border-t py-3.5" style={{ borderColor: "rgba(25,60,90,0.12)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-6 w-auto" />
            <span className="text-[12px]" style={{ color: "var(--qpi-ink)", opacity: 0.6 }}>{TAGLINE}</span>
          </div>
          <div className="flex flex-wrap justify-between gap-3 border-t py-3.5" style={{ borderColor: "rgba(25,60,90,0.12)" }}>
            {FOOTER.nav.map((item) => (
              <span key={item} className="qpi-caps text-[10.5px]" style={{ color: "var(--qpi-ink)" }}>{item}</span>
            ))}
          </div>
          <div className="flex flex-wrap justify-between gap-3 border-t py-3.5" style={{ borderColor: "rgba(25,60,90,0.12)" }}>
            {AREAS.slice(0, 5).map((area) => (
              <span key={area} className="text-[11.5px]" style={{ color: "var(--qpi-ink)", opacity: 0.55 }}>{area}</span>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-b py-3.5" style={{ borderColor: "rgba(25,60,90,0.12)" }}>
            <Credit />
            <span className="text-[11px]" style={{ color: "var(--qpi-ink)", opacity: 0.4 }}>{LICENCES.qbcc}</span>
          </div>
        </div>
      </footer>
    ),
  },

  // 13 · Bold nav right, quiet legal left, one wide asymmetric row.
  {
    name: "Bold Nav Right Wide Row",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto flex w-full max-w-none flex-col items-start justify-between gap-8 border-t pt-8 md:flex-row md:items-center" style={{ borderColor: "rgba(25,60,90,0.12)" }}>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-6 w-auto" />
            <Credit />
            <p className="mt-1 text-[10.5px]" style={{ color: "var(--qpi-ink)", opacity: 0.4 }}>{LICENCES.qbcc} · {LICENCES.nsw}</p>
          </div>
          <nav className="flex flex-wrap justify-end gap-x-7 gap-y-2" aria-label="Footer">
            {FOOTER.nav.map((item) => (
              <span key={item} className="qpi-display" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1rem,1.8vw,1.3rem)" }}>{item}</span>
            ))}
          </nav>
        </div>
      </footer>
    ),
  },

  // 14 · Suburb belt — AREAS run as one long baseline of headline text, edge to edge.
  {
    name: "Suburb Belt",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-7 w-auto" />
          <p className="qpi-display mt-6 text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.25rem,3.2vw,2.1rem)", lineHeight: 1.15 }}>
            {AREAS.join("  ·  ")}
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t pt-5" style={{ borderColor: "rgba(25,60,90,0.12)" }}>
            <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
              {FOOTER.nav.map((item) => (
                <span key={item} className="text-[12px]" style={{ color: "var(--qpi-ink)", opacity: 0.65 }}>{item}</span>
              ))}
            </nav>
            <Credit />
          </div>
        </div>
      </footer>
    ),
  },

  // 15 · Two-tone wide split — ink left half, white right half, full height.
  {
    name: "Two-Tone Wide Split",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto grid w-full max-w-none grid-cols-1 overflow-hidden rounded-2xl md:grid-cols-2">
          <div className="flex flex-col justify-center gap-3 p-7 md:p-9" style={{ background: "var(--qpi-ink)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_WHITE} alt="QLD Pool Installs" className="h-7 w-auto" />
            <p className="text-[13px] text-white/70">{TAGLINE}</p>
          </div>
          <div className="flex flex-col justify-center gap-3 p-7 md:p-9">
            <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
              {FOOTER.nav.map((item) => (
                <span key={item} className="qpi-caps text-[10.5px]" style={{ color: "var(--qpi-ink)" }}>{item}</span>
              ))}
            </nav>
            <div className="mt-2 flex items-center justify-between">
              <Credit />
              <span className="text-[11px]" style={{ color: "var(--qpi-ink)", opacity: 0.4 }}>{LICENCES.qbcc}</span>
            </div>
          </div>
        </div>
      </footer>
    ),
  },

  // 16 · Full-bleed nav wall — nav items very large, wrapping full width like an index.
  {
    name: "Full-Bleed Nav Wall",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-none">
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-b pb-6" style={{ borderColor: "rgba(25,60,90,0.12)" }}>
            {FOOTER.nav.map((item) => (
              <span key={item} className="qpi-display" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem,4.5vw,3rem)", lineHeight: 1.1 }}>{item}</span>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-6 w-auto" />
            <Credit />
          </div>
        </div>
      </footer>
    ),
  },

  // 17 · Compact wide utility bar — a slim dense single row, minimal height, no gap below content.
  {
    name: "Compact Wide Utility Bar",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto flex w-full max-w-none flex-wrap items-center justify-between gap-4 rounded-lg px-5 py-3.5" style={{ border: "1px solid rgba(25,60,90,0.14)" }}>
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-5 w-auto" />
            <span className="hidden text-[11px] sm:inline" style={{ color: "var(--qpi-ink)", opacity: 0.5 }}>{LICENCES.qbcc}</span>
          </div>
          <nav className="flex flex-wrap gap-x-4 gap-y-1" aria-label="Footer">
            {FOOTER.nav.map((item) => (
              <span key={item} className="text-[11px]" style={{ color: "var(--qpi-ink)", opacity: 0.6 }}>{item}</span>
            ))}
          </nav>
          <Credit />
        </div>
      </footer>
    ),
  },

  // 18 · Licence strip wide — QBCC/NSW licences prominent as a full-bleed strip.
  {
    name: "Licence Strip Wide",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-none">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-7 w-auto" />
            <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
              {FOOTER.nav.map((item) => (
                <span key={item} className="qpi-caps text-[10.5px]" style={{ color: "var(--qpi-ink)" }}>{item}</span>
              ))}
            </nav>
          </div>
          <div className="mt-6 flex w-full flex-col gap-2 rounded-xl px-5 py-4 sm:flex-row sm:items-center sm:justify-between" style={{ background: "var(--qpi-ink)" }}>
            <span className="qpi-caps text-[11px] text-white/85">{LICENCES.qbcc}</span>
            <span className="qpi-caps text-[11px] text-white/85">{LICENCES.nsw}</span>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <Credit />
            <a href={PHONE_HREF} className="text-[11px]" style={{ color: "var(--qpi-ink)", opacity: 0.6 }}>{PHONE}</a>
          </div>
        </div>
      </footer>
    ),
  },

  // 19 · Photo backdrop wide footer — dimmed project photo behind, content spanning full width.
  {
    name: "Photo Backdrop Wide Footer",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="relative w-full overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={GALLERY_IMGS[8]} alt="Pool installation project" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(6,26,48,0.88), rgba(6,26,48,0.72))" }} />
          <div className="relative flex flex-col gap-6 px-6 py-8 md:px-9 md:py-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LOGO_WHITE} alt="QLD Pool Installs" className="h-7 w-auto" />
              <a href={PHONE_HREF} className="qpi-display text-[clamp(1.1rem,2.2vw,1.6rem)] leading-none text-white">{PHONE}</a>
            </div>
            <nav className="flex flex-wrap gap-x-5 gap-y-2 border-t border-white/20 pt-5" aria-label="Footer">
              {FOOTER.nav.map((item) => (
                <span key={item} className="qpi-caps text-[10.5px] text-white/80">{item}</span>
              ))}
            </nav>
            <div className="flex items-center justify-between">
              <Credit tone="white" />
              <span className="text-[11px] text-white/50">{LICENCES.qbcc}</span>
            </div>
          </div>
        </div>
      </footer>
    ),
  },

  // 20 · Blurb-led wide close — the FOOTER.blurb set large across full width, contact row beneath.
  {
    name: "Blurb-Led Wide Close",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-none">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <p className="qpi-display max-w-2xl text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.3rem,2.8vw,2rem)", lineHeight: 1.15 }}>
              {FOOTER.blurb}
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-8 w-auto shrink-0" />
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t pt-5" style={{ borderColor: "rgba(25,60,90,0.12)" }}>
            <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
              {FOOTER.nav.map((item) => (
                <span key={item} className="text-[12px]" style={{ color: "var(--qpi-ink)", opacity: 0.65 }}>{item}</span>
              ))}
            </nav>
            <div className="flex items-center gap-5">
              <span className="text-[11px]" style={{ color: "var(--qpi-ink)", opacity: 0.4 }}>{LICENCES.qbcc}</span>
              <Credit />
            </div>
          </div>
        </div>
      </footer>
    ),
  },
];
