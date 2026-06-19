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
import FooterClock from "./FooterClock";
import LiveTime from "./LiveTime";
import { EngFlag } from "./Flags";

export default function SiteFooter() {
  // Deterministic initial year (matches SSR), then corrected on the client.
  const [year, setYear] = useState(2026);
  useEffect(() => setYear(new Date().getFullYear()), []);

  const pathname = usePathname();
  const footerRef = useRef<HTMLElement>(null);
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
      // Slight overshoot so the edges kiss the gutters — covers the -0.06em
      // left-bearing pull (see .site-footer-mark-inner) so the asterisk still
      // reaches the right edge.
      el.style.fontSize = `${Math.max(20, size * 1.009)}px`;
    };
    fit();
    requestAnimationFrame(fit);
    document.fonts?.ready.then(fit).catch(() => {});
    const ro = new ResizeObserver(fit);
    if (el.parentElement) ro.observe(el.parentElement);
    return () => ro.disconnect();
  }, []);

  // Re-arm + reveal on every page visit. A plain scroll-position check (robust,
  // unlike a sentinel that can sit below the clipped 100svh footer) flips the
  // reveal once the footer has scrolled well into view; the CSS transitions then
  // draw the rule and rise the wordmark.
  useLayoutEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;
    setRevealed(false);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setArmed(false);
      setRevealed(true);
      return;
    }
    setArmed(true);
    let revealedLocal = false;
    const check = () => {
      if (revealedLocal) return;
      // Fire only once you're near the actual bottom — the wordmark lives at the
      // foot of the footer, so trigger on remaining-scroll-to-bottom, not on the
      // footer's top (which crosses mid-screen way too early, around the HR).
      const remaining = footer.getBoundingClientRect().bottom - window.innerHeight;
      if (remaining < window.innerHeight * 0.22) {
        revealedLocal = true;
        setRevealed(true);
      }
    };
    const lenis = window.__lenis;
    // Defer attaching + the first check to the next frame: this lets the armed
    // (hidden) state paint first AND lets the route-change scroll-reset settle, so
    // navigating Home -> About doesn't instantly reveal with a stale scroll
    // position (which read as "the footer never draws in" on About).
    const raf = requestAnimationFrame(() => {
      check();
      window.addEventListener("scroll", check, { passive: true });
      window.addEventListener("resize", check);
      lenis?.on?.("scroll", check);
    });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      lenis?.off?.("scroll", check);
    };
  }, [pathname]);

  return (
    <footer
      className={`site-footer ${armed ? "is-armed" : ""} ${revealed ? "is-revealed" : ""}`}
      aria-label="Footer"
      ref={footerRef}
    >
      <div className="site-footer-rule" aria-hidden="true" />

      <div className="site-footer-info">
        <div className="sf-col">
          <FooterClock />
        </div>
        <div className="sf-col">
          <span className="sf-loc"><span className="sf-label">ENG/LON</span><EngFlag /></span>
          <LiveTime tz="Europe/London" />
        </div>
        <div className="sf-col">
          <span className="sf-label">Hiring or have a project?</span>
          <a href="mailto:finbar@finbar.studio" className="sf-value u-underline">finbar@finbar.studio</a>
        </div>
        <div className="sf-col">
          <a href="tel:+61412796630" className="sf-value u-underline tabular-nums">+61 412 796 630</a>
        </div>
        <div className="sf-col sf-col-end">
          <FooterCopyright year={year} />
          <span className="sf-value">Design and build by finbarstudio</span>
        </div>
      </div>

      <div className="site-footer-mark" aria-label="finbarstudio">
        <BrandWordmark ref={markRef} className="site-footer-mark-inner" />
      </div>
    </footer>
  );
}
