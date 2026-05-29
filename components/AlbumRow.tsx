"use client";

/**
 * AlbumRow — a row of album covers as glossy 3D panels. Each panel skews gently
 * around its own centre on slightly different sine waves, so the (clearcoat +
 * environment) specular slides across the artwork and catches the light. The
 * motion is subtle and the panels stay mostly square-on to the camera.
 *
 * Hover (driven by the parent card via useGroupHover) eases the sway up a touch
 * and fades in a pink background behind the floating covers.
 */

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useTexture } from "@react-three/drei";
import Loader from "./Loader";
import { useGroupHover } from "./useGroupHover";

/* ── Tunables ──────────────────────────────────────────────── */
const CAMERA_FOV = 30;
const CAMERA_Z = 12;
const SPACING = 1.28;        // centre-to-centre distance between panels
const PANEL = 1;             // panel edge length (square album)

// Per-panel motion — all different, all subtle. ampY/ampX in radians.
// baseY/baseX give each a faint static lean so they don't read as identical.
const MOTION = [
  { ampY: 0.17, freqY: 0.42, phY: 0.0, ampX: 0.05, freqX: 0.31, phX: 1.1, baseX:  0.04, baseY: -0.05 },
  { ampY: 0.12, freqY: 0.36, phY: 1.7, ampX: 0.07, freqX: 0.40, phX: 0.3, baseX: -0.03, baseY:  0.05 },
  { ampY: 0.20, freqY: 0.48, phY: 3.0, ampX: 0.04, freqX: 0.27, phX: 2.2, baseX:  0.00, baseY:  0.00 },
  { ampY: 0.13, freqY: 0.39, phY: 4.2, ampX: 0.06, freqX: 0.35, phX: 1.6, baseX:  0.03, baseY:  0.04 },
  { ampY: 0.16, freqY: 0.33, phY: 5.1, ampX: 0.05, freqX: 0.29, phX: 3.3, baseX: -0.04, baseY: -0.03 },
];

/* ── Real-time resize (matches the other mockups) ──────────── */
function LiveResize() {
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);
  const setSize = useThree((s) => s.setSize);
  const last = useRef({ w: 0, h: 0 });
  useFrame(() => {
    const parent = gl.domElement.parentElement;
    if (!parent) return;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    if (w < 1 || h < 1) return;
    if (w !== last.current.w || h !== last.current.h) {
      last.current = { w, h };
      setSize(w, h);
      const cam = camera as THREE.PerspectiveCamera;
      if (cam.isPerspectiveCamera) {
        cam.aspect = w / h;
        cam.updateProjectionMatrix();
      }
    }
  });
  return null;
}

