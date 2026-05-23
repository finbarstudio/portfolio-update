"use client";

/**
 * MagazineCarousel — bone-skinned 3D magazine.
 *
 * Default (resting) state: pages laid out flat in a horizontal right-to-left
 * carousel, dwelling at each integer slot for legibility.
 *
 * Hover state: pages fold into a bone-skinned 3D book and auto-flip through
 * its pages with a real curl. Adapted from
 * github.com/shreejai/book-slider-3d, stripped of nav buttons, audio,
 * background plane and shadow material.
 */

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import Loader from "./Loader";

/* ── Tunables ──────────────────────────────────────────────── */

const PAGE_WIDTH = 1.28;
const PAGE_HEIGHT = 1.71;
const PAGE_DEPTH = 0.006;             // ↑ thicker stack avoids z-fight between sheets
const PAGE_SEGMENTS = 30;
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS;

const EASING_FACTOR = 0.16;           // ↓ slower damp so the flip is less aggressive
const EASING_FACTOR_FOLD = 0.12;
// Bone curl intensities: kept low so the cumulative tip rotation across the
// 31-bone chain stays well under 60°. Higher values cause the leading edge to
// curl far enough that it bends back into the unflipped stack.
const INSIDE_CURVE_STRENGTH = 0.055;
const OUTSIDE_CURVE_STRENGTH = 0.018;
const TURNING_CURVE_STRENGTH = 0.030;

const AUTO_FLIP_MS = 3400;            // ↑ longer pause between turns
const TURN_DURATION_MS = 1500;        // ↑ curl visible for longer, slower swing

// Lift the actively-flipping sheet during its turn so the curled body
// doesn't intersect the remaining unflipped stack.
//   FLIP_Z_LIFT — local z (page normal), effective at flip start/end when
//                 the page is flat and parallel to the stack.
//   FLIP_Y_ARC  — world up, effective at mid-flip when the page is vertical
//                 (z is sideways). Page arcs OVER the rest of the book.
const FLIP_Z_LIFT = 0.22;
const FLIP_Y_ARC  = 0.45;

// Camera zoom: in book mode pull back further so the wider page fan has room
// to breathe; in carousel mode bring closer so text reads.
const CAM_Z_BOOK = 3.6;               // was 2.7 — too tight, page tips left frame
const CAM_Z_CAROUSEL = 2.5;
const CAM_Y_BOOK = 0.20;
const CAM_Y_CAROUSEL = -0.05;

// Book root rotation so the cover faces the camera.
const BOOK_ROT_Y = -Math.PI / 2;
const BOOK_ROT_X = -Math.PI / 18;

// Per-sheet fan-out angle (degrees) added to each page's rest rotation in book
// mode. Wider fan = visible separation between adjacent pages and, crucially,
// a clear V of empty air through which the flipping page can swing.
const BOOK_FAN_DEG = 3.5;             // was 0.8 — too tight, pages stacked flat

const HOVER_STATE_LERP = 0.06;
const CAROUSEL_SPEED = 0.30;          // slot units / sec
const CAROUSEL_DWELL_PORTION = 0.40;  // fraction of each step pages hold still
const CAROUSEL_SPACING = 1.55;
const CAROUSEL_VISIBLE_HALF = 2.5;
const CAROUSEL_SCALE_BASE = 0.70;     // base scale of far pages — bigger = more readable
const CAROUSEL_SCALE_RANGE = 0.30;    // additional scale at centre slot

/* ── Carousel easing: dwell at each integer slot for legibility ─ */
function easedCarouselOffset(raw: number): number {
  const intPart = Math.floor(raw);
  const frac = raw - intPart;
  if (frac < CAROUSEL_DWELL_PORTION) return intPart;    // pause at slot
  const t = (frac - CAROUSEL_DWELL_PORTION) / (1 - CAROUSEL_DWELL_PORTION);
  return intPart + t * t * (3 - 2 * t);                 // smoothstep to next
}

