import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact — finbar✶studio",
  description:
    "Get in touch with Finbar — Brisbane-based graphic designer and Framer developer, open for work.",
};

const socials = [
  { label: "Are.na", href: "https://are.na/finbar-studio" },
  { label: "X / Twitter", href: "https://x.com/finbarstudio" },
  { label: "LinkedIn", href: "https://linkedin.com/in/finbarskitini" },
  { label: "Instagram", href: "https://instagram.com/finbar.studio" },
];

export default function ContactPage() {
  return (
    <div className="px-6 md:px-10">
      {/* Back nav */}
      <div className="py-5 border-b border-line">
        <Link href="/" className="mono-label text-ink-soft hover:text-pink transition-colors">
          ← HOME
        </Link>
      </div>

      {/* Heading */}
      <div className="pt-10 pb-8 border-b border-line">
        <p className="mono-label text-ink-soft mb-3">Contact</p>
        <h1
          className="font-mono font-bold uppercase text-ink max-w-xl leading-tight"
          style={{ fontSize: "var(--text-h1)", letterSpacing: "0.08em" }}
        >
          Let&rsquo;s work together.
        </h1>
      </div>

      {/* Contact details — email, phone, location */}
      <div className="py-10 border-b border-line">
        <div className="mb-7">
          <p className="mono-label text-ink-soft mb-2">Email</p>
          <a
            href="mailto:finbar@finbar.studio"
            className="block font-sans font-medium text-ink hover:text-pink transition-colors link-wipe"
            style={{ fontSize: "var(--text-h2)" }}
          >
            finbar@finbar.studio
          </a>
          <p className="text-ink-soft font-sans mt-1" style={{ fontSize: "var(--text-small)" }}>
            Best way to reach me. Usually reply within one business day.{/* PLACEHOLDER — adjust */}
          </p>
        </div>

        <div className="mb-7">
          <p className="mono-label text-ink-soft mb-2">Phone</p>
          <a
            href="tel:+61412796630"
            className="font-mono text-ink hover:text-pink transition-colors link-wipe"
            style={{ fontSize: "var(--text-small)" }}
          >
            +61 412 796 630
          </a>
        </div>

        <div className="mb-7">
          <p className="mono-label text-ink-soft mb-2">Location</p>
          <p className="font-mono text-ink" style={{ fontSize: "var(--text-small)" }}>Brisbane, Australia</p>
          <p className="text-ink-soft font-sans mt-0.5" style={{ fontSize: "var(--text-caption)" }}>
            Remote-friendly — previously worked with clients across UK and Australia.
          </p>
        </div>

        {/* OPEN FOR WORK — sits directly under contact details per spec §6 */}
        <div className="pt-2">
          <span className="status-badge mb-2 block">OPEN FOR WORK</span>
          <p className="text-ink-soft font-sans max-w-md" style={{ fontSize: "var(--text-small)" }}>
            {/* PLACEHOLDER — update with current availability */}
            Available for full-time design roles and freelance projects.
            Happy to discuss Brisbane-based or remote positions.
          </p>
        </div>
      </div>

      {/* Socials */}
      <div className="py-8">
        <p className="mono-label text-ink-soft mb-4">Follow</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {socials.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mono-label text-ink hover:text-pink transition-colors link-wipe"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
