"use client";

// Top nav bar. Nav items (left) are plain pill tags (the .tag token, same as
// the intro "menu" button); social icons sit at the top right.

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SOCIALS } from "@/components/social-icons";
import { projects } from "@/content/projects";
import { CursorManiaButton } from "@/components/cursormania/CursorMania";
import LabSwitch from "@/components/LabSwitch";
import ThemeSwitch from "@/components/portfolio/ThemeSwitch";

// Count what the /work grid actually shows — hidden projects don't count.
const PROJECT_COUNT = projects.filter((p) => !p.hidden).length;

const items = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
];

/* the social glyphs live in components/social-icons.tsx (the portfolio shares them) */
const socials = SOCIALS;

/* web.finbar — the @web.finbar Instagram catalogue's site counterpart: a
   globe, kept greyscale-coded to read as a quieter destination than the socials. */
function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width="100%" height="100%">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.6 2.6 3.9 5.6 3.9 9s-1.3 6.4-3.9 9c-2.6-2.6-3.9-5.6-3.9-9S9.4 5.6 12 3z" />
    </svg>
  );
}

/** The portfolio PDF download (public/downloads/Finbar-Skitini-Portfolio.pdf,
 *  made by scripts/portfolio-pdf.mjs). The same flag is in content/portfolio.ts. */
const PORTFOLIO_PDF = true;

/** `portfolio`: the /portfolio page wears this nav too, inverted on black (see
 *  app/portfolio/layout.tsx) and carrying the CV download, which the main site
 *  no longer shows. */
