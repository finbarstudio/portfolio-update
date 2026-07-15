"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { inclusions } from "@/components/ojpippin/lib/content";

gsap.registerPlugin(ScrollTrigger);

function Check() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-clay/70 shrink-0"
      aria-hidden
    >
      <path d="M5 13 L10 18 L19 6" />
    </svg>
  );
}

/**
 * The turn-key spec sheet. Centred promise, then the four inclusion groups as a
 * 2×2 of spec tables — each line ticked, each row revealed individually.
 */
export default function Inclusions() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".inc-lead", {
        y: 28,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ref.current, start: "top 72%" },
      });
      gsap.from(".inc-row", {
        opacity: 0,
        y: 14,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.04,
        scrollTrigger: { trigger: ".inc-groups", start: "top 82%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="inclusions"
      className="bg-bone px-6 md:px-16 lg:px-24 py-24 md:py-32"
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2
          className="inc-lead text-ink font-light leading-[1.04]"
          style={{ fontSize: "clamp(2.6rem, 6vw, 5rem)" }}
        >
          All-inclusive.
          <br />
          <span className="display-italic">No fine print.</span>
        </h2>
        <p className="inc-lead text-ink-soft text-lg md:text-xl leading-relaxed mt-8 mx-auto max-w-xl">
          Every fixture and finish below is in the price from the day you sign.
          No upgrade lists, no provisional sums, the home you walk through is the
          home you move into.
        </p>
      </div>

      {/* The four tables, 2×2 */}
      <div className="inc-groups max-w-4xl mx-auto mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-2 gap-x-16 lg:gap-x-24 gap-y-14 md:gap-y-16">
        {inclusions.map((group) => (
          <div key={group.group}>
            <div className="inc-row flex items-baseline justify-center md:justify-start gap-3 mb-5">
              <h3 className="text-clay font-light text-xl md:text-2xl">{group.group}</h3>
              <span className="text-clay/40 text-xs tabular-nums">
                {String(group.items.length).padStart(2, "0")}
              </span>
            </div>
            <ul>
              {group.items.map((item) => (
                <li
                  key={item}
                  className="inc-row flex items-center justify-center md:justify-between gap-3 border-b border-ink/12 py-3.5"
                >
                  <span className="text-ink-soft text-[15px] md:text-base leading-snug text-center md:text-left">
                    {item}
                  </span>
                  <Check />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
