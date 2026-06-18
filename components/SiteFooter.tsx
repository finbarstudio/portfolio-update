"use client";

/**
 * SiteFooter — a full-screen footer that sits on every portfolio page.
 *
 * Mostly open space: a thin rule near the top, then everything pushed to the
 * bottom — a compact info row (credit / contact / locations) sitting above a
 * giant brand wordmark that runs along the bottom within the page gutters.
 * One uniform colour throughout.
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import BrandStar from "./BrandStar";

export default function SiteFooter() {
  // Deterministic initial year (matches SSR), then corrected on the client.
  const [year, setYear] = useState(2026);
  useEffect(() => setYear(new Date().getFullYear()), []);

  // Fit the giant wordmark to the container width (minus its gutters) on one line.
  const markRef = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const el = markRef.current;
    if (!el) return;
    const fit = () => {
      const parent = el.parentElement;
      if (!parent) return;
      const cs = getComputedStyle(parent);
      const avail = parent.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
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
        <div className="sf-cluster sf-contact">
          <span className="sf-heading">Hiring or have a project?</span>
          <a href="tel:+61412796630" className="u-underline tabular-nums">+61 412 796 630</a>
          <a href="mailto:finbar@finbar.studio" className="u-underline">finbar@finbar.studio</a>
        </div>

        <div className="sf-cluster sf-locations">
          <span>Brisbane, QLD</span>
          <span>London, UK</span>
        </div>

        <div className="sf-cluster sf-credit">
          <span>© {year} finbar studio</span>
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
