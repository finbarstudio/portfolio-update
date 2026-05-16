"use client";

// JARVIS Globe — adapted for sidebar use
// Rotating dotted globe with Brisbane marker + live time
// Dynamically imported (no SSR) via Sidebar.tsx

import React, { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";

const CONFIG = {
  globeRadius: 2,
  dotCount: 3000,
  colors: {
    dots: "var(--teal, #4DA8E0)",
    glow: "var(--teal, #4DA8E0)",
    labelBorder: "var(--teal, #4DA8E0)",
    labelText: "#dffaff",
    line: "var(--teal, #4DA8E0)",
  },
  brisbane: { lat: -27.4698, lon: 153.0251 },
};

function latLonToVector3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function GlobeDots() {
  const meshRef = useRef<THREE.Points>(null);

  // Build geometry imperatively to avoid R3F bufferAttribute JSX issues
  const geometry = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i < CONFIG.dotCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = CONFIG.globeRadius;
      pts.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pts), 3));
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.18;
  });

  return (
    <points ref={meshRef} geometry={geometry}>
      <pointsMaterial
        size={0.025}
        color="#4DA8E0"
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  );
}

function BrisbaneMarker() {
  const groupRef = useRef<THREE.Group>(null);
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-AU", {
      timeZone: "Australia/Brisbane",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const pos = useMemo(
    () => latLonToVector3(CONFIG.brisbane.lat, CONFIG.brisbane.lon, CONFIG.globeRadius),
    []
  );

  useFrame(() => {
    if (groupRef.current) groupRef.current.lookAt(0, 0, 0);
  });

  return (
    <group ref={groupRef} position={pos}>
      {/* Marker dot */}
      <mesh>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial color="#4DA8E0" />
      </mesh>

      {/* Connector line */}
      <mesh position={[0.55, 0.1, 0]}>
        <boxGeometry args={[1.1, 0.004, 0.004]} />
        <meshBasicMaterial color="#4DA8E0" />
      </mesh>

      {/* HTML label — rendered as DOM node inside the canvas */}
      <Html position={[1.15, 0.1, 0]} center>
        <div
          style={{
            minWidth: "100px",
            padding: "6px 10px",
            border: "1px solid rgba(77,168,224,0.6)",
            background: "rgba(1, 4, 9, 0.75)",
            backdropFilter: "blur(8px)",
            borderRadius: "6px",
            color: "#dffaff",
            fontFamily: "var(--font-jetbrains-mono, monospace)",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          <div
            style={{
              fontSize: "8px",
              letterSpacing: "1.5px",
              opacity: 0.6,
              marginBottom: "3px",
              textTransform: "uppercase",
            }}
          >
            Brisbane
          </div>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.5px",
            }}
          >
            {time}
          </div>
        </div>
      </Html>
    </group>
  );
}

export default function JarvisGlobe() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "radial-gradient(circle at 50% 60%, #07111f 0%, #010409 75%)",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <Canvas camera={{ position: [0, 0, 6], fov: 42 }}>
        <ambientLight intensity={0.4} />
        <GlobeDots />
        <BrisbaneMarker />
        <OrbitControls
          enableZoom={false}
          autoRotate={false}
          enablePan={false}
        />
      </Canvas>
    </div>
  );
}
