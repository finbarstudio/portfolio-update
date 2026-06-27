"use client";

/**
 * Lightweight, consistent scroll reveal used across the Braeden homepage. Adds
 * `.is-in` when the element enters the viewport (CSS handles the fade + rise).
 * Optional `delay` staggers siblings. IntersectionObserver only, no GSAP, with a
 * reduced-motion fallback handled in CSS.
 */

import { useEffect, useRef, useState } from "react";

export default function BReveal({
  children,
  delay = 0,
  className = "",
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { setShown(true); io.disconnect(); }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`b-reveal ${shown ? "is-in" : ""} ${className}`.trim()}
      style={{ transitionDelay: delay ? `${delay}s` : undefined, ...style }}
    >
      {children}
    </div>
  );
}
