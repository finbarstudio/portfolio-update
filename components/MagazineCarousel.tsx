"use client";

/**
 * MagazineCarousel — a 20-page magazine viewed at an isometric angle.
 *
 * Rest state: pages stacked on the right of a central spine. Every few seconds
 * the top page flips left around the spine, revealing the next page beneath.
 * Continuous loop across all 20 pages.
 *
 * Hover state: pages explode out into a horizontal right-to-left carousel,
 * mirroring PhoneCarousel's hover treatment.
 */

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import Loader from "./Loader";

/* ── Tunables ──────────────────────────────────────────────── */

const PAGE_W = 0.46;
const PAGE_H = 0.66;
const STACK_OFFSET = 0.0009;        // z separation between pages within a stack
const FLIP_SECONDS = 3.6;            // seconds per page flip in rest state
const STATE_LERP = 0.045;            // hover transition easing
const HOVER_SPEED = 0.42;            // cycles/sec in hover carousel
const HOVER_SPACING = 0.30;
const HOVER_VISIBLE_HALF = 3;        // ±3 page slots visible from centre
const CAM_Z = 1.4;
const CAM_FOV = 32;
const TILT_X = -Math.PI / 13;        // pitch down — isometric feel
const TILT_Y = Math.PI / 12;         // yaw — isometric feel

/* ── Easing ────────────────────────────────────────────────── */

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/* ── Per-page rest transform ───────────────────────────────── */
// phase ∈ [0, numPages). 0 = page just started flipping.
function restPageTransform(phase: number, numPages: number) {
  // 1. Actively flipping (0 → -π over 1 unit of phase)
  if (phase < 1) {
    const t = easeInOutCubic(phase);
    return { rotY: -Math.PI * t, scale: 1, z: 0 };
  }
  // 2. Recently flipped — visible on the left stack
  if (phase < 5) {
    return { rotY: -Math.PI, scale: 1, z: (phase - 1) * STACK_OFFSET * 0.6 };
  }
  // 3. Hidden mid-cycle — not in the visible window; rotation transitions
  //    invisibly back from -π to 0 over the deep portion of the cycle.
  if (phase < numPages - 5) {
    const t = (phase - 5) / (numPages - 10); // 0..1
    return { rotY: -Math.PI * (1 - t), scale: 0, z: 0 };
  }
  // 4. Right stack waiting — pages near "about to flip" are stacked at front.
  const slotsFromTop = numPages - phase; // 5..0
  return { rotY: 0, scale: 1, z: -slotsFromTop * STACK_OFFSET };
}

/* ── Per-page hover transform ──────────────────────────────── */
// slotFloat ∈ [0, numPages). 0 = centre, increasing values drift left.
function hoverPageTransform(slotFloat: number, numPages: number) {
  // Bring slot into a centred frame where 0 = centre.
  let s = slotFloat;
  if (s > numPages / 2) s -= numPages; // wrap to [-numPages/2, numPages/2)

  const absS = Math.abs(s);
  // Smooth scale fall-off past ±visible half
  let scale = 0;
  let opacity = 0;
  if (absS <= HOVER_VISIBLE_HALF + 1) {
    const k = THREE.MathUtils.clamp(1 - absS / (HOVER_VISIBLE_HALF + 1), 0, 1);
    scale = 0.45 + k * 0.55;
    opacity = k;
  }
  const x = -s * HOVER_SPACING - PAGE_W / 2; // shift left so centre page sits on x=0
  return { x, scale, opacity };
}

/* ── Page mesh ─────────────────────────────────────────────── */

type PageProps = {
  texture: THREE.Texture;
  geometry: THREE.BufferGeometry;
  groupSetter: (g: THREE.Group | null) => void;
  matSetter: (m: THREE.MeshBasicMaterial | null) => void;
};

function Page({ texture, geometry, groupSetter, matSetter }: PageProps) {
  const material = useMemo(() => {
    const m = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      toneMapped: false,
      transparent: true,
      opacity: 1,
    });
    return m;
  }, [texture]);

  useEffect(() => () => { material.dispose(); }, [material]);
  useEffect(() => { matSetter(material); return () => matSetter(null); }, [material, matSetter]);

  return (
    <group ref={groupSetter}>
      <mesh geometry={geometry} material={material} />
    </group>
  );
}

/* ── Magazine ──────────────────────────────────────────────── */

