"use client";

/**
 * PhoneCarousel — 7 iPhones playing 7 looping videos in a cycling carousel.
 *
 * Rest state: 3 phones visible — center main-size, left/right tilted ±30° on Z,
 * slightly smaller, slightly lower. All phones cycle through the slots so a new
 * one keeps reaching the centre. Infinite loop across all 7.
 *
 * Hover state: phones lose Z rotation, all snap to the same size + Y axis, and
 * slide right-to-left through a single horizontal line. Same cycle, simplified.
 *
 * Drop into any container; `fill` makes it fill its parent height.
 */

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, Center } from "@react-three/drei";
import Loader from "./Loader";

/* ── Tunables ──────────────────────────────────────────────── */

const NUM_PHONES = 7;
const CENTER_SLOT = 3;                  // The visible "centre" slot index
const CYCLE_SPEED = 0.32;               // Slot-steps per second (raw; eased via DWELL).
const DWELL_PORTION = 0.35;             // Fraction of each step spent paused at the integer slot.
const STATE_LERP = 0.04;                // Hover state transition easing
const CAMERA_DISTANCE = 1.6;            // Camera Z — ~4x zoom vs the previous framing.
const CAMERA_FOV = 32;
const FLANK_ROT = Math.PI / 12;         // ±15° — subtle Z-tilt on flanking phones.

// Each slot = where a phone is when its slotFloat lands exactly on that index.
// Phones interpolate continuously between adjacent slots, wrapping mod 7.
// Slot 3 = visible centre. Slots 2/4 = flanks. 1/5 = transitional fade. 0/6 = hidden.
// X/Y/Z values are tuned for CAMERA_DISTANCE = 1.6 (≈4x zoom).
type Slot = {
  x: number; y: number; z: number;
  rotZ: number; scale: number; opacity: number;
};

const REST_SLOTS: Slot[] = [
  { x:  0.88, y: -0.14, z: -0.15, rotZ: -FLANK_ROT, scale: 0.45, opacity: 0.0 }, // 0: far off-right
  { x:  0.60, y: -0.08, z: -0.07, rotZ: -FLANK_ROT, scale: 0.62, opacity: 0.45 },// 1: entering right
  { x:  0.38, y: -0.04, z: -0.02, rotZ: -FLANK_ROT, scale: 0.78, opacity: 0.95 },// 2: RIGHT
  { x:  0.00, y:  0.00, z:  0.00, rotZ:  0,         scale: 1.0,  opacity: 1.0  },// 3: CENTER
  { x: -0.38, y: -0.04, z: -0.02, rotZ:  FLANK_ROT, scale: 0.78, opacity: 0.95 },// 4: LEFT
  { x: -0.60, y: -0.08, z: -0.07, rotZ:  FLANK_ROT, scale: 0.62, opacity: 0.45 },// 5: exiting left
  { x: -0.88, y: -0.14, z: -0.15, rotZ:  FLANK_ROT, scale: 0.45, opacity: 0.0 }, // 6: far off-left
];

const HOVER_SLOTS: Slot[] = [
  { x:  1.25, y: 0, z: 0, rotZ: 0, scale: 1.0, opacity: 0.0 },
  { x:  0.88, y: 0, z: 0, rotZ: 0, scale: 1.0, opacity: 0.3 },
  { x:  0.50, y: 0, z: 0, rotZ: 0, scale: 1.0, opacity: 0.75 },
  { x:  0.00, y: 0, z: 0, rotZ: 0, scale: 1.0, opacity: 1.0 },
  { x: -0.50, y: 0, z: 0, rotZ: 0, scale: 1.0, opacity: 0.75 },
  { x: -0.88, y: 0, z: 0, rotZ: 0, scale: 1.0, opacity: 0.3 },
  { x: -1.25, y: 0, z: 0, rotZ: 0, scale: 1.0, opacity: 0.0 },
];

// Base scale applied to the loaded model before slot scaling. iPhone OBJ comes
// in arbitrary units; this is tuned so the centre phone fills the frame nicely.
const MODEL_BASE_SCALE = 0.75;

// Ease the raw offset so each phone dwells briefly at every integer slot (incl.
// the centre) before sliding to the next. Linear time -> stair-stepped progress.
function easedOffset(raw: number): number {
  const intPart = Math.floor(raw);
  const frac = raw - intPart;
  if (frac < DWELL_PORTION) return intPart; // pause at the integer slot
  const t = (frac - DWELL_PORTION) / (1 - DWELL_PORTION);
  // smoothstep transit to the next slot
  const eased = t * t * (3 - 2 * t);
  return intPart + eased;
}

/* ── Inner: single phone instance with its own materials + video ── */

