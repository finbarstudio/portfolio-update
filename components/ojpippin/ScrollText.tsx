"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

/** Body copy whose words warm up (dim → full ink) as you scroll through it. */
export default function ScrollText({
  children,
  className = "",
  as: Tag = "p",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "p" | "h2" | "h3" | "blockquote";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let split: SplitText | null = null;

    const ctx = gsap.context(() => {
      split = SplitText.create(el, { type: "words" });
      gsap.fromTo(
        split.words,
        { opacity: 0.16 },
        {
          opacity: 1,
          stagger: 0.08,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 82%",
            end: "bottom 55%",
            scrub: true,
          },
        }
      );
    }, ref);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, []);

  // @ts-expect-error, ref type narrows per tag, fine for our usage
  return <Tag ref={ref} className={className}>{children}</Tag>;
}
