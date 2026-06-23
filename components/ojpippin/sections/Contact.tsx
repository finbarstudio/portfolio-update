"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cta, company } from "@/components/ojpippin/lib/content";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".c-line", {
        y: 36,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ref.current, start: "top 65%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const field =
    "w-full bg-transparent border-b border-ink/20 py-3 text-ink placeholder:text-ink/30 focus:outline-none focus:border-clay transition-colors";

  return (
    <section
      id="contact"
      ref={ref}
      className="min-h-screen flex items-center bg-bone px-8 md:px-16 lg:px-24 py-28 md:py-32"
    >
      <div className="w-full grid grid-cols-1 md:grid-cols-7 gap-y-16 md:gap-8">
        {/* Left, heading top, details bottom (Swiss split) */}
        <div className="md:col-span-3 flex flex-col justify-between md:min-h-[62vh]">
          <h2
            className="c-line text-ink font-light leading-[1.0]"
            style={{ fontSize: "clamp(2.6rem, 5vw, 4.6rem)" }}
          >
            {cta.heading[0]}
            <br />
            the home <span className="display-italic">you&rsquo;re</span>
            <br />
            picturing.
          </h2>

          <div className="c-line mt-14 md:mt-0 flex flex-col gap-6 text-ink-soft">
            <div className="flex flex-col gap-1">
              <a href={company.phoneHref} className="text-ink text-lg hover:text-clay transition-colors tabular-nums">
                {company.phone}
              </a>
              <a href={`mailto:${company.email}`} className="text-ink text-lg hover:text-clay transition-colors">
                {company.email}
              </a>
            </div>
            <div className="text-[15px] leading-relaxed">
              {company.address.line1}
              <br />
              {company.address.line2}
            </div>
            <div className="text-[15px] leading-relaxed">
              {company.hours.map((h) => (
                <div key={h.days}>
                  {h.days}, {h.time}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right, enquiry form (col 4 left intentionally empty) */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="c-line md:col-span-3 md:col-start-5 self-center flex flex-col gap-7"
        >
          <p className="text-ink-soft text-lg leading-relaxed mb-2">{cta.body}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
            <div>
              <label htmlFor="fn" className="block text-[13px] text-ink-soft mb-2">
                First name
              </label>
              <input id="fn" type="text" className={field} placeholder="Your first name" />
            </div>
            <div>
              <label htmlFor="ln" className="block text-[13px] text-ink-soft mb-2">
                Last name
              </label>
              <input id="ln" type="text" className={field} placeholder="Your last name" />
            </div>
          </div>
          <div>
            <label htmlFor="em" className="block text-[13px] text-ink-soft mb-2">
              Email
            </label>
            <input id="em" type="email" className={field} placeholder="you@email.com" />
          </div>
          <div>
            <label htmlFor="ph" className="block text-[13px] text-ink-soft mb-2">
              Phone
            </label>
            <input id="ph" type="tel" className={field} placeholder="0400 000 000" />
          </div>
          <div>
            <label htmlFor="msg" className="block text-[13px] text-ink-soft mb-2">
              Tell us about your project
            </label>
            <textarea id="msg" rows={3} className={`${field} resize-none`} placeholder="Block, budget, type of build…" />
          </div>

          <button
            type="submit"
            className="self-start mt-2 px-10 py-4 bg-ink text-cream text-[11px] tracking-[0.22em] uppercase hover:bg-clay transition-colors"
          >
            Book a Consultation
          </button>
        </form>
      </div>
    </section>
  );
}
