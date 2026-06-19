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
import BrandStar from "./BrandStar";

let registered = false;

export default function SiteFooter() {
  // Deterministic initial year (matches SSR), then corrected on the client.
  const [year, setYear] = useState(2026);
  useEffect(() => setYear(new Date().getFullYear()), []);

  const footerRef = useRef<HTMLElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);

  // Fit the giant wordmark to the container width (minus its gutters) on one line.
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

  // Scroll-driven reveals (GSAP ScrollTrigger): the rule draws left→right as the
  // footer enters; the wordmark rises in from the bottom as you reach the bottom.
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
          scrollTrigger: { trigger: footer, start: "top 92%", end: "top 45%", scrub: true },
        },
      );
      gsap.fromTo(
        mark,
        { yPercent: 120 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: mark, start: "top bottom", end: "bottom bottom", scrub: true },
        },
      );
    }, footer);

    return () => ctx.revert();
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
