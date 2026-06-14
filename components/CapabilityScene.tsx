"use client";

/**
 * CapabilityScene — a small, transparent-canvas 3D scene revealed behind a
 * capability card's text on hover. One bespoke composed scene per discipline:
 *   star    → the finbar✶studio brand mark, extruded (Brand identity)
 *   book    → an open book (Editorial & print)
 *   screen  → a browser window (Web & UI design)
 *   studio  → an art-direction still-life: cube, sphere, cone (Creative direction)
 *   motion  → three rings spinning on different axes (Motion graphics)
 *   social  → a phone with a post + caption (Social campaigns)
 * All auto-animate, framed with margin so they never crop. SSR-safe.
 */

import { useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { STAR_POINTS } from "./brand-star";

export type SceneVariant = "star" | "book" | "screen" | "studio" | "motion" | "social";

const INK = "#211E1A";
const PAPER = "#FBF6EC";

/* ── Brand identity: the extruded brand star ─────────────────── */
function StarScene({ color }: { color: string }) {
  const ref = useRef<THREE.Group>(null);
  const geo = useMemo(() => {
    const pts = STAR_POINTS.trim()
      .split(/\s+/)
      .map((p) => {
        const [x, y] = p.split(",").map(Number);
        // Centre on origin, flip Y (SVG is y-down), scale to ~±1.1.
        return new THREE.Vector2((x - 50) / 38, (50 - y) / 38);
      });
    const shape = new THREE.Shape(pts);
    const g = new THREE.ExtrudeGeometry(shape, {
      depth: 0.45,
      bevelEnabled: true,
      bevelThickness: 0.12,
      bevelSize: 0.1,
      bevelSegments: 3,
    });
    g.center();
    return g;
  }, []);
  useEffect(() => () => geo.dispose(), [geo]);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y = s.clock.elapsedTime * 0.5;
    ref.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.4) * 0.22;
  });
  return (
    <group ref={ref}>
      <mesh geometry={geo}>
        <meshStandardMaterial color={color} roughness={0.38} metalness={0.12} />
      </mesh>
    </group>
  );
}

/* ── Editorial & print: an open book ─────────────────────────── */
function BookScene({ color }: { color: string }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.5) * 0.5;
    ref.current.rotation.x = -0.32 + Math.sin(s.clock.elapsedTime * 0.35) * 0.06;
  });
  return (
    <group ref={ref}>
      {/* spine / cover behind the pages */}
      <mesh position={[0, 0, -0.16]}>
        <boxGeometry args={[2.05, 1.78, 0.18]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      {/* left page, fanned open */}
      <mesh position={[-0.52, 0, 0.02]} rotation={[0, 0.32, 0]}>
        <boxGeometry args={[1.0, 1.62, 0.05]} />
        <meshStandardMaterial color={PAPER} roughness={0.9} />
      </mesh>
      {/* right page */}
      <mesh position={[0.52, 0, 0.02]} rotation={[0, -0.32, 0]}>
        <boxGeometry args={[1.0, 1.62, 0.05]} />
        <meshStandardMaterial color={PAPER} roughness={0.9} />
      </mesh>
    </group>
  );
}

/* ── Web & UI: a browser window ──────────────────────────────── */
function ScreenScene({ color }: { color: string }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.45) * 0.5;
    ref.current.rotation.x = -0.06 + Math.sin(s.clock.elapsedTime * 0.3) * 0.05;
  });
  return (
    <group ref={ref}>
      <RoundedBox args={[2.3, 1.5, 0.12]} radius={0.07} smoothness={4}>
        <meshStandardMaterial color={INK} roughness={0.5} metalness={0.2} />
      </RoundedBox>
      {/* screen face */}
      <mesh position={[0, -0.08, 0.067]}>
        <planeGeometry args={[2.1, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.45} side={THREE.DoubleSide} />
      </mesh>
      {/* chrome bar */}
      <mesh position={[0, 0.55, 0.069]}>
        <planeGeometry args={[2.1, 0.16]} />
        <meshStandardMaterial color={INK} roughness={0.6} side={THREE.DoubleSide} />
      </mesh>
      {/* content lines */}
      <mesh position={[-0.55, 0.18, 0.07]}>
        <planeGeometry args={[0.9, 0.1]} />
        <meshStandardMaterial color={PAPER} roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-0.7, -0.02, 0.07]}>
        <planeGeometry args={[0.6, 0.1]} />
        <meshStandardMaterial color={PAPER} roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/* ── Creative direction: a still-life of primitives ──────────── */
