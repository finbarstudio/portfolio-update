import { FOOTER, AREAS, LICENCES, PHONE, PHONE_HREF, EMAIL, LOGO_DARK, LOGO_WHITE, TAGLINE, type Section } from "../kit";

/**
 * Footer — 25 distinct design directions for the site footer. Each entry is
 * a standalone <footer> built only from FOOTER, AREAS, LICENCES, PHONE,
 * PHONE_HREF, EMAIL, LOGO_DARK, LOGO_WHITE and TAGLINE.
 */
export const optionsFooter: Section[] = [
  // 1 · Giant wordmark fitted huge across the bottom, info row above
  {
    name: "Giant Wordmark",
    node: (
      <footer className="relative w-full" style={{ background: "var(--qpi-ink)" }}>
        <div className="px-6 md:px-14 pt-16 pb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 pb-12" style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LOGO_WHITE} alt="QLD Pool Installs" className="h-10 w-auto mb-4" />
              <p className="text-pretty" style={{ color: "#fff", opacity: 0.55, fontSize: "0.875rem", lineHeight: 1.6, maxWidth: 320 }}>
                {FOOTER.blurb}
              </p>
            </div>
            <div className="flex flex-wrap gap-x-12 gap-y-6">
              <div>
                <p className="qpi-caps mb-3" style={{ color: "#fff", opacity: 0.4, fontSize: 10 }}>Contact</p>
                <a href={PHONE_HREF} className="block" style={{ color: "#fff", fontSize: "0.9375rem", textDecoration: "none" }}>{PHONE}</a>
                <a href={`mailto:${EMAIL}`} className="block mt-1" style={{ color: "#fff", opacity: 0.7, fontSize: "0.9375rem", textDecoration: "none" }}>{EMAIL}</a>
              </div>
              <div>
                <p className="qpi-caps mb-3" style={{ color: "#fff", opacity: 0.4, fontSize: 10 }}>Navigate</p>
                {FOOTER.nav.slice(0, 3).map((n) => (
                  <a key={n} href="#" className="block mt-1 first:mt-0" style={{ color: "#fff", opacity: 0.7, fontSize: "0.9375rem", textDecoration: "none" }}>{n}</a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 md:px-14 overflow-hidden">
          <p
            className="qpi-display"
            style={{ color: "#fff", opacity: 0.9, fontSize: "clamp(3.5rem, 14vw, 11rem)", lineHeight: 0.85, letterSpacing: "-0.02em", whiteSpace: "nowrap" }}
          >
            QLD POOL INSTALLS
          </p>
        </div>
        <div className="px-6 md:px-14 py-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}>
          <p style={{ color: "#fff", opacity: 0.4, fontSize: "0.75rem" }}>© 2026 QLD Pool Installs</p>
          <p style={{ color: "#fff", opacity: 0.4, fontSize: "0.75rem" }}>Site by finbar.studio</p>
        </div>
      </footer>
    ),
  },

  // 2 · Navy ground, four columns, thin top rule
  {
    name: "Four Column Navy",
    node: (
      <footer className="relative w-full py-16 md:py-20 px-6 md:px-14" style={{ background: "var(--qpi-ink)", borderTop: "1px solid var(--qpi-blue)" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 pb-12">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_WHITE} alt="QLD Pool Installs" className="h-9 w-auto mb-4" />
            <p className="text-pretty" style={{ color: "#fff", opacity: 0.5, fontSize: "0.8125rem", lineHeight: 1.6 }}>{FOOTER.blurb}</p>
          </div>
          <div>
            <p className="qpi-caps mb-4" style={{ color: "#fff", opacity: 0.4, fontSize: 10 }}>Navigate</p>
            {FOOTER.nav.map((n) => (
              <a key={n} href="#" className="block mb-2" style={{ color: "#fff", opacity: 0.7, fontSize: "0.875rem", textDecoration: "none" }}>{n}</a>
            ))}
          </div>
          <div>
            <p className="qpi-caps mb-4" style={{ color: "#fff", opacity: 0.4, fontSize: 10 }}>Service Areas</p>
            {AREAS.map((a) => (
              <p key={a} className="mb-2" style={{ color: "#fff", opacity: 0.7, fontSize: "0.875rem" }}>{a}</p>
            ))}
          </div>
          <div>
            <p className="qpi-caps mb-4" style={{ color: "#fff", opacity: 0.4, fontSize: 10 }}>Get In Touch</p>
            <a href={PHONE_HREF} className="block mb-2" style={{ color: "#fff", fontSize: "0.875rem", textDecoration: "none" }}>{PHONE}</a>
            <a href={`mailto:${EMAIL}`} className="block mb-4" style={{ color: "#fff", opacity: 0.7, fontSize: "0.875rem", textDecoration: "none" }}>{EMAIL}</a>
            <p style={{ color: "#fff", opacity: 0.4, fontSize: "0.75rem" }}>{LICENCES.qbcc}</p>
            <p style={{ color: "#fff", opacity: 0.4, fontSize: "0.75rem" }}>{LICENCES.nsw}</p>
          </div>
        </div>
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
          <p style={{ color: "#fff", opacity: 0.35, fontSize: "0.75rem" }}>© 2026 QLD Pool Installs</p>
          <p style={{ color: "#fff", opacity: 0.35, fontSize: "0.75rem" }}>Site by finbar.studio</p>
        </div>
      </footer>
    ),
  },

  // 3 · White ground, logo left, three columns right, hairline rules
  {
    name: "White, Logo Left",
    node: (
      <footer className="relative w-full bg-white py-16 md:py-20 px-6 md:px-14">
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr_1fr] gap-10 pb-10" style={{ borderBottom: "1px solid rgba(11,42,74,0.15)" }}>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-9 w-auto mb-4" />
            <p style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: "0.8125rem" }}>{TAGLINE}</p>
          </div>
          <div>
            <p className="qpi-caps mb-4" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>Navigate</p>
            {FOOTER.nav.map((n) => (
              <a key={n} href="#" className="block mb-2" style={{ color: "var(--qpi-ink)", opacity: 0.7, fontSize: "0.875rem", textDecoration: "none" }}>{n}</a>
            ))}
          </div>
          <div>
            <p className="qpi-caps mb-4" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>Areas</p>
            {AREAS.map((a) => (
              <p key={a} className="mb-2" style={{ color: "var(--qpi-ink)", opacity: 0.7, fontSize: "0.875rem" }}>{a}</p>
            ))}
          </div>
          <div>
            <p className="qpi-caps mb-4" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>Contact</p>
            <a href={PHONE_HREF} className="block mb-2" style={{ color: "var(--qpi-ink)", fontSize: "0.875rem", textDecoration: "none" }}>{PHONE}</a>
            <a href={`mailto:${EMAIL}`} style={{ color: "var(--qpi-ink)", opacity: 0.7, fontSize: "0.875rem", textDecoration: "none" }}>{EMAIL}</a>
          </div>
        </div>
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: "0.75rem" }}>© 2026 QLD Pool Installs · {LICENCES.qbcc}</p>
          <p style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: "0.75rem" }}>Site by finbar.studio</p>
        </div>
      </footer>
    ),
  },

  // 4 · Minimal: logo centred, one line of nav, contact beneath, vast whitespace
  {
    name: "Minimal Centred",
    node: (
      <footer className="relative w-full bg-white py-24 md:py-32 px-6 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-10 w-auto mx-auto mb-10" />
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-10">
          {FOOTER.nav.map((n) => (
            <a key={n} href="#" className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: 11, textDecoration: "none" }}>{n}</a>
          ))}
        </div>
        <a href={PHONE_HREF} style={{ color: "var(--qpi-ink)", fontSize: "1rem", textDecoration: "none" }}>{PHONE}</a>
        <p className="mt-2" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: "0.875rem" }}>{EMAIL}</p>
        <p className="mt-16" style={{ color: "var(--qpi-ink)", opacity: 0.35, fontSize: "0.75rem" }}>© 2026 QLD Pool Installs · Site by finbar.studio</p>
      </footer>
    ),
  },

  // 5 · Split: big TAGLINE left, columns right, on navy
  {
    name: "Split Tagline",
    node: (
      <footer className="relative w-full py-20 md:py-28 px-6 md:px-14" style={{ background: "var(--qpi-ink)" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 pb-14" style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_WHITE} alt="QLD Pool Installs" className="h-9 w-auto mb-8" />
            <h2 className="qpi-display text-balance" style={{ color: "#fff", fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)", lineHeight: 1.05 }}>
              {TAGLINE}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-10">
            <div>
              <p className="qpi-caps mb-4" style={{ color: "#fff", opacity: 0.4, fontSize: 10 }}>Navigate</p>
              {FOOTER.nav.map((n) => (
                <a key={n} href="#" className="block mb-2" style={{ color: "#fff", opacity: 0.75, fontSize: "0.875rem", textDecoration: "none" }}>{n}</a>
              ))}
            </div>
            <div>
              <p className="qpi-caps mb-4" style={{ color: "#fff", opacity: 0.4, fontSize: 10 }}>Contact</p>
              <a href={PHONE_HREF} className="block mb-2" style={{ color: "#fff", fontSize: "0.875rem", textDecoration: "none" }}>{PHONE}</a>
              <a href={`mailto:${EMAIL}`} className="block" style={{ color: "#fff", opacity: 0.75, fontSize: "0.875rem", textDecoration: "none" }}>{EMAIL}</a>
            </div>
          </div>
        </div>
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p style={{ color: "#fff", opacity: 0.35, fontSize: "0.75rem" }}>© 2026 QLD Pool Installs</p>
          <p style={{ color: "#fff", opacity: 0.35, fontSize: "0.75rem" }}>Site by finbar.studio</p>
        </div>
      </footer>
    ),
  },

  // 6 · Blue band footer, white type, two columns and a big phone number
  {
    name: "Blue Band",
    node: (
      <footer className="relative w-full py-20 md:py-24 px-6 md:px-14" style={{ background: "var(--qpi-blue)" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end pb-12" style={{ borderBottom: "1px solid rgba(255,255,255,0.25)" }}>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_WHITE} alt="QLD Pool Installs" className="h-9 w-auto mb-6" />
            <p className="qpi-caps mb-2" style={{ color: "#fff", opacity: 0.75, fontSize: 10 }}>Call us today</p>
            <a href={PHONE_HREF} className="qpi-display block" style={{ color: "#fff", fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1, textDecoration: "none" }}>
              {PHONE}
            </a>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="qpi-caps mb-4" style={{ color: "#fff", opacity: 0.65, fontSize: 10 }}>Navigate</p>
              {FOOTER.nav.map((n) => (
                <a key={n} href="#" className="block mb-2" style={{ color: "#fff", fontSize: "0.875rem", textDecoration: "none" }}>{n}</a>
              ))}
            </div>
            <div>
              <p className="qpi-caps mb-4" style={{ color: "#fff", opacity: 0.65, fontSize: 10 }}>Areas</p>
              {AREAS.slice(0, 5).map((a) => (
                <p key={a} className="mb-2" style={{ color: "#fff", fontSize: "0.875rem" }}>{a}</p>
              ))}
            </div>
          </div>
        </div>
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p style={{ color: "#fff", opacity: 0.7, fontSize: "0.75rem" }}>© 2026 QLD Pool Installs</p>
          <p style={{ color: "#fff", opacity: 0.7, fontSize: "0.75rem" }}>Site by finbar.studio</p>
        </div>
      </footer>
    ),
  },

  // 7 · Contact-led: enormous tappable phone number as the anchor, nav small beneath
  {
    name: "Enormous Phone Anchor",
    node: (
      <footer className="relative w-full bg-white py-20 md:py-28 px-6 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-9 w-auto mx-auto mb-10" />
        <p className="qpi-caps mb-4" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>Ready to Start Your Pool Project?</p>
        <a
          href={PHONE_HREF}
          className="qpi-display block text-balance"
          style={{ color: "var(--qpi-ink)", fontSize: "clamp(2.5rem, 9vw, 6rem)", lineHeight: 0.95, textDecoration: "none" }}
        >
          {PHONE}
        </a>
        <a href={`mailto:${EMAIL}`} className="block mt-4" style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: "0.9375rem", textDecoration: "none" }}>
          {EMAIL}
        </a>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-14 pt-10" style={{ borderTop: "1px solid rgba(11,42,74,0.15)" }}>
          {FOOTER.nav.map((n) => (
            <a key={n} href="#" style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: "0.8125rem", textDecoration: "none" }}>{n}</a>
          ))}
        </div>
        <p className="mt-10" style={{ color: "var(--qpi-ink)", opacity: 0.35, fontSize: "0.75rem" }}>© 2026 QLD Pool Installs · Site by finbar.studio</p>
      </footer>
    ),
  },

  // 8 · Three columns with AREAS as a wrapped list of pills
  {
    name: "Area Pills",
    node: (
      <footer className="relative w-full bg-white py-16 md:py-24 px-6 md:px-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12" style={{ borderBottom: "1px solid rgba(11,42,74,0.15)" }}>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-9 w-auto mb-4" />
            <p className="text-pretty" style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: "0.8125rem", lineHeight: 1.6 }}>{FOOTER.blurb}</p>
          </div>
          <div>
            <p className="qpi-caps mb-4" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>Navigate</p>
            {FOOTER.nav.map((n) => (
              <a key={n} href="#" className="block mb-2" style={{ color: "var(--qpi-ink)", opacity: 0.7, fontSize: "0.875rem", textDecoration: "none" }}>{n}</a>
            ))}
          </div>
          <div>
            <p className="qpi-caps mb-4" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>Servicing</p>
            <div className="flex flex-wrap gap-2">
              {AREAS.map((a) => (
                <span
                  key={a}
                  style={{
                    color: "var(--qpi-ink)",
                    fontSize: "0.75rem",
                    padding: "6px 12px",
                    border: "1px solid rgba(11,42,74,0.25)",
                    borderRadius: 999,
                  }}
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: "0.75rem" }}>© 2026 QLD Pool Installs</p>
          <p style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: "0.75rem" }}>Site by finbar.studio</p>
        </div>
      </footer>
    ),
  },

  // 9 · Off-white, logo top-centre, everything centred, generous rhythm
  {
    name: "Off-White Centred Rhythm",
    node: (
      <footer className="relative w-full py-24 md:py-32 px-6 text-center" style={{ background: "#f5f2ee" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-11 w-auto mx-auto mb-12" />
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 mb-12">
          {FOOTER.nav.map((n) => (
            <a key={n} href="#" style={{ color: "var(--qpi-ink)", fontSize: "0.9375rem", textDecoration: "none" }}>{n}</a>
          ))}
        </div>
        <div className="mx-auto mb-12" style={{ width: 40, height: 1, background: "var(--qpi-blue)" }} />
        <p style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.9375rem" }}>{PHONE} · {EMAIL}</p>
        <p className="mt-3" style={{ color: "var(--qpi-ink)", opacity: 0.45, fontSize: "0.8125rem" }}>{AREAS.join(" · ")}</p>
        <p className="mt-14" style={{ color: "var(--qpi-ink)", opacity: 0.35, fontSize: "0.75rem" }}>© 2026 QLD Pool Installs · Site by finbar.studio</p>
      </footer>
    ),
  },

  // 10 · Ledger: each column headed by a qpi-caps label, tight rules between rows
  {
    name: "Column Ledger",
    node: (
      <footer className="relative w-full bg-white py-16 md:py-24 px-6 md:px-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-10">
          <div className="mb-10 md:mb-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-9 w-auto" />
          </div>
          <div>
            <p className="qpi-caps pb-3" style={{ color: "var(--qpi-blue)", fontSize: 10, borderBottom: "1px solid var(--qpi-ink)" }}>Navigate</p>
            {FOOTER.nav.map((n) => (
              <a key={n} href="#" className="block py-3" style={{ color: "var(--qpi-ink)", opacity: 0.7, fontSize: "0.8125rem", textDecoration: "none", borderBottom: "1px solid rgba(11,42,74,0.1)" }}>{n}</a>
            ))}
          </div>
          <div>
            <p className="qpi-caps pb-3" style={{ color: "var(--qpi-blue)", fontSize: 10, borderBottom: "1px solid var(--qpi-ink)" }}>Areas</p>
            {AREAS.map((a) => (
              <p key={a} className="py-3" style={{ color: "var(--qpi-ink)", opacity: 0.7, fontSize: "0.8125rem", borderBottom: "1px solid rgba(11,42,74,0.1)" }}>{a}</p>
            ))}
          </div>
          <div>
            <p className="qpi-caps pb-3" style={{ color: "var(--qpi-blue)", fontSize: 10, borderBottom: "1px solid var(--qpi-ink)" }}>Contact</p>
            <a href={PHONE_HREF} className="block py-3" style={{ color: "var(--qpi-ink)", fontSize: "0.8125rem", textDecoration: "none", borderBottom: "1px solid rgba(11,42,74,0.1)" }}>{PHONE}</a>
            <a href={`mailto:${EMAIL}`} className="block py-3" style={{ color: "var(--qpi-ink)", opacity: 0.7, fontSize: "0.8125rem", textDecoration: "none", borderBottom: "1px solid rgba(11,42,74,0.1)" }}>{EMAIL}</a>
          </div>
        </div>
        <div className="pt-8 mt-8 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTop: "1px solid rgba(11,42,74,0.15)" }}>
          <p style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: "0.75rem" }}>© 2026 QLD Pool Installs</p>
          <p style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: "0.75rem" }}>Site by finbar.studio</p>
        </div>
      </footer>
    ),
  },

  // 11 · Big logo image large on white with columns beneath
  {
    name: "Big Logo Header",
    node: (
      <footer className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-16 md:h-20 w-auto mx-auto mb-16" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-4xl mx-auto text-left pt-12" style={{ borderTop: "1px solid rgba(11,42,74,0.15)" }}>
          <div>
            <p className="qpi-caps mb-4" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>Navigate</p>
            {FOOTER.nav.map((n) => (
              <a key={n} href="#" className="block mb-2" style={{ color: "var(--qpi-ink)", opacity: 0.7, fontSize: "0.875rem", textDecoration: "none" }}>{n}</a>
            ))}
          </div>
          <div>
            <p className="qpi-caps mb-4" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>Areas</p>
            {AREAS.slice(0, 5).map((a) => (
              <p key={a} className="mb-2" style={{ color: "var(--qpi-ink)", opacity: 0.7, fontSize: "0.875rem" }}>{a}</p>
            ))}
          </div>
          <div>
            <p className="qpi-caps mb-4" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>Contact</p>
            <a href={PHONE_HREF} className="block mb-2" style={{ color: "var(--qpi-ink)", fontSize: "0.875rem", textDecoration: "none" }}>{PHONE}</a>
            <a href={`mailto:${EMAIL}`} style={{ color: "var(--qpi-ink)", opacity: 0.7, fontSize: "0.875rem", textDecoration: "none" }}>{EMAIL}</a>
          </div>
        </div>
        <p className="mt-16" style={{ color: "var(--qpi-ink)", opacity: 0.35, fontSize: "0.75rem" }}>© 2026 QLD Pool Installs · Site by finbar.studio</p>
      </footer>
    ),
  },

  // 12 · Navy with a white inner card holding the columns
  {
    name: "Navy, White Inner Card",
    node: (
      <footer className="relative w-full py-16 md:py-24 px-6 md:px-14" style={{ background: "var(--qpi-ink)" }}>
        <div className="max-w-6xl mx-auto bg-white p-8 sm:p-12 md:p-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10" style={{ borderBottom: "1px solid rgba(11,42,74,0.15)" }}>
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-9 w-auto mb-4" />
              <p style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: "0.8125rem" }}>{TAGLINE}</p>
            </div>
            <div>
              <p className="qpi-caps mb-4" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>Navigate</p>
              {FOOTER.nav.map((n) => (
                <a key={n} href="#" className="block mb-2" style={{ color: "var(--qpi-ink)", opacity: 0.7, fontSize: "0.8125rem", textDecoration: "none" }}>{n}</a>
              ))}
            </div>
            <div>
              <p className="qpi-caps mb-4" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>Areas</p>
              {AREAS.slice(0, 5).map((a) => (
                <p key={a} className="mb-2" style={{ color: "var(--qpi-ink)", opacity: 0.7, fontSize: "0.8125rem" }}>{a}</p>
              ))}
            </div>
            <div>
              <p className="qpi-caps mb-4" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>Contact</p>
              <a href={PHONE_HREF} className="block mb-2" style={{ color: "var(--qpi-ink)", fontSize: "0.8125rem", textDecoration: "none" }}>{PHONE}</a>
              <a href={`mailto:${EMAIL}`} style={{ color: "var(--qpi-ink)", opacity: 0.7, fontSize: "0.8125rem", textDecoration: "none" }}>{EMAIL}</a>
            </div>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: "0.75rem" }}>© 2026 QLD Pool Installs</p>
            <p style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: "0.75rem" }}>Site by finbar.studio</p>
          </div>
        </div>
      </footer>
    ),
  },

  // 13 · Two-tier: dark upper band (nav + contact), light lower bar (licences + credit)
  {
    name: "Two-Tier Band",
    node: (
      <footer className="relative w-full">
        <div className="py-16 md:py-20 px-6 md:px-14" style={{ background: "var(--qpi-ink)" }}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10">
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LOGO_WHITE} alt="QLD Pool Installs" className="h-9 w-auto mb-4" />
              <a href={PHONE_HREF} style={{ color: "#fff", fontSize: "1.125rem", textDecoration: "none" }}>{PHONE}</a>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {FOOTER.nav.map((n) => (
                <a key={n} href="#" className="qpi-caps" style={{ color: "#fff", opacity: 0.65, fontSize: 11, textDecoration: "none" }}>{n}</a>
              ))}
            </div>
          </div>
        </div>
        <div className="py-6 px-6 md:px-14 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ background: "#f5f2ee" }}>
          <p style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: "0.75rem" }}>{LICENCES.qbcc} · {LICENCES.nsw}</p>
          <p style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: "0.75rem" }}>© 2026 QLD Pool Installs · Site by finbar.studio</p>
        </div>
      </footer>
    ),
  },

  // 14 · Areas-forward: the 7 AREAS as a big list, contact compact at the side
  {
    name: "Areas Forward",
    node: (
      <footer className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-14">
          <div>
            <p className="qpi-caps mb-6" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>Where We Build</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              {AREAS.map((a, i) => (
                <p
                  key={a}
                  className="qpi-display py-3"
                  style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.375rem, 2.6vw, 2rem)", lineHeight: 1.1, borderTop: i < 2 ? "1px solid rgba(11,42,74,0.15)" : undefined, borderBottom: "1px solid rgba(11,42,74,0.15)" }}
                >
                  {a}
                </p>
              ))}
            </div>
          </div>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-8 w-auto mb-8" />
            <p className="qpi-caps mb-3" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>Contact</p>
            <a href={PHONE_HREF} className="block mb-2" style={{ color: "var(--qpi-ink)", fontSize: "0.9375rem", textDecoration: "none" }}>{PHONE}</a>
            <a href={`mailto:${EMAIL}`} className="block mb-8" style={{ color: "var(--qpi-ink)", opacity: 0.7, fontSize: "0.9375rem", textDecoration: "none" }}>{EMAIL}</a>
            <p className="qpi-caps mb-3" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>Navigate</p>
            {FOOTER.nav.map((n) => (
              <a key={n} href="#" className="block mb-2" style={{ color: "var(--qpi-ink)", opacity: 0.7, fontSize: "0.875rem", textDecoration: "none" }}>{n}</a>
            ))}
          </div>
        </div>
        <div className="mt-16 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTop: "1px solid rgba(11,42,74,0.15)" }}>
          <p style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: "0.75rem" }}>© 2026 QLD Pool Installs</p>
          <p style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: "0.75rem" }}>Site by finbar.studio</p>
        </div>
      </footer>
    ),
  },

  // 15 · Wordmark left at large scale, nav and contact right-aligned opposite it
  {
    name: "Wordmark vs Nav",
    node: (
      <footer className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 pb-14" style={{ borderBottom: "1px solid rgba(11,42,74,0.15)" }}>
          <p className="qpi-display" style={{ color: "var(--qpi-ink)", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 0.95, letterSpacing: "-0.02em" }}>
            QLD POOL<br />INSTALLS
          </p>
          <div className="text-right">
            <div className="flex flex-wrap md:justify-end gap-x-6 gap-y-2 mb-6">
              {FOOTER.nav.map((n) => (
                <a key={n} href="#" style={{ color: "var(--qpi-ink)", opacity: 0.7, fontSize: "0.875rem", textDecoration: "none" }}>{n}</a>
              ))}
            </div>
            <a href={PHONE_HREF} style={{ color: "var(--qpi-ink)", fontSize: "1.0625rem", textDecoration: "none" }}>{PHONE}</a>
            <p style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: "0.875rem" }}>{EMAIL}</p>
          </div>
        </div>
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: "0.75rem" }}>© 2026 QLD Pool Installs</p>
          <p style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: "0.75rem" }}>Site by finbar.studio</p>
        </div>
      </footer>
    ),
  },

  // 16 · Licences-forward: QBCC + NSW numbers given real prominence
  {
    name: "Licences Forward",
    node: (
      <footer className="relative w-full py-20 md:py-28 px-6 md:px-14" style={{ background: "var(--qpi-ink)" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-14">
          <div className="p-8" style={{ border: "1px solid rgba(255,255,255,0.2)" }}>
            <p className="qpi-caps mb-3" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>Queensland Licence</p>
            <p className="qpi-display" style={{ color: "#fff", fontSize: "clamp(1.375rem, 2.4vw, 1.875rem)" }}>{LICENCES.qbcc}</p>
          </div>
          <div className="p-8" style={{ border: "1px solid rgba(255,255,255,0.2)" }}>
            <p className="qpi-caps mb-3" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>NSW Licence</p>
            <p className="qpi-display" style={{ color: "#fff", fontSize: "clamp(1.375rem, 2.4vw, 1.875rem)" }}>{LICENCES.nsw}</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 pt-10" style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}>
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_WHITE} alt="QLD Pool Installs" className="h-8 w-auto" />
            <span style={{ color: "#fff", opacity: 0.4, fontSize: "0.8125rem" }}>{FOOTER.warranty}</span>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {FOOTER.nav.map((n) => (
              <a key={n} href="#" style={{ color: "#fff", opacity: 0.65, fontSize: "0.8125rem", textDecoration: "none" }}>{n}</a>
            ))}
          </div>
        </div>
        <p className="mt-10" style={{ color: "#fff", opacity: 0.35, fontSize: "0.75rem" }}>© 2026 QLD Pool Installs · Site by finbar.studio</p>
      </footer>
    ),
  },

  // 17 · Compact single-row footer: logo, nav inline, phone, credit, one hairline
  {
    name: "Compact Single Row",
    node: (
      <footer className="relative w-full bg-white py-6 px-6 md:px-14" style={{ borderTop: "1px solid rgba(11,42,74,0.15)" }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-7 w-auto" />
            <div className="hidden md:flex items-center gap-5">
              {FOOTER.nav.map((n) => (
                <a key={n} href="#" style={{ color: "var(--qpi-ink)", opacity: 0.65, fontSize: "0.8125rem", textDecoration: "none" }}>{n}</a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-5">
            <a href={PHONE_HREF} style={{ color: "var(--qpi-ink)", fontSize: "0.875rem", textDecoration: "none" }}>{PHONE}</a>
            <span style={{ color: "var(--qpi-ink)", opacity: 0.3, fontSize: "0.75rem" }}>© 2026 QLD Pool Installs</span>
            <span style={{ color: "var(--qpi-ink)", opacity: 0.3, fontSize: "0.75rem" }}>Site by finbar.studio</span>
          </div>
        </div>
      </footer>
    ),
  },

  // 18 · Editorial: FOOTER.blurb set large as the lead, columns small beneath
  {
    name: "Editorial Blurb Lead",
    node: (
      <footer className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <p
          className="qpi-display text-balance mb-16"
          style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 4vw, 3.25rem)", lineHeight: 1.15, maxWidth: 900 }}
        >
          {FOOTER.blurb}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pt-10" style={{ borderTop: "1px solid rgba(11,42,74,0.15)" }}>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-8 w-auto" />
          </div>
          <div>
            <p className="qpi-caps mb-3" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>Navigate</p>
            {FOOTER.nav.slice(0, 3).map((n) => (
              <a key={n} href="#" className="block mb-1.5" style={{ color: "var(--qpi-ink)", opacity: 0.65, fontSize: "0.8125rem", textDecoration: "none" }}>{n}</a>
            ))}
          </div>
          <div>
            <p className="qpi-caps mb-3" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>More</p>
            {FOOTER.nav.slice(3).map((n) => (
              <a key={n} href="#" className="block mb-1.5" style={{ color: "var(--qpi-ink)", opacity: 0.65, fontSize: "0.8125rem", textDecoration: "none" }}>{n}</a>
            ))}
          </div>
          <div>
            <p className="qpi-caps mb-3" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>Contact</p>
            <a href={PHONE_HREF} className="block mb-1.5" style={{ color: "var(--qpi-ink)", fontSize: "0.8125rem", textDecoration: "none" }}>{PHONE}</a>
            <span style={{ color: "var(--qpi-ink)", opacity: 0.35, fontSize: "0.75rem" }}>Site by finbar.studio</span>
          </div>
        </div>
      </footer>
    ),
  },

  // 19 · Grid with a navy block holding the warranty text as a feature cell
  {
    name: "Warranty Feature Cell",
    node: (
      <footer className="relative w-full bg-white py-16 md:py-24 px-6 md:px-14">
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ border: "1px solid rgba(11,42,74,0.15)" }}>
          <div className="p-10 flex flex-col justify-center" style={{ background: "var(--qpi-ink)", gridColumn: "span 1" }}>
            <p className="qpi-caps mb-3" style={{ color: "#fff", opacity: 0.55, fontSize: 10 }}>Our Promise</p>
            <p className="text-pretty" style={{ color: "#fff", fontSize: "0.9375rem", lineHeight: 1.6 }}>{FOOTER.warranty}</p>
          </div>
          <div className="p-10" style={{ borderLeft: "1px solid rgba(11,42,74,0.15)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-8 w-auto mb-6" />
            <p className="qpi-caps mb-3" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>Navigate</p>
            {FOOTER.nav.map((n) => (
              <a key={n} href="#" className="block mb-1.5" style={{ color: "var(--qpi-ink)", opacity: 0.7, fontSize: "0.8125rem", textDecoration: "none" }}>{n}</a>
            ))}
          </div>
          <div className="p-10" style={{ borderLeft: "1px solid rgba(11,42,74,0.15)" }}>
            <p className="qpi-caps mb-3" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>Contact</p>
            <a href={PHONE_HREF} className="block mb-2" style={{ color: "var(--qpi-ink)", fontSize: "0.9375rem", textDecoration: "none" }}>{PHONE}</a>
            <a href={`mailto:${EMAIL}`} className="block mb-6" style={{ color: "var(--qpi-ink)", opacity: 0.7, fontSize: "0.875rem", textDecoration: "none" }}>{EMAIL}</a>
            <p style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: "0.75rem" }}>© 2026 QLD Pool Installs</p>
            <p style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: "0.75rem" }}>Site by finbar.studio</p>
          </div>
        </div>
      </footer>
    ),
  },

  // 20 · Stacked: nav as big type list, contact and licences as fine print beneath
  {
    name: "Stacked Big Nav",
    node: (
      <footer className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-8 w-auto mb-14" />
        <div className="mb-16">
          {FOOTER.nav.map((n, i) => (
            <a
              key={n}
              href="#"
              className="qpi-display block"
              style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 5vw, 3.25rem)", lineHeight: 1.3, textDecoration: "none", opacity: i === 0 ? 1 : 0.85 }}
            >
              {n}
            </a>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-8" style={{ borderTop: "1px solid rgba(11,42,74,0.15)" }}>
          <div>
            <p style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: "0.8125rem" }}>{PHONE} · {EMAIL}</p>
            <p style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: "0.75rem" }}>{LICENCES.qbcc} · {LICENCES.nsw}</p>
          </div>
          <p style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: "0.75rem" }}>© 2026 QLD Pool Installs · Site by finbar.studio</p>
        </div>
      </footer>
    ),
  },

  // 21 · Full-bleed navy with the wordmark cropped/bleeding off the bottom edge
  {
    name: "Bleeding Wordmark",
    node: (
      <footer className="relative w-full overflow-hidden" style={{ background: "var(--qpi-ink)" }}>
        <div className="px-6 md:px-14 pt-16 pb-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LOGO_WHITE} alt="QLD Pool Installs" className="h-9 w-auto" />
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {FOOTER.nav.map((n) => (
                <a key={n} href="#" className="qpi-caps" style={{ color: "#fff", opacity: 0.6, fontSize: 11, textDecoration: "none" }}>{n}</a>
              ))}
            </div>
          </div>
        </div>
        <p
          aria-hidden="true"
          className="qpi-display"
          style={{
            color: "#fff",
            opacity: 0.08,
            fontSize: "clamp(6rem, 22vw, 16rem)",
            lineHeight: 0.8,
            letterSpacing: "-0.02em",
            whiteSpace: "nowrap",
            marginTop: 20,
            marginBottom: "-8%",
            textAlign: "center",
          }}
        >
          POOL INSTALLS
        </p>
        <div className="relative px-6 md:px-14 py-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}>
          <p style={{ color: "#fff", opacity: 0.4, fontSize: "0.75rem" }}>© 2026 QLD Pool Installs</p>
          <p style={{ color: "#fff", opacity: 0.4, fontSize: "0.75rem" }}>Site by finbar.studio</p>
        </div>
      </footer>
    ),
  },

  // 22 · Two columns only: brand + blurb left, everything else right
  {
    name: "Two Columns Only",
    node: (
      <footer className="relative w-full bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-9 w-auto mb-5" />
            <p className="text-pretty" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.65, maxWidth: 380 }}>
              {FOOTER.blurb}
            </p>
            <p className="mt-6" style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: "0.75rem" }}>{LICENCES.qbcc}</p>
            <p style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: "0.75rem" }}>{LICENCES.nsw}</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-end gap-14">
            <div>
              <p className="qpi-caps mb-4" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>Navigate</p>
              {FOOTER.nav.map((n) => (
                <a key={n} href="#" className="block mb-2" style={{ color: "var(--qpi-ink)", opacity: 0.7, fontSize: "0.875rem", textDecoration: "none" }}>{n}</a>
              ))}
            </div>
            <div>
              <p className="qpi-caps mb-4" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>Contact</p>
              <a href={PHONE_HREF} className="block mb-2" style={{ color: "var(--qpi-ink)", fontSize: "0.875rem", textDecoration: "none" }}>{PHONE}</a>
              <a href={`mailto:${EMAIL}`} style={{ color: "var(--qpi-ink)", opacity: 0.7, fontSize: "0.875rem", textDecoration: "none" }}>{EMAIL}</a>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTop: "1px solid rgba(11,42,74,0.15)" }}>
          <p style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: "0.75rem" }}>© 2026 QLD Pool Installs</p>
          <p style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: "0.75rem" }}>Site by finbar.studio</p>
        </div>
      </footer>
    ),
  },

  // 23 · Centred wordmark with nav in a ring/row above and legal below
  {
    name: "Centred Ring",
    node: (
      <footer className="relative w-full bg-white py-20 md:py-28 px-6 text-center">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-10">
          {FOOTER.nav.map((n) => (
            <a key={n} href="#" className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11, textDecoration: "none" }}>{n}</a>
          ))}
        </div>
        <p className="qpi-display" style={{ color: "var(--qpi-ink)", fontSize: "clamp(2rem, 5vw, 3.75rem)", lineHeight: 1, letterSpacing: "-0.01em" }}>
          QLD POOL INSTALLS*
        </p>
        <p className="mt-5" style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: "0.9375rem" }}>{PHONE} · {EMAIL}</p>
        <div className="max-w-md mx-auto mt-12 pt-6" style={{ borderTop: "1px solid rgba(11,42,74,0.15)" }}>
          <p style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: "0.75rem" }}>{LICENCES.qbcc} · {LICENCES.nsw}</p>
          <p className="mt-2" style={{ color: "var(--qpi-ink)", opacity: 0.35, fontSize: "0.75rem" }}>© 2026 QLD Pool Installs · Site by finbar.studio</p>
        </div>
      </footer>
    ),
  },

  // 24 · Warranty-led: the warranty line as a wide quiet statement across the top
  {
    name: "Warranty Statement Lead",
    node: (
      <footer className="relative w-full bg-white">
        <div className="py-10 px-6 md:px-14 text-center" style={{ background: "#f5f2ee" }}>
          <p className="text-pretty mx-auto" style={{ color: "var(--qpi-ink)", opacity: 0.65, fontSize: "0.9375rem", lineHeight: 1.6, maxWidth: 720 }}>
            {FOOTER.warranty}
          </p>
        </div>
        <div className="py-16 md:py-20 px-6 md:px-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 pb-10" style={{ borderBottom: "1px solid rgba(11,42,74,0.15)" }}>
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-9 w-auto" />
            </div>
            <div>
              <p className="qpi-caps mb-4" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>Navigate</p>
              {FOOTER.nav.map((n) => (
                <a key={n} href="#" className="block mb-2" style={{ color: "var(--qpi-ink)", opacity: 0.7, fontSize: "0.8125rem", textDecoration: "none" }}>{n}</a>
              ))}
            </div>
            <div>
              <p className="qpi-caps mb-4" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>Contact</p>
              <a href={PHONE_HREF} className="block mb-2" style={{ color: "var(--qpi-ink)", fontSize: "0.8125rem", textDecoration: "none" }}>{PHONE}</a>
              <a href={`mailto:${EMAIL}`} style={{ color: "var(--qpi-ink)", opacity: 0.7, fontSize: "0.8125rem", textDecoration: "none" }}>{EMAIL}</a>
            </div>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: "0.75rem" }}>© 2026 QLD Pool Installs</p>
            <p style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: "0.75rem" }}>Site by finbar.studio</p>
          </div>
        </div>
      </footer>
    ),
  },

  // 25 · Blue rule motif: a thick blue rule separating a white top from a navy bottom
  {
    name: "Blue Rule Split",
    node: (
      <footer className="relative w-full">
        <div className="bg-white pt-16 md:pt-20 pb-10 px-6 md:px-14">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-9 w-auto" />
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {FOOTER.nav.map((n) => (
                <a key={n} href="#" style={{ color: "var(--qpi-ink)", opacity: 0.7, fontSize: "0.875rem", textDecoration: "none" }}>{n}</a>
              ))}
            </div>
          </div>
        </div>
        <div style={{ height: 6, background: "var(--qpi-blue)" }} />
        <div className="py-8 px-6 md:px-14 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ background: "var(--qpi-ink)" }}>
          <p style={{ color: "#fff", opacity: 0.7, fontSize: "0.8125rem" }}>{PHONE} · {EMAIL}</p>
          <p style={{ color: "#fff", opacity: 0.5, fontSize: "0.75rem" }}>© 2026 QLD Pool Installs · Site by finbar.studio</p>
        </div>
      </footer>
    ),
  },
];
