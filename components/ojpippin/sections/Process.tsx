"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { process } from "@/components/ojpippin/lib/content";

gsap.registerPlugin(ScrollTrigger);

/**
 * The five-step build journey. Centred title, steps in a staggered two-column
 * layout. Each step is ghosted until you scroll to it, then colours in; a dot
 * floats down the centre line as you go.
 */
export default function Process() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".pr-head", {
        y: 24,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });

      gsap.utils.toArray<HTMLElement>(".pr-step").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0.22 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 80%", end: "top 42%", scrub: true },
          }
        );
      });

      gsap.fromTo(
        ".pr-dot",
        { top: "0%" },
        {
          top: "100%",
          ease: "none",
          scrollTrigger: { trigger: ".pr-track", start: "top 62%", end: "bottom 55%", scrub: true },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="process" className="bg-bone px-6 md:px-16 lg:px-24 py-24 md:py-32">
      <h2
        className="pr-head text-ink font-light leading-[1.04] text-center max-w-3xl mx-auto"
        style={{ fontSize: "clamp(2.6rem, 6vw, 5rem)" }}
      >
        From first sketch to <span className="display-italic">keys.</span>
      </h2>

      <div className="pr-track relative max-w-5xl mx-auto mt-16 md:mt-24">
        {/* Centre line + floating dot (desktop) */}
        <div className="hidden md:block absolute left-1/2 top-0 -translate-x-1/2 w-px h-full bg-ink/10" />
        <div
          className="pr-dot hidden md:block absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-clay"
          style={{ top: "0%" }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 lg:gap-x-24 gap-y-14 md:gap-y-20">
          {process.map((step, i) => (
            <div key={step.num} className={`pr-step text-center md:text-left ${i % 2 === 1 ? "md:mt-20" : ""}`}>
              <span
                className="display text-clay/40 font-light leading-none"
                style={{ fontSize: "clamp(2.6rem, 4vw, 4rem)" }}
              >
                {step.num}
              </span>
              <h3 className="text-ink font-light text-2xl md:text-3xl mt-4">{step.title}</h3>
              <p className="text-ink-soft text-base leading-relaxed mt-3 max-w-sm mx-auto md:mx-0">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
