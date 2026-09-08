"use client";

/**
 * CursorMania — the 2004 cursor toolbar, on the site. A port of the Chrome
 * extension that lives at /cursor: same Windows XP window (category tree,
 * cursor grid, status bar), same decode-then-cycle trick for animated GIFs.
 * Picking a cursor applies it to every page of the portfolio and sticks in
 * localStorage until "Normal cursor". Cursors live in /public/cursors,
 * indexed by /cursors/index.json, and are only fetched once the window opens.
 *
 * Two pieces: <CursorManiaButton/> (the XP button in the top nav) and
 * <CursorMania/> (the window + the applier, mounted once in LayoutShell).
 * They talk through a "cursormania:toggle" window event.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import "./cursormania.css";

type Index = Record<string, Record<string, string[]>>;
type Frame = { url: string; delay: number };
type Mode = "auto" | "tl" | "center";
type Current = {
  src: string;
  name: string;
  cat: string;
  sub: string;
  frames: Frame[];
  hotspot: [number, number];
  mode: Mode;
};

const STORE = "cursormania";
const STYLE_ID = "__cursormania_style";
const TOGGLE = "cursormania:toggle";

const cursorUrl = (cat: string, sub: string, f: string) =>
  "/cursors/" + [cat, sub === "(all)" ? null : sub, f].filter(Boolean).map((s) => encodeURIComponent(s as string)).join("/");

function titleCase(s: string) {
  return s
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bUs\b/, "US")
    .replace(/\bUk\b/, "UK")
    .replace(/Sci-fi/, "Sci-Fi");
}

/* ── Apply (the extension's content script) ─────────────────────── */
let timer: number | null = null;
let live: Frame[] | null = null;

function clearCursor() {
  if (timer) { window.clearTimeout(timer); timer = null; }
  live = null;
  document.getElementById(STYLE_ID)?.remove();
  document.documentElement.style.removeProperty("cursor");
}

function applyCursor(cur: Current | null) {
  clearCursor();
  if (!cur || !cur.frames?.length) return;
  live = cur.frames;
  const [hx, hy] = cur.hotspot ?? [0, 0];
  if (!document.getElementById(STYLE_ID)) {
    const s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent = "*, *::before, *::after { cursor: inherit !important; }";
    document.head.appendChild(s);
  }
  const still = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  let i = 0;
  const tick = () => {
    const f = live![i];
    document.documentElement.style.setProperty("cursor", `url("${f.url}") ${hx} ${hy}, auto`, "important");
    if (live!.length === 1 || still) return;
    i = (i + 1) % live!.length;
    timer = window.setTimeout(tick, Math.max(f.delay || 100, 40));
  };
  tick();
}

function readStore(): Current | null {
  try {
    const raw = localStorage.getItem(STORE);
    return raw ? (JSON.parse(raw) as Current) : null;
  } catch {
    return null;
  }
}
function writeStore(cur: Current | null) {
  try {
    if (cur) localStorage.setItem(STORE, JSON.stringify(cur));
    else localStorage.removeItem(STORE);
  } catch {
    /* storage full or blocked: the cursor still applies for this page */
  }
}

/* ── Decode a GIF into frames + hotspot ──────────────────────────── */
async function decodeGif(u: string): Promise<{ frames: Frame[]; first: ImageData }> {
  const frames: Frame[] = [];
  let first: ImageData | null = null;
  const cv = document.createElement("canvas");
  const ctx = cv.getContext("2d")!;
  if ("ImageDecoder" in window) {
    const buf = await (await fetch(u)).arrayBuffer();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dec = new (window as any).ImageDecoder({ data: buf, type: "image/gif" });
    await dec.tracks.ready;
    const n: number = dec.tracks.selectedTrack.frameCount;
    for (let i = 0; i < n && i < 60; i++) {
      const { image } = await dec.decode({ frameIndex: i });
      cv.width = image.displayWidth;
      cv.height = image.displayHeight;
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.drawImage(image, 0, 0);
      if (i === 0) first = ctx.getImageData(0, 0, cv.width, cv.height);
      frames.push({ url: cv.toDataURL("image/png"), delay: Math.round((image.duration || 100000) / 1000) });
      image.close();
    }
    dec.close();
  } else {
    // Safari / Firefox: no ImageDecoder, so the first frame stands still.
    const img = new Image();
    img.src = u;
    await img.decode();
    cv.width = img.naturalWidth;
    cv.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    first = ctx.getImageData(0, 0, cv.width, cv.height);
    frames.push({ url: cv.toDataURL("image/png"), delay: 100 });
  }
  return { frames, first: first! };
}

function hotspotFor(mode: Mode, first: ImageData): [number, number] {
  const { width: w, height: h, data: d } = first;
  if (mode === "center") return [w >> 1, h >> 1];
  if (mode === "tl") return [0, 0];
  let best: [number, number] | null = null;
  let bd = Infinity;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (d[(y * w + x) * 4 + 3] > 40) {
        const dist = x + y;
        if (dist < bd) { bd = dist; best = [x, y]; }
      }
  return best ?? [0, 0];
}

