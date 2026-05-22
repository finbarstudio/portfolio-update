"use client";

/**
 * MagazineCarousel — bone-skinned 3D magazine that auto-flips through its
 * pages. Adapted from github.com/shreejai/book-slider-3d, stripped of
 * navigation UI, audio, background plane and shadow material; left only the
 * page-fold animation with a slow auto-advance bounce loop.
 *
 * Each "page" is a thin BoxGeometry split into 30 vertical segments and
 * skinned to a bone chain. Bones twist along their length to give a natural
 * mid-flip curl, and the root bone rotates 180° to flip the page from right
 * to left of the spine.
 */

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import Loader from "./Loader";

/* ── Tunables ──────────────────────────────────────────────── */

const PAGE_WIDTH = 1.28;
const PAGE_HEIGHT = 1.71;
const PAGE_DEPTH = 0.003;
const PAGE_SEGMENTS = 30;
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS;

const EASING_FACTOR = 0.5;
const EASING_FACTOR_FOLD = 0.3;
const INSIDE_CURVE_STRENGTH = 0.18;
const OUTSIDE_CURVE_STRENGTH = 0.05;
const TURNING_CURVE_STRENGTH = 0.09;

const AUTO_FLIP_MS = 1700;     // ms between page turns
const TURN_DURATION_MS = 400;  // animation window for curl on each turn

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
const edgeColor = new THREE.Color("#f3f1ec"); // subtle warm paper edge

// 4 edge materials for the BoxGeometry side faces; front/back materials are
// built per-page so each carries its own texture.
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
};

function Sheet({ number, totalSheets, frontTex, backTex, page, opened, bookClosed }: SheetProps) {
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

  // Dispose per-page materials on unmount
  useEffect(() => {
    return () => {
      const mats = manualSkinnedMesh.material as THREE.Material[];
      // Only dispose the per-sheet front/back materials; edgeMaterials are
      // module-shared.
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

    let targetRotation = opened ? -Math.PI / 2 : Math.PI / 2;
    if (!bookClosed) {
      // Tiny per-sheet fan so stacked pages don't z-fight when fully open.
      targetRotation += THREE.MathUtils.degToRad(number * 0.8);
    }

    const bones = skinnedRef.current.skeleton.bones;
    for (let i = 0; i < bones.length; i++) {
      const target: THREE.Object3D = i === 0 ? groupRef.current : bones[i];

      const insideCurveIntensity = i < 8 ? Math.sin(i * 0.2 + 0.25) : 0;
      const outsideCurveIntensity = i >= 8 ? Math.cos(i * 0.3 + 0.09) : 0;
      const turningIntensity = Math.sin(i * Math.PI * (1 / bones.length)) * turningTime;

      let rotationAngle =
        INSIDE_CURVE_STRENGTH * insideCurveIntensity * targetRotation -
        OUTSIDE_CURVE_STRENGTH * outsideCurveIntensity * targetRotation +
        TURNING_CURVE_STRENGTH * turningIntensity * targetRotation;

      let foldRotationAngle = THREE.MathUtils.degToRad(Math.sin(targetRotation) * 2);

      if (bookClosed) {
        if (i === 0) {
          rotationAngle = targetRotation;
          foldRotationAngle = 0;
        } else {
          rotationAngle = 0;
          foldRotationAngle = 0;
        }
      }

      // Damped lerp toward target — equivalent to maath's easing.dampAngle for
      // these small bounded angles.
      const lambdaY = EASING_FACTOR * 10;
      target.rotation.y = THREE.MathUtils.damp(target.rotation.y, rotationAngle, lambdaY, delta);

      const foldIntensity =
        i > 8
          ? Math.sin(i * Math.PI * (1 / bones.length) - 0.5) * turningTime
          : 0;

      const lambdaX = EASING_FACTOR_FOLD * 10;
      target.rotation.x = THREE.MathUtils.damp(
        target.rotation.x,
        foldRotationAngle * foldIntensity,
        lambdaX,
        delta
      );
    }
  });

  return (
    <group ref={groupRef}>
      <primitive
        object={manualSkinnedMesh}
        ref={skinnedRef}
        position-z={-number * PAGE_DEPTH + page * PAGE_DEPTH}
      />
    </group>
  );
  // touch totalSheets so it's part of the closure for future use
  void totalSheets;
}

/* ── Magazine: assembles sheets, drives the auto-advance ───── */

function Magazine({ pages }: { pages: string[] }) {
  // Treat consecutive pairs as front/back of one sheet.
  // 20 image pages -> 10 sheets.
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

  // Auto-advance state. page goes 0..sheets.length inclusive (both ends =
  // fully closed). Bounce back and forth.
  const [page, setPage] = useState(0);
  const [delayedPage, setDelayedPage] = useState(0);
  const directionRef = useRef(1);

  useEffect(() => {
    if (sheets.length === 0) return;
    const id = setInterval(() => {
      setPage((p) => {
        let next = p + directionRef.current;
        if (next >= sheets.length) {
          next = sheets.length;
          directionRef.current = -1;
        } else if (next <= 0) {
          next = 0;
          directionRef.current = 1;
        }
        return next;
      });
    }, AUTO_FLIP_MS);
    return () => clearInterval(id);
  }, [sheets.length]);

  // Smooth catch-up so multi-page jumps animate one flip at a time (matches
  // the template). With auto-advance of 1 step per interval, this is mostly
  // a 1:1 follower, but keep the pattern for safety.
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

  return (
    <group rotation-y={Math.PI / 2}>
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
};

function MagazineCarouselInner({ pages, aspectRatio = "3/2", fill = false, className }: Props) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        ...(fill ? { height: "100%" } : { aspectRatio }),
        background: "var(--color-bg, #FAFAF8)",
        overflow: "hidden",
      }}
    >
      {!ready && <Loader size={28} />}

      <Canvas
        shadows={false}
        camera={{ position: [-0.5, 1, 4], fov: 45, near: 0.1, far: 50 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        style={{ position: "absolute", inset: 0 }}
      >
        <ambientLight intensity={0.85} />
        <directionalLight position={[2, 5, 2]} intensity={1.4} />
        <directionalLight position={[-3, 2, -2]} intensity={0.4} />
        <Suspense fallback={null}>
          <Magazine pages={pages} />
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
