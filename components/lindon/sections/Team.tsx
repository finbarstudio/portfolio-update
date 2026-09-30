"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const team = [
  { name: "Trent Lindon", role: "Director & Builder" },
  { name: "Ashley Lindon", role: "Director" },
  { name: "Lynn Lindon", role: "Co-Founder" },
  { name: "Nadine Chapman", role: "Design Consultant" },
  { name: "Bryce Warner", role: "Site Manager" },
  { name: "Mick Power", role: "Construction Manager" },
  { name: "Stacey de Vries", role: "Client Relations" },
  { name: "Madison Law", role: "Design Consultant" },
];

export default function Team() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".team-card", {
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
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
      className="min-h-screen bg-[#f5f0eb] px-8 md:px-20 py-24 flex flex-col justify-center"
    >
      <p className="text-[#c8a96e] tracking-[0.3em] text-xs uppercase mb-4">
        The Team
      </p>
      <h2 className="text-[#0d0c0a] text-4xl md:text-5xl font-light tracking-tight mb-16">
        People who care.
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {team.map((m) => (
          <div key={m.name} className="team-card group">
            {/* Placeholder for portrait photo */}
            <div className="aspect-[3/4] bg-[#0d0c0a]/8 mb-4" />
            <p className="text-[#0d0c0a] font-light text-base">{m.name}</p>
            <p className="text-[#0d0c0a]/50 text-xs tracking-wide uppercase mt-1">
              {m.role}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
