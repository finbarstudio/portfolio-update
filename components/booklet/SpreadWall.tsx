"use client";

/**
 * SpreadWall — every spread of a booklet set out at once on a wall that leans
 * back in space and tilts a little towards the pointer. Click a spread and the
 * wall flies in and squares up until that spread fills the view; click again
 * (or off it, or press Escape) to go back. Left and right step through the
 * spreads while one is up close.
 *
 * The wall is drawn from small copies of the pages (`thumbs`), so sixty-odd
 * pages cost very little. The spread brought up close swaps to the full files.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { PAGE_H, PAGE_W, PageUploads, usePage } from "./Book";

const GAP_X = 0.3;
const GAP_Y = 0.32;
const CELL_W = PAGE_W * 2 + GAP_X;
const CELL_H = PAGE_H + GAP_Y;
const LEAN = { x: -0.3, y: 0.18 }; // the wall's resting tilt, radians

// page images are not flipped on upload (see usePage), so v runs top down
const pageGeo = new THREE.PlaneGeometry(PAGE_W, PAGE_H);
{
  const uv = pageGeo.getAttribute("uv") as THREE.BufferAttribute;
  for (let i = 0; i < uv.count; i++) uv.setY(i, 1 - uv.getY(i));
}

// the mark on a picked-out spread: a five-pointed star, in the brand pink
const starGeo = (() => {
  const s = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? 0.045 : 0.11;
    const a = Math.PI / 2 + (i * Math.PI) / 5;
    if (i) s.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    else s.moveTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  return new THREE.ShapeGeometry(s);
})();
const STAR = "#e96d89";

/** Reader's spreads: the cover alone, then pairs, then the back alone. */
export function toSpreads(count: number): number[][] {
  const out: number[][] = [[0]];
  for (let i = 1; i < count; i += 2) out.push(i + 1 < count ? [i, i + 1] : [i]);
  return out;
}

function Page({ thumb, full, close, x }: { thumb: string; full: string; close: boolean; x: number }) {
  const small = usePage(thumb, true, true, false);
  const large = usePage(full, close, true, false);
  const map = large ?? small;
  return (
    <mesh geometry={pageGeo} position={[x, 0, 0]}>
      {/* keyed: a material must be rebuilt when it gains its image */}
      {/* a blank leaf (no file) is paper; a page still loading is dark, like the ground */}
      <meshBasicMaterial key={map ? "image" : "paper"} map={map ?? undefined} color={map ? "#ffffff" : thumb ? "#2a2724" : "#f4f1ea"} toneMapped={false} />
    </mesh>
  );
}

function Spread({
  pages,
  thumbs,
  fulls,
  position,
  active,
  starred,
  onPick,
}: {
  pages: number[];
  thumbs: string[];
  fulls: string[];
  position: [number, number, number];
  active: boolean;
  /** one of the spreads picked out as a highlight */
  starred: boolean;
  onPick: () => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    document.body.style.cursor = hover ? (active ? "zoom-out" : "zoom-in") : "";
    invalidate();
    return () => {
      document.body.style.cursor = "";
    };
  }, [hover, active, invalidate]);

  useFrame((state, dt) => {
    const g = ref.current;
    if (!g) return;
    const lift = hover && !active ? 0.14 : 0;
    if (Math.abs(g.position.z - lift) < 0.0005) return;
    g.position.z = THREE.MathUtils.damp(g.position.z, lift, 10, Math.min(dt, 0.05));
    state.invalidate();
  });

  return (
    <group position={position}>
      <group
        ref={ref}
        onClick={(e) => {
          e.stopPropagation();
          onPick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
        }}
        onPointerOut={() => setHover(false)}
      >
        {pages.map((p, k) => (
          <Page key={p} thumb={thumbs[p]} full={fulls[p]} close={active} x={pages.length === 1 ? 0 : (k - 0.5) * PAGE_W} />
        ))}
        {/* sits in the gap above the spread's top left corner, clear of the page */}
        {starred ? (
          <mesh geometry={starGeo} position={[-(pages.length * PAGE_W) / 2 + 0.11, PAGE_H / 2 + 0.15, 0.01]}>
            <meshBasicMaterial color={STAR} toneMapped={false} />
          </mesh>
        ) : null}
      </group>
    </group>
  );
}

