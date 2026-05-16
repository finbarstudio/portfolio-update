"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { SiX, SiInstagram } from "@icons-pack/react-simple-icons";
import { SIDEBAR_EXPANDED_W, SIDEBAR_COLLAPSED_W } from "./LayoutShell";

/* ── Brand icons ──────────────────────────────────────────────── */
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

/* ── Nav icons (used in collapsed mode) ───────────────────────── */
function GridIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.5" y="1.5" width="5" height="5" rx="0.75" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="9.5" y="1.5" width="5" height="5" rx="0.75" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="1.5" y="9.5" width="5" height="5" rx="0.75" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="9.5" y="9.5" width="5" height="5" rx="0.75" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M2.5 14c0-3.038 2.462-5.5 5.5-5.5s5.5 2.462 5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function EnvelopeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.5" y="3.5" width="13" height="9" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M1.5 5.5l6.5 4 6.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── Data ─────────────────────────────────────────────────────── */
const navLinks = [
  { label: "WORK",    href: "/#work",    icon: <GridIcon /> },
  { label: "ABOUT",   href: "/about",    icon: <PersonIcon /> },
  { label: "CONTACT", href: "/contact",  icon: <EnvelopeIcon /> },
];

const socials = [
  { label: "Are.na",    href: "https://are.na/finbar-studio",          icon: <ArenaIcon size={13} /> },
  { label: "X",         href: "https://x.com/finbarstudio",            icon: <SiX size={12} aria-hidden="true" /> },
  { label: "LinkedIn",  href: "https://linkedin.com/in/finbarskitini", icon: <LinkedInIcon size={13} /> },
  { label: "Instagram", href: "https://instagram.com/finbar.studio",   icon: <SiInstagram size={13} aria-hidden="true" /> },
];

/* ── Shared glass style ───────────────────────────────────────── */
const glass = {
  background: "rgba(250, 250, 248, 0.82)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
} as React.CSSProperties;

/* ── Logo ─────────────────────────────────────────────────────── */
function Logo() {
  return (
    <Link
      href="/"
      className="block font-sans font-bold text-[11px] tracking-[0.14em] uppercase text-ink hover:text-pink transition-colors"
      aria-label="finbar✶studio — back to home"
    >
      finbar<span className="text-pink" aria-hidden="true">✶</span>studio
    </Link>
  );
}

/* ── World clocks ─────────────────────────────────────────────── */
const CLOCKS = [
  { code: "BNE", label: "BRISBANE", tz: "Australia/Brisbane" },
  { code: "LON", label: "LONDON",   tz: "Europe/London"      },
];

function WorldClocks() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const fmtTime = (tz: string) =>
    now
      ? new Intl.DateTimeFormat("en", {
          timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
        }).format(now)
      : "--:--:--";

  const fmtOffset = (tz: string) => {
    if (!now) return "";
    const s = new Intl.DateTimeFormat("en", { timeZone: tz, timeZoneName: "shortOffset" })
      .formatToParts(now)
      .find((p) => p.type === "timeZoneName")?.value ?? "";
    return s.replace("GMT", "UTC");
  };

  return (
    <div
      className="mx-6 mb-5 border border-line"
      style={{ padding: "10px 12px 10px" }}
    >
      {/* Column headers */}
      <div className="flex justify-between mb-2">
        {CLOCKS.map((c) => (
          <p
            key={c.code}
            className="font-sans font-bold uppercase text-ink-soft"
            style={{ fontSize: "8px", letterSpacing: "0.14em" }}
          >
            {c.code}
          </p>
        ))}
      </div>

      {/* Times */}
      <div className="flex justify-between items-baseline">
        {CLOCKS.map((c) => (
          <p
            key={c.code}
            className="font-sans font-bold text-ink tabular-nums"
            style={{ fontSize: "15px", letterSpacing: "0.03em", fontVariantNumeric: "tabular-nums" }}
          >
            {fmtTime(c.tz)}
          </p>
        ))}
      </div>

      {/* City + offset */}
      <div className="flex justify-between mt-1">
        {CLOCKS.map((c) => (
          <p
            key={c.code}
            className="font-sans uppercase text-ink-soft"
            style={{ fontSize: "8px", letterSpacing: "0.08em" }}
          >
            {c.label}
            <span className="text-pink" style={{ marginLeft: "3px" }}>
              {fmtOffset(c.tz)}
            </span>
          </p>
        ))}
      </div>
    </div>
  );
}

