"use client";

/**
 * PhoneScene — the generalised phone-carousel engine, extracted from the original
 * `PhoneCarousel.tsx`. It drives 1..10 iPhones playing per-phone videos or images
 * in the same cycling carousel, and exposes an imperative controller the sandbox
 * export pipeline drives frame-by-frame.
 *
 * Hard rule #1: with `count === 7` and the default (stretch) video path, this
 * renders the TMYR hero **identically** to the original — the slot tables are the
 * same canonical arc and `arcPosFor`/`slotAt` collapse to the original formula at
 * count 7 (see phone-config.ts). `PhoneCarousel.tsx` is now a thin adapter onto
 * this engine.
 */

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";

import Loader from "../Loader";
import StudioEnvironment from "../StudioEnvironment";
import { useGroupHover } from "../useGroupHover";
import { FrameDriver } from "../FrameDriver";
import { useAppReady } from "../useAppReady";

import {
  REST_SLOTS,
  HOVER_SLOTS,
  CYCLE_SPEED,
  STATE_LERP,
  CAMERA_DISTANCE,
  CAMERA_FOV,
  ONSTAGE_THRESHOLD,
  MODEL_BASE_SCALE,
  MAX_PHONES,
  arcPosFor,
  slotAt,
  easedOffset,
  offsetForFocus,
  hoverTargetFor,
  fillCount,
  ANGLED_H,
  ANGLE_SPREAD,
  PROMINENCE_K,
  type AnimationPreset,
  type FitMode,
  type PhoneMediaItem,
} from "./phone-config";
import { usePhoneTextures, type PhoneTextureDescriptor } from "./usePhoneTextures";

/* ── Imperative controller (the export hook drives this) ─────────── */

export type PhoneSceneController = {
  gl: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.Camera;
  invalidate: () => void;
  setOffset: (o: number) => void;
  setHover: (h: number) => void;
  offsetForFocus: (i: number) => number;
  cycleSpeed: number;
  numPhones: number;
};

export type PhoneSceneProps = {
  /** Path under /public, e.g. /models/iphone/iphone-15-pro-max.glb */
  model: string;
  /** 1..10 media items (videos and/or images). count = media.length. */
  media: PhoneMediaItem[];
  /** Force a preset pose (sandbox). When unset, pointer hover drives the blend. */
  presetOverride?: AnimationPreset;
  /** How media fills the screen. Only affects images in MVP; video stays base. */
  fit?: FitMode;
  /** Background: a CSS color painted behind the phones, or "transparent". */
  background?: string;
  /** Override aspect ratio (ignored when fill is true). */
  aspectRatio?: string;
  /** Fill parent container height instead of using aspect ratio. */
  fill?: boolean;
  className?: string;
  poster?: string;
  /** Enable pointer/keyboard hover animation (TMYR true; sandbox false). */
  hoverable?: boolean;
  /** Mount the canvas immediately rather than via the staggered appReady queue. */
  immediate?: boolean;
  /** Keep the drawing buffer readable for export captures (sandbox only). */
  preserveDrawingBuffer?: boolean;
  /** Freeze the time-driven animation; offset/hover come from the controller. */
  paused?: boolean;
  /** Continuous pose blend (sandbox Angle slider): 1 = flat … negative = extra
   *  angled. Overrides presetOverride/hover when set. */
  pose?: number;
  /** Carousel cycle-rate multiplier (sandbox Speed slider). Default 1. */
  speed?: number;
  /** Main-phone prominence 0..1 — shrinks the flanks relative to the centre. */
  prominence?: number;
  controllerRef?: React.RefObject<PhoneSceneController | null>;
  onReady?: () => void;
};

/* ── Single phone instance — materials + mesh handling (verbatim) ── */

type PhoneInstanceProps = {
  sceneRoot: THREE.Group;
  texture: THREE.Texture | null;
  groupSetter: (g: THREE.Group | null) => void;
};

