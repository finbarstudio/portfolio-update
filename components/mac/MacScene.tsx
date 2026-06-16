"use client";

/**
 * MacScene — the single Apple Studio Display mockup engine. The Mac counterpart
 * to `PhoneScene`: drop 1..10 images/videos onto the display's screen and export
 * the same way. It loads the studio-display GLTF the portfolio case studies use,
 * maps each media item onto the screen mesh, and exposes the SAME imperative
 * controller (`PhoneSceneController`) the sandbox export pipeline already drives —
 * so loop video, stills, GIF and embed all work with zero pipeline changes.
 *
 * The pose mirrors `ModelDisplay`: an isometric rest angle ("Angle" preset) that
 * eases to a flat, front-on view ("Flat" preset). The chosen preset drives the
 * blend (instead of pointer hover); a subtle cosine turntable adds life for the
 * loop, and multi-item showcases swap the on-screen media at the turned extreme so
 * the cut is masked. Stills capture front-on at each item's quarter point.
 */

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, Center } from "@react-three/drei";

import Loader from "../Loader";
import { useGroupHover } from "../useGroupHover";
import { FrameDriver } from "../FrameDriver";
import { useAppReady } from "../useAppReady";

import type { PhoneSceneController } from "@/components/phone/PhoneScene";
import {
  CAMERA_FOV,
  CAMERA_DISTANCE_DEFAULT,
  CAMERA_DISTANCE_HOVER,
  CAMERA_Y_DEFAULT,
  CAMERA_Y_HOVER,
  LOOKAT_Y_HOVER,
  ISO_ROTATION_X,
  ISO_ROTATION_Y,
  STATE_LERP,
  CYCLE_SPEED,
  MAX_MEDIA,
  turntableYaw,
  mediaIndexFor,
  offsetForFocus,
  poseTargetFor,
  type AnimationPreset,
  type FitMode,
  type MacMediaItem,
} from "./mac-config";
import { useMacTextures } from "./useMacTextures";

export type MacSceneProps = {
  /** Path under /public — defaults to the studio-display GLTF. */
  model?: string;
  /** 1..10 media items (videos and/or images). One sits on the screen at a time. */
  media: MacMediaItem[];
  /** Force a preset pose (sandbox). When unset, pointer hover drives the blend. */
  presetOverride?: AnimationPreset;
  /** How media fills the screen. Only affects images; video keeps the base UVs. */
  fit?: FitMode;
  /** Background: a CSS color painted behind the display, or "transparent". */
  background?: string;
  aspectRatio?: string;
  fill?: boolean;
  className?: string;
  /** Enable pointer/keyboard hover animation (embed angle mode true; tool false). */
  hoverable?: boolean;
  /** Mount the canvas immediately rather than via the staggered appReady queue. */
  immediate?: boolean;
  /** Keep the drawing buffer readable for export captures (sandbox tool only). */
  preserveDrawingBuffer?: boolean;
  /** Freeze the time-driven animation; offset/hover come from the controller. */
  paused?: boolean;
  controllerRef?: React.RefObject<PhoneSceneController | null>;
  onReady?: () => void;
};

const MAC_MODEL = "/models/studio-display/display.gltf";

/* ── The display: model + screen swap + controller + animation ──────── */

type MacShowProps = {
  model: string;
  media: MacMediaItem[];
  fit: FitMode;
  bgColor: string | null;
  hovered: boolean;
  inView: boolean;
  paused: boolean;
  presetOverride?: AnimationPreset;
  controllerRef?: React.RefObject<PhoneSceneController | null>;
  onReady: () => void;
};

