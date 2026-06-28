"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HomeHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".bppd-hero-line",
        { opacity: 0, yPercent: 80 },
        { opacity: 1, yPercent: 0, duration: 1.1, stagger: 0.14, ease: "power3.out", delay: 0.5 }
      );
      // Slow drift on the skyline as you scroll past the hero.
      gsap.fromTo(
        imgRef.current,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: "none",
          scrollTrigger: { trigger: headerRef.current, start: "top top", end: "bottom top", scrub: true },
        }
      );
    }, headerRef);

    const t = gsap.delayedCall(2.8, () => {
      window.dispatchEvent(new Event("bppd:intro-done"));
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
      className="relative h-[92vh] min-h-[600px] w-full overflow-hidden bg-[var(--black)]"
    >
      <div ref={imgRef} className="absolute inset-0 -top-[8%] h-[116%] will-change-transform">
        <Image
          src="/bppd/skyline.webp"
          alt="Brisbane city skyline at dusk"
          fill
          priority
          quality={88}
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* Scrims — darken overall + weight the bottom for legible white type */}
      <div className="absolute inset-0 bg-black/45 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.6) 100%)" }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <div className="overflow-hidden">
          <p
            className="bppd-hero-line violet text-white/70"
            style={{ fontSize: "clamp(0.6rem, 1.05vw, 0.78rem)", letterSpacing: "0.36em" }}
          >
            SOUTH EAST QUEENSLAND
          </p>
        </div>
        <h1 className="mt-5 flex flex-col items-center">
          <span className="overflow-hidden">
            <span
              className="bppd-hero-line violet block text-white"
              style={{ fontSize: "clamp(1.9rem, 5.2vw, 4.6rem)", letterSpacing: "0.06em", fontWeight: 600, lineHeight: 1.04 }}
            >
              BRISBANE&nbsp;PRESTIGE
            </span>
          </span>
          <span className="overflow-hidden">
            <span
              className="bppd-hero-line violet block text-white/90"
              style={{ fontSize: "clamp(1.1rem, 2.8vw, 2.4rem)", letterSpacing: "0.18em", fontWeight: 400, lineHeight: 1.3 }}
            >
              PROPERTY DEVELOPMENTS
            </span>
          </span>
        </h1>
        <div className="overflow-hidden mt-7">
          <p
            className="bppd-hero-line text-white/80 max-w-[44ch] font-light"
            style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.2rem)", lineHeight: 1.55 }}
          >
            A property development, investment and management company, delivering
            de-risked, blue-chip developments across the south east.
          </p>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 violet text-white/60 text-[10px] tracking-[0.28em] uppercase">
        Scroll
      </div>
    </header>
  );
}
