"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    num: "01",
    title: "Custom Homes, Design & Build",
    desc: "From blank canvas to completed home. Our in-house design team collaborates with you at every stage, delivering a truly bespoke result.",
  },
  {
    num: "02",
    title: "Architect Designed Homes",
    desc: "Already have plans? Our build team executes architect-designed projects with the precision and craftsmanship they deserve.",
  },
  {
    num: "03",
    title: "Knock Down Rebuild",
    desc: "Love your land, not your house? We'll demolish and rebuild to maximise your block, seamlessly managing the entire process.",
  },
  {
    num: "04",
    title: "Difficult Sites & Sloping Blocks",
    desc: "Complex topography is our specialty. We transform challenging land into extraordinary homes other builders won't touch.",
  },
  {
    num: "05",
    title: "Major Renovations",
    desc: "Transformative renovations that extend, reconfigure, or fully reimagine your existing home while maintaining its character.",
  },
  {
    num: "06",
    title: "Swimming Pools",
    desc: "Seamlessly integrated pool design and construction, a natural extension of your Lindon Home.",
  },
];

export default function Services() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".service-item", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 60%",
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="min-h-screen bg-[#0d0c0a] px-8 md:px-20 py-24 flex flex-col justify-center"
    >
      <p className="text-[#c8a96e] tracking-[0.3em] text-xs uppercase mb-4">
        What We Do
      </p>
      <h2 className="text-white text-4xl md:text-5xl font-light tracking-tight mb-16 max-w-lg">
        Every project, delivered end-to-end.
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
        {services.map((s) => (
          <div
            key={s.num}
            className="service-item bg-[#0d0c0a] p-10 hover:bg-white/5 transition-colors group cursor-pointer"
          >
            <span className="text-[#c8a96e]/50 text-xs tracking-widest mb-6 block">
              {s.num}
            </span>
            <h3 className="text-white text-lg font-light mb-4 group-hover:text-[#c8a96e] transition-colors">
              {s.title}
            </h3>
            <p className="text-white/40 text-sm leading-relaxed font-light">
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
