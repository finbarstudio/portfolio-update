"use client";

/**
 * MagazineCarousel — bone-skinned 3D magazine that auto-flips through its
 * pages. Adapted from github.com/shreejai/book-slider-3d, stripped of
 * navigation UI, audio, background plane and shadow material; left only the
 * page-fold animation with a slow auto-advance bounce loop.
 *
 * Hover state: book rotates to face the camera, sheets flatten (all bones
 * unwind to zero) and spread into a horizontal right-to-left carousel.
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

const EASING_FACTOR = 0.22;           // ↓ slower damp so the flip is less aggressive
const EASING_FACTOR_FOLD = 0.16;
const INSIDE_CURVE_STRENGTH = 0.18;
const OUTSIDE_CURVE_STRENGTH = 0.05;
const TURNING_CURVE_STRENGTH = 0.09;

const AUTO_FLIP_MS = 2800;            // ↑ longer pause between turns
const TURN_DURATION_MS = 1100;        // ↑ curl visible for longer

// Lift the actively-flipping sheet forward in z during its turn so the
// curled body doesn't clip into the stacks on either side of the spine.
const FLIP_Z_LIFT = 0.08;

// Camera zoom: closer in book mode, pulled back in hover so the carousel
// row has room to breathe.
const CAM_Z_BOOK = 2.2;
const CAM_Z_HOVER = 4.1;
const CAM_Y_BOOK = 0.25;
const CAM_Y_HOVER = 0.05;

// Book root rotation so the cover faces the camera. The template counters
// this with <Float rotation-y={Math.PI}>; without it we point the book at us
// directly (= -π/2 here).
const BOOK_ROT_Y = -Math.PI / 2;
const BOOK_ROT_X = -Math.PI / 18;     // slight pitch — gentle isometric feel

const HOVER_STATE_LERP = 0.06;        // ease for state transitions
const HOVER_SPEED = 0.42;             // cycles/sec for the horizontal carousel
const HOVER_SPACING = 1.55;           // x distance between adjacent sheets
const HOVER_VISIBLE_HALF = 2.5;       // ±N slots fully visible from centre

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
        roughness: 0.55,
      }),
      new THREE.MeshStandardMaterial({
        color: whiteColor,
        map: backTex,
        roughness: 0.55,
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
      bookTargetRotation += THREE.MathUtils.degToRad(number * 0.8);
    }

    const h = hoverProgressRef.current;

    // ── Carousel slot for this sheet ──────────────────────────
    const N = totalSheets;
    let slot = ((number - hoverOffsetRef.current) % N + N) % N;
    if (slot > N / 2) slot -= N;                         // wrap to [-N/2, N/2)
    const absS = Math.abs(slot);
    let carouselScale = 0;
    if (absS <= HOVER_VISIBLE_HALF + 1) {
      const k = THREE.MathUtils.clamp(1 - absS / (HOVER_VISIBLE_HALF + 1), 0, 1);
      carouselScale = 0.55 + k * 0.45;                   // [0.55..1]
    }
    // Page geometry pivots at its left edge, so subtract half-width to put the
    // visible centre of each sheet at the slot x.
    const carouselGroupX = -slot * HOVER_SPACING - PAGE_WIDTH / 2;

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

    // ── Mesh z: stack offset + a mid-turn forward lift to avoid clipping ──
    const baseZ = -number * PAGE_DEPTH + page * PAGE_DEPTH;
    const lift = turningTime * FLIP_Z_LIFT * (1 - h);
    skinnedRef.current.position.z = THREE.MathUtils.damp(
      skinnedRef.current.position.z, baseZ + lift, 8, delta
    );
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
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.generateMipmaps = false;
      t.anisotropy = 4;
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

  // ── Hover state refs (driven each frame, shared with each Sheet) ──
  const groupRef = useRef<THREE.Group>(null);
  const hoverProgressRef = useRef(0);
  const hoverOffsetRef = useRef(0);
  const camera = useThree((s) => s.camera);

  useFrame((_, delta) => {
    const target = hovered ? 1 : 0;
    hoverProgressRef.current += (target - hoverProgressRef.current) * HOVER_STATE_LERP;

    // Always advance the carousel offset so an entered hover state is mid-flow.
    hoverOffsetRef.current = (hoverOffsetRef.current + delta * HOVER_SPEED) % Math.max(sheets.length, 1);

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
    }

    // Lerp camera so book mode is zoomed in and hover mode pulls back for the carousel.
    const targetCamZ = THREE.MathUtils.lerp(CAM_Z_BOOK, CAM_Z_HOVER, h);
    const targetCamY = THREE.MathUtils.lerp(CAM_Y_BOOK, CAM_Y_HOVER, h);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamZ, 4, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamY, 4, delta);
  });

  return (
    <group ref={groupRef} rotation={[BOOK_ROT_X, BOOK_ROT_Y, 0]}>
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
        camera={{ position: [0, CAM_Y_BOOK, CAM_Z_BOOK], fov: 42, near: 0.1, far: 50 }}
        dpr={[1, 1.75]}
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
