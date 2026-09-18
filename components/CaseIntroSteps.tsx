"use client";

/**
 * CaseIntroSteps — the scrolling half of a demo-led case study's opening.
 * One problem solved per screen, centred in its column, with a vertical row
 * of pagination dots pinned beside it. The active dot is one blob that
 * stretches to the next position and then lets go (see .case-dots-blob): the
 * leading edge moves first, the trailing edge follows.
 */

import { useEffect, useRef, useState } from "react";

type Step = { name: string; title: string; body: string };

export default function CaseIntroSteps({ steps }: { steps: Step[] }) {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState<"down" | "up">("down");
  const listRef = useRef<HTMLOListElement>(null);
  const activeRef = useRef(0);

  useEffect(() => {
    const items = Array.from(listRef.current?.children ?? []);
    // A hairline across the middle of the viewport: whichever part crosses it
    // is the active one.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = items.indexOf(e.target);
          if (i === activeRef.current) continue;
          setDir(i > activeRef.current ? "down" : "up");
          activeRef.current = i;
          setActive(i);
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = (i: number) => {
    const el = listRef.current?.children[i] as HTMLElement | undefined;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - (window.innerHeight - el.offsetHeight) / 2;
    if (window.__lenis) window.__lenis.scrollTo(top);
    else window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div className="case-steps">
      <ol ref={listRef} className="case-steps-list" aria-label="Problems solved">
        {steps.map((s, i) => (
          <li key={s.name} className={i === active ? "is-active" : undefined}>
            <div className="case-step">
              <h2>{s.title}</h2>
              <p>{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <nav
        className="case-dots"
        aria-label="Problems solved"
        data-dir={dir}
        style={{ "--i": active, "--n": steps.length } as React.CSSProperties}
      >
        <span className="case-dots-blob" aria-hidden="true" />
        {steps.map((s, i) => (
          <button key={s.name} type="button" aria-label={s.title} aria-current={i === active ? "step" : undefined} onClick={() => go(i)} />
        ))}
      </nav>
    </div>
  );
}
