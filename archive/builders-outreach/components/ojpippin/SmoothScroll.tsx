"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

declare global {
  // eslint-disable-next-line no-var
  var __lenis: Lenis | undefined;
}

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;
    // Debug handles (harmless; used for visual QA tooling)
    (window as unknown as { __gsap?: typeof gsap }).__gsap = gsap;
    (window as unknown as { __ST?: typeof ScrollTrigger }).__ST = ScrollTrigger;

    // Home locks scroll until the preloader/intro finishes; everywhere else
    // scrolls immediately.
    const unlock = () => {
      lenis.start();
      ScrollTrigger.refresh();
    };
    if (pathname === "/oj-pippin/site") {
      lenis.stop();
      window.addEventListener("ojp:intro-done", unlock);
    }

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener("ojp:intro-done", unlock);
      gsap.ticker.remove(onTick);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, [pathname]);

  return <>{children}</>;
}