function PhoneInstance({ sceneRoot, texture, groupSetter }: PhoneInstanceProps) {
  const cloned = useMemo(() => sceneRoot.clone(true), [sceneRoot]);

  useEffect(() => {
    if (!texture) return;

    // All materials opaque — fade is handled by scale + color modulation, not
    // material transparency (which caused both see-through bugs and z-fighting
    // between overlapping phones). DoubleSide + depthTest:false + renderOrder
    // win z-fighting for the screen plane against the co-planar surround mesh.
    const screenMat = new THREE.MeshBasicMaterial({
      map: texture,
      toneMapped: false,
      side: THREE.DoubleSide,
      depthTest: false,
    });
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: "#2a2a2c",
      roughness: 0.42,
      metalness: 0.92,
      clearcoat: 0.35,
      clearcoatRoughness: 0.4,
    });
    const trimMat = new THREE.MeshPhysicalMaterial({
      color: "#7a7a7d",
      roughness: 0.3,
      metalness: 0.95,
    });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: "#101012",
      roughness: 0.2,
      metalness: 0.6,
    });
    const antennaMat = new THREE.MeshPhysicalMaterial({
      color: "#3d3d40",
      roughness: 0.5,
      metalness: 0.85,
    });

    // screen-Mesh_1 (prim 1) is the only sub-mesh with full UV[0,1] — THE plane
    // the media should map to. screen-Mesh / _2 become the dark surround.
    // phone_case-Mesh is the glass shell that occluded the screen — hide it.
    cloned.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      const name = obj.name ?? "";
      const lower = name.toLowerCase();

      if (name === "phone_case-Mesh") {
        obj.visible = false;
        return;
      }
      if (lower.startsWith("scroo")) {
        obj.visible = false;
        return;
      }
      if (name === "screen-Mesh_1") {
        obj.material = screenMat;
        obj.renderOrder = 10;
        return;
      }
      if (name === "screen-Mesh" || name === "screen-Mesh_2") {
        obj.material = bodyMat;
        return;
      }

      if (lower.includes("camera_glass") || lower.includes("flash_glass") || lower.includes("lens")) {
        obj.material = glassMat;
      } else if (lower.includes("flash") || lower.includes("logo")) {
        obj.material = trimMat;
      } else if (lower.includes("cylinder") || lower.includes("sphere")) {
        obj.material = antennaMat;
      } else {
        obj.material = bodyMat;
      }
    });

    return () => {
      screenMat.dispose();
      bodyMat.dispose();
      trimMat.dispose();
      glassMat.dispose();
      antennaMat.dispose();
    };
  }, [cloned, texture]);

  return (
    <group ref={groupSetter}>
      <Center>
        <group scale={MODEL_BASE_SCALE}>
          <primitive object={cloned} />
        </group>
      </Center>
    </group>
  );
}

/* ── Carousel — drives every phone from one offset + builds the controller ── */

type CarouselProps = {
  model: string;
  media: PhoneMediaItem[];
  fit: FitMode;
  bgColor: string | null;
  hovered: boolean;
  inView: boolean;
  paused: boolean;
  presetOverride?: AnimationPreset;
  pose?: number;
  speed: number;
  prominence: number;
  controllerRef?: React.RefObject<PhoneSceneController | null>;
  onReady: () => void;
};

