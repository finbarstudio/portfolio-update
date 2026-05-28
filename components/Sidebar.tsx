"use client";

// Navigator sidebar, folder-tree navigation with expandable work folder
// listing all 14 projects as files. Below the tree: dual world clocks,
// open-for-work status, contact email, social icons.

import React, { useEffect, useMemo, useState } from "react";
// Note: useEffect/useState still used by DesktopSidebar (workOpen) and MobileMenu (body overflow)
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiX, SiInstagram } from "@icons-pack/react-simple-icons";
import { projects } from "@/content/projects";
import { SIDEBAR_EXPANDED_W, SIDEBAR_COLLAPSED_W } from "./LayoutShell";
// MobileTopBar removed, hamburger lives in MenuBar; this file exports MobileMenu only.

/* ── Brand icons ──────────────────────────────────────────────── */
function ArenaIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 150 90" fill="currentColor" aria-hidden="true">
      <path d="M148.93 62.356l-20.847-16.384c-1.276-1-1.276-2.642 0-3.645l20.848-16.38c1.28-1.002 1.815-2.695 1.19-3.76-.626-1.062-2.374-1.44-3.88-.84l-24.79 9.874c-1.507.606-2.927-.22-3.153-1.83L114.57 2.926C114.34 1.317 113.13 0 111.877 0c-1.247 0-2.456 1.317-2.68 2.925l-3.73 26.467c-.228 1.61-1.646 2.434-3.155 1.83l-24.38-9.71c-1.512-.602-3.975-.602-5.483 0l-24.384 9.71c-1.508.604-2.928-.22-3.154-1.83L41.186 2.925C40.956 1.317 39.748 0 38.5 0c-1.252 0-2.463 1.317-2.688 2.925l-3.73 26.467c-.226 1.61-1.645 2.434-3.153 1.83L4.14 21.35c-1.507-.603-3.252-.223-3.878.838-.625 1.066-.092 2.76 1.184 3.76l20.85 16.38c1.277 1.003 1.277 2.645 0 3.646L1.446 62.356C.166 63.358-.364 65.152.26 66.34c.627 1.19 2.372 1.668 3.877 1.064l24.567-9.866c1.51-.603 2.914.218 3.125 1.828l3.544 26.696c.214 1.607 1.618 2.923 3.12 2.923 1.5 0 2.905-1.315 3.12-2.923l3.55-26.696c.21-1.61 1.62-2.43 3.122-1.828l24.164 9.698c1.506.606 3.97.606 5.477 0l24.16-9.698c1.504-.603 2.91.218 3.125 1.828l3.55 26.696c.212 1.607 1.617 2.923 3.115 2.923 1.502 0 2.907-1.315 3.12-2.923l3.55-26.696c.216-1.61 1.62-2.43 3.124-1.828l24.57 9.866c1.5.604 3.25.125 3.876-1.063.627-1.186.094-2.98-1.185-3.982zM95.89 46.18L77.53 60.315c-1.285.99-3.393.99-4.674 0L54.49 46.18c-1.284-.99-1.294-2.62-.02-3.625l18.4-14.493c1.274-1.005 3.363-1.005 4.638 0l18.4 14.493c1.277 1.004 1.267 2.634-.02 3.626z" />
    </svg>
  );
}

function LinkedInIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/* ── Toggle chevrons (sidebar collapse) ───────────────────────── */
function ChevronLeftIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function ChevronRightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── Collapsed-mode glyphs ────────────────────────────────────── */
function HomeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 7.5L8 2l6 5.5V14a.5.5 0 01-.5.5H10V10H6v4.5H2.5A.5.5 0 012 14V7.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}
function GridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.5" y="1.5" width="5" height="5" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="9.5" y="1.5" width="5" height="5" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="1.5" y="9.5" width="5" height="5" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="9.5" y="9.5" width="5" height="5" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}
function PersonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M2.5 14c0-3.038 2.462-5.5 5.5-5.5s5.5 2.462 5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function EnvelopeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.5" y="3.5" width="13" height="9" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M1.5 5.5l6.5 4 6.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const socials = [
  { label: "Are.na",    href: "https://are.na/finbar-studio",          icon: <ArenaIcon /> },
  { label: "X",         href: "https://x.com/finbarstudio",            icon: <SiX size={11} aria-hidden="true" /> },
  { label: "LinkedIn",  href: "https://linkedin.com/in/finbarskitini", icon: <LinkedInIcon /> },
  { label: "Instagram", href: "https://instagram.com/finbar.studio",   icon: <SiInstagram size={12} aria-hidden="true" /> },
];


