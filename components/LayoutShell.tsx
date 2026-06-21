"use client";

// App shell: a fixed, transparent top nav across every portfolio page, the
// smooth-scroll driver, the grain overlay and the global footer. On the home
// page the intro wordmark scroll-shrinks up into the centre of the nav (see
// HomeIntro) — the nav itself is always present.

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import TopNav from "./TopNav";
import NavLogo from "./NavLogo";
import SmoothScroll from "./SmoothScroll";
import SiteFooter from "./SiteFooter";
import ContactPanel from "./ContactPanel";
import "lenis/dist/lenis.css";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Reset scroll to the top on every route change. Lenis manages its own scroll
  // position and doesn't reset on client navigation, which otherwise leaves you
  // partway down (or at the bottom of) the new page.
  useEffect(() => {
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

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
      {/* Persistent resting logo. On desktop home it's hidden (HomeIntro's
          animated lockup shows instead); on mobile home + every other page it's
          the static nav logo. Visibility handled in CSS via .is-home. */}
      <NavLogo onHome={pathname === "/"} />
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
      <ContactPanel />
    </>
  );
}