/* ── Build geometry + skinning attributes once (module scope) ── */

const pageGeometry = new THREE.BoxGeometry(
  PAGE_WIDTH,
  PAGE_HEIGHT,
  PAGE_DEPTH,
  PAGE_SEGMENTS,
  2
);
pageGeometry.translate(PAGE_WIDTH / 2, 0, 0); // pivot at left edge (spine)

{
  const position = pageGeometry.attributes.position;
  const vertex = new THREE.Vector3();
  const skinIndexes: number[] = [];
  const skinWeights: number[] = [];

  for (let i = 0; i < position.count; i++) {
    vertex.fromBufferAttribute(position, i);
    const x = vertex.x;
    const skinIndex = Math.max(0, Math.floor(x / SEGMENT_WIDTH));
    const skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH;
    skinIndexes.push(skinIndex, skinIndex + 1, 0, 0);
    skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
  }

  pageGeometry.setAttribute(
    "skinIndex",
    new THREE.Uint16BufferAttribute(skinIndexes, 4)
  );
  pageGeometry.setAttribute(
    "skinWeight",
    new THREE.Float32BufferAttribute(skinWeights, 4)
  );
}

const whiteColor = new THREE.Color("white");
const edgeColor = new THREE.Color("#f3f1ec");

const edgeMaterials = [
  new THREE.MeshStandardMaterial({ color: whiteColor }),
  new THREE.MeshStandardMaterial({ color: edgeColor }),
  new THREE.MeshStandardMaterial({ color: whiteColor }),
  new THREE.MeshStandardMaterial({ color: whiteColor }),
];

/* ── Single sheet ──────────────────────────────────────────── */

type SheetProps = {
  number: number;
  totalSheets: number;
  frontTex: THREE.Texture;
  backTex: THREE.Texture;
  page: number;
  opened: boolean;
  bookClosed: boolean;
  hoverProgressRef: React.MutableRefObject<number>;
  hoverOffsetRef: React.MutableRefObject<number>;
};

