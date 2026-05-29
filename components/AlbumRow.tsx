"use client";

/**
 * AlbumRow — a slow 3D carousel of album covers. The covers are thin slabs
 * arranged around a vertical-axis ring, each facing outward, so the ones at the
 * front show their cover and the ones turned to the back show their (dark) back.
 * The ring auto-rotates; there's no idle skew and no scene lighting — the art is
 * rendered unlit at true colour.
 *
 * Hovering an individual cover lifts it out to front-centre, flat-on and a touch
 * closer to the camera. Card-level hover (via useGroupHover) fades in a pink
 * background behind the ring.
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
const CAMERA_Y = 1.5;          // slight elevation so the rear covers' backs show
const RING_R = 2.2;            // carousel radius
const PANEL = 1;               // cover edge length (square)
const THICK = 0.06;            // slab thickness
const SPIN_SPEED = 0.28;       // ring rotation, rad/sec
const PRESENT_Z = 3.2;         // z a hovered cover eases to (closer than the ring front)
const PRESENT_TILT = -0.2;     // tilt to face the slightly-raised camera when presented
const EDGE_COLOR = "#1b1b1b";
const BACK_COLOR = "#262626";

/* ── Real-time resize + keep camera aimed at the ring centre ── */
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
    const cam = camera as THREE.PerspectiveCamera;
    if (w !== last.current.w || h !== last.current.h) {
      last.current = { w, h };
      setSize(w, h);
      if (cam.isPerspectiveCamera) {
        cam.aspect = w / h;
        cam.updateProjectionMatrix();
      }
    }
    cam.lookAt(0, 0, 0);
  });
  return null;
}

/* ── Carousel ──────────────────────────────────────────────── */
function Carousel({ images, onReady }: { images: string[]; onReady: () => void }) {
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
  const slabRefs = useRef<(THREE.Group | null)[]>([]);
  const overIndex = useRef<number | null>(null);
  const overAmts = useRef<number[]>(images.map(() => 0));
  const spin = useRef(0);

  const n = images.length;
  const baseWidth = 2 * RING_R + PANEL; // full horizontal extent of the ring

  useFrame((state, delta) => {
    // Auto-fit the ring to the container (width-driven for landscape, height-
    // clamped for portrait) so nothing clips at the edges across card / hero / mobile.
    const cam = state.camera as THREE.PerspectiveCamera;
    const visH = 2 * CAMERA_Z * Math.tan((cam.fov * Math.PI) / 360);
    const visW = visH * cam.aspect;
    let s = (visW * 0.85) / baseWidth;
    s = Math.min(s, (visH * 0.5) / PANEL);
    if (fitRef.current) fitRef.current.scale.setScalar(s);

    spin.current += delta * SPIN_SPEED;
    const lerp = THREE.MathUtils.lerp;

    for (let i = 0; i < n; i++) {
      const g = slabRefs.current[i];
      if (!g) continue;
      const a = (i * Math.PI * 2) / n + spin.current; // this slab's ring angle

      const oa = overAmts.current;
      oa[i] += ((overIndex.current === i ? 1 : 0) - oa[i]) * 0.12;
      const h = oa[i];

      // Ring pose -> presented pose (front-centre, flat-on, closer).
      const nearestFront = Math.round(a / (Math.PI * 2)) * (Math.PI * 2);
      g.position.x = lerp(Math.sin(a) * RING_R, 0, h);
      g.position.z = lerp(Math.cos(a) * RING_R, PRESENT_Z, h);
      g.rotation.y = lerp(a, nearestFront, h);
      g.rotation.x = lerp(0, PRESENT_TILT, h);
      g.scale.setScalar(1 + h * 0.08);
    }
  });

  return (
    <group ref={fitRef}>
      {images.map((img, i) => (
        <group key={img} ref={(el) => { slabRefs.current[i] = el; }}>
          <mesh
            onPointerOver={(e) => { e.stopPropagation(); overIndex.current = i; }}
            onPointerOut={() => { if (overIndex.current === i) overIndex.current = null; }}
          >
            <boxGeometry args={[PANEL, PANEL, THICK]} />
            {/* Box face order: +x, -x, +y, -y, +z (front cover), -z (back) */}
            <meshBasicMaterial attach="material-0" color={EDGE_COLOR} toneMapped={false} />
            <meshBasicMaterial attach="material-1" color={EDGE_COLOR} toneMapped={false} />
            <meshBasicMaterial attach="material-2" color={EDGE_COLOR} toneMapped={false} />
            <meshBasicMaterial attach="material-3" color={EDGE_COLOR} toneMapped={false} />
            <meshBasicMaterial attach="material-4" map={textures[i]} toneMapped={false} />
            <meshBasicMaterial attach="material-5" color={BACK_COLOR} toneMapped={false} />
          </mesh>
        </group>
      ))}
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
      {/* Pink background — fades in on card hover (canvas is transparent) */}
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
        camera={{ position: [0, CAMERA_Y, CAMERA_Z], fov: CAMERA_FOV, near: 0.1, far: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ position: "absolute", inset: 0 }}
      >
        <LiveResize />
        <Suspense fallback={null}>
          <Carousel images={images} onReady={() => setReady(true)} />
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
