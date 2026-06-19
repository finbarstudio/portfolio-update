"use client";

/**
 * MaskReveal — splits its children into words (element children are kept whole)
 * and reveals them one by one: each slides up out of an overflow-hidden mask,
 * staggered, triggered when the block scrolls into view. Reduced-motion safe;
 * content stays visible if GSAP never runs.
 */

import {
  Children,
  createElement,
  isValidElement,
  useLayoutEffect,
  useRef,
  type ElementType,
  type ReactNode,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

function Word({ children }: { children: ReactNode }) {
  return (
    <span className="mr-mask">
      <span className="mr-inner">{children}</span>
    </span>
  );
}

export default function MaskReveal({
  as = "span",
  className,
  children,
  ...rest
}: { as?: ElementType; className?: string; children: ReactNode } & Record<string, unknown>) {
  const ref = useRef<HTMLElement>(null);

  const tokens: ReactNode[] = [];
  let key = 0;
  Children.forEach(children, (child) => {
    if (typeof child === "string") {
      child.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (part.trim() === "") tokens.push(" ");
        else tokens.push(<Word key={key++}>{part}</Word>);
      });
    } else if (isValidElement(child)) {
      tokens.push(<Word key={key++}>{child}</Word>);
    }
  });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const inners = el.querySelectorAll<HTMLElement>(".mr-inner");
    if (!inners.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!registered) { gsap.registerPlugin(ScrollTrigger); registered = true; }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        inners,
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.055,
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" },
        },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return createElement(as, { ref, className, ...rest }, tokens);
}
