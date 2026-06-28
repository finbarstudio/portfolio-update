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
        ".gto-hero-line",
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
      window.dispatchEvent(new Event("gto-building:intro-done"));
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
        <div ref={logoRef} className="w-[clamp(180px,24vw,300px)]">
          <Image
            src="/gto-building/logo.jpg"
            alt="GTO Building"
            width={530}
            height={371}
            priority
            className="w-full h-auto"
          />
        </div>

        <div className="mt-8 md:mt-10 flex flex-col items-center text-center">
          <div className="overflow-hidden">
            <p
              className="gto-hero-line violet text-[var(--ink)]"
              style={{ fontSize: "clamp(1.1rem, 2.4vw, 2rem)", letterSpacing: "0.06em" }}
            >
              It&rsquo;s All in the Details
            </p>
          </div>
          <div className="overflow-hidden mt-4">
            <p
              className="gto-hero-line text-[var(--accent)]"
              style={{ fontSize: "clamp(0.6rem, 1.05vw, 0.78rem)", letterSpacing: "0.34em", textTransform: "uppercase" }}
            >
              Award-Winning · Architect-Designed · Sunshine Coast
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
