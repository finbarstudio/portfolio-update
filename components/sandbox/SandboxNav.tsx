"use client";

/**
 * SandboxNav — the two corner navs.
 * Top-left: a joined box of two tabs (FS.S / MOCKUPS) with a pink highlight that
 * slides between them based on the active route. Top-right: a link out to the
 * main finbar.studio site.
 *
 * Active state is derived with `pathname.includes("mockup")` so it's identical on
 * the server (which sees the rewritten /sandbox/... path) and the client (which
 * sees the clean /... path) — no hydration mismatch under the subdomain rewrite.
 * Any mockup page (/mockups, /phone-mockup, /mac-mockup) lights the MOCKUPS tab.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SandboxNav() {
  const pathname = usePathname();
  const onMockups = pathname.includes("mockup");
  const onTools = pathname.includes("tools") || pathname.includes("asterisk");
  const pos = onTools ? "2" : onMockups ? "1" : "0";

  return (
    <>
      <nav className="sb-tabs" aria-label="Sandbox" data-pos={pos}>
        <span className="sb-tabs-glow" aria-hidden="true" />
        <Link href="/" className={`sb-tab ${pos === "0" ? "is-active" : ""}`} aria-current={pos === "0" ? "page" : undefined}>
          fs.s
        </Link>
        <Link href="/mockups" className={`sb-tab ${onMockups ? "is-active" : ""}`} aria-current={onMockups ? "page" : undefined}>
          mockups
        </Link>
        <Link href="/tools" className={`sb-tab ${onTools ? "is-active" : ""}`} aria-current={onTools ? "page" : undefined}>
          tools
        </Link>
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
