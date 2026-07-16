import { FOOTER, LICENCES, PHONE, PHONE_HREF, EMAIL, LOGO_DARK, TAGLINE } from "@/app/qldpools/site/sections/kit";

/**
 * Footer — "Single Rule Minimal" (gallery #33), ported faithfully from
 * app/qldpools/site/sections/options/footer2.tsx (entry index 7): one
 * hairline rule beneath a logo / nav / contact row, everything else
 * collapsed to a single centred line. Per the client's note ("i need 33 but
 * with license plates" = include the licence numbers as text, not
 * number-plate styling), both QBCC and NSW licence numbers now appear as
 * fine print sitting naturally above the copyright line.
 */
export default function Footer() {
  return (
    <footer className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
      <div
        className="mx-auto flex w-full max-w-4xl flex-col sm:flex-row sm:items-center sm:justify-between gap-5 pb-6"
        style={{ borderBottom: "2px solid var(--qpi-ink)" }}
      >
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-8 w-auto" />
          <p className="mt-2 text-[11px] text-[var(--qpi-ink)]/50">{TAGLINE}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {FOOTER.nav.map((n) => (
            <a key={n} href="#" className="text-[12px] text-[var(--qpi-ink)]/70 hover:text-[var(--qpi-blue)]" style={{ textDecoration: "none" }}>
              {n}
            </a>
          ))}
        </div>
        <div className="flex flex-col sm:items-end gap-1">
          <a href={PHONE_HREF} className="text-[13px] font-semibold text-[var(--qpi-ink)]" style={{ textDecoration: "none" }}>
            {PHONE}
          </a>
          <a href={`mailto:${EMAIL}`} className="text-[12px] text-[var(--qpi-ink)]/60" style={{ textDecoration: "none" }}>
            {EMAIL}
          </a>
        </div>
      </div>

      <p className="mx-auto mt-4 w-full max-w-4xl text-center text-[10.5px] text-[var(--qpi-ink)]/40">
        {LICENCES.qbcc} · {LICENCES.nsw}
      </p>

      <div className="mx-auto mt-3 flex w-full max-w-4xl items-center justify-center gap-2 text-[11px] text-[var(--qpi-ink)]/40">
        © 2026 QLD Pool Installs
        <span aria-hidden="true">·</span>
        Site by finbar.studio
      </div>
    </footer>
  );
}
