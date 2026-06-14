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
import { useGLTF, Environment, Center } from "@react-three/drei";
import Loader from "./Loader";
import { useGroupHover } from "./useGroupHover";
import { FrameDriver } from "./FrameDriver";
import { useAppReady } from "./useAppReady";

/* ── Tunables ──────────────────────────────────────────────── */

// Camera + framing. The GLTF nests the screen-mockup and the frame at
// different world positions, so the model is wrapped in drei's <Center>
// to recenter the combined bounding box at origin. With the model centred,
// the camera just lerps in/out along Z and the model rotation gives the
// isometric tilt at rest, easing to a flat front-on view on hover.
const CAMERA_FOV = 28;
// Rest = whole Mac + stand framed with margin (short containers don't crop).
// Hover = camera moves in AND up so the screen face fills the frame and the
// stand drops out of view — you can see the bevels.
const CAMERA_DISTANCE_DEFAULT = 19;    // Rest, isometric, full Mac + stand visible
const CAMERA_DISTANCE_HOVER = 12.08;   // Hover, zoomed onto the screen (bevels visible). 5% less zoom than 11.5
const CAMERA_Y_DEFAULT = 0;            // Rest camera height
const CAMERA_Y_HOVER = 0.9;            // Hover lifts camera to screen's vertical centre
const LOOKAT_Y_HOVER = 0.9;            // ...and looks at the same point
const LERP_ROTATION = 0.06;            // Rotation easing (slightly snappier)
const LERP_CAMERA = 0.03;              // Camera easing (slow, gentle glide)

// Isometric tilt (resting state). Applied to the centred model; hover state
// lerps these toward 0,0 to land on a flat, front-on, perfectly centred view.
const ISO_ROTATION_Y = -0.45;          // ~ -26°  (left/right)
const ISO_ROTATION_X = 0.12;           //   ~7°   (slight downward tilt)

/* ── Inner: Display model + video texture ──────────────────── */

type DisplayModelProps = {
  modelUrl: string;
  videoTexture: THREE.VideoTexture | null;
  onReady?: () => void;
};

function DisplayModel({ modelUrl, videoTexture, onReady }: DisplayModelProps) {
  const { scene } = useGLTF(modelUrl) as unknown as { scene: THREE.Group };

  // Clone once so the same model can be mounted in multiple ModelDisplay
  // instances on the same page without sharing materials/state.
  const root = useMemo(() => scene.clone(true), [scene]);

  // useGLTF suspends, so by the time this mounts the model is fully loaded.
  // Signal ready on the next frame so the renderer has painted it once before
  // the parent reveals the canvas (model + video appear together, no flash).
  useEffect(() => {
    const id = requestAnimationFrame(() => onReady?.());
    return () => cancelAnimationFrame(id);
  }, [onReady]);

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
      // Look up the source material name too — some models (e.g. the macbook glb)
      // use generic mesh names (Object_0..N) and need the screen detected via its
      // material (`Glass_-_Heavy_Color`).
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
        // Keep the glb's own material, but kill transmission/translucency. The
        // macbook ships translucent-plastic + glass materials whose transmission
        // forces an extra full-scene render pass every frame — the source of the
        // lag. Zeroing it keeps the look but drops the expensive pass.
        if (origMat.transmission > 0) {
          origMat.transmission = 0;
          origMat.transparent = false;
          origMat.opacity = 1;
        }
      }
    });

    return () => {
      screenMat.dispose();
      frameMat.dispose();
      standMat.dispose();
      monitorBackMat.dispose();
    };
  }, [root, videoTexture]);

  return <primitive object={root} />;
}

/* ── Scene-background fade ────────────────────────────────────
   The Mac model's clearcoat reflections vary the canvas alpha around its edges
   each frame, which made an HTML pink div behind the canvas appear to pulse as
   the transparent area fluctuated. Painting the bg into `scene.background`
   instead makes the canvas itself opaque — no transparent areas, no pulse. */
