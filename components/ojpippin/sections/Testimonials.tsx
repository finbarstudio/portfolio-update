"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MaskReveal from "@/components/ojpippin/MaskReveal";
import { testimonials } from "@/components/ojpippin/lib/content";

gsap.registerPlugin(ScrollTrigger);

export default function Testimonials() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".t-line", {
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
      id="reviews"
      ref={ref}
      className="min-h-screen flex flex-col justify-center bg-bone px-8 md:px-16 lg:px-24 py-24 md:py-32"
    >
      <div className="w-full grid grid-cols-1 md:grid-cols-7 gap-y-20 md:gap-x-8 md:gap-y-28">
        {/* Heading, sticky, holds top-left while the quotes cascade past */}
        <h2
          className="t-line md:col-span-4 md:self-start md:sticky md:top-28 text-ink font-light leading-[1.0]"
          style={{ fontSize: "clamp(2.6rem, 6vw, 5.5rem)" }}
        >
          What our
          <br />
          owners <span className="display-italic">say.</span>
        </h2>

        {/* Quote 01, upper right, cols 5–7, sits high */}
        <blockquote className="t-line md:col-start-5 md:col-span-3 md:self-start">
          <p className="text-ink font-light text-xl md:text-2xl leading-relaxed">
            &ldquo;{testimonials[0].quote}&rdquo;
          </p>
          <footer className="mt-7">
            <div className="text-clay text-base">{testimonials[0].author}</div>
            <div className="text-ink-soft text-sm mt-1">{testimonials[0].place}</div>
          </footer>
        </blockquote>

        {/* Quote 02, left block, cols 1–4, dropped lower */}
        <blockquote className="t-line md:col-start-1 md:col-span-4 md:self-end md:mt-20">
          <p className="text-ink font-light text-xl md:text-2xl leading-relaxed">
            &ldquo;{testimonials[1].quote}&rdquo;
          </p>
          <footer className="mt-7">
            <div className="text-clay text-base">{testimonials[1].author}</div>
            <div className="text-ink-soft text-sm mt-1">{testimonials[1].place}</div>
          </footer>
        </blockquote>

        {/* Portrait, tucked into the empty upper-right cell, side reveal */}
        <MaskReveal
          direction="left"
          className="t-line hidden md:block md:col-start-6 md:col-span-2 md:self-start"
        >
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <Image
              src="/oj-pippin/homes/photo-real.jpg"
              alt="An OJ Pippin home, lived in"
              fill
              sizes="(max-width: 768px) 100vw, 28vw"
              quality={85}
              className="object-cover"
            />
          </div>
        </MaskReveal>

        {/* Quote 03, centre-left, cols 2–5, lowest in the cascade */}
        <blockquote className="t-line md:col-start-2 md:col-span-4 md:self-end md:mt-16">
          <p className="text-ink font-light text-xl md:text-2xl leading-relaxed">
            &ldquo;{testimonials[2].quote}&rdquo;
          </p>
          <footer className="mt-7">
            <div className="text-clay text-base">{testimonials[2].author}</div>
            <div className="text-ink-soft text-sm mt-1">{testimonials[2].place}</div>
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
