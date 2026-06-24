"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { designs } from "@/components/ojpippin/lib/content";

gsap.registerPlugin(ScrollTrigger);

/**
 * Full-bleed lookbook. The design names are scattered across the image and act
 * as the selector — click one and its home fills the frame, with its bed/bath
 * line masking in beneath the name. No other detail.
 */
const cells = [
  "col-start-1 row-start-1 justify-self-start self-start",
  "col-start-3 md:col-start-5 row-start-2 justify-self-end self-start",
  "col-start-1 md:col-start-2 row-start-3 justify-self-start self-end",
  "col-start-2 md:col-start-4 row-start-4 justify-self-end self-end",
  "col-start-3 md:col-start-3 row-start-1 justify-self-end self-start",
  "col-start-1 md:col-start-1 row-start-4 justify-self-start self-end",
];

export default function DesignShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  const select = (i: number) => {
    if (i === active) return;
    setActive(i);
    layers.current.forEach((el, idx) => {
      if (!el) return;
      gsap.to(el, { opacity: idx === i ? 1 : 0, duration: 0.9, ease: "power2.inOut" });
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imgWrapRef.current,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
      gsap.from(".ds-name", {
        opacity: 0,
        y: 18,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: sectionRef.current, start: "top 60%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="designs"
      data-tone="dark"
      className="relative h-screen min-h-[640px] w-full overflow-hidden bg-umber"
    >
      {/* Image stack */}
      <div ref={imgWrapRef} className="absolute inset-0 -top-[8%] h-[116%] will-change-transform">
        {designs.map((design, i) => (
          <div
            key={design.name}
            ref={(el) => {
              layers.current[i] = el;
            }}
            className="absolute inset-0"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            <Image
              src={design.image}
              alt={`The ${design.name}, ${design.facade}`}
              fill
              quality={86}
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      {/* Vignette for name legibility across the frame */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(135% 125% at 50% 45%, rgba(16,11,8,0.14) 0%, rgba(16,11,8,0.52) 100%)",
        }}
      />

      {/* Scattered names — the selector, with generous top/bottom room */}
      <div className="absolute inset-0 z-10 grid grid-cols-3 md:grid-cols-5 grid-rows-4 gap-3 px-5 md:px-12 pt-28 md:pt-36 pb-16 md:pb-24 pointer-events-none">
        {designs.map((design, i) => {
          const on = i === active;
          return (
            <button
              key={design.name}
              onClick={() => select(i)}
              data-cursor-skip
              aria-pressed={on}
              className={`ds-name ${cells[i % cells.length]} pointer-events-auto cursor-pointer text-left`}
              style={{ textShadow: "0 1px 20px rgba(0,0,0,0.5)" }}
            >
              <span
                className={`display font-light leading-none transition-colors duration-300 ${
                  on ? "text-cream" : "text-cream/35 hover:text-cream/70"
                }`}
                style={{ fontSize: "clamp(1.9rem, 5vw, 4.4rem)" }}
              >
                {design.name}
              </span>
              {/* bed/bath masks in when selected */}
              <span
                className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
                  on ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <span className="overflow-hidden">
                  <span className="block eyebrow text-cream/75 whitespace-nowrap">
                    {design.beds} bed · {design.baths} bath · {design.cars} car · {design.size}
                  </span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
