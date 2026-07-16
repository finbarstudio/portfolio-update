"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "@/components/qldpools/anim/Reveal";
import { SERVICES_INTRO, SERVICES } from "@/app/qldpools/site/sections/kit";

gsap.registerPlugin(ScrollTrigger);

/**
 * Services — ported from options/services.tsx entry 1, "Heading Left, List
 * Right": kicker + heading + sub pinned in a left column, the nine services
 * running down a numbered, hairline-ruled list on the right.
 *
 * Client requests baked in:
 *  1. The heading column is sticky at md+ (top: 96px — nav height + breathing
 *     room) so it stays in view while the long list scrolls past. Off at
 *     mobile widths, where the column stacks normally. The sticky box lives
 *     on an INNER block inside a column that stretches to the row's full
 *     height (grid default align-items: stretch — no `items-start`), so it
 *     has real travel instead of unpinning the moment its own content ends.
 *  2. Both the heading block and the service rows stagger in on scroll via
 *     the shared Reveal primitive.
 *  3. A thin "waterline" beneath the heading draws in left-to-right as the
 *     section enters, then drifts with a slow, cheap (transform-only) sway
 *     that plays only while the section is on screen.
 */
export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const waterlineRef = useRef<SVGSVGElement>(null);
  const drawPathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const waterline = waterlineRef.current;
    const drawPath = drawPathRef.current;
    if (!section || !waterline || !drawPath) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Draw the waterline in, once, as the section enters.
      gsap.set(drawPath, { strokeDashoffset: 1 });
      gsap.to(drawPath, {
        strokeDashoffset: 0,
        duration: 1.3,
        ease: "power2.inOut",
        scrollTrigger: { trigger: section, start: "top 78%", once: true },
      });

      // A slow, cheap sway (transform only) — paused whenever the section
      // is off screen so it never runs for nothing.
      const sway = gsap.to(waterline, {
        x: 8,
        duration: 3.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        paused: true,
      });

      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onEnter: () => sway.play(),
        onEnterBack: () => sway.play(),
        onLeave: () => sway.pause(),
        onLeaveBack: () => sway.pause(),
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-white py-16 md:py-24 qpi-gutter"
      aria-label="Services"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-10 gap-y-10">
        {/* Heading column — stretches to the row's full height (grid default
            align-items: stretch) so the sticky INNER block has real travel */}
        <div className="md:col-span-5">
          <Reveal as="div" className="md:sticky md:top-24">
            <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
              {SERVICES_INTRO.kicker}
            </p>

            <div className="relative mt-4">
              <h2
                className="qpi-display text-balance"
                style={{
                  color: "var(--qpi-ink)",
                  fontSize: "clamp(1.875rem, 3.6vw, 2.875rem)",
                  lineHeight: 1.05,
                }}
              >
                {SERVICES_INTRO.heading}
              </h2>

              {/* Waterline — pool-flavoured touch: draws in on entry, sways gently while in view */}
              <svg
                ref={waterlineRef}
                aria-hidden="true"
                viewBox="0 0 300 20"
                className="mt-4 w-40 md:w-48"
                style={{ height: 14, display: "block", willChange: "transform" }}
              >
                <path
                  d="M0,11 C36,4 72,18 108,11 C144,4 180,18 216,11 C252,4 270,15 300,10"
                  fill="none"
                  stroke="var(--qpi-blue)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity={0.22}
                />
                <path
                  ref={drawPathRef}
                  d="M0,10 C36,17 72,3 108,10 C144,17 180,3 216,10 C252,17 270,6 300,11"
                  fill="none"
                  stroke="var(--qpi-blue)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray={1}
                  style={{ strokeDashoffset: 0 }}
                />
              </svg>
            </div>

            <p
              className="text-pretty mt-4"
              style={{
                color: "var(--qpi-ink)",
                opacity: 0.6,
                fontSize: "0.9375rem",
                lineHeight: 1.6,
                maxWidth: 380,
              }}
            >
              {SERVICES_INTRO.sub}
            </p>
          </Reveal>
        </div>

        {/* Services list — numbered rows, hairline dividers */}
        <div className="md:col-span-7">
          <Reveal as="div" selector=".s-row" stagger={0.06}>
            {SERVICES.map((s, i) => (
              <div
                key={s.title}
                className={`s-row flex items-start gap-5 py-5 md:py-9 border-b border-[var(--qpi-ink)]/15 ${
                  i === 0 ? "border-t" : ""
                }`}
              >
                <span
                  className="qpi-caps flex-shrink-0"
                  style={{ color: "var(--qpi-blue)", fontSize: 11, paddingTop: 3 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "1.0625rem" }}>
                    {s.title}
                  </h3>
                  <p
                    className="text-pretty mt-2"
                    style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.6 }}
                  >
                    {s.body}
                  </p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
