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
const CAMERA_DISTANCE = 0.42;           // Camera Z — further pull-back.
const CAMERA_FOV = 32;
const FLANK_ROT = Math.PI / 12;         // ±15° — subtle Z-tilt on flanking phones.
const ONSTAGE_THRESHOLD = 0.5;          // Only phones above this scale get a video src + decoder.

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
  // Deep clone so each instance has its own materials (needed for per-instance
  // opacity + per-instance video texture). Geometry is shared.
  // The OBJ has screen at +Z and back at -Z; obj2gltf preserves that — so the
  // model needs no rotation. The "looking at the back" effect was caused by a
  // dark screen mat (video texture not yet decoded) being indistinguishable
  // from a dark phone body, compounded by z-fighting between 7 overlapping
  // transparent phones. Both fixed below.
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
        // Camera flash highlight + Apple logo — keep the lighter trim accent.
        obj.material = trimMat;
      } else {
        // Cylinders (antenna bands) + spheres (camera bumps) + frame + back
        // all get the body colour so antenna bands don't read as white stripes
        // against the dark titanium frame.
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
      return tex;
    });
  }, [videoEls]);

  useEffect(() => {
    // Aggressive diagnostics: every relevant video event is logged so we can
    // see in DevTools exactly why a screen is black (autoplay block, decode
    // error, file 404, codec unsupported, etc.).
    const off: Array<() => void> = [];
    videoEls.forEach((el, i) => {
      const log = (ev: string) => (e: Event) => {
        // eslint-disable-next-line no-console
        console.log(`[PhoneCarousel] video ${i} ${ev}`, {
          readyState: el.readyState,
          networkState: el.networkState,
          paused: el.paused,
          currentTime: el.currentTime.toFixed(2),
          duration: isFinite(el.duration) ? el.duration.toFixed(2) : "n/a",
          src: el.currentSrc,
          err: el.error ? `${el.error.code}: ${el.error.message}` : null,
          e,
        });
      };
      const events = ["loadedmetadata", "loadeddata", "canplay", "play", "playing", "error", "stalled", "suspend", "abort"];
      events.forEach((ev) => {
        const handler = log(ev);
        el.addEventListener(ev, handler);
        off.push(() => el.removeEventListener(ev, handler));
      });
    });

    // No upfront play() — lazy lifecycle is driven from useFrame based on the
    // onStage flag for each phone. That spreads loads/decoders over time and
    // keeps active decoder count to whatever's visible (typically 3-5).
    return () => {
      off.forEach((fn) => fn());
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

      // Cull truly invisible phones. Decoder-onstage uses a higher threshold
      // so only ~3 phones hold a video src at once (under browser cap).
      const visible = scale > 0.02;
      const onStage = scale > ONSTAGE_THRESHOLD;
      if (phone.visible !== visible) phone.visible = visible;

      // Lazy video lifecycle. ONLY phones currently on-stage hold a src + an
      // active decoder. This keeps us under the browser's concurrent-decoder
      // cap (~4-6) regardless of NUM_PHONES, and is the root fix for the
      // NotSupportedError storm we saw when all 7 mounted with src eagerly.
      const vid = videoEls[i];
      const srcWanted = videos[i];
      if (vid) {
        if (onStage) {
          // Attach src on first onstage transition (or after a previous detach).
          if (vid.getAttribute("src") !== srcWanted) {
            vid.src = srcWanted;
            vid.load();
          }
          if (vid.paused) vid.play().catch(() => {});
        } else {
          // Off-stage: pause and release the decoder by detaching src.
          if (!vid.paused) vid.pause();
          if (vid.getAttribute("src")) {
            vid.removeAttribute("src");
            vid.load();
          }
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
