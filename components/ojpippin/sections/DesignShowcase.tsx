"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { designs } from "@/components/ojpippin/lib/content";

gsap.registerPlugin(ScrollTrigger);

/**
 * A full-bleed lookbook. One design fills the frame; a vertical index switches
 * between them with a soft crossfade. The signature "browse the range" moment.
 */
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
      gsap.to(el, {
        opacity: idx === i ? 1 : 0,
        duration: 0.9,
        ease: "power2.inOut",
      });
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
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
      gsap.from(".ds-detail", {
        y: 24,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: sectionRef.current, start: "top 55%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const d = designs[active];

  return (
    <section
      ref={sectionRef}
      id="designs"
      data-cursor="View Design"
      data-tone="dark"
      className="relative h-screen min-h-[620px] w-full overflow-hidden bg-umber cursor-none"
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

      {/* Legibility gradients */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(28,22,16,0.30) 0%, rgba(28,22,16,0) 30%, rgba(28,22,16,0.20) 55%, rgba(28,22,16,0.78) 100%)",
        }}
      />

      {/* Section label, top left */}
      <div className="ds-detail absolute top-0 left-0 px-5 md:px-10 pt-20 md:pt-24 z-10">
        <p className="eyebrow text-clay-soft">The Range</p>
      </div>

      {/* Counter, top right */}
      <div className="ds-detail absolute top-0 right-0 px-5 md:px-10 pt-20 md:pt-24 z-10">
        <p className="eyebrow text-cream/60 tabular-nums">
          {String(active + 1).padStart(2, "0")} / {String(designs.length).padStart(2, "0")}
        </p>
      </div>

      {/* Detail, bottom left */}
      <div className="absolute bottom-0 left-0 z-10 px-5 md:px-10 pb-10 md:pb-14 max-w-xl pointer-events-none">
        <h2
          className="ds-detail text-cream font-light leading-none"
          style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}
        >
          {d.name}
        </h2>
        <p className="ds-detail eyebrow text-cream/75 mt-5">
          {d.facade} · {d.beds} bed · {d.baths} bath · {d.cars} car · {d.size}
        </p>
        <p className="ds-detail text-cream/70 text-sm md:text-base font-normal leading-relaxed mt-4 max-w-md">
          {d.note}
        </p>
      </div>

      {/* Index, right side (desktop) */}
      <div className="hidden md:flex absolute bottom-14 right-10 z-10 flex-col items-end gap-3 pointer-events-auto">
        {designs.map((design, i) => (
          <button
            key={design.name}
            onClick={() => select(i)}
            data-cursor-skip
            className={`wordmark text-base tracking-[0.16em] cursor-pointer transition-colors ${
              i === active ? "text-clay-soft" : "text-cream/45 hover:text-cream"
            }`}
          >
            {design.name}
          </button>
        ))}
      </div>

      {/* Thumbs, bottom (mobile) */}
      <div className="md:hidden absolute bottom-4 right-4 z-10 flex gap-2 pointer-events-auto">
        {designs.map((design, i) => (
          <button
            key={design.name}
            onClick={() => select(i)}
            aria-label={`View the ${design.name}`}
            className={`relative w-14 h-10 overflow-hidden transition-all ${
              i === active ? "ring-2 ring-clay-soft" : "ring-1 ring-cream/40"
            }`}
          >
            <Image src={design.image} alt="" fill quality={40} className="object-cover" sizes="56px" />
          </button>
        ))}
      </div>
    </section>
  );
}
