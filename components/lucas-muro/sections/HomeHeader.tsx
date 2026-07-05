"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DrawIcon from "@/components/lucas-muro/DrawIcon";
import {
  GLYPH_APERTURE,
  GLYPH_TWILIGHT,
  GLYPH_CAMERA,
  GLYPH_PIN,
} from "@/components/lucas-muro/glyphPaths";

gsap.registerPlugin(ScrollTrigger);

// Lucas's real credentials — from his own site: shooting since 2004
// (footer), twilights + low-level aerials and half/full day shoots with
// 48-72 hour delivery (FAQ), Marcoola base shooting the east coast (contact).
const CREDENTIALS = [
  { d: GLYPH_APERTURE, title: "Since 2004", label: "Architecture & interiors" },
  { d: GLYPH_TWILIGHT, title: "Twilights", label: "& low-level aerials" },
  { d: GLYPH_CAMERA, title: "Half & full day", label: "Delivered in 48-72 hrs" },
  { d: GLYPH_PIN, title: "Sunshine Coast", label: "Brisbane · Sydney · Melbourne" },
];

export default function HomeHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro — the wordmark settles in; the glyphs draw themselves (DrawIcon).
      gsap.fromTo(
        logoRef.current,
        { opacity: 0, yPercent: -18, scale: 0.96 },
        { opacity: 1, yPercent: 0, scale: 1, duration: 1.6, ease: "power3.out" }
      );
      // Falloff — the brand block scales + fades as the first project scrolls
      // up over the sticky header.
      gsap.to(contentRef.current, {
        scale: 0.35,
        yPercent: 8,
        opacity: 0,
        ease: "power2.out",
        transformOrigin: "center center",
        scrollTrigger: { trigger: headerRef.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(overlayRef.current, {
        opacity: 1,
        ease: "power2.out",
        scrollTrigger: { trigger: headerRef.current, start: "top top", end: "75% top", scrub: true },
      });
    }, headerRef);

    const introTotal = 1.6 + (CREDENTIALS.length - 1) * 0.08 + 1.4 + 0.7;
    const t = gsap.delayedCall(introTotal, () => {
      window.dispatchEvent(new Event("lucas-muro:intro-done"));
    });

    return () => {
      t.kill();
      ctx.revert();
    };
  }, []);

  return (
    <header
      id="home-header"
      ref={headerRef}
      className="sticky top-0 h-[82vh] min-h-[560px] w-full flex flex-col items-center justify-center px-8 overflow-hidden"
    >
      <div ref={contentRef} className="flex flex-col items-center will-change-transform w-full">
        {/* Text wordmark — no logo file exists on the real site, so the mark
            is typographic: the name, then his own descriptor line under it. */}
        <div ref={logoRef} className="flex flex-col items-center text-center">
          <span
            className="violet text-[var(--ink)] leading-none whitespace-nowrap"
            style={{ fontSize: "clamp(2.1rem, 7vw, 5.2rem)", letterSpacing: "0.14em", textIndent: "0.14em" }}
          >
            LUCAS&nbsp;MURO
          </span>
          <span
            className="violet text-[var(--ink)]/60 mt-4"
            style={{ fontSize: "clamp(0.5rem, 1.1vw, 0.72rem)", letterSpacing: "0.42em", textIndent: "0.42em" }}
          >
            ARCHITECTURAL &amp; INTERIORS PHOTOGRAPHER
          </span>
        </div>

        {/* Credentials row — sits well below the mark so the glyphs never crowd it. */}
        <div className="mt-[7vh] md:mt-14 flex flex-wrap items-start justify-center gap-x-6 gap-y-5 max-w-3xl">
          {CREDENTIALS.map((c, i) => (
            <DrawIcon
              key={c.title}
              d={c.d}
              title={c.title}
              label={c.label}
              delay={1.6 + i * 0.08}
            />
          ))}
        </div>
      </div>

      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none opacity-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.85) 45%, rgba(255,255,255,1) 75%)",
        }}
      />
    </header>
  );
}
