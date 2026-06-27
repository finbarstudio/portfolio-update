"use client";

/**
 * Bezier Studio — paste/upload/trace an SVG (or raster logo) and see its bezier
 * curves, on-curve anchors and off-curve control handles drawn as a styleable
 * "specimen plate" you can export as a crisp SVG/PNG, or record the draw-on
 * animation to MP4/WebM. Laid out in the same fixed size presets as the 3D SVG
 * Studio, so the preview IS the export.
 *
 * Pure SVG/React for the live view; geometry is parsed by bezier-path (any
 * path/shape → absolute line/quad/cubic, transforms baked via getScreenCTM).
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  parsePath, shapeToPathData, transformSubPaths, subPathsToD,
  anchorsOf, handlesOf, boundsOf, type SubPath,
} from "./bezier-path";
import { traceImageToSVG } from "./image-trace";
import { downloadBlob, safeName } from "@/lib/sandbox/download";
import SandboxLoader from "@/components/sandbox/SandboxLoader";
import { STAR_POINTS } from "@/components/brand-star";
import { ASTERISK_POINTS } from "@/components/brand-asterisk";

// Size formats, mirroring the 3D SVG Studio.
const PRESETS: Record<string, [number, number]> = {
  "1:1 Square (1080)": [1080, 1080],
  "16:9 Landscape (1920)": [1920, 1080],
  "9:16 Vertical (1080)": [1080, 1920],
  "4:5 Portrait (1080)": [1080, 1350],
  "LinkedIn (1200×627)": [1200, 627],
};

const SAMPLES: Record<string, string> = {
  Wave: `<svg viewBox="0 0 200 90" xmlns="http://www.w3.org/2000/svg"><path d="M8 45 C 30 2 58 2 80 45 S 130 88 152 45 S 188 8 196 45" fill="none"/></svg>`,
  Blob: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M100 16 C 152 16 188 56 184 106 C 180 152 150 190 100 184 C 52 178 14 150 18 100 C 22 50 48 16 100 16 Z" fill="none"/></svg>`,
  Heart: `<svg viewBox="0 0 200 184" xmlns="http://www.w3.org/2000/svg"><path d="M100 170 C 18 112 18 40 64 40 C 88 40 100 60 100 60 C 100 60 112 40 136 40 C 182 40 182 112 100 170 Z" fill="none"/></svg>`,
  Star: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="${STAR_POINTS}"/></svg>`,
  Asterisk: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="${ASTERISK_POINTS}"/></svg>`,
};

const MONO = "'Space Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

type AnchorShape = "Square" | "Circle" | "Diamond" | "Triangle" | "Cross" | "Dot";
type ControlShape = "Ring" | "Dot" | "Square" | "Cross";

type Cfg = {
  preset: string; bg: string;
  grid: "Lines + dots" | "Lines" | "Dots" | "Off"; gridSize: number; gridWeight: number;
  gridColor: string; gridAuto: boolean;
  margin: number; padding: number; zoom: number;
  frame: boolean; cornerTicks: boolean; vignette: number;
  showCurve: boolean; curveColor: string; curveWeight: number; curveOpacity: number;
  glow: boolean; glowColor: string; glowIntensity: number;
  fillShape: boolean; fillColor: string; fillOpacity: number;
  showAnchors: boolean; showControls: boolean; showHandles: boolean; nodeScale: number;
  anchorShape: AnchorShape; anchorFill: string; anchorStroke: string; anchorSize: number; anchorWeight: number; anchorRotate: number;
  controlShape: ControlShape; controlFill: string; controlStroke: string; controlSize: number;
  handleColor: string; handleWeight: number; handleDash: number; handleOpacity: number;
  labelMode: "None" | "Index" | "Coords"; labelColor: string; labelSize: number;
  labelPos: "Top right" | "Top left" | "Bottom right" | "Bottom left" | "Above" | "Below" | "Left" | "Right"; labelOffset: number;
  titleBlock: boolean; caption: string;
  drawOn: boolean; drawDuration: number; pulse: boolean;
  revealStyle: "Draw" | "Fade" | "Scale" | "Wipe"; easing: "Linear" | "Ease out" | "Ease in-out" | "Spring";
  stagger: number; layer: "Together" | "Curve first" | "Nodes first"; tracer: boolean;
  loopMode: "Once" | "Loop" | "Ping-pong"; exportFps: number;
  traceColors: number; traceDetail: number;
  exportTransparent: boolean; exportNoGrid: boolean;
};

function defaultCfg(): Cfg {
  return {
    preset: "1:1 Square (1080)", bg: "#211E1A",
    grid: "Lines + dots", gridSize: 48, gridWeight: 1.5, gridColor: "#6E675C", gridAuto: true,
    margin: 56, padding: 64, zoom: 100,
    frame: true, cornerTicks: true, vignette: 0.35,
    showCurve: true, curveColor: "#F6EFE1", curveWeight: 3, curveOpacity: 1,
    glow: true, glowColor: "#E8718B", glowIntensity: 55,
    fillShape: false, fillColor: "#F6C9D1", fillOpacity: 0.1,
    showAnchors: true, showControls: true, showHandles: true, nodeScale: 1,
    anchorShape: "Square", anchorFill: "#211E1A", anchorStroke: "#F6EFE1", anchorSize: 16, anchorWeight: 3, anchorRotate: 0,
    controlShape: "Ring", controlFill: "#211E1A", controlStroke: "#E8718B", controlSize: 12,
    handleColor: "#E8718B", handleWeight: 2, handleDash: 0, handleOpacity: 0.7,
    labelMode: "Index", labelColor: "#9C9486", labelSize: 20,
    labelPos: "Top right", labelOffset: 18,
    titleBlock: true, caption: "BÉZIER SPECIMEN",
    drawOn: true, drawDuration: 1.6, pulse: false,
    revealStyle: "Draw", easing: "Ease out", stagger: 0.7, layer: "Curve first", tracer: true,
    loopMode: "Loop", exportFps: 30,
    traceColors: 8, traceDetail: 1,
    exportTransparent: false, exportNoGrid: false,
  };
}

type Field =
  | { kind: "range"; key: keyof Cfg; label: string; min: number; max: number; step: number }
  | { kind: "color"; key: keyof Cfg; label: string }
  | { kind: "toggle"; key: keyof Cfg; label: string }
  | { kind: "select"; key: keyof Cfg; label: string; options: string[] }
  | { kind: "text"; key: keyof Cfg; label: string };

const SECTIONS: { title: string; fields: Field[] }[] = [
  { title: "Format", fields: [
    { kind: "select", key: "preset", label: "Size", options: Object.keys(PRESETS) },
    { kind: "color", key: "bg", label: "Background" },
    { kind: "range", key: "zoom", label: "Zoom %", min: 25, max: 300, step: 1 },
    { kind: "range", key: "margin", label: "Frame inset", min: 10, max: 320, step: 1 },
    { kind: "range", key: "padding", label: "Padding", min: 0, max: 420, step: 1 },
    { kind: "range", key: "vignette", label: "Vignette", min: 0, max: 1, step: 0.05 },
  ]},
  { title: "Grid + frame", fields: [
    { kind: "select", key: "grid", label: "Grid", options: ["Lines + dots", "Lines", "Dots", "Off"] },
    { kind: "range", key: "gridSize", label: "Cell size", min: 10, max: 240, step: 1 },
    { kind: "range", key: "gridWeight", label: "Line / dot size", min: 0.25, max: 8, step: 0.25 },
    { kind: "toggle", key: "gridAuto", label: "Auto colour (from bg)" },
    { kind: "color", key: "gridColor", label: "Grid / frame colour" },
    { kind: "toggle", key: "frame", label: "Frame" },
    { kind: "toggle", key: "cornerTicks", label: "Corner ticks" },
  ]},
  { title: "Curve", fields: [
    { kind: "toggle", key: "showCurve", label: "Outline" },
    { kind: "color", key: "curveColor", label: "Outline colour" },
    { kind: "range", key: "curveWeight", label: "Outline weight", min: 0.25, max: 16, step: 0.25 },
    { kind: "range", key: "curveOpacity", label: "Outline opacity", min: 0, max: 1, step: 0.05 },
    { kind: "toggle", key: "glow", label: "Glow" },
    { kind: "color", key: "glowColor", label: "Glow colour" },
    { kind: "range", key: "glowIntensity", label: "Glow", min: 0, max: 100, step: 1 },
    { kind: "toggle", key: "fillShape", label: "Fill" },
    { kind: "color", key: "fillColor", label: "Fill colour" },
    { kind: "range", key: "fillOpacity", label: "Fill opacity", min: 0, max: 1, step: 0.02 },
  ]},
  { title: "Anchors", fields: [
    { kind: "toggle", key: "showAnchors", label: "Show anchors" },
    { kind: "select", key: "anchorShape", label: "Shape", options: ["Square", "Circle", "Diamond", "Triangle", "Cross", "Dot"] },
    { kind: "color", key: "anchorStroke", label: "Stroke colour" },
    { kind: "color", key: "anchorFill", label: "Fill colour" },
    { kind: "range", key: "anchorSize", label: "Size", min: 4, max: 56, step: 1 },
    { kind: "range", key: "anchorWeight", label: "Stroke weight", min: 0.5, max: 12, step: 0.5 },
    { kind: "range", key: "anchorRotate", label: "Rotation°", min: 0, max: 360, step: 5 },
  ]},
  { title: "Controls + handles", fields: [
    { kind: "toggle", key: "showControls", label: "Show controls" },
    { kind: "toggle", key: "showHandles", label: "Show handles" },
    { kind: "range", key: "nodeScale", label: "Node scale", min: 0.4, max: 2.5, step: 0.05 },
    { kind: "select", key: "controlShape", label: "Control shape", options: ["Ring", "Dot", "Square", "Cross"] },
    { kind: "color", key: "controlStroke", label: "Control colour" },
    { kind: "color", key: "controlFill", label: "Control fill" },
    { kind: "range", key: "controlSize", label: "Control size", min: 3, max: 40, step: 1 },
    { kind: "color", key: "handleColor", label: "Handle colour" },
    { kind: "range", key: "handleWeight", label: "Handle weight", min: 0.25, max: 10, step: 0.25 },
    { kind: "range", key: "handleDash", label: "Handle dash", min: 0, max: 24, step: 1 },
    { kind: "range", key: "handleOpacity", label: "Handle opacity", min: 0, max: 1, step: 0.05 },
  ]},
  { title: "Labels + title block", fields: [
    { kind: "select", key: "labelMode", label: "Labels", options: ["None", "Index", "Coords"] },
    { kind: "select", key: "labelPos", label: "Position", options: ["Top right", "Top left", "Bottom right", "Bottom left", "Above", "Below", "Left", "Right"] },
    { kind: "range", key: "labelOffset", label: "Offset", min: 0, max: 90, step: 1 },
    { kind: "color", key: "labelColor", label: "Label colour" },
    { kind: "range", key: "labelSize", label: "Label size", min: 8, max: 64, step: 1 },
    { kind: "toggle", key: "titleBlock", label: "Title block" },
    { kind: "text", key: "caption", label: "Caption" },
  ]},
  { title: "Motion (recording)", fields: [
    { kind: "toggle", key: "drawOn", label: "Animate" },
    { kind: "select", key: "revealStyle", label: "Reveal", options: ["Draw", "Fade", "Scale", "Wipe"] },
    { kind: "select", key: "easing", label: "Easing", options: ["Linear", "Ease out", "Ease in-out", "Spring"] },
    { kind: "range", key: "drawDuration", label: "Duration s", min: 0.4, max: 8, step: 0.1 },
    { kind: "range", key: "stagger", label: "Node stagger", min: 0, max: 1, step: 0.05 },
    { kind: "select", key: "layer", label: "Order", options: ["Together", "Curve first", "Nodes first"] },
    { kind: "toggle", key: "tracer", label: "Tracer dot" },
    { kind: "toggle", key: "pulse", label: "Pulse nodes (live)" },
    { kind: "select", key: "loopMode", label: "Loop", options: ["Once", "Loop", "Ping-pong"] },
  ]},
  { title: "Trace + export", fields: [
    { kind: "range", key: "traceColors", label: "Trace colours", min: 2, max: 24, step: 1 },
    { kind: "range", key: "traceDetail", label: "Trace smoothing", min: 0.2, max: 6, step: 0.2 },
    { kind: "range", key: "exportFps", label: "Video / GIF fps", min: 8, max: 60, step: 1 },
    { kind: "toggle", key: "exportTransparent", label: "Transparent bg" },
    { kind: "toggle", key: "exportNoGrid", label: "Hide grid" },
  ]},
];

/** Parse an SVG string → flattened sub-paths in one coordinate space. */
function extractGeometry(svgText: string): SubPath[] {
  const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
  if (doc.querySelector("parsererror")) throw new Error("That isn’t valid SVG.");
  const svgEl = doc.querySelector("svg");
  if (!svgEl) throw new Error("No <svg> element found.");

  const host = document.createElement("div");
  host.style.cssText = "position:absolute;left:-99999px;top:0;width:1200px;height:1200px;opacity:0;pointer-events:none;overflow:hidden";
  const imported = document.importNode(svgEl, true) as SVGSVGElement;
  imported.querySelectorAll("script,foreignObject,a,image,use").forEach((el) => el.remove());
  host.appendChild(imported);
  document.body.appendChild(host);
  try {
    const ctm = imported.getScreenCTM();
    let rootInv = ctm ? ctm.inverse() : null;
    if (rootInv && !(Number.isFinite(rootInv.a) && Number.isFinite(rootInv.d) && Number.isFinite(rootInv.e) && Number.isFinite(rootInv.f))) rootInv = null;
    const els = imported.querySelectorAll("path,rect,circle,ellipse,line,polyline,polygon");
    const subs: SubPath[] = [];
    els.forEach((el) => {
      const tag = el.tagName.toLowerCase();
      const d = tag === "path" ? (el.getAttribute("d") || "") : shapeToPathData(tag, (n) => el.getAttribute(n) || "");
      if (!d.trim()) return;
      let sp = parsePath(d);
      const elCTM = (el as SVGGraphicsElement).getScreenCTM?.();
      if (rootInv && elCTM) {
        const m = rootInv.multiply(elCTM);
        sp = transformSubPaths(sp, { a: m.a, b: m.b, c: m.c, d: m.d, e: m.e, f: m.f });
      }
      for (const s of sp) if (s.segs.length) subs.push(s);
    });
    if (!subs.length) throw new Error("No drawable paths in this SVG.");
    return subs;
  } finally {
    document.body.removeChild(host);
  }
}

