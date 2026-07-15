"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AwardIcon from "@/components/david-radic/AwardIcon";

gsap.registerPlugin(ScrollTrigger);

// Real HIA Gold Coast & Northern Rivers recognition.
const AWARDS = [
  { mark: "25", body: "HIA", status: "Finalist", label: "Home of the Year" },
  { mark: "24", body: "HIA", status: "Finalist", label: "Custom Home Over $2M" },
  { mark: "16", body: "HIA", status: "Winner", label: "Housing Award" },
];

export default function HomeHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        logoRef.current,
        { opacity: 0, yPercent: -18, scale: 0.96 },
        { opacity: 1, yPercent: 0, scale: 1, duration: 1.6, ease: "power3.out" }
      );
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
      window.dispatchEvent(new Event("david-radic:intro-done"));
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
        <div ref={logoRef} className="w-[clamp(200px,30vw,340px)]">
          <Image
            src="/david-radic/logo.png"
            alt="David Radic Prestige Homes"
            width={225}
            height={55}
            priority
            className="w-full h-auto"
          />
        </div>

        <div className="mt-[7vh] md:mt-14 flex flex-wrap items-start justify-center gap-x-7 gap-y-5 max-w-2xl">
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
