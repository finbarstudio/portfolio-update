"use client";

/**
 * CapabilitiesSlider — the "What I do" disciplines as an infinite, auto-scrolling
 * card slider (GSAP). The set is duplicated and the track loops by exactly one
 * set (xPercent -50), so it's seamless. Slows to a stop on hover, pauses
 * off-screen. No-ops under reduced motion (static row).
 *
 * Each card is transparent at rest (no white box, no outline); on hover a pink
 * reveal grows from the centre and a bespoke SVG + GSAP vignette plays BEHIND the
 * text (one per discipline). These are pure SVG/GSAP — no WebGL — so hovering and
 * navigating away never spins up a canvas or janks the page.
 */

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import Link, { useLinkStatus } from "next/link";
import { gsap } from "gsap";
import CapabilityViz, { type VizVariant } from "./CapabilityViz";

/* The hover call-to-action: a bold "SEE WORK" that rises in as the vignette plays
 * (hidden at rest on desktop, always shown on touch). Turns into a spinner the
 * instant the card is tapped so the route change isn't a silent pause.
 * useLinkStatus reads the enclosing <Link>'s navigation state. */
function CapCta() {
  const { pending } = useLinkStatus();
  return (
    <span className={`cap-cta${pending ? " is-loading" : ""}`} aria-hidden="true">
      {pending ? (
        <><span className="cap-spinner" />Loading</>
      ) : (
        <>See work <span className="cap-cta-arrow">&rarr;</span></>
      )}
    </span>
  );
}

type Capability = {
  name: string;
  desc: string;
  variant: VizVariant;
  color: string;
  filter: string;          // /work?filter=<key>
};

const CAPABILITIES: Capability[] = [
  { name: "Brand identity", desc: "Logomarks, colour and type, with guidelines to keep it consistent.", variant: "star", color: "#E8718B", filter: "brand" },
  { name: "Editorial & print", desc: "Publications and print-ready layouts, set in InDesign.", variant: "book", color: "#E0B24A", filter: "editorial" },
  { name: "Web & UI design", desc: "Brand-led websites and interfaces, built detail-first.", variant: "screen", color: "#6E8CB0", filter: "web" },
  { name: "Creative direction", desc: "Art direction and visual systems across a project.", variant: "studio", color: "#DD8A5C", filter: "art" },
  { name: "Motion graphics", desc: "Animated assets and short-form video, made in After Effects.", variant: "motion", color: "#6FAE9F", filter: "motion" },
  { name: "Social campaigns", desc: "Static and motion sets sized for every channel.", variant: "social", color: "#D17BA0", filter: "motion" },
];

function CapabilityCard({ c, hidden }: { c: Capability; hidden?: boolean }) {
  // The vignette is cheap SVG/GSAP, so it's always mounted (paused); hovering
  // just plays its timeline and fades the layer in.
  const [active, setActive] = useState(false);

  return (
    <Link
      href={`/work?filter=${c.filter}`}
      className="cap-card group"
      style={{ "--cap-accent": c.color } as CSSProperties}
      aria-label={`${c.name} — see this work`}
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      <span className="card-reveal" aria-hidden="true">
        <span className="card-rev c1" />
        <span className="card-rev c2" />
        <span className="card-rev c3" />
      </span>
      <div className="cap-scene" aria-hidden="true">
        <CapabilityViz variant={c.variant} color={c.color} active={active} />
      </div>
      <div className="cap-card-body">
        <h3 className="cap-name">{c.name}</h3>
        <div className="cap-foot">
          <p className="cap-desc">{c.desc}</p>
          <CapCta />
        </div>
      </div>
    </Link>
  );
}

export default function CapabilitiesSlider() {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // On touch, don't auto-marquee — let the row scroll natively (swipeable).
    if (window.matchMedia("(hover: none)").matches) return;

    const ctx = gsap.context(() => {
      tweenRef.current = gsap.to(track, { xPercent: -50, duration: 36, ease: "none", repeat: -1 });
    }, trackRef);

    // Pause when off-screen (perf).
    const io = new IntersectionObserver(
      ([e]) => { const t = tweenRef.current; if (t) (e.isIntersecting ? t.play() : t.pause()); },
      { rootMargin: "120px" }
    );
    io.observe(root);

    return () => {
      io.disconnect();
      ctx.revert();
      tweenRef.current = null;
    };
  }, []);

  // Slow the marquee to a stop while hovering so the card under the cursor holds
  // still and its vignette can play fully (otherwise the card slides away and the
  // hover restarts/half-plays).
  const slow = () => { if (tweenRef.current) gsap.to(tweenRef.current, { timeScale: 0, duration: 0.5, ease: "power2.out" }); };
  const resume = () => { if (tweenRef.current) gsap.to(tweenRef.current, { timeScale: 1, duration: 0.7, ease: "power2.out" }); };

  const items = [...CAPABILITIES, ...CAPABILITIES];
  return (
    <div ref={rootRef} className="cap-slider" onPointerEnter={slow} onPointerLeave={resume}>
      <div ref={trackRef} className="cap-track">
        {items.map((c, i) => (
          <CapabilityCard key={i} c={c} hidden={i >= CAPABILITIES.length} />
        ))}
      </div>
    </div>
  );
}
