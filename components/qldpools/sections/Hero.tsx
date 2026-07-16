"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WordReveal from "@/components/qldpools/WordReveal";
import { markIntroDone } from "@/components/qldpools/intro";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero — option 76's arch on white, which then takes the screen.
 *
 * No preloader. The page just arrives and staggers itself in: the photo fills
 * INTO the arch from the bottom like water rising, then the tagline follows.
 * We call markIntroDone() ourselves once the fonts are ready, which is the
 * signal the nav and the word reveals were already waiting on.
 *
 * On scroll the arch grows until the photo is the screen. Two deliberate
 * details Finbar asked for:
 *  - it eases OUT, so the last stretch into full bleed is the slow part
 *  - the corner radius never resolves to 0. It lands at 4rem, so the page keeps
 *    a softly rounded top edge for good.
 * The type sits above the photo in z-order (the arch slides under it), settles
 * centred on the image, then drifts against the photo as you keep going.
 *
 * Built by holding the arch's resting place with an invisible SLOT and
 * animating the real arch, absolutely placed, on top of it — so the type is
 * never shoved around by the growth and can be animated on its own.
 *
 * Colours live in CSS classes, never the style prop: React owns anything in
 * `style` and would stamp it back over GSAP on a re-render.
 */

const TAGLINE = "Queensland's Premium Pool Builders";
const ARCH_W = "clamp(220px, 38vw, 380px)";
const ARCH_H = "clamp(300px, 52vh, 480px)";
const ARCH_RADIUS = "9999px 9999px 0 0";
/** Where the growth stops. Apple-ish. The page keeps this rounded top for good. */
const END_RADIUS = "4rem 4rem 0 0";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const archRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Cover the arch before first paint so the water has somewhere to rise from.
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
      // Never write a measurement taken before layout has settled. A single bad
      // read here sticks for good (the arch is absolutely placed from it), and
      // a 0-sized first measure is exactly what a 0x0 viewport hands you.
      if (r.width < 1 || r.height < 1) return;
      gsap.set(arch, {
        top: r.top - s.top,
        left: r.left - s.left,
        width: r.width,
        height: r.height,
        borderRadius: ARCH_RADIUS,
      });
    };
    place();
    // Fonts can reflow the type under the arch, which moves the slot.
    document.fonts?.ready.then(() => {
      if (window.scrollY < 4) place();
    }).catch(() => {});
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
    const img = imgRef.current;
    const mask = maskRef.current;
    const scrim = scrimRef.current;
    const text = textRef.current;
    if (!section || !sticky || !arch || !img || !mask || !scrim || !text) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // How far the type has to travel to sit centred on the photo. Measured,
      // not guessed, because the arch and type are both clamp()-sized.
      const centreShift = () => {
        const s = sticky.getBoundingClientRect();
        const t = text.getBoundingClientRect();
        return s.top + s.height / 2 - (t.top + t.height / 2);
      };

      // The growth. `ease: power2.out` is the "slower as it reaches full bleed"
      // Finbar asked for: it covers most of the distance early, then eases in.
      gsap.to(arch, {
        top: 0,
        left: 0,
        width: () => sticky.clientWidth,
        height: () => sticky.clientHeight,
        borderRadius: END_RADIUS,
        ease: "power2.out",
        scrollTrigger: { trigger: section, start: "top top", end: "+=110%", scrub: 0.5 },
      });
      // Scrim rises under the type so white copy holds on the photo.
      gsap.to(scrim, {
        opacity: 1,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top+=15% top", end: "+=55%", scrub: 0.5 },
      });
      // The type settles centred on the image as the photo arrives...
      gsap.to(text, {
        y: centreShift,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=110%",
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });
      gsap.to(".qpi-hero-title", {
        color: "#ffffff",
        ease: "none",
        scrollTrigger: { trigger: section, start: "top+=20% top", end: "+=40%", scrub: 0.5 },
      });
      // ...then keeps drifting against the photo for the rest of the hero.
      gsap.to(text, {
        yPercent: -55,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top+=110% top", end: "bottom bottom", scrub: 0.5 },
      });
      // The photo is oversized and drifts the other way, so there is more of the
      // picture to see than the frame ever shows at once.
      gsap.fromTo(
        img,
        { yPercent: -12 },
        {
          yPercent: 6,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 0.5 },
        },
      );
    }, section);

    if (reduce) {
      markIntroDone();
      return () => ctx.revert();
    }

    // No curtain: the intro is just the fill, then the type. Wait for fonts so
    // the words do not stagger in and then reflow.
    let cancelled = false;
    const start = () => {
      if (cancelled) return;
      gsap.to(mask, { scaleY: 0, duration: 1.05, ease: "power2.inOut" });
      markIntroDone();
    };
    const fonts = document.fonts?.ready;
    if (fonts) fonts.then(start).catch(start);
    else requestAnimationFrame(start);
    const failsafe = window.setTimeout(start, 2500);

    return () => {
      cancelled = true;
      ctx.revert();
      window.clearTimeout(failsafe);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="qpi-hero"
      className="relative w-full"
      style={{ height: "300vh" }}
      aria-label="Introduction"
    >
      <div ref={stickyRef} className="sticky top-0 h-svh w-full overflow-hidden bg-white">
        {/* The arch: absolutely placed on its slot, and the thing that grows.
            Sits UNDER the type on purpose. */}
        <div ref={archRef} className="absolute overflow-hidden" style={{ zIndex: 0 }}>
          {/* Oversized so the parallax always has picture to give. */}
          <div ref={imgRef} className="absolute inset-x-0" style={{ top: "-14%", height: "128%" }}>
            <Image
              src="/qldpools/hero.jpg"
              alt="A pool at dusk, lit from below, looking out over the water"
              fill
              priority
              sizes="100vw"
              quality={90}
              data-qpi-hero
              className="object-cover"
              style={{ objectPosition: "center 45%" }}
            />
          </div>
          {/* The water. Collapsed in CSS at rest, so the photo shows with no JS
              and React never owns the transform. */}
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
              "linear-gradient(to bottom, rgba(9,26,38,0) 30%, rgba(9,26,38,0.34) 70%, rgba(9,26,38,0.5) 100%)",
          }}
        />

        {/* Resting composition: an invisible slot holds the arch's place; the
            tagline sits beneath it and above the photo. */}
        <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ zIndex: 2 }}>
          <div ref={slotRef} aria-hidden="true" style={{ width: ARCH_W, height: ARCH_H }} />
          <div ref={textRef} className="text-center qpi-gutter" style={{ marginTop: 28, maxWidth: 540 }}>
            <h1
              className="qpi-display qpi-hero-title text-balance"
              style={{
                fontSize: "clamp(1.625rem, 3.25vw, 2.625rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.015em",
              }}
            >
              <WordReveal text={TAGLINE} delay={260} stagger={70} />
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
