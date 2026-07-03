"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Section three: the identity system. Six lockups sit padded on white in a
// loose 3x2 (no visible grid). The section pins, and as you keep scrolling
// the bottom-middle mark (the definitive round crest) scales up and travels
// to the centre of the screen while the other five shrink and fade out.
const MARKS = [
  { src: "/toombul/SVG/1_1.svg", alt: "Toombul Bulls outline lockup" },
  { src: "/toombul/SVG/2.svg", alt: "Toombul Bulls compact lockup" },
  { src: "/toombul/SVG/3_1.svg", alt: "Toombul Bulls white colourway" },
  { src: "/toombul/SVG/4_1.svg", alt: "Toombul Bulls round crest, outline" },
  { src: "/toombul/SVG/5_1.svg", alt: "Toombul Bulls round crest", hero: true },
  { src: "/toombul/SVG/6_1.svg", alt: "Toombul Bulls round crest, dark" },
];

export default function LogoShowcase() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const cells = gsap.utils.toArray<HTMLElement>(section.querySelectorAll(".tc-mark"));
      const hero = section.querySelector<HTMLElement>(".tc-mark--hero");
      const rest = cells.filter((c) => c !== hero);
      if (!hero) return;

      if (reduced) return; // static six-up board

      // entry: quiet stagger in
      gsap.from(cells, {
        opacity: 0,
        y: 26,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: section, start: "top 70%" },
      });

      // the finale: pin the section, hero mark travels to screen centre and
      // grows; the other five shrink away to nothing.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=120%",
          pin: true,
          scrub: true,
        },
      });
      const place = () => {
        const hr = hero.getBoundingClientRect();
        const dx = window.innerWidth / 2 - (hr.left + hr.width / 2);
        const dy = window.innerHeight / 2 - (hr.top + hr.height / 2);
        return { dx, dy };
      };
      // compute the travel once layout settles (ScrollTrigger refresh-safe)
      let dx = 0, dy = 0;
      const measure = () => { const p = place(); dx = p.dx; dy = p.dy; };
      measure();
      ScrollTrigger.addEventListener("refreshInit", measure);

      tl.to(rest, { scale: 0.55, opacity: 0, ease: "power2.in", duration: 0.55 }, 0)
        .to(hero, {
          x: () => dx,
          y: () => dy,
          scale: 2.1,
          ease: "power2.inOut",
          duration: 1,
        }, 0.05);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="three" className="tc-logoshow">
      {MARKS.map((m) => (
        <div key={m.src} className={`tc-mark${m.hero ? " tc-mark--hero" : ""}`}>
          <img src={m.src} alt={m.alt} loading="lazy" draggable={false} />
        </div>
      ))}
    </section>
  );
}