/* ── Tree-line guide column ───────────────────────────────────── */
function TreeGuide({ last = false, vertical = true }: { last?: boolean; vertical?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="text-ink-soft font-mono select-none"
      style={{ fontSize: "10px", width: "10px", textAlign: "center", flexShrink: 0, opacity: 0.5 }}
    >
      {vertical ? (last ? "└" : "├") : " "}
    </span>
  );
}

/* ── Desktop sidebar, Finder ─────────────────────────────────── */
function DesktopSidebar({
  pathname,
  collapsed,
  onToggle,
}: {
  pathname: string;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const [workOpen, setWorkOpen] = useState(true);

  // Open work folder on initial load if user is viewing a work page
  useEffect(() => {
    if (pathname.startsWith("/work/")) setWorkOpen(true);
  }, [pathname]);

  const sortedProjects = useMemo(
    () => [...projects].sort((a, b) => a.rank - b.rank),
    []
  );

  const isHome    = pathname === "/";
  const isAbout   = pathname.startsWith("/about");
  const isContact = pathname.startsWith("/contact");
  const isWorkActive = isHome || pathname.startsWith("/work/");

  return (
    <aside
      className="hidden md:flex fixed left-0 border-r border-ink flex-col z-40 bg-bg"
      style={{
        top: "var(--menubar-h)",
        bottom: 0,
        width: collapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_EXPANDED_W,
        transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
        overflow: "hidden",
      }}
      aria-label="Site navigation"
    >
      {collapsed ? (
        /* ── COLLAPSED ─────────────────────────────────────────── */
        <div className="flex flex-col items-center py-3 h-full">
          <button
            onClick={onToggle}
            title="Expand sidebar"
            aria-label="Expand sidebar"
            className="os-titlebar-btn flex items-center justify-center mb-3"
          >
            <ChevronRightIcon />
          </button>

          <Link
            href="/"
            aria-label="Home"
            className={`mb-3 transition-colors ${isHome ? "text-pink" : "text-ink-soft hover:text-pink"}`}
          >
            <HomeIcon />
          </Link>

          <div className="w-5 h-px bg-line mb-2" />

          <nav aria-label="Primary" className="flex flex-col items-center gap-1 w-full">
            {[
              { href: "/",        label: "WORK",    icon: <GridIcon />,     active: isWorkActive },
              { href: "/about",   label: "ABOUT",   icon: <PersonIcon />,   active: isAbout },
              { href: "/contact", label: "CONTACT", icon: <EnvelopeIcon />, active: isContact },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                title={l.label}
                aria-label={l.label}
                aria-current={l.active ? "page" : undefined}
                className={`flex items-center justify-center w-full py-2 transition-colors ${
                  l.active ? "text-pink" : "text-ink-soft hover:text-pink"
                }`}
              >
                {l.icon}
              </Link>
            ))}
          </nav>

          <div className="flex-1" />

          <div className="flex flex-col items-center gap-3 mb-3">
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
        </div>
      ) : (
        /* ── EXPANDED ──────────────────────────────────────────── */
        <>
          {/* Tree */}
          <div className="flex-1 overflow-y-auto py-2">
            {/* Root, links home, collapse button inline on right */}
            <div className="tree-item tree-item-root">
              <Link
                href="/"
                className="flex items-center gap-1 flex-1 min-w-0"
                aria-label="Home"
              >
                <span className="tree-caret">▾</span>
                <span className="icon-folder" style={{ color: "var(--pink)" }} />
                <span>finbar.studio/</span>
              </Link>
              <button
                onClick={onToggle}
                aria-label="Collapse sidebar"
                title="Collapse sidebar"
                className="os-titlebar-btn flex items-center justify-center ml-auto shrink-0"
              >
                <ChevronLeftIcon />
              </button>
            </div>

            {/* work/ folder, expandable */}
            <button
              type="button"
              onClick={() => setWorkOpen((v) => !v)}
              className={`tree-item w-full text-left ${isWorkActive ? "active" : ""}`}
              aria-expanded={workOpen}
              style={{ paddingLeft: "16px" }}
            >
              <TreeGuide last={false} />
              <span className="tree-caret">{workOpen ? "▾" : "▸"}</span>
              <span className="icon-folder" />
              <span className="flex-1">work/</span>
              <span className="text-ink-soft" style={{ fontSize: "9px" }}>
                {sortedProjects.length}
              </span>
            </button>

            {/* Project files */}
            {workOpen && (
              <div className="overflow-hidden" style={{ animation: "tree-expand 0.22s ease-out both" }}>
                {sortedProjects.map((p, idx) => {
                  const isLast   = idx === sortedProjects.length - 1;
                  const isActive = pathname === `/work/${p.slug}`;
                  const isGallery = p.tier === "gallery";

                  return (
                    <Link
                      key={p.slug}
                      href={`/work/${p.slug}`}
                      className={`tree-item ${isActive ? "active" : ""}`}
                      style={{ paddingLeft: "32px" }}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <TreeGuide last={isLast} />
                      <span className="icon-file" />
                      <span className="truncate flex-1">{p.name.toLowerCase()}</span>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* about.md */}
            <Link
              href="/about"
              className={`tree-item ${isAbout ? "active" : ""}`}
              style={{ paddingLeft: "16px" }}
              aria-current={isAbout ? "page" : undefined}
            >
              <TreeGuide last={false} />
              <span className="icon-file" />
              <span>about</span>
            </Link>

            {/* contact.md */}
            <Link
              href="/contact"
              className={`tree-item ${isContact ? "active" : ""}`}
              style={{ paddingLeft: "16px" }}
              aria-current={isContact ? "page" : undefined}
            >
              <TreeGuide last={true} />
              <span className="icon-file" />
              <span>contact</span>
            </Link>
          </div>

          {/* Status / contact / socials */}
          <div className="px-3 pb-3 space-y-2 border-t border-ink pt-3">
            <span className="status-badge">OPEN FOR WORK</span>

            <a
              href="mailto:finbar@finbar.studio"
              className="block font-sans text-ink hover:text-pink transition-colors"
              style={{ fontSize: "12px", letterSpacing: "0.02em" }}
            >
              finbar@finbar.studio
            </a>

            <a
              href="tel:+61412796630"
              className="block font-sans text-ink-soft hover:text-pink transition-colors tabular-nums"
              style={{ fontSize: "11px", letterSpacing: "0.02em" }}
            >
              +61 412 796 630
            </a>

            <div className="flex items-center justify-between pt-1">
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
              <p
                className="font-bold uppercase text-ink-soft"
                style={{ fontSize: "9px", letterSpacing: "0.08em" }}
              >
                v1.0.26
              </p>
            </div>
          </div>
        </>
      )}
    </aside>
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
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const navLinks = [
    { label: "Work",    href: "/" },
    { label: "About",   href: "/about" },
    { label: "Contact", href: "/contact" },
  ];
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div
      className={`md:hidden fixed inset-0 z-[60] flex flex-col bg-bg transition-opacity duration-150 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      {/* Header mirrors MenuBar — brand left, close (X) right */}
      <div
        className="flex items-center justify-between px-3 border-b border-ink"
        style={{ height: "var(--menubar-h)" }}
      >
        <span
          className="font-bold uppercase tracking-[0.08em] text-[12px]"
          aria-hidden="true"
        >
          finbar<span className="pixel-star text-[14px]">✶</span>studio
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation menu"
          className="flex items-center justify-center text-ink hover:text-pink transition-colors -mr-2.5"
          style={{ width: 44, height: 44 }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-5 pt-8 pb-8 flex flex-col" aria-label="Mobile primary">
        <ul className="space-y-0 mb-auto divide-y divide-line" role="list">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onClose}
                className={`flex items-center justify-between font-sans font-semibold py-4 transition-colors ${
                  isActive(link.href) ? "text-pink" : "text-ink hover:text-pink"
                }`}
                style={{ fontSize: "1.75rem", letterSpacing: "-0.01em", lineHeight: 1.1 }}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                <span>{link.label}</span>
                <span className="mono-label text-ink-soft" aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="pt-10 border-t border-line mt-10">
          <div className="mb-4">
            <span className="status-badge">OPEN FOR WORK</span>
          </div>
          <a
            href="mailto:finbar@finbar.studio"
            className="block font-sans text-ink hover:text-pink transition-colors mb-1"
            style={{ fontSize: "14px" }}
          >
            finbar@finbar.studio
          </a>
          <a
            href="tel:+61412796630"
            className="block font-sans text-ink-soft hover:text-pink transition-colors mb-6 tabular-nums"
            style={{ fontSize: "13px" }}
          >
            +61 412 796 630
          </a>
          <div className="flex items-center gap-6">
            {socials.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="text-ink-soft hover:text-pink transition-colors"
              >
                {React.cloneElement(s.icon as React.ReactElement, { size: 20 } as Record<string, unknown>)}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}

/* ── Root ─────────────────────────────────────────────────────── */
export default function Sidebar({
  collapsed = false,
  onToggle,
  mobileMenuOpen = false,
  onMobileMenuClose,
}: {
  collapsed?: boolean;
  onToggle?: () => void;
  mobileMenuOpen?: boolean;
  onMobileMenuClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <DesktopSidebar
        pathname={pathname}
        collapsed={collapsed}
        onToggle={onToggle ?? (() => {})}
      />
      <MobileMenu
        open={mobileMenuOpen}
        onClose={onMobileMenuClose ?? (() => {})}
        pathname={pathname}
      />
    </>
  );
}