function Sheet({
  number,
  totalSheets,
  frontTex,
  backTex,
  page,
  opened,
  bookClosed,
  hoverProgressRef,
  hoverOffsetRef,
}: SheetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const skinnedRef = useRef<THREE.SkinnedMesh>(null);
  const turnedAt = useRef(0);
  const lastOpened = useRef(opened);

  const manualSkinnedMesh = useMemo(() => {
    const bones: THREE.Bone[] = [];
    for (let i = 0; i <= PAGE_SEGMENTS; i++) {
      const bone = new THREE.Bone();
      bones.push(bone);
      bone.position.x = i === 0 ? 0 : SEGMENT_WIDTH;
      if (i > 0) bones[i - 1].add(bone);
    }
    const skeleton = new THREE.Skeleton(bones);

    const materials: THREE.Material[] = [
      ...edgeMaterials,
      new THREE.MeshStandardMaterial({
        color: whiteColor,
        map: frontTex,
        roughness: 0.85,
      }),
      new THREE.MeshStandardMaterial({
        color: whiteColor,
        map: backTex,
        roughness: 0.85,
      }),
    ];

    const mesh = new THREE.SkinnedMesh(pageGeometry, materials);
    mesh.frustumCulled = false;
    mesh.add(skeleton.bones[0]);
    mesh.bind(skeleton);
    return mesh;
  }, [frontTex, backTex]);

  useEffect(() => {
    return () => {
      const mats = manualSkinnedMesh.material as THREE.Material[];
      mats[4]?.dispose();
      mats[5]?.dispose();
    };
  }, [manualSkinnedMesh]);

  useFrame((_, delta) => {
    if (!skinnedRef.current || !groupRef.current) return;

    if (lastOpened.current !== opened) {
      turnedAt.current = +new Date();
      lastOpened.current = opened;
    }

    let turningTime = Math.min(TURN_DURATION_MS, +new Date() - turnedAt.current) / TURN_DURATION_MS;
    turningTime = Math.sin(turningTime * Math.PI);

    let bookTargetRotation = opened ? -Math.PI / 2 : Math.PI / 2;
    if (!bookClosed) {
      // Fan each side toward upright so the two stacks form a V with a clear
      // wedge of air above the spine for the flipping sheet to swing through.
      // Deeper sheets (higher `number`) tilt more toward 0.
      const fan = THREE.MathUtils.degToRad(number * BOOK_FAN_DEG);
      bookTargetRotation += opened ? fan : -fan;
    }

    const h = hoverProgressRef.current;

    // ── Carousel slot for this sheet ──────────────────────────
    const N = totalSheets;
    const easedOffset = easedCarouselOffset(hoverOffsetRef.current);
    let slot = ((number - easedOffset) % N + N) % N;
    if (slot > N / 2) slot -= N;                         // wrap to [-N/2, N/2)
    const absS = Math.abs(slot);
    let carouselScale = 0;
    if (absS <= CAROUSEL_VISIBLE_HALF + 1) {
      const k = THREE.MathUtils.clamp(1 - absS / (CAROUSEL_VISIBLE_HALF + 1), 0, 1);
      carouselScale = CAROUSEL_SCALE_BASE + k * CAROUSEL_SCALE_RANGE;
    }
    // Page geometry pivots at its left edge, so subtract half-width to put the
    // visible centre of each sheet at the slot x.
    const carouselGroupX = -slot * CAROUSEL_SPACING - PAGE_WIDTH / 2;

    // ── Bones: blend book-fold rotations toward 0 by hover ────
    const bones = skinnedRef.current.skeleton.bones;
    for (let i = 0; i < bones.length; i++) {
      const target: THREE.Object3D = i === 0 ? groupRef.current : bones[i];

      const insideCurveIntensity = i < 8 ? Math.sin(i * 0.2 + 0.25) : 0;
      const outsideCurveIntensity = i >= 8 ? Math.cos(i * 0.3 + 0.09) : 0;
      const turningIntensity = Math.sin(i * Math.PI * (1 / bones.length)) * turningTime;

      let bookRotY =
        INSIDE_CURVE_STRENGTH * insideCurveIntensity * bookTargetRotation -
        OUTSIDE_CURVE_STRENGTH * outsideCurveIntensity * bookTargetRotation +
        TURNING_CURVE_STRENGTH * turningIntensity * bookTargetRotation;

      let foldRotationAngle = THREE.MathUtils.degToRad(Math.sin(bookTargetRotation) * 2);

      if (bookClosed) {
        if (i === 0) {
          bookRotY = bookTargetRotation;
          foldRotationAngle = 0;
        } else {
          bookRotY = 0;
          foldRotationAngle = 0;
        }
      }

      const foldIntensity =
        i > 8
          ? Math.sin(i * Math.PI * (1 / bones.length) - 0.5) * turningTime
          : 0;
      const bookRotX = foldRotationAngle * foldIntensity;

      // Blend toward 0 by hover progress — flatten the page.
      const blendedY = THREE.MathUtils.lerp(bookRotY, 0, h);
      const blendedX = THREE.MathUtils.lerp(bookRotX, 0, h);

      target.rotation.y = THREE.MathUtils.damp(
        target.rotation.y, blendedY, EASING_FACTOR * 10, delta
      );
      target.rotation.x = THREE.MathUtils.damp(
        target.rotation.x, blendedX, EASING_FACTOR_FOLD * 10, delta
      );
    }

    // ── Group transform: book stacks at x=0, hover spreads into slots ──
    const targetX = THREE.MathUtils.lerp(0, carouselGroupX, h);
    const targetScale = THREE.MathUtils.lerp(1, carouselScale, h);
    groupRef.current.position.x = THREE.MathUtils.damp(
      groupRef.current.position.x, targetX, 6, delta
    );
    const s = THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 6, delta);
    groupRef.current.scale.setScalar(Math.max(s, 0.0001));

    // ── Y arc: lift the flipping sheet UP so it passes over the remaining
    //           stack instead of sweeping through it at the 90° midpoint.
    //           Magazine root rotates around y, so y stays "up" through the
    //           swing — this lift is effective for the entire flip arc.
    const yArc = turningTime * FLIP_Y_ARC * (1 - h);
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y, yArc, 8, delta
    );

    // ── Mesh z: stack offset + flat-state lift to clear z-fight with neighbours ──
    const baseZ = -number * PAGE_DEPTH + page * PAGE_DEPTH;
    const lift = turningTime * FLIP_Z_LIFT * (1 - h);
    skinnedRef.current.position.z = THREE.MathUtils.damp(
      skinnedRef.current.position.z, baseZ + lift, 8, delta
    );
    // Belt-and-suspenders: raise render order while actively flipping so the
    // page draws on top of any z-fighting that slip through despite the lift.
    skinnedRef.current.renderOrder = turningTime > 0.02 ? 10 : 0;
  });

  // Mesh z is driven imperatively (below in useFrame) so we can add a
  // turn-time forward lift to the flipping sheet. Don't set position-z via
  // JSX or it'll fight the per-frame update.
  return (
    <group ref={groupRef}>
      <primitive object={manualSkinnedMesh} ref={skinnedRef} />
    </group>
  );
}

