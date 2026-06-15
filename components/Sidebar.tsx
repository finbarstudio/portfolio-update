"use client";

// Navigator sidebar, folder-tree navigation with expandable work folder
// listing all 14 projects as files. Below the tree: dual world clocks,
// open-for-work status, contact email, social icons.

import React, { useEffect, useMemo, useState } from "react";
// Note: useEffect/useState still used by MobileMenu (body overflow lock)
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiX, SiInstagram } from "@icons-pack/react-simple-icons";
import { projects } from "@/content/projects";
import { SIDEBAR_EXPANDED_W, SIDEBAR_COLLAPSED_W } from "./LayoutShell";
import BrandStar from "./BrandStar";
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
      <rect x="1.5" y="1.5" width="5" height="5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9.5" y="1.5" width="5" height="5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="1.5" y="9.5" width="5" height="5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9.5" y="9.5" width="5" height="5" stroke="currentColor" strokeWidth="1.5" />
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

/* ── Live copyright year ──────────────────────────────────────────
   Tiny "© 26" centred at the bottom of the rail when collapsed; full
   "© 2026 finbar studio" left-aligned when open. Year is set on the client
   and re-checked hourly so it survives page sessions across new years. */
function YearStamp({ collapsed }: { collapsed: boolean }) {
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => {
    setYear(new Date().getFullYear());
    const id = setInterval(() => setYear(new Date().getFullYear()), 60 * 60 * 1000);
    return () => clearInterval(id);
  }, []);
  if (year === null) return null;
  const text = collapsed ? `© ${String(year).slice(-2)}` : `© ${year} finbar studio`;
  return (
    <div
      className="hidden md:block"
      aria-label={`Copyright ${year} finbar studio`}
      style={{
        position: "fixed",
        left: collapsed ? 0 : 12,
        bottom: 8,
        width: collapsed ? SIDEBAR_COLLAPSED_W : "auto",
        textAlign: collapsed ? "center" : "left",
        fontFamily: "var(--font-label)",
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "var(--ink-soft)",
        pointerEvents: "none",
        zIndex: 40,
        transition: "left 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {text}
    </div>
  );
}

/* ── Persistent social dock ───────────────────────────────────────
   One set of social icons, always mounted, positioned absolutely. Each icon
   tweens (transform) between its collapsed slot (a vertical column centred in
   the rail) and its expanded slot (a horizontal row in the footer). A small
   per-icon stagger + soft overshoot make them visibly tumble into place rather
   than disappear/reappear when the sidebar toggles. */
function SocialDock({ collapsed }: { collapsed: boolean }) {
  const BOX = 24;   // icon tap box
  const GAP = collapsed ? 40 : 38;   // centre-to-centre spacing (roomier)
  const railCenterX = SIDEBAR_COLLAPSED_W / 2;

  return (
    <div
      className="hidden md:block"
      style={{
        position: "fixed",
        left: 0,
        bottom: 0,
        width: SIDEBAR_EXPANDED_W,
        height: 188,
        pointerEvents: "none",
        zIndex: 41,
      }}
    >
      {socials.map((s, i) => {
        // x/y are offsets from the dock's bottom-left corner. Lifted well clear
        // of the year stamp so the cluster has room to breathe.
        const x = collapsed ? railCenterX - BOX / 2 : 14 + i * GAP;
        const y = collapsed ? 56 + i * GAP : 30; // px up from the bottom
        return (
          <a
            key={s.href}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            title={s.label}
            className="social-dock-item text-ink-soft hover:text-pink"
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              width: BOX,
              height: BOX,
              transform: `translate(${x}px, ${-y}px)`,
              transitionDelay: `${i * 0.045}s`,
              pointerEvents: "auto",
            }}
          >
            {s.icon}
          </a>
        );
      })}
    </div>
  );
}