export default function SpreadWall({
  thumbs,
  fulls,
  stars = [],
  picked,
  onPick,
}: {
  /** a small copy of every page, in reading order */
  thumbs: string[];
  /** the full files, for the spread brought up close */
  fulls: string[];
  /** page numbers (from 1) to pick out: the spread each is on gets a star */
  stars?: number[];
  /** the spread up close, or null for the whole wall; the parent owns it so its Close button can clear it */
  picked: number | null;
  onPick: (spread: number | null) => void;
}) {
  const { viewport } = useThree();
  const wall = useRef<THREE.Group>(null);
  const placed = useRef(false);
  const setPicked = onPick;

  const spreads = useMemo(() => toSpreads(thumbs.length), [thumbs.length]);
  const cols = viewport.width / viewport.height > 1.1 ? 8 : 4;
  const rows = Math.ceil(spreads.length / cols);

  const cells = useMemo(
    () =>
      spreads.map((_, i): [number, number, number] => [
        ((i % cols) - (cols - 1) / 2) * CELL_W,
        ((rows - 1) / 2 - Math.floor(i / cols)) * CELL_H,
        0,
      ]),
    [spreads, cols, rows],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (picked === null) return;
      if (e.key === "Escape") setPicked(null);
      if (e.key === "ArrowRight") setPicked(Math.min(spreads.length - 1, picked + 1));
      if (e.key === "ArrowLeft") setPicked(Math.max(0, picked - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [picked, spreads.length, setPicked]);

  useFrame((state, dt) => {
    const g = wall.current;
    if (!g) return;
    const d = Math.min(dt, 0.05);
    const zoomed = picked !== null;
    // the whole wall fits the view; up close, one spread does
    const fitAll = Math.min((viewport.width * 0.92) / (cols * CELL_W), (viewport.height * 0.9) / (rows * CELL_H));
    const fitOne = Math.min((viewport.width * 0.96) / (PAGE_W * 2), (viewport.height * 0.96) / PAGE_H);
    const s = zoomed ? fitOne : fitAll;
    const [cx, cy] = zoomed ? cells[picked] : [0, 0];
    const px = THREE.MathUtils.clamp(state.pointer.x, -1, 1);
    const py = THREE.MathUtils.clamp(state.pointer.y, -1, 1);
    // the wall leans and follows the pointer; it squares up when a spread is close
    const to = [s, -cx * s, -cy * s, zoomed ? 0 : LEAN.x - py * 0.07, zoomed ? 0 : LEAN.y + px * 0.14];
    if (!placed.current) {
      // first frame: start at the overview, do not fly in from full size
      placed.current = true;
      g.scale.setScalar(to[0]);
      g.rotation.set(to[3], to[4], 0);
    }
    const now = [g.scale.x, g.position.x, g.position.y, g.rotation.x, g.rotation.y];
    // frames are drawn on demand: stop asking once the wall has settled
    if (to.every((v, k) => Math.abs(v - now[k]) < 0.0004)) return;
    g.scale.setScalar(THREE.MathUtils.damp(now[0], to[0], 6, d));
    g.position.x = THREE.MathUtils.damp(now[1], to[1], 6, d);
    g.position.y = THREE.MathUtils.damp(now[2], to[2], 6, d);
    g.rotation.x = THREE.MathUtils.damp(now[3], to[3], 5, d);
    g.rotation.y = THREE.MathUtils.damp(now[4], to[4], 5, d);
    state.invalidate();
  });

  return (
    <group ref={wall} onPointerMissed={() => setPicked(null)}>
      <PageUploads />
      {spreads.map((pages, i) => (
        <Spread
          key={i}
          pages={pages}
          thumbs={thumbs}
          fulls={fulls}
          position={cells[i]}
          active={picked === i}
          starred={pages.some((n) => stars.includes(n + 1))}
          onPick={() => setPicked(picked === i ? null : i)}
        />
      ))}
    </group>
  );
}
