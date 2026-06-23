"use client";

/**
 * SiteFooter, full-screen umber footer. Thin rule up top, info row pinned to
 * the bottom, then a giant OJ PIPPIN wordmark fitted across the gutters.
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { company } from "@/components/ojpippin/lib/content";

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

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: footerRef.current, start: "top 70%" },
      });
      tl.fromTo(
        ".of-reveal",
        { yPercent: 120 },
        { yPercent: 0, duration: 0.9, stagger: 0.08, ease: "power3.out" }
      ).fromTo(
        ".of-mark-inner",
        { yPercent: 120 },
        { yPercent: 0, duration: 1.1, ease: "power3.out" },
        "-=0.6"
      );
    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer className="of" aria-label="Footer" ref={footerRef} data-tone="dark">
      <div className="of-info">
        <div className="of-col">
          <div className="of-mask">
            <div className="of-reveal">
              <span className="of-label">OJ Pippin Homes</span>
              <span className="of-value">Custom &amp; turn-key builder</span>
              <span className="of-value">Brisbane · Est. {company.established}</span>
            </div>
          </div>
        </div>

        <div className="of-col">
          <div className="of-mask">
            <div className="of-reveal">
              <span className="of-label">Studio</span>
              <span className="of-value">{company.address.line1}</span>
              <span className="of-value">{company.address.line2}</span>
            </div>
          </div>
        </div>

        <div className="of-col">
          <div className="of-mask">
            <div className="of-reveal">
              <span className="of-label">Enquiries</span>
              <a href={company.phoneHref} className="of-value of-link tabular-nums">
                {company.phone}
              </a>
              <a href={`mailto:${company.email}`} className="of-value of-link">
                {company.email}
              </a>
            </div>
          </div>
        </div>

        <div className="of-col of-col-end">
          <div className="of-mask">
            <div className="of-reveal">
              <span className="of-value">© {year} OJ Pippin Homes</span>
              <span className="of-label">QBCC No. {company.qbcc}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="of-mark" aria-label="OJ Pippin">
        <span ref={markRef} className="of-mark-inner">
          OJ&nbsp;PIPPIN
        </span>
      </div>
    </footer>
  );
}
