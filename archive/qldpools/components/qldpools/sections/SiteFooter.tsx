"use client";

/**
 * SiteFooter — full-screen footer (ported from the Lindon demo). Thin rule near
 * the top, info row pushed to the bottom, then a giant QLD POOL INSTALLS
 * wordmark fitted across the bottom within the gutters.
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
        ".qf-rule",
        { scaleX: 0 },
        { scaleX: 1, duration: 1, ease: "power3.inOut" }
      )
        .fromTo(
          ".qf-reveal",
          { yPercent: 120 },
          { yPercent: 0, duration: 0.9, stagger: 0.08, ease: "power3.out" },
          "-=0.6"
        )
        .fromTo(
          ".qf-mark-inner",
          { yPercent: 120 },
          { yPercent: 0, duration: 1.1, ease: "power3.out" },
          "-=0.7"
        );
    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer className="qf" aria-label="Footer" ref={footerRef}>
      <div className="qf-rule" aria-hidden="true" />

      <div className="qf-info">
        <div className="qf-col">
          <div className="qf-mask">
            <div className="qf-reveal">
              <span className="qf-label">QLD Pool Installs</span>
              <span className="qf-value">Fibreglass &amp; Concrete Pools</span>
              <span className="qf-value">Brisbane · Gold Coast · Sunshine Coast</span>
            </div>
          </div>
        </div>

        <div className="qf-col">
          <div className="qf-mask">
            <div className="qf-reveal">
              <span className="qf-label">Licensed &amp; Insured</span>
              <span className="qf-value">QBCC Licence #15377435</span>
              <span className="qf-value">NSW Builders Licence #453 712C</span>
            </div>
          </div>
        </div>

        <div className="qf-col">
          <div className="qf-mask">
            <div className="qf-reveal">
              <span className="qf-label">Enquiries</span>
              <a href="tel:+61423123248" className="qf-value qf-link tabular-nums">
                0423 123 248
              </a>
              <a href="mailto:poolsqld@gmail.com" className="qf-value qf-link">
                poolsqld@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="qf-col qf-col-end">
          <div className="qf-mask">
            <div className="qf-reveal">
              <span className="qf-value">© {year} QLD Pool Installs</span>
              <span className="qf-label">2,500+ pools installed</span>
              <span className="qf-value qf-credit">Concept site by <BrandWordmarkText className="qf-foot-mark" /></span>
            </div>
          </div>
        </div>
      </div>

      <div className="qf-mark" aria-label="QLD Pool Installs">
        <span ref={markRef} className="qf-mark-inner qpi-display">
          QLD&nbsp;POOL&nbsp;INSTALLS
        </span>
      </div>
    </footer>
  );
}
