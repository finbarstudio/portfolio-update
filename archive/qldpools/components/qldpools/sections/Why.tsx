"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WHY_INTRO, REASONS, LICENCES } from "@/app/qldpools/site/sections/kit";

gsap.registerPlugin(ScrollTrigger);

/**
 * Why — "Huge Number 2x2", Finbar's why option 34. (The option set it came from
 * has since been retired; see git history for `options/why-grid.tsx`.)
 * A giant "2,500+" anchors the left third; the
 * remaining four reasons sit as a 2x2 icon grid on the right.
 *
 * Client note: "animate the number" — it counts up from 0 once the section
 * scrolls into view, synced to the site's Lenis ScrollTrigger. The markup
 * always renders the real final value ("2,500+"), so with no JS (or reduced
 * motion) the correct figure is simply there; GSAP only overwrites it once
 * the tween starts.
 */

/* ── Inline icon set (stroke-based, 1.5px, currentColor, 24px) ──────────── */
/* Order matches REASONS: licensed, 2,500+ pools, fixed price, council, warranty */

function IconShield() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function IconLayers() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l9 4.5-9 4.5-9-4.5L12 3z" />
      <path d="M3 12l9 4.5 9-4.5" />
      <path d="M3 16.5l9 4.5 9-4.5" />
    </svg>
  );
}

function IconTag() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 12.5L12.5 20a1.5 1.5 0 01-2.12 0L4 13.62V4h9.62l6.38 6.38a1.5 1.5 0 010 2.12z" />
      <circle cx="8.5" cy="8.5" r="1.5" />
    </svg>
  );
}

function IconDocument() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 3h8l4 4v14H6V3z" />
      <path d="M14 3v4h4" />
      <path d="M9 13h6M9 17h6" />
    </svg>
  );
}

function IconSeal() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="9" r="6" />
      <path d="M9 14.5L7.5 21l4.5-2.5 4.5 2.5-1.5-6.5" />
    </svg>
  );
}

const ICONS = [IconShield, IconLayers, IconTag, IconDocument, IconSeal];

/** The headline figure, pulled straight from REASONS[1]'s own copy
 * ("2,500+ Pools Installed" / "more than 2,500 completed pool
 * installations"). Keep this in sync with kit.tsx if that copy ever changes
 * — never invent a number here. */
const STAT_VALUE = 2500;
const STAT_LABEL = "2,500+";

export default function Why() {
  const sectionRef = useRef<HTMLElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const el = numberRef.current;
    if (!section || !el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const o = { v: 0 };
      gsap.to(o, {
        v: STAT_VALUE,
        duration: 1.6,
        ease: "power2.out",
        snap: { v: 1 },
        onUpdate: () => {
          el.textContent = `${Math.round(o.v).toLocaleString("en-AU")}+`;
        },
        scrollTrigger: { trigger: section, start: "top 70%", once: true },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20"
      aria-label="Why choose us"
    >
      <p className="qpi-caps mb-6" style={{ color: "var(--qpi-blue)", fontSize: 11, letterSpacing: "0.16em" }}>
        {WHY_INTRO.kicker}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-10 md:gap-16 items-center">
        <div>
          <div
            ref={numberRef}
            className="qpi-display leading-none tabular-nums"
            style={{ color: "var(--qpi-blue)", fontSize: "clamp(5rem, 11vw, 8.5rem)" }}
          >
            {STAT_LABEL}
          </div>
          <h3 className="mt-2" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.125rem, 1.8vw, 1.5rem)", fontWeight: 700 }}>
            {REASONS[1]?.title}
          </h3>
          <p className="mt-2" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: 14, lineHeight: 1.6, maxWidth: 460 }}>
            {REASONS[1]?.body}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 md:gap-8">
          {[REASONS[0], REASONS[2], REASONS[3], REASONS[4]].map((r, i) => {
            if (!r) return null;
            const iconIdx = [0, 2, 3, 4][i] ?? 0;
            const Icon = ICONS[iconIdx] ?? IconShield;
            const isLicensed = iconIdx === 0;
            return (
              <div key={r.title}>
                <div style={{ color: "var(--qpi-blue)" }}>
                  <Icon />
                </div>
                <h4 className="mt-2" style={{ color: "var(--qpi-ink)", fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>
                  {r.title}
                </h4>
                {isLicensed ? (
                  <p className="qpi-caps mt-1" style={{ color: "var(--qpi-ink)", opacity: 0.45, fontSize: 9.5, letterSpacing: "0.08em" }}>
                    {LICENCES.qbcc} &middot; {LICENCES.nsw}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
