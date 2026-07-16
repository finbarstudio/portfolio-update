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
 * Hero — option 76's arch on white, which then takes the screen.
 *
 *   1. the curtain lifts once the photo has decoded
 *   2. the photo fills INTO the arch from the bottom, like water rising
 *   3. the type staggers up beneath it
 *   4. the page nudges itself on
 *   5. on scroll the arch grows until the photo IS the screen, sliding UNDER
 *      the type, which turns white and becomes the hero copy on the image
 *   6. the photo then holds full bleed on a long parallax drift before the page
 *      moves on
 *
 * How it's built: the resting composition (arch over type) is laid out by a
 * centred column in which the arch's place is held by an invisible SLOT. The
 * real arch is absolutely positioned, synced to that slot on layout, and it is
 * the thing that grows — so the type is never shoved around by it and can be
 * animated on its own. The type sits above the arch in z-order, which is what
 * lets the photo slide in beneath it.
 *
 * Colours live in CSS classes, never the style prop: React owns anything in
 * `style` and would stamp it back over GSAP on a re-render.
 */

const TAGLINE = "Queensland's Premium Pool Builders";
const ARCH_W = "clamp(220px, 38vw, 380px)";
const ARCH_H = "clamp(300px, 52vh, 480px)";
const ARCH_RADIUS = "9999px 9999px 0 0";

const FILL_S = 1.1;
const AUTOSCROLL_AFTER = 2700;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const archRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Cover the arch before first paint, so the water has somewhere to rise from.
  useLayoutEffect(() => {
    const mask = maskRef.current;
    if (!mask) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    gsap.set(mask, { scaleY: 1 });
  }, []);

  // Park the real arch exactly over its slot, and keep it there on resize.
  useLayoutEffect(() => {
    const sticky = stickyRef.current;
    const slot = slotRef.current;
    const arch = archRef.current;
    if (!sticky || !slot || !arch) return;

    const place = () => {
      const s = sticky.getBoundingClientRect();
      const r = slot.getBoundingClientRect();
      gsap.set(arch, {
        top: r.top - s.top,
        left: r.left - s.left,
        width: r.width,
        height: r.height,
        borderRadius: ARCH_RADIUS,
      });
    };
    place();
    const ro = new ResizeObserver(() => {
      // Only re-place before the growth starts; mid-scrub GSAP owns the rect.
      if (window.scrollY < 4) place();
    });
    ro.observe(sticky);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const arch = archRef.current;
    const mask = maskRef.current;
    const scrim = scrimRef.current;
    const text = textRef.current;
    if (!section || !sticky || !arch || !mask || !scrim || !text) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let autoTimer = 0;
    let userMoved = false;
    const markMoved = () => {
      userMoved = true;
      window.clearTimeout(autoTimer);
    };

    const ctx = gsap.context(() => {
      // 5 · the arch grows to take the screen, sliding under the type
      gsap.to(arch, {
        top: 0,
        left: 0,
        width: () => sticky.clientWidth,
        height: () => sticky.clientHeight,
        borderRadius: 0,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "+=100%", scrub: 0.4 },
      });
      // a scrim rises under the type so white copy holds on the photo
      gsap.to(scrim, {
        opacity: 1,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top+=20% top", end: "+=60%", scrub: 0.4 },
      });
      // the type lifts into frame and turns white as the photo arrives
      gsap.to(text, {
        y: "-6vh",
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "+=100%", scrub: 0.4 },
      });
      gsap.to(".qpi-hero-title, .qpi-hero-kicker", {
        color: "#ffffff",
        ease: "none",
        scrollTrigger: { trigger: section, start: "top+=25% top", end: "+=45%", scrub: 0.4 },
      });
    }, section);

    if (reduce) return () => ctx.revert();

    let ran = false;
    const run = () => {
      if (ran) return;
      ran = true;
      // 2 · the water rises into the arch
      gsap.to(mask, { scaleY: 0, duration: FILL_S, ease: "power2.inOut" });
      // 4 · then the page hands itself on, unless the visitor already moved
      autoTimer = window.setTimeout(() => {
        if (userMoved) return;
        const w = window as unknown as {
          __lenis?: { scrollTo: (t: number, o?: { duration?: number }) => void };
        };
        const target = window.innerHeight * 0.85;
        if (w.__lenis) w.__lenis.scrollTo(target, { duration: 2.6 });
        else window.scrollTo({ top: target, behavior: "smooth" });
      }, AUTOSCROLL_AFTER);
    };

    ["wheel", "touchstart", "keydown", "pointerdown"].forEach((e) =>
      window.addEventListener(e, markMoved, { passive: true, once: true }),
    );

    // A promise, not a one-shot event: resolves immediately if the intro has
    // already been and gone (remount, Fast Refresh, StrictMode's second pass).
    let cancelled = false;
    whenIntroDone().then(() => {
      if (!cancelled) run();
    });
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
    <section
      ref={sectionRef}
      id="qpi-hero"
      className="relative w-full"
      style={{ height: "280vh" }}
      aria-label="Introduction"
    >
      <div ref={stickyRef} className="sticky top-0 h-svh w-full overflow-hidden bg-white">
        {/* The arch: absolutely placed onto its slot, and the thing that grows.
            Sits UNDER the type on purpose. */}
        <div ref={archRef} className="absolute overflow-hidden" style={{ zIndex: 0 }}>
          <Parallax amount={22} className="h-full w-full">
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
          {/* The water. Resting state is collapsed in CSS, so the photo shows
              with no JS and React never owns the transform. */}
          <div ref={maskRef} className="qpi-fill-mask absolute inset-0 bg-white" aria-hidden="true" />
        </div>

        {/* Scrim so the white copy holds once the photo is behind it */}
        <div
          ref={scrimRef}
          aria-hidden="true"
          className="absolute inset-0 opacity-0 pointer-events-none"
          style={{
            zIndex: 1,
            background:
              "linear-gradient(to bottom, rgba(9,26,38,0) 35%, rgba(9,26,38,0.42) 75%, rgba(9,26,38,0.55) 100%)",
          }}
        />

        {/* Resting composition: an invisible slot holds the arch's place; the
            type sits beneath it and above the photo. */}
        <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ zIndex: 2 }}>
          <div ref={slotRef} aria-hidden="true" style={{ width: ARCH_W, height: ARCH_H }} />
          <div ref={textRef} className="text-center qpi-gutter" style={{ marginTop: 28, maxWidth: 540 }}>
            <IntroFade delay={1000}>
              <p
                className="qpi-caps qpi-hero-kicker"
                style={{ fontSize: 10, letterSpacing: "0.2em", marginBottom: 14 }}
              >
                QLD Pool Installs
              </p>
            </IntroFade>
            <h1
              className="qpi-display qpi-hero-title text-balance"
              style={{
                fontSize: "clamp(1.625rem, 3.25vw, 2.625rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.015em",
              }}
            >
              <WordReveal text={TAGLINE} delay={1150} stagger={70} />
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
