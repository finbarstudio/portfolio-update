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
import { useGroupHover } from "./useGroupHover";

/* ── Tunables ──────────────────────────────────────────────── */

const NUM_PHONES = 7;
const CENTER_SLOT = 3;                  // The visible "centre" slot index
const CYCLE_SPEED = 0.32;               // Slot-steps per second (raw; eased via DWELL).
const DWELL_PORTION = 0.35;             // Fraction of each step spent paused at the integer slot.
const STATE_LERP = 0.04;                // Hover state transition easing
const CAMERA_DISTANCE = 0.42;           // Camera Z — further pull-back.
const CAMERA_FOV = 32;
const FLANK_ROT = Math.PI / 12;         // ±15° — subtle Z-tilt on flanking phones.
const PRELOAD_THRESHOLD = 0.25;         // Phones above this scale get src+load (buffering starts early).
const ONSTAGE_THRESHOLD = 0.5;          // Phones above this scale actually play (limits active decoders).

// Each slot = where a phone is when its slotFloat lands exactly on that index.
// Phones interpolate continuously between adjacent slots, wrapping mod 7.
// Slot 3 = visible centre. Slots 2/4 = flanks. 1/5 = transitional fade. 0/6 = hidden.
// X/Y/Z values are tuned for CAMERA_DISTANCE = 1.6 (≈4x zoom).
type Slot = {
  x: number; y: number; z: number;
  rotZ: number; scale: number; opacity: number;
};

// `opacity` here is now a "presence factor": 1 = fully present, 0 = fully gone.
// It drives a per-phone uniform that darkens body/trim/glass via color
// modulation (no real material transparency) and scales the phone toward 0
// at the edges so entries/exits fade smoothly with no z-fighting or see-thru.
const REST_SLOTS: Slot[] = [
  // Only slots 2/3/4 hold a video src + active decoder (see ONSTAGE_THRESHOLD).
  // Slots 1/5 keep a tiny scale for smooth scale-in/out at the edges without
  // costing a decoder; slots 0/6 are fully invisible.
  { x:  0.40, y: -0.14, z: -0.15, rotZ: -FLANK_ROT, scale: 0.0,  opacity: 0.0 }, // 0: far off-right (invisible)
  { x:  0.27, y: -0.08, z: -0.07, rotZ: -FLANK_ROT, scale: 0.30, opacity: 0.0 },// 1: entering right (no decoder)
  { x:  0.17, y: -0.04, z: -0.02, rotZ: -FLANK_ROT, scale: 0.78, opacity: 0.70 },// 2: RIGHT (live video)
  { x:  0.00, y:  0.00, z:  0.00, rotZ:  0,         scale: 1.0,  opacity: 1.0  },// 3: CENTER (live video)
  { x: -0.17, y: -0.04, z: -0.02, rotZ:  FLANK_ROT, scale: 0.78, opacity: 0.70 },// 4: LEFT (live video)
  { x: -0.27, y: -0.08, z: -0.07, rotZ:  FLANK_ROT, scale: 0.30, opacity: 0.0 },// 5: exiting left (no decoder)
  { x: -0.40, y: -0.14, z: -0.15, rotZ:  FLANK_ROT, scale: 0.0,  opacity: 0.0 }, // 6: far off-left
];

const HOVER_SLOTS: Slot[] = [
  { x:  0.56, y: 0, z: 0, rotZ: 0, scale: 0.0, opacity: 0.0 },
  { x:  0.40, y: 0, z: 0, rotZ: 0, scale: 0.6, opacity: 0.35 },
  { x:  0.22, y: 0, z: 0, rotZ: 0, scale: 1.0, opacity: 0.70 },
  { x:  0.00, y: 0, z: 0, rotZ: 0, scale: 1.0, opacity: 1.0 },
  { x: -0.22, y: 0, z: 0, rotZ: 0, scale: 1.0, opacity: 0.70 },
  { x: -0.40, y: 0, z: 0, rotZ: 0, scale: 0.6, opacity: 0.35 },
  { x: -0.56, y: 0, z: 0, rotZ: 0, scale: 0.0, opacity: 0.0 },
];

