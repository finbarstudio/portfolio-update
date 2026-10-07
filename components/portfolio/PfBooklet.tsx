"use client";

/**
 * Printed booklets on the portfolio that can be picked up and read. One or
 * more books share the stage, listed down the left to switch between; the
 * first is open when the page loads.
 *
 * Three ways to look at a book: a 3D magazine whose pages turn (click either
 * side, drag a page, or use the arrows), the same book laid flat and
 * square-on for reading, and a wall of every spread leaning in space
 * (components/booklet/SpreadWall.tsx) where a click brings one up close.
 *
 * The page turning itself is components/booklet/Book.tsx. This file is the
 * stage around it: the poses, the controls, and not running WebGL until the
 * page is near the screen (and pausing it again once it has gone past).
 *
 * On a phone none of that runs: a small screen cannot show a readable spread
 * and the WebGL is heavy there, so it gets a still preview of a few spreads
 * and a line pointing to a desktop.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { corsMedia, media } from "@/lib/media";
import Book, { PAGE_H, PAGE_W } from "@/components/booklet/Book";
import SpreadWall, { toSpreads } from "@/components/booklet/SpreadWall";

export interface BookletBook {
  /** shown on the switch between books */
  name: string;
  /** every page in reading order, front cover first */
  pages: string[];
  /** the same pages, small, for the spreads view and the phone preview */
  thumbs: string[];
  /** page numbers (from 1) whose spreads are starred in the spreads view */
  stars?: number[];
}

type View = "magazine" | "flat" | "spreads";
type Pose = Exclude<View, "spreads">;

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
  view: Pose;
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

/**
 * The phone's still preview: four single pages of the first book as a 2 by 2
 * (front cover, two inside pages, back cover), then a plain note that the
 * rest is on a desktop. The inside pages are the first two starred ones, or
 * failing that two taken a third and two thirds of the way through.
 */
function PhonePreview({ books }: { books: BookletBook[] }) {
  const book = books[0];
  const last = book.pages.length - 1;
  const inside = (book.stars ?? []).map((n) => n - 1).filter((n) => n > 0 && n < last && book.thumbs[n]);
  for (const n of [Math.round(last / 3), Math.round((last * 2) / 3)]) {
    if (inside.length < 2 && !inside.includes(n) && book.thumbs[n]) inside.push(n);
  }
  const shown = [0, ...inside.slice(0, 2).sort((a, b) => a - b), last];
  const others = books.length - 1;
  return (
    <div className="pf-booklet-phone">
      <p className="pf-mono">
        {book.name} <span className="pf-soft">4 of {book.pages.filter(Boolean).length} pages</span>
      </p>
      <div className="pf-booklet-phone-pages">
        {shown.map((n) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={n} src={media(book.thumbs[n])} alt="" width={420} height={594} loading="lazy" decoding="async" />
        ))}
      </div>
      <p className="pf-booklet-phone-note">
        This is a small sample. Open this portfolio on a desktop to pick up and read {others > 0 ? `all ${books.length} playbooks` : "the whole playbook"}, every page.
      </p>
    </div>
  );
}

export default function PfBooklet({ books }: { books: BookletBook[] }) {
  const [which, setWhich] = useState(0);
  const book = books[which];
  const sheets = Math.ceil(book.pages.length / 2);
  const urls = useMemo(() => book.pages.map((p) => (p ? corsMedia(media(p)) : "")), [book.pages]);
  const smalls = useMemo(() => book.thumbs.map((p) => (p ? corsMedia(media(p)) : "")), [book.thumbs]);

  const [view, setView] = useState<View>("magazine");
  // the book keeps the pose it last had while the spreads are up
  const [pose, setPose] = useState<Pose>("magazine");
  const [picked, setPicked] = useState<number | null>(null); // the spread up close on the wall
  const [sheet, setSheet] = useState(0);
  const [near, setNear] = useState(false); // close enough to start loading
  const [seen, setSeen] = useState(false); // on screen: keep drawing
  const [phone, setPhone] = useState(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const pRef = useRef(0);
  const wake = useRef<() => void>(() => {}); // asks the canvas for a frame
  const drag = useRef<{ x: number; from: number } | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    const set = () => setPhone(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

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
  }, [phone]);

  // a change of view or book, or coming back on screen, needs a frame to start from
  useEffect(() => wake.current(), [view, seen, which]);

  const go = (to: number) => {
    const next = Math.min(sheets, Math.max(0, to));
    pRef.current = next;
    wake.current();
    setSheet(next);
  };

  const show = (v: View) => {
    setView(v);
    if (v !== "spreads") setPose(v);
    else setPlaying(false);
  };

  // another book: back to its cover, in the same view
  const open = (i: number) => {
    if (i === which) return;
    setWhich(i);
    setReady(false);
    setPlaying(false);
    setPicked(null);
    go(0);
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
    sheet <= 0 ? "Cover" : sheet >= sheets ? "Back cover" : `Pages ${sheet * 2} to ${sheet * 2 + 1}`;
  const close = picked === null ? null : toSpreads(book.pages.length)[picked].map((n) => n + 1);

  if (phone) return <PhonePreview books={books} />;

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
              <Stage key={book.name} pages={urls} view={pose} pRef={pRef} onReady={() => setReady(true)} />
            </group>
            {view === "spreads" ? (
              <SpreadWall key={book.name} thumbs={smalls} fulls={urls} stars={book.stars} picked={picked} onPick={setPicked} />
            ) : null}
          </Canvas>
        ) : null}
        {ready || view === "spreads" ? null : <p className="pf-booklet-wait pf-mono pf-soft">Loading booklet</p>}
      </div>

      {/* the ways to look at the book, stacked down the right-hand edge */}
      <div className="pf-booklet-views pf-mono">
        <button type="button" aria-pressed={view === "magazine"} onClick={() => show("magazine")}>
          Magazine
        </button>
        <button type="button" aria-pressed={view === "flat"} onClick={() => show("flat")}>
          Flat lay
        </button>
        <button type="button" aria-pressed={view === "spreads"} onClick={() => show("spreads")}>
          Spreads
        </button>
        {/* shuts whatever is open: a spread brought close on the wall, or the book back to its front cover */}
        {(view === "spreads" ? close !== null : sheet > 0) ? (
          <button
            type="button"
            className="pf-booklet-close"
            onClick={() => {
              setPlaying(false);
              if (view === "spreads") setPicked(null);
              else go(0);
            }}
          >
            Close
          </button>
        ) : null}
      </div>

      {/* the books, stacked down the left-hand edge */}
      {books.length > 1 ? (
        <div className="pf-booklet-books pf-mono">
          {books.map((b, i) => (
            <button key={b.name} type="button" aria-pressed={i === which} onClick={() => open(i)}>
              {b.name}
            </button>
          ))}
        </div>
      ) : null}

      <div className="pf-booklet-ui pf-mono">
        <span />
        {view === "spreads" ? (
          <span className="pf-booklet-where pf-soft" aria-live="polite">
            {close ? (close.length === 1 ? `Page ${close[0]}` : `Pages ${close[0]} to ${close[1]}`) : "Click a spread"}
          </span>
        ) : (
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
        )}
      </div>
    </>
  );
}
