"use client";

/**
 * ModelDisplay — interactive 3D Mac Studio Display thumbnail.
 *
 * - Loads a Studio Display GLTF (frame + stand + screen).
 * - Plays a looping, muted video as a texture on the screen mesh.
 * - Default view: isometric angle.
 * - On hover: animates to flat, front-on, centered (shows the bevels).
 *
 * Reusable. Drop into any container; fills it with a 16/9 box by default.
 * `aspectRatio` and `className` props let you reuse it elsewhere.
 */

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";

/* ── Tunables ──────────────────────────────────────────────── */

// Camera + framing. Distances tuned so the full monitor + stand always fits
// (with breathing room) at both rest and hover, even on a 3/2 thumbnail card.
const CAMERA_FOV = 28;
const CAMERA_DISTANCE_DEFAULT = 9.0;   // Pulled back at rest (isometric)
const CAMERA_DISTANCE_HOVER = 7.2;     // Closer when hovered, still uncropped
const LERP = 0.08;                     // Animation speed (per frame)

// Model orientation. Studio Display GLTF exports with screen facing +Y (upward)
// because the export uses Z-up. We rotate -90° around X so the screen faces +Z
// (i.e. the camera at +Z sees the screen front-on).
const MODEL_BASE_ROTATION: [number, number, number] = [-Math.PI / 2, 0, 0];

// Isometric tilt (resting state).
const ISO_ROTATION_Y = -0.55;          // ~ -31°  (left/right)
const ISO_ROTATION_X = 0.18;           //   ~10°  (slight downward tilt)

/* ── Inner: Display model + video texture ──────────────────── */

type DisplayModelProps = {
  modelUrl: string;
  videoTexture: THREE.VideoTexture | null;
  position?: [number, number, number];
  rotation?: [number, number, number];
};

function DisplayModel({ modelUrl, videoTexture, position, rotation }: DisplayModelProps) {
  const { scene } = useGLTF(modelUrl) as unknown as { scene: THREE.Group };

  // Clone once so the same model can be mounted in multiple ModelDisplay
  // instances on the same page without sharing materials/state.
  const root = useMemo(() => scene.clone(true), [scene]);

  // Walk the cloned scene, find the screen mesh, apply the video material.
  useEffect(() => {
    if (!videoTexture) return;

    const screenMat = new THREE.MeshBasicMaterial({
      map: videoTexture,
      toneMapped: false,
    });
    const frameMat = new THREE.MeshPhysicalMaterial({
      color: "#1a1a1c",
      roughness: 0.45,
      metalness: 0.85,
      clearcoat: 0.4,
      clearcoatRoughness: 0.35,
    });
    const standMat = new THREE.MeshPhysicalMaterial({
      color: "#9a9a9a",
      roughness: 0.35,
      metalness: 0.92,
      clearcoat: 0.2,
    });
    const monitorBackMat = new THREE.MeshPhysicalMaterial({
      color: "#c0c0c2",
      roughness: 0.32,
      metalness: 0.95,
      clearcoat: 0.3,
    });

    root.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      const name = obj.name ?? "";
      if (name.toLowerCase().includes("mockup")) {
        obj.material = screenMat;
      } else if (name === "Frame") {
        obj.material = frameMat;
      } else if (name === "Stand") {
        obj.material = standMat;
      } else if (name === "Monitor") {
        obj.material = monitorBackMat;
      }
    });

    return () => {
      screenMat.dispose();
      frameMat.dispose();
      standMat.dispose();
      monitorBackMat.dispose();
    };
  }, [root, videoTexture]);

  return (
    <group position={position} rotation={rotation}>
      <primitive object={root} />
    </group>
  );
}

/* ── Inner: rig that lerps rotation + camera distance on hover ── */