export default function TopNav({ variant = "site" }: { variant?: "site" | "portfolio" }) {
  const pathname = usePathname();

  // Auto-hide the bar on scroll-down, slide it back on scroll-up. The logo rides
  // with it (CSS keys off data-nav). Home is special: the intro plays a full
  // logo screen ABOVE the hero, so at the top there's no nav — it comes in once
  // the hero docks under the bar, stays through the hero, then auto-hides below.
  // Works with Lenis (native scroll) plus a plain window listener as fallback.
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    // The portfolio is served at "/" on its own subdomain, so the path alone
    // does not say this is the studio home page: the variant has to agree.
    const isHome = pathname === "/" && variant === "site";
    // non-home: px from the top where the bar is always shown. On /portfolio the
    // first page sits just under the bar, so the bar goes on the first few
    // pixels of scroll, before that page's top edge can reach it.
    const TOP = variant === "portfolio" ? 4 : 80;
    const DELTA = variant === "portfolio" ? 2 : 6; // ignore sub-pixel jitter
    const NAVH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--menubar-h")) || 56;
    const getY = () => Math.max(0, (window.__lenis?.animatedScroll ?? window.scrollY) || 0);
    const root = document.documentElement;
    // state: "shown" (visible) | "up" (hidden by scroll — logo fades too)
    //        | "intro" (home logo screen above the hero — nav hidden, logo stays)
    const apply = (state: "shown" | "up" | "intro") => {
      setHidden(state !== "shown");
      root.dataset.nav = state;
    };
    let lastY = getY();
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = getY();
      if (isHome) {
        // While the intro (pulse + glide) is running, its own scrolling must
        // not count as the visitor's first scroll — stay hidden until it ends.
        if (document.documentElement.dataset.introLock) { apply("intro"); lastY = y; return; }
        // Home: hidden on the landing frame, in on the first scroll, and it
        // STAYS — no direction-based hiding here (that behaviour is for the
        // other pages). Matches the pill and the footer reveal exactly.
        apply(y < 8 ? "intro" : "shown");
        lastY = y;
        return;
      } else if (y < TOP) {
        apply("shown"); lastY = y; return;
      }
      if (Math.abs(y - lastY) < DELTA) return;
      apply(y > lastY ? "up" : "shown");
      lastY = y;
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    // Lenis may initialise after this mounts — attach once it appears.
    let lenis = window.__lenis ?? null;
    let attached = false;
    const attach = () => {
      const l = window.__lenis;
      if (l) { lenis = l; l.on("scroll", onScroll); attached = true; }
    };
    if (lenis) attach();
    const iv = window.setInterval(() => {
      if (attached) window.clearInterval(iv);
      else attach();
    }, 120);
    window.setTimeout(() => window.clearInterval(iv), 3000);
    update(); // set the initial state for this route
    return () => {
      window.removeEventListener("scroll", onScroll);
      lenis?.off("scroll", onScroll);
      window.clearInterval(iv);
      delete root.dataset.nav;
    };
  }, [pathname, variant]);
  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname.startsWith(href) || (href === "/work" && pathname.startsWith("/case-studies/"));

  return (
    <header className={`top-nav ${hidden ? "is-hidden" : ""}`}>
      <nav className="top-nav-inner" aria-label="Primary">
        {items.map((it) => (
          <Link
            key={it.href}
            // the portfolio lives on its own subdomain, so its links leave for the main site
            href={variant === "portfolio" ? `https://www.finbar.studio${it.href}` : it.href}
            aria-current={isActive(it.href) ? "page" : undefined}
            className={`tag ${isActive(it.href) ? "tag-pink" : "tag-default"}`}
          >
            {it.label}
            {it.href === "/work" && (
              <span className="nav-work-count">{PROJECT_COUNT}</span>
            )}
          </Link>
        ))}
        {/* Opens the contact popup — except on /contact, where the page IS the
            contact surface and the button would just be noise. */}
        {pathname !== "/contact" && (
          <button
            type="button"
            className="tag tag-default"
            onClick={(e) => window.dispatchEvent(new CustomEvent("contact:open", { detail: { x: e.clientX, y: e.clientY } }))}
          >
            Contact
          </button>
        )}
      </nav>

      <div className="top-nav-social">
        {/* The CV, first on the right, on /portfolio only: a bold, tight "CV" as
            the glyph. Served from /downloads with a save-as header. */}
        {variant === "portfolio" && (
          <a href="/cv" download aria-label="Download CV (PDF)" className="top-nav-social-item top-nav-cv">
            <span className="top-nav-cv-mark" aria-hidden="true">CV</span>
            <span className="nav-tip" aria-hidden="true">Download CV</span>
          </a>
        )}
        {variant === "portfolio" && PORTFOLIO_PDF && (
          <a href="/portfolio.pdf" download aria-label="Download portfolio (PDF)" className="top-nav-social-item top-nav-cv">
            <span className="top-nav-cv-mark" aria-hidden="true">PDF</span>
            <span className="nav-tip" aria-hidden="true">Download portfolio</span>
          </a>
        )}
        {/* /portfolio keeps the row to the CV and LinkedIn */}
        {(variant === "portfolio" ? socials.filter((x) => x.cls === "is-li") : socials).map((s) => (
          <a
            key={s.href}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className={`top-nav-social-item ${s.cls}`}
          >
            {s.icon}
            {/* Same dropdown label the sandbox flask carries. No title attr —
                the native tooltip would double up with this one. */}
            <span className="nav-tip" aria-hidden="true">{s.label}</span>
          </a>
        ))}
        {/* After the socials, three spaced groups (a double gap before each,
            .top-nav-apart): CursorMania, web.finbar, then the lab switch,
            right-most. */}
        {/* CursorMania: the 2004 cursor picker. Opens the XP window (mounted
            in LayoutShell). */}
        {variant === "site" && <CursorManiaButton />}
        {/* web.finbar — the @web.finbar Instagram's site catalogue, a quiet
            greyscale destination distinct from the socials. */}
        {variant === "site" && (
          <a
            href="https://web.finbar.studio"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="web.finbar, a catalogue of good websites (opens in a new tab)"
            className="top-nav-social-item top-nav-web top-nav-apart"
          >
            <GlobeIcon />
            <span className="nav-tip" aria-hidden="true">web.finbar</span>
          </a>
        )}
        {/* /portfolio swaps the lab switch for its own light / dark switch */}
        {variant === "portfolio" ? <ThemeSwitch className="top-nav-apart" /> : <LabSwitch className="top-nav-apart" />}
      </div>
    </header>
  );
}
