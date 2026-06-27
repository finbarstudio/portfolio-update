"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const P = "/braeden/projects";
type Project = { title: string; meta: string; src: string };
const PROJECTS: Project[] = [
  { title: "Modern Thai House", meta: "Noosa Heads · MBA Queensland House of the Year", src: `${P}/modern-thai.webp` },
  { title: "Riverside", meta: "Noosaville · 2025 Best Individual Home", src: `${P}/noosaville.webp` },
  { title: "Peregian", meta: "Sunshine Coast · Custom home", src: `${P}/peregian.webp` },
  { title: "River Haven", meta: "Noosa · Custom home", src: `${P}/river-haven.webp` },
  { title: "Sunrise Beach", meta: "Noosa · Custom home", src: `${P}/sunrise-beach.webp` },
];

/**
 * Full-bleed parallax showcase (Lindon-style): one immersive viewport, the active
 * project photo drifting against the scroll, thumbnails to switch with a soft
 * cross-fade + white feather, and the title + location on a slower parallax layer.
 */
export default function Featured() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const whiteRef = useRef<HTMLDivElement>(null);
  const imgLayers = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(false);

  // Mask-reveal the overlay copy when the showcase scrolls into view (matches the
  // bands + footer, so the reveal language carries all the way down the page).
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const select = (i: number) => {
    if (i === active) return;
    setActive(i);
    imgLayers.current.forEach((el, idx) => {
      if (el) gsap.to(el, { opacity: idx === i ? 1 : 0, duration: 0.9, ease: "power2.inOut" });
    });
    gsap.fromTo(
      whiteRef.current,
      { opacity: 0 },
      { opacity: 0.06, duration: 0.3, ease: "sine.out", onComplete: () => gsap.to(whiteRef.current, { opacity: 0, duration: 1, ease: "sine.inOut" }) },
    );
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(imgRef.current, { yPercent: -7 }, { yPercent: 7, ease: "none", scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true } });
      gsap.fromTo(layerRef.current, { yPercent: 4 }, { yPercent: -4, ease: "none", scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const p = PROJECTS[active];

  return (
    <section id="work" data-tone="dark" ref={sectionRef} className="relative w-full overflow-hidden" style={{ height: "100svh", minHeight: 560, background: "var(--ink)" }}>
      <div ref={imgRef} className="absolute left-0 w-full" style={{ height: "124%", top: "-12%", willChange: "transform" }}>
        {PROJECTS.map((proj, i) => (
          <div key={proj.src} ref={(el) => { imgLayers.current[i] = el; }} className="absolute inset-0" style={{ opacity: i === 0 ? 1 : 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={proj.src} alt={i === 0 ? `${proj.title}, a Braeden Constructions home` : ""} className="absolute inset-0 w-full h-full object-cover" loading={i === 0 ? "eager" : "lazy"} />
          </div>
        ))}
      </div>

      <div ref={whiteRef} aria-hidden className="absolute inset-0 bg-white pointer-events-none" style={{ opacity: 0 }} />

      {/* Legibility scrims: top wash for the nav, bottom-left radial behind the details */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-48 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(18,18,20,0.5), transparent)" }} />
      <div aria-hidden className="absolute bottom-0 left-0 pointer-events-none" style={{ width: "72%", height: "72%", background: "radial-gradient(ellipse at bottom left, rgba(18,18,20,0.66) 0%, rgba(18,18,20,0.32) 38%, rgba(18,18,20,0) 70%)" }} />

      {/* Details + thumbnails (slower parallax layer) */}
      <div ref={layerRef} className="absolute inset-0 frame pointer-events-none" style={{ willChange: "transform" }}>
        <div className="wrap relative h-full">
          <p className="eyebrow brd-mask" data-revealed={shown ? "1" : undefined} style={{ position: "absolute", left: 0, top: "clamp(96px,13vh,128px)", color: "rgba(255,255,255,0.8)", ["--reveal-delay"]: "0s" } as React.CSSProperties}>Selected work</p>

          <div className="absolute left-0 bottom-[clamp(32px,6vh,72px)] brd-mask" data-revealed={shown ? "1" : undefined} style={{ color: "#fff", ["--reveal-delay"]: "0.12s" } as React.CSSProperties}>
            <a href="/braeden/site/projects" data-cursor="View project" className="block pointer-events-auto">
              <h2 className="ff-mont" style={{ color: "#fff", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.01em", fontSize: "clamp(28px,3.6vw,56px)", lineHeight: 1.02 }}>{p.title}</h2>
            </a>
            <p className="ff-quick" style={{ color: "rgba(255,255,255,0.84)", fontSize: "var(--step-body)", marginTop: "0.5em" }}>{p.meta}</p>
          </div>

          <div className="absolute right-0 top-[clamp(88px,12vh,120px)] flex gap-2 md:gap-3 pointer-events-auto">
            {PROJECTS.map((proj, i) => (
              <button
                key={proj.src}
                type="button"
                onClick={() => select(i)}
                data-cursor="Switch"
                aria-label={`View ${proj.title}`}
                className="relative overflow-hidden transition-opacity duration-300"
                style={{ width: "clamp(48px,5vw,76px)", height: "clamp(32px,3.3vw,48px)", borderRadius: 4, outline: i === active ? "1.5px solid #fff" : "1.5px solid transparent", outlineOffset: 2, opacity: i === active ? 1 : 0.5 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={proj.src} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>

          <div className="absolute right-0 bottom-[clamp(32px,6vh,72px)] text-right pointer-events-auto brd-mask" data-revealed={shown ? "1" : undefined} style={{ ["--reveal-delay"]: "0.22s" } as React.CSSProperties}>
            <a href="/braeden/site/projects" data-cursor="All work" className="eyebrow" style={{ color: "#fff", borderBottom: "1px solid rgba(255,255,255,0.4)", paddingBottom: 3, display: "inline-block" }}>
              View all projects
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
