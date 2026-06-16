"use client";

/**
 * CapabilityViz — the "What I do" hover vignettes. One bespoke SVG + GSAP
 * animation per discipline (no WebGL). Flat by design — solid fills, no
 * gradients/3D shading — but bold and colourful (the discipline accent used big,
 * with ink + paper for contrast) so it never reads dull. Each is a paused timeline
 * scoped to the card; it restarts on hover and pauses on leave. No-ops under
 * reduced motion (the static SVG still shows).
 *
 *   star    → brand mark drawing itself while satellites orbit (Brand identity)
 *   book    → a column of type setting itself, drop-cap first (Editorial & print)
 *   screen  → a UI building block-by-block, a cursor flies in and clicks (Web & UI)
 *   studio  → primitives + a swatch strip floating in balance (Creative direction)
 *   motion  → a ball bouncing with squash/stretch, arcs sweeping (Motion graphics)
 *   social  → a feed grid cascading in, then a like bursts (Social campaigns)
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { STAR_POINTS } from "./brand-star";

export type VizVariant = "star" | "book" | "screen" | "studio" | "motion" | "social";

const INK = "#211E1A";
const PAPER = "#FBF6EC";

function reduced() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const wrap = "cap-viz-wrap";
const svgProps = { className: "cap-viz", viewBox: "0 0 220 180", preserveAspectRatio: "xMidYMid meet" } as const;

function useViz(active: boolean, build: (root: HTMLDivElement) => gsap.core.Timeline | undefined) {
  const ref = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root || reduced()) return;
    const ctx = gsap.context(() => {
      const t = build(root);
      if (t) { t.pause(0); tl.current = t; }
    }, root);
    return () => { ctx.revert(); tl.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const t = tl.current;
    if (!t) return;
    if (active) t.restart(); else t.pause(0);
  }, [active]);
  return ref;
}

/* ── Brand identity ──────────────────────────────────────────── */
function BrandViz({ color, active }: { color: string; active: boolean }) {
  const ref = useViz(active, (root) => {
    const star = root.querySelector<SVGPolygonElement>(".bv-star");
    if (!star) return;
    const len = star.getTotalLength();
    const tl = gsap.timeline();
    tl.to(".bv-spin", { rotation: 360, svgOrigin: "110 90", duration: 16, ease: "none", repeat: -1 }, 0);
    tl.fromTo(".bv-star", { strokeDashoffset: len, strokeDasharray: len, opacity: 0.3 }, { strokeDashoffset: 0, opacity: 1, duration: 1.2, ease: "power2.inOut" }, 0);
    tl.fromTo(".bv-dot", { scale: 0, transformOrigin: "center" }, { scale: 1, duration: 0.5, stagger: 0.16, ease: "back.out(2.6)" }, 0.35);
    tl.fromTo(".bv-ring", { scale: 0.7, opacity: 0, transformOrigin: "110px 90px" }, { scale: 1, opacity: 1, duration: 1, ease: "power2.out" }, 0.1);
    return tl;
  });
  return (
    <div ref={ref} className={wrap}>
      <svg {...svgProps}>
        <g className="bv-spin">
          <circle className="bv-ring" cx="110" cy="90" r="60" fill="none" stroke={color} strokeWidth="2" />
          <circle className="bv-dot" cx="110" cy="28" r="6" fill={color} />
          <circle className="bv-dot" cx="162" cy="120" r="6" fill={INK} />
          <circle className="bv-dot" cx="58" cy="120" r="6" fill={color} />
        </g>
        <g transform="translate(63,43) scale(0.94)">
          <polygon className="bv-star" points={STAR_POINTS} fill="none" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

/* ── Editorial & print ───────────────────────────────────────── */
function EditorialViz({ color, active }: { color: string; active: boolean }) {
  const ref = useViz(active, () => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.9 });
    tl.fromTo(".ev-cap", { scale: 0, rotation: -30, transformOrigin: "center" }, { scale: 1, rotation: 0, duration: 0.5, ease: "back.out(2.2)" });
    tl.fromTo(".ev-line", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.5, stagger: 0.1, ease: "power3.out" }, "-=0.2");
    tl.to(".ev-line", { opacity: 0.3, duration: 0.35, stagger: 0.04 }, "+=0.8");
    tl.to(".ev-cap", { opacity: 0.3, duration: 0.35 }, "<");
    return tl;
  });
  const lines = [
    { y: 46, w: 92 }, { y: 60, w: 110 }, { y: 74, w: 78 },
    { y: 96, w: 110 }, { y: 110, w: 102 }, { y: 124, w: 64 },
  ];
  return (
    <div ref={ref} className={wrap}>
      <svg {...svgProps}>
        <rect className="ev-cap" x="44" y="40" width="30" height="30" rx="3" fill={color} />
        {lines.map((l, i) => (
          <rect key={i} className="ev-line" x={i < 3 ? 82 : 44} y={l.y} width={l.w} height="6" rx="3" fill={i % 3 === 0 ? color : INK} />
        ))}
      </svg>
    </div>
  );
}

