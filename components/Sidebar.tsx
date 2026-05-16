"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { SiX, SiInstagram } from "@icons-pack/react-simple-icons";

// WebGL needs browser APIs — no SSR
const JarvisGlobe = dynamic(() => import("./JarvisGlobe"), { ssr: false });

/* ── Icons ────────────────────────────────────────────────────── */
function ArenaIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 150 90" fill="currentColor" aria-hidden="true">
      <path d="M148.93 62.356l-20.847-16.384c-1.276-1-1.276-2.642 0-3.645l20.848-16.38c1.28-1.002 1.815-2.695 1.19-3.76-.626-1.062-2.374-1.44-3.88-.84l-24.79 9.874c-1.507.606-2.927-.22-3.153-1.83L114.57 2.926C114.34 1.317 113.13 0 111.877 0c-1.247 0-2.456 1.317-2.68 2.925l-3.73 26.467c-.228 1.61-1.646 2.434-3.155 1.83l-24.38-9.71c-1.512-.602-3.975-.602-5.483 0l-24.384 9.71c-1.508.604-2.928-.22-3.154-1.83L41.186 2.925C40.956 1.317 39.748 0 38.5 0c-1.252 0-2.463 1.317-2.688 2.925l-3.73 26.467c-.226 1.61-1.645 2.434-3.153 1.83L4.14 21.35c-1.507-.603-3.252-.223-3.878.838-.625 1.066-.092 2.76 1.184 3.76l20.85 16.38c1.277 1.003 1.277 2.645 0 3.646L1.446 62.356C.166 63.358-.364 65.152.26 66.34c.627 1.19 2.372 1.668 3.877 1.064l24.567-9.866c1.51-.603 2.914.218 3.125 1.828l3.544 26.696c.214 1.607 1.618 2.923 3.12 2.923 1.5 0 2.905-1.315 3.12-2.923l3.55-26.696c.21-1.61 1.62-2.43 3.122-1.828l24.164 9.698c1.506.606 3.97.606 5.477 0l24.16-9.698c1.504-.603 2.91.218 3.125 1.828l3.55 26.696c.212 1.607 1.617 2.923 3.115 2.923 1.502 0 2.907-1.315 3.12-2.923l3.55-26.696c.216-1.61 1.62-2.43 3.124-1.828l24.57 9.866c1.5.604 3.25.125 3.876-1.063.627-1.186.094-2.98-1.185-3.982zM95.89 46.18L77.53 60.315c-1.285.99-3.393.99-4.674 0L54.49 46.18c-1.284-.99-1.294-2.62-.02-3.625l18.4-14.493c1.274-1.005 3.363-1.005 4.638 0l18.4 14.493c1.277 1.004 1.267 2.634-.02 3.626z" />
    </svg>
  );
}

function LinkedInIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const navLinks = [
  { label: "WORK", href: "/#work" },
  { label: "ABOUT", href: "/about" },
  { label: "CONTACT", href: "/contact" },
];

const socials = [
  { label: "Are.na",    href: "https://are.na/finbar-studio",          icon: <ArenaIcon size={13} /> },
  { label: "X",         href: "https://x.com/finbarstudio",            icon: <SiX size={12} aria-hidden="true" /> },
  { label: "LinkedIn",  href: "https://linkedin.com/in/finbarskitini", icon: <LinkedInIcon size={13} /> },
  { label: "Instagram", href: "https://instagram.com/finbar.studio",   icon: <SiInstagram size={13} aria-hidden="true" /> },
];

function Logo() {
  return (
    <Link
      href="/"
      className="block font-mono font-bold text-[11px] tracking-[0.14em] uppercase text-ink hover:text-pink transition-colors"
      aria-label="finbar✶studio — back to home"
    >
      finbar<span className="text-pink" aria-hidden="true">✶</span>studio
    </Link>
  );
}