type PhoneInstanceProps = {
  sceneRoot: THREE.Group;
  videoTexture: THREE.VideoTexture | null;
  groupSetter: (g: THREE.Group | null) => void;
};

function PhoneInstance({ sceneRoot, videoTexture, groupSetter }: PhoneInstanceProps) {
  // Deep clone so each instance has its own materials (needed for per-instance
  // opacity + per-instance video texture). Geometry is shared.
  const cloned = useMemo(() => sceneRoot.clone(true), [sceneRoot]);

  useEffect(() => {
    if (!videoTexture) return;

    const screenMat = new THREE.MeshBasicMaterial({
      map: videoTexture,
      toneMapped: false,
      transparent: true,
    });
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: "#2a2a2c",
      roughness: 0.42,
      metalness: 0.92,
      clearcoat: 0.35,
      clearcoatRoughness: 0.4,
      transparent: true,
    });
    const trimMat = new THREE.MeshPhysicalMaterial({
      color: "#7a7a7d",
      roughness: 0.3,
      metalness: 0.95,
      transparent: true,
    });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: "#101012",
      roughness: 0.2,
      metalness: 0.6,
      transparent: true,
      opacity: 0.85,
    });

    cloned.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      const name = (obj.name ?? "").toLowerCase();
      if (name.includes("screen")) {
        obj.material = screenMat;
      } else if (name.includes("glass") || name.includes("camera")) {
        obj.material = glassMat;
      } else if (name.includes("cylinder") || name.includes("sphere") || name.includes("flash") || name.includes("logo")) {
        obj.material = trimMat;
      } else {
        obj.material = bodyMat;
      }
    });

    return () => {
      screenMat.dispose();
      bodyMat.dispose();
      trimMat.dispose();
      glassMat.dispose();
    };
  }, [cloned, videoTexture]);

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

/* ── Inner: carousel that drives all 7 phones from one offset ── */

function Carousel({ model, videos, hovered }: { model: string; videos: string[]; hovered: boolean }) {
  // useGLTF caches the load + returns the scene. Shared across instances.
  const gltf = useGLTF(model) as unknown as { scene: THREE.Group };
  const sceneRoot = gltf.scene;

  // 7 video elements + textures. Created once, lifetime tied to component.
  const videoEls = useMemo(() => {
    if (typeof document === "undefined") return [] as HTMLVideoElement[];
    return videos.map((src) => {
      const el = document.createElement("video");
      el.src = src;
      el.crossOrigin = "anonymous";
      el.loop = true;
      el.muted = true;
      el.playsInline = true;
      el.autoplay = true;
      el.preload = "auto";
      el.setAttribute("playsinline", "");
      el.setAttribute("muted", "");
      return el;
    });
  }, [videos]);

  const textures = useMemo(() => {
    return videoEls.map((el) => {
      const tex = new THREE.VideoTexture(el);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      return tex;
    });
  }, [videoEls]);

  useEffect(() => {
    videoEls.forEach((el) => {
      el.load();
      el.play().catch(() => {});
    });
    return () => {
      videoEls.forEach((el) => {
        el.pause();
        el.src = "";
        el.removeAttribute("src");
        el.load();
      });
      textures.forEach((t) => t.dispose());
    };
  }, [videoEls, textures]);

  // One group ref per phone for cheap per-frame position/rotation/scale updates.
  const phoneGroups = useRef<(THREE.Group | null)[]>(new Array(NUM_PHONES).fill(null));
  const offsetRef = useRef(0);
  const hoverProgressRef = useRef(0);

  useFrame((_, delta) => {
    const targetHover = hovered ? 1 : 0;
    hoverProgressRef.current += (targetHover - hoverProgressRef.current) * STATE_LERP;
    const h = hoverProgressRef.current;

    offsetRef.current += delta * CYCLE_SPEED;
    // Dwell at each integer slot (incl. centre) before sliding to the next.
    const offset = easedOffset(offsetRef.current);

    const lerp = THREE.MathUtils.lerp;

    for (let i = 0; i < NUM_PHONES; i++) {
      const phone = phoneGroups.current[i];
      if (!phone) continue;

      // Phone i's continuous slot position. CENTER_SLOT - i so phone 0 starts at
      // centre, phone 1 at slot 2 (right), phone 6 at slot 4 (left), etc.
      // Anticlockwise cycle: offset increases, slot index increases (right → centre → left → out).
      let slotFloat = (CENTER_SLOT - i + offset) % NUM_PHONES;
      if (slotFloat < 0) slotFloat += NUM_PHONES;

      const slotA = Math.floor(slotFloat) % NUM_PHONES;
      const slotB = (slotA + 1) % NUM_PHONES;
      const frac = slotFloat - Math.floor(slotFloat);

      const rA = REST_SLOTS[slotA],  rB = REST_SLOTS[slotB];
      const hA = HOVER_SLOTS[slotA], hB = HOVER_SLOTS[slotB];

      // Blend rest ↔ hover by current hover progress, fractional slot interp inside each.
      const x       = lerp(lerp(rA.x,       rB.x,       frac), lerp(hA.x,       hB.x,       frac), h);
      const y       = lerp(lerp(rA.y,       rB.y,       frac), lerp(hA.y,       hB.y,       frac), h);
      const z       = lerp(lerp(rA.z,       rB.z,       frac), lerp(hA.z,       hB.z,       frac), h);
      const rotZ    = lerp(lerp(rA.rotZ,    rB.rotZ,    frac), lerp(hA.rotZ,    hB.rotZ,    frac), h);
      const scale   = lerp(lerp(rA.scale,   rB.scale,   frac), lerp(hA.scale,   hB.scale,   frac), h);
      const opacity = lerp(lerp(rA.opacity, rB.opacity, frac), lerp(hA.opacity, hB.opacity, frac), h);

      phone.position.set(x, y, z);
      phone.rotation.z = rotZ;
      phone.scale.setScalar(scale);

      // Apply opacity to materials. (Materials were set to transparent in PhoneInstance.)
      phone.traverse((obj) => {
        if (!(obj instanceof THREE.Mesh)) return;
        const mat = obj.material as THREE.Material | THREE.Material[];
        if (Array.isArray(mat)) {
          mat.forEach((m) => { if ("opacity" in m) (m as THREE.Material & { opacity: number }).opacity = opacity; });
        } else if (mat && "opacity" in mat) {
          (mat as THREE.Material & { opacity: number }).opacity = opacity;
        }
      });

      // Pause off-stage videos so we don't hit browser concurrent-video limits.
      const vid = videoEls[i];
      if (vid) {
        if (opacity < 0.12) {
          if (!vid.paused) vid.pause();
        } else if (vid.paused) {
          vid.play().catch(() => {});
        }
      }
    }
  });

  return (
    <>
      {Array.from({ length: NUM_PHONES }).map((_, i) => (
        <PhoneInstance
          key={i}
          sceneRoot={sceneRoot}
          videoTexture={textures[i] ?? null}
          groupSetter={(g) => { phoneGroups.current[i] = g; }}
        />
      ))}
    </>
  );
}