/* ── The nav item: a pointer-arrow glyph in the social row ───────── */
export function CursorManiaButton() {
  return (
    <button
      type="button"
      className="top-nav-social-item top-nav-cursor"
      onClick={() => window.dispatchEvent(new CustomEvent(TOGGLE))}
      aria-haspopup="dialog"
      aria-label="CursorMania, pick a cursor"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="100%" height="100%">
        <path d="M5 3l14.5 10.2-6.4 1.1 3.6 6.3-2.6 1.4-3.6-6.3L5.6 20.4z" />
      </svg>
      <span className="nav-tip" aria-hidden="true">CursorMania</span>
    </button>
  );
}

/* ── The window ──────────────────────────────────────────────────── */
export default function CursorMania() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState<Index | null>(null);
  const [openCats, setOpenCats] = useState<Set<string>>(new Set());
  const [view, setView] = useState<{ cat: string; sub: string } | null>(null);
  const [current, setCurrent] = useState<Current | null>(null);
  const [mode, setMode] = useState<Mode>("auto");
  const [msg, setMsg] = useState("");
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const winRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<{ px: number; py: number; x: number; y: number } | null>(null);

  // Re-apply the saved cursor on every page (this component mounts once per
  // portfolio page load; client navigation keeps it mounted).
  useEffect(() => {
    const saved = readStore();
    if (saved) { setCurrent(saved); setMode(saved.mode || "auto"); applyCursor(saved); }
    const onVis = () => {
      if (document.hidden) { if (timer) { window.clearTimeout(timer); timer = null; } }
      else if (live && !timer) applyCursor(readStore());
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Open/close from the nav button; Escape closes.
  useEffect(() => {
    const onToggle = () => setOpen((o) => !o);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener(TOGGLE, onToggle);
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener(TOGGLE, onToggle); window.removeEventListener("keydown", onKey); };
  }, []);

  // Fetch the index the first time the window opens, then land on the good
  // stuff (Pointers, like the readme says) or the saved cursor's category.
  useEffect(() => {
    if (!open || index) return;
    let dead = false;
    (async () => {
      try {
        const idx: Index = await (await fetch("/cursors/index.json")).json();
        if (dead) return;
        setIndex(idx);
        const saved = readStore();
        if (saved && idx[saved.cat]?.[saved.sub]) {
          setOpenCats(new Set([saved.cat]));
          setView({ cat: saved.cat, sub: saved.sub });
        } else {
          const cat = Object.keys(idx).find((c) => c.startsWith("POINTERS")) ?? Object.keys(idx)[0];
          const subs = Object.keys(idx[cat]);
          setOpenCats(new Set([cat]));
          setView({ cat, sub: subs[1] ?? subs[0] });
        }
      } catch {
        if (!dead) setMsg("Could not load the cursor list");
      }
    })();
    return () => { dead = true; };
  }, [open, index]);

  // Scroll the chosen cursor into view when its grid shows.
  useEffect(() => {
    if (!open || !view || !current || current.cat !== view.cat || current.sub !== view.sub) return;
    const t = window.setTimeout(() => {
      gridRef.current?.querySelector<HTMLElement>(".cm-cell.sel")?.scrollIntoView({ block: "center" });
    }, 60);
    return () => window.clearTimeout(t);
  }, [open, view, current]);

  const pick = useCallback(async (cat: string, sub: string, f: string, m: Mode = mode) => {
    const u = cursorUrl(cat, sub, f);
    setMsg("Loading…");
    try {
      const { frames, first } = await decodeGif(u);
      const cur: Current = { src: u, name: f, cat, sub, frames, hotspot: hotspotFor(m, first), mode: m };
      setCurrent(cur);
      writeStore(cur);
      applyCursor(cur);
      setMsg(frames.length > 1 ? `Applied, ${frames.length} frames` : "Applied");
    } catch {
      setMsg("Could not load that one");
    }
  }, [mode]);

  const reset = () => {
    setCurrent(null);
    writeStore(null);
    clearCursor();
    setMsg("Back to normal");
  };

  const surprise = () => {
    if (!index) return;
    const cats = Object.keys(index);
    const cat = cats[(Math.random() * cats.length) | 0];
    const subs = Object.keys(index[cat]);
    const sub = subs[(Math.random() * subs.length) | 0];
    const files = index[cat][sub];
    const f = files[(Math.random() * files.length) | 0];
    setOpenCats((s) => new Set(s).add(cat));
    setView({ cat, sub });
    void pick(cat, sub, f);
  };

  const onModeChange = (m: Mode) => {
    setMode(m);
    if (current) void pick(current.cat, current.sub, current.name, m);
  };

  // Title-bar drag: the window starts docked top right and can be moved.
  const onDragStart = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest(".cm-winbtns")) return;
    const r = winRef.current!.getBoundingClientRect();
    dragStart.current = { px: e.clientX, py: e.clientY, x: r.left, y: r.top };
    setDrag({ x: r.left, y: r.top });
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onDragMove = (e: React.PointerEvent) => {
    const d = dragStart.current;
    if (!d) return;
    setDrag({ x: d.x + e.clientX - d.px, y: d.y + e.clientY - d.py });
  };
  const onDragEnd = () => { dragStart.current = null; };

  if (!open) return null;

  const total = index
    ? Object.values(index).reduce((a, c) => a + Object.values(c).reduce((b, f) => b + f.length, 0), 0)
    : 0;
  const files = index && view ? index[view.cat]?.[view.sub] ?? [] : [];

  return (
    <div
      ref={winRef}
      className="cm-win"
      role="dialog"
      aria-label="CursorMania"
      data-lenis-prevent
      style={drag ? { left: drag.x, top: drag.y, right: "auto" } : undefined}
    >
      <div className="cm-titlebar" onPointerDown={onDragStart} onPointerMove={onDragMove} onPointerUp={onDragEnd}>
        <div className="cm-logo" aria-hidden="true">
          <span className="c">C</span><span className="u">u</span><span className="r">r</span><span className="s">s</span>
          <span className="o">o</span><span className="r2">r</span><span className="m">M</span><span className="a">a</span>
          <span className="n">n</span><span className="i">i</span><span className="a2">a</span><span className="cm-spark">✦</span>
        </div>
        <div className="cm-tagline">Free Cursors for your PC!</div>
        <div className="cm-winbtns">
          <a href="/cursor" title="Get the Chrome extension">?</a>
          <button type="button" className="x" onClick={() => setOpen(false)} aria-label="Close">×</button>
        </div>
      </div>

      <div className="cm-toolbar">
        <button type="button" className="xpbtn" onClick={surprise} disabled={!index}>Surprise me!</button>
        <button type="button" className="xpbtn" onClick={reset}>Normal cursor</button>
        <span className="cm-sep" />
        <label>
          Tip:
          <select className="xpsel" value={mode} onChange={(e) => onModeChange(e.target.value as Mode)}>
            <option value="auto">Auto-detect</option>
            <option value="tl">Top-left</option>
            <option value="center">Center</option>
          </select>
        </label>
        <span className="cm-sep" />
        <a className="xpbtn cm-dl" href="/cursor">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/cursormania/icon-16.png" alt="" width={16} height={16} />
          Download Chrome extension
        </a>
        <span className="cm-grow" />
        <span className="cm-count">{index ? `${total.toLocaleString()} cursors` : "Loading…"}</span>
      </div>

      <div className="cm-main">
        <div className="cm-tree">
          {index &&
            Object.keys(index).map((cat) => {
              const subs = Object.keys(index[cat]);
              const n = subs.reduce((a, s) => a + index[cat][s].length, 0);
              const isOpen = openCats.has(cat);
              return (
                <div key={cat} className={`cm-cat ${isOpen ? "open" : ""}`}>
                  <div
                    className="cm-row"
                    onClick={() => {
                      setOpenCats((s) => {
                        const next = new Set(s);
                        if (next.has(cat)) next.delete(cat);
                        else next.add(cat);
                        return next;
                      });
                      if (!isOpen && subs.length === 1) setView({ cat, sub: subs[0] });
                    }}
                  >
                    <span className="cm-box" />
                    <span>{titleCase(cat)}</span> <span className="cm-cnt">{n}</span>
                  </div>
                  <div className="cm-subs">
                    {subs.map((sub) => (
                      <div
                        key={sub}
                        className={`cm-sub ${view?.cat === cat && view?.sub === sub ? "sel" : ""}`}
                        onClick={() => setView({ cat, sub })}
                      >
                        {sub === "(all)" ? "All" : titleCase(sub)} <span className="cm-cnt">{index[cat][sub].length}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
        <div className="cm-right">
          <div className="cm-crumb">
            {view ? (
              <>
                {titleCase(view.cat)} <b>›</b> {view.sub === "(all)" ? "All" : titleCase(view.sub)} <b>({files.length})</b>
              </>
            ) : (
              "Pick a category"
            )}
          </div>
          <div className="cm-grid" ref={gridRef}>
            {view &&
              files.map((f) => {
                const u = cursorUrl(view.cat, view.sub, f);
                const sel = current?.src === u;
                return (
                  <div
                    key={f}
                    className={`cm-cell ${sel ? "sel" : ""}`}
                    title={f}
                    style={{ cursor: `url("${u}") 0 0, pointer` }}
                    onClick={() => void pick(view.cat, view.sub, f)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={u} alt={f} loading="lazy" />
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <div className="cm-statusbar">
        <div className="cm-cur">
          <span className="lbl">Your cursor:</span>
          {current && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={current.src} alt="" className="cm-cur-img" />
          )}
          <span>
            {current
              ? `${current.name}, ${titleCase(current.cat)}${current.sub === "(all)" ? "" : " / " + titleCase(current.sub)}`
              : "Normal cursor"}
          </span>
        </div>
        <div className="cm-msg">{msg}</div>
      </div>
    </div>
  );
}