function Rig({
  hovered,
  modelUrl,
  videoTexture,
}: {
  hovered: boolean;
  modelUrl: string;
  videoTexture: THREE.VideoTexture | null;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Target values, recomputed each frame from hover state.
  useFrame(() => {
    if (!groupRef.current) return;
    const tx = hovered ? 0 : ISO_ROTATION_X;
    const ty = hovered ? 0 : ISO_ROTATION_Y;
    groupRef.current.rotation.x += (tx - groupRef.current.rotation.x) * LERP;
    groupRef.current.rotation.y += (ty - groupRef.current.rotation.y) * LERP;

    const targetZ = hovered ? CAMERA_DISTANCE_HOVER : CAMERA_DISTANCE_DEFAULT;
    camera.position.z += (targetZ - camera.position.z) * LERP;
    camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={groupRef}>
      <DisplayModel
        modelUrl={modelUrl}
        videoTexture={videoTexture}
        rotation={MODEL_BASE_ROTATION}
        // Recenter: the GLTF's frame sits at y≈0.6 in world (after root scale).
        // Nudge down so the visual centre of the screen sits at origin.
        position={[0, -0.45, 0]}
      />
    </group>
  );
}

/* ── Outer component ───────────────────────────────────────── */

type Props = {
  /** Path under /public, e.g. /models/studio-display/display.gltf */
  model: string;
  /** Looping video shown on the screen. WebM or MP4. */
  video: string;
  /** Optional poster image, shown until the canvas is ready. */
  poster?: string;
  /** Override aspect ratio. Default 16/9 to match other thumbnails. */
  aspectRatio?: string;
  className?: string;
  /** Disable hover animation (e.g. when used inside a parent that's already a link). */
  hoverable?: boolean;
};

function ModelDisplayInner({
  model,
  video,
  poster,
  aspectRatio = "16/9",
  className,
  hoverable = true,
}: Props) {
  const [hovered, setHovered] = useState(false);
  const [ready, setReady] = useState(false);

  // Build a single <video> element + VideoTexture that lives for the
  // lifetime of this component. Autoplay, muted, looping, inline.
  const videoEl = useMemo(() => {
    if (typeof document === "undefined") return null;
    const el = document.createElement("video");
    el.src = video;
    el.crossOrigin = "anonymous";
    el.loop = true;
    el.muted = true;
    el.playsInline = true;
    el.autoplay = true;
    el.preload = "auto";
    // iOS Safari needs this attribute set as a property, not just attribute,
    // for inline autoplay to work without user interaction.
    el.setAttribute("playsinline", "");
    el.setAttribute("muted", "");
    return el;
  }, [video]);

  const videoTexture = useMemo(() => {
    if (!videoEl) return null;
    const tex = new THREE.VideoTexture(videoEl);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    // The screen mesh UVs are flipped on the Y axis vs. our video. Without
    // this the demo plays upside-down.
    tex.flipY = false;
    return tex;
  }, [videoEl]);

  useEffect(() => {
    if (!videoEl) return;
    const onLoaded = () => {
      setReady(true);
      videoEl.play().catch(() => {});
    };
    videoEl.addEventListener("loadeddata", onLoaded);
    // Kick off load.
    videoEl.load();
    return () => {
      videoEl.removeEventListener("loadeddata", onLoaded);
      videoEl.pause();
      videoEl.src = "";
      videoEl.removeAttribute("src");
      videoEl.load();
    };
  }, [videoEl]);

  useEffect(() => {
    return () => {
      videoTexture?.dispose();
    };
  }, [videoTexture]);

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
        aspectRatio,
        background: "var(--color-bg, #FAFAF8)",
        overflow: "hidden",
        cursor: hoverable ? "pointer" : "default",
      }}
    >
      {/* Poster fade-out until first frame is ready */}
      {poster && !ready && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: ready ? 0 : 1,
            transition: "opacity 0.3s ease",
          }}
        />
      )}

      <Canvas
        camera={{
          position: [0, 0, CAMERA_DISTANCE_DEFAULT],
          fov: CAMERA_FOV,
          near: 0.1,
          far: 50,
        }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ position: "absolute", inset: 0 }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={1.1} />
        <directionalLight position={[-4, 3, -2]} intensity={0.4} />
        <Suspense fallback={null}>
          <Environment preset="city" />
          <Rig hovered={hovered} modelUrl={model} videoTexture={videoTexture} />
        </Suspense>
      </Canvas>

      {/*
        Soft edge fade. If the model ever overshoots the container during the
        hover zoom, the edges blur into the page background instead of getting
        clipped to a hard rectangle. Pointer-events:none so it doesn't swallow
        clicks intended for the parent Link.
      */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at center, transparent 55%, var(--color-bg, #FAFAF8) 100%)",
        }}
      />
    </div>
  );
}

// SSR-safe wrapper: r3f + WebGL only work in the browser.
const ModelDisplay = dynamic(() => Promise.resolve(ModelDisplayInner), {
  ssr: false,
  loading: () => (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16/9",
        background: "var(--color-bg, #FAFAF8)",
      }}
    />
  ),
});

export default ModelDisplay;
