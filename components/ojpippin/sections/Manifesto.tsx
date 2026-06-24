"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollText from "@/components/ojpippin/ScrollText";
import CountUp from "@/components/ojpippin/CountUp";
import { manifesto } from "@/components/ojpippin/lib/content";

gsap.registerPlugin(ScrollTrigger);

/**
 * The brand's flex, in place of award laurels, the heritage itself: thirty
 * years, a thousand homes, fixed prices. Numbers that count up on view.
 */
export default function Manifesto() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".stat-block", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".stat-row", start: "top 80%" },
      });
      gsap.fromTo(
        ".stat-rule",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: { trigger: ".stat-row", start: "top 82%" },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="bg-bone-2 px-6 md:px-16 lg:px-24 py-24 md:py-32"
      id="story"
    >
      <p className="eyebrow text-clay mb-10 md:mb-14">{manifesto.eyebrow}</p>

      <ScrollText
        as="h2"
        className="text-ink max-w-5xl leading-[1.02]"
      >
        <span style={{ fontSize: "clamp(2.1rem, 5.4vw, 5rem)" }} className="block">
          Thirty years of building
          <br />
          across <span className="display-italic">South East Queensland.</span>
        </span>
      </ScrollText>

      <div className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-7 md:col-start-6">
          <ScrollText className="text-ink-soft text-lg md:text-xl leading-relaxed font-normal">
            {manifesto.body}
          </ScrollText>
        </div>
      </div>

      {/* Heritage figures */}
      <div className="stat-row mt-20 md:mt-28">
        <div className="stat-rule h-px bg-ink/15 origin-left mb-10 md:mb-14" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8">
          {manifesto.stats.map((s) => (
            <div key={s.label} className="stat-block">
              <div
                className="text-ink font-light leading-none"
                style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
              >
                <CountUp to={s.value} suffix={s.suffix} />
              </div>
              <div className="eyebrow text-olive mt-5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
