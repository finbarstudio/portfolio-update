"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { name: "Kate Circuit", tag: "Custom Build" },
  { name: "Norman Park", tag: "Knock Down Rebuild" },
  { name: "Beachcrest Road", tag: "Difficult Site" },
  { name: "Sydney Avenue", tag: "Architect Designed" },
  { name: "Gordon Street", tag: "Custom Build" },
  { name: "Tranters Avenue", tag: "Custom Build" },
];

export default function Portfolio() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".project-card", {
        y: 60,
        opacity: 0,
        duration: 0.9,
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
      id="portfolio"
      ref={ref}
      className="min-h-screen bg-[#f5f0eb] px-8 md:px-20 py-24 flex flex-col justify-center"
    >
      <div className="flex items-end justify-between mb-16">
        <div>
          <p className="text-[#c8a96e] tracking-[0.3em] text-xs uppercase mb-4">
            Portfolio
          </p>
          <h2 className="text-[#0d0c0a] text-4xl md:text-5xl font-light tracking-tight">
            Selected works.
          </h2>
        </div>
        <a
          href="#"
          className="hidden md:block text-sm text-[#0d0c0a]/50 tracking-widest uppercase hover:text-[#0d0c0a] transition-colors"
        >
          View All Projects →
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <div key={p.name} className="project-card group cursor-pointer">
            {/* Placeholder image block */}
            <div className="aspect-[4/3] bg-[#0d0c0a]/10 mb-4 overflow-hidden relative">
              <div className="absolute inset-0 bg-[#0d0c0a]/0 group-hover:bg-[#0d0c0a]/20 transition-colors duration-500" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="text-white text-xs tracking-widest uppercase border border-white/50 px-4 py-2">
                  View Project
                </span>
              </div>
            </div>
            <p className="text-[#c8a96e] text-xs tracking-widest uppercase mb-1">
              {p.tag}
            </p>
            <h3 className="text-[#0d0c0a] text-lg font-light">{p.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
