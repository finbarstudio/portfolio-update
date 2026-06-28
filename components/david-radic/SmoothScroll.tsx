"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Global handle so any component can drive the smooth scroll (e.g. logo → top)
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

    // Land every page at the top. Arriving from the /lindon pitch is a
    // cross-route-group client navigation, and neither Next's auto-scroll nor
    // Lenis resets the position across it — so without this the demo opens
    // wherever the pitch was scrolled to (mid-page). Reset the native scroll
    // and the fresh Lenis instance to the top before anything measures layout.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    lenis.scrollTo(0, { immediate: true });

    // Only the home page locks scroll for its intro. Everywhere else scrolls
    // straight away (otherwise the page can never be unlocked).
    const unlock = () => {
      lenis.start();
      ScrollTrigger.refresh();
    };
    if (pathname === "/david-radic/site") {
      lenis.stop();
      window.addEventListener("david-radic:intro-done", unlock);
    } else {
      // Non-home pages: refresh triggers once layout has settled at the top.
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }

    // Keep ScrollTrigger in sync with Lenis
    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener("david-radic:intro-done", unlock);
      gsap.ticker.remove(onTick);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, [pathname]);

  return <>{children}</>;
}
