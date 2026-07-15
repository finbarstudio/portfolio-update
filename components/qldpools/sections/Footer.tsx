import { FOOTER, PHONE, PHONE_HREF, EMAIL, LOGO_DARK } from "@/app/qldpools/site/sections/kit";

/**
 * Footer — gallery option 4, "Minimal Centred": logo centred, one line of
 * nav, contact beneath, vast whitespace. No client-side interaction, so this
 * stays a server component. Copyright year is written literally, not derived
 * from the client's clock.
 */
export default function Footer() {
  return (
    <footer className="relative w-full bg-white py-24 md:py-32 px-6 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-10 w-auto mx-auto mb-10" />
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-10">
        {FOOTER.nav.map((n) => (
          <a
            key={n}
            href="#"
            className="qpi-caps"
            style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: 11, textDecoration: "none" }}
          >
            {n}
          </a>
        ))}
      </div>
      <a href={PHONE_HREF} style={{ color: "var(--qpi-ink)", fontSize: "1rem", textDecoration: "none" }}>
        {PHONE}
      </a>
      <p className="mt-2" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: "0.875rem" }}>
        {EMAIL}
      </p>
      <p className="mt-16" style={{ color: "var(--qpi-ink)", opacity: 0.35, fontSize: "0.75rem" }}>
        © 2026 QLD Pool Installs · Site by finbar.studio
      </p>
    </footer>
  );
}
