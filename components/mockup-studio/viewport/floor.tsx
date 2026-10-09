"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  CanvasTexture,
  Fog,
  type Mesh,
  MeshStandardMaterial,
  RepeatWrapping,
  SRGBColorSpace,
} from "three";
import { useStudio } from "@/lib/mockup-studio/scene/store";
import type { FloorKind } from "@/lib/mockup-studio/scene/types";
import type { ViewportRuntime } from "./runtime";

/**
 * A ground plane under the device for things that stand on the street or a desk. The surfaces are drawn, not
 * downloaded: a tiled square of concrete, asphalt or boards painted once into a canvas, with a matching roughness
 * map, so the spots catch a real sheen and the device drops a real shadow onto it.
 */

const SIZE = 30;
/** World units each painted tile covers. */
const TILE = 2.4;
const PIXELS = 1024;

interface Painted {
  map: CanvasTexture;
  roughnessMap: CanvasTexture;
  roughness: number;
  metalness: number;
}

function texture(canvas: HTMLCanvasElement, srgb: boolean): CanvasTexture {
  const map = new CanvasTexture(canvas);
  map.wrapS = RepeatWrapping;
  map.wrapT = RepeatWrapping;
  map.repeat.set(SIZE / TILE, SIZE / TILE);
  map.anisotropy = 8;
  if (srgb) map.colorSpace = SRGBColorSpace;
  return map;
}

function canvas(): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement("canvas");
  c.width = PIXELS;
  c.height = PIXELS;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("No 2d context for the floor");
  return [c, ctx];
}

/** A seeded generator, so the floor looks the same every time it is drawn. */
function random(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Soft blotches at several scales: the uneven tone of a poured or rolled surface. */
function blotches(
  ctx: CanvasRenderingContext2D,
  rand: () => number,
  count: number,
  light: string,
  dark: string,
  radius: [number, number],
) {
  for (let i = 0; i < count; i++) {
    const r = radius[0] + rand() * (radius[1] - radius[0]);
    const x = rand() * PIXELS;
    const y = rand() * PIXELS;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, rand() > 0.5 ? light : dark);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    // Drawn four times across the edges so the tile wraps without a seam.
    for (const dx of [0, PIXELS, -PIXELS])
      for (const dy of [0, PIXELS, -PIXELS]) {
        ctx.beginPath();
        ctx.arc(x + dx, y + dy, r, 0, Math.PI * 2);
        ctx.fill();
      }
  }
}

function speckle(
  ctx: CanvasRenderingContext2D,
  rand: () => number,
  count: number,
  light: string,
  dark: string,
  size: number,
) {
  for (let i = 0; i < count; i++) {
    ctx.fillStyle = rand() > 0.5 ? light : dark;
    ctx.fillRect(rand() * PIXELS, rand() * PIXELS, size, size);
  }
}

function concrete(): Painted {
  const rand = random(7);
  const [c, ctx] = canvas();
  ctx.fillStyle = "#8f8d89";
  ctx.fillRect(0, 0, PIXELS, PIXELS);
  blotches(
    ctx,
    rand,
    60,
    "rgba(190,188,182,0.35)",
    "rgba(80,78,74,0.3)",
    [80, 300],
  );
  blotches(
    ctx,
    rand,
    300,
    "rgba(200,198,192,0.18)",
    "rgba(60,58,55,0.2)",
    [8, 40],
  );
  speckle(ctx, rand, 24000, "rgba(220,218,212,0.5)", "rgba(40,40,38,0.45)", 2);
  // A faint saw-cut joint across the middle of each tile, like paving.
  ctx.strokeStyle = "rgba(40,40,38,0.55)";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(0, PIXELS / 2);
  ctx.lineTo(PIXELS, PIXELS / 2);
  ctx.moveTo(PIXELS / 2, 0);
  ctx.lineTo(PIXELS / 2, PIXELS);
  ctx.stroke();

  const [r, rctx] = canvas();
  rctx.fillStyle = "#d8d8d8";
  rctx.fillRect(0, 0, PIXELS, PIXELS);
  blotches(
    rctx,
    random(8),
    120,
    "rgba(255,255,255,0.4)",
    "rgba(120,120,120,0.4)",
    [40, 200],
  );
  return {
    map: texture(c, true),
    roughnessMap: texture(r, false),
    roughness: 0.92,
    metalness: 0,
  };
}

