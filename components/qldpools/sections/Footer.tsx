import { FOOTER, PHONE, PHONE_HREF, EMAIL } from "@/app/qldpools/site/sections/kit";
import ArchLogo from "@/components/qldpools/ArchLogo";

/**
 * Footer — gallery option 4, "Minimal Centred": logo centred, one line of
 * nav, contact beneath, vast whitespace. No client-side interaction, so this
 * stays a server component. Copyright year is written literally, not derived
 * from the client's clock.
 */
export default function Footer() {
  return (
    <footer className="relative w-full bg-white qpi-gutter text-center min-h-svh flex flex-col justify-center py-16 md:py-20">
      <ArchLogo variant="stacked" height={92} className="mx-auto mb-8" />
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-8">
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
      <p className="mt-12" style={{ color: "var(--qpi-ink)", opacity: 0.35, fontSize: "0.75rem" }}>
        © 2026 QLD Pool Installs · Site by finbar.studio
      </p>
    </footer>
  );
}