function MacShow({
  model,
  media,
  fit,
  bgColor,
  hovered,
  inView,
  paused,
  presetOverride,
  controllerRef,
  onReady,
}: MacShowProps) {
  const reportedReady = useRef(false);
  const gltf = useGLTF(model) as unknown as { scene: THREE.Group };

  // Clone once so the cached GLTF isn't mutated (and remounts stay clean).
  const root = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  const items = useMemo(() => media.slice(0, MAX_MEDIA), [media]);
  const count = Math.max(1, items.length);
  const descriptors = useMacTextures(items, fit, bgColor);

  // The screen material — its `.map` is swapped imperatively per frame so a
  // multi-item showcase can cycle screens without rebuilding materials.
  const screenMat = useMemo(
    () => new THREE.MeshBasicMaterial({ toneMapped: false }),
    [],
  );

  // Walk the cloned model: screen mesh → screenMat; frame/stand/monitor → metals;
  // kill any transmission so we don't pay an extra render pass. (Mirrors ModelDisplay.)
  useEffect(() => {
    const frameMat = new THREE.MeshPhysicalMaterial({
      color: "#1a1a1c", roughness: 0.45, metalness: 0.85, clearcoat: 0.4, clearcoatRoughness: 0.35,
    });
    const standMat = new THREE.MeshPhysicalMaterial({
      color: "#9a9a9a", roughness: 0.35, metalness: 0.92, clearcoat: 0.2,
    });
    const monitorBackMat = new THREE.MeshPhysicalMaterial({
      color: "#c0c0c2", roughness: 0.32, metalness: 0.95, clearcoat: 0.3,
    });

    root.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      const name = obj.name ?? "";
      const origMat = Array.isArray(obj.material) ? obj.material[0] : obj.material;
      const matName = (origMat as { name?: string } | null)?.name ?? "";
      const lcName = name.toLowerCase();
      const lcMat = matName.toLowerCase();

      if (lcName.includes("mockup") || lcMat.includes("glass")) {
        obj.material = screenMat;
      } else if (name === "Frame") {
        obj.material = frameMat;
      } else if (name === "Stand") {
        obj.material = standMat;
      } else if (name === "Monitor") {
        obj.material = monitorBackMat;
      } else if (origMat instanceof THREE.MeshPhysicalMaterial) {
        if (origMat.transmission > 0) {
          origMat.transmission = 0;
          origMat.transparent = false;
          origMat.opacity = 1;
        }
      }
    });

    return () => {
      frameMat.dispose();
      standMat.dispose();
      monitorBackMat.dispose();
    };
  }, [root, screenMat]);

  useEffect(() => () => screenMat.dispose(), [screenMat]);

  // Off screen: stop every decoder.
  useEffect(() => {
    if (inView) return;
    descriptors.forEach((d) => d.pauseVideo());
  }, [inView, descriptors]);

  const groupRef = useRef<THREE.Group>(null);
  const offsetRef = useRef(0);
  const hoverProgressRef = useRef(presetOverride ? poseTargetFor(presetOverride, false) : 0);
  const lastIndexRef = useRef(-1);

  // Build + expose the imperative controller (gl/scene/camera live inside Canvas).
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
      cycleSpeed: CYCLE_SPEED,
      numPhones: count,
    };
    return () => { ref.current = null; };
  }, [controllerRef, gl, scene, camera, invalidate, count]);

  const lerp = THREE.MathUtils.lerp;

  useFrame((_, delta) => {
    // Re-upload only the on-screen video while it's playing.
    for (let i = 0; i < descriptors.length; i++) descriptors[i].tick();

    // Pose blend (frozen during export — the controller writes the ref directly).
    if (!paused) {
      const target = poseTargetFor(presetOverride, hovered);
      hoverProgressRef.current += (target - hoverProgressRef.current) * STATE_LERP;
      offsetRef.current += delta * CYCLE_SPEED;
    }
    const h = hoverProgressRef.current;
    const offset = offsetRef.current;

    // Which media sits on the screen + decoder lifecycle for it only.
    const index = mediaIndexFor(offset, count);
    const active = descriptors[index] ?? null;
    if (index !== lastIndexRef.current) {
      lastIndexRef.current = index;
      screenMat.map = active ? active.texture : null;
      screenMat.needsUpdate = true;
    }
    for (let i = 0; i < descriptors.length; i++) {
      const onScreen = i === index;
      descriptors[i].sync(onScreen, onScreen, paused);
    }

    // Pose: isometric (h=0) → flat front-on (h=1), with the live turntable yaw.
    if (groupRef.current) {
      groupRef.current.rotation.x = lerp(ISO_ROTATION_X, 0, h);
      groupRef.current.rotation.y = lerp(ISO_ROTATION_Y, 0, h) + turntableYaw(offset);
    }

    // Camera glides in + up toward the screen face as the pose flattens.
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.z = lerp(CAMERA_DISTANCE_DEFAULT, CAMERA_DISTANCE_HOVER, h);
    cam.position.y = lerp(CAMERA_Y_DEFAULT, CAMERA_Y_HOVER, h);
    cam.position.x = 0;
    cam.lookAt(0, lerp(0, LOOKAT_Y_HOVER, h), 0);

    if (!reportedReady.current && (!active || active.hasFrame())) {
      reportedReady.current = true;
      onReady();
    }
  });

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={root} />
      </Center>
    </group>
  );
}

