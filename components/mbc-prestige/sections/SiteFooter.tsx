"use client";

/**
 * SiteFooter — full-screen footer. Thin rule near the top, info row pushed to
 * the bottom, then a giant LINDON HOMES wordmark fitted across the bottom within
 * the gutters. Rule draws in, wordmark + info rise on reveal.
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BrandWordmarkText from "@/components/BrandWordmarkText";

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
              <span className="lf-label">MBC Prestige</span>
              <span className="lf-value">Luxury Noosa Developer</span>
              <span className="lf-value">40 Years on the Coast</span>
            </div>
          </div>
        </div>

        <div className="lf-col">
          <div className="lf-mask">
            <div className="lf-reveal">
              <span className="lf-label">Locale</span>
              <span className="lf-value">Noosa &amp; the Sunshine Coast</span>
              <span className="lf-value">Queensland</span>
            </div>
          </div>
        </div>

        <div className="lf-col">
          <div className="lf-mask">
            <div className="lf-reveal">
              <span className="lf-label">Enquiries</span>
              <a href="tel:+61754472451" className="lf-value lf-link tabular-nums">
                (07) 5447 2451
              </a>
              <a href="mailto:info@mbcprestige.com.au" className="lf-value lf-link">
                info@mbcprestige.com.au
              </a>
            </div>
          </div>
        </div>

        <div className="lf-col lf-col-end">
          <div className="lf-mask">
            <div className="lf-reveal">
              <span className="lf-value">© {year} MBC Prestige</span>
              <span className="lf-label">Designed with Stephen Kidd</span>
              <span className="lf-value lf-credit">Concept site by <BrandWordmarkText className="lf-foot-mark" /></span>
            </div>
          </div>
        </div>
      </div>

      <div className="lf-mark" aria-label="MBC Prestige">
        <span ref={markRef} className="lf-mark-inner violet">
          MBC&nbsp;PRESTIGE
        </span>
      </div>
    </footer>
  );
}
