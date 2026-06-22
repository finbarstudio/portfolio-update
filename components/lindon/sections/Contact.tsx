"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".contact-line", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 65%",
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={ref}
      className="min-h-screen bg-[#f5f0eb] px-8 md:px-20 py-24 flex flex-col justify-center"
    >
      <div className="max-w-2xl">
        <p className="contact-line text-[#c8a96e] tracking-[0.3em] text-xs uppercase mb-4">
          Get in Touch
        </p>
        <h2 className="contact-line text-[#0d0c0a] text-4xl md:text-6xl font-light tracking-tight mb-6">
          Let's build
          <br />
          something exceptional.
        </h2>
        <p className="contact-line text-[#0d0c0a]/50 text-lg font-light leading-relaxed mb-12">
          Ready to start your new home journey? Book a free consultation with
          our team, no pressure, just a conversation about your vision.
        </p>

        <form className="contact-line space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs tracking-widest uppercase text-[#0d0c0a]/50 mb-2">
                First Name
              </label>
              <input
                type="text"
                className="w-full bg-transparent border-b border-[#0d0c0a]/20 py-3 text-[#0d0c0a] placeholder:text-[#0d0c0a]/30 focus:outline-none focus:border-[#c8a96e] transition-colors"
                placeholder="Your first name"
              />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-[#0d0c0a]/50 mb-2">
                Last Name
              </label>
              <input
                type="text"
                className="w-full bg-transparent border-b border-[#0d0c0a]/20 py-3 text-[#0d0c0a] placeholder:text-[#0d0c0a]/30 focus:outline-none focus:border-[#c8a96e] transition-colors"
                placeholder="Your last name"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase text-[#0d0c0a]/50 mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full bg-transparent border-b border-[#0d0c0a]/20 py-3 text-[#0d0c0a] placeholder:text-[#0d0c0a]/30 focus:outline-none focus:border-[#c8a96e] transition-colors"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase text-[#0d0c0a]/50 mb-2">
              Tell us about your project
            </label>
            <textarea
              rows={4}
              className="w-full bg-transparent border-b border-[#0d0c0a]/20 py-3 text-[#0d0c0a] placeholder:text-[#0d0c0a]/30 focus:outline-none focus:border-[#c8a96e] transition-colors resize-none"
              placeholder="Block size, rough budget, type of build…"
            />
          </div>
          <button
            type="submit"
            className="px-10 py-4 bg-[#0d0c0a] text-white text-sm tracking-widest uppercase hover:bg-[#c8a96e] hover:text-[#0d0c0a] transition-colors"
          >
            Book a Consultation
          </button>
        </form>
      </div>

      <footer className="mt-24 pt-8 border-t border-[#0d0c0a]/10 flex flex-col md:flex-row justify-between text-xs text-[#0d0c0a]/40 tracking-wide gap-4">
        <span>© 2025 Lindon Homes. All rights reserved.</span>
        <span>Brisbane, South East Queensland</span>
        <span>Lic. No. 15889</span>
      </footer>
    </section>
  );
}
