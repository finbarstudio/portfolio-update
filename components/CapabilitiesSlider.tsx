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
import Link from "next/link";
import { gsap } from "gsap";
import CapabilityScene, { type SceneVariant } from "./CapabilityScene";

type Capability = {
  name: string;
  desc: string;
  variant: SceneVariant;
  color: string;
  filter: string;          // /work?filter=<key>
  effect?: "scene" | "glitch" | "typewriter"; // hover treatment (default scene)
};

const CAPABILITIES: Capability[] = [
  { name: "Brand identity", desc: "Logomarks, colour and type, with guidelines to keep it consistent.", variant: "star", color: "#E8718B", filter: "brand", effect: "scene" },
  { name: "Editorial & print", desc: "Publications and print-ready layouts, set in InDesign.", variant: "book", color: "#E0B24A", filter: "editorial", effect: "typewriter" },
  { name: "Web & UI design", desc: "Brand-led websites and interfaces, built detail-first.", variant: "screen", color: "#6E8CB0", filter: "web", effect: "scene" },
  { name: "Creative direction", desc: "Art direction and visual systems across a project.", variant: "studio", color: "#DD8A5C", filter: "art", effect: "scene" },
  { name: "Motion graphics", desc: "Animated assets and short-form video, made in After Effects.", variant: "motion", color: "#6FAE9F", filter: "motion", effect: "glitch" },
  { name: "Social campaigns", desc: "Static and motion sets sized for every channel.", variant: "social", color: "#D17BA0", filter: "motion", effect: "scene" },
];

/* Types the text out on hover; shows it whole at rest. */
function Typewriter({ text, active }: { text: string; active: boolean }) {
  const [n, setN] = useState(text.length);
  useEffect(() => {
    if (!active) { setN(text.length); return; }
    setN(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setN(i);
      if (i >= text.length) clearInterval(id);
    }, 24);
    return () => clearInterval(id);
  }, [active, text]);
  return (
    <span>
      {text.slice(0, n)}
      <span className="tw-caret" style={{ opacity: active && n < text.length ? 1 : 0 }}>▌</span>
    </span>
  );
}

function CapabilityCard({ c, hidden }: { c: Capability; hidden?: boolean }) {
  const effect = c.effect ?? "scene";
  // Mount the 3D canvas on hover; keep it briefly after leaving so it can fade
  // out with the reveal rather than vanishing instantly.
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const unmountTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (unmountTimer.current) clearTimeout(unmountTimer.current); }, []);

  const onEnter = () => {
    if (unmountTimer.current) { clearTimeout(unmountTimer.current); unmountTimer.current = null; }
    setHovered(true);
    if (effect === "scene") setMounted(true);
  };
  const onLeave = () => {
    setHovered(false);
    if (unmountTimer.current) clearTimeout(unmountTimer.current);
    unmountTimer.current = setTimeout(() => setMounted(false), 700);
  };

  return (
    <Link
      href={`/work?filter=${c.filter}`}
      className="cap-card group"
      aria-label={`${c.name} — see this work`}
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      <span className="card-reveal" aria-hidden="true">
        <span className="card-rev c1" />
        <span className="card-rev c2" />
        <span className="card-rev c3" />
      </span>
      {effect === "scene" && (
        <div className="cap-scene" aria-hidden="true">
          {mounted && <CapabilityScene variant={c.variant} color={c.color} />}
        </div>
      )}
      <div className="cap-card-body">
        <h3 className={`cap-name${effect === "glitch" ? " cap-glitch" : ""}`} data-text={c.name}>
          {c.name}
        </h3>
        <p className="cap-desc">
          {effect === "typewriter" ? <Typewriter text={c.desc} active={hovered} /> : c.desc}
        </p>
      </div>
    </Link>
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
    // On touch, don't auto-marquee — let the row scroll natively (swipeable).
    if (window.matchMedia("(hover: none)").matches) return;

    let tween: gsap.core.Tween | undefined;
    const ctx = gsap.context(() => {
      tween = gsap.to(track, { xPercent: -50, duration: 32, ease: "none", repeat: -1 });
    }, trackRef);

    // Keeps scrolling through hover; only pauses when off-screen (perf).
    const io = new IntersectionObserver(
      ([e]) => { if (tween) (e.isIntersecting ? tween.play() : tween.pause()); },
      { rootMargin: "120px" }
    );
    io.observe(root);

    return () => {
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
