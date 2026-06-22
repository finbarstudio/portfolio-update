"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    title: "32 Years of Experience",
    desc: "Three decades of solving complex briefs, navigating difficult sites, and building homes that stand the test of time.",
  },
  {
    title: "We Design & Build",
    desc: "One team, one contract, zero gaps. Our integrated design-and-build model means seamless communication from sketch to settlement.",
  },
  {
    title: "Superior Selections Process",
    desc: "Our dedicated selections studio guides you through every material and finish — removing overwhelm and elevating outcomes.",
  },
  {
    title: "Impeccable Craftsmanship",
    desc: "We work with the same trusted tradespeople project after project. That consistency shows in the finish.",
  },
  {
    title: "Build with Confidence",
    desc: "Fixed-price contracts, transparent timelines, and a proactive communication promise. No surprises.",
  },
];

export default function WhyLindon() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".pillar", {
        x: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
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
        Why Choose Lindon
      </p>
      <h2 className="text-white text-4xl md:text-5xl font-light tracking-tight mb-20 max-w-xl">
        The difference is in the details.
      </h2>

      <div className="space-y-0 divide-y divide-white/10">
        {pillars.map((p, i) => (
          <div
            key={p.title}
            className="pillar flex flex-col md:flex-row md:items-start gap-6 py-8 group"
          >
            <span className="text-[#c8a96e]/40 text-xs tracking-widest w-8 shrink-0 pt-1">
              0{i + 1}
            </span>
            <h3 className="text-white text-xl font-light md:w-64 shrink-0 group-hover:text-[#c8a96e] transition-colors">
              {p.title}
            </h3>
            <p className="text-white/40 font-light leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
