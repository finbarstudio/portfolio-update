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
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BrandWordmark from "./BrandWordmark";

let registered = false;

export default function SiteFooter() {
  // Deterministic initial year (matches SSR), then corrected on the client.
  const [year, setYear] = useState(2026);
  useEffect(() => setYear(new Date().getFullYear()), []);

  const footerRef = useRef<HTMLElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);

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
      el.style.fontSize = "100px";
      const natural = el.scrollWidth;
      if (natural <= 0) return;
      const size = (avail / natural) * 100;
      el.style.fontSize = `${Math.max(20, size)}px`;
      // Correct any sub-pixel undershoot so it spans the full width.
      const measured = el.scrollWidth;
      if (measured > 0) el.style.fontSize = `${Math.max(20, size * (avail / measured))}px`;
    };
    fit();
    document.fonts?.ready.then(fit).catch(() => {});
    const ro = new ResizeObserver(fit);
    if (el.parentElement) ro.observe(el.parentElement);
    return () => ro.disconnect();
  }, []);

  // Scroll-driven reveals via GSAP ScrollTrigger (scrub = tied to scroll speed):
  // the rule draws left→right as the footer enters; the wordmark rises in from
  // the bottom as you reach the very bottom.
  useLayoutEffect(() => {
    const footer = footerRef.current;
    const rule = ruleRef.current;
    const mark = markRef.current;
    if (!footer || !rule || !mark) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!registered) { gsap.registerPlugin(ScrollTrigger); registered = true; }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        rule,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: footer, start: "top 70%", end: "top 20%", scrub: true },
        },
      );
      gsap.fromTo(
        mark,
        { yPercent: 120 },
        {
          yPercent: 0,
          ease: "none",
          // Trigger on the footer with a reachable range (the old mark range sat
          // at the very end of scroll, so it never rose). Rises as you near the
          // bottom and finishes when the footer is fully scrolled.
          scrollTrigger: { trigger: footer, start: "top 40%", end: "bottom bottom", scrub: true },
        },
      );
    }, footer);

    // Layout settles (fonts/fit) after mount — make sure trigger positions are right.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh).catch(() => {});
    const t = setTimeout(refresh, 400);
    return () => { clearTimeout(t); ctx.revert(); };
  }, []);

  return (
    <footer className="site-footer" aria-label="Footer" ref={footerRef}>
      <div className="site-footer-rule" aria-hidden="true" ref={ruleRef} />

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

      <div className="site-footer-mark" aria-label="finbarstudio">
        <BrandWordmark ref={markRef} className="site-footer-mark-inner" />
      </div>
    </footer>
  );
}
