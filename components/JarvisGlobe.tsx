"use client";

// Cobe WebGL globe — https://github.com/shuding/cobe
// Transparent bg, pink land dots matching site accent, Brisbane marker + label

import { useEffect, useRef, useMemo } from "react";
import createGlobe from "cobe";

// Brisbane: lat -27.47, lon 153.03 → phi for cobe
// phi=0 faces ~-180° lon. Each radian = ~57.3°.
// We want lon 153° facing forward → phi ≈ (180-153)*(π/180) then adjust
// Empirically phi ≈ 5.6 shows the Pacific/Australia region on load.
const BRISBANE_LAT = -27.4698;
const BRISBANE_LON = 153.0251;
const START_PHI = 5.6;

// Site colours → cobe [r, g, b] (0–1 range)
// Pink #FF1F8F  → [1, 0.122, 0.561]
// Bg  #FAFAF8  → [0.98, 0.98, 0.973]
const PINK: [number, number, number] = [1, 0.122, 0.561];
const BG: [number, number, number] = [0.98, 0.98, 0.973];

export default function JarvisGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const phiRef = useRef(START_PHI);

  const staticTime = useMemo(() => {
    return new Intl.DateTimeFormat("en-AU", {
      timeZone: "Australia/Brisbane",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date());
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2);
    const w = containerRef.current.clientWidth;
    const h = containerRef.current.clientHeight;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: dpr,
      width: w * dpr,
      height: h * dpr,
      phi: START_PHI,
      theta: 0.28,          // slight southern tilt toward Australia
      dark: 0,              // light mode
      diffuse: 1.1,
      mapSamples: 16000,
      mapBrightness: 8,
      baseColor: PINK,
      markerColor: PINK,
      glowColor: BG,
      scale: 1.08,
      markers: [
        { location: [BRISBANE_LAT, BRISBANE_LON], size: 0.065 },
      ],
      onRender(state) {
        phiRef.current += 0.004;
        state.phi = phiRef.current;
      },
    });

    return () => globe.destroy();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          background: "transparent",
        }}
      />

      {/* Brisbane label — bottom-left, mono-label style */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "10px",
          pointerEvents: "none",
          lineHeight: 1.35,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-jetbrains-mono, monospace)",
            fontSize: "7px",
            fontWeight: 700,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            color: "var(--ink-soft, #6B6B6B)",
            margin: 0,
          }}
        >
          Brisbane, AU
        </p>
        <p
          style={{
            fontFamily: "var(--font-jetbrains-mono, monospace)",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.04em",
            color: "var(--ink, #141414)",
            margin: 0,
          }}
        >
          {staticTime}
        </p>
      </div>
    </div>
  );
}
