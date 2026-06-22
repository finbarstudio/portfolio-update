"use client";

/**
 * SiteFooter — full-screen footer. Thin rule near the top, info row pushed to
 * the bottom, then a giant LINDON HOMES wordmark fitted across the bottom within
 * the gutters. Rule draws in, wordmark + info rise on reveal.
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SiteFooter() {
  const [year, setYear] = useState(2026);
  useEffect(() => setYear(new Date().getFullYear()), []);

  const footerRef = useRef<HTMLElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);

  // Fit the wordmark to the row width (minus gutters), iterating to converge.
  useLayoutEffect(() => {
    const el = markRef.current;
    if (!el) return;
    const fit = () => {
      const parent = el.parentElement;
      if (!parent) return;
      const cs = getComputedStyle(parent);
      const avail =
        parent.clientWidth -
        parseFloat(cs.paddingLeft) -
        parseFloat(cs.paddingRight);
      if (avail <= 0) return;
      el.style.fontSize = "100px";
      const natural = el.scrollWidth;
      if (natural <= 0) return;
      let size = (avail / natural) * 100;
      for (let i = 0; i < 4; i++) {
        el.style.fontSize = `${Math.max(20, size)}px`;
        const measured = el.scrollWidth;
        if (measured <= 0) break;
        if (Math.abs(measured - avail) <= 0.5) break;
        size = size * (avail / measured);
      }
      el.style.fontSize = `${Math.max(20, size)}px`;
    };
    fit();
    requestAnimationFrame(fit);
    document.fonts?.ready.then(fit).catch(() => {});
    const ro = new ResizeObserver(fit);
    if (el.parentElement) ro.observe(el.parentElement);
    return () => ro.disconnect();
  }, []);

  // Reveal: rule draws, info + wordmark rise, when the footer enters view.
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: footerRef.current, start: "top 70%" },
      });
      tl.fromTo(
        ".lf-rule",
        { scaleX: 0 },
        { scaleX: 1, duration: 1, ease: "power3.inOut" }
      )
        .fromTo(
          ".lf-reveal",
          { yPercent: 120 },
          { yPercent: 0, duration: 0.9, stagger: 0.08, ease: "power3.out" },
          "-=0.6"
        )
        .fromTo(
          ".lf-mark-inner",
          { yPercent: 120 },
          { yPercent: 0, duration: 1.1, ease: "power3.out" },
          "-=0.7"
        );
    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer className="lf" aria-label="Footer" ref={footerRef}>
      <div className="lf-rule" aria-hidden="true" />

      <div className="lf-info">
        <div className="lf-col">
          <div className="lf-mask">
            <div className="lf-reveal">
              <span className="lf-label">Lindon Homes</span>
              <span className="lf-value">Custom &amp; Luxury Home Builders</span>
              <span className="lf-value">Brisbane · Est. 1992</span>
            </div>
          </div>
        </div>

        <div className="lf-col">
          <div className="lf-mask">
            <div className="lf-reveal">
              <span className="lf-label">Studio</span>
              <span className="lf-value">7A Natasha St</span>
              <span className="lf-value">Capalaba, QLD 4157</span>
            </div>
          </div>
        </div>

        <div className="lf-col">
          <div className="lf-mask">
            <div className="lf-reveal">
              <span className="lf-label">Enquiries</span>
              <a href="tel:+61738235522" className="lf-value lf-link tabular-nums">
                (07) 3823 5522
              </a>
              <a href="#" className="lf-value lf-link">
                Start a project
              </a>
            </div>
          </div>
        </div>

        <div className="lf-col lf-col-end">
          <div className="lf-mask">
            <div className="lf-reveal">
              <span className="lf-value">© {year} Lindon Homes</span>
              <span className="lf-label">QBCC No. 1207078</span>
            </div>
          </div>
        </div>
      </div>

      <div className="lf-mark" aria-label="Lindon Homes">
        <span ref={markRef} className="lf-mark-inner violet">
          LINDON&nbsp;HOMES
        </span>
      </div>
    </footer>
  );
}