function BgFade({ hovered }: { hovered: boolean }) {
  const scene = useThree((s) => s.scene);
  const bg = useMemo(() => new THREE.Color("#e0e0e0"), []);   // shared thumbnail grey
  const pink = useMemo(() => new THREE.Color("#FFE9F4"), []); // pink 10% in white
  const cur = useMemo(() => new THREE.Color("#e0e0e0"), []);
  const amt = useRef(0);
  useFrame(() => {
    amt.current += ((hovered ? 1 : 0) - amt.current) * 0.07;
    cur.copy(bg).lerp(pink, amt.current);
    scene.background = cur;
  });
  return null;
}

/* ── Real-time resize ──────────────────────────────────────────
   r3f only resizes the render buffer + camera when its ResizeObserver
   fires, which lands after a CSS size transition settles — so the model
   appears to "snap" to the new size. This polls the container every frame
   and resizes live, so the model shrinks/grows smoothly WITH the container
   (e.g. when a featured card's thumbnail eases shorter on hover). */
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

/* ── Inner: rig that lerps rotation + camera distance on hover ── */

function Rig({
  hovered,
  modelUrl,
  videoTexture,
  scale = 1,
  cam,
  modelY = 0,
  engageRef,
  onModelReady,
}: {
  hovered: boolean;
  modelUrl: string;
  videoTexture: THREE.VideoTexture | null;
  scale?: number;
  cam: { dist: number; distHover: number; y: number; yHover: number; lookYHover: number };
  modelY?: number;
  // 0..1 "engagement" driven by scroll position (partial move toward the hover
  // pose), so the model has subtle life as it scrolls through the viewport.
  engageRef: React.MutableRefObject<number>;
  onModelReady?: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const lerp = THREE.MathUtils.lerp;

  // Track the lookAt target separately so it can lerp too — at hover the
  // camera looks up at the screen face rather than the bbox centre.
  const lookAtY = useRef(0);

  useFrame(() => {
    if (!groupRef.current) return;
    // Hover fully engages; scroll adds a partial engage when not hovered.
    const e = hovered ? 1 : engageRef.current;
    const tx = lerp(ISO_ROTATION_X, 0, e);
    const ty = lerp(ISO_ROTATION_Y, 0, e);
    groupRef.current.rotation.x += (tx - groupRef.current.rotation.x) * LERP_ROTATION;
    groupRef.current.rotation.y += (ty - groupRef.current.rotation.y) * LERP_ROTATION;

    const targetZ = lerp(cam.dist, cam.distHover, e);
    const targetY = lerp(cam.y, cam.yHover, e);
    const targetLookY = lerp(0, cam.lookYHover, e);
    camera.position.z += (targetZ - camera.position.z) * LERP_CAMERA;
    camera.position.y += (targetY - camera.position.y) * LERP_CAMERA;
    lookAtY.current += (targetLookY - lookAtY.current) * LERP_CAMERA;
    camera.lookAt(0, lookAtY.current, 0);
  });

  return (
    <group ref={groupRef}>
      <Center position={[0, modelY, 0]}>
        <group scale={scale}>
          <DisplayModel modelUrl={modelUrl} videoTexture={videoTexture} onReady={onModelReady} />
        </group>
      </Center>
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
  /** Fill parent container height instead of using aspect ratio. */
  fill?: boolean;
  className?: string;
  /** Disable hover animation (e.g. when used inside a parent that's already a link). */
  hoverable?: boolean;
  /** Bare: transparent canvas + no scene-background fade, so a reveal layer
   *  behind the model shows through (used in the sticker card thumbnails). */
  bare?: boolean;
  /** Uniform scale applied to the loaded model — different glb's ship at wildly
   *  different units. Default 1. The macbook glb, for example, needs ~0.33. */
  modelScale?: number;
  /** Rotation (radians) applied to the screen's video texture about its centre.
   *  Different glb's lay their screen UVs out at different orientations. */
  screenRotation?: number;
  /** Camera framing overrides (per-model, since glb's differ in scale/shape).
   *  Defaults match the studio-display tuning. */
  camDist?: number;
  camDistHover?: number;
  camY?: number;
  camYHover?: number;
  lookYHover?: number;
  /** Vertical offset of the centred model (raise/lower it in frame). */
  modelY?: number;
  /** Source-UV repeat [x, y] for the screen video. <1 crops/cover, >1 zooms out.
   *  Used to fix aspect when the glb's screen UVs don't match the video. */
  screenRepeat?: [number, number];
};

function ModelDisplayInner({
  model,
  video,
  poster,
  aspectRatio = "16/9",
  fill = false,
  className,
  hoverable = true,
  bare = false,
  modelScale = 1,
  screenRotation = 0,
  camDist = CAMERA_DISTANCE_DEFAULT,
  camDistHover = CAMERA_DISTANCE_HOVER,
  camY = CAMERA_Y_DEFAULT,
  camYHover = CAMERA_Y_HOVER,
  lookYHover = LOOKAT_Y_HOVER,
  modelY = 0,
  screenRepeat = [1, 1],
}: Props) {
  // Hover is driven by the parent card (.group), so the 3D animation shares the
  // exact same hover state as the card border — one hover, not a separate one
  // over just the canvas.
  const { ref: hoverRef, hovered } = useGroupHover<HTMLDivElement>(hoverable);
  // The star loader stays until BOTH the model AND its screen video are loaded,
  // then the canvas fades in and the star fades out together (no half-loaded
  // mac with a black screen, no star lingering over a loaded model).
  const [modelReady, setModelReady] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const ready = modelReady && videoReady;
  // Only mount the WebGL canvas + decode the video while the card is on (or near)
  // screen. A grid of always-rendering 3D canvases is the main source of lag;
  // gating them to the viewport keeps just the visible ones live.
  const [inView, setInView] = useState(false);
  // Defer the first canvas init past initial load + stagger vs other mockups.
  const appReady = useAppReady();

  // Scroll engagement: maps the model's progress through the viewport to a
  // 0..ENGAGE value, so it's *locked to scroll position* — scrolling down eases
  // it one way (toward the hover pose), scrolling back up reverses it.
  const engageRef = useRef(0);
  useEffect(() => {
    const el = hoverRef.current;
    if (!el || typeof window === "undefined") return;
    const SCROLL_ENGAGE = 0.6;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 as it enters the bottom of the viewport → 1 as it leaves the top.
      const progress = (vh - r.top) / (vh + r.height);
      engageRef.current = Math.min(1, Math.max(0, progress)) * SCROLL_ENGAGE;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [hoverRef]);

  // Build a single <video> element + VideoTexture that lives for the
  // lifetime of this component. Autoplay, muted, looping, inline.
  const videoEl = useMemo(() => {
    if (typeof document === "undefined") return null;
    const el = document.createElement("video");
    el.src = video;
    el.loop = true;
    el.muted = true;
    el.playsInline = true;
    el.autoplay = true;
    el.preload = "auto";
    // iOS Safari needs this attribute set as a property, not just attribute,
    // for inline autoplay to work without user interaction.
    el.setAttribute("playsinline", "");
    el.setAttribute("muted", "");
    // Keep the element off-screen but NOT display:none — several browsers
    // (Safari, iOS) won't decode frames for a WebGL texture unless the
    // <video> is actually attached to the DOM and renderable.
    el.style.cssText =
      "position:fixed;left:-9999px;top:0;width:2px;height:2px;opacity:0;pointer-events:none;";
    return el;
  }, [video]);

  const videoTexture = useMemo(() => {
    if (!videoEl) return null;
    const tex = new THREE.VideoTexture(videoEl);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    // Keep the default flipY (true) — matches the MOCKUP UVs in this GLTF.
    // Rotation about the texture centre — let per-model configs orient the
    // video correctly (e.g. macbook glb's Glass mesh UVs).
    tex.center.set(0.5, 0.5);
    tex.rotation = screenRotation;
    // Per-model UV transform. screenRepeat corrects aspect when the glb's screen
    // UVs don't match the video (e.g. the macbook's screen UVs are 90° rotated,
    // so a 16:9 video must be cropped on one axis to avoid stretching). repeat<1
    // crops in (cover); >1 zooms out. ClampToEdge so cropping doesn't tile.
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    const rx = screenRepeat[0];
    const ry = screenRepeat[1];
    tex.repeat.set(rx, ry);
    // Keep the sampled region centred (so cropping takes from both edges).
    tex.offset.set((1 - rx) / 2, (1 - ry) / 2);
    return tex;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoEl, screenRotation, screenRepeat[0], screenRepeat[1]]);

  // Watch the container's viewport visibility (200px margin so it's ready just
  // before it scrolls in).
  useEffect(() => {
    const el = hoverRef.current;
    if (!el || typeof IntersectionObserver === "undefined") { setInView(true); return; }
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hoverRef]);

  // Only decode the screen video while in view — pause + detach when off screen.
  useEffect(() => {
    if (!videoEl || !inView) return;
    const onLoaded = () => {
      setVideoReady(true);
      videoEl.play().catch(() => {});
    };
    videoEl.addEventListener("loadeddata", onLoaded);
    // Attach to the DOM so the browser decodes frames for the texture.
    document.body.appendChild(videoEl);
    videoEl.load();
    videoEl.play().catch(() => {});
    return () => {
      videoEl.removeEventListener("loadeddata", onLoaded);
      videoEl.pause();
      if (videoEl.parentNode) videoEl.parentNode.removeChild(videoEl);
    };
  }, [videoEl, inView]);

  useEffect(() => {
    return () => {
      videoTexture?.dispose();
    };
  }, [videoTexture]);

  return (
    <div
      ref={hoverRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        ...(fill ? { height: "100%" } : { aspectRatio }),
        background: bare ? "transparent" : "var(--thumb-bg, #e0e0e0)",
        overflow: "hidden",
        cursor: hoverable ? "pointer" : "default",
      }}
    >
      {/* Poster + spinner until first frame is ready */}
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
      {!ready && <Loader />}

      {inView && appReady && (
        <Canvas
          frameloop="demand"
          camera={{
            position: [0, CAMERA_Y_DEFAULT, CAMERA_DISTANCE_DEFAULT],
            fov: CAMERA_FOV,
            near: 0.1,
            far: 50,
          }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          style={{
            position: "absolute",
            inset: 0,
            opacity: ready ? 1 : 0,
            transition: "opacity 0.45s var(--ease, ease)",
          }}
        >
          {/* 30fps at rest (enough for the looping screen video), 60fps on hover
              for the camera glide. */}
          <FrameDriver active={hovered} idleFps={30} />
          <LiveResize />
          {!bare && <BgFade hovered={hovered} />}
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 8, 5]} intensity={1.1} />
          <directionalLight position={[-4, 3, -2]} intensity={0.4} />
          <Suspense fallback={null}>
            <Environment preset="city" />
            <Rig
              hovered={hovered}
              modelUrl={model}
              videoTexture={videoTexture}
              scale={modelScale}
              modelY={modelY}
              cam={{ dist: camDist, distHover: camDistHover, y: camY, yHover: camYHover, lookYHover }}
              engageRef={engageRef}
              onModelReady={() => setModelReady(true)}
            />
          </Suspense>
        </Canvas>
      )}

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
        height: "100%",
        background: "var(--thumb-bg, #e0e0e0)",
      }}
    >
      <Loader />
    </div>
  ),
});

export default ModelDisplay;
