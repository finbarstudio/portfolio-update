"use client";

/**
 * SandboxNav — the two corner navs.
 * Top-left: a joined pill of tabs with a pink highlight that slides onto the
 * active one. The landing (FS.S) tab collapses away once you leave it — it's just
 * a hub with no info, so there's no need to return, and dropping it gives the
 * remaining tabs room to breathe (the bar was too cramped on mobile otherwise).
 * Top-right: a link out to the main finbar.studio site.
 *
 * The active section is derived from the pathname so it's identical on the server
 * (which sees the rewritten /sandbox/... path) and the client (clean /... path) —
 * no hydration mismatch under the subdomain rewrite. The highlight pill is
 * positioned by measuring the active tab (JS), so it tracks tabs of any width and
 * the FS.S collapse smoothly.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";

const TABS = [
  { href: "/", label: "fs.s", key: "home" },
  { href: "/mockups", label: "mockups", key: "mockups" },
  { href: "/tools", label: "tools", key: "tools" },
  { href: "/library", label: "library", key: "library" },
] as const;

export default function SandboxNav() {
  const pathname = usePathname();
  const active =
    pathname.includes("mockup") ? "mockups"
      : pathname.includes("tools") || pathname.includes("asterisk") || pathname.includes("bezier") ? "tools"
        : pathname.includes("library") ? "library"
          : "home";
  const onHome = active === "home";

  const navRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);
  const tabRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  // Slide + size the highlight onto the active tab. Re-measures after the FS.S
  // collapse transition (and on resize) so it lands exactly.
  useLayoutEffect(() => {
    const place = () => {
      const el = tabRefs.current[active];
      const glow = glowRef.current;
      const nav = navRef.current;
      if (!el || !glow || !nav) return;
      const nr = nav.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      glow.style.width = r.width + "px";
      glow.style.transform = `translateX(${r.left - nr.left - 5}px)`;
      glow.style.opacity = "1";
    };
    place();
    const settle = setTimeout(place, 380);
    const ro = new ResizeObserver(place);
    if (navRef.current) ro.observe(navRef.current);
    return () => { clearTimeout(settle); ro.disconnect(); };
  }, [active, onHome]);

  return (
    <>
      <nav ref={navRef} className={`sb-tabs ${onHome ? "is-home" : "is-away"}`} aria-label="Sandbox">
        <span ref={glowRef} className="sb-tabs-glow" aria-hidden="true" />
        {TABS.map((t) => {
          const isActive = active === t.key;
          const isHomeTab = t.key === "home";
          return (
            <Link
              key={t.key}
              href={t.href}
              ref={(el) => { tabRefs.current[t.key] = el; }}
              className={`sb-tab ${isActive ? "is-active" : ""} ${isHomeTab ? "sb-tab-home" : ""}`}
              aria-current={isActive ? "page" : undefined}
              aria-hidden={isHomeTab && !onHome ? true : undefined}
              tabIndex={isHomeTab && !onHome ? -1 : undefined}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>

      <a
        className="sb-corner-tr"
        href="https://www.finbar.studio"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="sb-corner-pill">
          finbar.studio
          <svg className="sb-arrow" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M3.25 8.75L8.75 3.25M8.75 3.25H4.5M8.75 3.25V7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </a>
    </>
  );
}
