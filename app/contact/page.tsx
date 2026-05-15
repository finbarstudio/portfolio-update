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
        <Link
          href="/"
          className="mono-label text-ink-soft hover:text-pink transition-colors"
        >
          ← HOME
        </Link>
      </div>

      {/* Heading */}
      <div className="pt-10 pb-8 border-b border-line">
        <p className="mono-label text-ink-soft mb-3">Contact</p>
        <h1 className="font-mono font-bold text-[clamp(1.5rem,3vw,2rem)] tracking-[0.08em] uppercase text-ink max-w-xl leading-tight">
          Let&rsquo;s work together.
        </h1>
      </div>

      {/* Primary contact */}
      <div className="py-10 border-b border-line">
        <p className="mono-label text-ink-soft mb-5">Email</p>
        <a
          href="mailto:finbar@finbar.studio"
          className="block font-sans text-2xl font-medium text-ink hover:text-pink transition-colors mb-2"
        >
          finbar@finbar.studio
        </a>
        <p className="text-sm text-ink-soft font-sans">
          Best way to reach me. Usually reply within one business day.{" "}
          {/* PLACEHOLDER — adjust if preferred */}
        </p>
      </div>

      {/* Phone */}
      <div className="py-8 border-b border-line">
        <p className="mono-label text-ink-soft mb-3">Phone</p>
        <a
          href="tel:+61412796630"
          className="font-mono text-sm text-ink hover:text-pink transition-colors"
        >
          +61 412 796 630
        </a>
      </div>

      {/* Location */}
      <div className="py-8 border-b border-line">
        <p className="mono-label text-ink-soft mb-3">Location</p>
        <p className="font-mono text-sm text-ink">Brisbane, Australia</p>
        <p className="text-xs text-ink-soft font-sans mt-1">
          Remote-friendly — previously worked with clients across UK and Australia.
        </p>
      </div>

      {/* Socials */}
      <div className="py-8 border-b border-line">
        <p className="mono-label text-ink-soft mb-4">Follow</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {socials.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mono-label text-ink hover:text-pink transition-colors"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      {/* Availability note */}
      <div className="py-8">
        <span className="status-badge mb-3 block">OPEN FOR WORK</span>
        <p className="text-sm text-ink-soft font-sans max-w-md">
          {/*
           * PLACEHOLDER — update with current availability.
           * E.g. full-time roles, freelance, start date.
           */}
          Available for full-time design roles and freelance projects.
          Happy to discuss Brisbane-based or remote positions.
        </p>
      </div>
    </div>
  );
}
