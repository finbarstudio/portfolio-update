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
};

function DisplayModel({ modelUrl, videoTexture }: DisplayModelProps) {
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

  return <primitive object={root} />;
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
}: {
  hovered: boolean;
  modelUrl: string;
  videoTexture: THREE.VideoTexture | null;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Track the lookAt target separately so it can lerp too — at hover the
  // camera looks up at the screen face rather than the bbox centre.
  const lookAtY = useRef(0);

  useFrame(() => {
    if (!groupRef.current) return;
    const tx = hovered ? 0 : ISO_ROTATION_X;
    const ty = hovered ? 0 : ISO_ROTATION_Y;
    groupRef.current.rotation.x += (tx - groupRef.current.rotation.x) * LERP_ROTATION;
    groupRef.current.rotation.y += (ty - groupRef.current.rotation.y) * LERP_ROTATION;

    const targetZ = hovered ? CAMERA_DISTANCE_HOVER : CAMERA_DISTANCE_DEFAULT;
    const targetY = hovered ? CAMERA_Y_HOVER : CAMERA_Y_DEFAULT;
    const targetLookY = hovered ? LOOKAT_Y_HOVER : 0;
    camera.position.z += (targetZ - camera.position.z) * LERP_CAMERA;
    camera.position.y += (targetY - camera.position.y) * LERP_CAMERA;
    lookAtY.current += (targetLookY - lookAtY.current) * LERP_CAMERA;
    camera.lookAt(0, lookAtY.current, 0);
  });

  return (
    <group ref={groupRef}>
      <Center>
        <DisplayModel modelUrl={modelUrl} videoTexture={videoTexture} />
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
};

function ModelDisplayInner({
  model,
  video,
  poster,
  aspectRatio = "16/9",
  fill = false,
  className,
  hoverable = true,
}: Props) {
  // Hover is driven by the parent card (.group), so the 3D animation shares the
  // exact same hover state as the card border — one hover, not a separate one
  // over just the canvas.
  const { ref: hoverRef, hovered } = useGroupHover<HTMLDivElement>(hoverable);
  const [ready, setReady] = useState(false);

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
    return tex;
  }, [videoEl]);

  useEffect(() => {
    if (!videoEl) return;
    const onLoaded = () => {
      setReady(true);
      videoEl.play().catch(() => {});
    };
    videoEl.addEventListener("loadeddata", onLoaded);
    // Attach to the DOM so the browser decodes frames for the texture.
    document.body.appendChild(videoEl);
    // Kick off load + try to play immediately (muted autoplay is allowed).
    videoEl.load();
    videoEl.play().catch(() => {});
    return () => {
      videoEl.removeEventListener("loadeddata", onLoaded);
      videoEl.pause();
      videoEl.src = "";
      videoEl.removeAttribute("src");
      videoEl.load();
      if (videoEl.parentNode) videoEl.parentNode.removeChild(videoEl);
    };
  }, [videoEl]);

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
        background: "var(--color-bg, #FAFAF8)",
        overflow: "hidden",
        cursor: hoverable ? "pointer" : "default",
      }}
    >
      {/* Soft pink wash on hover, behind the canvas */}
      <div className="mockup-pink-bg" aria-hidden="true" style={{ opacity: hovered ? 1 : 0 }} />

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
      {!ready && <Loader size={28} />}

      <Canvas
        camera={{
          position: [0, CAMERA_Y_DEFAULT, CAMERA_DISTANCE_DEFAULT],
          fov: CAMERA_FOV,
          near: 0.1,
          far: 50,
        }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ position: "absolute", inset: 0 }}
      >
        <LiveResize />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={1.1} />
        <directionalLight position={[-4, 3, -2]} intensity={0.4} />
        <Suspense fallback={null}>
          <Environment preset="city" />
          <Rig hovered={hovered} modelUrl={model} videoTexture={videoTexture} />
        </Suspense>
      </Canvas>

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
        background: "var(--color-bg, #FAFAF8)",
      }}
    >
      <Loader size={28} />
    </div>
  ),
});

export default ModelDisplay;