/* ── Panels ────────────────────────────────────────────────── */
function Panels({
  images,
  hovered,
  onReady,
}: {
  images: string[];
  hovered: boolean;
  onReady: () => void;
}) {
  const textures = useTexture(images) as THREE.Texture[];

  useEffect(() => {
    textures.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      t.needsUpdate = true;
    });
    onReady();
  }, [textures, onReady]);

  const fitRef = useRef<THREE.Group>(null);
  const panelRefs = useRef<(THREE.Group | null)[]>([]);
  const hoverAmt = useRef(0);

  const n = images.length;
  const baseRowW = (n - 1) * SPACING + PANEL;

  // Soft drop-shadow sprite (radial gradient drawn to a canvas). Gives each
  // cover a shadow halo so light/white artwork still separates from the page
  // background in the rest state.
  const shadowTex = useMemo(() => {
    if (typeof document === "undefined") return null;
    const S = 128;
    const c = document.createElement("canvas");
    c.width = c.height = S;
    const ctx = c.getContext("2d");
    if (!ctx) return null;
    const g = ctx.createRadialGradient(S / 2, S / 2, S * 0.12, S / 2, S / 2, S * 0.5);
    g.addColorStop(0, "rgba(0,0,0,0.42)");
    g.addColorStop(0.62, "rgba(0,0,0,0.15)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  useFrame((state) => {
    // Auto-fit: scale the whole row to ~90% of the visible width, but never let a
    // panel exceed 60% of the visible height. Keeps 5-in-a-row sensible whether
    // the container is very wide (featured card), 16/9 (case study) or portrait
    // (mobile) — no clipping, no tiny/giant panels.
    const cam = state.camera as THREE.PerspectiveCamera;
    const visH = 2 * CAMERA_Z * Math.tan((cam.fov * Math.PI) / 360);
    const visW = visH * cam.aspect;
    let s = (visW * 0.9) / baseRowW;
    s = Math.min(s, (visH * 0.6) / PANEL);
    if (fitRef.current) fitRef.current.scale.setScalar(s);

    const t = state.clock.elapsedTime;
    hoverAmt.current += ((hovered ? 1 : 0) - hoverAmt.current) * 0.06;
    const boost = 1 + hoverAmt.current * 0.55; // hover lifts the sway slightly
    for (let i = 0; i < n; i++) {
      const g = panelRefs.current[i];
      if (!g) continue;
      const m = MOTION[i % MOTION.length];
      g.rotation.y = m.baseX + Math.sin(t * m.freqY + m.phY) * m.ampY * boost;
      g.rotation.x = m.baseY + Math.cos(t * m.freqX + m.phX) * m.ampX * boost;
    }
  });

  return (
    <group ref={fitRef}>
      {images.map((img, i) => {
        const x = (i - (n - 1) / 2) * SPACING;
        return (
          <group key={img} position={[x, 0, 0]}>
            {/* Static soft shadow (doesn't skew with the cover) */}
            {shadowTex && (
              <mesh position={[0.02, -0.05, -0.08]}>
                <planeGeometry args={[PANEL * 1.5, PANEL * 1.5]} />
                <meshBasicMaterial map={shadowTex} transparent depthWrite={false} toneMapped={false} />
              </mesh>
            )}
            {/* The cover — skews around its own centre to catch the light */}
            <group ref={(el) => { panelRefs.current[i] = el; }}>
              <mesh>
                <planeGeometry args={[PANEL, PANEL]} />
                <meshPhysicalMaterial
                  map={textures[i]}
                  roughness={0.55}
                  metalness={0.0}
                  clearcoat={0.5}
                  clearcoatRoughness={0.16}
                  envMapIntensity={0.18}
                />
              </mesh>
            </group>
          </group>
        );
      })}
    </group>
  );
}

/* ── Outer ─────────────────────────────────────────────────── */
type Props = {
  /** Album cover image URLs (square). Rendered left-to-right. */
  images: string[];
  aspectRatio?: string;
  fill?: boolean;
  className?: string;
  hoverable?: boolean;
};

function AlbumRowInner({
  images,
  aspectRatio = "16/9",
  fill = false,
  className,
  hoverable = true,
}: Props) {
  const { ref: hoverRef, hovered } = useGroupHover<HTMLDivElement>(hoverable);
  const [ready, setReady] = useState(false);

  return (
    <div
      ref={hoverRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        ...(fill ? { height: "100%" } : { aspectRatio }),
        background: "var(--color-bg, #FAFAF8)",
        overflow: "hidden",
        cursor: hoverable ? "pointer" : "default",
      }}
    >
      {/* Pink background — fades in on hover (canvas is transparent so it shows
          through behind the floating covers) */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "var(--pink)",
          opacity: hovered ? 1 : 0,
          transition: "opacity var(--dur-slow, 420ms) var(--ease, ease)",
        }}
      />

      {!ready && <Loader size={28} />}

      <Canvas
        camera={{ position: [0, 0, CAMERA_Z], fov: CAMERA_FOV, near: 0.1, far: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ position: "absolute", inset: 0 }}
      >
        <LiveResize />
        <ambientLight intensity={0.85} />
        <directionalLight position={[-4, 4, 6]} intensity={0.55} />
        <directionalLight position={[5, -2, 3]} intensity={0.18} />
        <Suspense fallback={null}>
          <Environment preset="studio" />
          <Panels images={images} hovered={hovered} onReady={() => setReady(true)} />
        </Suspense>
      </Canvas>
    </div>
  );
}

// SSR-safe: r3f + WebGL only run in the browser.
const AlbumRow = dynamic(() => Promise.resolve(AlbumRowInner), {
  ssr: false,
  loading: () => (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "var(--color-bg, #FAFAF8)" }}>
      <Loader size={28} />
    </div>
  ),
});

export default AlbumRow;
