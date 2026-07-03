"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { collageMeta, type CollagePos } from "@/content/toombulCollage";

gsap.registerPlugin(ScrollTrigger);

// Section two: the NEW Bulls mark, same collage layout — but the modern
// register. Dark maroon ground, clean smooth duotone cutouts (no bitmap,
// no boil), and speed: items stream IN toward their slots with a motion
// blur away from the centre, scrubbed to scroll. Cursor parallax stays.
const clean = (key: string) => `/toombul/clean/${key}.png`;

export default function CollageModern({
  layout,
  layoutMobile,
}: {
  layout: CollagePos[];
  layoutMobile?: CollagePos[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [items, setItems] = useState<CollagePos[]>(layout);

  // Phones get their own portrait arrangement.
  useEffect(() => {
    if (!layoutMobile) return;
    const mq = window.matchMedia("(max-width: 700px)");
    const apply = () => setItems(mq.matches ? layoutMobile : layout);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [layout, layoutMobile]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      section.querySelectorAll<HTMLElement>(".tcm-streak, .tc-modern-logo").forEach((el) => {
        el.style.opacity = "1";
        el.style.filter = "none";
      });
      return;
    }

    let cleanup = () => {};
    const ctx = gsap.context(() => {
      const streaks = gsap.utils.toArray<HTMLElement>(section.querySelectorAll(".tcm-streak"));
      const inners = gsap.utils.toArray<HTMLElement>(section.querySelectorAll(".tcm-inner"));
      const logo = section.querySelector<HTMLElement>(".tc-modern-logo");
      if (!streaks.length) return;

      const sr = section.getBoundingClientRect();
      const cx = sr.width / 2, cy = sr.height / 2;

      // stream in from outside, blurred, settling crisp — scrubbed to scroll
      streaks.forEach((el) => {
        const r = el.getBoundingClientRect();
        const ex = r.left - sr.left + r.width / 2 - cx;
        const ey = r.top - sr.top + r.height / 2 - cy;
        const len = Math.max(60, Math.hypot(ex, ey));
        const ux = ex / len, uy = ey / len;
        const from = 300 + len * 1.1;
        gsap.fromTo(
          el,
          { x: ux * from, y: uy * from, opacity: 0, filter: "blur(14px)" },
          {
            x: 0, y: 0, opacity: 1, filter: "blur(0px)",
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 92%", end: "top 18%", scrub: true },
          }
        );
      });
      if (logo) {
        gsap.fromTo(
          logo,
          { scale: 0.55, opacity: 0 },
          {
            scale: 1, opacity: 1, ease: "power2.out",
            scrollTrigger: { trigger: section, start: "top 80%", end: "top 25%", scrub: true },
          }
        );
      }

      // exit scatter — leaving section two, the pieces expand away from the
      // mark and fade (same move as section one), scrubbed to scroll.
      const exits = gsap.utils.toArray<HTMLElement>(section.querySelectorAll(".tcm-exit"));
      exits.forEach((el) => {
        const r = el.getBoundingClientRect();
        const ex = r.left - sr.left + r.width / 2 - cx;
        const ey = r.top - sr.top + r.height / 2 - cy;
        const len = Math.max(60, Math.hypot(ex, ey));
        const ux = ex / len, uy = ey / len;
        const push = 260 + len * 0.9;
        gsap.to(el, {
          x: ux * push,
          y: uy * push,
          opacity: 0,
          ease: "power2.in",
          scrollTrigger: { trigger: section, start: "top top", end: "88% top", scrub: true },
        });
      });
      if (logo) {
        gsap.fromTo(
          logo,
          { scale: 1, opacity: 1 },
          {
            scale: 0.6,
            opacity: 0,
            ease: "power2.in",
            immediateRender: false,
            scrollTrigger: { trigger: section, start: "top top", end: "70% top", scrub: true },
          }
        );
      }

      // cursor parallax — same depth mechanics as section one
      const xs = inners.map((el) => gsap.quickTo(el, "x", { duration: 0.7, ease: "power2" }));
      const ys = inners.map((el) => gsap.quickTo(el, "y", { duration: 0.7, ease: "power2" }));
      const depth = inners.map((el) => parseFloat(el.dataset.w || "10") * 0.9);
      const onMove = (e: PointerEvent) => {
        const r = section.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        inners.forEach((_, i) => { xs[i](-nx * depth[i]); ys[i](-ny * depth[i]); });
      };
      section.addEventListener("pointermove", onMove);
      cleanup = () => section.removeEventListener("pointermove", onMove);
    }, section);

    return () => { cleanup(); ctx.revert(); };
  }, [items]);

  return (
    <section ref={sectionRef} id="two" className="tc-modern">
      {items.map((it) => {
        const meta = collageMeta[it.key];
        if (!meta) return null;
        return (
          <div
            key={it.key}
            className="tcm-wrap"
            style={{
              left: `${it.x}%`,
              top: `${it.y}%`,
              width: `calc(${it.w}vw * var(--para-scale, 1))`,
              transform: it.rot ? `rotate(${it.rot}deg)` : undefined,
              zIndex: it.key === "bradman" ? 10 : 1,
            }}
          >
            <div className="tcm-inner" data-w={it.w}>
              <div className="tcm-exit">
                <div className="tcm-streak">
                  <img src={clean(it.key)} alt={meta.alt} className="tcm-img" draggable={false} loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* The new mark: locked, centred. */}
      <img
        src="/toombul/SVG/5_1.svg"
        alt="Toombul Bulls, established 1882"
        className="tc-modern-logo"
        draggable={false}
      />
    </section>
  );
}