// Base scale applied to the loaded model before slot scaling. iPhone OBJ comes
// in arbitrary units; this is tuned so the centre phone fills the frame nicely.
const MODEL_BASE_SCALE = 1.27; // 1.5x bump from 0.85

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
  const cloned = useMemo(() => sceneRoot.clone(true), [sceneRoot]);

  useEffect(() => {
    if (!videoTexture) return;

    // All materials opaque — fade is handled by scale + color modulation, not
    // material transparency (which caused both see-through bugs and z-fighting
    // between 7 overlapping phones).
    // DoubleSide: screen-Mesh_1's vertex winding/normals point away from the
    // camera in this OBJ → without DoubleSide the front face never rasterises
    // and you see through to screen-Mesh behind (dark, looks like a reflective
    // gradient because of MeshPhysicalMaterial). Also bump renderOrder + skip
    // depth test for the screen plane so it wins z-fighting against the
    // co-planar surround mesh sitting at the same Z.
    const screenMat = new THREE.MeshBasicMaterial({
      map: videoTexture,
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
    // Antenna bands (cylinder meshes) need a distinct mid-grey so they read as
    // the titanium band colour rather than white highlights from the environment.
    const antennaMat = new THREE.MeshPhysicalMaterial({
      color: "#3d3d40",
      roughness: 0.5,
      metalness: 0.85,
    });

    // The iPhone 15 Pro Max OBJ has per-primitive sub-meshes with quirks we
    // need to target individually (verified via scripts/probe-glb.mjs).
    //
    // screen-Mesh   (prim 0, 348 verts) — main display surface, but its UVs
    //                                     atlas-map to only u[0.63-0.87]
    //                                     v[0.25-0.50] of the texture. Using
    //                                     this for video causes the "zoomed
    //                                     way too far in" effect. Treat as
    //                                     screen frame (dark).
    // screen-Mesh_1 (prim 1,  96 verts) — inner display panel with full
    //                                     UV[0,1] — THE plane the video
    //                                     should actually map to.
    // screen-Mesh_2 (prim 2,  36 verts) — tiny slider detail near the top.
    //
    // phone_case-Mesh   (prim 0, 1887 verts, "Material.001" glass) — the
    //                                     glass shell that wraps the whole
    //                                     phone front and was blocking the
    //                                     screen. Hide this one only.
    // phone_case-Mesh_1 (prim 1,  834 verts) — tiny bottom-edge detail.
    // phone_case-Mesh_2 (prim 2, 33095 verts, "metal") — the metal frame /
    //                                     bezel + back — KEEP visible for
    //                                     bevel realism.
    cloned.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      const name = obj.name ?? "";
      const lower = name.toLowerCase();

      // Hide the glass shell front-face that was occluding the screen.
      if (name === "phone_case-Mesh") {
        obj.visible = false;
        return;
      }
      // The bottom speaker-grille detail mesh ("scroo" = scrooo/screw misspelt
      // in the OBJ). Without the phone_case glass overlaying it, the raw dots
      // protrude unnaturally — hide them.
      if (lower.startsWith("scroo")) {
        obj.visible = false;
        return;
      }

      // The video plane: only prim[1] of screen-Mesh has full-range UVs.
      if (name === "screen-Mesh_1") {
        obj.material = screenMat;
        // Force-on-top: combined with screenMat depthTest=false, this draws
        // the video plane over the co-planar surround regardless of order.
        obj.renderOrder = 10;
        return;
      }
      // Other screen prims become the dark surround (so prim[0]'s atlas-UV
      // sampling doesn't render a giant zoomed copy of the video).
      if (name === "screen-Mesh" || name === "screen-Mesh_2") {
        obj.material = bodyMat;
        return;
      }

      if (lower.includes("camera_glass") || lower.includes("flash_glass") || lower.includes("lens")) {
        obj.material = glassMat;
      } else if (lower.includes("flash") || lower.includes("logo")) {
        obj.material = trimMat;
      } else if (lower.includes("cylinder") || lower.includes("sphere")) {
        // Antenna bands + camera-bump rings — mid-grey titanium, less specular
        // than bodyMat so they don't blow out to white under the env lighting.
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
  // CRITICAL: src is *NOT* attached here. Browsers (esp. Chrome) cap active
  // video decoders at ~4-6. Mounting 7 <video src=...> simultaneously causes
  // 6 of them to fail with NotSupportedError. Instead we attach src lazily
  // in useFrame only while a phone is on-stage, and detach when off-stage.
  const videoEls = useMemo(() => {
    if (typeof document === "undefined") return [] as HTMLVideoElement[];
    return videos.map(() => {
      const el = document.createElement("video");
      el.muted = true;
      el.loop = true;
      el.playsInline = true;
      el.preload = "none";
      el.setAttribute("playsinline", "");
      el.setAttribute("muted", "");
      // No src yet — set lazily in useFrame.
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
      tex.flipY = false;    // VP9 frames are top-to-bottom; default flipY=true would invert vertically
      tex.repeat.set(-1, 1); // mirror horizontally to correct left-right flip from the mesh UV winding
      tex.offset.set(1, 0);
      return tex;
    });
  }, [videoEls]);

  useEffect(() => {
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
    // Force every video texture to re-upload its latest frame each tick. Some
    // r3f/three combos don't auto-mark VideoTextures dirty until the video
    // fires "timeupdate", which only happens 4x/sec at best — too slow.
    textures.forEach((t, i) => {
      const el = videoEls[i];
      if (el && el.readyState >= 2) t.needsUpdate = true;
    });

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

      phone.position.set(x, y, z);
      phone.rotation.z = rotZ;
      phone.scale.setScalar(scale);

      const visible   = scale > 0.02;
      const preload   = scale > PRELOAD_THRESHOLD;   // start buffering (no decoder yet)
      const onStage   = scale > ONSTAGE_THRESHOLD;   // actually play (decoder active)
      if (phone.visible !== visible) phone.visible = visible;

      // Two-threshold lazy video lifecycle:
      //   preload zone  — attach src + load() so the browser fetches/buffers the
      //                   file in advance; no play() so no decoder slot consumed.
      //   onstage zone  — call play() to activate the decoder and start rendering.
      //   offstage      — pause + detach src to free the decoder.
      const vid = videoEls[i];
      const srcWanted = videos[i];
      if (vid) {
        if (onStage) {
          if (vid.getAttribute("src") !== srcWanted) { vid.src = srcWanted; vid.load(); }
          if (vid.paused) vid.play().catch(() => {});
        } else if (preload) {
          // Attach src so the browser buffers ahead, but don't play yet.
          if (vid.getAttribute("src") !== srcWanted) { vid.src = srcWanted; vid.load(); }
          if (!vid.paused) vid.pause();
        } else {
          if (!vid.paused) vid.pause();
          if (vid.getAttribute("src")) { vid.removeAttribute("src"); vid.load(); }
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

/* ── Real-time resize ──────────────────────────────────────────
   Polls the container size each frame and resizes the renderer + camera
   live, so the phones shrink/grow smoothly WITH the container instead of
   snapping after r3f's ResizeObserver settles (which causes the hover jump). */
function LiveResize() {
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);
  const setSize = useThree((s) => s.setSize);
  const last = useRef({ w: 0, h: 0 });

  useFrame(() => {
    const parent = gl.domElement.parentElement;
    if (!parent) return;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    if (w < 1 || h < 1) return;
    if (w !== last.current.w || h !== last.current.h) {
      last.current = { w, h };
      setSize(w, h);
      const cam = camera as THREE.PerspectiveCamera;
      if (cam.isPerspectiveCamera) {
        cam.aspect = w / h;
        cam.updateProjectionMatrix();
      }
    }
  });
  return null;
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
  // Hover is driven by the parent card (.group) so the carousel shares the card's
  // single hover state rather than its own separate canvas hover.
  const { ref: hoverRef, hovered } = useGroupHover<HTMLDivElement>(hoverable);
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
      ref={hoverRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        ...(fill ? { height: "100%" } : { aspectRatio }),
        background: "var(--color-bg, #FAFAF8)",
        overflow: "hidden",
        cursor: hoverable ? "pointer" : "default",
      }}
    >
      {/* Soft pink wash on hover, behind the canvas */}
      <div className="mockup-pink-bg" aria-hidden="true" style={{ opacity: hovered ? 1 : 0 }} />

      {/* Edge fade — masks phones entering/exiting on both sides. Two layers
          crossfade so the edges match the bg (off-white) at rest and the light
          pink wash on hover. */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none",
        background: "linear-gradient(to right, var(--color-bg, #FAFAF8) 0%, transparent 5%, transparent 95%, var(--color-bg, #FAFAF8) 100%)",
        opacity: hovered ? 0 : 1,
        transition: "opacity var(--dur-slow) var(--ease)",
      }} />
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none",
        background: "linear-gradient(to right, #FFE9F4 0%, transparent 5%, transparent 95%, #FFE9F4 100%)",
        opacity: hovered ? 1 : 0,
        transition: "opacity var(--dur-slow) var(--ease)",
      }} />
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
        <LiveResize />
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
