"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Reveal on scroll, IntersectionObserver and CSS only.
 *
 * No GSAP here on purpose: these are self-contained entrances, so they belong
 * in CSS (DESIGN.md section 6). The element starts hidden in CSS and is marked
 * revealed once; `--mt-delay` staggers a group without a timeline.
 */
export default function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className = "",
  ...rest
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
} & Record<string, unknown>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.revealed = "1";
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.revealed = "1";
            io.disconnect();
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // `as` makes the element type dynamic, so the props bag cannot be checked
  // against one element's attributes. Cast once here rather than at every call
  // site; every use is a plain block element.
  const Element = Tag as "div";

  return (
    <Element
      ref={ref}
      className={`mt-reveal ${className}`}
      style={{ ["--mt-delay" as string]: `${delay}s` }}
      {...rest}
    >
      {children}
    </Element>
  );
}
