"use client";

// App shell. Desktop: persistent left Sidebar with the logo pinned at its top
// (no global top bar). Mobile: a slim top bar (logo + hamburger) opens the
// full-screen MobileMenu. Contact opens a quick drawer rather than a page.

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Sidebar from "./Sidebar";
import BrandStar from "./BrandStar";
import ContactDrawer from "./ContactDrawer";

export const SIDEBAR_EXPANDED_W = 224; // px
export const SIDEBAR_COLLAPSED_W = 48; // px

/* Mobile-only top chrome. Transparent and borderless to mimic the airy desktop
   site (no solid OS-style bar); the logo and hamburger float as two small chipped
   controls that stay legible over scrolled content. */
function MobileBar({ onMenu }: { onMenu: () => void }) {
  const chip = {
    background: "color-mix(in srgb, var(--bg) 78%, transparent)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
  } as React.CSSProperties;
  return (
    <header
      className="sidebar-mobilebar md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-3 pointer-events-none"
      style={{ height: "var(--menubar-h)" }}
      role="banner"
    >
      <Link
        href="/"
        className="pointer-events-auto inline-flex items-center font-bold uppercase tracking-[0.08em] text-[13px] text-ink hover:text-pink transition-colors rounded-full px-2.5 py-1"
        style={chip}
        aria-label="finbar.studio, home"
      >
        finbar<BrandStar className="pixel-star" size={20} />studio
      </Link>
      <button
        type="button"
        onClick={onMenu}
        aria-label="Open navigation menu"
        className="pointer-events-auto flex items-center justify-center text-ink hover:text-pink transition-colors rounded-full -mr-1"
        style={{ width: 44, height: 44, ...chip }}
      >
        <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden="true">
          <path d="M1 1.5h20M1 8h20M1 14.5h20" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      </button>
    </header>
  );
}

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  // Home only: the nav stays hidden over the intro + disciplines sections (the
  // "intro zone"), with a "menu" button to summon it; otherwise it slides in
  // once you scroll past them.
  const [introZone, setIntroZone] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved === "true") setCollapsed(true);
  }, []);

  // Close transient UI on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setContactOpen(false);
  }, [pathname]);

  // Track whether we're still in the home "intro zone": before the
  // #nav-reveal-sentinel (placed after the disciplines section) scrolls past the
  // top. Off-home there's no intro zone.
  useEffect(() => {
    if (pathname !== "/") {
      setIntroZone(false);
      return;
    }
    const update = () => {
      const sentinel = document.getElementById("nav-reveal-sentinel");
      // Reveal a bit before the section fully clears the top (felt too late at 0).
      const inZone = sentinel
        ? sentinel.getBoundingClientRect().top > window.innerHeight * 0.4
        : window.scrollY < window.innerHeight * 0.5;
      setIntroZone(inZone);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  // Hide the nav while in the intro zone. Drives a [data-intro-active] flag on
  // <html> so the separately-positioned sidebar pieces can all respond. The
  // content reacts too: --sidebar-w collapses to 0, so the main reflows full
  // width while the nav is away and narrows again as it slides in.
  const navHidden = pathname === "/" && introZone;
  useEffect(() => {
    const root = document.documentElement;
    if (navHidden) root.dataset.introActive = "true";
    else delete root.dataset.introActive;
    return () => { delete root.dataset.introActive; };
  }, [navHidden]);

  // The "menu" tag scrolls down to where the nav reveals (rather than forcing it
  // open) — so scrolling back up tucks it away again, naturally.
  const revealNav = () => {
    document.getElementById("nav-reveal-sentinel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
  };

  const sidebarW = navHidden ? 0 : collapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_EXPANDED_W;

  // Only the portfolio routes (app/(site)) render this shell — the Sandbox + embeds
  // live outside that route group and never mount LayoutShell at all.
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      {/* Film grain — retro texture over everything (never blocks pointers). */}
      <div className="grain-overlay" aria-hidden="true" />
      {/* Over the intro zone the sidebar is hidden; this tag scrolls down to it. */}
      {navHidden && (
        <button type="button" className="intro-menu-btn sticker-pill" onClick={revealNav}>
          menu
        </button>
      )}
      <MobileBar onMenu={() => setMobileMenuOpen(true)} />
      <Sidebar
        collapsed={collapsed}
        onToggle={toggle}
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuClose={() => setMobileMenuOpen(false)}
        onContactOpen={() => setContactOpen(true)}
      />
      <ContactDrawer open={contactOpen} onClose={() => setContactOpen(false)} />
      <main
        className="min-w-0 ml-0 md:ml-[var(--sidebar-w)]"
        style={
          {
            "--sidebar-w": `${sidebarW}px`,
            paddingTop: "var(--menubar-h)",
            minHeight: "100vh",
            overflowX: "clip",
            transition: "margin-left 0.5s cubic-bezier(0.4,0,0.2,1)",
          } as React.CSSProperties
        }
        id="main-content"
        tabIndex={-1}
      >
        {children}
      </main>
    </>
  );
}