function asphalt(): Painted {
  const rand = random(21);
  const [c, ctx] = canvas();
  ctx.fillStyle = "#2a2a2c";
  ctx.fillRect(0, 0, PIXELS, PIXELS);
  blotches(
    ctx,
    rand,
    40,
    "rgba(70,70,72,0.3)",
    "rgba(10,10,10,0.35)",
    [100, 320],
  );
  speckle(ctx, rand, 60000, "rgba(120,120,118,0.55)", "rgba(0,0,0,0.6)", 2);
  speckle(ctx, rand, 6000, "rgba(170,168,160,0.35)", "rgba(0,0,0,0.5)", 3);

  const [r, rctx] = canvas();
  rctx.fillStyle = "#e4e4e4";
  rctx.fillRect(0, 0, PIXELS, PIXELS);
  blotches(
    rctx,
    random(22),
    80,
    "rgba(255,255,255,0.3)",
    "rgba(150,150,150,0.5)",
    [60, 240],
  );
  speckle(
    rctx,
    random(23),
    20000,
    "rgba(255,255,255,0.4)",
    "rgba(120,120,120,0.4)",
    2,
  );
  return {
    map: texture(c, true),
    roughnessMap: texture(r, false),
    roughness: 0.96,
    metalness: 0,
  };
}

function wood(): Painted {
  const rand = random(33);
  const [c, ctx] = canvas();
  const planks = 6;
  const height = PIXELS / planks;
  const tones = [
    "#9b6a3c",
    "#a9774a",
    "#8d5f34",
    "#b07f50",
    "#956535",
    "#a37045",
  ];
  for (let p = 0; p < planks; p++) {
    ctx.fillStyle = tones[p % tones.length] ?? "#9b6a3c";
    ctx.fillRect(0, p * height, PIXELS, height);
    // Grain: long wavy lines that drift along the plank.
    for (let g = 0; g < 26; g++) {
      const y0 = p * height + rand() * height;
      const amp = 2 + rand() * 6;
      const freq = 0.004 + rand() * 0.01;
      ctx.strokeStyle =
        rand() > 0.5 ? "rgba(60,35,15,0.28)" : "rgba(220,180,130,0.18)";
      ctx.lineWidth = 1 + rand() * 2;
      ctx.beginPath();
      for (let x = 0; x <= PIXELS; x += 8) {
        const y = y0 + Math.sin(x * freq + g) * amp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    // The gap between boards.
    ctx.fillStyle = "rgba(30,18,8,0.9)";
    ctx.fillRect(0, p * height, PIXELS, 4);
    // Board ends do not line up.
    const end = rand() * PIXELS;
    ctx.fillRect(end, p * height, 4, height);
  }
  speckle(ctx, rand, 8000, "rgba(255,230,200,0.12)", "rgba(40,20,10,0.18)", 2);

  const [r, rctx] = canvas();
  rctx.fillStyle = "#8a8a8a";
  rctx.fillRect(0, 0, PIXELS, PIXELS);
  blotches(
    rctx,
    random(34),
    60,
    "rgba(200,200,200,0.35)",
    "rgba(90,90,90,0.35)",
    [80, 260],
  );
  return {
    map: texture(c, true),
    roughnessMap: texture(r, false),
    roughness: 0.55,
    metalness: 0,
  };
}

const PAINTERS: Record<Exclude<FloorKind, "none">, () => Painted> = {
  concrete,
  asphalt,
  wood,
};

const painted = new Map<FloorKind, Painted>();

function surface(kind: Exclude<FloorKind, "none">): Painted {
  let p = painted.get(kind);
  if (!p) {
    p = PAINTERS[kind]();
    painted.set(kind, p);
  }
  return p;
}

export function Floor({ runtime }: { runtime: ViewportRuntime }) {
  const kind = useStudio((s) => s.background.floor);
  const meshRef = useRef<Mesh>(null);

  const material = useMemo(() => {
    if (kind === "none") return null;
    const p = surface(kind);
    return new MeshStandardMaterial({
      map: p.map,
      roughnessMap: p.roughnessMap,
      roughness: p.roughness,
      metalness: p.metalness,
      envMapIntensity: 0.35,
    });
  }, [kind]);

  useEffect(() => () => material?.dispose(), [material]);

  // The far end of the floor dissolves into the background colour, so the plane never shows an edge.
  const scene = useThree((s) => s.scene);
  const backdrop = useStudio((s) => s.background.color);
  useEffect(() => {
    if (!material) return;
    scene.fog = new Fog(backdrop, 5, 14);
    return () => {
      scene.fog = null;
    };
  }, [scene, material, backdrop]);

  // The floor sits under the device's lowest point and rises with it when the device is moved up.
  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.position.y =
      -runtime.deviceExtents.y / 2 + runtime.values["object.y"] / 100 - 0.002;
  });

  if (!material) return null;
  return (
    <mesh
      ref={meshRef}
      material={material}
      receiveShadow
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[SIZE, SIZE]} />
    </mesh>
  );
}
