"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AwardIcon from "@/components/lindon/AwardIcon";

gsap.registerPlugin(ScrollTrigger);

const AWARDS = [
  { mark: "23", body: "HIA", status: "Winner", label: "Home of the Year" },
  { mark: "23", body: "HIA", status: "Winner", label: "Custom Home" },
  { mark: "23", body: "HIA", status: "Winner", label: "Reno $3M+" },
  { mark: "23", body: "HIA", status: "Winner", label: "Apprentice" },
  { mark: "21", body: "HIA", status: "Winner", label: "$1–2M" },
  { mark: "20", body: "HIA", status: "Finalist", label: "$750K–1M" },
  { mark: "18", body: "HIA", status: "Finalist", label: "$750K–1M" },
  { mark: "18", body: "HIA", status: "Finalist", label: "$1–2M" },
  { mark: "16", body: "HIA", status: "Finalist", label: "$1–2M" },
];

const NAV_TARGET_PX = 13;
const NAV_CENTER_Y = 31;

export default function HomeHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const placeholderRef = useRef<HTMLHeadingElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLButtonElement>(null);
  const navLogoRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current!;
    const placeholder = placeholderRef.current!;
    const logo = logoRef.current!;
    let scrollTween: gsap.core.Tween | null = null;

    const buildTravel = () => {
      scrollTween?.scrollTrigger?.kill();
      scrollTween?.kill();
      const rect = placeholder.getBoundingClientRect();
      const heroPx = parseFloat(getComputedStyle(logo).fontSize);
      const navScale = NAV_TARGET_PX / heroPx;
      const half = heroPx / 2;
      const startY = rect.top + rect.height / 2 - half;
      const endY = NAV_CENTER_Y - half;
      gsap.set(wrap, { y: startY, scale: 1, transformOrigin: "center center" });
      scrollTween = gsap.to(wrap, {
        y: endY,
        scale: navScale,
        ease: "none",
        scrollTrigger: { trigger: headerRef.current, start: "top top", end: "60% top", scrub: true },
      });
    };

    const ctx = gsap.context(() => {
      // Falloff (both breakpoints): laurel section scales + fades as projects
      // scroll up over the sticky header.
      gsap.to(contentRef.current, {
        scale: 0.3,
        yPercent: 10,
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

      const mm = gsap.matchMedia();

      // DESKTOP — the logo travels into the nav.
      mm.add("(min-width: 768px)", () => {
        // Position the travelling logo's wrapper at its centred start spot
        // BEFORE the fade-in. On a cold load the fade used to begin while the
        // fixed wrapper was still at top:0 (fonts not yet ready), so the logo
        // flashed in too high and then dropped. Setting it now avoids that;
        // the fonts.ready pass below re-measures once the real font is in.
        buildTravel();
        gsap.fromTo(
          logo,
          { opacity: 0, yPercent: -35, scale: 0.92 },
          { opacity: 1, yPercent: 0, scale: 1, duration: 2.0, ease: "power3.out" }
        );
        const ready = () => {
          buildTravel();
          ScrollTrigger.refresh();
        };
        if (document.fonts?.ready) document.fonts.ready.then(ready);
        else requestAnimationFrame(ready);
        const onResize = () => buildTravel();
        window.addEventListener("resize", onResize);
        return () => {
          window.removeEventListener("resize", onResize);
          scrollTween?.scrollTrigger?.kill();
          scrollTween?.kill();
        };
      });

      // MOBILE — no travel. The in-flow wordmark fades with the section; a nav
      // logo softly fades in once the hero logo scrolls out of view.
      mm.add("(max-width: 767px)", () => {
        gsap.fromTo(
          placeholder,
          { opacity: 0, yPercent: -20 },
          { opacity: 1, yPercent: 0, duration: 1.6, ease: "power3.out" }
        );
        gsap.set(navLogoRef.current, { opacity: 0 });
        gsap.to(navLogoRef.current, {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "42% top",
            end: "68% top",
            scrub: true,
          },
        });
      });
    }, headerRef);

    const introTotal = 1.6 + (AWARDS.length - 1) * 0.08 + 1.4 + 0.7;
    const t = gsap.delayedCall(introTotal, () => {
      window.dispatchEvent(new Event("lindon:intro-done"));
    });

    return () => {
      scrollTween?.scrollTrigger?.kill();
      scrollTween?.kill();
      t.kill();
      ctx.revert();
    };
  }, []);

  const toTop = () => {
    if (typeof window !== "undefined" && window.__lenis) {
      window.__lenis.scrollTo(0, {
        duration: 2.4,
        easing: (t: number) =>
          t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2,
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const wordmarkStyle = {
    fontSize: "clamp(2.25rem, 7vw, 7rem)",
    letterSpacing: "0.08em",
    fontWeight: 400,
  } as const;

  return (
    <>
      <header
        id="home-header"
        ref={headerRef}
        className="sticky top-0 h-[80vh] min-h-[560px] w-full flex flex-col items-center justify-center px-8 overflow-hidden"
      >
        <div ref={contentRef} className="flex flex-col items-center will-change-transform w-full">
          {/* Wordmark — hidden placeholder on desktop (travel logo overlays it);
              the visible hero logo on mobile. */}
          <h1
            ref={placeholderRef}
            className="violet text-[var(--ink)] text-center whitespace-nowrap leading-none md:invisible"
            style={wordmarkStyle}
          >
            LINDON&nbsp;HOMES
          </h1>

          {/* Awards row — pushed lower on mobile so it centres in the white space */}
          <div className="mt-[11vh] md:mt-6 flex flex-wrap items-start justify-center gap-x-5 gap-y-5 max-w-4xl">
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

      {/* Desktop — the travelling logo (hidden on mobile) */}
      <div
        ref={wrapRef}
        className="hidden md:flex fixed top-0 left-0 right-0 z-[60] justify-center pointer-events-none"
      >
        <button
          ref={logoRef}
          onClick={toTop}
          aria-label="Lindon Homes — back to top"
          className="violet text-[var(--ink)] text-center whitespace-nowrap leading-none pointer-events-auto cursor-pointer"
          style={{ ...wordmarkStyle, opacity: 0 }}
        >
          LINDON&nbsp;HOMES
        </button>
      </div>

      {/* Mobile — nav logo that softly fades in (no travel) */}
      <button
        ref={navLogoRef}
        onClick={toTop}
        aria-label="Lindon Homes — back to top"
        className="md:hidden fixed top-0 left-0 h-14 z-[55] flex items-center justify-start pl-5 violet text-[var(--ink)] text-sm tracking-[0.18em] whitespace-nowrap pointer-events-none"
        style={{ opacity: 0 }}
      >
        LINDON&nbsp;HOMES
      </button>
    </>
  );
}
