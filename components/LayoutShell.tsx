"use client";

// App shell: a fixed, transparent top nav across every portfolio page, the
// smooth-scroll driver, the grain overlay and the global footer. On the home
// page the intro wordmark scroll-shrinks up into the centre of the nav (see
// HomeIntro) — the nav itself is always present.

import TopNav from "./TopNav";
import SmoothScroll from "./SmoothScroll";
import SiteFooter from "./SiteFooter";
import "lenis/dist/lenis.css";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
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
