"use client";

/**
 * Book — a stack of bendable sheets that turn about the spine.
 *
 * `pRef` is the reading position in SHEETS: 0 = closed on the front cover,
 * 1 = first sheet turned, `sheets` = closed on the back. Fractions are a
 * turn in flight, so a drag or a scroll position can drive it directly.
 * Each sheet is one bent strip shared by two meshes (recto on the front
 * face, verso on the back), so the two sides can never drift apart.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

export const PAGE_W = 1;
export const PAGE_H = Math.SQRT2; // A4 pages

const SEG = 28; // columns per sheet: enough for a smooth curl
const THICK = 0.003; // gap between stacked sheets (also stops z-fighting)
const LAG = 0.4; // how far the spine side trails the outer edge in a turn
const AHEAD = 3; // sheets either side of the open spread whose pages stay loaded
const GUTTER = 0.2; // resting rise out of the spine, radians

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => {
  const c = clamp01(x);
  return c * c * (3 - 2 * c);
};

/** Bends a sheet's strip for turn `t` (0 flat right, 1 flat left). */
function bend(pos: THREE.BufferAttribute, t: number, curl: number) {
  const ds = PAGE_W / SEG;
  const lag = LAG * curl;
  let x = 0;
  let z = 0;
  for (let j = 0; j <= SEG; j++) {
    if (j > 0) {
      const u = (j - 0.5) / SEG;
      // the outer edge leads, the spine follows: a peel, not a hinge
      const tu = clamp01(t * (1 + lag) - lag * (1 - u));
      const turn = Math.PI * smooth(tu);
      // The rise out of the spine follows the strip's OWN angle, not the
      // turn as a whole: a part still lying on a stack keeps exactly the
      // shape of the sheets under it, so it can never dip through them.
      const a = turn + GUTTER * Math.exp(-7 * u) * Math.cos(turn);
      x += ds * Math.cos(a);
      z += ds * Math.sin(a);
    }
    pos.setX(j, x);
    pos.setZ(j, z);
    pos.setX(j + SEG + 1, x);
    pos.setZ(j + SEG + 1, z);
  }
  pos.needsUpdate = true;
}

/**
 * One page's image, held only while `wanted`. A long book cannot keep every
 * page on the graphics card at once, so pages load as the reader gets near
 * them and are let go again once they are far behind.
 */
function usePage(url: string | undefined, wanted: boolean): THREE.Texture | null {
  const gl = useThree((s) => s.gl);
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    if (!url || !wanted) return;
    let live = true;
    let made: THREE.Texture | null = null;
    new THREE.TextureLoader().load(url, (t) => {
      if (!live) return t.dispose();
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = gl.capabilities.getMaxAnisotropy();
      made = t;
      setTex(t);
    });
    return () => {
      live = false;
      made?.dispose();
      setTex(null);
    };
  }, [url, wanted, gl]);
  return tex;
}

const PAPER = "#f4f1ea"; // a page whose image has not arrived yet

function Sheet({
  index,
  sheets,
  frontUrl,
  backUrl,
  wanted,
  pRef,
  curl,
  onFront,
}: {
  index: number;
  sheets: number;
  frontUrl: string;
  backUrl: string | undefined;
  wanted: boolean;
  pRef: React.MutableRefObject<number>;
  curl: number;
  /** called once this sheet's front image is showing */
  onFront?: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const last = useRef(-1);
  const front = usePage(frontUrl, wanted);
  const back = usePage(backUrl, wanted);

  useEffect(() => {
    if (front) onFront?.();
  }, [front, onFront]);

  const { frontGeo, backGeo } = useMemo(() => {
    const f = new THREE.PlaneGeometry(PAGE_W, PAGE_H, SEG, 1);
    const b = new THREE.BufferGeometry();
    b.setIndex(f.getIndex());
    b.setAttribute("position", f.getAttribute("position"));
    b.setAttribute("normal", f.getAttribute("normal"));
    // the verso reads from the outer edge inwards, so its u runs backwards
    const uv = (f.getAttribute("uv") as THREE.BufferAttribute).clone();
    for (let i = 0; i < uv.count; i++) uv.setX(i, 1 - uv.getX(i));
    b.setAttribute("uv", uv);
    return { frontGeo: f, backGeo: b };
  }, []);

  useFrame(() => {
    const t = clamp01(pRef.current - index);
    const key = t + curl * 10;
    if (key === last.current) return;
    last.current = key;
    bend(frontGeo.getAttribute("position") as THREE.BufferAttribute, t, curl);
    frontGeo.computeVertexNormals();
    // Top of the right-hand stack when unturned, top of the left when turned.
    // In flight it rides at whichever is HIGHER, so it clears both stacks:
    // it climbs before it leaves the right, or sinks only once it has landed.
    if (group.current) {
      const right = -index * THICK;
      const left = -(sheets - 1 - index) * THICK;
      const k = left > right ? smooth(t / 0.12) : smooth((t - 0.88) / 0.12);
      group.current.position.z = THREE.MathUtils.lerp(right, left, k);
    }
  });

  return (
    <group ref={group}>
      <mesh geometry={frontGeo} frustumCulled={false}>
        {/* keyed: a material must be rebuilt when it gains or loses its image */}
        <meshStandardMaterial
          key={front ? "image" : "paper"}
          map={front ?? undefined}
          color={front ? "#ffffff" : PAPER}
          roughness={0.75}
          metalness={0}
        />
      </mesh>
      <mesh geometry={backGeo} frustumCulled={false}>
        <meshStandardMaterial
          key={back ? "image" : "paper"}
          map={back ?? undefined}
          color={back ? "#ffffff" : PAPER}
          side={THREE.BackSide}
          roughness={0.75}
          metalness={0}
        />
      </mesh>
    </group>
  );
}

export default function Book({
  pages,
  pRef,
  curl = 1,
  onReady,
}: {
  /** every page's image address in reading order, front cover first */
  pages: string[];
  /** desired reading position, in sheets (see the note at the top) */
  pRef: React.MutableRefObject<number>;
  /** 0 = stiff card, 1 = soft magazine stock */
  curl?: number;
  /** called once the front cover is showing */
  onReady?: () => void;
}) {
  const sheets = Math.ceil(pages.length / 2);
  // the sheet the reader is at: pages within a few turns of it are kept loaded
  const [at, setAt] = useState(0);
  const shift = useRef<THREE.Group>(null);
  const eased = useRef(0);

  useFrame((_, dt) => {
    eased.current = THREE.MathUtils.damp(eased.current, pRef.current, 7, Math.min(dt, 0.05));
    if (Math.abs(eased.current - pRef.current) < 0.0005) eased.current = pRef.current;
    // a closed book is one page wide: slide it so it sits centred either way
    const p = eased.current;
    if (Math.round(p) !== at) setAt(Math.round(p));
    if (shift.current) {
      shift.current.position.x = (PAGE_W / 2) * (smooth(p - (sheets - 1)) - (1 - smooth(p)));
    }
  });

  return (
    <group ref={shift}>
      {Array.from({ length: sheets }, (_, i) => (
        <Sheet
          key={i}
          index={i}
          sheets={sheets}
          frontUrl={pages[i * 2]}
          backUrl={pages[i * 2 + 1]}
          wanted={i - at >= -AHEAD - 1 && i - at <= AHEAD}
          pRef={eased}
          curl={curl}
          onFront={i === 0 ? onReady : undefined}
        />
      ))}
    </group>
  );
}