function StudioScene({ color }: { color: string }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y = s.clock.elapsedTime * 0.45;
    ref.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.3) * 0.12;
  });
  return (
    <group ref={ref}>
      <mesh position={[-0.6, -0.1, 0]} rotation={[0.3, 0.4, 0]}>
        <boxGeometry args={[0.85, 0.85, 0.85]} />
        <meshStandardMaterial color={color} roughness={0.5} flatShading />
      </mesh>
      <mesh position={[0.6, 0.28, 0.2]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={INK} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0.18, -0.5, 0.45]} rotation={[0, 0, 0.28]}>
        <coneGeometry args={[0.4, 0.9, 32]} />
        <meshStandardMaterial color={PAPER} roughness={0.7} />
      </mesh>
    </group>
  );
}

/* ── Motion graphics: gyroscope of rings ─────────────────────── */
function MotionScene({ color }: { color: string }) {
  const a = useRef<THREE.Mesh>(null);
  const b = useRef<THREE.Mesh>(null);
  const c = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (a.current) a.current.rotation.x = t * 1.0;
    if (b.current) b.current.rotation.y = t * 1.3;
    if (c.current) { c.current.rotation.z = t * 0.8; c.current.rotation.x = t * 0.5; }
  });
  return (
    <group>
      <mesh ref={a}>
        <torusGeometry args={[1.15, 0.06, 16, 90]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      <mesh ref={b}>
        <torusGeometry args={[0.85, 0.06, 16, 90]} />
        <meshStandardMaterial color={INK} roughness={0.4} />
      </mesh>
      <mesh ref={c}>
        <torusGeometry args={[0.55, 0.06, 16, 90]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
    </group>
  );
}

/* ── Social campaigns: a phone with a post ───────────────────── */
function SocialScene({ color }: { color: string }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.6) * 0.55;
    ref.current.position.y = Math.sin(s.clock.elapsedTime * 0.9) * 0.05;
  });
  return (
    <group ref={ref} rotation={[0.06, 0, 0]}>
      <RoundedBox args={[1.2, 2.1, 0.16]} radius={0.16} smoothness={4}>
        <meshStandardMaterial color={INK} roughness={0.5} metalness={0.2} />
      </RoundedBox>
      {/* screen */}
      <mesh position={[0, 0, 0.085]}>
        <planeGeometry args={[1.0, 1.85]} />
        <meshStandardMaterial color={color} roughness={0.45} side={THREE.DoubleSide} />
      </mesh>
      {/* post */}
      <mesh position={[0, 0.32, 0.09]}>
        <planeGeometry args={[0.74, 0.74]} />
        <meshStandardMaterial color={PAPER} roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
      {/* caption bars */}
      <mesh position={[-0.1, -0.45, 0.09]}>
        <planeGeometry args={[0.54, 0.1]} />
        <meshStandardMaterial color={PAPER} roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-0.22, -0.62, 0.09]}>
        <planeGeometry args={[0.3, 0.1]} />
        <meshStandardMaterial color={PAPER} roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function SceneFor({ variant, color }: { variant: SceneVariant; color: string }) {
  switch (variant) {
    case "book": return <BookScene color={color} />;
    case "screen": return <ScreenScene color={color} />;
    case "studio": return <StudioScene color={color} />;
    case "motion": return <MotionScene color={color} />;
    case "social": return <SocialScene color={color} />;
    case "star":
    default: return <StarScene color={color} />;
  }
}

function Inner({ variant, color }: { variant: SceneVariant; color: string }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 35, near: 0.1, far: 20 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#ffffff", "#b08968", 0.5]} />
      <directionalLight position={[4, 6, 6]} intensity={1.0} />
      <directionalLight position={[-5, -2, -3]} intensity={0.3} />
      <SceneFor variant={variant} color={color} />
    </Canvas>
  );
}

const CapabilityScene = dynamic(() => Promise.resolve(Inner), { ssr: false });
export default CapabilityScene;
