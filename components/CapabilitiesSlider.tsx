"use client";

/**
 * CapabilitiesSlider — the "What I do" disciplines as an infinite, auto-scrolling
 * card slider (GSAP). The set is duplicated and the track loops by exactly one
 * set (xPercent -50), so it's seamless. Slows to a stop on hover (so you can
 * read), pauses off-screen. Sticker cards: 1px outline, pink wash on hover.
 * No-ops under reduced motion (static row).
 */

import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";

const CAPABILITIES = [
  { name: "Brand identity", desc: "Logomarks, colour and type, with guidelines to keep it consistent." },
  { name: "Editorial & print", desc: "Publications and print-ready layouts, set in InDesign." },
  { name: "Web & UI design", desc: "Brand-led websites and interfaces, built detail-first." },
  { name: "Creative direction", desc: "Art direction and visual systems across a project." },
  { name: "Motion graphics", desc: "Animated assets and short-form video, made in After Effects." },
  { name: "Social campaigns", desc: "Static and motion sets sized for every channel." },
];

export default function CapabilitiesSlider() {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let tween: gsap.core.Tween | undefined;
    const ctx = gsap.context(() => {
      tween = gsap.to(track, { xPercent: -50, duration: 32, ease: "none", repeat: -1 });
    }, trackRef);

    const slow = () => { if (tween) gsap.to(tween, { timeScale: 0, duration: 0.5, overwrite: true }); };
    const go = () => { if (tween) gsap.to(tween, { timeScale: 1, duration: 0.5, overwrite: true }); };
    root.addEventListener("pointerenter", slow);
    root.addEventListener("pointerleave", go);

    const io = new IntersectionObserver(
      ([e]) => { if (tween) (e.isIntersecting ? tween.play() : tween.pause()); },
      { rootMargin: "120px" }
    );
    io.observe(root);

    return () => {
      root.removeEventListener("pointerenter", slow);
      root.removeEventListener("pointerleave", go);
      io.disconnect();
      ctx.revert();
    };
  }, []);

  const items = [...CAPABILITIES, ...CAPABILITIES];
  return (
    <div ref={rootRef} className="cap-slider">
      <div ref={trackRef} className="cap-track">
        {items.map((c, i) => (
          <article className="cap-card" key={i} aria-hidden={i >= CAPABILITIES.length ? true : undefined}>
            <h3 className="cap-name">{c.name}</h3>
            <p className="cap-desc">{c.desc}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