function Magazine({ pages, hovered }: { pages: string[]; hovered: boolean }) {
  const numPages = pages.length;
  const encodedPages = useMemo(() => pages.map(encodeURI), [pages]);
  const textures = useLoader(THREE.TextureLoader, encodedPages) as THREE.Texture[];

  useEffect(() => {
    textures.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.generateMipmaps = false;
      t.anisotropy = 4;
      t.needsUpdate = true;
    });
  }, [textures]);

  // PlaneGeometry pivoted so the left edge sits at x=0 (the spine axis).
  const pageGeometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(PAGE_W, PAGE_H, 1, 1);
    g.translate(PAGE_W / 2, 0, 0);
    return g;
  }, []);

  useEffect(() => () => { pageGeometry.dispose(); }, [pageGeometry]);

  const pageRefs = useRef<(THREE.Group | null)[]>(new Array(numPages).fill(null));
  const matRefs = useRef<(THREE.MeshBasicMaterial | null)[]>(new Array(numPages).fill(null));
  const restProgress = useRef(0);
  const hoverOffset = useRef(0);
  const hoverProgress = useRef(0);

  useFrame((_, delta) => {
    const target = hovered ? 1 : 0;
    hoverProgress.current += (target - hoverProgress.current) * STATE_LERP;
    const h = hoverProgress.current;

    restProgress.current = (restProgress.current + delta / FLIP_SECONDS) % numPages;
    hoverOffset.current = (hoverOffset.current + delta * HOVER_SPEED) % numPages;

    const lerp = THREE.MathUtils.lerp;

    for (let i = 0; i < numPages; i++) {
      const g = pageRefs.current[i];
      const m = matRefs.current[i];
      if (!g) continue;

      // Rest phase: time since page i started its flip.
      const phase = (restProgress.current - i + numPages) % numPages;
      const r = restPageTransform(phase, numPages);

      // Hover: page i's position in the horizontal slot stream.
      const slotFloat = (i - hoverOffset.current + numPages) % numPages;
      const hov = hoverPageTransform(slotFloat, numPages);

      const x = lerp(0, hov.x, h);
      const y = 0;
      const z = lerp(r.z, 0, h);
      const rotY = lerp(r.rotY, 0, h);
      const scale = lerp(r.scale, hov.scale, h);
      g.position.set(x, y, z);
      g.rotation.y = rotY;
      g.scale.setScalar(scale);

      const restOpacity = r.scale > 0.02 ? 1 : 0;
      const opacity = lerp(restOpacity, hov.opacity, h);
      if (m) {
        m.opacity = opacity;
        m.depthWrite = opacity > 0.95;
      }

      g.visible = scale > 0.01 && opacity > 0.01;
    }
  });

  return (
    <group rotation={[TILT_X, TILT_Y, 0]} position={[0, 0.02, 0]}>
      {/* Subtle ground shadow disc — anchors the magazine visually */}
      <mesh position={[0, -PAGE_H / 2 - 0.005, -0.04]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[PAGE_W * 0.9, 32]} />
        <meshBasicMaterial color="#000" transparent opacity={0.06} />
      </mesh>

      {/* Spine — thin dark strip running along the binding axis */}
      <mesh position={[0, 0, 0.001]}>
        <boxGeometry args={[0.012, PAGE_H, 0.022]} />
        <meshStandardMaterial color="#1a1a1c" roughness={0.55} metalness={0.2} />
      </mesh>

      {textures.map((tex, i) => (
        <Page
          key={i}
          texture={tex}
          geometry={pageGeometry}
          groupSetter={(g) => { pageRefs.current[i] = g; }}
          matSetter={(m) => { matRefs.current[i] = m; }}
        />
      ))}
    </group>
  );
}

/* ── Outer component ───────────────────────────────────────── */

type Props = {
  pages: string[];
  aspectRatio?: string;
  fill?: boolean;
  className?: string;
  hoverable?: boolean;
};

function MagazineCarouselInner({
  pages,
  aspectRatio = "3/2",
  fill = false,
  className,
  hoverable = true,
}: Props) {
  const [hovered, setHovered] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={className}
      onPointerEnter={() => hoverable && setHovered(true)}
      onPointerLeave={() => hoverable && setHovered(false)}
      onFocus={() => hoverable && setHovered(true)}
      onBlur={() => hoverable && setHovered(false)}
      style={{
        position: "relative",
        width: "100%",
        ...(fill ? { height: "100%" } : { aspectRatio }),
        background: "var(--color-bg, #FAFAF8)",
        overflow: "hidden",
        cursor: hoverable ? "pointer" : "default",
      }}
    >
      {/* Edge fade — masks pages entering/exiting on both sides */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none",
        background:
          "linear-gradient(to right, var(--color-bg, #FAFAF8) 0%, transparent 5%, transparent 95%, var(--color-bg, #FAFAF8) 100%)",
      }} />
      {!ready && <Loader size={28} />}

      <Canvas
        camera={{ position: [0, 0, CAM_Z], fov: CAM_FOV, near: 0.1, far: 50 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        style={{ position: "absolute", inset: 0 }}
      >
        <ambientLight intensity={0.85} />
        <directionalLight position={[3, 4, 5]} intensity={0.6} />
        <Suspense fallback={null}>
          <Magazine pages={pages} hovered={hovered} />
        </Suspense>
      </Canvas>
    </div>
  );
}

const MagazineCarousel = dynamic(() => Promise.resolve(MagazineCarouselInner), {
  ssr: false,
  loading: () => (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "var(--color-bg, #FAFAF8)",
      }}
    >
      <Loader size={28} />
    </div>
  ),
});

export default MagazineCarousel;
