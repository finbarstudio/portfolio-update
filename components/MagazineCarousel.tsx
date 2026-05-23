"use client";

/**
 * MagazineCarousel — flat right-to-left page carousel.
 *
 * Pages laid out flat at integer slots, advancing right-to-left with a
 * dwell at each slot for legibility. No hover state, no book mode.
 */

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import Loader from "./Loader";

/* ── Tunables ──────────────────────────────────────────────── */

const PAGE_WIDTH = 1.28;
const PAGE_HEIGHT = 1.71;

const CAM_Y = 0;
const CAM_Z = 2.5;

const CAROUSEL_SPEED = 0.30;          // slot units / sec
const CAROUSEL_DWELL_PORTION = 0.40;  // fraction of each step pages hold still
const CAROUSEL_SPACING = 1.55;
const CAROUSEL_VISIBLE_HALF = 2.5;
const CAROUSEL_SCALE_BASE = 0.70;     // base scale of far pages
const CAROUSEL_SCALE_RANGE = 0.30;    // additional scale at centre slot

/* ── Carousel easing: dwell at each integer slot for legibility ─ */
function easedCarouselOffset(raw: number): number {
  const intPart = Math.floor(raw);
  const frac = raw - intPart;
  if (frac < CAROUSEL_DWELL_PORTION) return intPart;
  const t = (frac - CAROUSEL_DWELL_PORTION) / (1 - CAROUSEL_DWELL_PORTION);
  return intPart + t * t * (3 - 2 * t);
}

/* ── Page geometry (flat plane) ────────────────────────────── */

const pageGeometry = new THREE.PlaneGeometry(PAGE_WIDTH, PAGE_HEIGHT);

/* ── Single page ───────────────────────────────────────────── */

function Page({
  number,
  totalSheets,
  texture,
  offsetRef,
}: {
  number: number;
  totalSheets: number;
  texture: THREE.Texture;
  offsetRef: React.MutableRefObject<number>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: false,
      }),
    [texture]
  );

  useEffect(() => {
    return () => material.dispose();
  }, [material]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const N = totalSheets;
    const easedOffset = easedCarouselOffset(offsetRef.current);
    let slot = ((number - easedOffset) % N + N) % N;
    if (slot > N / 2) slot -= N;
    const absS = Math.abs(slot);
    let scale = 0;
    if (absS <= CAROUSEL_VISIBLE_HALF + 1) {
      const k = THREE.MathUtils.clamp(1 - absS / (CAROUSEL_VISIBLE_HALF + 1), 0, 1);
      scale = CAROUSEL_SCALE_BASE + k * CAROUSEL_SCALE_RANGE;
    }
    const targetX = -slot * CAROUSEL_SPACING;
    meshRef.current.position.x = THREE.MathUtils.damp(
      meshRef.current.position.x, targetX, 6, delta
    );
    const s = THREE.MathUtils.damp(meshRef.current.scale.x, scale, 6, delta);
    meshRef.current.scale.setScalar(Math.max(s, 0.0001));
  });

  return <mesh ref={meshRef} geometry={pageGeometry} material={material} />;
}

/* ── Carousel: loads textures, drives the auto-advance ─────── */

function Carousel({ pages }: { pages: string[] }) {
  const texPaths = useMemo(() => pages.map(encodeURI), [pages]);
  const textures = useLoader(THREE.TextureLoader, texPaths) as THREE.Texture[];

  useEffect(() => {
    textures.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.minFilter = THREE.LinearMipmapLinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.generateMipmaps = true;
      t.anisotropy = 16;
      t.needsUpdate = true;
    });
  }, [textures]);

  const offsetRef = useRef(0);
  useFrame((_, delta) => {
    offsetRef.current = (offsetRef.current + delta * CAROUSEL_SPEED) % Math.max(pages.length, 1);
  });

  return (
    <group position={[0, 0, 0]}>
      {pages.map((_, i) => (
        <Page
          key={i}
          number={i}
          totalSheets={pages.length}
          texture={textures[i]}
          offsetRef={offsetRef}
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
};

function MagazineCarouselInner({
  pages,
  aspectRatio = "3/2",
  fill = false,
  className,
}: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        ...(fill ? { height: "100%" } : { aspectRatio }),
        background: "var(--color-bg, #FAFAF8)",
        overflow: "hidden",
      }}
    >
      {/* Edge fade — masks pages entering/exiting on both sides */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none",
        background:
          "linear-gradient(to right, var(--color-bg, #FAFAF8) 0%, transparent 6%, transparent 94%, var(--color-bg, #FAFAF8) 100%)",
      }} />
      {!ready && <Loader size={28} />}

      <Canvas
        shadows={false}
        camera={{ position: [0, CAM_Y, CAM_Z], fov: 42, near: 0.1, far: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ position: "absolute", inset: 0 }}
      >
        <Suspense fallback={null}>
          <Carousel pages={pages} />
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