/* ── Desktop sidebar ──────────────────────────────────────────── */
function DesktopSidebar({
  pathname,
  collapsed,
  onToggle,
}: {
  pathname: string;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const isActive = (href: string) => {
    if (href === "/#work") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className="hidden md:flex fixed left-0 top-0 h-screen border-r border-line flex-col z-40 overflow-hidden"
      style={{
        width: collapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_EXPANDED_W,
        transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
        ...glass,
      }}
      aria-label="Site navigation"
    >
      {collapsed ? (
        /* ── COLLAPSED: icon tabs ─────────────────────────────── */
        <div className="flex flex-col items-center h-full py-4">
          {/* Toggle — expand */}
          <button
            onClick={onToggle}
            title="Expand sidebar"
            aria-label="Expand sidebar"
            className="mb-4 text-ink-soft hover:text-pink transition-colors p-1"
          >
            <ChevronRightIcon />
          </button>

          {/* Logo mark */}
          <Link
            href="/"
            aria-label="Home"
            className="mb-5 text-pink font-bold text-sm hover:opacity-70 transition-opacity"
          >
            ✶
          </Link>

          {/* Divider */}
          <div className="w-5 h-px bg-line mb-4" />

          {/* Nav icons */}
          <nav aria-label="Primary" className="flex flex-col items-center gap-1 w-full">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                title={link.label}
                aria-label={link.label}
                aria-current={isActive(link.href) ? "page" : undefined}
                className="flex items-center justify-center w-full py-2.5 transition-colors"
                style={{ color: isActive(link.href) ? "var(--pink)" : "var(--ink-soft)" }}
              >
                {link.icon}
              </Link>
            ))}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Social icons stacked */}
          <div className="flex flex-col items-center gap-3 mb-4">
            {socials.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                title={s.label}
                className="text-ink-soft hover:text-pink transition-colors"
              >
                {s.icon}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p
            className="font-sans font-bold uppercase text-ink-soft"
            style={{ fontSize: "7px", letterSpacing: "0.06em", lineHeight: 1.4 }}
          >
            26©
          </p>
        </div>
      ) : (
        /* ── EXPANDED: full sidebar ───────────────────────────── */
        <>
          {/* Logo + collapse toggle */}
          <div className="flex items-center justify-between px-6 pt-7 pb-6">
            <Logo />
            <button
              onClick={onToggle}
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
              className="text-ink-soft hover:text-pink transition-colors p-1 -mr-1 flex-shrink-0"
            >
              <ChevronLeftIcon />
            </button>
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

          {/* Contact — no heading */}
          <div className="px-6 pb-3">
            <a
              href="mailto:finbar@finbar.studio"
              className="block font-sans text-ink-soft hover:text-pink transition-colors mb-1"
              style={{ fontSize: "13px" }}
            >
              finbar@finbar.studio
            </a>
            <a
              href="tel:+61412796630"
              className="block font-sans text-ink-soft hover:text-pink transition-colors"
              style={{ fontSize: "13px" }}
            >
              +61 412 796 630
            </a>
          </div>

          {/* Open for work */}
          <div className="px-6 pb-6">
            <span className="status-badge">OPEN FOR WORK</span>
          </div>

          {/* World clocks + icons + copyright — bottom */}
          <div className="mt-auto pb-4">
            <WorldClocks />
            <div className="flex items-center justify-between px-6">
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
        </>
      )}
    </aside>
  );
}

/* ── Mobile top bar ───────────────────────────────────────────── */
function MobileTopBar({ onOpen }: { onOpen: () => void }) {
  return (
    <div
      className="md:hidden fixed top-0 left-0 right-0 h-14 flex items-center justify-between px-5 z-50"
      style={glass}
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
      <div className="flex items-center justify-between px-5 h-14">
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

      <nav className="flex-1 overflow-y-auto px-5 flex flex-col py-6" aria-label="Mobile primary">
        <ul className="space-y-1 mb-auto" role="list">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onClose}
                className={`block font-sans font-bold uppercase transition-colors leading-none py-2 ${
                  isActive(link.href) ? "text-pink" : "text-ink hover:text-pink"
                }`}
                style={{ fontSize: "clamp(2.5rem, 12vw, 3.5rem)", letterSpacing: "-0.01em" }}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="pt-10">
          <div className="mb-4">
            <span className="status-badge">OPEN FOR WORK</span>
          </div>
          <a href="mailto:finbar@finbar.studio" className="block mono-label text-ink-soft hover:text-pink transition-colors mb-1">
            finbar@finbar.studio
          </a>
          <a href="tel:+61412796630" className="block mono-label text-ink-soft hover:text-pink transition-colors mb-6">
            +61 412 796 630
          </a>
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
          <p className="mono-label text-ink-soft mt-6" style={{ fontSize: "9px" }}>2026©</p>
        </div>
      </nav>
    </div>
  );
}

/* ── Root ─────────────────────────────────────────────────────── */
export default function Sidebar({
  collapsed = false,
  onToggle,
}: {
  collapsed?: boolean;
  onToggle?: () => void;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <>
      <DesktopSidebar pathname={pathname} collapsed={collapsed} onToggle={onToggle ?? (() => {})} />
      <MobileTopBar onOpen={() => setMenuOpen(true)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} pathname={pathname} />
    </>
  );
}
