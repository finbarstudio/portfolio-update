"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import WordReveal from "@/components/qldpools/WordReveal";
import IntroFade from "@/components/qldpools/IntroFade";

/**
 * Hero — gallery option 76, "Arch Mask on White": their dusk shot masked into a
 * tall arch on a white ground, with the tagline beneath.
 *
 * Entrance (continuous with the preloader): the image starts FULL BLEED behind
 * the curtain, so the logo cutout reveals the pool and the preloader's zoom
 * lands on it. On `qpi:intro-done` the curtain lifts and the same image shrinks
 * from the viewport down into the arch, then the type staggers up.
 *
 * The shrink is done with a fixed overlay animated onto the in-flow arch's
 * measured rect; once it lands we swap to the in-flow arch (identical pixels,
 * same cached image, so the swap is invisible) and the page can scroll normally.
 */

const HERO_BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAsICAoIBwsKCQoNDAsNERwSEQ8PESIZGhQcKSQrKigkJyctMkA3LTA9MCcnOEw5PUNFSElIKzZPVU5GVEBHSEX/2wBDAQwNDREPESESEiFFLicuRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUX/wAARCAAQABwDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABQb/xAAmEAACAQMDAwQDAAAAAAAAAAABAgMABBEFEiEGIjETFFFSYaHB/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAED/8QAHhEAAQQBBQAAAAAAAAAAAAAAAQADBBECEhMUMUH/2gAMAwEAAhEDEQA/ACumdAd41aRohG657htdT8GqOXpUbSyvHjH2FQ9jOmnkL6zT4GNp8D+0sNX9yuxraEoeMMuaaX/CKTmRRhZtH6vJaWU7QIwmlBAwhyPzz4oR7e7LFtjgNyAWAquGmRvbPLFbcovakQwP1QR1EISrRgEcdw5qubw6WMeTGesmwv/Z";

const TAGLINE = "Queensland's Premium Pool Builders";
const ARCH_W = "clamp(220px, 38vw, 380px)";
const ARCH_H = "clamp(300px, 52vh, 480px)";
const ARCH_RADIUS = "9999px 9999px 0 0";
const LAND_MS = 1150;

export default function Hero() {
  const archRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [landed, setLanded] = useState(false);

  useEffect(() => {
    const arch = archRef.current;
    const overlay = overlayRef.current;
    if (!arch || !overlay) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let settle = 0;

    const land = () => {
      if (reduce) {
        setLanded(true);
        return;
      }
      // Measure the arch's resting rect (it's laid out already, just invisible)
      const r = arch.getBoundingClientRect();
      requestAnimationFrame(() => {
        const ease = "cubic-bezier(0.65, 0, 0.35, 1)";
        overlay.style.transition = [
          `top ${LAND_MS}ms ${ease}`,
          `left ${LAND_MS}ms ${ease}`,
          `width ${LAND_MS}ms ${ease}`,
          `height ${LAND_MS}ms ${ease}`,
          `border-radius ${LAND_MS}ms ${ease}`,
        ].join(", ");
        overlay.style.top = `${r.top}px`;
        overlay.style.left = `${r.left}px`;
        overlay.style.width = `${r.width}px`;
        overlay.style.height = `${r.height}px`;
        overlay.style.borderRadius = ARCH_RADIUS;
      });
      // Hand over to the in-flow arch once the geometry matches.
      settle = window.setTimeout(() => setLanded(true), LAND_MS + 60);
    };

    const w = window as unknown as { __qpiPreloaderLifted?: boolean };
    if (w.__qpiPreloaderLifted) {
      land();
      return () => window.clearTimeout(settle);
    }
    window.addEventListener("qpi:intro-done", land, { once: true });
    // Fail-open: never leave the hero stuck full bleed.
    const fallback = window.setTimeout(land, 7000);
    return () => {
      window.removeEventListener("qpi:intro-done", land);
      window.clearTimeout(fallback);
      window.clearTimeout(settle);
    };
  }, []);

  return (
    <section
      className="relative min-h-svh w-full bg-white flex flex-col items-center justify-center px-6 py-20"
      aria-label="Introduction"
    >
      {/* The arch in its resting place. Invisible until the overlay lands on it. */}
      <div
        ref={archRef}
        className="relative shrink-0 overflow-hidden"
        style={{
          width: ARCH_W,
          height: ARCH_H,
          borderRadius: ARCH_RADIUS,
          opacity: landed ? 1 : 0,
        }}
      >
        <Image
          src="/qldpools/hero.jpg"
          alt="A pool at dusk, lit from below, looking out over the water"
          fill
          sizes="100vw"
          quality={90}
          className="object-cover"
          style={{ objectPosition: "center 40%" }}
        />
      </div>

      {/* Type beneath the arch */}
      <div className="text-center px-8" style={{ marginTop: 28, maxWidth: 540 }}>
        <IntroFade delay={1150}>
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
          <WordReveal text={TAGLINE} delay={1280} stagger={70} />
        </h1>
      </div>

      {/* Full-bleed overlay: what the preloader's cutout reveals, and what
          shrinks into the arch once the curtain lifts. */}
      {!landed && (
        <div
          ref={overlayRef}
          aria-hidden="true"
          className="overflow-hidden"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            borderRadius: 0,
            zIndex: 5,
            backgroundImage: `url(${HERO_BLUR})`,
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
          }}
        >
          <Image
            src="/qldpools/hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            quality={90}
            data-qpi-hero
            className="object-cover"
            style={{ objectPosition: "center 40%" }}
          />
        </div>
      )}
    </section>
  );
}