/* ── Magazine: assembles sheets, drives the auto-advance + hover ── */

function Magazine({ pages, hovered }: { pages: string[]; hovered: boolean }) {
  // 20 image pages -> 10 sheets, each with front/back faces.
  const sheets = useMemo(() => {
    const out: { front: string; back: string }[] = [];
    for (let i = 0; i < pages.length; i += 2) {
      out.push({ front: pages[i], back: pages[i + 1] ?? pages[i] });
    }
    return out;
  }, [pages]);

  const allTexPaths = useMemo(
    () => sheets.flatMap((s) => [s.front, s.back]).map(encodeURI),
    [sheets]
  );
  const textures = useLoader(THREE.TextureLoader, allTexPaths) as THREE.Texture[];

  useEffect(() => {
    textures.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      // Mipmaps + trilinear are essential when the textured page is scaled down
      // in the carousel. Without them the GPU point-samples a single hi-res
      // mip, producing aliased text that shimmers as it drifts.
      t.minFilter = THREE.LinearMipmapLinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.generateMipmaps = true;
      t.anisotropy = 16;
      t.needsUpdate = true;
    });
  }, [textures]);

  const [page, setPage] = useState(0);
  const [delayedPage, setDelayedPage] = useState(0);
  const directionRef = useRef(1);

  useEffect(() => {
    if (sheets.length === 0) return;
    const id = setInterval(() => {
      setPage((p) => {
        let next = p + directionRef.current;
        if (next >= sheets.length) { next = sheets.length; directionRef.current = -1; }
        else if (next <= 0) { next = 0; directionRef.current = 1; }
        return next;
      });
    }, AUTO_FLIP_MS);
    return () => clearInterval(id);
  }, [sheets.length]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const tick = () => {
      setDelayedPage((d) => {
        if (page === d) return d;
        timeout = setTimeout(tick, Math.abs(page - d) > 2 ? 50 : 150);
        return d + (page > d ? 1 : -1);
      });
    };
    tick();
    return () => { if (timeout) clearTimeout(timeout); };
  }, [page]);

  // ── State refs (driven each frame, shared with each Sheet) ──
  // hoverProgressRef: 1 = carousel (resting / default), 0 = book (on hover).
  const groupRef = useRef<THREE.Group>(null);
  const hoverProgressRef = useRef(1);   // start at carousel so first paint is correct
  const hoverOffsetRef = useRef(0);
  const camera = useThree((s) => s.camera);

  useFrame((_, delta) => {
    // Default is carousel (1), hover collapses into book (0).
    const target = hovered ? 0 : 1;
    hoverProgressRef.current += (target - hoverProgressRef.current) * HOVER_STATE_LERP;

    // Always advance the carousel offset so the resting state stays in motion.
    hoverOffsetRef.current = (hoverOffsetRef.current + delta * CAROUSEL_SPEED) % Math.max(sheets.length, 1);

    const h = hoverProgressRef.current;

    if (groupRef.current) {
      const targetRotY = THREE.MathUtils.lerp(BOOK_ROT_Y, 0, h);
      const targetRotX = THREE.MathUtils.lerp(BOOK_ROT_X, 0, h);
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y, targetRotY, 6, delta
      );
      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x, targetRotX, 6, delta
      );
      // Shift carousel down so it sits in the vertical centre of the frame.
      const targetGroupY = THREE.MathUtils.lerp(0, -0.18, h);
      groupRef.current.position.y = THREE.MathUtils.damp(
        groupRef.current.position.y, targetGroupY, 4, delta
      );
    }

    // Lerp camera between book (h=0) and carousel (h=1) framings.
    const targetCamZ = THREE.MathUtils.lerp(CAM_Z_BOOK, CAM_Z_CAROUSEL, h);
    const targetCamY = THREE.MathUtils.lerp(CAM_Y_BOOK, CAM_Y_CAROUSEL, h);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamZ, 4, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamY, 4, delta);
  });

  return (
    // Initial transform matches the resting carousel state (h=1) so first paint
    // doesn't flash through a book→carousel transition.
    <group ref={groupRef} position={[0, -0.18, 0]} rotation={[0, 0, 0]}>
      {sheets.map((s, i) => (
        <Sheet
          key={i}
          number={i}
          totalSheets={sheets.length}
          frontTex={textures[i * 2]}
          backTex={textures[i * 2 + 1]}
          page={delayedPage}
          opened={delayedPage > i}
          bookClosed={delayedPage === 0 || delayedPage === sheets.length}
          hoverProgressRef={hoverProgressRef}
          hoverOffsetRef={hoverOffsetRef}
        />
      ))}
    </group>
  );
}

