"use client";

/**
 * Footer — full-screen dark close, in the Lindon / OJ Pippin language: a thin
 * rule up top, a four-column info row pinned to the bottom, then Braeden's real
 * logo spanning the gutters. One GSAP timeline draws the rule, clip-rises the
 * columns in a stagger, then wipes the logo up. data-tone="dark" flips the nav
 * to its light treatment while it sits over this section.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BraedenLogoFull from "../BraedenLogoFull";

gsap.registerPlugin(ScrollTrigger);

const YEAR = 2026;

export default function Footer() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top 68%" },
      });
      tl.fromTo(
        ".brd-foot-line",
        { scaleX: 0 },
        { scaleX: 1, duration: 1.1, ease: "power3.inOut" }
      )
        .fromTo(
          ".brd-foot-reveal",
          { yPercent: 120 },
          { yPercent: 0, duration: 0.9, stagger: 0.08, ease: "power3.out" },
          "-=0.7"
        )
        .fromTo(
          ".brd-foot-logo",
          { yPercent: 118 },
          { yPercent: 0, duration: 1.2, ease: "power3.out" },
          "-=0.55"
        );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <footer className="brd-foot" data-tone="dark" aria-label="Footer" ref={ref}>
      <hr className="brd-foot-line" />

      <div className="brd-foot-grid">
        <div className="brd-foot-col">
          <div className="brd-foot-mask">
            <div className="brd-foot-reveal">
              <p className="brd-foot-label">Braeden Constructions</p>
              <p className="brd-foot-val">
                <span>Custom home builders</span>
                <span>Noosa hinterland · est. 1996</span>
              </p>
            </div>
          </div>
        </div>

        <div className="brd-foot-col">
          <div className="brd-foot-mask">
            <div className="brd-foot-reveal">
              <p className="brd-foot-label">Visit</p>
              <p className="brd-foot-val">
                <span>Hoy Rd, Lake McDonald</span>
                <span>Noosa Hinterland, QLD</span>
                <span>By appointment</span>
              </p>
            </div>
          </div>
        </div>

        <div className="brd-foot-col">
          <div className="brd-foot-mask">
            <div className="brd-foot-reveal">
              <p className="brd-foot-label">Enquiries</p>
              <p className="brd-foot-val">
                <a href="tel:+61418505117" className="brd-foot-link tabular-nums">
                  0418 505 117
                </a>
                <span>Deal direct with Mick</span>
                <a
                  href="https://www.facebook.com/braedenconstructions/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brd-foot-link"
                >
                  Facebook
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="brd-foot-col brd-foot-col-end">
          <div className="brd-foot-mask">
            <div className="brd-foot-reveal">
              <p className="brd-foot-val">
                <span>© {YEAR} Braeden Constructions</span>
                <span>QBCC 1017247 · MBA #19831</span>
                <span className="brd-foot-credit">Concept site by finbar✶studio</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="brd-foot-mark" aria-label="Braeden Constructions">
        <BraedenLogoFull className="brd-foot-logo" variant="wordmark" />
      </div>
    </footer>
  );
}
