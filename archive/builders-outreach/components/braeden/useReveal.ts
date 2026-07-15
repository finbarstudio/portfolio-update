"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-into-view trigger for the .brd-mask / .brd-reveal primitives. Returns a
 * ref to put on the section and a `shown` flag to drive data-revealed on its
 * children (which carry their own --reveal-delay for the stagger). Fires once,
 * honours reduced-motion (shows immediately), and can't get stuck hidden.
 */
export function useReveal<T extends HTMLElement = HTMLElement>(rootMargin = "0px 0px -12% 0px") {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
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
      { threshold: 0.15, rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return { ref, shown };
}
