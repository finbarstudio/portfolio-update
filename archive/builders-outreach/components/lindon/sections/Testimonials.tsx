"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote:
      "The team at Lindon Homes exceeded every expectation. The quality of the finish is extraordinary, we're still finding little details that delight us months later.",
    author: "Pete & Helen Campbell",
  },
  {
    quote:
      "We had a very difficult sloping block that other builders walked away from. Lindon didn't just take it on, they turned it into the standout feature of our home.",
    author: "Matt & Antoinette Allen",
  },
  {
    quote:
      "Communication was exceptional throughout. We always knew what was happening and why. That's rare in this industry.",
    author: "Sunil & Darshana Khatri",
  },
];

export default function Testimonials() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".testi-card", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.15,
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
        Client Stories
      </p>
      <h2 className="text-white text-4xl md:text-5xl font-light tracking-tight mb-16 max-w-md">
        What our clients say.
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
        {testimonials.map((t) => (
          <div
            key={t.author}
            className="testi-card bg-[#0d0c0a] p-10 flex flex-col justify-between min-h-64"
          >
            <p className="text-white/70 text-lg font-light leading-relaxed italic mb-8">
              &ldquo;{t.quote}&rdquo;
            </p>
            <span className="text-[#c8a96e] text-xs tracking-widest uppercase">
              {t.author}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
