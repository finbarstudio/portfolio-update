"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero — wordmark lockup. The family name set large in Spectral/sans as the
 * focal point, a descriptor line above and a supporting line beneath, with a
 * thin meta row along a bottom rule. As you scroll into the featured showcase
 * the hero "scrolls away": the content drifts up and fades, the meta row settles
 * down and fades (GSAP scrub over the hero's own height). Honours reduced motion.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true },
      });
      tl.to(contentRef.current, { yPercent: -36, opacity: 0, ease: "none" }, 0);
      tl.to(metaRef.current, { yPercent: 50, opacity: 0, ease: "none" }, 0);
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="frame flex flex-col items-center justify-center text-center relative" style={{ minHeight: "100svh" }}>
      <div ref={contentRef} className="flex flex-col items-center" style={{ willChange: "transform, opacity" }}>
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
        className="absolute flex flex-wrap items-center justify-center"
        style={{ left: "var(--gutter)", right: "var(--gutter)", bottom: "clamp(28px,5vh,56px)", gap: "clamp(12px,1.4vw,22px)", borderTop: "1px solid var(--line)", paddingTop: "clamp(14px,1.6vw,22px)", willChange: "transform, opacity" }}
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
