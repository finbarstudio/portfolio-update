"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import { SiX, SiInstagram } from "@icons-pack/react-simple-icons";

// Three.js needs browser APIs — no SSR
const JarvisGlobe = dynamic(() => import("./JarvisGlobe"), { ssr: false });

// LinkedIn icon — not available in Simple Icons (removed by LinkedIn)
function LinkedInIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
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
  {
    label: "Are.na",
    href: "https://are.na/finbar-studio",
    icon: <Globe size={14} aria-hidden="true" />,
  },
  {
    label: "X",
    href: "https://x.com/finbarstudio",
    icon: <SiX size={13} aria-hidden="true" />,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/finbarskitini",
    icon: <LinkedInIcon size={14} />,
  },
  {
    label: "Instagram",
    href: "https://instagram.com/finbar.studio",
    icon: <SiInstagram size={14} aria-hidden="true" />,
  },
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
      className="hidden md:flex fixed left-0 top-0 h-screen w-56 border-r border-line flex-col z-40 overflow-y-auto"
      style={{
        background: "rgba(250, 250, 248, 0.82)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
      aria-label="Site navigation"
    >
      {/* Logo */}
      <div className="px-6 pt-8 pb-7">
        <Logo />
      </div>

      {/* Primary nav */}
      <nav className="px-6 pb-6" aria-label="Primary">
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
        <div className="mt-5">
          <span className="status-badge">OPEN FOR WORK</span>
        </div>
      </nav>

      {/* Contact */}
      <div className="px-6 pb-6">
        <p className="mono-label text-ink-soft mb-3">Contact</p>
        <a
          href="mailto:finbar@finbar.studio"
          className="block text-[10px] font-mono text-ink-soft hover:text-pink transition-colors mb-1.5 link-wipe"
        >
          finbar@finbar.studio
        </a>
        <a
          href="tel:+61412796630"
          className="block text-[10px] font-mono text-ink-soft hover:text-pink transition-colors link-wipe"
        >
          +61 412 796 630
        </a>
      </div>

      {/* Socials — icon row */}
      <div className="px-6 pb-6">
        <p className="mono-label text-ink-soft mb-3">Follow</p>
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
      </div>

      {/* Globe — replaces the Brisbane text footer */}
      <div className="px-3 pb-3 mt-auto">
        <div style={{ width: "100%", height: "190px", borderRadius: "8px", overflow: "hidden" }}>
          <JarvisGlobe />
        </div>
        <p className="mono-label text-ink-soft mt-3 px-3">2026©</p>
      </div>
    </aside>
  );
}

/* ── Mobile top bar ───────────────────────────────────────── */
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
          className="p-2 -mr-2 text-ink-soft hover:text-ink transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

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

        <div className="mb-8">
          <p className="mono-label text-ink-soft mb-3">Contact</p>
          <a href="mailto:finbar@finbar.studio" className="block text-sm font-mono text-ink-soft hover:text-pink transition-colors mb-1.5 link-wipe">
            finbar@finbar.studio
          </a>
          <a href="tel:+61412796630" className="block text-sm font-mono text-ink-soft hover:text-pink transition-colors link-wipe">
            +61 412 796 630
          </a>
        </div>

        <div className="mb-10">
          <p className="mono-label text-ink-soft mb-3">Follow</p>
          <div className="flex items-center gap-5">
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
        </div>

        <p className="mono-label text-ink-soft">2026©</p>
      </nav>
    </div>
  );
}

/* ── Root sidebar component ───────────────────────────────── */
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
