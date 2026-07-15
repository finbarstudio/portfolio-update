"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DrawIcon from "@/components/cal-turner/DrawIcon";
import {
  GLYPH_COMPASS,
  GLYPH_COLUMN,
  GLYPH_HOUSE,
  GLYPH_NORTH,
} from "@/components/cal-turner/glyphPaths";

gsap.registerPlugin(ScrollTrigger);

// Cal's real credentials, exactly as bracketed on his own About page:
// [ Registered Architect ] [ Masters of Architecture, UQ ]
// [ 15+ years experience ] [ Brisbane & Southeast Queensland ]
const CREDENTIALS = [
  { d: GLYPH_COMPASS, title: "Registered", label: "Architect" },
  { d: GLYPH_COLUMN, title: "M.Arch", label: "University of Queensland" },
  { d: GLYPH_HOUSE, title: "15+ Years", label: "Residential design" },
  { d: GLYPH_NORTH, title: "Brisbane", label: "& Southeast Queensland" },
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
      window.dispatchEvent(new Event("cal-turner:intro-done"));
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
        <div ref={logoRef} className="w-[clamp(240px,36vw,460px)]">
          <Image
            src="/cal-turner/logo.png"
            alt="Cal Turner Architects"
            width={1366}
            height={353}
            priority
            className="w-full h-auto"
          />
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
