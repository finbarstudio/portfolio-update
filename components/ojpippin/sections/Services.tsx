"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services } from "@/components/ojpippin/lib/content";

gsap.registerPlugin(ScrollTrigger);

/**
 * The six-cell grid. Two small dots travel the internal divider lines (never
 * the outer edge), drawing them in from the top down while each card fades up
 * in a top-right → bottom-left order.
 */
export default function Services() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // top-right → bottom-left reveal order for cards (row-major 0..5)
      const order = [0.42, 0.21, 0, 0.63, 0.42, 0.21];

      const tl = gsap.timeline({
        scrollTrigger: { trigger: ".svc-grid", start: "top 72%" },
      });
      tl.fromTo(".svc-vline", { scaleY: 0 }, { scaleY: 1, duration: 1.4, ease: "power2.out", stagger: 0.12 }, 0)
        .fromTo(".svc-hline", { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "power2.out" }, 0.2)
        .fromTo(".svc-dot", { autoAlpha: 0, top: "0%" }, { autoAlpha: 1, duration: 0.3 }, 0)
        .to(".svc-dot", { top: "100%", duration: 1.5, ease: "power1.inOut" }, 0)
        .to(".svc-dot", { autoAlpha: 0, duration: 0.4 }, 1.45)
        // horizontal dot draws the central line right → left
        .fromTo(".svc-dot-h", { autoAlpha: 0, left: "100%" }, { autoAlpha: 1, duration: 0.3 }, 0.2)
        .to(".svc-dot-h", { left: "0%", duration: 1.2, ease: "power1.inOut" }, 0.2)
        .to(".svc-dot-h", { autoAlpha: 0, duration: 0.4 }, 1.45)
        .from(
          ".svc-item",
          {
            opacity: 0,
            y: 26,
            duration: 0.8,
            ease: "power3.out",
            stagger: (i: number) => order[i] ?? 0,
          },
          0.3
        );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="services" className="bg-bone px-6 md:px-16 lg:px-24 py-16 md:py-20">
      <div className="max-w-6xl mx-auto">
        <div className="svc-grid relative">
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {services.map((service) => (
              <li
                key={service.num}
                className="svc-item group px-2 sm:px-7 md:px-8 py-9 md:py-12 text-center md:text-left"
              >
                <span className="block eyebrow text-olive tabular-nums">{service.num}</span>
                <h3 className="text-ink font-light text-xl md:text-2xl leading-snug mt-5 transition-colors duration-500 group-hover:text-clay">
                  {service.title}
                </h3>
                <p className="text-ink-soft text-sm leading-relaxed mt-3 max-w-xs mx-auto md:mx-0">
                  {service.desc}
                </p>
              </li>
            ))}
          </ul>

          {/* Internal divider lines + travelling dots (desktop only) */}
          <div className="hidden md:block absolute inset-0 pointer-events-none">
            <div className="svc-vline absolute top-0 left-1/3 w-px h-full bg-ink/15 origin-top" />
            <div className="svc-vline absolute top-0 left-2/3 w-px h-full bg-ink/15 origin-top" />
            <div className="svc-hline absolute left-0 top-1/2 h-px w-full bg-ink/15 origin-right" />
            <div className="svc-dot absolute left-1/3 w-[5px] h-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-clay" />
            <div className="svc-dot absolute left-2/3 w-[5px] h-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-clay" />
            <div className="svc-dot-h absolute top-1/2 w-[5px] h-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-clay" />
          </div>
        </div>
      </div>
    </section>
  );
}
