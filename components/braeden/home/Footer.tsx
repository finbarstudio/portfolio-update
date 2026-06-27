"use client";

/**
 * Footer — NEGATIVE / knockout treatment. The page→footer transition is a solid
 * colour slab with the Braeden logo cut OUT of it, so the white page reads through
 * the knocked-out mark. The four-column info row sits below on the dark ground.
 * One GSAP timeline brings the slab in, then clip-rises the columns in a stagger.
 * data-tone="dark" flips the nav to its light treatment over this section.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BraedenLogoKnockout from "../BraedenLogoKnockout";

gsap.registerPlugin(ScrollTrigger);

const YEAR = 2026;

export default function Footer() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top 72%" },
      });
      tl.fromTo(
        ".brd-foot-neg",
        { yPercent: 14, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.1, ease: "power3.out" }
      ).fromTo(
        ".brd-foot-reveal",
        { yPercent: 120 },
        { yPercent: 0, duration: 0.9, stagger: 0.08, ease: "power3.out" },
        "-=0.55"
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <footer className="brd-foot brd-foot-negmode" data-tone="dark" aria-label="Footer" ref={ref}>
      {/* the page reads through the cut-out logo — the slab is the transition */}
      <div className="brd-foot-neg" aria-label="Braeden Constructions">
        <BraedenLogoKnockout className="brd-foot-neg-logo" />
      </div>

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
    </footer>
  );
}
