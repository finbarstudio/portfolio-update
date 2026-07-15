"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HomeHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        logoRef.current,
        { opacity: 0, yPercent: -16, scale: 0.97 },
        { opacity: 1, yPercent: 0, scale: 1, duration: 1.5, ease: "power3.out" }
      );
      gsap.fromTo(
        ".hm-hero-line",
        { opacity: 0, yPercent: 60 },
        { opacity: 1, yPercent: 0, duration: 1, stagger: 0.12, ease: "power3.out", delay: 0.6 }
      );
      gsap.to(contentRef.current, {
        scale: 0.4,
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

    const t = gsap.delayedCall(3.0, () => {
      window.dispatchEvent(new Event("hm-developments:intro-done"));
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
        <div ref={logoRef} className="w-[clamp(190px,28vw,350px)]">
          <Image
            src="/hm-developments/logo.png"
            alt="HM Developments"
            width={600}
            height={267}
            priority
            className="w-full h-auto"
          />
        </div>

        <div className="mt-9 md:mt-12 flex flex-col items-center text-center">
          <div className="overflow-hidden">
            <p
              className="hm-hero-line text-[var(--ink-soft)] max-w-[24ch]"
              style={{ fontSize: "clamp(0.95rem, 1.7vw, 1.3rem)", lineHeight: 1.5, fontWeight: 300 }}
            >
              Enduring spaces that stand the test of time.
            </p>
          </div>
          <div className="overflow-hidden mt-5">
            <p
              className="hm-hero-line violet text-[var(--accent)]"
              style={{ fontSize: "clamp(0.6rem, 1.05vw, 0.78rem)", letterSpacing: "0.34em" }}
            >
              LUXURY DEVELOPMENTS · SUNSHINE COAST
            </p>
          </div>
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
