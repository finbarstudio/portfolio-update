"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { pillars } from "@/components/ojpippin/lib/content";

gsap.registerPlugin(ScrollTrigger);

/* Scattered Swiss-poster placement, each pillar lands in a deliberate cell on a
   5-column grid, with empty cells and varied top/bottom alignment so the five
   read as a composition, not a list. Deliberately distinct from Process, which
   is a sticky-heading vertical sequence; this one is a scattered grid. */
const placement = [
  "md:col-start-1 md:col-span-2 md:self-start",
  "md:col-start-4 md:col-span-2 md:self-end md:mt-28",
  "md:col-start-2 md:col-span-2 md:self-start",
  "md:col-start-5 md:col-span-1 md:self-end md:mt-16",
  "md:col-start-1 md:col-span-2 md:self-end md:mb-2",
];

export default function WhyUs() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".w-line", {
        y: 32,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ref.current, start: "top 70%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="why"
      ref={ref}
      className="min-h-screen flex flex-col justify-center bg-bone-2 px-8 md:px-16 lg:px-24 py-24 md:py-32"
    >
      <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-x-8 gap-y-16 md:gap-y-28">
        {/* Heading, wide, anchors the top-left corner of the poster.
            No eyebrow: the h2 is the section's identifier. */}
        <h2
          className="w-line md:col-start-1 md:col-span-3 md:self-start text-ink font-light leading-[1.0]"
          style={{ fontSize: "clamp(2.6rem, 6vw, 5.5rem)" }}
        >
          Why families
          <br />
          <span className="display-italic">choose</span> us.
        </h2>

        {pillars.map((pillar, i) => (
          <div
            key={pillar.title}
            className={`w-line group flex flex-col gap-4 ${placement[i]}`}
          >
            <h3
              className="text-ink font-light leading-[1.05] transition-colors duration-500 ease-out group-hover:text-clay"
              style={{ fontSize: "clamp(1.5rem, 2.4vw, 2.1rem)" }}
            >
              {pillar.title}
            </h3>
            <p className="text-ink-soft leading-relaxed max-w-xs">
              {pillar.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
