"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AwardIcon from "@/components/ross-hogno/AwardIcon";

gsap.registerPlugin(ScrollTrigger);

// Real Master Builders Queensland awards (Downs & Western region).
const AWARDS = [
  { mark: "25", body: "MBA", status: "Winner", label: "Best Use of Sloping Sites" },
  { mark: "14", body: "MBA", status: "Winner", label: "Renovation $276–575K" },
  { mark: "12", body: "MBA", status: "Winner", label: "Excellence in Sustainable Living" },
  { mark: "11", body: "MBA", status: "Winner", label: "Sloping Sites to $400K" },
  { mark: "10", body: "MBA", status: "Winner", label: "Renovation Over $401K" },
  { mark: "09", body: "MBA", status: "Winner", label: "Individual Home $550–700K" },
];

export default function HomeHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        wordmarkRef.current,
        { opacity: 0, yPercent: -18 },
        { opacity: 1, yPercent: 0, duration: 1.6, ease: "power3.out" }
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
      window.dispatchEvent(new Event("ross-hogno:intro-done"));
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
        <div ref={wordmarkRef} className="flex flex-col items-center">
          <h1
            className="violet text-[var(--ink)] text-center whitespace-nowrap leading-none"
            style={{ fontSize: "clamp(2.5rem, 9vw, 8rem)", letterSpacing: "0.06em", fontWeight: 600 }}
          >
            ROSS&nbsp;HOGNO
          </h1>
          <p
            className="violet mt-4 text-[var(--accent)]"
            style={{ fontSize: "clamp(0.6rem, 1.1vw, 0.8rem)", letterSpacing: "0.42em" }}
          >
            STYLE · INNOVATION · QUALITY
          </p>
        </div>

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
