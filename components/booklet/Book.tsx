"use client";

/**
 * Book — a stack of bendable sheets that turn about the spine.
 *
 * `pRef` is the reading position in SHEETS: 0 = closed on the front cover,
 * 1 = first sheet turned, `sheets` = closed on the back. Fractions are a
 * turn in flight, so a drag or a scroll position can drive it directly.
 * Each sheet is one bent strip shared by two meshes (recto on the front
 * face, verso on the back), so the two sides can never drift apart.
 *
 * PAGE IMAGES. A long book cannot hold every page on the graphics card, and
 * a page arriving must never be felt as a hitch in a turn. So:
 *   - pages load as the reader gets near them and are let go once far behind;
 *   - only the open spread is held at full size; the pages waiting behind it
 *     are held small, and the small copy is kept while the full one comes and
 *     goes, so nothing is ever decoded twice;
 *   - files are decoded off the main thread (createImageBitmap), handed to
 *     the card exactly as it wants them, and uploaded ONE PER FRAME from a
 *     queue (`pump`), so a landing never stacks several uploads in one frame;
 *   - the load and sharpen work waits until a turn has landed.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

export const PAGE_W = 1;
export const PAGE_H = Math.SQRT2; // A4 pages

const SEG = 24; // columns per sheet: enough for a smooth curl
const THICK = 0.0022; // gap between stacked sheets (also stops z-fighting)
const LAG = 0.4; // how far the spine side trails the outer edge in a turn
const AHEAD = 3; // sheets either side of the open spread whose pages stay loaded
const GUTTER = 0.2; // resting rise out of the spine, radians
const SOFT = 720; // px wide for a page that is near but not the one being read

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => {
  const c = clamp01(x);
  return c * c * (3 - 2 * c);
};

/* ── the page image store ──────────────────────────────────────────── */

interface Entry {
  tex: THREE.Texture | null; // set once decoded; shown once uploaded
  shown: boolean;
  users: number;
  stop: AbortController;
  watchers: Set<() => void>;
}

const store = new Map<string, Entry>();
/** textures decoded and waiting for their turn on the graphics card; urgent ones first */
const queue: { key: string; urgent: boolean }[] = [];
let pumped = -1;
/** the canvases drawing pages: a decoded page asks them for a frame, so it gets uploaded */
const canvases = new Set<() => void>();

function acquire(url: string, width: number, urgent: boolean, watch: () => void): () => void {
  const key = `${width}|${url}`;
  let e = store.get(key);
  if (!e) {
    const stop = new AbortController();
    e = { tex: null, shown: false, users: 0, stop, watchers: new Set() };
    store.set(key, e);
    const entry = e;
    (async () => {
      try {
        const blob = await (await fetch(url, { mode: "cors", signal: stop.signal })).blob();
        // handed over exactly as the graphics card wants it (alpha not
        // premultiplied, colours untouched), or the upload converts every
        // pixel first and stalls the page for the length of a turn
        const raw: ImageBitmapOptions = { premultiplyAlpha: "none", colorSpaceConversion: "none" };
        const opts: ImageBitmapOptions = width ? { ...raw, resizeWidth: width, resizeQuality: "high" } : raw;
        // a browser that cannot resize here just gets the file as it is
        const bitmap = await createImageBitmap(blob, opts).catch(() => createImageBitmap(blob));
        if (stop.signal.aborted) return bitmap.close();
        const t = new THREE.Texture(bitmap);
        t.flipY = false; // bitmaps cannot be flipped on upload: the page's UVs are flipped instead
        t.premultiplyAlpha = false;
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 4;
        // the small standby copy is shown near its own size: no mipmaps to build
        t.generateMipmaps = !width;
        if (width) t.minFilter = THREE.LinearFilter;
        t.needsUpdate = true; // or the card is handed an empty texture
        entry.tex = t;
        queue.push({ key, urgent });
        for (const wake of canvases) wake();
      } catch {
        /* aborted, or the file failed: the page stays as paper */
      }
    })();
  }
  e.users++;
  e.watchers.add(watch);
  return () => {
    const en = store.get(key);
    if (!en) return;
    en.watchers.delete(watch);
    if (--en.users > 0) return;
    en.stop.abort();
    (en.tex?.image as ImageBitmap | undefined)?.close?.();
    en.tex?.dispose();
    store.delete(key);
  };
}

/**
 * Uploads at most one waiting page per frame. Called from every useFrame
 * that draws pages, but only the first call in a frame does anything.
 */
function pump(gl: THREE.WebGLRenderer) {
  const frame = gl.info.render.frame;
  if (frame === pumped || queue.length === 0) return;
  pumped = frame;
  const i = Math.max(0, queue.findIndex((q) => q.urgent));
  const [{ key }] = queue.splice(i, 1);
  const e = store.get(key);
  if (!e?.tex) return;
  gl.initTexture(e.tex);
  e.shown = true;
  for (const w of e.watchers) w();
}

/**
 * The best image on hand for a page: full size when `sharp` and it is in,
 * otherwise the small standby copy, otherwise nothing (plain paper).
 * `soft` false skips the small copy (for files that are already small).
 */