/* ── Desktop sidebar ──────────────────────────────────────────── */
function DesktopSidebar({ pathname }: { pathname: string }) {
  const isActive = (href: string) => {
    if (href === "/#work") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className="hidden md:flex fixed left-0 top-0 h-screen w-56 border-r border-line flex-col z-40 overflow-y-auto"
      style={{
        background: "rgba(250, 250, 248, 0.82)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
      aria-label="Site navigation"
    >
      {/* Logo */}
      <div className="px-6 pt-7 pb-6">
        <Logo />
      </div>

      {/* Nav links */}
      <nav className="px-6 pb-5" aria-label="Primary">
        <ul className="space-y-0.5" role="list">
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
      </nav>

      {/* Contact details — no section heading */}
      <div className="px-6 pb-3">
        <a
          href="mailto:finbar@finbar.studio"
          className="block text-[10px] font-mono text-ink-soft hover:text-pink transition-colors mb-1"
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

      {/* Open for work — directly below contact */}
      <div className="px-6 pb-6">
        <span className="status-badge">OPEN FOR WORK</span>
      </div>

      {/* Globe + icons + copyright — bottom */}
      <div className="px-3 pb-4 mt-auto">
        <div style={{ width: "100%", height: "178px", overflow: "hidden" }}>
          <JarvisGlobe />
        </div>
        <div className="flex items-center justify-between mt-3 px-1">
          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="text-ink-soft hover:text-pink transition-colors"
              >
                {s.icon}
              </a>
            ))}
          </div>
          <p className="mono-label text-ink-soft" style={{ fontSize: "9px" }}>2026©</p>
        </div>
      </div>
    </aside>
  );
}

/* ── Mobile top bar ───────────────────────────────────────────── */
function MobileTopBar({ onOpen }: { onOpen: () => void }) {
  return (
    <div
      className="md:hidden fixed top-0 left-0 right-0 h-14 border-b border-line flex items-center justify-between px-5 z-50"
      style={{
        background: "rgba(250, 250, 248, 0.88)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <Logo />
      <button
        onClick={onOpen}
        aria-label="Open navigation menu"
        className="flex flex-col gap-[5px] p-2 -mr-2"
      >
        <span className="block w-5 h-[1.5px] bg-ink" />
        <span className="block w-5 h-[1.5px] bg-ink" />
        <span className="block w-3.5 h-[1.5px] bg-ink" />
      </button>
    </div>
  );
}

/* ── Mobile full-screen menu ──────────────────────────────────── */
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

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div
      className={`md:hidden fixed inset-0 z-50 flex flex-col transition-opacity duration-200 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      style={{ background: "rgba(250, 250, 248, 0.96)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      <div className="flex items-center justify-between px-5 h-14 border-b border-line">
        <Logo />
        <button
          onClick={onClose}
          aria-label="Close navigation menu"
          className="p-2 -mr-2 text-ink-soft hover:text-pink transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-5 py-8" aria-label="Mobile primary">
        <ul className="space-y-2 mb-8" role="list">
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

        {/* Contact — no heading */}
        <div className="mb-5">
          <a href="mailto:finbar@finbar.studio" className="block text-sm font-mono text-ink-soft hover:text-pink transition-colors mb-1">
            finbar@finbar.studio
          </a>
          <a href="tel:+61412796630" className="block text-sm font-mono text-ink-soft hover:text-pink transition-colors">
            +61 412 796 630
          </a>
        </div>

        {/* Open for work */}
        <div className="mb-8">
          <span className="status-badge">OPEN FOR WORK</span>
        </div>

        {/* Social icons — no heading */}
        <div className="flex items-center gap-5 mb-8">
          {socials.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="text-ink-soft hover:text-pink transition-colors"
            >
              {React.cloneElement(s.icon as React.ReactElement, { size: 18 } as Record<string, unknown>)}
            </a>
          ))}
        </div>

        <p className="mono-label text-ink-soft" style={{ fontSize: "9px" }}>2026©</p>
      </nav>
    </div>
  );
}

/* ── Root ─────────────────────────────────────────────────────── */
export default function Sidebar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <>
      <DesktopSidebar pathname={pathname} />
      <MobileTopBar onOpen={() => setMenuOpen(true)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} pathname={pathname} />
    </>
  );
}
