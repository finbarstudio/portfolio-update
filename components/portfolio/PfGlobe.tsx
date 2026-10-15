"use client";

/**
 * Plated with Issy: a globe of Issy's polaroids, live in three.js.
 *
 * The layout is Finbar's "Globe 03" setup from the motion tool (Lab/motion-tool,
 * engine.ts: layouts.globe, close variant; his saved settings: 56 cards at size
 * 0.54, 4:5, distance 1.18, a 60 second turn to the right): cards spread evenly
 * over a sphere by the golden angle, each facing straight out from the middle
 * and turned in its own plane by the "fan" tilt (8 degrees per card from the
 * middle of the set, engine.ts: tiltMode "fan", cardTilt 8),
 * the camera at 35 degrees, and cards dimmed the further back they are. Units
 * are the tool's own: a card 2 units tall fills the frame at z = 0.
 *
 * Here it is live instead of a video: it turns slowly on its own, round its
 * upright axis, and can be grabbed and spun sideways round that same axis (it
 * eases back to its slow turn when let go). Nothing else reacts to the pointer.
 * On a touch screen an up-down drag still scrolls the page. It only draws
 * while it is on screen.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { corsMedia, media } from "@/lib/media";

const DIR = "/media/images/portfolio/plated-with-issy/polaroids";
const NAMES = [
  "the-venue", "first-course", "spread", "friends", "focaccia-and-figs", "something-sweet", "dig-in",
  "canapes", "aperitivo", "a-little-wine", "crudo", "candlelight", "menu", "our-host", "pass-it-round",
  "sweet", "the-table", "issy", "our-host-portrait",
];

// the motion tool's Globe 03
const COUNT = 56;
const CARD_H = 0.54;
const CARD_W = CARD_H * (1636 / 2024); // the polaroids' own shape
const RADIUS = 1.7;
const FOV = 35;
// further back than the tool's framing (camZ * 1.18 + 0.6 = 4.3) so the whole globe sits in the page with
// room round it and the far side shows through the gaps
const CAM_Z = 7.6;
const GOLDEN_ANGLE = 2.39996323;
const CARD_TILT = (8 * Math.PI) / 180; // the tool's default tilt angle, applied as a fan

// motion
const SPIN = (Math.PI * 2) / 60; // radians a second when left alone: one turn a minute, to the right, as in the setup
const PAPER = new THREE.Color("#f6edd6"); // a polaroid's paper, shown until its photo has loaded

/** where card i sits and which way it faces, from the tool's globe layout */
function place(i: number) {
  const y = 1 - (2 * (i + 0.5)) / COUNT;
  const r = Math.sqrt(1 - y * y);
  const theta = i * GOLDEN_ANGLE;
  const x = Math.cos(theta) * r;
  const z = Math.sin(theta) * r;
  // fan tilt: each card turned in its own plane, more the further it is from the middle of the set
  const rz = -(i - (COUNT - 1) / 2) * CARD_TILT;
  return { pos: new THREE.Vector3(x * RADIUS, y * RADIUS, z * RADIUS), ry: Math.atan2(x, z), rx: -Math.asin(y), rz };
}

const plane = new THREE.PlaneGeometry(CARD_W, CARD_H);

