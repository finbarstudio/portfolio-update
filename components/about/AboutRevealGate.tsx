"use client";

/**
 * AboutRevealGate — holds the below-hero content hidden until the AboutHero
 * statement has finished its word-by-word reveal. AboutHero dispatches
 * "about:intro-done" on complete (and immediately under reduced motion or a
 * background tab); this fades the content in on that signal. A timeout fallback
 * releases it regardless, so the page is never stranded hidden.
 */

import { useEffect, useState, type ReactNode } from "react";

export default function AboutRevealGate({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOpen(true);
      return;
    }
    let done = false;
    const release = () => {
      if (done) return;
      done = true;
      setOpen(true);
    };
    window.addEventListener("about:intro-done", release);
    const fallback = setTimeout(release, 6000);
    return () => {
      window.removeEventListener("about:intro-done", release);
      clearTimeout(fallback);
    };
  }, []);

  return (
    <div className="about-gate" data-open={open}>
      {children}
    </div>
  );
}
