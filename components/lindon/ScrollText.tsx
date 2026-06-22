"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

/** Body copy whose words light up (dim → full ink) as you scroll through it. */
export default function ScrollText({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let split: SplitText | null = null;

    const ctx = gsap.context(() => {
      split = SplitText.create(el, { type: "words" });
      gsap.fromTo(
        split.words,
        { opacity: 0.18 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            // Anchor both ends to the same read-line so stacked paragraphs
            // reveal in sequence: the next only starts lighting up once the
            // previous has fully crossed the line. (Different start/end anchors
            // let paragraph two begin while paragraph one was still going.)
            start: "top 65%",
            end: "bottom 65%",
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

  return (
    <p ref={ref} className={className}>
      {children}
    </p>
  );
}