/* ── Outer component ───────────────────────────────────────── */

type Props = {
  pages: string[];
  aspectRatio?: string;
  fill?: boolean;
  className?: string;
  hoverable?: boolean;
};

function MagazineCarouselInner({
  pages,
  aspectRatio = "3/2",
  fill = false,
  className,
  hoverable = true,
}: Props) {
  const [ready, setReady] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 700);
    return () => clearTimeout(t);
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
      {/* Edge fade — masks pages entering/exiting on both sides in hover mode */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none",
        background:
          "linear-gradient(to right, var(--color-bg, #FAFAF8) 0%, transparent 6%, transparent 94%, var(--color-bg, #FAFAF8) 100%)",
      }} />
      {!ready && <Loader size={28} />}

      <Canvas
        shadows={false}
        camera={{ position: [0, CAM_Y_CAROUSEL, CAM_Z_CAROUSEL], fov: 42, near: 0.1, far: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ position: "absolute", inset: 0 }}
      >
        <ambientLight intensity={1.25} />
        <hemisphereLight args={["#ffffff", "#e8e6df", 0.55]} />
        <directionalLight position={[3, 5, 4]} intensity={2.0} />
        <directionalLight position={[-3, 2, -2]} intensity={0.75} />
        <directionalLight position={[0, 4, -3]} intensity={0.55} />
        <Suspense fallback={null}>
          <Magazine pages={pages} hovered={hovered} />
        </Suspense>
      </Canvas>
    </div>
  );
}

const MagazineCarousel = dynamic(() => Promise.resolve(MagazineCarouselInner), {
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

export default MagazineCarousel;