/* ── Desktop sidebar ──────────────────────────────────────────── */
function DesktopSidebar({
  pathname,
  collapsed,
  onToggle,
  onContactOpen,
}: {
  pathname: string;
  collapsed: boolean;
  onToggle: () => void;
  onContactOpen: () => void;
}) {

  const sortedProjects = useMemo(
    () => [...projects].filter((p) => !p.hidden).sort((a, b) => a.rank - b.rank),
    []
  );

  const isHome    = pathname === "/";
  const isAbout   = pathname.startsWith("/about");
  const isWork    = pathname === "/work" || pathname.startsWith("/case-studies/");

  // The project sublist has its own toggle (separate from the rail collapse) so
  // the 14-item list doesn't shove the bottom contact/social block off-screen.
  // Opens automatically when you're actually inside Work so the active project shows.
  const [worksOpen, setWorksOpen] = useState(false);
  useEffect(() => { if (isWork) setWorksOpen(true); }, [isWork]);

  return (
    <>
      {/* Protruding toggle handle — lives outside the clipped <aside> so it can
          stick out past the border. Sits in the same spot in both states,
          sliding with the sidebar edge; chevron flips to match. */}
      <button
        onClick={onToggle}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="sidebar-tab hidden md:flex"
        data-collapsed={collapsed}
        style={{ left: collapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_EXPANDED_W }}
      >
        {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </button>
    <aside
      className="hidden md:flex fixed left-0 border-r border-line flex-col z-40 bg-bg"
      style={{
        top: "var(--menubar-h)",
        bottom: 0,
        width: collapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_EXPANDED_W,
        transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
        overflow: "hidden",
      }}
      aria-label="Site navigation"
    >
      {/* Logo, pinned at the top of the rail (replaces the old top bar). Shows
          just the star when collapsed, the full wordmark when expanded. */}
      <Link
        href="/"
        className={`sidebar-logo ${collapsed ? "is-collapsed" : ""}`}
        aria-label="finbar.studio, home"
        title="finbar.studio, home"
      >
        <span className="logo-word logo-pre">finbar</span>
        <BrandStar className="pixel-star" size={16} />
        <span className="logo-word logo-post">studio</span>
      </Link>

      {/* Persistent nav — one list for both states. The icons stay put and the
          labels slide/fade in as the rail expands (no remove/replace swap). */}
      <nav className={`side-nav ${collapsed ? "is-collapsed" : ""}`} aria-label="Primary">
        <Link
          href="/"
          title="Home"
          aria-label="Home"
          aria-current={isHome ? "page" : undefined}
          className={`nav-row ${isHome ? "active" : ""}`}
        >
          <span className="nav-track">
            <span className="nav-slot nav-slot-ico"><HomeIcon /></span>
            <span className="nav-slot nav-slot-label">Home</span>
          </span>
        </Link>

        {/* Work — the label links to the /work archive; a caret toggles the project
            quick-list beneath it (expanded-only; collapses to nothing in the rail). */}
        <div className={`nav-row-work ${isWork ? "active" : ""}`}>
          <Link
            href="/work"
            title="Work"
            aria-label="Work"
            aria-current={isWork ? "page" : undefined}
            className="nav-row-link"
          >
            <span className="nav-track">
              <span className="nav-slot nav-slot-ico"><GridIcon /></span>
              <span className="nav-slot nav-slot-label">
                <span className="nav-slot-text">Work</span>
                <span className="nav-count tabular-nums">{sortedProjects.length}</span>
              </span>
            </span>
          </Link>
          {!collapsed && (
            <button
              type="button"
              className="nav-work-toggle"
              aria-expanded={worksOpen}
              aria-controls="nav-work-sublist"
              aria-label={worksOpen ? "Collapse project list" : "Expand project list"}
              title={worksOpen ? "Collapse project list" : "Expand project list"}
              onClick={() => setWorksOpen((v) => !v)}
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={`nav-work-caret ${worksOpen ? "is-open" : ""}`}>
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>

        <div className="nav-work" data-open={collapsed ? "false" : "true"}>
          <div className="nav-work-inner">
            <div
              className="nav-sublist"
              id="nav-work-sublist"
              data-open={!collapsed && worksOpen ? "true" : "false"}
              role="region"
              aria-label="Projects"
            >
              <div className="nav-sublist-inner">
                {sortedProjects.map((p) => {
                  const isActive = pathname === `/case-studies/${p.slug}`;
                  return (
                    <Link
                      key={p.slug}
                      href={`/case-studies/${p.slug}`}
                      className={`nav-sub ${isActive ? "active" : ""}`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {p.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <Link
          href="/about"
          title="About"
          aria-label="About"
          aria-current={isAbout ? "page" : undefined}
          className={`nav-row ${isAbout ? "active" : ""}`}
        >
          <span className="nav-track">
            <span className="nav-slot nav-slot-ico"><PersonIcon /></span>
            <span className="nav-slot nav-slot-label">About</span>
          </span>
        </Link>

        <button
          type="button"
          onClick={onContactOpen}
          title="Contact"
          aria-label="Contact"
          aria-haspopup="dialog"
          className="nav-row"
        >
          <span className="nav-track">
            <span className="nav-slot nav-slot-ico"><EnvelopeIcon /></span>
            <span className="nav-slot nav-slot-label">Contact</span>
          </span>
        </button>
      </nav>

      {/* Status / contact — expanded only. Socials are in the persistent dock. */}
      {!collapsed && (
        <div className="px-3 space-y-2.5 border-t border-line pt-3" style={{ paddingBottom: 96 }}>
          <span className="status-badge reveal-y" style={{ animationDelay: "0.18s" }}>OPEN FOR WORK</span>

          <a
            href="mailto:finbar@finbar.studio"
            className="block font-sans text-ink hover:text-pink transition-colors reveal-y"
            style={{ fontSize: "12px", letterSpacing: "0.02em", animationDelay: "0.22s" }}
          >
            finbar@finbar.studio
          </a>

          <a
            href="tel:+61412796630"
            className="block font-sans text-ink-soft hover:text-pink transition-colors tabular-nums reveal-y"
            style={{ fontSize: "11px", letterSpacing: "0.02em", animationDelay: "0.26s" }}
          >
            +61 412 796 630
          </a>

          <p
            className="text-ink-soft reveal-y pt-1"
            style={{ fontSize: "10px", letterSpacing: "0.06em", animationDelay: "0.3s" }}
          >
            Made with{" "}
            <span style={{ color: "var(--pink)" }} aria-hidden="true">♥</span>
            <span className="sr-only">love</span> by finbar &amp; claude
          </p>
        </div>
      )}
    </aside>

    {/* Persistent social dock — one set of icons that slides between the
        collapsed vertical rail and the expanded horizontal row. Rendered
        outside the (overflow-hidden) aside so it can't be clipped mid-slide. */}
    <SocialDock collapsed={collapsed} />
    <YearStamp collapsed={collapsed} />
    </>
  );
}

/* ── Mobile full-screen menu ──────────────────────────────────── */
function MobileMenu({
  open,
  onClose,
  onContactOpen,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  onContactOpen: () => void;
  pathname: string;
}) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const navLinks = [
    { label: "Home",  href: "/" },
    { label: "Work",  href: "/work" },
    { label: "About", href: "/about" },
  ];
  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : href === "/work"
        ? pathname.startsWith("/work") || pathname.startsWith("/case-studies/")
        : pathname.startsWith(href);

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
      {/* Header mirrors the closed MobileBar — borderless, brand left aligned to
          the bar's chip inset (pl-2.5 = the chip's 10px) so the logo doesn't shift
          when the menu opens; close (X) right, same -mr-1 as the hamburger. */}
      <div
        className="flex items-center justify-between px-3"
        style={{ height: "var(--menubar-h)" }}
      >
        <span
          className="font-bold uppercase tracking-[0.08em] text-[13px] inline-flex items-center pl-2.5"
          aria-hidden="true"
        >
          finbar<BrandStar className="pixel-star" size={20} />studio
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation menu"
          className="flex items-center justify-center text-ink hover:text-pink transition-colors -mr-1"
          style={{ width: 44, height: 44 }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 pt-6 pb-8 flex flex-col" aria-label="Mobile primary">
        <ul className="flex flex-col gap-1 mb-auto" role="list">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onClose}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`mobile-nav-row ${isActive(link.href) ? "active" : ""}`}
              >
                <span className="mobile-nav-label">{link.label}</span>
                <span className="mobile-nav-arrow" aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => { onClose(); onContactOpen(); }}
              aria-haspopup="dialog"
              className="mobile-nav-row w-full text-left"
            >
              <span className="mobile-nav-label">Contact</span>
              <span className="mobile-nav-arrow" aria-hidden="true">→</span>
            </button>
          </li>
        </ul>

        <div className="mobile-menu-foot">
          <span className="status-badge">OPEN FOR WORK</span>
          <a href="mailto:finbar@finbar.studio" className="mobile-foot-email">finbar@finbar.studio</a>
          <a href="tel:+61412796630" className="mobile-foot-tel tabular-nums">+61 412 796 630</a>
          <div className="mobile-foot-socials">
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
  onContactOpen,
}: {
  collapsed?: boolean;
  onToggle?: () => void;
  mobileMenuOpen?: boolean;
  onMobileMenuClose?: () => void;
  onContactOpen?: () => void;
}) {
  const pathname = usePathname();
  const openContact = onContactOpen ?? (() => {});

  return (
    <>
      <DesktopSidebar
        pathname={pathname}
        collapsed={collapsed}
        onToggle={onToggle ?? (() => {})}
        onContactOpen={openContact}
      />
      <MobileMenu
        open={mobileMenuOpen}
        onClose={onMobileMenuClose ?? (() => {})}
        onContactOpen={openContact}
        pathname={pathname}
      />
    </>
  );
}
