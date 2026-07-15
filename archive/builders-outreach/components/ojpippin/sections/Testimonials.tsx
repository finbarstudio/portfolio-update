"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { testimonials } from "@/components/ojpippin/lib/content";

gsap.registerPlugin(ScrollTrigger);

/**
 * A quiet dark moment. Three owner reviews stand side by side, divided by
 * hairlines, the words carry the weight, the brand stays out of the way.
 */
export default function Testimonials() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".testi-card", {
        y: 32,
        opacity: 0,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".testi-grid", start: "top 72%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="reviews"
      data-tone="dark"
      className="px-6 md:px-16 lg:px-24 pt-24 md:pt-32 pb-16 md:pb-24"
      style={{ background: "linear-gradient(to bottom, #221c16 0%, #1a140e 100%)" }}
    >
      <h2
        className="text-cream font-light leading-[1.02] max-w-3xl mb-14 md:mb-20 text-center md:text-left mx-auto md:mx-0"
        style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)" }}
      >
        What our owners say.
      </h2>

      <div className="testi-grid grid grid-cols-1 md:grid-cols-3 border-t border-cream/12">
        {testimonials.map((t) => (
          <figure
            key={t.author}
            className="testi-card flex flex-col items-center md:items-start text-center md:text-left border-b border-cream/12 md:border-b-0 md:border-l md:first:border-l-0 border-cream/12 py-10 md:py-12 md:px-10 md:first:pl-0 md:last:pr-0"
          >
            <span
              aria-hidden="true"
              className="font-serif text-clay-soft leading-none select-none mb-4"
              style={{ fontFamily: "var(--font-fraunces, serif)", fontSize: "3rem" }}
            >
              &ldquo;
            </span>

            <blockquote className="text-cream/85 text-lg leading-relaxed font-normal flex-1">
              {t.quote}
            </blockquote>

            <figcaption className="mt-8">
              <p className="eyebrow text-clay-soft">{t.author}</p>
              <p className="text-cream/50 text-xs mt-2">{t.place}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
