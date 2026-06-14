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

/* Slim mobile-only top bar (the desktop sidebar is hidden on mobile). */
function MobileBar({ onMenu }: { onMenu: () => void }) {
  return (
    <header
      className="md:hidden fixed top-0 left-0 right-0 z-50 border-b border-ink bg-bg flex items-center justify-between px-3"
      style={{ height: "var(--menubar-h)" }}
      role="banner"
    >
      <Link
        href="/"
        className="font-bold uppercase tracking-[0.08em] text-[13px] hover:text-pink transition-colors"
        aria-label="finbar.studio, home"
      >
        finbar<BrandStar className="pixel-star" size="0.85em" />studio
      </Link>
      <button
        type="button"
        onClick={onMenu}
        aria-label="Open navigation menu"
        className="flex items-center justify-center text-ink hover:text-pink transition-colors -mr-2.5"
        style={{ width: 44, height: 44 }}
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

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
  };

  const sidebarW = collapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_EXPANDED_W;

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      {/* Film grain — retro texture over everything (never blocks pointers). */}
      <div className="grain-overlay" aria-hidden="true" />
      <MobileBar onMenu={() => setMobileMenuOpen(true)} />
      <Sidebar
        collapsed={collapsed}
        onToggle={toggle}
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuClose={() => setMobileMenuOpen(false)}
        onContactOpen={() => setContactOpen(true)}
      />
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
      <ContactDrawer open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
