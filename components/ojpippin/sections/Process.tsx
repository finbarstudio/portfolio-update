"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { process } from "@/components/ojpippin/lib/content";

gsap.registerPlugin(ScrollTrigger);

/**
 * The build journey, told plainly, five steps from first sketch to keys.
 * A Swiss grid: the heading holds in a sticky column while the steps scroll
 * past in the right field. No labels, no rules, just numbers and whitespace.
 */
export default function Process() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".p-line", {
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
      ref={ref}
      id="process"
      className="min-h-screen flex flex-col justify-center bg-bone px-8 md:px-16 lg:px-24 py-24 md:py-32"
    >
      <div className="w-full grid grid-cols-1 md:grid-cols-7 gap-y-20 md:gap-x-8">
        {/* Sticky heading, cols 1–2, holds while the steps scroll past */}
        <div className="md:col-span-2 md:sticky md:top-28 md:self-start">
          <h2
            className="p-line text-ink font-light leading-[1.0]"
            style={{ fontSize: "clamp(2.6rem, 6vw, 5.5rem)" }}
          >
            From first
            <br />
            sketch to{" "}
            <span className="display-italic">keys.</span>
          </h2>
        </div>

        {/* Steps, cols 4–7, generous vertical air, no divider lines */}
        <ol className="md:col-span-4 md:col-start-4 flex flex-col gap-20 md:gap-28">
          {process.map((step, i) => (
            <li
              key={step.num}
              className="p-line grid grid-cols-1 sm:grid-cols-5 gap-x-6 gap-y-4"
            >
              {/* Large faint Fraunces number, top-aligned */}
              <span
                aria-hidden
                className={`display text-ink/25 font-light leading-none tabular-nums self-start sm:col-span-1 ${
                  i % 2 === 1 ? "sm:col-start-2" : ""
                }`}
                style={{ fontSize: "clamp(3rem, 5vw, 4.5rem)" }}
              >
                {step.num}
              </span>

              {/* Title + detail, bottom-aligned against the number */}
              <div className="sm:col-span-4 sm:col-start-2 self-end">
                <h3
                  className="text-ink font-light leading-[1.05] mb-4"
                  style={{ fontSize: "clamp(1.5rem, 2.4vw, 2.1rem)" }}
                >
                  {step.title}
                </h3>
                <p className="text-ink-soft text-[15px] md:text-base leading-relaxed max-w-md">
                  {step.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
