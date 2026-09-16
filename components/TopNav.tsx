"use client";

// Top nav bar. Nav items (left) are plain pill tags (the .tag token, same as
// the intro "menu" button); social icons sit at the top right.

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiX, SiInstagram } from "@icons-pack/react-simple-icons";
import { projects } from "@/content/projects";
import { CursorManiaButton } from "@/components/cursormania/CursorMania";

// Count what the /work grid actually shows — hidden projects don't count.
const PROJECT_COUNT = projects.filter((p) => !p.hidden).length;

const items = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
];

/* ── Social glyphs ────────────────────────────────────────────── */
function ArenaIcon() {
  return (
    <svg viewBox="0 0 150 90" fill="currentColor" aria-hidden="true" width="100%" height="100%">
      <path d="M148.93 62.356l-20.847-16.384c-1.276-1-1.276-2.642 0-3.645l20.848-16.38c1.28-1.002 1.815-2.695 1.19-3.76-.626-1.062-2.374-1.44-3.88-.84l-24.79 9.874c-1.507.606-2.927-.22-3.153-1.83L114.57 2.926C114.34 1.317 113.13 0 111.877 0c-1.247 0-2.456 1.317-2.68 2.925l-3.73 26.467c-.228 1.61-1.646 2.434-3.155 1.83l-24.38-9.71c-1.512-.602-3.975-.602-5.483 0l-24.384 9.71c-1.508.604-2.928-.22-3.154-1.83L41.186 2.925C40.956 1.317 39.748 0 38.5 0c-1.252 0-2.463 1.317-2.688 2.925l-3.73 26.467c-.226 1.61-1.645 2.434-3.153 1.83L4.14 21.35c-1.507-.603-3.252-.223-3.878.838-.625 1.066-.092 2.76 1.184 3.76l20.85 16.38c1.277 1.003 1.277 2.645 0 3.646L1.446 62.356C.166 63.358-.364 65.152.26 66.34c.627 1.19 2.372 1.668 3.877 1.064l24.567-9.866c1.51-.603 2.914.218 3.125 1.828l3.544 26.696c.214 1.607 1.618 2.923 3.12 2.923 1.5 0 2.905-1.315 3.12-2.923l3.55-26.696c.21-1.61 1.62-2.43 3.122-1.828l24.164 9.698c1.506.606 3.97.606 5.477 0l24.16-9.698c1.504-.603 2.91.218 3.125 1.828l3.55 26.696c.212 1.607 1.617 2.923 3.115 2.923 1.502 0 2.907-1.315 3.12-2.923l3.55-26.696c.216-1.61 1.62-2.43 3.124-1.828l24.57 9.866c1.5.604 3.25.125 3.876-1.063.627-1.186.094-2.98-1.185-3.982zM95.89 46.18L77.53 60.315c-1.285.99-3.393.99-4.674 0L54.49 46.18c-1.284-.99-1.294-2.62-.02-3.625l18.4-14.493c1.274-1.005 3.363-1.005 4.638 0l18.4 14.493c1.277 1.004 1.267 2.634-.02 3.626z" />
    </svg>
  );
}
function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="100%" height="100%">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const socials = [
  { label: "Instagram", cls: "is-ig", href: "https://instagram.com/finbar.studio", icon: <SiInstagram size="100%" aria-hidden="true" /> },
  { label: "X", cls: "is-x", href: "https://x.com/finbarstudio", icon: <SiX size="100%" aria-hidden="true" /> },
  { label: "LinkedIn", cls: "is-li", href: "https://linkedin.com/in/finbarskitini", icon: <LinkedInIcon /> },
  { label: "Are.na", cls: "is-arena", href: "https://are.na/finbar-studio", icon: <ArenaIcon /> },
];

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

export default function TopNav() {
  const pathname = usePathname();

  // Auto-hide the bar on scroll-down, slide it back on scroll-up. The logo rides
  // with it (CSS keys off data-nav). Home is special: the intro plays a full
  // logo screen ABOVE the hero, so at the top there's no nav — it comes in once
  // the hero docks under the bar, stays through the hero, then auto-hides below.
  // Works with Lenis (native scroll) plus a plain window listener as fallback.
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const isHome = pathname === "/";
    const TOP = 80;  // non-home: px from the top where the bar is always shown
    const DELTA = 6; // ignore sub-pixel jitter
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
  }, [pathname]);
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
            href={it.href}
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
        {/* The CV, first on the right: a bold, tight "CV" as the glyph. Served
            from /downloads with a save-as header. */}
        <a href="/cv" download aria-label="Download CV (PDF)" className="top-nav-social-item top-nav-cv">
          <span className="top-nav-cv-mark" aria-hidden="true">CV</span>
          <span className="nav-tip" aria-hidden="true">Download CV</span>
        </a>
        {socials.map((s) => (
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
        {/* web.finbar — the @web.finbar Instagram's site catalogue, a quiet
            greyscale destination distinct from the socials. */}
        <a
          href="https://web.finbar.studio"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="web.finbar, a catalogue of good websites (opens in a new tab)"
          className="top-nav-social-item top-nav-web"
        >
          <GlobeIcon />
          <span className="nav-tip" aria-hidden="true">web.finbar</span>
        </a>
        {/* CursorMania: the 2004 cursor picker, last on the row. Opens the
            XP window (mounted in LayoutShell). */}
        <CursorManiaButton />
      </div>
    </header>
  );
}
