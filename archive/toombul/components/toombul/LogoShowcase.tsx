"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Section three: the identity system. Six lockups sit padded on white in a
// loose 3x2 (no visible grid). The section pins, and as you keep scrolling
// the bottom-middle mark (the definitive round crest) scales up and travels
// to the centre of the screen while the other five shrink and fade out.
// order: 1 2 3 across the top, 4 6 5 across the bottom — 6 (the definitive
// dark round crest) sits bottom-middle and is the finale mark.
const MARKS = [
  { src: "/toombul/SVG/1.svg", alt: "Toombul Bulls lockup, red" },
  { src: "/toombul/SVG/2.svg", alt: "Toombul Bulls lockup, outline" },
  { src: "/toombul/SVG/3.svg", alt: "Toombul Bulls lockup, dark" },
  { src: "/toombul/SVG/4.svg", alt: "Toombul Bulls round crest, red" },
  { src: "/toombul/SVG/6.svg", alt: "Toombul Bulls round crest", hero: true },
  { src: "/toombul/SVG/5.svg", alt: "Toombul Bulls round crest, outline" },
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

      // (no entrance tween — a gsap.from here pre-hid the five non-hero
      // marks and the pin's layout reshuffle could strand them invisible)

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
      // travel = from the mark's slot to the centre of the PINNED viewport.
      // measure relative to the section (scroll-independent): when pinned,
      // section top == viewport top, so the target is simply centre-of-
      // section's first viewport minus the mark's centre-in-section.
      let dx = 0, dy = 0;
      const measure = () => {
        const secR = section.getBoundingClientRect();
        const hr = hero.getBoundingClientRect();
        const cxIn = hr.left - secR.left + hr.width / 2;
        const cyIn = hr.top - secR.top + hr.height / 2;
        dx = window.innerWidth / 2 - cxIn;
        dy = window.innerHeight / 2 - cyIn;
      };
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
