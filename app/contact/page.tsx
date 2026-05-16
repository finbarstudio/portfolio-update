import type { Metadata } from "next";
import Link from "next/link";
import { SiX, SiInstagram } from "@icons-pack/react-simple-icons";

export const metadata: Metadata = {
  title: "Contact — finbar✶studio",
  description:
    "Get in touch with Finbar — Brisbane-based graphic designer and Framer developer, open for work.",
};

/* ── Inline icons (server-safe SVGs) ─────────────────────────── */
function ArenaIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 150 90" fill="currentColor" aria-hidden="true">
      <path d="M148.93 62.356l-20.847-16.384c-1.276-1-1.276-2.642 0-3.645l20.848-16.38c1.28-1.002 1.815-2.695 1.19-3.76-.626-1.062-2.374-1.44-3.88-.84l-24.79 9.874c-1.507.606-2.927-.22-3.153-1.83L114.57 2.926C114.34 1.317 113.13 0 111.877 0c-1.247 0-2.456 1.317-2.68 2.925l-3.73 26.467c-.228 1.61-1.646 2.434-3.155 1.83l-24.38-9.71c-1.512-.602-3.975-.602-5.483 0l-24.384 9.71c-1.508.604-2.928-.22-3.154-1.83L41.186 2.925C40.956 1.317 39.748 0 38.5 0c-1.252 0-2.463 1.317-2.688 2.925l-3.73 26.467c-.226 1.61-1.645 2.434-3.153 1.83L4.14 21.35c-1.507-.603-3.252-.223-3.878.838-.625 1.066-.092 2.76 1.184 3.76l20.85 16.38c1.277 1.003 1.277 2.645 0 3.646L1.446 62.356C.166 63.358-.364 65.152.26 66.34c.627 1.19 2.372 1.668 3.877 1.064l24.567-9.866c1.51-.603 2.914.218 3.125 1.828l3.544 26.696c.214 1.607 1.618 2.923 3.12 2.923 1.5 0 2.905-1.315 3.12-2.923l3.55-26.696c.21-1.61 1.62-2.43 3.122-1.828l24.164 9.698c1.506.606 3.97.606 5.477 0l24.16-9.698c1.504-.603 2.91.218 3.125 1.828l3.55 26.696c.212 1.607 1.617 2.923 3.115 2.923 1.502 0 2.907-1.315 3.12-2.923l3.55-26.696c.216-1.61 1.62-2.43 3.124-1.828l24.57 9.866c1.5.604 3.25.125 3.876-1.063.627-1.186.094-2.98-1.185-3.982zM95.89 46.18L77.53 60.315c-1.285.99-3.393.99-4.674 0L54.49 46.18c-1.284-.99-1.294-2.62-.02-3.625l18.4-14.493c1.274-1.005 3.363-1.005 4.638 0l18.4 14.493c1.277 1.004 1.267 2.634-.02 3.626z" />
    </svg>
  );
}

function LinkedInIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const socials = [
  { label: "Are.na",    href: "https://are.na/finbar-studio",          icon: <ArenaIcon size={16} /> },
  { label: "X",         href: "https://x.com/finbarstudio",            icon: <SiX size={15} aria-hidden="true" /> },
  { label: "LinkedIn",  href: "https://linkedin.com/in/finbarskitini", icon: <LinkedInIcon size={16} /> },
  { label: "Instagram", href: "https://instagram.com/finbar.studio",   icon: <SiInstagram size={16} aria-hidden="true" /> },
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

      {/* Contact details */}
      <div className="py-10 border-b border-line">
        <div className="mb-7">
          <p className="mono-label text-ink-soft mb-2">Email</p>
          <a
            href="mailto:finbar@finbar.studio"
            className="block font-sans font-medium text-ink hover:text-pink transition-colors"
            style={{ fontSize: "var(--text-h2)" }}
          >
            finbar@finbar.studio
          </a>
          <p className="text-ink-soft font-sans mt-1" style={{ fontSize: "var(--text-small)" }}>
            Best way to reach me. Usually reply within one business day.
          </p>
        </div>

        <div className="mb-7">
          <p className="mono-label text-ink-soft mb-2">Phone</p>
          <a
            href="tel:+61412796630"
            className="font-mono text-ink hover:text-pink transition-colors"
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

        {/* Open for work — directly below contact details */}
        <div>
          <div className="mb-2">
            <span className="status-badge">OPEN FOR WORK</span>
          </div>
          <p className="text-ink-soft font-sans max-w-md" style={{ fontSize: "var(--text-small)" }}>
            Available for full-time design roles and freelance projects.
            Happy to discuss Brisbane-based or remote positions.
          </p>
        </div>
      </div>

      {/* Socials — icon + label pairs */}
      <div className="py-8">
        <p className="mono-label text-ink-soft mb-4">Follow</p>
        <div className="flex flex-wrap gap-6">
          {socials.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-ink-soft hover:text-pink transition-colors"
            >
              {s.icon}
              <span className="mono-label">{s.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
