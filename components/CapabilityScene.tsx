"use client";

/**
 * CapabilityScene — a small, transparent-canvas 3D animation revealed behind a
 * capability card's text on hover. Placeholder geometry per discipline for now
 * (a faceted gem, a book, a screen, a knot, an icosahedron, a ring); these are
 * meant to be swapped for bespoke per-genre models later. Auto-rotates, framed
 * with margin so it never crops. SSR-safe (WebGL is browser-only).
 */

import { useRef } from "react";
import dynamic from "next/dynamic";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

export type SceneVariant = "gem" | "book" | "screen" | "knot" | "ico" | "ring";

function Geometry({ variant }: { variant: SceneVariant }) {
  switch (variant) {
    case "book":
      return <boxGeometry args={[1.5, 2, 0.32]} />;
    case "screen":
      return <boxGeometry args={[2.1, 1.35, 0.12]} />;
    case "knot":
      return <torusKnotGeometry args={[0.78, 0.27, 128, 18]} />;
    case "ico":
      return <icosahedronGeometry args={[1.25, 0]} />;
    case "ring":
      return <torusGeometry args={[0.9, 0.36, 22, 64]} />;
    case "gem":
    default:
      return <dodecahedronGeometry args={[1.2, 0]} />;
  }
}

function Spinner({ variant, color }: { variant: SceneVariant; color: string }) {
  const ref = useRef<Mesh>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.x += dt * 0.28;
    ref.current.rotation.y += dt * 0.42;
  });
  return (
    <mesh ref={ref}>
      <Geometry variant={variant} />
      <meshStandardMaterial color={color} roughness={0.45} metalness={0.08} flatShading />
    </mesh>
  );
}

function Inner({ variant, color }: { variant: SceneVariant; color: string }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 35, near: 0.1, far: 20 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.75} />
      <directionalLight position={[4, 5, 6]} intensity={1.1} />
      <directionalLight position={[-4, -2, -3]} intensity={0.35} />
      <Spinner variant={variant} color={color} />
    </Canvas>
  );
}

const CapabilityScene = dynamic(() => Promise.resolve(Inner), { ssr: false });
export default CapabilityScene;
