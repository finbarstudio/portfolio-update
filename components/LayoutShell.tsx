"use client";

// App shell: a fixed top nav across every portfolio page, the smooth-scroll
// driver, the grain overlay and the global footer. On the home page the nav
// hides over the intro zone (a "menu" pill scrolls down to reveal it).

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import TopNav from "./TopNav";
import SmoothScroll from "./SmoothScroll";
import SiteFooter from "./SiteFooter";
import "lenis/dist/lenis.css";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  // Home only: the nav stays hidden over the intro + disciplines sections (the
  // "intro zone"), with a "menu" button to summon it; otherwise it shows.
  const [introZone, setIntroZone] = useState(false);
  const pathname = usePathname();

  // Track whether we're still in the home "intro zone": before the
  // #nav-reveal-sentinel (after the disciplines section) scrolls past the top.
  useEffect(() => {
    if (pathname !== "/") {
      setIntroZone(false);
      return;
    }
    const update = () => {
      const sentinel = document.getElementById("nav-reveal-sentinel");
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

  // Hide the nav while in the intro zone via a [data-intro-active] flag on <html>.
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
    const target = document.getElementById("nav-reveal-sentinel");
    if (!target) return;
    if (window.__lenis) window.__lenis.scrollTo(target, { offset: 0 });
    else target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Only the portfolio routes (app/(site)) render this shell — the Sandbox + embeds
  // live outside that route group and never mount LayoutShell at all.
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <SmoothScroll />
      {/* Film grain — retro texture over everything (never blocks pointers). */}
      <div className="grain-overlay" aria-hidden="true" />
      {/* Over the intro zone the nav is hidden; this tag scrolls down to it. */}
      {navHidden && (
        <button type="button" className="intro-menu-btn tag tag-default" onClick={revealNav}>
          menu
        </button>
      )}
      <TopNav />
      <main
        className="min-w-0"
        style={{
          paddingTop: "var(--menubar-h)",
          minHeight: "100vh",
          overflowX: "clip",
        }}
        id="main-content"
        tabIndex={-1}
      >
        {children}
        <SiteFooter />
      </main>
    </>
  );
}