function Carousel({
  model,
  media,
  fit,
  bgColor,
  hovered,
  inView,
  paused,
  presetOverride,
  pose,
  speed,
  prominence,
  controllerRef,
  onReady,
}: CarouselProps) {
  const reportedReady = useRef(false);
  const gltf = useGLTF(model) as unknown as { scene: THREE.Group };
  const sceneRoot = gltf.scene;

  const items = useMemo(() => media.slice(0, MAX_PHONES), [media]);
  // One descriptor per unique item; the ring repeats them so there are never gaps.
  const mediaCount = Math.max(1, items.length);
  const count = fillCount(mediaCount);
  const descriptors = usePhoneTextures(items, fit, bgColor);

  // Off screen: the render loop is stopped — pause every video to halt decode.
  useEffect(() => {
    if (inView) return;
    descriptors.forEach((d) => d.pauseVideo());
  }, [inView, descriptors]);

  const phoneGroups = useRef<(THREE.Group | null)[]>([]);
  const offsetRef = useRef(0);
  const hoverProgressRef = useRef(
    pose != null ? pose : presetOverride ? hoverTargetFor(false, presetOverride) : 0,
  );

  // Build + expose the imperative controller (gl/scene/camera live here, inside
  // the Canvas). The export hook seeks offset/hover and pulls frames through it.
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    const ref = controllerRef;
    if (!ref) return;
    ref.current = {
      gl,
      scene,
      camera,
      invalidate: () => invalidate(),
      setOffset: (o: number) => { offsetRef.current = o; },
      setHover: (h: number) => { hoverProgressRef.current = h; },
      offsetForFocus: (i: number) => offsetForFocus(i),
      cycleSpeed: CYCLE_SPEED * speed,
      numPhones: count,
    };
    return () => { ref.current = null; };
  }, [controllerRef, gl, scene, camera, invalidate, count, speed]);

  useFrame((_, delta) => {
    // Re-upload only the textures whose video is actually PLAYING.
    for (let i = 0; i < descriptors.length; i++) descriptors[i].tick();

    // Hover blend (frozen during export — controller writes the ref directly).
    if (!paused) {
      const target = pose != null ? pose : hoverTargetFor(hovered, presetOverride);
      // Asymmetric: ease IN at the normal rate, but settle OUT (un-hover) more
      // gently — a shallow, slow return so a mid-animation release isn't sharp.
      const k = target < hoverProgressRef.current ? STATE_LERP * 0.72 : STATE_LERP;
      hoverProgressRef.current += (target - hoverProgressRef.current) * k;
      // Keep the demand loop running at full fps for the WHOLE blend — including
      // the un-hover ease-out, when the FrameDriver has already dropped to idle.
      // Otherwise the release renders in sparse idle frames and looks jumpy.
      if (Math.abs(target - hoverProgressRef.current) > 0.0015) invalidate();
    }
    const h = hoverProgressRef.current;

    // Carousel offset (frozen during export — controller seeks it).
    if (!paused) offsetRef.current += delta * CYCLE_SPEED * speed;
    const offset = easedOffset(offsetRef.current);

    const lerp = THREE.MathUtils.lerp;
    let pendingFrames = 0;

    // A media item maps to several phones in the ring; track whether any of them
    // is on-screen / on-stage so each unique descriptor is synced once (a shared
    // <video> can't play for one phone and pause for another).
    const onScreenByDesc = new Array(descriptors.length).fill(false);
    const onStageByDesc = new Array(descriptors.length).fill(false);

    for (let i = 0; i < count; i++) {
      const phone = phoneGroups.current[i];
      if (!phone) continue;
      const di = i % mediaCount;

      const arc = arcPosFor(i, count, offset);
      const rest = slotAt(REST_SLOTS, arc);
      const hov = slotAt(HOVER_SLOTS, arc);

      const y = lerp(rest.y, hov.y, h);
      const z = lerp(rest.z, hov.z, h);
      const rotZ = lerp(rest.rotZ, hov.rotZ, h);
      const scale = lerp(rest.scale, hov.scale, h);

      // H1: at extreme angle the extrapolated pose pulls flanks inward — spread
      // x back out proportional to how angled we are so the gap stays open.
      const angledness = ANGLED_H < 0 ? Math.max(0, Math.min(1, -h / -ANGLED_H)) : 0;
      const x = lerp(rest.x, hov.x, h) * (1 + ANGLE_SPREAD * angledness);
      // H2: prominence shrinks the flanks (scale<1) while the centre (≈1) holds.
      const renderScale = prominence > 0 ? Math.pow(scale, 1 + prominence * PROMINENCE_K) : scale;

      phone.position.set(x, y, z);
      phone.rotation.z = rotZ;

      const d = descriptors[di];
      const hasFrame = !!d && d.hasFrame();

      const visible = scale > 0.02 && hasFrame;
      if (phone.visible !== visible) phone.visible = visible;
      phone.scale.setScalar(renderScale);
      if (scale > 0.02 && !hasFrame) pendingFrames++;

      if (scale > 0.02) onScreenByDesc[di] = true;
      if (scale > ONSTAGE_THRESHOLD) onStageByDesc[di] = true;
    }

    for (let di = 0; di < descriptors.length; di++) {
      descriptors[di].sync(onScreenByDesc[di], onStageByDesc[di], paused);
    }

    if (pendingFrames === 0 && !reportedReady.current) {
      reportedReady.current = true;
      onReady();
    }
  });

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <PhoneInstance
          key={i}
          sceneRoot={sceneRoot}
          texture={descriptors[i % mediaCount]?.texture ?? null}
          groupSetter={(g) => { phoneGroups.current[i] = g; }}
        />
      ))}
    </>
  );
}

/* ── Real-time resize ─────────────────────────────────────────────
   Two paths to the same `apply()`:
   • a ResizeObserver (effect) — fires on mount with the real container size and
     on every container resize, so the canvas sizes correctly even when the
     `frameloop="demand"` loop is idle (this is what makes the immediately-mounted
     sandbox canvas size right without a window-resize nudge);
   • a per-frame poll — catches smooth size changes during hover transitions.
   `apply()` dedupes, so a stable size costs nothing and TMYR is unchanged. */
