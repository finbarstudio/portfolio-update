"use client";

/**
 * A printed booklet on /portfolio that can be picked up and read: a 3D
 * magazine whose pages turn (click either side, drag a page, or use the
 * arrows), with a switch to lay it flat and square-on for reading, and a
 * third view that sets every spread out at once on a wall leaning in space
 * (components/booklet/SpreadWall.tsx): click one to bring it up close.
 *
 * The page turning itself is components/booklet/Book.tsx. This file is the
 * stage around it: the two poses, the controls, and not running WebGL until
 * the page is near the screen (and pausing it again once it has gone past).
 */

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { corsMedia } from "@/lib/media";
import Book, { PAGE_H, PAGE_W } from "@/components/booklet/Book";
import SpreadWall from "@/components/booklet/SpreadWall";

type View = "magazine" | "flat" | "spreads";

const POSE = {
  // share of the box the open book may take, its lean, and how much it follows the pointer
  magazine: { w: 0.7, h: 0.74, rx: -0.58, rz: 0.08, sway: 1, curl: 1 },
  flat: { w: 0.96, h: 0.96, rx: 0, rz: 0, sway: 0, curl: 0.7 },
};

function Stage({
  pages,
  view,
  pRef,
  onReady,
}: {
  pages: string[];
  view: Exclude<View, "spreads">;
  pRef: React.MutableRefObject<number>;
  onReady: () => void;
}) {
  const { viewport } = useThree();
  const rig = useRef<THREE.Group>(null);

  const pose = POSE[view];
  const fit = Math.min((viewport.width * pose.w) / (PAGE_W * 2), (viewport.height * pose.h) / PAGE_H);

  useFrame((state, dt) => {
    const g = rig.current;
    if (!g) return;
    const d = Math.min(dt, 0.05);
    // the pointer can sit outside the canvas: keep it in range
    const px = THREE.MathUtils.clamp(state.pointer.x, -1, 1);
    const py = THREE.MathUtils.clamp(state.pointer.y, -1, 1);
    const to = [pose.rx - py * 0.06 * pose.sway, px * 0.16 * pose.sway, pose.rz, fit];
    const now = [g.rotation.x, g.rotation.y, g.rotation.z, g.scale.x];
    // Frames are drawn on demand, so a booklet at rest costs nothing: keep
    // asking for the next frame only until the pose has settled.
    if (to.every((v, k) => Math.abs(v - now[k]) < 0.0004)) return;
    g.rotation.set(
      THREE.MathUtils.damp(now[0], to[0], 5, d),
      THREE.MathUtils.damp(now[1], to[1], 5, d),
      THREE.MathUtils.damp(now[2], to[2], 5, d),
    );
    g.scale.setScalar(THREE.MathUtils.damp(now[3], to[3], 6, d));
    state.invalidate();
  });

  return (
    <group ref={rig} scale={fit} rotation={[POSE.magazine.rx, 0, POSE.magazine.rz]}>
      <Book pages={pages} pRef={pRef} curl={pose.curl} onReady={onReady} />
    </group>
  );
}

