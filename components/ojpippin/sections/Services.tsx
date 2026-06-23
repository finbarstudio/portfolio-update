"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services } from "@/components/ojpippin/lib/content";

gsap.registerPlugin(ScrollTrigger);

/* Asymmetric Swiss placement for the six services, varied spans,
   start columns and vertical alignment so the block reads like a
   poster rather than a tidy 3×2. Columns are deliberately left empty. */
const placement = [
  "md:col-start-5 md:col-span-2 md:self-start",
  "md:col-start-1 md:col-span-2 md:self-end",
  "md:col-start-4 md:col-span-2 md:self-start",
  "md:col-start-6 md:col-span-2 md:self-end",
  "md:col-start-2 md:col-span-2 md:self-start",
  "md:col-start-5 md:col-span-2 md:self-end",
];

export default function Services() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".s-line", {
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
      id="services"
      ref={ref}
      className="min-h-screen flex flex-col justify-center bg-bone px-8 md:px-16 lg:px-24 py-24 md:py-32"
    >
      <div className="w-full grid grid-cols-1 md:grid-cols-7 gap-x-8 gap-y-16 md:gap-y-28">
        {/* Heading, top of the grid, cols 1–4; sticks while services scroll past */}
        <h2
          className="s-line md:col-start-1 md:col-span-4 md:self-start md:sticky md:top-28 text-ink font-light leading-[1.0]"
          style={{ fontSize: "clamp(2.6rem, 6vw, 5.5rem)" }}
        >
          Everything,
          <br />
          <span className="display-italic">under one roof.</span>
        </h2>

        {/* Services laid across the grid asymmetrically, no divider lines */}
        {services.map((s, i) => (
          <article
            key={s.num}
            className={`s-line group flex flex-col gap-4 max-w-sm ${placement[i]}`}
          >
            <span className="text-olive text-sm tabular-nums tracking-[0.1em]">
              {s.num}
            </span>
            <h3 className="text-ink text-2xl md:text-[1.75rem] font-light leading-tight transition-colors duration-500 group-hover:text-clay">
              {s.title}
            </h3>
            <p className="text-ink-soft text-[15px] leading-relaxed">
              {s.desc}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