function LiveResize() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const setSize = useThree((s) => s.setSize);
  const invalidate = useThree((s) => s.invalidate);
  const last = useRef({ w: 0, h: 0 });

  const apply = useCallback(
    (w: number, h: number, immediate = false) => {
      if (w < 1 || h < 1) return;
      if (w === last.current.w && h === last.current.h) return;
      last.current = { w, h };
      setSize(w, h);
      const cam = camera as THREE.PerspectiveCamera;
      if (cam.isPerspectiveCamera) {
        cam.aspect = w / h;
        cam.updateProjectionMatrix();
      }
      // `setSize` reallocates the drawing buffer to a cleared (transparent) state.
      // The per-frame poll runs inside the rAF loop, so r3f redraws the same tick
      // and the buffer is never seen blank. The ResizeObserver fires OUTSIDE the
      // loop, so deferring the redraw to a later demand frame (invalidate) presents
      // the cleared buffer for a frame — the un-hover "white" flash. Render it
      // synchronously here so the resized buffer is filled in the same tick.
      if (immediate) gl.render(scene, camera);
      else invalidate();
    },
    [setSize, camera, invalidate, gl, scene],
  );

  useEffect(() => {
    const parent = gl.domElement.parentElement;
    if (!parent) return;
    const ro = new ResizeObserver(() => apply(parent.clientWidth, parent.clientHeight, true));
    ro.observe(parent);
    apply(parent.clientWidth, parent.clientHeight, true);
    return () => ro.disconnect();
  }, [gl, apply]);

  useFrame(() => {
    const parent = gl.domElement.parentElement;
    if (parent) apply(parent.clientWidth, parent.clientHeight);
  });
  return null;
}

/* ── Outer component ─────────────────────────────────────────────── */

export default function PhoneScene({
  model,
  media,
  presetOverride,
  fit = "cover",
  background = "transparent",
  aspectRatio = "16/9",
  fill = false,
  className,
  hoverable = true,
  immediate = false,
  preserveDrawingBuffer = false,
  paused = false,
  pose,
  speed = 1,
  prominence = 0,
  controllerRef,
  onReady,
}: PhoneSceneProps) {
  const { ref: hoverRef, hovered } = useGroupHover<HTMLDivElement>(hoverable);
  const [ready, setReady] = useState(false);
  // The sandbox mounts a single, always-relevant canvas — treat it as in-view
  // immediately (and skip the observer) so it renders without a scroll nudge.
  // TMYR (immediate=false) keeps the off-screen-pause observer unchanged.
  const [inView, setInView] = useState(immediate);

  const appReady = useAppReady();
  const canMount = immediate || appReady;

  useEffect(() => {
    if (immediate) return;
    const el = hoverRef.current;
    if (!el || typeof IntersectionObserver === "undefined") { setInView(true); return; }
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "150px" });
    io.observe(el);
    return () => io.disconnect();
  }, [hoverRef, immediate]);

  const isTransparent = background === "transparent";
  const bgColor = isTransparent ? null : background;

  const handleReady = () => {
    setReady(true);
    onReady?.();
  };

  // Export captures need a readable buffer; default gl config is unchanged so the
  // TMYR canvas (preserveDrawingBuffer false) stays byte-for-byte identical.
  const glConfig = preserveDrawingBuffer
    ? { antialias: true, alpha: true, preserveDrawingBuffer: true }
    : { antialias: true, alpha: true };

  return (
    <div
      ref={hoverRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        ...(fill ? { height: "100%" } : { aspectRatio }),
        background: isTransparent ? "transparent" : background,
        overflow: "hidden",
        cursor: hoverable ? "pointer" : "default",
      }}
    >
      {!ready && <Loader bare />}

      {canMount && (
        <Canvas
          frameloop="demand"
          camera={{ position: [0, 0, CAMERA_DISTANCE], fov: CAMERA_FOV, near: 0.1, far: 50 }}
          dpr={[1, 1.5]}
          gl={glConfig}
          style={{
            position: "absolute",
            inset: 0,
            opacity: ready ? 1 : 0,
            transition: "opacity 0.45s var(--ease, ease)",
          }}
        >
          {/* 60fps when animating; 30fps at rest in view; nothing off screen or
              when paused (export drives invalidate() manually). */}
          <FrameDriver active={(hovered || !!presetOverride || pose != null) && inView && !paused} idleFps={paused ? 0 : inView ? 30 : 0} />
          <LiveResize />
          <ambientLight intensity={0.65} />
          <directionalLight position={[4, 5, 5]} intensity={1.0} />
          <directionalLight position={[-3, 2, -3]} intensity={0.35} />
          <StudioEnvironment />
          <Suspense fallback={null}>
            <Carousel
              model={model}
              media={media}
              fit={fit}
              bgColor={bgColor}
              hovered={hovered}
              inView={inView || paused}
              paused={paused}
              presetOverride={presetOverride}
              pose={pose}
              speed={speed}
              prominence={prominence}
              controllerRef={controllerRef}
              onReady={handleReady}
            />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
