"use client";

/**
 * SiteFooter — a full-screen footer that sits on every portfolio page.
 *
 * Mostly open space: a thin rule near the top, then everything pushed to the
 * bottom — a compact info row (credit / contact / socials) sitting just above a
 * giant brand wordmark that runs flush along the very bottom and is clipped by
 * the footer's overflow. One uniform colour throughout.
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { SiX, SiInstagram } from "@icons-pack/react-simple-icons";
import BrandStar from "./BrandStar";

/* ── Social glyphs (match the sidebar set) ────────────────────── */
function ArenaIcon() {
  return (
    <svg viewBox="0 0 150 90" fill="currentColor" aria-hidden="true" width="1em" height="1em">
      <path d="M148.93 62.356l-20.847-16.384c-1.276-1-1.276-2.642 0-3.645l20.848-16.38c1.28-1.002 1.815-2.695 1.19-3.76-.626-1.062-2.374-1.44-3.88-.84l-24.79 9.874c-1.507.606-2.927-.22-3.153-1.83L114.57 2.926C114.34 1.317 113.13 0 111.877 0c-1.247 0-2.456 1.317-2.68 2.925l-3.73 26.467c-.228 1.61-1.646 2.434-3.155 1.83l-24.38-9.71c-1.512-.602-3.975-.602-5.483 0l-24.384 9.71c-1.508.604-2.928-.22-3.154-1.83L41.186 2.925C40.956 1.317 39.748 0 38.5 0c-1.252 0-2.463 1.317-2.688 2.925l-3.73 26.467c-.226 1.61-1.645 2.434-3.153 1.83L4.14 21.35c-1.507-.603-3.252-.223-3.878.838-.625 1.066-.092 2.76 1.184 3.76l20.85 16.38c1.277 1.003 1.277 2.645 0 3.646L1.446 62.356C.166 63.358-.364 65.152.26 66.34c.627 1.19 2.372 1.668 3.877 1.064l24.567-9.866c1.51-.603 2.914.218 3.125 1.828l3.544 26.696c.214 1.607 1.618 2.923 3.12 2.923 1.5 0 2.905-1.315 3.12-2.923l3.55-26.696c.21-1.61 1.62-2.43 3.122-1.828l24.164 9.698c1.506.606 3.97.606 5.477 0l24.16-9.698c1.504-.603 2.91.218 3.125 1.828l3.55 26.696c.212 1.607 1.617 2.923 3.115 2.923 1.502 0 2.907-1.315 3.12-2.923l3.55-26.696c.216-1.61 1.62-2.43 3.124-1.828l24.57 9.866c1.5.604 3.25.125 3.876-1.063.627-1.186.094-2.98-1.185-3.982zM95.89 46.18L77.53 60.315c-1.285.99-3.393.99-4.674 0L54.49 46.18c-1.284-.99-1.294-2.62-.02-3.625l18.4-14.493c1.274-1.005 3.363-1.005 4.638 0l18.4 14.493c1.277 1.004 1.267 2.634-.02 3.626z" />
    </svg>
  );
}
function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="1em" height="1em">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const socials = [
  { label: "Instagram", href: "https://instagram.com/finbar.studio", icon: <SiInstagram size="1em" aria-hidden="true" /> },
  { label: "X", href: "https://x.com/finbarstudio", icon: <SiX size="1em" aria-hidden="true" /> },
  { label: "LinkedIn", href: "https://linkedin.com/in/finbarskitini", icon: <LinkedInIcon /> },
  { label: "Are.na", href: "https://are.na/finbar-studio", icon: <ArenaIcon /> },
];

export default function SiteFooter() {
  // Deterministic initial year (matches SSR), then corrected on the client.
  const [year, setYear] = useState(2026);
  useEffect(() => setYear(new Date().getFullYear()), []);

  // Fit the giant wordmark to the full container width on one line.
  const markRef = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const el = markRef.current;
    if (!el) return;
    const fit = () => {
      const parent = el.parentElement;
      if (!parent) return;
      const avail = parent.clientWidth;
      el.style.fontSize = "100px";
      const natural = el.scrollWidth;
      if (natural > 0 && avail > 0) el.style.fontSize = `${Math.max(20, (avail / natural) * 100)}px`;
    };
    fit();
    document.fonts?.ready.then(fit).catch(() => {});
    const ro = new ResizeObserver(fit);
    if (el.parentElement) ro.observe(el.parentElement);
    return () => ro.disconnect();
  }, []);

  return (
    <footer className="site-footer" aria-label="Footer">
      <div className="site-footer-rule" aria-hidden="true" />

      <div className="site-footer-info">
        <div className="sf-cluster sf-credit">
          <span>© {year} finbar studio</span>
          <span className="sf-muted">
            Made with <span className="sf-heart" aria-hidden="true">♥</span>
            <span className="sr-only">love</span> by finbar &amp; claude
          </span>
        </div>

        <div className="sf-cluster sf-contact">
          <span className="sf-muted">Brisbane, QLD. Remote-friendly.</span>
          <a href="tel:+61412796630" className="u-underline tabular-nums">+61 412 796 630</a>
          <a href="mailto:finbar@finbar.studio" className="u-underline">finbar@finbar.studio</a>
          <Link href="/about#contact" className="u-underline">Hiring or have a project? →</Link>
        </div>

        <div className="sf-cluster sf-social">
          {socials.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="u-underline sf-social-item"
            >
              <span className="sf-social-ico">{s.icon}</span>
              <span>{s.label}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="site-footer-mark" aria-label="finbar studio">
        <span ref={markRef} className="site-footer-mark-inner">
          finbar
          <BrandStar className="sf-mark-star" size="0.62em" />
          studio
        </span>
      </div>
    </footer>
  );
}
