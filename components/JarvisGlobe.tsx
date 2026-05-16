"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

const CONFIG = {
  globeRadius: 2,
  gridWidth: 120,
  gridHeight: 60,
  colors: {
    background: "#ffffff",
    dots: "#ff2a85",
    marker: "#ff2a85",
    line: "#cccccc",
    labelText: "#111111",
  },
  brisbane: {
    lat: -27.4698,
    lon: 153.0251,
  },
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

function ContinentalGlobe({
  onBrisbanePositionUpdate,
}: {
  onBrisbanePositionUpdate: (pos: THREE.Vector3) => void;
}) {
  const globeGroupRef = useRef<THREE.Group>(null);
  const rawBrisbanePos = useMemo(
    () => latLonToVector3(CONFIG.brisbane.lat, CONFIG.brisbane.lon, CONFIG.globeRadius),
    []
  );

  const geometry = useMemo(() => {
    const worldMap = [
      "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      "000000000000000000000000000000000000000000000000000000000000000111111000000000000000000000000000000000000000000000000000",
      "000000000000000000000000000000000000000000000000000000000111111111111111000000000000000000000000000000000000000000000000",
      "000000000000000000000000111000000000000000000000000000111111111111111111110000000000000000000000000000000000000000000000",
      "000000000000001110000111111110000000000000000000001111111111111111111111111000000000000000000000000000000000000000000000",
      "000000000001111111111111111110000000000000000011111111111111111111111111111110000000000000000000000000000000000000000000",
      "000000000111111111111111111100000000000000011111111111111111111111111111111111100000000000000000000000000000000000000000",
      "000000000011111111111111111000000000000011111111111111111111111111111111111111110000000000000000000000000000000000000000",
      "000000000001111111111111100000000000001111111111111111111111111111111111111111111000000000000000000000000000000000000000",
      "000000000000111111111110000000000001111111111111111111111111111111111111111111111100000000000000000000000000000000000000",
      "000000000000011111110000000000000011111111111111111111111111111111111111111111111110000000000000000000000000000000000000",
      "000000000000001111000000000000000011111111111111111111111111111111111111111111111110000000000000000000000000000000000000",
      "000000000000001110000000000000000001111111111111111111111111111111111111111111111100000000000000000000000000000000000000",
      "000000000000111110000000000000000001111111111111111111111111111111111111111111111000000000000000000000000000000000000000",
      "000000000000111110000000000000000000111111111111111111111111111111111111111111110000000000000000000000000000000000000000",
      "000000000011111100000000000000000000011111111111111111111111111111111111111111000000000000000000000000000000000000000000",
      "000000000111111000000000000000000000001111111111111111111111111111111111111110000000000000000000000000000000000000000000",
      "000000000111110000000000000000000000001111111111111111111111111111111111111000000000000000000000000000000000000000000000",
      "000000000111100000000000000000000000000111111111111111111111111111111111110000000000000000000000000000000000000000000000",
      "000000000111000000000000000000000000000011111111111111111111111111111110000000000000000000000000000000000000000000000011",
      "000000001111000000000000000000000000000001111111111111111111111111111000000000000000000000000000000000011000000000000011",
      "000000001110000000000000000000000000000000111111111111111111111111000000000000000000000000000000000000111100000000000111",
      "000000001100000000000000000000000000000000111111111111111111111000000000000000000000000000000000000011111100000000001111",
      "000000001000000000000000000000000000000000001111111111111111100000000000000000000000000000000000001111111110000000011111",
      "000000011000000000000000000000000000000000001111111111111111000000000000000000000000000000000000011111111110000000111111",
      "000000011000000000000000000000000000000000000111111111111100000000000000000000000000000000000000011111111110000001111111",
      "000000011000000000000000000000000000000000000011111111110000000000000000000000000000000000000000001111111100000111111111",
      "000000011000000000000000000000000000000000000001111111000000000000000000000000000000000000000000000111111000001111111111",
      "000000011000000000000000000000000000000000000000111100000000000000000000000000000000000000000000000001110000001111111111",
      "000000001000000000000000000000000000000000000000011000000000000000000000000000000000000000000000000000000000111111111111",
      "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111110",
      "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111100",
    ];

    const h = worldMap.length;
    const w = worldMap[0].length;
    const pts: number[] = [];

    for (let latIdx = 0; latIdx < h; latIdx++) {
      const lat = 90 - (latIdx / h) * 180;
      for (let lonIdx = 0; lonIdx < w; lonIdx++) {
        if (worldMap[latIdx][lonIdx] === "1") {
          const lon = (lonIdx / w) * 360 - 180;
          const phi = (90 - lat) * (Math.PI / 180);
          const theta = (lon + 180) * (Math.PI / 180);
          const r = CONFIG.globeRadius;
          pts.push(
            -(r * Math.sin(phi) * Math.cos(theta)),
            r * Math.cos(phi),
            r * Math.sin(phi) * Math.sin(theta)
          );
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pts), 3));
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (globeGroupRef.current) {
      globeGroupRef.current.rotation.y += delta * 0.12;
      const vector = rawBrisbanePos.clone();
      vector.applyMatrix4(globeGroupRef.current.matrixWorld);
      onBrisbanePositionUpdate(vector);
    }
  });

  return (
    <group ref={globeGroupRef}>
      <points geometry={geometry}>
        <pointsMaterial
          size={0.045}
          color={CONFIG.colors.dots}
          transparent
          opacity={0.85}
          depthWrite={true}
        />
      </points>
      <mesh position={rawBrisbanePos}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color={CONFIG.colors.marker} />
      </mesh>
    </group>
  );
}

export default function JarvisGlobe() {
  const [brisbane3DPos, setBrisbane3DPos] = useState<THREE.Vector3>(
    new THREE.Vector3()
  );
  const [lineCoords, setLineCoords] = useState<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const staticTime = useMemo(() => {
    return new Intl.DateTimeFormat("en-AU", {
      timeZone: "Australia/Brisbane",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date());
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const labelX = width * 0.75;
    const labelY = height * 0.25;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 6);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();

    const tempV = brisbane3DPos.clone();
    tempV.project(camera);

    const screenX = (tempV.x * 0.5 + 0.5) * width;
    const screenY = (tempV.y * -0.5 + 0.5) * height;

    if (tempV.z <= 1) {
      setLineCoords({ x1: screenX, y1: screenY, x2: labelX, y2: labelY });
    } else {
      setLineCoords(null);
    }
  }, [brisbane3DPos]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: CONFIG.colors.background,
        overflow: "hidden",
        borderRadius: "8px",
      }}
    >
      {/* SVG connector line */}
      {lineCoords && (
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          <line
            x1={lineCoords.x1}
            y1={lineCoords.y1}
            x2={lineCoords.x2}
            y2={lineCoords.y2}
            stroke={CONFIG.colors.line}
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <circle cx={lineCoords.x2} cy={lineCoords.y2} r="3" fill={CONFIG.colors.marker} />
        </svg>
      )}

      {/* Three.js canvas */}
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={1.0} />
        <ContinentalGlobe onBrisbanePositionUpdate={setBrisbane3DPos} />
      </Canvas>

      {/* HUD label */}
      <div
        style={{
          position: "absolute",
          top: "25%",
          left: "75%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 20,
          minWidth: "90px",
          padding: "8px 12px",
          borderLeft: `3px solid ${CONFIG.colors.marker}`,
          background: "rgba(255,255,255,0.9)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          borderRadius: "0 6px 6px 0",
          color: CONFIG.colors.labelText,
          fontFamily: "var(--font-jetbrains-mono, monospace)",
        }}
      >
        <div
          style={{
            fontSize: "8px",
            fontWeight: 600,
            letterSpacing: "1.5px",
            color: "#888",
            marginBottom: "2px",
            textTransform: "uppercase",
          }}
        >
          Brisbane
        </div>
        <div style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "-0.5px" }}>
          {staticTime}
        </div>
      </div>
    </div>
  );
}
