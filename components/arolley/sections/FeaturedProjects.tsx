"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type P = { title: string; meta: string; src: string; slug: string };
const PROJECTS: P[] = [
  { title: "Lake House", meta: "Custom Home · Sunshine Coast", src: "/a-rolley/projects/lake-house.webp", slug: "lake-house" },
  { title: "MacPhee Residence", meta: "Custom Home · Buderim", src: "/a-rolley/projects/macphee.webp", slug: "macphee-residence" },
  { title: "Watson Residence", meta: "Custom Home", src: "/a-rolley/projects/watson.webp", slug: "watson-residence" },
  { title: "KI House", meta: "Custom Home", src: "/a-rolley/projects/ki-house.webp", slug: "ki-house" },
  { title: "Curra's Annex", meta: "Secondary Dwelling", src: "/a-rolley/projects/curras.webp", slug: "curras-annex" },
];

/**
 * Full-bleed parallax showcase (Lindon-style): one immersive viewport, the
 * active project photo drifting against the scroll, thumbnails to switch
 * between projects with a soft cross-fade + white feather, and the project's
 * details (title + location) on a second, slower parallax layer.
 */
export default function FeaturedProjects({ base = "/a-rolley/site" }: { base?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const whiteRef = useRef<HTMLDivElement>(null);
  const imgLayers = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

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
    <section id="work" data-tone="dark" ref={sectionRef} className="relative w-full overflow-hidden" style={{ height: "100svh", minHeight: 560, background: "#23262b" }}>
      {/* Oversized stacked images, cross-faded on select */}
      <div ref={imgRef} className="absolute left-0 w-full" style={{ height: "124%", top: "-12%", willChange: "transform" }}>
        {PROJECTS.map((proj, i) => (
          <div key={proj.src} ref={(el) => { imgLayers.current[i] = el; }} className="absolute inset-0" style={{ opacity: i === 0 ? 1 : 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={proj.src} alt={i === 0 ? `${proj.title}, A Rolley & Sons` : ""} className="absolute inset-0 w-full h-full object-cover" loading={i === 0 ? "eager" : "lazy"} />
          </div>
        ))}
      </div>

      <div ref={whiteRef} aria-hidden className="absolute inset-0 bg-white pointer-events-none" style={{ opacity: 0 }} />

      {/* Legibility scrims: top wash for the nav, bottom-left radial behind the details */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-48 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(18,15,11,0.5), transparent)" }} />
      <div aria-hidden className="absolute bottom-0 left-0 pointer-events-none" style={{ width: "70%", height: "70%", background: "radial-gradient(ellipse at bottom left, rgba(18,15,11,0.62) 0%, rgba(18,15,11,0.3) 38%, rgba(18,15,11,0) 70%)" }} />

      {/* Whole image is a click target into the active project (the thumbnails,
          title and view-all sit above this and keep their own behaviour). */}
      <a href={`${base}/projects/${p.slug}`} data-cursor="View project" aria-label={`View ${p.title}`} className="absolute inset-0 z-[1]" />

      {/* Details + thumbnails (slower parallax layer) */}
      <div ref={layerRef} className="absolute inset-0 frame pointer-events-none z-[2]" style={{ willChange: "transform" }}>
        <div className="wrap relative h-full">
          {/* Bottom-left: active project details */}
          <div className="absolute left-0 bottom-[clamp(32px,6vh,72px)]" style={{ color: "#f4f1ea" }}>
            <a href={`${base}/projects/${p.slug}`} data-cursor="View project" className="block pointer-events-auto">
              <h2 className="display" style={{ color: "#f4f1ea", fontSize: "clamp(28px,3.4vw,52px)" }}>{p.title}</h2>
            </a>
            <p style={{ color: "rgba(244,241,234,0.82)", fontSize: "var(--step-body)", marginTop: "0.4em" }}>{p.meta}</p>
          </div>

          {/* Top-right: thumbnails to switch */}
          <div className="absolute right-0 top-[clamp(80px,12vh,120px)] flex gap-2 md:gap-3 pointer-events-auto">
            {PROJECTS.map((proj, i) => (
              <button
                key={proj.src}
                type="button"
                onClick={() => select(i)}
                data-cursor="Switch"
                aria-label={`View ${proj.title}`}
                className="relative overflow-hidden transition-opacity duration-300"
                style={{ width: "clamp(48px,5vw,76px)", height: "clamp(32px,3.3vw,48px)", outline: i === active ? "1px solid #f4f1ea" : "1px solid transparent", opacity: i === active ? 1 : 0.55 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={proj.src} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>

          {/* Bottom-right: all-projects link */}
          <div className="absolute right-0 bottom-[clamp(32px,6vh,72px)] text-right pointer-events-auto">
            <a href={`${base}/projects`} className="eyebrow" style={{ color: "#f4f1ea", borderBottom: "1px solid rgba(244,241,234,0.4)", paddingBottom: 3, display: "inline-block" }}>
              View all projects
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