const hexRgb = (c: string): [number, number, number] => {
  const m = /^#?([0-9a-f]{6})$/i.exec(c.trim());
  if (m) { const n = parseInt(m[1], 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  return [33, 30, 26];
};
/** A subtle UI colour derived from the background luminance (light on dark, dark on light). */
function autoUiColor(bg: string): string {
  const [r, g, b] = hexRgb(bg);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.52 ? "#ECE6DA" : "#211E1A";
}
/** Normalise a typed colour to #rrggbb for the native colour picker (the text
    field keeps the raw value, so rgba()/named colours still pass through to SVG). */
function normHex(c: string): string {
  const s = (c || "").trim();
  if (/^#[0-9a-f]{6}$/i.test(s)) return s;
  if (/^[0-9a-f]{6}$/i.test(s)) return "#" + s;
  const m = /^#?([0-9a-f]{3})$/i.exec(s);
  if (m) { const x = m[1]; return "#" + x[0] + x[0] + x[1] + x[1] + x[2] + x[2]; }
  return "#000000";
}

export default function BezierStudio() {
  const [cfg, setCfg] = useState<Cfg>(defaultCfg);
  const [svgText, setSvgText] = useState<string>(SAMPLES.Wave);
  const [sourceName, setSourceName] = useState("Wave");
  const [subs, setSubs] = useState<SubPath[] | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [paste, setPaste] = useState<string | null>(null);
  const [drawNonce, setDrawNonce] = useState(0);
  const [pathLen, setPathLen] = useState(0);

  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const measureRef = useRef<SVGPathElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);

  const replay = useCallback(() => setDrawNonce((n) => n + 1), []);
  const [W, H] = PRESETS[cfg.preset] ?? [1080, 1080];

  useEffect(() => {
    // Parsing needs the DOM (getScreenCTM bakes element transforms), so it has to
    // run in an effect rather than during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    try { setSubs(extractGeometry(svgText)); setStatus(""); replay(); }
    catch (e) { setStatus((e as Error).message); }
  }, [svgText, replay]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const ro = new ResizeObserver(() => setSize({ w: Math.max(0, stage.clientWidth), h: Math.max(0, stage.clientHeight) }));
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  // Fit the artwork into the preset (margin + padding + zoom). Geometry is in
  // preset coordinates; the SVG is then scaled to fit the stage on screen.
  const view = useMemo(() => {
    if (!subs) return null;
    const b = boundsOf(subs);
    const m = cfg.margin + cfg.padding;
    const fit = Math.min((W - 2 * m) / b.w, (H - 2 * m) / b.h) * (cfg.zoom / 100);
    const tx = W / 2 - (b.x + b.w / 2) * fit;
    const ty = H / 2 - (b.y + b.h / 2) * fit;
    const vsubs = transformSubPaths(subs, { a: fit, b: 0, c: 0, d: fit, e: tx, f: ty });
    return {
      d: subPathsToD(vsubs),
      anchors: anchorsOf(vsubs), anchorsArt: anchorsOf(subs),
      handles: handlesOf(vsubs), segCount: subs.reduce((n, s) => n + s.segs.length, 0),
    };
  }, [subs, W, H, cfg.margin, cfg.padding, cfg.zoom]);

  useEffect(() => { if (measureRef.current) { try { setPathLen(measureRef.current.getTotalLength()); } catch { /* */ } } }, [view?.d]);

  function set<K extends keyof Cfg>(key: K, value: Cfg[K]) { setCfg((c) => ({ ...c, [key]: value })); }
  function loadText(text: string, name: string) { setSvgText(text); setSourceName(name); }

  // Grid sizing: fit the cells to the frame so they line up exactly, and step the
  // cell count by ×2 / ÷2 while keeping that perfect fit.
  const frameInnerW = () => Math.max(1, W - 2 * cfg.margin);
  const gridCount = () => Math.max(1, Math.round(frameInnerW() / cfg.gridSize));
  const autoFitGrid = () => set("gridSize", frameInnerW() / gridCount());
  const stepGridCells = (mul: number) => set("gridSize", frameInnerW() / Math.max(1, Math.round(gridCount() * mul)));

  async function onTraceImage(file: File) {
    setBusy(true); setStatus("Tracing image…");
    try {
      const dataUrl = await new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = rej; r.readAsDataURL(file); });
      const svg = await traceImageToSVG(dataUrl, { colors: cfg.traceColors, detail: cfg.traceDetail });
      loadText(svg, file.name.replace(/\.(png|jpe?g|webp|gif)$/i, ""));
      setStatus("Traced to vector.");
    } catch (e) { setStatus("Trace failed: " + (e as Error).message); }
    finally { setBusy(false); }
  }

  // ── Export ──────────────────────────────────────────────────────────────────
  function cleanExport(clone: SVGSVGElement, opts: { transparent: boolean; noGrid: boolean }) {
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.removeAttribute("class");
    clone.querySelectorAll<SVGElement>("*").forEach((el) => {
      el.removeAttribute("class"); el.removeAttribute("pathLength");
      el.removeAttribute("data-draw"); el.removeAttribute("data-pop");
      el.style.removeProperty("animation"); el.style.removeProperty("--bz-dur");
      el.style.removeProperty("--bz-delay"); el.style.removeProperty("opacity");
    });
    if (opts.transparent) { clone.querySelector("#bz-bg")?.remove(); clone.querySelector("#bz-vignette")?.remove(); }
    if (opts.noGrid) clone.querySelector("#bz-grid")?.remove();
    clone.querySelector("#bz-measure")?.remove();
  }
  function exportSvgString(opts: { transparent: boolean; noGrid: boolean }): string | null {
    if (!svgRef.current) return null;
    const clone = svgRef.current.cloneNode(true) as SVGSVGElement;
    cleanExport(clone, opts);
    return new XMLSerializer().serializeToString(clone);
  }
  const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
  function ease(t: number): number {
    t = clamp01(t);
    if (cfg.easing === "Linear") return t;
    if (cfg.easing === "Ease in-out") return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    if (cfg.easing === "Spring") { const c4 = (2 * Math.PI) / 3; return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1; }
    return 1 - Math.pow(1 - t, 2); // Ease out
  }
  /** Frame phases (0..1) for the chosen loop mode. Ping-pong reverses back. */
  function buildPhases(n: number): number[] {
    const fwd = Array.from({ length: n }, (_, i) => i / (n - 1));
    if (cfg.loopMode === "Ping-pong") return fwd.concat(fwd.slice(1, -1).reverse());
    return fwd;
  }
  /** SVG serialised with the chosen reveal (style / easing / stagger / layer /
      tracer) baked at the given phase — used for every recorded frame. */
  function serializeAtProgress(phase: number): string {
    const e = ease(phase);
    let curveT = e, nodeT = e;
    if (cfg.layer === "Curve first") { curveT = clamp01(e / 0.6); nodeT = clamp01((e - 0.4) / 0.6); }
    else if (cfg.layer === "Nodes first") { nodeT = clamp01(e / 0.6); curveT = clamp01((e - 0.4) / 0.6); }
    const style = cfg.revealStyle;
    const clone = svgRef.current!.cloneNode(true) as SVGSVGElement;

    const anim = clone.querySelector<SVGElement>("[data-anim]");
    if (anim) {
      if (style === "Scale") { const s = 0.55 + 0.45 * e; anim.setAttribute("transform", `translate(${W / 2} ${H / 2}) scale(${s}) translate(${-W / 2} ${-H / 2})`); anim.style.opacity = String(e); }
      else { anim.removeAttribute("transform"); anim.style.removeProperty("opacity"); }
    }
    clone.querySelector<SVGElement>("#bz-wipe-rect")?.setAttribute("width", String(style === "Wipe" ? W * e : W));

    clone.querySelectorAll<SVGElement>("[data-draw]").forEach((el) => {
      el.style.removeProperty("stroke-dasharray"); el.style.removeProperty("stroke-dashoffset"); el.style.removeProperty("opacity"); el.removeAttribute("pathLength");
      if (style === "Draw") { el.setAttribute("pathLength", "1"); el.style.strokeDasharray = "1"; el.style.strokeDashoffset = String(clamp01(1 - curveT)); }
      else if (style === "Fade") el.style.opacity = String(curveT);
    });
    clone.querySelectorAll<SVGElement>("[data-pop]").forEach((el) => {
      if (style === "Draw" || style === "Fade") {
        const frac = parseFloat(el.getAttribute("data-pop") || "0") || 0;
        el.style.opacity = String(clamp01((nodeT - frac * cfg.stagger) / 0.18));
      } else el.style.removeProperty("opacity");
    });
    const tracer = clone.querySelector<SVGElement>("#bz-tracer");
    if (tracer) {
      if (cfg.tracer && style === "Draw" && curveT > 0.001 && curveT < 0.999 && measureRef.current && pathLen > 0) {
        try { const pt = measureRef.current.getPointAtLength(curveT * pathLen); tracer.setAttribute("cx", String(pt.x)); tracer.setAttribute("cy", String(pt.y)); tracer.style.opacity = "1"; }
        catch { tracer.style.opacity = "0"; }
      } else tracer.style.opacity = "0";
    }

    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.querySelectorAll<SVGElement>("*").forEach((el) => {
      el.removeAttribute("class"); el.removeAttribute("data-draw"); el.removeAttribute("data-pop"); el.removeAttribute("data-anim");
      el.style.removeProperty("animation"); el.style.removeProperty("--bz-dur"); el.style.removeProperty("--bz-delay");
    });
    clone.querySelector("#bz-measure")?.remove();
    return new XMLSerializer().serializeToString(clone);
  }
  function svgToBitmap(str: string, fillBg: boolean): Promise<ImageBitmap | null> {
    return new Promise((res) => {
      const url = URL.createObjectURL(new Blob([str], { type: "image/svg+xml;charset=utf-8" }));
      const img = new Image();
      img.onload = async () => {
        try {
          const c = document.createElement("canvas"); c.width = W; c.height = H;
          const x = c.getContext("2d")!;
          if (fillBg) { x.fillStyle = cfg.bg; x.fillRect(0, 0, W, H); }
          x.drawImage(img, 0, 0, W, H);
          const bmp = await createImageBitmap(c); URL.revokeObjectURL(url); res(bmp);
        } catch { URL.revokeObjectURL(url); res(null); }
      };
      img.onerror = () => { URL.revokeObjectURL(url); res(null); };
      img.src = url;
    });
  }
  function saveSVG() {
    const str = exportSvgString({ transparent: cfg.exportTransparent, noGrid: cfg.exportNoGrid });
    if (!str) return;
    downloadBlob(new Blob(['<?xml version="1.0" encoding="UTF-8"?>\n' + str], { type: "image/svg+xml" }), safeName(sourceName + "-bezier") + ".svg");
    setStatus("Saved .svg");
  }
  function savePNG() {
    const str = exportSvgString({ transparent: cfg.exportTransparent, noGrid: cfg.exportNoGrid });
    if (!str) return;
    const url = URL.createObjectURL(new Blob([str], { type: "image/svg+xml;charset=utf-8" }));
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas"); c.width = W; c.height = H;
      const x = c.getContext("2d")!;
      if (!cfg.exportTransparent) { x.fillStyle = cfg.bg; x.fillRect(0, 0, W, H); }
      x.drawImage(img, 0, 0, W, H); URL.revokeObjectURL(url);
      c.toBlob((b) => { if (b) { downloadBlob(b, safeName(sourceName + "-bezier") + ".png"); setStatus("Saved .png (" + W + "×" + H + ")"); } }, "image/png");
    };
    img.onerror = () => { URL.revokeObjectURL(url); setStatus("PNG export failed."); };
    img.src = url;
  }
  async function copySVG() {
    const str = exportSvgString({ transparent: cfg.exportTransparent, noGrid: cfg.exportNoGrid });
    if (!str) return;
    try { await navigator.clipboard.writeText(str); setStatus("Copied SVG to clipboard"); }
    catch { setStatus("Clipboard blocked — use Save .svg instead."); }
  }
  function saveSettings() {
    downloadBlob(new Blob([JSON.stringify({ cfg, sourceName }, null, 2)], { type: "application/json" }), "bezier-settings.json");
    setStatus("Saved settings .json");
  }

  function pickMime(preferMp4: boolean): string {
    const mp4 = ["video/mp4;codecs=avc1.42E01E", "video/mp4;codecs=avc1", "video/mp4"];
    const webm = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"];
    for (const t of preferMp4 ? [...mp4, ...webm] : [...webm, ...mp4]) {
      try { if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(t)) return t; } catch { /* */ }
    }
    return "";
  }
  async function renderFrames(phases: number[], fillBg: boolean, tag: string): Promise<ImageBitmap[]> {
    const frames: ImageBitmap[] = [];
    for (let i = 0; i < phases.length; i++) {
      setStatus(`${tag} ${i + 1}/${phases.length}…`);
      const bmp = await svgToBitmap(serializeAtProgress(phases[i]), fillBg);
      if (bmp) frames.push(bmp);
      await new Promise((r) => setTimeout(r, 0));
    }
    return frames;
  }
  /** Record the reveal to MP4/WebM by pre-rendering baked frames then playing them
      into a recorded canvas (native MP4 where supported, else WebM). */
  async function recordAnimation(preferMp4: boolean) {
    if (!svgRef.current || !view) return;
    if (typeof MediaRecorder === "undefined") { setStatus("Recording isn’t supported in this browser."); return; }
    setBusy(true);
    const fps = cfg.exportFps;
    const dur = Math.max(0.4, cfg.drawDuration);
    const nFrames = Math.max(2, Math.round(dur * fps));
    try {
      const frames = await renderFrames(buildPhases(nFrames), true, "Rendering"); // video has no alpha → flatten on bg
      if (!frames.length) throw new Error("no frames");
      const cap = 1280, sc = Math.min(1, cap / Math.max(W, H));
      const cw = Math.round(W * sc), ch = Math.round(H * sc);
      const rc = document.createElement("canvas"); rc.width = cw; rc.height = ch;
      const rctx = rc.getContext("2d")!;
      const stream = rc.captureStream(fps);
      const mime = pickMime(preferMp4);
      let rec: MediaRecorder;
      try { rec = mime ? new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 12_000_000 }) : new MediaRecorder(stream); }
      catch { rec = new MediaRecorder(stream); }
      const nativeMp4 = /mp4/i.test(rec.mimeType || mime || "");
      const ext = nativeMp4 ? "mp4" : "webm";
      const chunks: BlobPart[] = [];
      rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      rec.onstop = () => {
        downloadBlob(new Blob(chunks, { type: rec.mimeType || "video/webm" }), safeName(sourceName + "-bezier") + "." + ext);
        setStatus(preferMp4 && !nativeMp4 ? "Saved .webm (this browser can’t record MP4)" : "Saved ." + ext);
        frames.forEach((f) => f.close?.());
        setBusy(false);
      };
      rec.start();
      const playDur = frames.length / fps;
      const t0 = performance.now();
      const tick = () => {
        const el = (performance.now() - t0) / 1000;
        if (el <= playDur) { rctx.drawImage(frames[Math.min(frames.length - 1, Math.floor((el / playDur) * frames.length))], 0, 0, cw, ch); requestAnimationFrame(tick); }
        else if (el <= playDur + 0.6) { rctx.drawImage(frames[frames.length - 1], 0, 0, cw, ch); requestAnimationFrame(tick); }
        else rec.stop();
      };
      rctx.drawImage(frames[0], 0, 0, cw, ch);
      setStatus("Recording…");
      requestAnimationFrame(tick);
    } catch (e) { setStatus("Recording failed: " + (e as Error).message); setBusy(false); }
  }
  /** Save the reveal as an animated (looping) GIF, with optional transparency. */
  async function saveGIF() {
    if (!svgRef.current || !view) return;
    setBusy(true);
    try {
      type GifMod = {
        GIFEncoder: () => { writeFrame: (i: Uint8Array, w: number, h: number, o: Record<string, unknown>) => void; finish: () => void; bytes: () => Uint8Array };
        quantize: (d: Uint8ClampedArray, n: number, o?: Record<string, unknown>) => number[][];
        applyPalette: (d: Uint8ClampedArray, p: number[][], f?: string) => Uint8Array;
      };
      const { GIFEncoder, quantize, applyPalette } = (await import("gifenc")) as unknown as GifMod;
      const fps = Math.min(50, cfg.exportFps);
      const dur = Math.max(0.4, cfg.drawDuration);
      const nFrames = Math.max(2, Math.round(dur * fps));
      const phases = buildPhases(nFrames);
      const transparent = cfg.exportTransparent;
      const cap = 720, sc = Math.min(1, cap / Math.max(W, H));
      const gw = Math.round(W * sc), gh = Math.round(H * sc);
      const cnv = document.createElement("canvas"); cnv.width = gw; cnv.height = gh;
      const cx = cnv.getContext("2d")!;
      const gif = GIFEncoder();
      const delay = Math.round(1000 / fps);
      for (let i = 0; i < phases.length; i++) {
        setStatus(`GIF ${i + 1}/${phases.length}…`);
        const bmp = await svgToBitmap(serializeAtProgress(phases[i]), !transparent);
        cx.clearRect(0, 0, gw, gh);
        if (bmp) cx.drawImage(bmp, 0, 0, gw, gh);
        const { data } = cx.getImageData(0, 0, gw, gh);
        if (transparent) {
          const palette = quantize(data, 256, { format: "rgba4444", oneBitAlpha: true });
          gif.writeFrame(applyPalette(data, palette, "rgba4444"), gw, gh, { palette, delay, transparent: true });
        } else {
          const palette = quantize(data, 256);
          gif.writeFrame(applyPalette(data, palette), gw, gh, { palette, delay });
        }
        bmp?.close?.();
        await new Promise((r) => setTimeout(r, 0));
      }
      gif.finish();
      downloadBlob(new Blob([gif.bytes() as unknown as BlobPart], { type: "image/gif" }), safeName(sourceName + "-bezier") + ".gif");
      setStatus("Saved .gif" + (transparent ? " (transparent)" : ""));
    } catch (e) { setStatus("GIF failed: " + (e as Error).message); }
    finally { setBusy(false); }
  }

  // ── Derived render values ─────────────────────────────────────────────────────
  const ns = cfg.nodeScale;
  const blur = (cfg.glowIntensity / 100) * (W / 90);
  const bloomW = cfg.curveWeight + (cfg.glowIntensity / 100) * (W / 50);
  const drawCls = cfg.drawOn ? "bz-draw" : undefined;
  const drawStyle = cfg.drawOn ? ({ ["--bz-dur" as string]: `${cfg.drawDuration}s` } as React.CSSProperties) : undefined;
  const pl = cfg.drawOn ? 1 : undefined;
  const anchorN = view?.anchors.length ?? 0;
  const handleN = view?.handles.length ?? 0;
  const nodeCls = cfg.pulse ? "bz-pulse" : cfg.drawOn ? "bz-pop" : undefined;
  const nodeStyle = (i: number, n: number): React.CSSProperties | undefined =>
    cfg.pulse ? { animationDelay: `${(i % 24) * 0.06}s` }
      : cfg.drawOn ? { animationDelay: `${(i / Math.max(1, n)) * cfg.drawDuration}s` } : undefined;
  const showLabels = cfg.labelMode !== "None" && anchorN <= 80;

  const ui = cfg.gridAuto ? autoUiColor(cfg.bg) : cfg.gridColor;
  const fit = size.w > 4 && size.h > 4 ? Math.min(size.w / W, size.h / H) * 0.94 : 0; // 0.94 = a little breathing room
  const dispW = W * fit, dispH = H * fit;

  // Label offset by position.
  const lp = cfg.labelOffset;
  const LABEL: Record<Cfg["labelPos"], { dx: number; dy: number; anchor: "start" | "end" | "middle" }> = {
    "Top right": { dx: lp, dy: -lp * 0.5, anchor: "start" },
    "Top left": { dx: -lp, dy: -lp * 0.5, anchor: "end" },
    "Bottom right": { dx: lp, dy: lp + cfg.labelSize * 0.6, anchor: "start" },
    "Bottom left": { dx: -lp, dy: lp + cfg.labelSize * 0.6, anchor: "end" },
    "Above": { dx: 0, dy: -lp - cfg.anchorSize * 0.4, anchor: "middle" },
    "Below": { dx: 0, dy: lp + cfg.anchorSize * 0.4 + cfg.labelSize * 0.7, anchor: "middle" },
    "Left": { dx: -(lp + cfg.anchorSize * 0.5), dy: cfg.labelSize * 0.35, anchor: "end" },
    "Right": { dx: lp + cfg.anchorSize * 0.5, dy: cfg.labelSize * 0.35, anchor: "start" },
  };
  const lab = LABEL[cfg.labelPos];

  const shape = (
    kind: AnchorShape | ControlShape, p: { x: number; y: number }, s: number,
    fill: string, stroke: string, weight: number, key: string, cls?: string, style?: React.CSSProperties, pop?: number, rot = 0,
  ) => {
    const common = { key, className: cls, style, "data-pop": pop } as Record<string, unknown>;
    const h = s / 2;
    const tr = (a: number) => (a % 360 ? `rotate(${a} ${p.x} ${p.y})` : undefined);
    if (kind === "Diamond") return <rect {...common} x={p.x - h} y={p.y - h} width={s} height={s} fill={fill} stroke={stroke} strokeWidth={weight} transform={tr(45 + rot)} />;
    if (kind === "Circle" || kind === "Ring") return <circle {...common} cx={p.x} cy={p.y} r={h} fill={fill} stroke={stroke} strokeWidth={weight} />;
    if (kind === "Triangle") { const r = h * 1.18; const pts = `${p.x},${p.y - r} ${p.x + r * 0.87},${p.y + r * 0.5} ${p.x - r * 0.87},${p.y + r * 0.5}`; return <polygon {...common} points={pts} fill={fill} stroke={stroke} strokeWidth={weight} transform={tr(rot)} />; }
    if (kind === "Cross") return <path {...common} d={`M${p.x - h} ${p.y} H${p.x + h} M${p.x} ${p.y - h} V${p.y + h}`} fill="none" stroke={stroke} strokeWidth={weight} strokeLinecap="round" transform={tr(rot)} />;
    if (kind === "Dot") return <circle {...common} cx={p.x} cy={p.y} r={h} fill={stroke} />;
    return <rect {...common} x={p.x - h} y={p.y - h} width={s} height={s} fill={fill} stroke={stroke} strokeWidth={weight} transform={tr(rot)} />; // Square
  };

  return (
    <div className="sb-studio bz-studio">
      <div className="sb-studio-stage" ref={stageRef}>
        {fit > 0 && (
          <svg ref={svgRef} className="bz-svg" width={dispW} height={dispH} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
            <defs>
              <pattern id="bz-fine" width={cfg.gridSize} height={cfg.gridSize} patternUnits="userSpaceOnUse" patternTransform={`translate(${cfg.margin} ${cfg.margin})`}>
                <path d={`M${cfg.gridSize} 0 H0 V${cfg.gridSize}`} fill="none" stroke={ui} strokeOpacity={0.18} strokeWidth={cfg.gridWeight} />
              </pattern>
              <pattern id="bz-majorp" width={cfg.gridSize * 5} height={cfg.gridSize * 5} patternUnits="userSpaceOnUse" patternTransform={`translate(${cfg.margin} ${cfg.margin})`}>
                <path d={`M${cfg.gridSize * 5} 0 H0 V${cfg.gridSize * 5}`} fill="none" stroke={ui} strokeOpacity={0.12} strokeWidth={cfg.gridWeight * 1.4} />
              </pattern>
              <pattern id="bz-dots" width={cfg.gridSize} height={cfg.gridSize} patternUnits="userSpaceOnUse" patternTransform={`translate(${cfg.margin} ${cfg.margin})`}>
                <circle cx={cfg.gridSize / 2} cy={cfg.gridSize / 2} r={cfg.gridWeight * 1.4} fill={ui} fillOpacity={0.3} />
              </pattern>
              <radialGradient id="bz-vig" cx="50%" cy="50%" r="62%">
                <stop offset="0%" stopColor={cfg.bg} stopOpacity="0" />
                <stop offset="100%" stopColor={cfg.bg} stopOpacity={cfg.vignette} />
              </radialGradient>
              <filter id="bz-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation={blur} /></filter>
              <clipPath id="bz-wipe"><rect id="bz-wipe-rect" x="0" y="0" width={W} height={H} /></clipPath>
            </defs>

            {!cfg.exportTransparent && <rect id="bz-bg" x="0" y="0" width={W} height={H} fill={cfg.bg} />}

            {cfg.grid !== "Off" && (
              <g id="bz-grid">
                {(cfg.grid === "Lines" || cfg.grid === "Lines + dots") && <>
                  <rect x="0" y="0" width={W} height={H} fill="url(#bz-fine)" />
                  <rect x="0" y="0" width={W} height={H} fill="url(#bz-majorp)" />
                </>}
                {(cfg.grid === "Dots" || cfg.grid === "Lines + dots") && <rect x="0" y="0" width={W} height={H} fill="url(#bz-dots)" />}
              </g>
            )}

            {cfg.vignette > 0 && !cfg.exportTransparent && <rect id="bz-vignette" x="0" y="0" width={W} height={H} fill="url(#bz-vig)" pointerEvents="none" />}

            {cfg.frame && <rect x={cfg.margin} y={cfg.margin} width={Math.max(0, W - 2 * cfg.margin)} height={Math.max(0, H - 2 * cfg.margin)} fill="none" stroke={ui} strokeOpacity={0.55} strokeWidth={cfg.gridWeight} />}
            {cfg.cornerTicks && (() => {
              const m = cfg.margin, L = Math.max(10, W / 70), x2 = W - m, y2 = H - m;
              const legs = [`M${m} ${m + L} V${m} H${m + L}`, `M${x2 - L} ${m} H${x2} V${m + L}`, `M${m} ${y2 - L} V${y2} H${m + L}`, `M${x2 - L} ${y2} H${x2} V${y2 - L}`];
              return <g>{legs.map((d, i) => <path key={i} d={d} fill="none" stroke={ui} strokeOpacity={0.6} strokeWidth={cfg.gridWeight} />)}</g>;
            })()}

            {view && (
              <g key={`${sourceName}:${drawNonce}`} data-anim="" clipPath="url(#bz-wipe)">
                <path id="bz-measure" ref={measureRef} d={view.d} fill="none" stroke="none" style={{ visibility: "hidden" }} />

                {cfg.showCurve && cfg.glow && cfg.glowIntensity > 0 && (
                  <path data-draw="" className={drawCls} style={drawStyle} d={view.d} fill="none" stroke={cfg.glowColor} strokeWidth={bloomW} strokeLinecap="round" strokeLinejoin="round" opacity={0.18} pathLength={pl} filter="url(#bz-glow)" />
                )}
                {cfg.showCurve && cfg.fillShape && <path d={view.d} fill={cfg.fillColor} fillOpacity={cfg.fillOpacity} stroke="none" />}
                {cfg.showCurve && (
                  <path data-draw="" className={drawCls} style={drawStyle} d={view.d} fill="none" stroke={cfg.curveColor} strokeWidth={cfg.curveWeight} strokeLinecap="round" strokeLinejoin="round" opacity={cfg.curveOpacity} pathLength={pl} />
                )}

                {cfg.showHandles && view.handles.map((hd, i) => (
                  <line key={"h" + i} data-pop={i / Math.max(1, handleN)} x1={hd.from.x} y1={hd.from.y} x2={hd.to.x} y2={hd.to.y} stroke={cfg.handleColor} strokeWidth={cfg.handleWeight * ns} strokeLinecap="round" strokeDasharray={cfg.handleDash > 0 ? `${cfg.handleDash} ${cfg.handleDash}` : undefined} opacity={cfg.handleOpacity} className={nodeCls} style={nodeStyle(i, handleN)} />
                ))}
                {cfg.showControls && view.handles.map((hd, i) => shape(cfg.controlShape, hd.to, Math.max(1, cfg.controlSize * ns), cfg.controlFill, cfg.controlStroke, Math.max(0.5, cfg.anchorWeight * 0.7), "c" + i, nodeCls, nodeStyle(i, handleN), i / Math.max(1, handleN)))}
                {cfg.showAnchors && view.anchors.map((p, i) => shape(cfg.anchorShape, p, Math.max(1, cfg.anchorSize * ns), cfg.anchorFill, cfg.anchorStroke, cfg.anchorWeight, "a" + i, nodeCls, nodeStyle(i, anchorN), i / Math.max(1, anchorN), cfg.anchorRotate))}

                <circle id="bz-tracer" cx="0" cy="0" r={Math.max(2, cfg.curveWeight * 1.7)} fill={cfg.glowColor} opacity="0" />


                {showLabels && view.anchors.map((p, i) => (
                  <text key={"l" + i} x={p.x + lab.dx} y={p.y + lab.dy} fontFamily={MONO} fontSize={cfg.labelSize} fill={cfg.labelColor} textAnchor={lab.anchor} letterSpacing="0.5">
                    {cfg.labelMode === "Index" ? "P" + String(i).padStart(2, "0") : `${Math.round(view.anchorsArt[i]?.x ?? 0)},${Math.round(view.anchorsArt[i]?.y ?? 0)}`}
                  </text>
                ))}
              </g>
            )}

            {cfg.titleBlock && view && (
              <g>
                <text x={cfg.margin + 8} y={H - cfg.margin - cfg.labelSize - 8} fontFamily={MONO} fontSize={cfg.labelSize * 0.62} fill={ui} fillOpacity={0.8} letterSpacing="1.5">{"■ ANCHOR   ○ CONTROL   — HANDLE"}</text>
                <text x={cfg.margin + 8} y={H - cfg.margin - 8} fontFamily={MONO} fontSize={cfg.labelSize * 0.62} fill={ui} fillOpacity={0.8} letterSpacing="1.5">
                  {`${cfg.caption} · ${subs?.length ?? 0} PATH · ${anchorN} ANCHOR · ${view.segCount} SEG · ${Math.round(pathLen)}u`}
                </text>
              </g>
            )}
          </svg>
        )}
        {(busy || (!view && !status)) && <SandboxLoader label={busy ? "Working" : "Loading"} />}
        {status && <div className="bz-status">{status}</div>}
      </div>

      <aside className="sb-studio-panel">
        <div className="sb-studio-title">Bezier Studio</div>

        <div className="sb-studio-sec">
          <div className="sb-studio-sec-h">Source</div>
          <div className="sb-studio-btns">
            <button className="sb-studio-btn" onClick={() => fileRef.current?.click()}>Upload .svg</button>
            <button className="sb-studio-btn" onClick={() => imgRef.current?.click()}>Trace image</button>
            <button className="sb-studio-btn" onClick={() => setPaste("")}>Paste SVG</button>
            <button className="sb-studio-btn" onClick={() => loadText(SAMPLES.Wave, "Wave")}>Reset</button>
          </div>
          <label className="sb-studio-row" style={{ marginTop: 8 }}>
            <span>Sample</span>
            <select className="sb-studio-select" value={Object.keys(SAMPLES).includes(sourceName) ? sourceName : ""} onChange={(e) => loadText(SAMPLES[e.target.value], e.target.value)}>
              {!Object.keys(SAMPLES).includes(sourceName) && <option value="">{sourceName}</option>}
              {Object.keys(SAMPLES).map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </label>
          <input ref={fileRef} type="file" accept=".svg,image/svg+xml" hidden onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => loadText(String(r.result), f.name.replace(/\.svg$/i, "")); r.readAsText(f); e.target.value = ""; }} />
          <input ref={imgRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) onTraceImage(f); e.target.value = ""; }} />
        </div>

        {SECTIONS.map((sec) => (
          <div key={sec.title} className="sb-studio-sec">
            <div className="sb-studio-sec-h">{sec.title}</div>
            {sec.fields.map((f) => {
              const v = cfg[f.key];
              if (f.kind === "toggle") return (
                <label key={f.key} className="sb-studio-row sb-studio-toggle"><span>{f.label}</span>
                  <input type="checkbox" checked={Boolean(v)} onChange={(e) => set(f.key, e.target.checked as never)} /></label>
              );
              if (f.kind === "color") return (
                <label key={f.key} className="sb-studio-row"><span>{f.label}</span>
                  <span className="bz-color-wrap">
                    <input type="text" className="bz-hex" spellCheck={false} value={String(v)}
                      onChange={(e) => set(f.key, e.target.value as never)}
                      onBlur={(e) => set(f.key, normHex(e.target.value) as never)} />
                    <input type="color" className="sb-studio-color" value={normHex(String(v))} onChange={(e) => set(f.key, e.target.value as never)} />
                  </span></label>
              );
              if (f.kind === "select") return (
                <label key={f.key} className="sb-studio-row"><span>{f.label}</span>
                  <select className="sb-studio-select" value={String(v)} onChange={(e) => set(f.key, e.target.value as never)}>
                    {f.options.map((o) => <option key={o} value={o}>{o}</option>)}</select></label>
              );
              if (f.kind === "text") return (
                <label key={f.key} className="sb-studio-row"><span>{f.label}</span>
                  <input type="text" className="sb-studio-text" value={String(v)} onChange={(e) => set(f.key, e.target.value as never)} /></label>
              );
              return (
                <label key={f.key} className="sb-studio-row"><span>{f.label}</span>
                  <span className="sb-studio-rangewrap">
                    <input type="range" min={f.min} max={f.max} step={f.step} value={Number(v)} onChange={(e) => set(f.key, parseFloat(e.target.value) as never)} />
                    <em>{Number(v).toFixed(f.step < 1 ? 2 : 0)}</em></span></label>
              );
            })}
            {sec.title === "Grid + frame" && (
              <div className="sb-studio-btns">
                <button className="sb-studio-btn" onClick={autoFitGrid}>Auto-fit</button>
                <button className="sb-studio-btn" onClick={() => stepGridCells(0.5)}>Cell ×2</button>
                <button className="sb-studio-btn" onClick={() => stepGridCells(2)}>Cell ÷2</button>
              </div>
            )}
            {sec.title === "Motion" && <div className="sb-studio-btns"><button className="sb-studio-btn" onClick={replay}>↻ Replay draw</button></div>}
            {sec.title === "Trace + export" && (
              <div className="sb-studio-btns">
                <button className="sb-studio-btn primary" onClick={saveSVG}>Save .svg</button>
                <button className="sb-studio-btn" onClick={savePNG}>Save .png</button>
                <button className="sb-studio-btn" disabled={busy} onClick={() => recordAnimation(true)}>Record .mp4</button>
                <button className="sb-studio-btn" disabled={busy} onClick={() => recordAnimation(false)}>Record .webm</button>
                <button className="sb-studio-btn" disabled={busy} onClick={saveGIF}>Save .gif</button>
                <button className="sb-studio-btn" onClick={copySVG}>Copy SVG</button>
                <button className="sb-studio-btn" onClick={saveSettings}>Settings .json</button>
              </div>
            )}
          </div>
        ))}

        {status && <div className="bz-panel-status">{status}</div>}
      </aside>

      {paste !== null && (
        <div className="sb-studio-modal" onClick={(e) => { if (e.target === e.currentTarget) setPaste(null); }}>
          <div className="sb-studio-modal-box">
            <div className="sb-studio-sec-h">Paste SVG code</div>
            <textarea autoFocus value={paste} onChange={(e) => setPaste(e.target.value)} placeholder="<svg ...>...</svg>" />
            <div className="sb-studio-btns" style={{ justifyContent: "flex-end" }}>
              <button className="sb-studio-btn" onClick={() => setPaste(null)}>Cancel</button>
              <button className="sb-studio-btn primary" onClick={() => { if (paste.trim()) loadText(paste.trim(), "pasted"); setPaste(null); }}>Load</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
