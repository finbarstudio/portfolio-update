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
 *   kind="curtain"  the mask itself opens left to right. For photographs and
 *                   boxes, which should not slide.
 *
 *   scrub={false}   plays once, when it arrives on screen. `delay` staggers a
 *                   group so they follow each other instead of landing as one.
 *   scrub           tied live to the scroll: how far the wipe has run is how
 *                   far the element has travelled up the screen, forwards and
 *                   backwards. It finishes early (by mid-screen, sooner on a
 *                   phone), so nothing is half-hidden where someone is reading.
 *
 * Both are position-based (IntersectionObserver and getBoundingClientRect), so
 * they work the same for content moved by the page scrolling and for content
 * moved by a transform, which is how the hero's white panel scrolls.
 *
 * All scrubbed wipes on the page share ONE scroll listener and one frame
 * callback. With reduced motion everything is simply shown.
 */

const scrubbed = new Set<HTMLElement>();
let queuedAt = 0;
let listening = false;

function measure() {
  const vh = window.innerHeight;
  // How much of the screen's height a wipe takes to finish, from the moment its
  // top edge enters at the bottom. Nearly half on a wide screen, so it is done
  // by mid-screen. Far less on a phone: there the hero's panel only fills the
  // lower part of the screen, so "mid-screen" is above where its content is
  // ever shown and a wipe would never finish.
  const span = window.innerWidth <= 760 ? 0.2 : 0.46;
  for (const el of scrubbed) {
    const top = el.getBoundingClientRect().top;
    const w = Math.min(1, Math.max(0, (vh * 0.98 - top) / (vh * span)));
    el.style.setProperty("--mt-w", w.toFixed(4));
  }
}

/**
 * One measure per painted frame, however many scroll events arrive.
 *
 * The guard is a TIMESTAMP, not a flag, and that matters. This state lives at
 * module level, so it outlives any one component. The site's root layout
 * replaces requestAnimationFrame with Tempus's queue, and that queue can be
 * abandoned with callbacks still in it (React's StrictMode does exactly that in
 * development, by unmounting the component that installed it). A plain "frame
 * pending" flag would then never be cleared, and no wipe on the page would
 * measure again. A timestamp heals itself: a frame that has not arrived within
 * 120ms is assumed lost and another is asked for.
 */
function onScroll() {
  const now = performance.now();
  if (queuedAt && now - queuedAt < 120) return;
  queuedAt = now;
  requestAnimationFrame(() => {
    queuedAt = 0;
    measure();
  });
}

function listen() {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
}

export default function Wipe({
  children,
  as: Tag = "span",
  kind = "rise",
  scrub = false,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  kind?: "rise" | "curtain";
  scrub?: boolean;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.in = "1";
      el.style.setProperty("--mt-w", "1");
      return;
    }

    if (scrub) {
      scrubbed.add(el);
      listen();
      onScroll();
      // And again once the page has settled. A scrubbed wipe only otherwise
      // measures on a scroll, so one that is already on screen when the page
      // loads (or whose position was set by a parent after this ran) would sit
      // closed until the first scroll.
      const settle = window.setTimeout(onScroll, 700);
      return () => {
        window.clearTimeout(settle);
        scrubbed.delete(el);
      };
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
  }, [scrub]);

  // `as` makes the element type dynamic; cast once here (see Reveal.tsx).
  const Element = Tag as "span";

  return (
    <Element
      ref={ref as React.Ref<HTMLSpanElement>}
      className={`mt-wipe ${className}`}
      data-kind={kind}
      data-scrub={scrub ? "1" : "0"}
      style={{ ["--mt-delay" as string]: `${delay}s` }}
    >
      <span className="mt-wipe-in">{children}</span>
    </Element>
  );
}
