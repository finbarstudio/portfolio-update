"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
  { label: "WORK", href: "/#work" },
  { label: "ABOUT", href: "/about" },
  { label: "CONTACT", href: "/contact" },
];

const socials = [
  { label: "Are.na", href: "https://are.na/finbar-studio" },
  { label: "X", href: "https://x.com/finbarstudio" },
  { label: "LinkedIn", href: "https://linkedin.com/in/finbarskitini" },
  { label: "Instagram", href: "https://instagram.com/finbar.studio" },
];

function Logo() {
  return (
    <Link
      href="/"
      className="block font-mono font-bold text-[11px] tracking-[0.14em] uppercase text-ink hover:opacity-70 transition-opacity"
      aria-label="finbar✶studio — back to home"
    >
      finbar<span className="text-pink" aria-hidden="true">✶</span>studio
    </Link>
  );
}

/* ── Desktop sidebar ──────────────────────────────────────── */
function DesktopSidebar({ pathname }: { pathname: string }) {
  const isActive = (href: string) => {
    if (href === "/#work") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className="hidden md:flex fixed left-0 top-0 h-screen w-56 border-r border-line bg-bg flex-col z-40 overflow-y-auto"
      aria-label="Site navigation"
    >
      {/* Logo */}
      <div className="px-6 pt-8 pb-6 border-b border-line">
        <Logo />
      </div>

      {/* Primary nav */}
      <nav className="px-6 py-6 border-b border-line" aria-label="Primary">
        <ul className="space-y-1" role="list">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`sidebar-link${isActive(link.href) ? " active" : ""}`}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Open for work */}
        <div className="mt-5">
          <span className="status-badge">OPEN FOR WORK</span>
        </div>
      </nav>

      {/* Contact */}
      <div className="px-6 py-6 border-b border-line">
        <p className="mono-label text-ink-soft mb-3">Contact</p>
        <a
          href="mailto:finbar@finbar.studio"
          className="block text-[10px] font-mono text-ink-soft hover:text-pink transition-colors mb-1 link-wipe"
        >
          finbar@finbar.studio
        </a>
        <a
          href="tel:+61412796630"
          className="block text-[10px] font-mono text-ink-soft hover:text-pink transition-colors"
        >
          +61 412 796 630
        </a>
      </div>

      {/* Socials */}
      <div className="px-6 py-6 border-b border-line">
        <p className="mono-label text-ink-soft mb-3">Follow</p>
        <ul className="space-y-1" role="list">
          {socials.map((s) => (
            <li key={s.href}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-mono text-ink-soft hover:text-pink transition-colors link-wipe"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer info */}
      <div className="px-6 py-6 mt-auto">
        <p className="mono-label text-ink-soft">Brisbane, Australia</p>
        <p className="mono-label text-ink-soft mt-1">2026©</p>
      </div>
    </aside>
  );
}

/* ── Mobile top bar ───────────────────────────────────────── */
function MobileTopBar({
  onOpen,
}: {
  onOpen: () => void;
}) {
  return (
    <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-bg border-b border-line flex items-center justify-between px-5 z-50">
      <Logo />
      <button
        onClick={onOpen}
        aria-label="Open navigation menu"
        className="flex flex-col gap-[5px] p-2 -mr-2 focus-visible:outline-pink"
      >
        <span className="block w-5 h-[1.5px] bg-ink" />
        <span className="block w-5 h-[1.5px] bg-ink" />
        <span className="block w-3.5 h-[1.5px] bg-ink" />
      </button>
    </div>
  );
}

/* ── Mobile full-screen menu ──────────────────────────────── */
function MobileMenu({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  const isActive = (href: string) => {
    if (href === "/#work") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div
      className={`md:hidden fixed inset-0 bg-bg z-50 flex flex-col transition-opacity duration-200 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      {/* Top bar in menu */}
      <div className="flex items-center justify-between px-5 h-14 border-b border-line">
        <Logo />
        <button
          onClick={onClose}
          aria-label="Close navigation menu"
          className="p-2 -mr-2 text-ink-soft hover:text-ink transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Menu body */}
      <nav className="flex-1 overflow-y-auto px-5 py-8" aria-label="Mobile primary">
        <ul className="space-y-2 mb-10" role="list">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onClose}
                className={`block font-mono font-bold text-2xl tracking-[0.08em] uppercase transition-colors ${
                  isActive(link.href) ? "text-pink" : "text-ink hover:text-pink"
                }`}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <span className="status-badge mb-10 block">OPEN FOR WORK</span>

        <div className="mb-6">
          <p className="mono-label text-ink-soft mb-3">Contact</p>
          <a href="mailto:finbar@finbar.studio" className="block text-sm font-mono text-ink-soft hover:text-pink transition-colors mb-1">
            finbar@finbar.studio
          </a>
          <a href="tel:+61412796630" className="block text-sm font-mono text-ink-soft hover:text-pink transition-colors">
            +61 412 796 630
          </a>
        </div>

        <div className="mb-10">
          <p className="mono-label text-ink-soft mb-3">Follow</p>
          <div className="flex gap-4 flex-wrap">
            {socials.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-mono text-ink-soft hover:text-pink transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <p className="mono-label text-ink-soft">Brisbane, Australia · 2026©</p>
      </nav>
    </div>
  );
}

/* ── Root sidebar component ───────────────────────────────── */
export default function Sidebar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <DesktopSidebar pathname={pathname} />
      <MobileTopBar onOpen={() => setMenuOpen(true)} />
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        pathname={pathname}
      />
    </>
  );
}
