"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectLaurel from "@/components/resolve-construction/ProjectLaurel";

gsap.registerPlugin(ScrollTrigger);

export interface Project {
  slug: string;
  title: string;
  location: string;
  award?: string;
  awardYear?: string;
  type: string;
  images: string[]; // 3 images
}

export default function ProjectShowcase({
  project,
  index,
  reveal = false,
}: {
  project: Project;
  index: number;
  reveal?: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const whiteRef = useRef<HTMLDivElement>(null);
  const imgLayers = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  // Soft crossfade + feather-white touch when switching images
  const select = (i: number) => {
    if (i === active) return;
    setActive(i);
    imgLayers.current.forEach((el, idx) => {
      if (!el) return;
      gsap.to(el, {
        opacity: idx === i ? 1 : 0,
        duration: 0.9,
        ease: "power2.inOut",
      });
    });
    // gentle white veil — barely there, soft feather out
    gsap.fromTo(
      whiteRef.current,
      { opacity: 0 },
      {
        opacity: 0.07,
        duration: 0.3,
        ease: "sine.out",
        onComplete: () =>
          gsap.to(whiteRef.current, {
            opacity: 0,
            duration: 1.0,
            ease: "sine.inOut",
          }),
      }
    );
  };

  // Parallax — image and the text/thumb layer move at different speeds
  useEffect(() => {
    const ctx = gsap.context(() => {
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
      gsap.fromTo(
        layerRef.current,
        { yPercent: 4 },
        {
          yPercent: -4,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
      // First project mask-reveals downward during the intro (while the
      // laurels are drawing in).
      if (reveal) {
        gsap.fromTo(
          sectionRef.current,
          { clipPath: "inset(0% 0% 100% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 2.4,
            delay: 0.6,
            ease: "power3.inOut",
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reveal]);

  return (
    <section
      ref={sectionRef}
      data-cursor="View Project"
      className="relative h-[calc(100vh-3.5rem)] w-full overflow-hidden bg-[var(--ink)] -mt-px cursor-none"
    >
      {/* Image layer — oversized so parallax never reveals edges. All images
          are stacked (so they preload as the section scrolls into view) and
          cross-faded on select. */}
      <div ref={imgRef} className="absolute inset-0 -top-[12%] h-[124%] will-change-transform">
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
              alt={i === 0 ? `${project.title}, Resolve Construction` : ""}
              fill
              priority={index === 0 && i === 0}
              quality={90}
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      {/* White feather veil */}
      <div
        ref={whiteRef}
        className="absolute inset-0 bg-white pointer-events-none"
        style={{ opacity: 0 }}
      />

      {/* Top gradient — for text legibility */}
      <div className="absolute top-0 left-0 right-0 h-56 bg-gradient-to-b from-black/55 to-transparent pointer-events-none" />

      {/* Bottom-left soft radial glow — keeps the award/recognition legible */}
      {project.award && (
        <div
          className="absolute bottom-0 left-0 w-2/3 h-2/3 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at bottom left, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.28) 30%, rgba(0,0,0,0) 65%)",
          }}
        />
      )}

      {/* Text + thumbnails — same layer */}
      <div ref={layerRef} className="absolute inset-0 will-change-transform pointer-events-none">
        {/* Top-left — title + its details (no label headings) */}
        <div className="absolute top-0 left-0 px-5 pt-6 md:px-8 md:pt-8 pr-4">
          <p
            className="violet text-white text-xl md:text-3xl leading-none mb-2"
            style={{ letterSpacing: "0.08em" }}
          >
            {project.title.toUpperCase()}
          </p>
          <p className="text-white/90 text-xs md:text-sm font-light tracking-wide">
            {project.location} · {project.type}
          </p>
        </div>

        {/* Thumbnails — only when a project has more than one image */}
        {project.images.length > 1 && (
        <div className="absolute bottom-6 right-5 md:bottom-auto md:top-8 md:right-8 flex gap-3 md:gap-7 pointer-events-auto">
          {project.images.map((src, i) => (
            <button
              key={src}
              onClick={() => select(i)}
              data-cursor="Switch View"
              className={`cursor-none relative w-16 h-9 md:w-20 md:h-[45px] overflow-hidden ring-1 ring-white transition-all duration-300 group ${
                i === active ? "opacity-100" : "opacity-70 hover:opacity-100"
              }`}
              aria-label={`View image ${i + 1} of ${project.title}`}
            >
              <Image
                src={src}
                alt=""
                fill
                quality={55}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="80px"
              />
            </button>
          ))}
        </div>
        )}

        {/* Recognition — bottom left (laurel + award, no label) */}
        {project.award && (
          <div className="absolute bottom-6 left-5 md:bottom-8 md:left-8 flex items-center gap-2 md:gap-3">
            <ProjectLaurel mark={project.awardYear} className="w-7 md:w-9 shrink-0" />
            <p className="text-white text-xs md:text-sm font-light tracking-wide">
              {project.award}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
