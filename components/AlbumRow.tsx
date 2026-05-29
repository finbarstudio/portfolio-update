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
import Loader from "./Loader";
import { useGroupHover } from "./useGroupHover";

/* ── Tunables ──────────────────────────────────────────────── */
const CAMERA_FOV = 28;
const CAMERA_Z = 11;
const SPACING = 1.25;     // centre-to-centre spacing
const PANEL = 1;          // cover edge length (square)
const FOCUS_SCALE = 0.38; // extra scale for the hovered cover
const FOCUS_Z = 1.3;      // how far forward the hovered cover comes
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
function Row({
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
  const lightRef = useRef<THREE.PointLight>(null);
  const overIndex = useRef<number | null>(null);
  const focusAmts = useRef<number[]>(images.map(() => 0));
  const focusGlobal = useRef(0);
  const sheen = useRef(0);

  const n = images.length;
  const baseRowW = (n - 1) * SPACING + PANEL;

  useFrame((state, delta) => {
    // Auto-fit the row to the container.
    const cam = state.camera as THREE.PerspectiveCamera;
    const visH = 2 * CAMERA_Z * Math.tan((cam.fov * Math.PI) / 360);
    const visW = visH * cam.aspect;
    let s = (visW * 0.85) / baseRowW;
    s = Math.min(s, (visH * 0.5) / PANEL);
    if (fitRef.current) fitRef.current.scale.setScalar(s);

    // Moving sheen — a clearcoat highlight that only appears on card hover.
    const t = state.clock.elapsedTime;
    sheen.current += ((hovered ? 1 : 0) - sheen.current) * 0.07;
    if (lightRef.current) {
      lightRef.current.intensity = sheen.current * 3.2;
      lightRef.current.position.set(Math.sin(t * 0.7) * 4, Math.cos(t * 0.5) * 1.6 + 1, 5);
    }

    // Focus interaction.
    focusGlobal.current += ((overIndex.current !== null ? 1 : 0) - focusGlobal.current) * 0.12;
    const lerp = THREE.MathUtils.lerp;
    for (let i = 0; i < n; i++) {
      const g = panelRefs.current[i];
      if (!g) continue;
      const fa = focusAmts.current;
      fa[i] += ((overIndex.current === i ? 1 : 0) - fa[i]) * 0.12;
      const f = fa[i];                                   // this cover is hovered
      const recede = Math.max(0, focusGlobal.current - f); // another is hovered

      const restX = (i - (n - 1) / 2) * SPACING;
      g.position.x = lerp(restX, 0, f);                  // hovered -> centre
      g.position.z = f * FOCUS_Z - recede * RECEDE_Z;    // hovered forward, others back
      g.scale.setScalar(1 + f * FOCUS_SCALE - recede * RECEDE_SCALE);
    }
  });

  return (
    <group ref={fitRef}>
      <pointLight ref={lightRef} intensity={0} decay={0} color="#ffffff" />
      {images.map((img, i) => {
        const x = (i - (n - 1) / 2) * SPACING;
        return (
          <group key={img} position={[x, 0, 0]} ref={(el) => { panelRefs.current[i] = el; }}>
            <mesh
              onPointerOver={(e) => { e.stopPropagation(); overIndex.current = i; }}
              onPointerOut={() => { if (overIndex.current === i) overIndex.current = null; }}
            >
              <planeGeometry args={[PANEL, PANEL]} />
              {/* Art shown unlit (emissive) for true colour; the clearcoat picks
                  up the moving light as a subtle sheen only when hovered. */}
              <meshPhysicalMaterial
                color="#000000"
                emissive="#ffffff"
                emissiveMap={textures[i]}
                emissiveIntensity={1}
                toneMapped={false}
                roughness={0.5}
                metalness={0}
                clearcoat={0.65}
                clearcoatRoughness={0.22}
                envMapIntensity={0}
              />
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
      {/* Light pink background, fades in on hover */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "color-mix(in srgb, var(--pink) 15%, #ffffff)",
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
        <Suspense fallback={null}>
          <Row images={images} hovered={hovered} onReady={() => setReady(true)} />
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
