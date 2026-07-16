import { FOOTER, AREAS, LICENCES, PHONE, PHONE_HREF, EMAIL, LOGO_DARK, LOGO_WHITE, TAGLINE, type Section } from "../kit";

/**
 * Footer — SECOND, WILDER batch of 20 design options. footer.tsx already
 * covers the safe column/split/minimal patterns; this file pushes further:
 * bleeding wordmarks, arch colonnades, licence plates, blueprint dimension
 * lines, postage-stamp area grids, twin-arch gateways. Every option is a
 * single min-h-svh, vertically centred viewport on a white ground, rooted
 * in a <footer> element per the client's hard layout rule.
 *
 * Server-rendered only: no hooks, no client directive, no event handlers.
 * The copyright line is the literal string required by the brief (not
 * computed), and every option carries the "Site by finbar.studio" credit.
 * Nothing beyond FOOTER/AREAS/LICENCES/PHONE/EMAIL/LOGO/TAGLINE is invented.
 */

const ARCH = "9999px 9999px 0 0";
const HAIRLINE = "rgba(25,60,90,0.16)";

export const optionsFooter2: Section[] = [
  // 1 · Colossal Wordmark Bleed — the wordmark set huge, cropped by the
  // bottom edge of the viewport, a slim info row sitting above it.
  {
    name: "Colossal Wordmark Bleed",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-8 w-auto" />
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {FOOTER.nav.map((n) => (
              <a key={n} href="#" className="text-[13px] text-[var(--qpi-ink)]/70 hover:text-[var(--qpi-blue)]" style={{ textDecoration: "none" }}>{n}</a>
            ))}
          </div>
          <a href={PHONE_HREF} className="text-[13px] text-[var(--qpi-ink)]" style={{ textDecoration: "none" }}>{PHONE}</a>
        </div>
        <p aria-hidden="true" className="qpi-display mt-8 select-none" style={{ color: "var(--qpi-ink)", fontSize: "clamp(3.5rem, 15vw, 11rem)", lineHeight: 0.82, letterSpacing: "-0.02em", whiteSpace: "nowrap", marginBottom: "-8%" }}>
          QLD POOL INSTALLS
        </p>
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-2 pt-6" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
          <p className="text-[11px] text-[var(--qpi-ink)]/40">© 2026 QLD Pool Installs</p>
          <p className="text-[11px] text-[var(--qpi-ink)]/40">Site by finbar.studio</p>
        </div>
      </footer>
    ),
  },

  // 2 · Arch Colonnade Nav — the 6 nav items each stand under their own
  // small arch, like pillars in a colonnade.
  {
    name: "Arch Colonnade Nav",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto text-center mb-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-9 w-auto mx-auto" />
        </div>
        <div className="mx-auto grid w-full max-w-4xl grid-cols-3 sm:grid-cols-6 gap-4">
          {FOOTER.nav.map((n) => (
            <a key={n} href="#" className="flex flex-col items-center gap-3 group" style={{ textDecoration: "none" }}>
              <span aria-hidden="true" className="block w-full transition-colors group-hover:bg-[var(--qpi-blue)]" style={{ height: 40, background: "rgba(24,120,166,0.1)", borderRadius: ARCH }} />
              <span className="text-[11px] text-[var(--qpi-ink)]/70 text-center leading-snug">{n}</span>
            </a>
          ))}
        </div>
        <div className="mx-auto mt-12 flex max-w-4xl w-full flex-col sm:flex-row items-center justify-between gap-2 pt-6" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
          <p className="text-[11px] text-[var(--qpi-ink)]/40">{LICENCES.qbcc} · {LICENCES.nsw}</p>
          <p className="text-[11px] text-[var(--qpi-ink)]/40">© 2026 QLD Pool Installs · Site by finbar.studio</p>
        </div>
      </footer>
    ),
  },

  // 3 · Logo in Giant Arch — the wave logo sits inside one huge arch
  // shape, TAGLINE beneath it, everything else reduced to a hairline.
  {
    name: "Logo in Giant Arch",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto flex flex-col items-center justify-center px-10 pt-14 pb-8" style={{ width: "min(360px, 80vw)", background: "rgba(24,120,166,0.06)", borderRadius: ARCH }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-10 w-auto" />
          <p className="mt-4 text-center text-[13px] text-[var(--qpi-ink)]/60">{TAGLINE}</p>
        </div>
        <div className="mx-auto mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {FOOTER.nav.map((n) => (
            <a key={n} href="#" className="text-[12px] text-[var(--qpi-ink)]/65 hover:text-[var(--qpi-blue)]" style={{ textDecoration: "none" }}>{n}</a>
          ))}
        </div>
        <p className="mx-auto mt-8 text-center text-[11px] text-[var(--qpi-ink)]/40">© 2026 QLD Pool Installs · Site by finbar.studio</p>
      </footer>
    ),
  },

  // 4 · Monumental Nav, Fine Print Legal — the nav stacked as huge type,
  // everything legal shrinks to a footnote row.
  {
    name: "Monumental Nav, Fine Print Legal",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-8 w-auto mb-8" />
        <div>
          {FOOTER.nav.map((n, i) => (
            <a
              key={n}
              href="#"
              className="qpi-display block hover:text-[var(--qpi-blue)]"
              style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem, 4.4vw, 2.75rem)", lineHeight: 1.22, textDecoration: "none", opacity: i === 0 ? 1 : 0.8 }}
            >
              {n}
            </a>
          ))}
        </div>
        <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-6" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
          <p className="text-[11px] text-[var(--qpi-ink)]/45">{PHONE} · {EMAIL} · {LICENCES.qbcc}</p>
          <p className="text-[11px] text-[var(--qpi-ink)]/45">© 2026 QLD Pool Installs · Site by finbar.studio</p>
        </div>
      </footer>
    ),
  },

  // 5 · Ink Band Under White Brand — a white brand moment up top, a
  // contained ink band beneath carrying nav, contact and credit.
  {
    name: "Ink Band Under White Brand",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="flex flex-col items-center text-center pb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-10 w-auto mb-4" />
          <p className="text-pretty max-w-sm text-[13px] leading-relaxed text-[var(--qpi-ink)]/60">{FOOTER.blurb}</p>
        </div>
        <div className="mx-auto w-full max-w-4xl px-6 py-8 md:px-10" style={{ background: "var(--qpi-ink)", borderRadius: 16 }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {FOOTER.nav.map((n) => (
                <a key={n} href="#" className="text-[12px] text-white/75 hover:text-white" style={{ textDecoration: "none" }}>{n}</a>
              ))}
            </div>
            <a href={PHONE_HREF} className="text-[13px] text-white" style={{ textDecoration: "none" }}>{PHONE}</a>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-2 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}>
            <p className="text-[11px] text-white/40">© 2026 QLD Pool Installs</p>
            <p className="text-[11px] text-white/40">Site by finbar.studio</p>
          </div>
        </div>
      </footer>
    ),
  },

  // 6 · Areas Typographic Map — the 7 AREAS scattered at varying scales
  // and offsets, reading like pins dropped on a map.
  {
    name: "Areas Typographic Map",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-8 w-auto mx-auto mb-10" />
        <div className="mx-auto flex w-full max-w-3xl flex-wrap items-baseline justify-center gap-x-6 gap-y-3">
          {AREAS.map((a, i) => (
            <span
              key={a}
              className="qpi-display"
              style={{
                color: i % 3 === 0 ? "var(--qpi-blue)" : "var(--qpi-ink)",
                fontSize: `clamp(${1 + (i % 3) * 0.35}rem, ${3.4 + (i % 3) * 1.1}vw, ${1.9 + (i % 3) * 0.6}rem)`,
                lineHeight: 1,
                opacity: i % 3 === 0 ? 1 : 0.75,
              }}
            >
              {a}
            </span>
          ))}
        </div>
        <div className="mx-auto mt-12 flex max-w-3xl w-full flex-col sm:flex-row items-center justify-between gap-2 pt-6" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
          <p className="text-[11px] text-[var(--qpi-ink)]/40">{PHONE} · {EMAIL}</p>
          <p className="text-[11px] text-[var(--qpi-ink)]/40">© 2026 QLD Pool Installs · Site by finbar.studio</p>
        </div>
      </footer>
    ),
  },

  // 7 · Licence Plates — the QBCC and NSW licence numbers rendered as
  // bold bordered plates, the footer's clearest credential moment.
  {
    name: "Licence Plates",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto grid w-full max-w-2xl grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          <div className="text-center py-6 px-4" style={{ border: "2px solid var(--qpi-ink)", borderRadius: 10 }}>
            <p className="qpi-display" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.125rem,2vw,1.5rem)", letterSpacing: "0.04em" }}>{LICENCES.qbcc}</p>
          </div>
          <div className="text-center py-6 px-4" style={{ border: "2px solid var(--qpi-blue)", borderRadius: 10 }}>
            <p className="qpi-display" style={{ color: "var(--qpi-blue)", fontSize: "clamp(1.125rem,2vw,1.5rem)", letterSpacing: "0.04em" }}>{LICENCES.nsw}</p>
          </div>
        </div>
        <div className="mx-auto flex w-full max-w-2xl flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-8 w-auto" />
            <p className="text-[12px] text-[var(--qpi-ink)]/55 max-w-xs">{FOOTER.warranty}</p>
          </div>
        </div>
        <div className="mx-auto mt-8 flex w-full max-w-2xl flex-col sm:flex-row items-center justify-between gap-2 pt-5" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
          <p className="text-[11px] text-[var(--qpi-ink)]/40">© 2026 QLD Pool Installs</p>
          <p className="text-[11px] text-[var(--qpi-ink)]/40">Site by finbar.studio</p>
        </div>
      </footer>
    ),
  },

  // 8 · Single Rule Minimal — one hairline rule, everything collapsed to
  // a single centred row.
  {
    name: "Single Rule Minimal",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto flex w-full max-w-4xl flex-col sm:flex-row sm:items-center sm:justify-between gap-5 pb-6" style={{ borderBottom: `2px solid var(--qpi-ink)` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-8 w-auto" />
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {FOOTER.nav.map((n) => (
              <a key={n} href="#" className="text-[12px] text-[var(--qpi-ink)]/70 hover:text-[var(--qpi-blue)]" style={{ textDecoration: "none" }}>{n}</a>
            ))}
          </div>
          <a href={PHONE_HREF} className="text-[13px] font-semibold text-[var(--qpi-ink)]" style={{ textDecoration: "none" }}>{PHONE}</a>
        </div>
        <div className="mx-auto mt-4 flex w-full max-w-4xl items-center justify-center gap-2 text-[11px] text-[var(--qpi-ink)]/40">
          © 2026 QLD Pool Installs
          <span aria-hidden="true">·</span>
          Site by finbar.studio
        </div>
      </footer>
    ),
  },

  // 9 · Arch Porthole Logo — a contained ink arch panel with a circular
  // porthole cut into it, the logo floating inside on white.
  {
    name: "Arch Porthole Logo",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto flex flex-col items-center px-10 pt-12 pb-8" style={{ width: "min(360px, 82vw)", background: "var(--qpi-ink)", borderRadius: ARCH }}>
          <div className="flex items-center justify-center bg-white" style={{ width: 96, height: 96, borderRadius: "50%" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-6 w-auto" />
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {FOOTER.nav.map((n) => (
              <a key={n} href="#" className="qpi-caps text-white/70 hover:text-white" style={{ fontSize: 10, textDecoration: "none" }}>{n}</a>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-9 flex max-w-md w-full flex-col sm:flex-row items-center justify-between gap-2 pt-5" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
          <p className="text-[11px] text-[var(--qpi-ink)]/40">© 2026 QLD Pool Installs</p>
          <p className="text-[11px] text-[var(--qpi-ink)]/40">Site by finbar.studio</p>
        </div>
      </footer>
    ),
  },

  // 10 · Diagonal Ribbon Credit — a thin diagonal ribbon carries the
  // finbar.studio credit across one corner.
  {
    name: "Diagonal Ribbon Credit",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute hidden sm:flex items-center justify-center"
          style={{ top: 28, right: -64, width: 240, height: 26, background: "var(--qpi-blue)", transform: "rotate(35deg)" }}
        >
          <span className="qpi-caps text-white" style={{ fontSize: 9 }}>Site by finbar.studio</span>
        </div>
        <div className="mx-auto text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-10 w-auto mx-auto mb-8" />
          <div className="flex flex-wrap justify-center gap-x-7 gap-y-2 mb-8">
            {FOOTER.nav.map((n) => (
              <a key={n} href="#" className="text-[13px] text-[var(--qpi-ink)]/70 hover:text-[var(--qpi-blue)]" style={{ textDecoration: "none" }}>{n}</a>
            ))}
          </div>
          <p className="text-[13px] text-[var(--qpi-ink)]/55">{PHONE} · {EMAIL}</p>
        </div>
        <p className="mx-auto mt-10 text-center text-[11px] text-[var(--qpi-ink)]/35 sm:hidden">Site by finbar.studio</p>
        <p className="mx-auto mt-10 text-center text-[11px] text-[var(--qpi-ink)]/35">© 2026 QLD Pool Installs</p>
      </footer>
    ),
  },

  // 11 · Ticket Stub — a dashed perforation splits the brand block from
  // the legal block, like tearing a ticket in two.
  {
    name: "Ticket Stub",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto grid w-full max-w-3xl grid-cols-1 sm:grid-cols-[1.3fr_1fr]" style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12 }}>
          <div className="p-8 md:p-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-8 w-auto mb-4" />
            <p className="text-pretty max-w-xs text-[12.5px] leading-relaxed text-[var(--qpi-ink)]/55">{FOOTER.blurb}</p>
          </div>
          <div className="relative p-8 md:p-10" style={{ borderLeft: `2px dashed ${HAIRLINE}` }}>
            {FOOTER.nav.slice(0, 4).map((n) => (
              <a key={n} href="#" className="block mb-2 text-[12px] text-[var(--qpi-ink)]/65 hover:text-[var(--qpi-blue)]" style={{ textDecoration: "none" }}>{n}</a>
            ))}
            <p className="mt-4 text-[12px] text-[var(--qpi-ink)]">{PHONE}</p>
          </div>
        </div>
        <div className="mx-auto mt-6 flex w-full max-w-3xl flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-[var(--qpi-ink)]/40">© 2026 QLD Pool Installs</p>
          <p className="text-[11px] text-[var(--qpi-ink)]/40">Site by finbar.studio</p>
        </div>
      </footer>
    ),
  },

  // 12 · Postage Stamp Areas — the 7 service areas as small bordered
  // stamp-style cards in a tight grid.
  {
    name: "Postage Stamp Areas",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-8 w-auto mx-auto mb-8" />
        <div className="mx-auto grid w-full max-w-3xl grid-cols-3 sm:grid-cols-4 gap-3">
          {AREAS.map((a) => (
            <div key={a} className="flex items-center justify-center px-3 py-4 text-center" style={{ border: `1.5px dashed ${HAIRLINE}`, borderRadius: 4 }}>
              <span className="text-[11px] leading-snug text-[var(--qpi-ink)]/70">{a}</span>
            </div>
          ))}
          <div className="flex items-center justify-center px-3 py-4 text-center" style={{ border: `1.5px solid var(--qpi-blue)`, borderRadius: 4 }}>
            <a href={PHONE_HREF} className="text-[11px] font-semibold text-[var(--qpi-blue)]" style={{ textDecoration: "none" }}>{PHONE}</a>
          </div>
        </div>
        <div className="mx-auto mt-8 flex w-full max-w-3xl flex-col sm:flex-row items-center justify-between gap-2 pt-5" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
          <p className="text-[11px] text-[var(--qpi-ink)]/40">© 2026 QLD Pool Installs</p>
          <p className="text-[11px] text-[var(--qpi-ink)]/40">Site by finbar.studio</p>
        </div>
      </footer>
    ),
  },

  // 13 · Blueprint Dimension Lines — the licence numbers sit inside
  // architectural dimension-line brackets, a drafting-table feel.
  {
    name: "Blueprint Dimension Lines",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-2xl">
          {[LICENCES.qbcc, LICENCES.nsw].map((lic) => (
            <div key={lic} className="flex items-center gap-3 py-4">
              <span aria-hidden="true" style={{ width: 8, height: 1, background: "var(--qpi-blue)" }} />
              <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: "50%", border: "1px solid var(--qpi-blue)" }} />
              <span className="flex-1" aria-hidden="true" style={{ borderTop: `1px dashed ${HAIRLINE}` }} />
              <span className="qpi-display" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1rem,1.8vw,1.375rem)" }}>{lic}</span>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-10 flex w-full max-w-2xl flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pt-6" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-7 w-auto" />
            <span className="text-[12px] text-[var(--qpi-ink)]/60">{PHONE}</span>
          </div>
          <p className="text-[11px] text-[var(--qpi-ink)]/40">© 2026 QLD Pool Installs · Site by finbar.studio</p>
        </div>
      </footer>
    ),
  },

  // 14 · Wordmark / Arch / Contact — a stacked wordmark left, an arch
  // divider centre, nav and contact stacked right.
  {
    name: "Wordmark / Arch / Contact",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto grid w-full max-w-4xl grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-8">
          <p className="qpi-display text-center sm:text-left" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem,3.6vw,2.75rem)", lineHeight: 1 }}>
            QLD POOL<br />INSTALLS
          </p>
          <span aria-hidden="true" className="hidden sm:block" style={{ width: 2, height: 90, background: "rgba(24,120,166,0.18)", borderRadius: ARCH }} />
          <div className="text-center sm:text-right">
            <div className="flex flex-col sm:items-end gap-1.5 mb-4">
              {FOOTER.nav.map((n) => (
                <a key={n} href="#" className="text-[12px] text-[var(--qpi-ink)]/65 hover:text-[var(--qpi-blue)]" style={{ textDecoration: "none" }}>{n}</a>
              ))}
            </div>
            <a href={PHONE_HREF} className="text-[13px] font-semibold text-[var(--qpi-ink)]" style={{ textDecoration: "none" }}>{PHONE}</a>
          </div>
        </div>
        <div className="mx-auto mt-10 flex w-full max-w-4xl flex-col sm:flex-row items-center justify-between gap-2 pt-6" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
          <p className="text-[11px] text-[var(--qpi-ink)]/40">© 2026 QLD Pool Installs</p>
          <p className="text-[11px] text-[var(--qpi-ink)]/40">Site by finbar.studio</p>
        </div>
      </footer>
    ),
  },

  // 15 · Full Arch Doorway Crop — a full arch doorway shape cropped by
  // the bottom edge, the white logo standing inside it on ink.
  {
    name: "Full Arch Doorway Crop",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute left-1/2 bottom-0"
          style={{ width: "min(420px, 82vw)", height: "58%", background: "var(--qpi-ink)", borderRadius: ARCH, transform: "translateX(-50%)", zIndex: 0 }}
        />
        <div className="relative flex flex-col items-center" style={{ zIndex: 10 }}>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-10">
            {FOOTER.nav.map((n) => (
              <a key={n} href="#" className="text-[12px] text-[var(--qpi-ink)]/65 hover:text-[var(--qpi-blue)]" style={{ textDecoration: "none" }}>{n}</a>
            ))}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_WHITE} alt="QLD Pool Installs" className="h-9 w-auto" style={{ marginBottom: 24 }} />
          <p className="text-[12px] text-white/65">{PHONE} · {EMAIL}</p>
          <p className="mt-6 text-[11px] text-white/40">© 2026 QLD Pool Installs · Site by finbar.studio</p>
        </div>
      </footer>
    ),
  },

  // 16 · Warranty Plaque — the warranty line sits inside an arch-topped
  // plaque, nav laid out beneath as the footer's spine.
  {
    name: "Warranty Plaque",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-lg px-8 pt-12 pb-7 text-center" style={{ background: "rgba(24,120,166,0.06)", borderRadius: ARCH }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-8 w-auto mx-auto mb-5" />
          <p className="text-pretty text-[12.5px] leading-relaxed text-[var(--qpi-ink)]/65">{FOOTER.warranty}</p>
        </div>
        <div className="mx-auto mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {FOOTER.nav.map((n) => (
            <a key={n} href="#" className="text-[12px] text-[var(--qpi-ink)]/65 hover:text-[var(--qpi-blue)]" style={{ textDecoration: "none" }}>{n}</a>
          ))}
        </div>
        <p className="mx-auto mt-8 text-center text-[11px] text-[var(--qpi-ink)]/40">© 2026 QLD Pool Installs · Site by finbar.studio</p>
      </footer>
    ),
  },

  // 17 · Radial Areas Band — the 7 AREAS wrap in a loose arc above the
  // brand mark, like a compass rose reading the coastline.
  {
    name: "Radial Areas Band",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="relative mx-auto w-full max-w-2xl text-center" style={{ height: 120 }}>
          {AREAS.map((a, i) => {
            const angle = (i - (AREAS.length - 1) / 2) * 13;
            return (
              <span
                key={a}
                className="absolute left-1/2 top-0 qpi-caps"
                style={{ color: "var(--qpi-blue)", fontSize: 10, transformOrigin: "50% 120px", transform: `translateX(-50%) rotate(${angle}deg)` }}
              >
                {a}
              </span>
            );
          })}
        </div>
        <div className="mx-auto mt-2 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-9 w-auto mx-auto" />
          <p className="mt-4 text-[13px] text-[var(--qpi-ink)]/60">{PHONE} · {EMAIL}</p>
        </div>
        <p className="mx-auto mt-10 text-center text-[11px] text-[var(--qpi-ink)]/40">© 2026 QLD Pool Installs · Site by finbar.studio</p>
      </footer>
    ),
  },

  // 18 · Newspaper Masthead — TAGLINE set as a masthead rule, three tight
  // columns of nav, areas, and contact beneath like a paper's back page.
  {
    name: "Newspaper Masthead",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="text-center pb-6" style={{ borderTop: "2px solid var(--qpi-ink)", borderBottom: "2px solid var(--qpi-ink)", padding: "10px 0" }}>
          <p className="qpi-caps" style={{ color: "var(--qpi-ink)", fontSize: 11 }}>{TAGLINE}</p>
        </div>
        <div className="mx-auto grid w-full max-w-3xl grid-cols-1 sm:grid-cols-3 gap-8 pt-8">
          <div>
            {FOOTER.nav.slice(0, 3).map((n) => (
              <a key={n} href="#" className="block mb-1.5 text-[12px] text-[var(--qpi-ink)]/70 hover:text-[var(--qpi-blue)]" style={{ textDecoration: "none" }}>{n}</a>
            ))}
          </div>
          <div>
            {AREAS.slice(0, 4).map((a) => (
              <p key={a} className="mb-1.5 text-[12px] text-[var(--qpi-ink)]/70">{a}</p>
            ))}
          </div>
          <div>
            <a href={PHONE_HREF} className="block mb-1.5 text-[12px] text-[var(--qpi-ink)]" style={{ textDecoration: "none" }}>{PHONE}</a>
            <a href={`mailto:${EMAIL}`} className="block text-[12px] text-[var(--qpi-ink)]/70" style={{ textDecoration: "none" }}>{EMAIL}</a>
          </div>
        </div>
        <p className="mx-auto mt-8 text-center text-[11px] text-[var(--qpi-ink)]/40">© 2026 QLD Pool Installs · Site by finbar.studio</p>
      </footer>
    ),
  },

  // 19 · Twin Arch Gateway — two mirrored arches bookend the nav row,
  // forming a gateway the brand mark stands beneath.
  {
    name: "Twin Arch Gateway",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto flex w-full max-w-3xl items-end justify-center gap-6">
          <span aria-hidden="true" className="hidden sm:block" style={{ width: 70, height: 100, background: "rgba(24,120,166,0.08)", borderRadius: ARCH }} />
          <div className="flex flex-col items-center gap-4 px-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-9 w-auto" />
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {FOOTER.nav.map((n) => (
                <a key={n} href="#" className="text-[11.5px] text-[var(--qpi-ink)]/65 hover:text-[var(--qpi-blue)]" style={{ textDecoration: "none" }}>{n}</a>
              ))}
            </div>
          </div>
          <span aria-hidden="true" className="hidden sm:block" style={{ width: 70, height: 100, background: "rgba(24,120,166,0.08)", borderRadius: ARCH }} />
        </div>
        <div className="mx-auto mt-9 flex w-full max-w-3xl flex-col sm:flex-row items-center justify-between gap-2 pt-6" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
          <p className="text-[11px] text-[var(--qpi-ink)]/40">© 2026 QLD Pool Installs</p>
          <p className="text-[11px] text-[var(--qpi-ink)]/40">Site by finbar.studio</p>
        </div>
      </footer>
    ),
  },

  // 20 · Vertical Rule Tower — a minimal centred stack, brand / nav /
  // contact each set apart by a short vertical rule.
  {
    name: "Vertical Rule Tower",
    node: (
      <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-10 w-auto" />
          <span aria-hidden="true" className="my-6" style={{ width: 1, height: 28, background: "var(--qpi-blue)" }} />
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {FOOTER.nav.map((n) => (
              <a key={n} href="#" className="text-[12.5px] text-[var(--qpi-ink)]/70 hover:text-[var(--qpi-blue)]" style={{ textDecoration: "none" }}>{n}</a>
            ))}
          </div>
          <span aria-hidden="true" className="my-6" style={{ width: 1, height: 28, background: "var(--qpi-blue)" }} />
          <p className="text-[13px] text-[var(--qpi-ink)]/60">{PHONE} · {EMAIL}</p>
          <p className="mt-8 text-[11px] text-[var(--qpi-ink)]/40">© 2026 QLD Pool Installs · Site by finbar.studio</p>
        </div>
      </footer>
    ),
  },
];
