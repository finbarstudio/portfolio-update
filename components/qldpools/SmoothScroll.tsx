"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Global handle so any component can drive the smooth scroll (e.g. logo → top).
// Shared with the other demo builds — only one demo runs at a time.
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
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;

    // Land every page at the top. Arriving from the /qldpools pitch is a
    // cross-route-group client navigation, and neither Next's auto-scroll nor
    // Lenis resets the position across it — so without this the demo opens
    // wherever the pitch was scrolled to (mid-page).
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    lenis.scrollTo(0, { immediate: true });

    // Only the home page locks scroll for its intro.
    const unlock = () => {
      lenis.start();
      ScrollTrigger.refresh();
    };
    if (pathname === "/qldpools/site") {
      lenis.stop();
      window.addEventListener("qpi:intro-done", unlock);
    } else {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }

    // Keep ScrollTrigger in sync with Lenis
    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener("qpi:intro-done", unlock);
      gsap.ticker.remove(onTick);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, [pathname]);

  return <>{children}</>;
}
