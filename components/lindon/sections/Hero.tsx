"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Preloader from "@/components/lindon/Preloader";
import LindonLogo from "@/components/lindon/LindonLogo";
import AwardBadge from "@/components/lindon/AwardBadge";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [revealAwards, setRevealAwards] = useState(false);

  useEffect(() => {
    // Keep everything hidden until preloader fires callback
    gsap.set([overlayRef.current, navRef.current, scrollRef.current], {
      opacity: 0,
    });
    gsap.set(navRef.current, { y: 10 });
  }, []);

  const handlePreloaderComplete = () => {
    setPreloaderDone(true);

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // 1. Overlay snaps on fast
    tl.to(overlayRef.current, { opacity: 1, duration: 0.35, ease: "none" })
      // 2. Nav slides down and fades in
      .to(navRef.current, { opacity: 1, y: 0, duration: 0.7 }, "-=0.05")
      // 3. Trigger the award badge's own draw/reveal
      .add(() => setRevealAwards(true), "-=0.3")
      // 4. Scroll indicator
      .to(scrollRef.current, { opacity: 1, duration: 0.6 }, "+=0.4");

    // Parallax on scroll
    gsap.to(imgRef.current, {
      yPercent: 18,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  };

  return (
    <>
      {!preloaderDone && <Preloader onComplete={handlePreloaderComplete} />}

      <section
        ref={sectionRef}
        className="relative h-screen w-full overflow-hidden bg-black"
      >
        {/* Full-bleed image */}
        <div ref={imgRef} className="absolute inset-0 will-change-transform">
          <Image
            src="/lindon/hero.jpg"
            alt="Lindon Homes — luxury custom home Brisbane"
            fill
            priority
            quality={90}
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>

        {/* Dark blue-grey overlay — fades on after preloader */}
        <div
          ref={overlayRef}
          className="absolute inset-0"
          style={{ background: "rgba(8, 14, 24, 0.42)" }}
        />

        {/* ── NAV ─────────────────────────────────────────────── */}
        <nav
          ref={navRef}
          className="absolute top-0 left-0 right-0 z-20 flex items-center px-8 md:px-14 py-7"
        >
          {/* Logo — left */}
          <div className="flex-1">
            <a href="#">
              <LindonLogo className="h-7 w-auto" fill="white" />
            </a>
          </div>

          {/* Nav links — centre */}
          <ul className="hidden md:flex items-center gap-10 flex-1 justify-center">
            {["What We Do", "Portfolio", "About", "News"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="text-white/70 text-[11px] tracking-[0.2em] uppercase font-light hover:text-white transition-colors"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>

          {/* Contact — right */}
          <div className="flex-1 flex justify-end">
            <a
              href="#"
              className="text-[11px] tracking-[0.2em] uppercase font-light text-white/70 hover:text-white transition-colors border-b border-white/25 pb-px"
            >
              Free Consultation
            </a>
          </div>
        </nav>

        {/* ── AWARD BADGE — centred ───────────────────────────── */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <AwardBadge
            status="Winner"
            title="QLD Home of the Year"
            subtitle="HIA Brisbane"
            play={revealAwards}
          />
        </div>

        {/* ── SCROLL INDICATOR ────────────────────────────────── */}
        <div
          ref={scrollRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="w-px h-14 bg-white/15 relative overflow-hidden">
            <div
              className="absolute top-0 left-0 w-full bg-[#1B93D2]"
              style={{ height: "50%", animation: "scrollDrop 1.8s ease-in-out infinite" }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
