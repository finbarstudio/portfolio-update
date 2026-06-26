"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { playOnIntro } from "../intro";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero — wordmark lockup. On entry the eyebrow, name and lead stagger up (after
 * the preloader lifts on first load, or on navigation), then the meta row settles
 * in. As you scroll into the featured showcase the hero "scrolls away": the
 * content drifts up and fades, the meta row settles down and fades. Reduced
 * motion shows everything statically.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const content = contentRef.current;
    const meta = metaRef.current;
    let introCleanup = () => {};
    const ctx = gsap.context(() => {
      // Entry: stagger the content children, then the meta row.
      const items = content ? (Array.from(content.children) as HTMLElement[]) : [];
      if (items.length) {
        gsap.set(items, { opacity: 0, y: 30 });
        gsap.set(meta, { opacity: 0, y: 16 });
        introCleanup = playOnIntro(() => {
          gsap.to(items, { opacity: 1, y: 0, duration: 0.95, ease: "power3.out", stagger: 0.13 });
          gsap.to(meta, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.3 });
        });
      }
      // Scroll-away.
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true },
      });
      tl.to(content, { yPercent: -36, opacity: 0, ease: "none" }, 0);
      tl.to(meta, { yPercent: 50, opacity: 0, ease: "none" }, 0);
    }, sectionRef);
    return () => {
      introCleanup();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="frame arl-hero relative">
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
