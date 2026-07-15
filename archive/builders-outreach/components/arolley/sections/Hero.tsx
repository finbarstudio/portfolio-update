"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { playOnIntro } from "../intro";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero — wordmark lockup. The eyebrow, name and lead reveal in a stagger on entry
 * (CSS-driven via data-revealed, so it can't get stuck hidden), then the meta row
 * settles in. As you scroll into the featured showcase the content drifts up and
 * away (transform only — never opacity, so the text can never be hidden by the
 * scroll effect). Reduced motion shows everything immediately.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reveal = () => {
      contentRef.current?.setAttribute("data-revealed", "1");
      metaRef.current?.setAttribute("data-revealed", "1");
    };
    let cleanup = () => {};
    if (reduce) reveal();
    else cleanup = playOnIntro(reveal);

    let ctx: gsap.Context | undefined;
    if (!reduce) {
      ctx = gsap.context(() => {
        gsap.to(contentRef.current, {
          yPercent: -42,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true },
        });
      }, sectionRef);
    }
    return () => {
      cleanup();
      ctx?.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="frame arl-hero relative">
      <div ref={contentRef} className="arl-reveal flex flex-col items-center" style={{ willChange: "transform" }}>
        <p className="eyebrow">Builders of fine Sunshine Coast homes since 1968</p>
        <h1 className="display" style={{ fontSize: "clamp(40px,7.2vw,116px)", lineHeight: 0.98, marginTop: "clamp(18px,2.4vw,34px)" }}>
          A Rolley <span className="display-italic accent">&amp; Sons</span>
        </h1>
        <p className="lead" style={{ marginTop: "clamp(20px,2.4vw,32px)", maxWidth: "40ch", marginInline: "auto" }}>
          Light-filled homes you&rsquo;ll want to call home.
        </p>
      </div>

      <div
        ref={metaRef}
        className="arl-reveal-solo absolute flex flex-wrap items-center justify-center"
        style={{ left: "var(--gutter)", right: "var(--gutter)", bottom: "clamp(28px,5vh,56px)", gap: "clamp(12px,1.4vw,22px)", borderTop: "1px solid var(--line)", paddingTop: "clamp(14px,1.6vw,22px)" }}
      >
        {["Caloundra, QLD", "Established 1968", "Master Builders QLD"].map((m, i) => (
          <span key={m} className="eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: "clamp(12px,1.4vw,22px)" }}>
            {i > 0 && <span className="accent" aria-hidden>&middot;</span>}
            {m}
          </span>
        ))}
      </div>
    </section>
  );
}
