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

  return (
    <>
      <nav className="sb-tabs" aria-label="Sandbox" data-pos={onMockups ? "1" : "0"}>
        <span className="sb-tabs-glow" aria-hidden="true" />
        <Link href="/" className={`sb-tab ${onMockups ? "" : "is-active"}`} aria-current={onMockups ? undefined : "page"}>
          fs.s
        </Link>
        <Link href="/mockups" className={`sb-tab ${onMockups ? "is-active" : ""}`} aria-current={onMockups ? "page" : undefined}>
          mockups
        </Link>
      </nav>

      <a
        className="sb-corner-tr"
        href="https://www.finbar.studio"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="sb-corner-pill">
          finbar.studio<span className="sb-arrow" aria-hidden="true">↗</span>
        </span>
      </a>
    </>
  );
}
