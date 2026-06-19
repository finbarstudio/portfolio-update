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
import { usePathname } from "next/navigation";
import BrandWordmark from "./BrandWordmark";
import FooterCopyright from "./FooterCopyright";

export default function SiteFooter() {
  // Deterministic initial year (matches SSR), then corrected on the client.
  const [year, setYear] = useState(2026);
  useEffect(() => setYear(new Date().getFullYear()), []);

  const pathname = usePathname();
  const footerRef = useRef<HTMLElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);
  const [armed, setArmed] = useState(false);
  const [revealed, setRevealed] = useState(false);

  // Fit the giant wordmark to the container width (minus its gutters) on one
  // line, with a correction pass so its edges land exactly on the page margins.
  useLayoutEffect(() => {
    const el = markRef.current;
    if (!el) return;
    const fit = () => {
      const parent = el.parentElement;
      if (!parent) return;
      const cs = getComputedStyle(parent);
      const avail = parent.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      if (avail <= 0) return;
      // First estimate from a 100px reference, then iterate the ratio to converge
      // on a size whose scrollWidth fills the row exactly (sub-pixel rounding +
      // the asterisk's non-linear width make one pass insufficient on some widths).
      el.style.fontSize = "100px";
      let natural = el.scrollWidth;
      if (natural <= 0) return;
      let size = (avail / natural) * 100;
      for (let i = 0; i < 4; i++) {
        el.style.fontSize = `${Math.max(20, size)}px`;
        const measured = el.scrollWidth;
        if (measured <= 0) break;
        if (Math.abs(measured - avail) <= 0.5) break;
        size = size * (avail / measured);
      }
      // Tiny overshoot so the edges always kiss the page margins (never short).
      el.style.fontSize = `${Math.max(20, size * 1.004)}px`;
    };
    fit();
    requestAnimationFrame(fit);
    document.fonts?.ready.then(fit).catch(() => {});
    const ro = new ResizeObserver(fit);
    if (el.parentElement) ro.observe(el.parentElement);
    return () => ro.disconnect();
  }, []);

  // Re-arm + re-reveal on every page visit (pathname change resets the reveal so
  // the footer animates in fresh each time rather than starting already shown).
  useLayoutEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    setRevealed(false);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setArmed(false);
      setRevealed(true);
      return;
    }
    setArmed(true);
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setRevealed(true); },
      { rootMargin: "0px 0px -8px 0px" },
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, [pathname]);

  return (
    <footer
      className={`site-footer ${armed ? "is-armed" : ""} ${revealed ? "is-revealed" : ""}`}
      aria-label="Footer"
      ref={footerRef}
    >
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
          <FooterCopyright year={year} />
          <span className="sf-muted">Design and build by finbarstudio</span>
        </div>
      </div>

      <div className="site-footer-mark" aria-label="finbarstudio">
        <BrandWordmark ref={markRef} className="site-footer-mark-inner" />
      </div>
      <div className="site-footer-sentinel" aria-hidden="true" ref={sentinelRef} />
    </footer>
  );
}
