"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import LindonLogo from "@/components/lindon/LindonLogo";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ onComplete });

    // Logo starts hidden, clipped fully from the right (nothing visible)
    gsap.set(logoRef.current, {
      clipPath: "inset(0% 100% 0% 0%)",
    });

    tl
      // Reveal: wipe in from the left → fully visible
      .to(logoRef.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.0,
        ease: "power3.inOut",
      })
      // Hold
      .to({}, { duration: 0.45 })
      // Away: wipe out continuing in the same direction (disappears left → right)
      .to(logoRef.current, {
        clipPath: "inset(0% 0% 0% 100%)",
        duration: 0.85,
        ease: "power3.inOut",
      })
      // Lift the whole white screen up
      .to(
        ref.current,
        {
          yPercent: -100,
          duration: 0.9,
          ease: "power3.inOut",
        },
        "-=0.15"
      );
  }, [onComplete]);

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[100] bg-white flex items-center justify-center"
    >
      <div ref={logoRef} className="w-64">
        <LindonLogo className="w-full h-auto" fill="#000000" />
      </div>
    </div>
  );
}
