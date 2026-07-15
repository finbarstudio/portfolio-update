"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { FeaturedProject } from "@/components/ojpippin/lib/content";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectShowcase({
  project,
  index,
}: {
  project: FeaturedProject;
  index: number;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const imgLayers = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  const select = (i: number) => {
    if (i === active) return;
    setActive(i);
    imgLayers.current.forEach((el, idx) => {
      if (!el) return;
      gsap.to(el, { opacity: idx === i ? 1 : 0, duration: 0.9, ease: "power2.inOut" });
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax (no swipe reveal here; only the hero swipes)
      gsap.fromTo(
        imgRef.current,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
      // Caption rise
      gsap.from(".ps-line", {
        y: 28,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: sectionRef.current, start: "top 55%" },
      });
      // Thumbnails mask in, separators pop, staggered
      gsap.from(".ps-thumb", {
        yPercent: 130,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: sectionRef.current, start: "top 52%" },
      });
      gsap.from(".ps-icon", {
        opacity: 0,
        scale: 0.4,
        duration: 0.6,
        ease: "back.out(2)",
        stagger: 0.12,
        scrollTrigger: { trigger: sectionRef.current, start: "top 52%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-cursor="View Project"
      data-tone="dark"
      className="relative h-screen min-h-[600px] w-full overflow-hidden bg-umber cursor-none"
    >
      <div ref={clipRef} className="absolute inset-0">
        <div ref={imgRef} className="absolute inset-0 -top-[10%] h-[120%] will-change-transform">
          {project.images.map((src, i) => (
            <div
              key={src}
              ref={(el) => {
                imgLayers.current[i] = el;
              }}
              className="absolute inset-0"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <Image
                src={src}
                alt={i === 0 ? `${project.title}, ${project.type}, ${project.location}` : ""}
                fill
                priority={index === 0 && i === 0}
                quality={86}
                className="object-cover object-center"
                sizes="100vw"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Top scrim, keeps the nav legible over bright image tops */}
      <div
        className="absolute inset-x-0 top-0 h-40 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(16,11,8,0.6) 0%, rgba(16,11,8,0.25) 35%, rgba(16,11,8,0) 100%)" }}
      />
      {/* Soft bottom scrim for caption legibility */}
      <div
        className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(20,16,12,0.55), rgba(20,16,12,0))" }}
      />

      {/* Caption + thumbnails */}
      <div ref={layerRef} className="absolute inset-0 pointer-events-none">
        {/* title, bottom (centre on mobile, left on desktop) */}
        <div className="absolute bottom-8 left-6 right-6 md:right-auto md:bottom-12 md:left-10 text-center md:text-left">
          <h2 className="ps-line text-cream font-light leading-none" style={{ fontSize: "clamp(2.6rem, 7vw, 5.5rem)" }}>
            {project.title}
          </h2>
          <p className="ps-line text-cream/75 text-sm md:text-base mt-3 tracking-wide">
            {project.location} · {project.type}
          </p>
        </div>

        {/* thumbnails with separator icons, top right under nav */}
        <div className="absolute top-[5.5rem] right-6 md:right-10 flex items-center gap-5 md:gap-8 pointer-events-auto">
          {project.images.map((src, i) => (
            <div key={src} className="flex items-center gap-5 md:gap-8">
              {i > 0 && (
                <span className="ps-icon text-cream/45" aria-hidden>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 8 L5 12 L9 16 M5 12 H19 M15 8 L19 12 L15 16" />
                  </svg>
                </span>
              )}
              <span className="block overflow-hidden rounded-md">
                <button
                  onClick={() => select(i)}
                  data-cursor="Switch view"
                  aria-label={`View image ${i + 1} of ${project.title}`}
                  className={`ps-thumb relative block w-20 h-9 md:w-28 md:h-12 overflow-hidden rounded-md transition-shadow duration-300 ${
                    i === active ? "ring-1 ring-cream/70" : "ring-1 ring-cream/15 hover:ring-cream/50"
                  }`}
                >
                  <Image src={src} alt="" fill quality={50} className="object-cover" sizes="112px" />
                </button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
