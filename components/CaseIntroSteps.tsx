"use client";

/**
 * CaseIntroSteps — the scrolling half of a demo-led case study's opening.
 * One problem solved per screen, centred in its column, with a vertical row
 * of pagination dots pinned beside it. The active dot is one blob that
 * stretches to the next position and then lets go (see .case-dots-blob): the
 * leading edge moves first, the trailing edge follows.
 *
 * Below 1024px there is no sticky split, so each step carries its own clip
 * (or phone stills) straight under its text, and the page's separate clip
 * column (.case-demos) is hidden. The clips mount only after hydration on a
 * narrow screen, so desktop renders exactly as before and never loads them twice.
 */

import { useEffect, useRef, useState } from "react";
import VideoPlayer from "./VideoPlayer";

type Step = { name: string; title: string; body: string; caption?: string; video?: string; shots?: string[] };

const MOBILE = "(max-width: 1023px)";

export default function CaseIntroSteps({ steps }: { steps: Step[] }) {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState<"down" | "up">("down");
  const listRef = useRef<HTMLOListElement>(null);
  const activeRef = useRef(0);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE);
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

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
            {mobile && (s.video || s.shots?.length) ? (
              <figure className="case-step-media">
                {s.video ? (
                  <div className="case-demo-frame">
                    <VideoPlayer src={s.video} />
                  </div>
                ) : (
                  <div className="case-demo-shots">
                    {s.shots!.map((src, n) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={src} src={src} alt={`${s.name} screenshot ${n + 1}`} width={660} height={1434} loading="lazy" decoding="async" />
                    ))}
                  </div>
                )}
                {s.caption ? <figcaption>{s.caption}</figcaption> : null}
              </figure>
            ) : null}
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