/* ── Web & UI ────────────────────────────────────────────────── */
function WebViz({ color, active }: { color: string; active: boolean }) {
  const ref = useViz(active, (root) => {
    const win = root.querySelector<SVGRectElement>(".wv-win");
    if (!win) return;
    const len = win.getTotalLength();
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.7 });
    tl.fromTo(".wv-win", { strokeDashoffset: len, strokeDasharray: len }, { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" }, 0);
    tl.fromTo(".wv-dot", { scale: 0, transformOrigin: "center" }, { scale: 1, duration: 0.3, stagger: 0.07, ease: "back.out(2)" }, "-=0.35");
    tl.fromTo(".wv-block", { scaleY: 0, opacity: 0, transformOrigin: "top left" }, { scaleY: 1, opacity: 1, duration: 0.4, stagger: 0.1, ease: "power2.out" }, "-=0.1");
    tl.fromTo(".wv-cursor", { x: 54, y: -16, opacity: 0 }, { opacity: 1, duration: 0.2 });
    tl.to(".wv-cursor", { x: 0, y: 0, duration: 0.6, ease: "power2.inOut" });
    tl.to(".wv-btn", { scale: 0.9, transformOrigin: "center", duration: 0.12, yoyo: true, repeat: 1, ease: "power1.inOut" }, "-=0.05");
    tl.fromTo(".wv-ripple", { scale: 0, opacity: 0.6, transformOrigin: "center" }, { scale: 2.4, opacity: 0, duration: 0.55, ease: "power2.out" }, "<");
    tl.to({}, { duration: 0.5 });
    return tl;
  });
  return (
    <div ref={ref} className={wrap}>
      <svg {...svgProps}>
        <rect className="wv-win" x="42" y="36" width="136" height="108" rx="9" fill={PAPER} stroke={INK} strokeWidth="2.4" />
        <circle className="wv-dot" cx="56" cy="49" r="3.4" fill={color} />
        <circle className="wv-dot" cx="66" cy="49" r="3.4" fill={INK} opacity="0.45" />
        <circle className="wv-dot" cx="76" cy="49" r="3.4" fill={INK} opacity="0.45" />
        <rect className="wv-block" x="54" y="64" width="112" height="30" rx="4" fill={color} />
        <rect className="wv-block" x="54" y="100" width="70" height="6" rx="3" fill={INK} />
        <rect className="wv-block" x="54" y="110" width="92" height="6" rx="3" fill={INK} opacity="0.5" />
        <g className="wv-btn-wrap">
          <rect className="wv-btn" x="54" y="122" width="44" height="14" rx="7" fill={INK} />
          <circle className="wv-ripple" cx="76" cy="129" r="8" fill={color} />
        </g>
        <path className="wv-cursor" d="M0 0 L0 16 L4.5 12 L7.5 18 L10 16.5 L7 11 L13 11 Z"
          transform="translate(72 122)" fill={PAPER} stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ── Creative direction ──────────────────────────────────────── */
function StudioViz({ color, active }: { color: string; active: boolean }) {
  const ref = useViz(active, () => {
    const tl = gsap.timeline();
    tl.fromTo([".av-c", ".av-s", ".av-t"], { scale: 0, transformOrigin: "center" }, { scale: 1, duration: 0.6, stagger: 0.12, ease: "back.out(2)" }, 0);
    tl.fromTo(".av-sw", { scaleY: 0, transformOrigin: "bottom" }, { scaleY: 1, duration: 0.5, stagger: 0.08, ease: "back.out(2.4)" }, 0.2);
    tl.to(".av-c", { y: -12, duration: 2.2, yoyo: true, repeat: -1, ease: "sine.inOut" }, 0.6);
    tl.to(".av-s", { rotation: 35, transformOrigin: "center", duration: 3, yoyo: true, repeat: -1, ease: "sine.inOut" }, 0.6);
    tl.to(".av-t", { y: 10, rotation: -20, transformOrigin: "center", duration: 2.6, yoyo: true, repeat: -1, ease: "sine.inOut" }, 0.6);
    return tl;
  });
  return (
    <div ref={ref} className={wrap}>
      <svg {...svgProps}>
        <circle className="av-c" cx="72" cy="64" r="24" fill={color} />
        <rect className="av-s" x="120" y="44" width="42" height="42" rx="4" fill="none" stroke={INK} strokeWidth="3" />
        <polygon className="av-t" points="110,128 134,86 158,128" fill={INK} />
        <rect className="av-sw" x="48" y="108" width="16" height="26" rx="2" fill={color} />
        <rect className="av-sw" x="68" y="108" width="16" height="26" rx="2" fill={INK} />
        <rect className="av-sw" x="88" y="108" width="16" height="26" rx="2" fill={color} opacity="0.5" />
      </svg>
    </div>
  );
}

/* ── Motion graphics ─────────────────────────────────────────── */
function MotionViz({ color, active }: { color: string; active: boolean }) {
  const ref = useViz(active, () => {
    const tl = gsap.timeline();
    tl.to(".mv-arc1", { rotation: 360, svgOrigin: "110 90", duration: 5, ease: "none", repeat: -1 }, 0);
    tl.to(".mv-arc2", { rotation: -360, svgOrigin: "110 90", duration: 8, ease: "none", repeat: -1 }, 0);
    const b = gsap.timeline({ repeat: -1 });
    b.to(".mv-ball", { y: 46, duration: 0.5, ease: "power2.in" })
      .to(".mv-ball", { scaleX: 1.4, scaleY: 0.6, transformOrigin: "center bottom", duration: 0.1, ease: "power2.out" })
      .to(".mv-ball", { scaleX: 1, scaleY: 1, duration: 0.12 })
      .to(".mv-ball", { y: 0, duration: 0.55, ease: "power2.out" })
      .to(".mv-ball", { scaleX: 0.86, scaleY: 1.14, transformOrigin: "center", duration: 0.12, yoyo: true, repeat: 1 }, "<");
    const s = gsap.timeline({ repeat: -1 });
    s.to(".mv-shadow", { scaleX: 1.5, opacity: 0.45, transformOrigin: "center", duration: 0.5, ease: "power2.in" })
      .to(".mv-shadow", { scaleX: 0.8, opacity: 0.18, duration: 0.79, ease: "power2.out" });
    tl.add(b, 0).add(s, 0);
    return tl;
  });
  return (
    <div ref={ref} className={wrap}>
      <svg {...svgProps}>
        <circle className="mv-arc1" cx="110" cy="90" r="64" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeDasharray="70 230" />
        <circle className="mv-arc2" cx="110" cy="90" r="50" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" strokeDasharray="40 274" opacity="0.55" />
        <ellipse className="mv-shadow" cx="110" cy="142" rx="22" ry="5" fill={INK} opacity="0.22" />
        <circle className="mv-ball" cx="110" cy="78" r="18" fill={color} />
      </svg>
    </div>
  );
}

/* ── Social campaigns ────────────────────────────────────────── */
function SocialViz({ color, active }: { color: string; active: boolean }) {
  const ref = useViz(active, () => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 });
    tl.fromTo(".sv-tile", { scale: 0, opacity: 0, transformOrigin: "center" }, { scale: 1, opacity: 1, duration: 0.42, ease: "back.out(1.8)", stagger: { each: 0.05, grid: [3, 3], from: "center" } });
    tl.fromTo(".sv-heart", { scale: 0, transformOrigin: "center" }, { scale: 1, duration: 0.45, ease: "back.out(3.5)" }, "+=0.15");
    tl.fromTo(".sv-spark", { scale: 0, opacity: 1, transformOrigin: "center" }, { scale: 1, opacity: 0, duration: 0.55, ease: "power2.out", stagger: 0 }, "<0.05");
    tl.to(".sv-tile", { opacity: 0.35, duration: 0.35, stagger: { each: 0.03, grid: [3, 3], from: "edges" } }, "+=0.6");
    tl.to(".sv-heart", { opacity: 0.35, duration: 0.35 }, "<");
    return tl;
  });
  const tiles: { x: number; y: number; fill: string; o?: number }[] = [];
  const cols = [60, 96, 132];
  const rows = [40, 76, 112];
  rows.forEach((y, r) => cols.forEach((x, c) => {
    const i = r * 3 + c;
    tiles.push({ x, y, fill: i % 3 === 0 ? color : i % 3 === 1 ? INK : color, o: i % 3 === 2 ? 0.45 : 1 });
  }));
  const sparks = [[110, 70], [110, 110], [78, 90], [142, 90], [86, 70], [134, 70]];
  return (
    <div ref={ref} className={wrap}>
      <svg {...svgProps}>
        {tiles.map((t, i) => (
          <rect key={i} className="sv-tile" x={t.x} y={t.y} width="28" height="28" rx="5" fill={t.fill} opacity={t.o} />
        ))}
        {sparks.map(([cx, cy], i) => (
          <circle key={i} className="sv-spark" cx={cx} cy={cy} r="3.4" fill={color} />
        ))}
        <path className="sv-heart"
          d="M110 104 C 96 92, 86 100, 96 110 L110 122 L124 110 C134 100, 124 92, 110 104 Z"
          fill={color} stroke={PAPER} strokeWidth="2" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export default function CapabilityViz({ variant, color, active }: { variant: VizVariant; color: string; active: boolean }) {
  switch (variant) {
    case "book": return <EditorialViz color={color} active={active} />;
    case "screen": return <WebViz color={color} active={active} />;
    case "studio": return <StudioViz color={color} active={active} />;
    case "motion": return <MotionViz color={color} active={active} />;
    case "social": return <SocialViz color={color} active={active} />;
    case "star":
    default: return <BrandViz color={color} active={active} />;
  }
}