/* ── Outer component ───────────────────────────────────────── */

type Props = {
  /** Path under /public, e.g. /models/iphone/iphone-15-pro-max.glb */
  model: string;
  /** Array of 7 video URLs (webm preferred). */
  videos: string[];
  /** Optional poster shown until ready. */
  poster?: string;
  /** Override aspect ratio (ignored when fill is true). */
  aspectRatio?: string;
  /** Fill parent container height instead of using aspect ratio. */
  fill?: boolean;
  className?: string;
  /** Disable hover animation (e.g. parent already handles cursor). */
  hoverable?: boolean;
};

function PhoneCarouselInner({
  model,
  videos,
  poster,
  aspectRatio = "16/9",
  fill = false,
  className,
  hoverable = true,
}: Props) {
  const [hovered, setHovered] = useState(false);
  const [ready, setReady] = useState(false);

  // Once any video has played a frame, hide the loader/poster.
  useEffect(() => {
    if (typeof document === "undefined") return;
    let cancelled = false;
    const check = () => {
      if (cancelled) return;
      // Just mark ready after a short delay — Canvas + first paint will look ok by then.
      setReady(true);
    };
    const t = setTimeout(check, 600);
    return () => { cancelled = true; clearTimeout(t); };
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
      {poster && !ready && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", transition: "opacity 0.3s ease",
          }}
        />
      )}
      {!ready && <Loader size={28} />}

      <Canvas
        camera={{
          position: [0, 0, CAMERA_DISTANCE],
          fov: CAMERA_FOV,
          near: 0.1,
          far: 50,
        }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        style={{ position: "absolute", inset: 0 }}
      >
        <ambientLight intensity={0.65} />
        <directionalLight position={[4, 5, 5]} intensity={1.0} />
        <directionalLight position={[-3, 2, -3]} intensity={0.35} />
        <Suspense fallback={null}>
          <Environment preset="city" />
          <Carousel model={model} videos={videos} hovered={hovered} />
        </Suspense>
      </Canvas>
    </div>
  );
}

// SSR-safe wrapper: r3f + WebGL only work in the browser.
const PhoneCarousel = dynamic(() => Promise.resolve(PhoneCarouselInner), {
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

export default PhoneCarousel;
