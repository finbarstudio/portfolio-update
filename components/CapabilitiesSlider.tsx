"use client";

/**
 * CapabilitiesSlider — the "What I do" disciplines as an infinite, auto-scrolling
 * card slider (GSAP). The set is duplicated and the track loops by exactly one
 * set (xPercent -50), so it's seamless. Slows to a stop on hover, pauses
 * off-screen. No-ops under reduced motion (static row).
 *
 * Each card uses the same treatment as the project thumbnails: transparent at
 * rest (no white box, no outline), and on hover a pink reveal grows from the
 * centre while a 3D animation spins BEHIND the text; the outline only draws in
 * once the reveal has finished. The 3D canvas is mounted on hover and torn down
 * shortly after, so at most one or two WebGL contexts are ever live.
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import CapabilityScene, { type SceneVariant } from "./CapabilityScene";

type Capability = {
  name: string;
  desc: string;
  variant: SceneVariant;
  color: string;
};

const CAPABILITIES: Capability[] = [
  { name: "Brand identity", desc: "Logomarks, colour and type, with guidelines to keep it consistent.", variant: "gem", color: "#E8718B" },
  { name: "Editorial & print", desc: "Publications and print-ready layouts, set in InDesign.", variant: "book", color: "#E0B24A" },
  { name: "Web & UI design", desc: "Brand-led websites and interfaces, built detail-first.", variant: "screen", color: "#6E8CB0" },
  { name: "Creative direction", desc: "Art direction and visual systems across a project.", variant: "knot", color: "#DD8A5C" },
  { name: "Motion graphics", desc: "Animated assets and short-form video, made in After Effects.", variant: "ico", color: "#6FAE9F" },
  { name: "Social campaigns", desc: "Static and motion sets sized for every channel.", variant: "ring", color: "#D17BA0" },
];

function CapabilityCard({ c, hidden }: { c: Capability; hidden?: boolean }) {
  // Mount the 3D canvas on hover; keep it briefly after leaving so it can fade
  // out with the reveal rather than vanishing instantly.
  const [mounted, setMounted] = useState(false);
  const unmountTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (unmountTimer.current) clearTimeout(unmountTimer.current); }, []);

  const onEnter = () => {
    if (unmountTimer.current) { clearTimeout(unmountTimer.current); unmountTimer.current = null; }
    setMounted(true);
  };
  const onLeave = () => {
    if (unmountTimer.current) clearTimeout(unmountTimer.current);
    unmountTimer.current = setTimeout(() => setMounted(false), 700);
  };

  return (
    <article
      className="cap-card group"
      aria-hidden={hidden || undefined}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      <span className="card-reveal" aria-hidden="true">
        <span className="card-rev c1" />
        <span className="card-rev c2" />
        <span className="card-rev c3" />
      </span>
      <div className="cap-scene" aria-hidden="true">
        {mounted && <CapabilityScene variant={c.variant} color={c.color} />}
      </div>
      <div className="cap-card-body">
        <h3 className="cap-name">{c.name}</h3>
        <p className="cap-desc">{c.desc}</p>
      </div>
    </article>
  );
}

export default function CapabilitiesSlider() {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let tween: gsap.core.Tween | undefined;
    const ctx = gsap.context(() => {
      tween = gsap.to(track, { xPercent: -50, duration: 32, ease: "none", repeat: -1 });
    }, trackRef);

    const slow = () => { if (tween) gsap.to(tween, { timeScale: 0, duration: 0.5, overwrite: true }); };
    const go = () => { if (tween) gsap.to(tween, { timeScale: 1, duration: 0.5, overwrite: true }); };
    root.addEventListener("pointerenter", slow);
    root.addEventListener("pointerleave", go);

    const io = new IntersectionObserver(
      ([e]) => { if (tween) (e.isIntersecting ? tween.play() : tween.pause()); },
      { rootMargin: "120px" }
    );
    io.observe(root);

    return () => {
      root.removeEventListener("pointerenter", slow);
      root.removeEventListener("pointerleave", go);
      io.disconnect();
      ctx.revert();
    };
  }, []);

  const items = [...CAPABILITIES, ...CAPABILITIES];
  return (
    <div ref={rootRef} className="cap-slider">
      <div ref={trackRef} className="cap-track">
        {items.map((c, i) => (
          <CapabilityCard key={i} c={c} hidden={i >= CAPABILITIES.length} />
        ))}
      </div>
    </div>
  );
}
