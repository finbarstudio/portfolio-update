"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { pillars } from "@/components/ojpippin/lib/content";

gsap.registerPlugin(ScrollTrigger);

/**
 * Why families choose us. Centred title, then the five reasons reduced to their
 * titles as pills, laid out three then two.
 */
export default function WhyUs() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".wy-head", {
        y: 24,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });
      gsap.from(".wy-pill", {
        y: 20,
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        ease: "back.out(1.7)",
        stagger: 0.1,
        scrollTrigger: { trigger: ".wy-pills", start: "top 82%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const pill =
    "wy-pill inline-block rounded-full border border-ink/20 px-7 py-3.5 text-ink font-light text-lg md:text-xl";

  return (
    <section ref={ref} id="why" className="bg-bone px-6 md:px-16 lg:px-24 pt-24 md:pt-32 pb-32 md:pb-48">
      <h2
        className="wy-head text-ink font-light leading-[1.04] text-center max-w-3xl mx-auto"
        style={{ fontSize: "clamp(2.6rem, 6vw, 5rem)" }}
      >
        Why families <span className="display-italic">choose us.</span>
      </h2>

      <div className="wy-pills max-w-4xl mx-auto mt-14 md:mt-20">
        <div className="flex flex-wrap justify-center gap-4 md:gap-5">
          {pillars.slice(0, 3).map((p) => (
            <span key={p.title} className={pill}>
              {p.title}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-4 md:gap-5 mt-4 md:mt-5">
          {pillars.slice(3).map((p) => (
            <span key={p.title} className={pill}>
              {p.title}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
