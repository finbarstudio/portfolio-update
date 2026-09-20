"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Content that wipes in inside its own mask, where it stands.
 *
 * The wrapper is the mask: it is laid out at the content's final size from the
 * start, so nothing around it moves, and it clips. Only what is inside travels.
 *
 *   kind="rise"     the content comes up from below the mask's bottom edge.
 *                   For lines of type.
 *   kind="curtain"  a clip opens left to right and the content holds still.
 *                   For photographs and boxes, which should not slide.
 *
 * SCROLL-ACTIVATED, NEVER SCROLL-LINKED. Arriving on screen starts the wipe; it
 * then plays through once at its own pace and stays. It is not tied to the
 * scroll position: scrolling faster does not hurry it and scrolling back does
 * not undo it. (It was tried the other way. Motion that tracks the wheel reads
 * as the page fidgeting rather than as something arriving.) `delay` staggers a
 * group, so its pieces follow one another instead of landing as one.
 *
 * With reduced motion everything is simply shown.
 */
export default function Wipe({
  children,
  as: Tag = "span",
  kind = "rise",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  kind?: "rise" | "curtain";
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.in = "1";
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.dataset.in = "1";
          io.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // `as` makes the element type dynamic; cast once here (see Reveal.tsx).
  const Element = Tag as "span";

  return (
    <Element
      ref={ref as React.Ref<HTMLSpanElement>}
      className={`mt-wipe ${className}`}
      data-kind={kind}
      style={{ ["--mt-delay" as string]: `${delay}s` }}
    >
      <span className="mt-wipe-in">{children}</span>
    </Element>
  );
}