function Card({ i, texture }: { i: number; texture: THREE.Texture | null }) {
  const { pos, rx, ry, rz } = useMemo(() => place(i), [i]);
  const group = useRef<THREE.Group>(null);
  const front = useRef<THREE.MeshBasicMaterial>(null);
  const world = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const g = group.current;
    const m = front.current;
    if (!g || !m) return;
    // dimmer the further back it is, as the tool shades it
    g.getWorldPosition(world);
    const depth = world.z - state.camera.position.z;
    const shade = THREE.MathUtils.clamp(1 + (depth + CAM_Z) * 0.1, 0.4, 1);
    if (m.map) m.color.setScalar(shade);
    else m.color.copy(PAPER).multiplyScalar(shade);
  });

  return (
    <group ref={group} position={pos} rotation={[rx, ry, rz, "YXZ"]}>
      <mesh geometry={plane}>
        {/* both sides show the polaroid, as the motion tool draws its cards, so the far side of the globe is photographs too */}
        <meshBasicMaterial ref={front} key={texture ? "image" : "paper"} map={texture ?? undefined} color={texture ? "#ffffff" : PAPER} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Globe({ drag }: { drag: React.MutableRefObject<{ vx: number; down: boolean }> }) {
  const spin = useRef<THREE.Group>(null);
  const yaw = useRef(0);
  // the globe's own speed: follows the hand while it is held, then eases back to the slow turn
  const vel = useRef(SPIN);
  const still = useRef(false);
  useEffect(() => {
    still.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const [textures, setTextures] = useState<(THREE.Texture | null)[]>(() => NAMES.map(() => null));
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    let live = true;
    const made: THREE.Texture[] = [];
    NAMES.forEach((name, k) => {
      loader.load(corsMedia(media(`${DIR}/${name}.webp`)), (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = gl.capabilities.getMaxAnisotropy();
        made.push(t);
        if (!live) return t.dispose();
        setTextures((prev) => prev.map((v, j) => (j === k ? t : v)));
      });
    });
    return () => {
      live = false;
      made.forEach((t) => t.dispose());
    };
  }, [gl]);

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05);
    const g = drag.current;
    // held, it moves with the hand; let go, a flick carries on and settles back to the slow turn
    vel.current = g.down ? g.vx : THREE.MathUtils.damp(vel.current, still.current ? 0 : SPIN, 1.6, d);
    yaw.current += vel.current * d;
    if (spin.current) spin.current.rotation.y = yaw.current;
  });

  return (
    <group ref={spin}>
      {Array.from({ length: COUNT }, (_, i) => (
        <Card key={i} i={i} texture={textures[i % NAMES.length]} />
      ))}
    </group>
  );
}

export default function PfGlobe() {
  const box = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false); // close enough to build
  const [seen, setSeen] = useState(false); // on screen: keep drawing
  const drag = useRef({ vx: SPIN, down: false });
  const last = useRef({ x: 0, t: 0 });
  const [grabbing, setGrabbing] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const load = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "150% 0px" });
    const draw = new IntersectionObserver(([e]) => setSeen(e.isIntersecting));
    load.observe(el);
    draw.observe(el);
    return () => {
      load.disconnect();
      draw.disconnect();
    };
  }, []);

  const onDown = (e: React.PointerEvent) => {
    // taking hold stops it: it moves only as the hand moves
    drag.current = { vx: 0, down: true };
    last.current = { x: e.clientX, t: performance.now() };
    try {
      e.currentTarget.setPointerCapture(e.pointerId); // keep the drag when the pointer leaves the frame
    } catch {}
    setGrabbing(true);
  };
  const onMove = (e: React.PointerEvent) => {
    const g = drag.current;
    if (!g.down) return;
    const now = performance.now();
    const dtS = Math.max(0.008, (now - last.current.t) / 1000);
    const span = box.current?.clientWidth ?? 1000;
    // sideways only, round the axis it already turns on: a drag across the whole frame is about a half turn
    drag.current = { vx: (((e.clientX - last.current.x) / span) * Math.PI) / dtS, down: true };
    last.current = { x: e.clientX, t: now };
  };
  const onUp = () => {
    drag.current = { ...drag.current, down: false };
    setGrabbing(false);
  };

  return (
    <div
      ref={box}
      className="pf-globe"
      data-grabbing={grabbing ? "1" : "0"}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      role="img"
      aria-label="A turning globe of polaroids from Plated with Issy's supper club. Drag to spin it."
    >
      {near ? (
        <Canvas
          flat
          dpr={[1, 2]}
          frameloop={seen ? "always" : "never"}
          camera={{ fov: FOV, position: [0, 0, CAM_Z], near: 0.1, far: 50 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Globe drag={drag} />
        </Canvas>
      ) : null}
    </div>
  );
}
