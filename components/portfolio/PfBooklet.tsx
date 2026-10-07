"use client";

/**
 * A printed booklet on /portfolio that can be picked up and read: a 3D
 * magazine whose pages turn (click either side, drag a page, or use the
 * arrows), with a switch to lay it flat and square-on for reading.
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

type View = "magazine" | "flat";

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
  view: View;
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
    const bob = pose.sway * Math.sin(state.clock.elapsedTime * 0.7) * 0.02;
    // the pointer can sit outside the canvas: keep it in range
    const px = THREE.MathUtils.clamp(state.pointer.x, -1, 1);
    const py = THREE.MathUtils.clamp(state.pointer.y, -1, 1);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, pose.rx - py * 0.06 * pose.sway + bob, 5, d);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, px * 0.16 * pose.sway, 5, d);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, pose.rz, 5, d);
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, fit, 6, d));
  });

  return (
    <group ref={rig} scale={fit} rotation={[POSE.magazine.rx, 0, POSE.magazine.rz]}>
      <Book pages={pages} pRef={pRef} curl={pose.curl} onReady={onReady} />
    </group>
  );
}

export default function PfBooklet({ pages }: { pages: string[] }) {
  const sheets = Math.ceil(pages.length / 2);
  const urls = useMemo(() => pages.map((p) => corsMedia(p)), [pages]);

  const [view, setView] = useState<View>("magazine");
  const [sheet, setSheet] = useState(0);
  const [near, setNear] = useState(false); // close enough to start loading
  const [seen, setSeen] = useState(false); // on screen: keep drawing
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const pRef = useRef(0);
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

  const go = (to: number) => {
    const next = Math.min(sheets, Math.max(0, to));
    pRef.current = next;
    setSheet(next);
  };

  // play: turn a page every couple of seconds, and stop at the back cover
  useEffect(() => {
    if (!playing || !seen) return;
    const id = setInterval(() => {
      const next = Math.round(pRef.current) + 1;
      go(next);
      if (next >= sheets) setPlaying(false);
    }, 2400);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, seen, sheets]);

  const play = () => {
    if (!playing && sheet >= sheets) go(0); // at the end: start again
    setPlaying(!playing);
  };

  const onDown = (e: React.PointerEvent) => {
    setPlaying(false); // taking hold of a page takes over from play
    drag.current = { x: e.clientX, from: Math.round(pRef.current) };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
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
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
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
            frameloop={seen ? "always" : "never"}
            camera={{ fov: 30, position: [0, 0, 6], near: 0.5, far: 40 }}
          >
            <ambientLight intensity={2.1} />
            <directionalLight position={[-2.5, 3, 6]} intensity={1.5} />
            <Stage pages={urls} view={view} pRef={pRef} onReady={() => setReady(true)} />
          </Canvas>
        ) : null}
        {ready ? null : <p className="pf-booklet-wait pf-mono pf-soft">Loading booklet</p>}
      </div>

      <div className="pf-booklet-ui pf-mono">
        <div className="pf-booklet-set">
          <button type="button" aria-pressed={view === "magazine"} onClick={() => setView("magazine")}>
            Magazine
          </button>
          <button type="button" aria-pressed={view === "flat"} onClick={() => setView("flat")}>
            Flat lay
          </button>
        </div>
        <div className="pf-booklet-set">
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
