"use client";

import { useEffect, useRef } from "react";

// Section four: after the finale mark, a coverflow marquee. All six marks
// stream horizontally, three on screen, the centre one large and the flanks
// smaller — each grows as it travels through the middle. It auto-scrolls,
// and the page scroll feeds into the same offset so scrolling nudges it too.
const LOGOS = [1, 2, 3, 4, 5, 6].map((n) => `/toombul/SVG/${n}.svg`);
const SETS = 3; // repeated copies for a seamless loop

export default function LogoMarquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = Array.from(track.children) as HTMLElement[];
    if (!items.length) return;

    let slot = 0, setWidth = 0, offset = 0, raf = 0;
    let lastScroll = window.scrollY;
    const AUTO = 0.55;        // px/frame drift
    const SCROLL_GAIN = 0.55; // how much page scroll feeds the strip

    const measure = () => {
      slot = items[0].getBoundingClientRect().width;
      setWidth = slot * LOGOS.length;
    };
    measure();
    window.addEventListener("resize", measure);

    const wrap = (v: number) => ((v % setWidth) + setWidth) % setWidth;

    const frame = () => {
      const sy = window.scrollY;
      const dScroll = sy - lastScroll;
      lastScroll = sy;
      if (!reduce) offset += AUTO;
      offset += dScroll * SCROLL_GAIN;
      offset = wrap(offset);
      track.style.transform = `translate3d(${-offset}px,0,0)`;

      const secLeft = section.getBoundingClientRect().left;
      const centerX = window.innerWidth / 2;
      for (let i = 0; i < items.length; i++) {
        const c = secLeft + i * slot + slot / 2 - offset;
        const norm = Math.min(1, Math.abs(c - centerX) / (slot * 1.15));
        const scale = 1.32 - 0.62 * norm;   // centre 1.32 -> flank 0.70
        const op = 1 - 0.4 * norm;
        items[i].style.transform = `scale(${scale})`;
        items[i].style.opacity = String(op);
        items[i].style.zIndex = String(Math.round(100 - norm * 100));
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const rendered = Array.from({ length: LOGOS.length * SETS }, (_, i) => LOGOS[i % LOGOS.length]);

  return (
    <section ref={sectionRef} id="four" className="tc-marquee">
      <div className="tc-marquee-track" ref={trackRef}>
        {rendered.map((src, i) => (
          <div className="tc-marquee-item" key={i}>
            <img src={src} alt="" draggable={false} loading="lazy" />
          </div>
        ))}
      </div>
    </section>
  );
}
