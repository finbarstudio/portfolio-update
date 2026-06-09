"use client";

/**
 * AlbumRow — five album covers in a flat row, facing the camera. At rest they're
 * static and unlit (true colour). Hovering a cover brings it to front-centre and
 * scales it up while the others ease slightly smaller and backwards. Card-level
 * hover fades in a light pink background and a gentle moving sheen (a clearcoat
 * highlight lit by a slowly-orbiting light) for a subtle shiny gradient motion.
 */

import { Suspense, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { AlbumWireframe } from "./Wireframe";
import { useGroupHover } from "./useGroupHover";
import { FrameDriver } from "./FrameDriver";
import { useAppReady } from "./useAppReady";

/* ── Tunables ──────────────────────────────────────────────── */
const CAMERA_FOV = 28;
const CAMERA_Z = 11;
const SPACING = 1.25;     // centre-to-centre spacing
const PANEL = 1;          // cover edge length (square)
const FOCUS_SCALE = 0.34; // extra scale for the hovered cover
const FOCUS_Z = 0.5;      // slight forward nudge (kept small so edge covers
                          // don't get magnified past the canvas edge)
const RECEDE_SCALE = 0.12; // how much the others shrink
const RECEDE_Z = 0.6;     // how far back the others go

/* ── Real-time resize ──────────────────────────────────────── */
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

/* ── Row ───────────────────────────────────────────────────── */
function Row({ images, onReady }: { images: string[]; onReady: () => void }) {
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
  const overIndex = useRef<number | null>(null);
  const focusAmts = useRef<number[]>(images.map(() => 0));
  const focusGlobal = useRef(0);

  const n = images.length;
  const baseRowW = (n - 1) * SPACING + PANEL;

  useFrame((state) => {
    // Auto-fit the row to the container.
    const cam = state.camera as THREE.PerspectiveCamera;
    const visH = 2 * CAMERA_Z * Math.tan((cam.fov * Math.PI) / 360);
    const visW = visH * cam.aspect;
    // Leave horizontal margin so the focused cover's zoom doesn't clip at the
    // edges of the canvas.
    let s = (visW * 0.78) / baseRowW;
    s = Math.min(s, (visH * 0.5) / PANEL);
    if (fitRef.current) fitRef.current.scale.setScalar(s);

    // Focus: hovered cover zooms in place + comes forward; others ease smaller
    // and back. No horizontal movement toward the centre.
    focusGlobal.current += ((overIndex.current !== null ? 1 : 0) - focusGlobal.current) * 0.12;
    for (let i = 0; i < n; i++) {
      const g = panelRefs.current[i];
      if (!g) continue;
      const fa = focusAmts.current;
      fa[i] += ((overIndex.current === i ? 1 : 0) - fa[i]) * 0.12;
      const f = fa[i];                                   // this cover is hovered
      const recede = Math.max(0, focusGlobal.current - f); // another is hovered

      g.position.z = f * FOCUS_Z - recede * RECEDE_Z;    // hovered forward, others back
      g.scale.setScalar(1 + f * FOCUS_SCALE - recede * RECEDE_SCALE);
    }
  });

  return (
    <group ref={fitRef}>
      {images.map((img, i) => {
        const x = (i - (n - 1) / 2) * SPACING;
        return (
          <group key={img} position={[x, 0, 0]} ref={(el) => { panelRefs.current[i] = el; }}>
            <mesh
              onPointerOver={(e) => { e.stopPropagation(); overIndex.current = i; }}
              onPointerOut={() => { if (overIndex.current === i) overIndex.current = null; }}
            >
              <planeGeometry args={[PANEL, PANEL]} />
              {/* Unlit — true-colour art, no lighting/sheen. */}
              <meshBasicMaterial map={textures[i]} toneMapped={false} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/* ── Outer ─────────────────────────────────────────────────── */
type Props = {
  /** Album cover image URLs (square). */
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
  // Defer the first canvas init past initial load + stagger vs other mockups.
  const appReady = useAppReady();
  // The row is static at rest, so render on-demand: animate while hovered, plus
  // a short linger so the focus ease-out completes, then stop entirely (0 idle).
  // Starts true so the initial render + auto-fit runs, then settles to idle.
  const [rendering, setRendering] = useState(true);
  useEffect(() => {
    if (hovered) { setRendering(true); return; }
    const t = setTimeout(() => setRendering(false), 1200);
    return () => clearTimeout(t);
  }, [hovered]);

  return (
    <div
      ref={hoverRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        ...(fill ? { height: "100%" } : { aspectRatio }),
        background: "var(--thumb-bg, #e0e0e0)",
        overflow: "hidden",
        cursor: hoverable ? "pointer" : "default",
      }}
    >
      {/* Light pink background, fades in on hover */}
      <div className="mockup-pink-bg" aria-hidden="true" style={{ opacity: hovered ? 1 : 0 }} />

      {(!ready || !appReady) && <AlbumWireframe />}

      {appReady && (
      <Canvas
        frameloop="demand"
        camera={{ position: [0, 0, CAMERA_Z], fov: CAMERA_FOV, near: 0.1, far: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ position: "absolute", inset: 0 }}
      >
        {/* Static at rest → render only while hovered/easing (idle 0). */}
        <FrameDriver active={rendering} idleFps={0} />
        <LiveResize />
        <Suspense fallback={null}>
          <Row images={images} onReady={() => setReady(true)} />
        </Suspense>
      </Canvas>
      )}
    </div>
  );
}

// SSR-safe: r3f + WebGL only run in the browser.
const AlbumRow = dynamic(() => Promise.resolve(AlbumRowInner), {
  ssr: false,
  loading: () => (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "var(--thumb-bg, #e0e0e0)" }}>
      <AlbumWireframe />
    </div>
  ),
});

export default AlbumRow;