/* ── Real-time resize (mirrors PhoneScene) ──────────────────────────── */

function LiveResize() {
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);
  const setSize = useThree((s) => s.setSize);
  const invalidate = useThree((s) => s.invalidate);
  const last = useRef({ w: 0, h: 0 });

  const apply = useCallback(
    (w: number, h: number) => {
      if (w < 1 || h < 1) return;
      if (w === last.current.w && h === last.current.h) return;
      last.current = { w, h };
      setSize(w, h);
      const cam = camera as THREE.PerspectiveCamera;
      if (cam.isPerspectiveCamera) {
        cam.aspect = w / h;
        cam.updateProjectionMatrix();
      }
      invalidate();
    },
    [setSize, camera, invalidate],
  );

  useEffect(() => {
    const parent = gl.domElement.parentElement;
    if (!parent) return;
    const ro = new ResizeObserver(() => apply(parent.clientWidth, parent.clientHeight));
    ro.observe(parent);
    apply(parent.clientWidth, parent.clientHeight);
    return () => ro.disconnect();
  }, [gl, apply]);

  useFrame(() => {
    const parent = gl.domElement.parentElement;
    if (parent) apply(parent.clientWidth, parent.clientHeight);
  });
  return null;
}

/* ── Outer component ─────────────────────────────────────────────────── */

export default function MacScene({
  model = MAC_MODEL,
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
  controllerRef,
  onReady,
}: MacSceneProps) {
  const { ref: hoverRef, hovered } = useGroupHover<HTMLDivElement>(hoverable);
  const [ready, setReady] = useState(false);
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
          camera={{ position: [0, CAMERA_Y_DEFAULT, CAMERA_DISTANCE_DEFAULT], fov: CAMERA_FOV, near: 0.1, far: 50 }}
          dpr={[1, 1.5]}
          gl={glConfig}
          style={{
            position: "absolute",
            inset: 0,
            opacity: ready ? 1 : 0,
            transition: "opacity 0.45s var(--ease, ease)",
          }}
        >
          {/* The display always animates (turntable + screen cycle) in view; nothing
              off-screen or while paused (export drives invalidate() manually). */}
          <FrameDriver active={inView && !paused} idleFps={paused ? 0 : inView ? 30 : 0} />
          <LiveResize />
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 8, 5]} intensity={1.1} />
          <directionalLight position={[-4, 3, -2]} intensity={0.4} />
          <Suspense fallback={null}>
            <Environment preset="city" />
            <MacShow
              model={model}
              media={media}
              fit={fit}
              bgColor={bgColor}
              hovered={hovered}
              inView={inView || paused}
              paused={paused}
              presetOverride={presetOverride}
              controllerRef={controllerRef}
              onReady={handleReady}
            />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
