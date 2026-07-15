"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Intro() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".intro-line", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 70%",
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-center bg-[#f5f0eb] px-8 md:px-20"
    >
      <div className="max-w-4xl">
        <p className="intro-line text-[#c8a96e] tracking-[0.3em] text-xs uppercase mb-8">
          Who We Are
        </p>
        <h2 className="intro-line text-[#0d0c0a] text-4xl md:text-6xl font-light leading-tight tracking-tight mb-10">
          A family business built on
          <br />
          trust, craft, and results.
        </h2>
        <p className="intro-line text-[#0d0c0a]/60 text-xl font-light leading-relaxed max-w-2xl mb-6">
          For over three decades, Lindon Homes has partnered with Brisbane
          families to create homes that are as individual as the people who
          live in them, from concept to completion, we handle everything.
        </p>
        <p className="intro-line text-[#0d0c0a]/50 text-lg font-light leading-relaxed max-w-2xl">
          HIA Award winners. Houzz Best of winners. But most importantly,
          our clients keep coming back, and they send their friends.
        </p>
        <div className="intro-line mt-16 flex gap-16">
          {[
            { num: "32+", label: "Years in business" },
            { num: "500+", label: "Homes completed" },
            { num: "20+", label: "Industry awards" },
          ].map(({ num, label }) => (
            <div key={label}>
              <div className="text-4xl font-light text-[#0d0c0a] mb-1">{num}</div>
              <div className="text-sm text-[#0d0c0a]/50 tracking-widest uppercase">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
