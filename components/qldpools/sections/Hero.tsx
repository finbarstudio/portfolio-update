"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WordReveal from "@/components/qldpools/WordReveal";
import IntroFade from "@/components/qldpools/IntroFade";
import Parallax from "@/components/qldpools/anim/Parallax";
import { whenIntroDone } from "@/components/qldpools/intro";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero — gallery option 76, "Arch Mask on White", with the sequence Finbar
 * asked for:
 *   1. the preloader's curtain lifts once the photo has decoded
 *   2. the photo fills INTO the arch from the bottom, like water rising
 *   3. the type staggers up beneath it
 *   4. the page scrolls itself a little, to hand the story over
 *   5. as you scroll, the arch grows until it covers the whole screen
 *
 * The section is two viewports tall with a sticky inner, which gives the
 * growth one viewport of scroll to play out against. Everything is scrubbed
 * through the demo's Lenis-synced ScrollTrigger.
 *
 * Reduced motion: no fill, no auto-scroll, image simply present.
 */

const TAGLINE = "Queensland's Premium Pool Builders";
const ARCH_W = "clamp(220px, 38vw, 380px)";
const ARCH_H = "clamp(300px, 52vh, 480px)";
const ARCH_RADIUS = "9999px 9999px 0 0";

const FILL_MS = 1.1;
const AUTOSCROLL_AFTER = 2700;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const archRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Cover the arch before first paint, so the water has somewhere to rise from.
  // Skipped under reduced motion (and if JS never runs) — the photo just shows.
  useLayoutEffect(() => {
    const mask = fillRef.current;
    if (!mask) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    gsap.set(mask, { scaleY: 1 });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const arch = archRef.current;
    const fill = fillRef.current;
    const text = textRef.current;
    if (!section || !arch || !fill || !text) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let autoTimer = 0;
    let userMoved = false;

    // Any real input cancels the courtesy scroll — never fight the user.
    const markMoved = () => {
      userMoved = true;
      window.clearTimeout(autoTimer);
    };

    const ctx = gsap.context(() => {
      // 5 · the arch grows to cover the screen as the hero scrolls
      gsap.to(arch, {
        width: "100vw",
        height: "100svh",
        borderRadius: 0,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "+=100%", scrub: 0.4 },
      });
      // the type gets out of the way early in that growth
      gsap.to(text, {
        opacity: 0,
        y: -24,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "+=30%", scrub: 0.4 },
      });
    }, section);

    if (reduce) return () => ctx.revert();

    // 2 · the photo fills into the arch, then 4 · the page nudges itself on
    let ran = false;
    const run = () => {
      if (ran) return;
      ran = true;
      gsap.to(fill, { scaleY: 0, duration: FILL_MS, ease: "power2.inOut" });
      autoTimer = window.setTimeout(() => {
        if (userMoved) return;
        const w = window as unknown as {
          __lenis?: { scrollTo: (t: number, o?: { duration?: number }) => void };
        };
        const target = window.innerHeight * 0.9;
        if (w.__lenis) w.__lenis.scrollTo(target, { duration: 2.6 });
        else window.scrollTo({ top: target, behavior: "smooth" });
      }, AUTOSCROLL_AFTER);
    };

    ["wheel", "touchstart", "keydown", "pointerdown"].forEach((e) =>
      window.addEventListener(e, markMoved, { passive: true, once: true }),
    );

    // A promise, not an event: if the intro already finished (remount, Fast
    // Refresh, StrictMode's second pass) this resolves immediately instead of
    // waiting on a listener for an event that has already been and gone.
    let cancelled = false;
    whenIntroDone().then(() => {
      if (!cancelled) run();
    });
    // Fail-open: never leave the arch empty.
    const fallback = window.setTimeout(run, 7000);

    return () => {
      cancelled = true;
      ctx.revert();
      window.clearTimeout(autoTimer);
      window.clearTimeout(fallback);
      ["wheel", "touchstart", "keydown", "pointerdown"].forEach((e) =>
        window.removeEventListener(e, markMoved),
      );
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full" style={{ height: "200vh" }} aria-label="Introduction">
      <div className="sticky top-0 h-svh w-full overflow-hidden bg-white flex flex-col items-center justify-center">
        <div
          ref={archRef}
          className="relative shrink-0 overflow-hidden"
          style={{ width: ARCH_W, height: ARCH_H, borderRadius: ARCH_RADIUS }}
        >
          <Parallax amount={12} className="h-full w-full">
            <Image
              src="/qldpools/hero.jpg"
              alt="A pool at dusk, lit from below, looking out over the water"
              fill
              priority
              sizes="100vw"
              quality={90}
              data-qpi-hero
              className="object-cover"
              style={{ objectPosition: "center 40%" }}
            />
          </Parallax>
          {/* The water: a white panel over the photo that collapses upward.
              Its resting state lives in CSS (.qpi-fill-mask, scaleY(0)) so the
              photo shows with no JS, and so React never owns the transform. */}
          <div ref={fillRef} className="qpi-fill-mask absolute inset-0 bg-white" aria-hidden="true" />
        </div>

        <div ref={textRef} className="text-center qpi-gutter" style={{ marginTop: 28, maxWidth: 540 }}>
          <IntroFade delay={1000}>
            <p
              className="qpi-caps"
              style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.2em", marginBottom: 14 }}
            >
              QLD Pool Installs
            </p>
          </IntroFade>
          <h1
            className="qpi-display text-balance"
            style={{
              color: "var(--qpi-ink)",
              fontSize: "clamp(1.625rem, 3.25vw, 2.625rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.015em",
            }}
          >
            <WordReveal text={TAGLINE} delay={1150} stagger={70} />
          </h1>
        </div>
      </div>
    </section>
  );
}
