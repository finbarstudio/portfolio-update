"use client";

/**
 * ContactDrawer — a quick contact panel that slides in from the right (a bottom
 * sheet on mobile), opened from the sidebar's contact icon. Keeps people on the
 * page instead of routing to a separate contact route. CSS-transition based.
 */

import { useEffect, useRef } from "react";

const socials = [
  { label: "Are.na", href: "https://are.na/finbar-studio" },
  { label: "LinkedIn", href: "https://linkedin.com/in/finbarskitini" },
  { label: "Instagram", href: "https://instagram.com/finbar.studio" },
  { label: "X", href: "https://x.com/finbarstudio" },
];

export default function ContactDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    // move focus into the panel for keyboard users
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      className={`contact-drawer-root ${open ? "is-open" : ""}`}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div className="contact-drawer-backdrop" onClick={onClose} />

      {/* Panel */}
      <div
        className="contact-drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Contact"
        tabIndex={-1}
        ref={panelRef}
      >
        <div className="flex items-center justify-between mb-8">
          <p className="mono-label text-ink-soft">Get in touch</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close contact"
            className="flex items-center justify-center text-ink hover:text-pink transition-colors -mr-2"
            style={{ width: 40, height: 40 }}
          >
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <p className="text-ink-soft mb-3" style={{ fontSize: "var(--text-small)" }}>
          Got a project or a role in mind? Email is the fastest way to reach me.
        </p>
        <h3 className="mb-8">
          <a
            href="mailto:finbar@finbar.studio"
            className="mono-h3 text-ink hover:text-pink transition-colors"
            style={{ whiteSpace: "nowrap", letterSpacing: "0.05em", fontSize: "clamp(0.9rem, 4.6vw, 1.2rem)" }}
          >
            finbar@finbar.studio
          </a>
        </h3>

        <div className="home-list mb-8" style={{ fontSize: "var(--text-small)" }}>
          <a href="tel:+61412796630" className="text-ink hover:text-pink transition-colors tabular-nums justify-between">
            <span className="mono-label text-ink-soft">Phone</span>
            <span>+61 412 796 630</span>
          </a>
          <div className="justify-between">
            <span className="mono-label text-ink-soft">Location</span>
            <span className="text-ink">Brisbane, QLD</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-2 mb-8">
          {socials.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mono-label text-ink-soft hover:text-pink transition-colors"
            >
              {s.label}
            </a>
          ))}
        </div>

        <span className="status-badge">OPEN FOR WORK</span>
      </div>
    </div>
  );
}