export function usePage(url: string | undefined, wanted: boolean, sharp: boolean, soft = true): THREE.Texture | null {
  const [, bump] = useState(0);
  // the store's one way to say "something changed": re-render this page
  const [watch] = useState(() => () => bump((n) => n + 1));
  useEffect(() => (url && wanted && soft ? acquire(url, SOFT, false, watch) : undefined), [url, wanted, soft, watch]);
  useEffect(() => (url && wanted && sharp ? acquire(url, 0, true, watch) : undefined), [url, wanted, sharp, watch]);
  if (!url || !wanted) return null;
  const full = store.get(`0|${url}`);
  if (sharp && full?.shown) return full.tex;
  const small = store.get(`${SOFT}|${url}`);
  return small?.shown ? small.tex : null;
}

/** Keeps the upload queue moving and the picture current while pages arrive. */
export function PageUploads() {
  const gl = useThree((s) => s.gl);
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    canvases.add(invalidate);
    return () => {
      canvases.delete(invalidate);
    };
  }, [invalidate]);
  useFrame((state) => {
    pump(gl);
    if (queue.length) state.invalidate();
  });
  return null;
}

/* ── the sheets ────────────────────────────────────────────────────── */

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

const PAPER = "#f4f1ea"; // a page whose image has not arrived yet

function Sheet({
  index,
  frontUrl,
  backUrl,
  wanted,
  sharp,
  pRef,
  curl,
  onFront,
}: {
  index: number;
  frontUrl: string;
  backUrl: string | undefined;
  wanted: boolean;
  sharp: boolean;
  pRef: React.MutableRefObject<number>;
  curl: number;
  /** called once this sheet's front image is showing */
  onFront?: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const last = useRef(-1);
  const front = usePage(frontUrl, wanted, sharp);
  const back = usePage(backUrl, wanted, sharp);

  useEffect(() => {
    if (front) onFront?.();
  }, [front, onFront]);

  const { frontGeo, backGeo } = useMemo(() => {
    const f = new THREE.PlaneGeometry(PAGE_W, PAGE_H, SEG, 1);
    const b = new THREE.BufferGeometry();
    b.setIndex(f.getIndex());
    b.setAttribute("position", f.getAttribute("position"));
    b.setAttribute("normal", f.getAttribute("normal"));
    // page images are not flipped on upload (see the store), so v runs top down
    const fuv = f.getAttribute("uv") as THREE.BufferAttribute;
    for (let i = 0; i < fuv.count; i++) fuv.setY(i, 1 - fuv.getY(i));
    // the verso reads from the outer edge inwards, so its u runs backwards
    const uv = fuv.clone();
    for (let i = 0; i < uv.count; i++) uv.setX(i, 1 - uv.getX(i));
    b.setAttribute("uv", uv);
    return { frontGeo: f, backGeo: b };
  }, []);

  useFrame(() => {
    const p = pRef.current;
    // Both stacks are kept level at the open spread: the page facing up on
    // each side sits at the same height, whatever the split of sheets under
    // them, so there is no step across the spine. A sheet sinks by one
    // thickness for every sheet lying on top of it, and the one in the air is
    // never below either stack.
    if (group.current) {
      group.current.position.z = -Math.max(0, index - p, p - 1 - index) * THICK;
      // only the few sheets at the open spread are drawn: the rest lie hidden
      // under them, and drawing all of a long book every frame is what costs
      group.current.visible = index > p - 3.5 && index < p + 2.5;
    }
    const t = clamp01(p - index);
    const key = t + curl * 10;
    if (key === last.current) return;
    last.current = key;
    bend(frontGeo.getAttribute("position") as THREE.BufferAttribute, t, curl);
    frontGeo.computeVertexNormals();
  });

  return (
    <group ref={group}>
      <mesh geometry={frontGeo} frustumCulled={false}>
        {/* keyed: a material must be rebuilt when it gains or loses its image */}
        <meshLambertMaterial key={front ? "image" : "paper"} map={front ?? undefined} color={front ? "#ffffff" : PAPER} />
      </mesh>
      <mesh geometry={backGeo} frustumCulled={false}>
        <meshLambertMaterial key={back ? "image" : "paper"} map={back ?? undefined} color={back ? "#ffffff" : PAPER} side={THREE.BackSide} />
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

  useFrame((state, dt) => {
    eased.current = THREE.MathUtils.damp(eased.current, pRef.current, 7, Math.min(dt, 0.05));
    if (Math.abs(eased.current - pRef.current) < 0.0005) eased.current = pRef.current;
    // frames are drawn on demand: ask for the next one only while a page is moving
    else state.invalidate();
    const p = eased.current;
    // Pages are loaded and sharpened around `at`. It follows the reader once a
    // turn has LANDED, so that work never lands in the middle of a turn (the
    // standby pages already cover the next few). Flicking a long way ahead
    // moves it at once, or the pages there would stay blank until the end.
    const to = Math.round(pRef.current);
    if (to !== at && (p === pRef.current || Math.abs(to - at) > AHEAD - 1)) setAt(to);
    // a closed book is one page wide: slide it so it sits centred either way
    if (shift.current) {
      shift.current.position.x = (PAGE_W / 2) * (smooth(p - (sheets - 1)) - (1 - smooth(p)));
    }
  });

  return (
    <group ref={shift}>
      <PageUploads />
      {Array.from({ length: sheets }, (_, i) => (
        <Sheet
          key={i}
          index={i}
          frontUrl={pages[i * 2]}
          backUrl={pages[i * 2 + 1]}
          wanted={i - at >= -AHEAD - 1 && i - at <= AHEAD}
          sharp={i === at || i === at - 1}
          pRef={eased}
          curl={curl}
          onFront={i === 0 ? onReady : undefined}
        />
      ))}
    </group>
  );
}
