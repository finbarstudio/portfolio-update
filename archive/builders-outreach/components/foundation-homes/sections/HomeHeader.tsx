"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AwardIcon from "@/components/foundation-homes/AwardIcon";

gsap.registerPlugin(ScrollTrigger);

// Real Master Builders Queensland awards (Sunshine Coast & QLD regions).
const AWARDS = [
  { mark: "17", body: "MBA", status: "Winner", label: "QLD Custom Home of the Year" },
  { mark: "19", body: "MBA", status: "Winner", label: "Renovation Over $1M" },
  { mark: "20", body: "MBA", status: "Winner", label: "Custom Home $1–2M" },
  { mark: "21", body: "MBA", status: "Winner", label: "Renovation $750K–1M" },
  { mark: "23", body: "MBA", status: "Winner", label: "Custom Home $1–1.5M" },
  { mark: "23", body: "MBA", status: "Finalist", label: "Custom Home" },
];

export default function HomeHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro — the logo settles in; the laurels draw themselves (AwardIcon).
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

    const introTotal = 1.6 + (AWARDS.length - 1) * 0.08 + 1.4 + 0.7;
    const t = gsap.delayedCall(introTotal, () => {
      window.dispatchEvent(new Event("foundation-homes:intro-done"));
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
        <div ref={logoRef} className="w-[clamp(170px,24vw,290px)]">
          <Image
            src="/foundation-homes/logo.png"
            alt="Foundation Homes"
            width={400}
            height={328}
            priority
            className="w-full h-auto"
          />
        </div>

        {/* Awards row — sits well below the mark so the laurels never crowd it. */}
        <div className="mt-[7vh] md:mt-14 flex flex-wrap items-start justify-center gap-x-6 gap-y-5 max-w-3xl">
          {AWARDS.map((a, i) => (
            <AwardIcon
              key={`${a.mark}-${a.label}-${i}`}
              mark={a.mark}
              body={a.body}
              status={a.status as "Winner" | "Finalist"}
              label={a.label}
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
