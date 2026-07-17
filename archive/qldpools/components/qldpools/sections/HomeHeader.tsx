"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StatChip from "@/components/qldpools/StatChip";

gsap.registerPlugin(ScrollTrigger);

// Real credentials pulled from the client's own site — nothing invented.
const STATS = [
  { value: "2,500+", label: "Pools installed" },
  { value: "20+ yrs", label: "Experience" },
  { value: "5★", label: "Google reviews" },
  { value: "QBCC", label: "Licence #15377435" },
  { value: "Insured", label: "AS 1926 compliant" },
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
      // Falloff (both breakpoints): stats section scales + fades as the pools
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
        // BEFORE the fade-in (see the Lindon build this is ported from —
        // avoids the cold-load flash while fonts settle).
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

    const introTotal = 1.6 + (STATS.length - 1) * 0.08 + 1.4 + 0.7;
    const t = gsap.delayedCall(introTotal, () => {
      window.dispatchEvent(new Event("qpi:intro-done"));
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
    fontSize: "clamp(1.7rem, 5.4vw, 5.4rem)",
    letterSpacing: "0.06em",
    fontWeight: 700,
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
            className="qpi-display text-[var(--qpi-ink)] text-center whitespace-nowrap leading-none md:invisible"
            style={wordmarkStyle}
          >
            QLD&nbsp;POOL&nbsp;INSTALLS
          </h1>

          {/* Credentials row — pushed well below the wordmark (Lindon's award
              laurels, reskinned as their real numbers). */}
          <div className="mt-[11vh] md:mt-24 flex flex-wrap items-start justify-center gap-x-4 gap-y-5 max-w-4xl">
            {STATS.map((s, i) => (
              <StatChip key={s.label} value={s.value} label={s.label} delay={1.6 + i * 0.08} />
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
          aria-label="QLD Pool Installs, back to top"
          className="qpi-display text-[var(--qpi-ink)] text-center whitespace-nowrap leading-none pointer-events-auto cursor-pointer"
          style={{ ...wordmarkStyle, opacity: 0 }}
        >
          QLD&nbsp;POOL&nbsp;INSTALLS
        </button>
      </div>

      {/* Mobile — nav logo that softly fades in (no travel) */}
      <button
        ref={navLogoRef}
        onClick={toTop}
        aria-label="QLD Pool Installs, back to top"
        className="md:hidden fixed top-0 left-0 h-14 z-[55] flex items-center justify-start pl-5 qpi-display text-[var(--qpi-ink)] text-sm tracking-[0.14em] whitespace-nowrap pointer-events-none"
        style={{ opacity: 0 }}
      >
        QLD&nbsp;POOL&nbsp;INSTALLS
      </button>
    </>
  );
}