export default function PfBooklet({ pages, thumbs }: { pages: string[]; /** a small copy of every page, for the spreads view */ thumbs: string[] }) {
  const sheets = Math.ceil(pages.length / 2);
  const urls = useMemo(() => pages.map((p) => corsMedia(p)), [pages]);

  const [view, setView] = useState<View>("magazine");
  // the book keeps the pose it last had while the spreads are up
  const [pose, setPose] = useState<Exclude<View, "spreads">>("magazine");
  const show = (v: View) => {
    setView(v);
    if (v !== "spreads") setPose(v);
    else setPlaying(false);
  };
  const smalls = useMemo(() => thumbs.map((p) => corsMedia(p)), [thumbs]);
  const [close, setClose] = useState<number[] | null>(null); // the pages up close on the wall
  const [sheet, setSheet] = useState(0);
  const [near, setNear] = useState(false); // close enough to start loading
  const [seen, setSeen] = useState(false); // on screen: keep drawing
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const pRef = useRef(0);
  const wake = useRef<() => void>(() => {}); // asks the canvas for a frame
  const drag = useRef<{ x: number; from: number } | null>(null);

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

  // a change of view, or coming back on screen, needs a frame to start from
  useEffect(() => wake.current(), [view, seen]);

  const go = (to: number) => {
    const next = Math.min(sheets, Math.max(0, to));
    pRef.current = next;
    wake.current();
    setSheet(next);
  };

  // play: turn a page every couple of seconds, and stop at the back cover
  useEffect(() => {
    if (!playing || !seen || view === "spreads") return;
    const id = setInterval(() => {
      const next = Math.round(pRef.current) + 1;
      go(next);
      if (next >= sheets) setPlaying(false);
    }, 2400);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, seen, sheets, view]);

  const play = () => {
    if (!playing && sheet >= sheets) go(0); // at the end: start again
    setPlaying(!playing);
  };

  const onDown = (e: React.PointerEvent) => {
    if (view === "spreads") return; // the wall takes its own clicks
    setPlaying(false); // taking hold of a page takes over from play
    drag.current = { x: e.clientX, from: Math.round(pRef.current) };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    wake.current(); // the booklet leans towards the pointer
    const d = drag.current;
    if (!d) return;
    const span = (box.current?.clientWidth ?? 1000) * 0.4;
    const off = Math.min(1, Math.max(-1, (d.x - e.clientX) / span));
    pRef.current = Math.min(sheets, Math.max(0, d.from + off));
  };
  const onUp = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) < 6) {
      // a click: the side you click is the way you turn
      const rect = e.currentTarget.getBoundingClientRect();
      go(d.from + (e.clientX > rect.left + rect.width / 2 ? 1 : -1));
    } else {
      go(Math.abs(pRef.current - d.from) > 0.22 ? d.from + (dx < 0 ? 1 : -1) : d.from);
    }
  };
  // the browser took the gesture for a scroll: put the page back
  const onCancel = () => {
    if (drag.current) go(drag.current.from);
    drag.current = null;
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (view === "spreads" || (e.key !== "ArrowRight" && e.key !== "ArrowLeft")) return;
    setPlaying(false);
    go(sheet + (e.key === "ArrowRight" ? 1 : -1));
  };

  const where =
    sheet <= 0 ? "Cover" : sheet >= sheets ? `Page ${pages.length}` : `Pages ${sheet * 2} to ${sheet * 2 + 1}`;

  return (
    <>
      <div
        ref={box}
        className="pf-booklet"
        data-view={view}
        role="group"
        aria-label="Booklet. Use the left and right arrow keys to turn the pages."
        tabIndex={0}
        onKeyDown={onKey}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onCancel}
      >
        {near ? (
          <Canvas
            flat
            dpr={[1, 2]}
            frameloop={seen ? "demand" : "never"}
            onCreated={(state) => (wake.current = state.invalidate)}
            camera={{ fov: 30, position: [0, 0, 6], near: 0.5, far: 40 }}
          >
            <ambientLight intensity={2.1} />
            <directionalLight position={[-2.5, 3, 6]} intensity={1.5} />
            {/* the book stays loaded behind the wall, just not drawn */}
            <group visible={view !== "spreads"}>
              <Stage pages={urls} view={pose} pRef={pRef} onReady={() => setReady(true)} />
            </group>
            {view === "spreads" ? <SpreadWall thumbs={smalls} fulls={urls} onWhere={setClose} /> : null}
          </Canvas>
        ) : null}
        {ready || view === "spreads" ? null : <p className="pf-booklet-wait pf-mono pf-soft">Loading booklet</p>}
      </div>

      <div className="pf-booklet-ui pf-mono">
        <div className="pf-booklet-set">
          <button type="button" aria-pressed={view === "magazine"} onClick={() => show("magazine")}>
            Magazine
          </button>
          <button type="button" aria-pressed={view === "flat"} onClick={() => show("flat")}>
            Flat lay
          </button>
          <button type="button" aria-pressed={view === "spreads"} onClick={() => show("spreads")}>
            Spreads
          </button>
        </div>
        {view === "spreads" ? (
          <span className="pf-booklet-where pf-soft" aria-live="polite">
            {close ? (close.length === 1 ? `Page ${close[0]}` : `Pages ${close[0]} to ${close[1]}`) : "Click a spread"}
          </span>
        ) : null}
        <div className="pf-booklet-set" hidden={view === "spreads"}>
          <button type="button" aria-pressed={playing} onClick={play}>
            {playing ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              go(sheet - 1);
            }}
            disabled={sheet <= 0}
            aria-label="Previous pages"
          >
            ←
          </button>
          <span className="pf-booklet-where" aria-live="polite">{where}</span>
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              go(sheet + 1);
            }}
            disabled={sheet >= sheets}
            aria-label="Next pages"
          >
            →
          </button>
        </div>
      </div>
    </>
  );
}
