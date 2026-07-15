"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { heritage } from "@/components/ojpippin/lib/content";

gsap.registerPlugin(ScrollTrigger);

// Module-level so a back-navigation remount skips the preloader. Plays once per
// page load; a hard reload re-runs the module and replays it.
let introPlayed = false;

export default function HeroIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const preBgRef = useRef<HTMLDivElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const logoBtnRef = useRef<HTMLButtonElement>(null);
  const ojRef = useRef<HTMLSpanElement>(null);
  const pippinRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = logoWrapRef.current!;
    const btn = logoBtnRef.current!;
    const oj = ojRef.current!;
    const pippin = pippinRef.current!;

    let tl: gsap.core.Timeline | null = null;

    const compute = () => {
      const isMobile = window.innerWidth < 768;
      const pad = isMobile ? 24 : 40;
      const navCenterY = isMobile ? 32 : 40; // half of nav height (h-16 / h-20)
      gsap.set([oj, pippin], { x: 0 });
      gsap.set(wrap, { y: 0, scale: 1, transformOrigin: "center center" });
      const half = btn.getBoundingClientRect().height / 2;
      const heroPx = parseFloat(getComputedStyle(btn).fontSize);
      const ojR = oj.getBoundingClientRect();
      const piR = pippin.getBoundingClientRect();
      return {
        startY: window.innerHeight / 2 - half,
        endY: navCenterY - half,
        navScale: 15 / heroPx,
        ojX: pad - ojR.left,
        piX: window.innerWidth - pad - piR.right,
      };
    };

    // Repeat visit (back to home, from contact): skip the preloader entirely.
    const runSkip = () => {
      const p = compute();
      gsap.set(wrap, { y: p.endY, scale: p.navScale, autoAlpha: 1 });
      gsap.set([oj, pippin], { x: 0 });
      gsap.set(".hero-line", { yPercent: 0 });
      gsap.set(".hero-meta", { yPercent: 0 });
      gsap.set(clipRef.current, { clipPath: "inset(0% 0% 0% 0%)" });
      gsap.set(preBgRef.current, { autoAlpha: 0 });
      window.dispatchEvent(new Event("ojp:intro-done"));
    };

    // First load: the full converge → reveal → dock sequence.
    const runFull = () => {
      const p = compute();
      // Position the logo, THEN reveal it — kills the first-frame jump.
      gsap.set(wrap, { y: p.startY, autoAlpha: 1 });
      gsap.set(oj, { x: p.ojX });
      gsap.set(pippin, { x: p.piX });
      gsap.set(".hero-line", { yPercent: 120 });
      gsap.set(".hero-meta", { yPercent: 120 });
      gsap.set(clipRef.current, { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(preBgRef.current, { autoAlpha: 1 });

      tl = gsap.timeline({ onComplete: () => { introPlayed = true; } });
      tl.to([oj, pippin], { x: 0, duration: 1.25, ease: "power3.inOut" }, 0.3)
        .to({}, { duration: 0.45 })
        .to(preBgRef.current, { autoAlpha: 0, duration: 0.9, ease: "power2.inOut" }, 2.0)
        .to(clipRef.current, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "power3.inOut" }, 2.0)
        .to(wrap, { y: p.endY, scale: p.navScale, duration: 1.2, ease: "power3.inOut" }, 2.3)
        .to(".hero-line", { yPercent: 0, duration: 1.0, stagger: 0.14, ease: "power4.out" }, 2.65)
        .to(".hero-meta", { yPercent: 0, duration: 0.95, stagger: 0.12, ease: "power4.out" }, 2.8)
        .add(() => window.dispatchEvent(new Event("ojp:intro-done")), 2.55);
    };

    const go = () => (introPlayed ? runSkip() : runFull());

    const ctx = gsap.context(() => {
      if (document.fonts?.ready) document.fonts.ready.then(go);
      else go();

      // Parallax drift (always on)
      gsap.to(imgRef.current, {
        yPercent: 14,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true },
      });
    });

    // Safety: if anything stalls, force the logo + page visible
    const safety = window.setTimeout(() => {
      gsap.set(logoWrapRef.current, { autoAlpha: 1 });
      window.dispatchEvent(new Event("ojp:intro-done"));
    }, 6500);

    return () => {
      ctx.revert();
      tl?.kill();
      window.clearTimeout(safety);
    };
  }, []);

  const toTop = () => {
    if (typeof window !== "undefined" && window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.6 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <section ref={sectionRef} data-tone="dark" className="relative h-screen min-h-[640px] w-full overflow-hidden bg-umber">
        <div ref={clipRef} className="absolute inset-0">
          <div ref={imgRef} className="absolute inset-0 -top-[8%] h-[116%] will-change-transform">
            <Image
              src="/oj-pippin/homes/facade-hero.jpg"
              alt="An OJ Pippin home, Brisbane"
              fill
              priority
              quality={88}
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(140% 100% at 0% 100%, rgba(14,10,7,0.92) 0%, rgba(14,10,7,0.32) 38%, rgba(14,10,7,0) 58%), radial-gradient(110% 80% at 100% 100%, rgba(14,10,7,0.62) 0%, rgba(14,10,7,0) 48%), linear-gradient(to bottom, rgba(14,10,7,0.75) 0%, rgba(14,10,7,0.34) 7%, rgba(14,10,7,0) 17%, rgba(14,10,7,0) 60%, rgba(14,10,7,0.48) 100%)",
            }}
          />
        </div>

        {/* Headline, bottom (centre on mobile, right on desktop) */}
        <div className="absolute z-10 bottom-10 left-6 right-6 text-center md:bottom-14 md:left-auto md:right-10 md:text-right">
          <h1 className="text-cream font-light leading-[1.08]" style={{ fontSize: "clamp(2.3rem, 5.6vw, 5.2rem)" }}>
            <span className="block overflow-hidden">
              <span className="hero-line block">Homes built around</span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-line block display-italic">the way you live.</span>
            </span>
          </h1>
        </div>

        {/* Heritage: top-centre on mobile, bottom-left on desktop */}
        <div className="absolute left-6 right-6 md:left-10 md:right-auto z-10 max-w-none md:max-w-[20rem] top-[5.75rem] md:top-auto md:bottom-14 text-center md:text-left">
          <span className="block overflow-hidden mb-3 md:mb-4">
            <span className="hero-meta block text-cream/80 text-[11px] font-semibold tracking-[0.3em] uppercase">
              {heritage.since}
            </span>
          </span>
          <span className="block overflow-hidden">
            <span
              className="hero-meta block text-cream font-light leading-[0.92] pb-[0.04em]"
              style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "clamp(3.4rem, 7vw, 5.4rem)" }}
            >
              {heritage.year}
            </span>
          </span>
          <span className="hidden md:block overflow-hidden mt-5 max-w-[17rem]">
            <span className="hero-meta block text-cream/75 text-sm leading-relaxed pb-[0.15em]">
              {heritage.line}
            </span>
          </span>
        </div>
      </section>

      {/* Preloader background, fades to reveal the hero */}
      <div ref={preBgRef} className="fixed inset-0 z-[60] bg-umber" aria-hidden />

      {/* Travelling wordmark, converges, then docks into the nav and stays */}
      <div
        ref={logoWrapRef}
        className="fixed left-0 right-0 top-0 z-[70] flex justify-center pointer-events-none"
        style={{ opacity: 0 }}
      >
        <button
          ref={logoBtnRef}
          onClick={toTop}
          aria-label="OJ Pippin, back to top"
          className="wordmark nav-tinted whitespace-nowrap leading-none pointer-events-auto inline-flex"
          style={{ fontSize: "clamp(1.5rem, 3.4vw, 2.1rem)" }}
        >
          <span ref={ojRef}>OJ</span>
          <span>&nbsp;</span>
          <span ref={pippinRef}>PIPPIN</span>
        </button>
      </div>
    </>
  );
}
