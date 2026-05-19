"use client";

import { useEffect, useRef } from "react";

// Large ✶ that drifts upward slightly as the page scrolls , 
// parallax within the sticky hero section.
export default function StarDecor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      el.style.transform = `translateY(calc(-50% + ${window.scrollY * -0.22}px))`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: "absolute",
        right: "-0.06em",
        top: "50%",
        transform: "translateY(-50%)",
        fontSize: "clamp(160px, 30vw, 270px)",
        lineHeight: 1,
        color: "var(--line)",
        fontWeight: 700,
        userSelect: "none",
        pointerEvents: "none",
        zIndex: 0,
        fontFamily: "var(--font-sans)",
      }}
    >
      ✶
    </div>
  );
}
