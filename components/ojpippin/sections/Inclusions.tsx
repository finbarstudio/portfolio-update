"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MaskReveal from "@/components/ojpippin/MaskReveal";
import { inclusions } from "@/components/ojpippin/lib/content";

gsap.registerPlugin(ScrollTrigger);

export default function Inclusions() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".i-line", {
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
      id="inclusions"
      ref={ref}
      className="min-h-screen flex flex-col justify-center bg-bone-2 px-8 md:px-16 lg:px-24 py-24 md:py-32"
    >
      <div className="w-full grid grid-cols-1 md:grid-cols-7 gap-y-16 md:gap-x-8">
        {/* Left, sticky heading column (cols 1–2): heading + line at top, tall image below */}
        <div className="md:col-span-2 md:sticky md:top-28 md:self-start flex flex-col">
          <h2
            className="i-line text-ink font-light leading-[1.0]"
            style={{ fontSize: "clamp(2.6rem, 6vw, 5.5rem)" }}
          >
            All-inclusive.
            <br />
            <span className="display-italic">No fine print.</span>
          </h2>

          <p className="i-line mt-8 max-w-xs text-ink-soft leading-relaxed">
            The finishes you&rsquo;d expect to pay extra for are already in the
            price, written plainly, fixed at contract.
          </p>

          <MaskReveal
            direction="up"
            className="i-line mt-12 relative aspect-[3/4] w-full"
          >
            <Image
              src="/oj-pippin/homes/interior-kitchen.jpg"
              alt="Stone-benchtop kitchen with full-height cabinetry in a finished OJ Pippin home"
              fill
              sizes="(max-width: 768px) 100vw, 28vw"
              quality={85}
              className="object-cover"
            />
          </MaskReveal>
        </div>

        {/* Right, the four inclusion groups as their own sub-grid (cols 4–7),
            vertical alignment varied so cells sit at top / bottom in alternation */}
        <div className="md:col-span-4 md:col-start-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-16 md:gap-y-24 md:min-h-[78vh]">
          {inclusions.map((group, idx) => (
            <div
              key={group.group}
              className={`i-line flex flex-col ${
                idx % 2 === 0 ? "self-start" : "self-end"
              }`}
            >
              <h3
                className="text-ink font-light leading-tight"
                style={{ fontSize: "clamp(1.5rem, 2.4vw, 2rem)" }}
              >
                {group.group}
              </h3>
              <ul className="mt-5 flex flex-col gap-3 text-ink-soft leading-relaxed">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
