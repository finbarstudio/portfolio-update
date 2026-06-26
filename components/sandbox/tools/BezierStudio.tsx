"use client";

/**
 * Bezier Studio — paste/upload an SVG and see its bezier curves, on-curve anchors
 * and off-curve control handles drawn as a styleable "specimen plate" you can
 * export as a crisp .svg or .png for portfolio assets.
 *
 * Pure SVG/React (no three.js): the live preview IS the export, so saving = clean
 * the DOM (strip animation hooks) and serialise. Geometry is parsed by bezier-path
 * (any path/shape → absolute line/quad/cubic), with element transforms baked via
 * getScreenCTM so nested `<g transform>` logos land in one coordinate space.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  parsePath, shapeToPathData, transformSubPaths, subPathsToD,
  anchorsOf, handlesOf, boundsOf, type SubPath,
} from "./bezier-path";
import { downloadBlob, safeName } from "@/lib/sandbox/download";
import { STAR_POINTS } from "@/components/brand-star";
import { ASTERISK_POINTS } from "@/components/brand-asterisk";

// ── Built-in samples (a few with real curves so handles show immediately) ──────
const SAMPLES: Record<string, string> = {
  Wave: `<svg viewBox="0 0 200 90" xmlns="http://www.w3.org/2000/svg"><path d="M8 45 C 30 2 58 2 80 45 S 130 88 152 45 S 188 8 196 45" fill="none"/></svg>`,
  Blob: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M100 16 C 152 16 188 56 184 106 C 180 152 150 190 100 184 C 52 178 14 150 18 100 C 22 50 48 16 100 16 Z" fill="none"/></svg>`,
  Heart: `<svg viewBox="0 0 200 184" xmlns="http://www.w3.org/2000/svg"><path d="M100 170 C 18 112 18 40 64 40 C 88 40 100 60 100 60 C 100 60 112 40 136 40 C 182 40 182 112 100 170 Z" fill="none"/></svg>`,
  Star: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="${STAR_POINTS}"/></svg>`,
  Asterisk: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="${ASTERISK_POINTS}"/></svg>`,
};

const LINE = "rgba(246,239,225,0.16)";
const LINE_MAJOR = "rgba(246,239,225,0.10)";
const MONO = "'Space Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

type Cfg = {
  bg: string;
  grid: "Fine + major" | "Fine" | "Dots" | "Off"; gridSize: number;
  margin: number; padding: number; zoom: number;
  frame: boolean; cornerTicks: boolean; vignette: number;
  showCurve: boolean; curveColor: string; curveWeight: number; curveOpacity: number;
  glow: boolean; glowColor: string; glowIntensity: number;
  fillShape: boolean; fillColor: string; fillOpacity: number;
  showAnchors: boolean; showControls: boolean; showHandles: boolean; nodeScale: number;
  anchorShape: "Square" | "Diamond" | "Dot"; anchorColor: string; anchorSize: number; anchorStroke: number;
  controlShape: "Ring" | "Dot"; controlColor: string; controlSize: number;
  handleColor: string; handleWeight: number; handleDash: number; handleOpacity: number;
  labelMode: "None" | "Index" | "Coords"; labelColor: string; labelSize: number;
  titleBlock: boolean; caption: string;
  drawOn: boolean; drawDuration: number; pulse: boolean;
  exportTransparent: boolean; exportNoGrid: boolean;
};

function defaultCfg(): Cfg {
  return {
    bg: "#211E1A",
    grid: "Fine + major", gridSize: 26,
    margin: 26, padding: 34, zoom: 100,
    frame: true, cornerTicks: true, vignette: 0.35,
    showCurve: true, curveColor: "#F6EFE1", curveWeight: 1.75, curveOpacity: 1,
    glow: true, glowColor: "#E8718B", glowIntensity: 55,
    fillShape: false, fillColor: "#F6C9D1", fillOpacity: 0.08,
    showAnchors: true, showControls: true, showHandles: true, nodeScale: 1,
    anchorShape: "Square", anchorColor: "#F6EFE1", anchorSize: 8, anchorStroke: 1.5,
    controlShape: "Ring", controlColor: "#E8718B", controlSize: 6,
    handleColor: "#E8718B", handleWeight: 1, handleDash: 0, handleOpacity: 0.7,
    labelMode: "Index", labelColor: "#9C9486", labelSize: 11,
    titleBlock: true, caption: "BÉZIER SPECIMEN",
    drawOn: true, drawDuration: 1.6, pulse: false,
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
  { title: "Plate", fields: [
    { kind: "color", key: "bg", label: "Background" },
    { kind: "select", key: "grid", label: "Grid", options: ["Fine + major", "Fine", "Dots", "Off"] },
    { kind: "range", key: "gridSize", label: "Grid size", min: 8, max: 80, step: 1 },
    { kind: "range", key: "margin", label: "Frame inset", min: 8, max: 96, step: 1 },
    { kind: "range", key: "padding", label: "Padding", min: 0, max: 180, step: 1 },
    { kind: "range", key: "zoom", label: "Zoom %", min: 25, max: 300, step: 1 },
    { kind: "toggle", key: "frame", label: "Frame" },
    { kind: "toggle", key: "cornerTicks", label: "Corner ticks" },
    { kind: "range", key: "vignette", label: "Vignette", min: 0, max: 1, step: 0.05 },
  ]},
  { title: "Curve", fields: [
    { kind: "toggle", key: "showCurve", label: "Show curve" },
    { kind: "color", key: "curveColor", label: "Colour" },
    { kind: "range", key: "curveWeight", label: "Weight", min: 0.25, max: 8, step: 0.25 },
    { kind: "range", key: "curveOpacity", label: "Opacity", min: 0, max: 1, step: 0.05 },
    { kind: "toggle", key: "glow", label: "Glow" },
    { kind: "color", key: "glowColor", label: "Glow colour" },
    { kind: "range", key: "glowIntensity", label: "Glow", min: 0, max: 100, step: 1 },
    { kind: "toggle", key: "fillShape", label: "Fill shape" },
    { kind: "color", key: "fillColor", label: "Fill colour" },
    { kind: "range", key: "fillOpacity", label: "Fill opacity", min: 0, max: 1, step: 0.02 },
  ]},
  { title: "Nodes", fields: [
    { kind: "toggle", key: "showAnchors", label: "Anchors" },
    { kind: "toggle", key: "showControls", label: "Controls" },
    { kind: "toggle", key: "showHandles", label: "Handles" },
    { kind: "range", key: "nodeScale", label: "Node scale", min: 0.4, max: 2.5, step: 0.05 },
    { kind: "select", key: "anchorShape", label: "Anchor", options: ["Square", "Diamond", "Dot"] },
    { kind: "color", key: "anchorColor", label: "Anchor colour" },
    { kind: "range", key: "anchorSize", label: "Anchor size", min: 3, max: 22, step: 0.5 },
    { kind: "range", key: "anchorStroke", label: "Anchor stroke", min: 0.5, max: 4, step: 0.25 },
    { kind: "select", key: "controlShape", label: "Control", options: ["Ring", "Dot"] },
    { kind: "color", key: "controlColor", label: "Control colour" },
    { kind: "range", key: "controlSize", label: "Control size", min: 2, max: 18, step: 0.5 },
  ]},
  { title: "Handles", fields: [
    { kind: "color", key: "handleColor", label: "Colour" },
    { kind: "range", key: "handleWeight", label: "Weight", min: 0.25, max: 4, step: 0.25 },
    { kind: "range", key: "handleDash", label: "Dash", min: 0, max: 12, step: 1 },
    { kind: "range", key: "handleOpacity", label: "Opacity", min: 0, max: 1, step: 0.05 },
  ]},
  { title: "Annotation", fields: [
    { kind: "select", key: "labelMode", label: "Labels", options: ["None", "Index", "Coords"] },
    { kind: "color", key: "labelColor", label: "Label colour" },
    { kind: "range", key: "labelSize", label: "Label size", min: 7, max: 22, step: 1 },
    { kind: "toggle", key: "titleBlock", label: "Title block" },
    { kind: "text", key: "caption", label: "Caption" },
  ]},
  { title: "Motion", fields: [
    { kind: "toggle", key: "drawOn", label: "Draw-on" },
    { kind: "range", key: "drawDuration", label: "Draw secs", min: 0.4, max: 5, step: 0.1 },
    { kind: "toggle", key: "pulse", label: "Pulse nodes" },
  ]},
  { title: "Export", fields: [
    { kind: "toggle", key: "exportTransparent", label: "Transparent bg" },
    { kind: "toggle", key: "exportNoGrid", label: "Hide grid" },
  ]},
];

/** Parse an SVG string → flattened sub-paths in one coordinate space (transforms baked). */
function extractGeometry(svgText: string): SubPath[] {
  const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
  if (doc.querySelector("parsererror")) throw new Error("That isn’t valid SVG.");
  const svgEl = doc.querySelector("svg");
  if (!svgEl) throw new Error("No <svg> element found.");

  const host = document.createElement("div");
  host.style.cssText = "position:absolute;left:-99999px;top:0;width:1200px;height:1200px;opacity:0;pointer-events:none;overflow:hidden";
  const imported = document.importNode(svgEl, true) as SVGSVGElement;
  // We only need geometry — strip anything executable/foreign before this parsed,
  // user-supplied markup touches the live DOM.
  imported.querySelectorAll("script,foreignObject,a,image,use").forEach((el) => el.remove());
  document.body.appendChild(host);
  try {
    const rootInv = imported.getScreenCTM()?.inverse() ?? null;
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

export default function BezierStudio() {
  const [cfg, setCfg] = useState<Cfg>(defaultCfg);
  const [svgText, setSvgText] = useState<string>(SAMPLES.Wave);
  const [sourceName, setSourceName] = useState("Wave");
  const [subs, setSubs] = useState<SubPath[] | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [status, setStatus] = useState("");
  const [paste, setPaste] = useState<string | null>(null);
  const [drawNonce, setDrawNonce] = useState(0);
  const [pathLen, setPathLen] = useState(0);

  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const measureRef = useRef<SVGPathElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const replay = useCallback(() => setDrawNonce((n) => n + 1), []);

  // Parse whenever the source changes.
  useEffect(() => {
    try {
      setSubs(extractGeometry(svgText));
      setStatus("");
      replay();
    } catch (e) {
      setStatus((e as Error).message);
    }
  }, [svgText, replay]);

  // Track the stage size so the SVG works in true CSS pixels (crisp nodes, WYSIWYG).
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const ro = new ResizeObserver(() => {
      setSize({ w: Math.max(0, stage.clientWidth), h: Math.max(0, stage.clientHeight) });
    });
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  // Fit the artwork into the plate (margin + padding + zoom), in view pixels.
  const view = useMemo(() => {
    if (!subs || size.w < 4 || size.h < 4) return null;
    const b = boundsOf(subs);
    const m = cfg.margin + cfg.padding;
    const availW = Math.max(1, size.w - 2 * m);
    const availH = Math.max(1, size.h - 2 * m);
    const fit = Math.min(availW / b.w, availH / b.h) * (cfg.zoom / 100);
    const tx = size.w / 2 - (b.x + b.w / 2) * fit;
    const ty = size.h / 2 - (b.y + b.h / 2) * fit;
    const vsubs = transformSubPaths(subs, { a: fit, b: 0, c: 0, d: fit, e: tx, f: ty });
    return {
      d: subPathsToD(vsubs),
      anchors: anchorsOf(vsubs),
      anchorsArt: anchorsOf(subs),
      handles: handlesOf(vsubs),
      segCount: subs.reduce((n, s) => n + s.segs.length, 0),
    };
  }, [subs, size, cfg.margin, cfg.padding, cfg.zoom]);

  useEffect(() => {
    if (measureRef.current) { try { setPathLen(measureRef.current.getTotalLength()); } catch { /* */ } }
  }, [view?.d]);

  function set<K extends keyof Cfg>(key: K, value: Cfg[K]) {
    setCfg((c) => ({ ...c, [key]: value }));
  }
  function loadText(text: string, name: string) { setSvgText(text); setSourceName(name); }

  // ── Export ──────────────────────────────────────────────────────────────────
  function buildExportSvg(): SVGSVGElement | null {
    if (!svgRef.current) return null;
    const clone = svgRef.current.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.removeAttribute("class");
    clone.querySelectorAll<SVGElement>("*").forEach((el) => {
      el.removeAttribute("class");      // drop animation hooks (no external CSS in a standalone svg)
      el.removeAttribute("pathLength");
      el.style.removeProperty("animation");
      el.style.removeProperty("--bz-dur");
      el.style.removeProperty("--bz-delay");
      el.style.removeProperty("opacity");
    });
    if (cfg.exportTransparent) {
      clone.querySelector("#bz-bg")?.remove();
      clone.querySelector("#bz-vignette")?.remove();
    }
    if (cfg.exportNoGrid) clone.querySelector("#bz-grid")?.remove();
    clone.querySelector("#bz-measure")?.remove();
    return clone;
  }
  function saveSVG() {
    const clone = buildExportSvg();
    if (!clone) return;
    const str = '<?xml version="1.0" encoding="UTF-8"?>\n' + new XMLSerializer().serializeToString(clone);
    downloadBlob(new Blob([str], { type: "image/svg+xml" }), safeName(sourceName + "-bezier") + ".svg");
    setStatus("Saved .svg");
  }
  function savePNG() {
    const clone = buildExportSvg();
    if (!clone) return;
    const scale = 2;
    const w = Math.max(1, size.w) * scale, h = Math.max(1, size.h) * scale;
    const str = new XMLSerializer().serializeToString(clone);
    const url = URL.createObjectURL(new Blob([str], { type: "image/svg+xml;charset=utf-8" }));
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas"); c.width = w; c.height = h;
      const ctx = c.getContext("2d")!;
      if (!cfg.exportTransparent) { ctx.fillStyle = cfg.bg; ctx.fillRect(0, 0, w, h); }
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      c.toBlob((b) => { if (b) { downloadBlob(b, safeName(sourceName + "-bezier") + ".png"); setStatus("Saved .png (2×)"); } }, "image/png");
    };
    img.onerror = () => { URL.revokeObjectURL(url); setStatus("PNG export failed."); };
    img.src = url;
  }
  async function copySVG() {
    const clone = buildExportSvg();
    if (!clone) return;
    try { await navigator.clipboard.writeText(new XMLSerializer().serializeToString(clone)); setStatus("Copied SVG to clipboard"); }
    catch { setStatus("Clipboard blocked — use Save .svg instead."); }
  }
  function saveSettings() {
    downloadBlob(new Blob([JSON.stringify({ cfg, sourceName }, null, 2)], { type: "application/json" }), "bezier-settings.json");
    setStatus("Saved settings .json");
  }

  // ── Render helpers ──────────────────────────────────────────────────────────
  const ns = cfg.nodeScale;
  const blur = (cfg.glowIntensity / 100) * 8;
  const bloomW = cfg.curveWeight + (cfg.glowIntensity / 100) * 14;
  const drawCls = cfg.drawOn ? "bz-draw" : undefined;
  const drawStyle = cfg.drawOn ? ({ ["--bz-dur" as string]: `${cfg.drawDuration}s` } as React.CSSProperties) : undefined;
  const pl = cfg.drawOn ? 1 : undefined;
  const anchorN = view?.anchors.length ?? 0;
  const handleN = view?.handles.length ?? 0;
  const nodeCls = cfg.pulse ? "bz-pulse" : cfg.drawOn ? "bz-pop" : undefined;
  const nodeStyle = (i: number, n: number): React.CSSProperties | undefined =>
    cfg.pulse ? { animationDelay: `${(i % 24) * 0.06}s` }
      : cfg.drawOn ? { animationDelay: `${(i / Math.max(1, n)) * cfg.drawDuration}s` }
        : undefined;
  const showLabels = cfg.labelMode !== "None" && anchorN <= 80;

  return (
    <div className="sb-studio bz-studio">
      <div className="sb-studio-stage" ref={stageRef}>
        {size.w > 4 && size.h > 4 && (
          <svg ref={svgRef} className="bz-svg" width={size.w} height={size.h}
            viewBox={`0 0 ${size.w} ${size.h}`} preserveAspectRatio="xMidYMid meet">
            <defs>
              <pattern id="bz-fine" width={cfg.gridSize} height={cfg.gridSize} patternUnits="userSpaceOnUse">
                <path d={`M${cfg.gridSize} 0 H0 V${cfg.gridSize}`} fill="none" stroke={LINE} strokeWidth="1" />
              </pattern>
              <pattern id="bz-majorp" width={cfg.gridSize * 5} height={cfg.gridSize * 5} patternUnits="userSpaceOnUse">
                <path d={`M${cfg.gridSize * 5} 0 H0 V${cfg.gridSize * 5}`} fill="none" stroke={LINE_MAJOR} strokeWidth="1.25" />
              </pattern>
              <pattern id="bz-dots" width={cfg.gridSize} height={cfg.gridSize} patternUnits="userSpaceOnUse">
                <circle cx={cfg.gridSize / 2} cy={cfg.gridSize / 2} r="1" fill={LINE} />
              </pattern>
              <radialGradient id="bz-vig" cx="50%" cy="50%" r="62%">
                <stop offset="0%" stopColor={cfg.bg} stopOpacity="0" />
                <stop offset="100%" stopColor={cfg.bg} stopOpacity={cfg.vignette} />
              </radialGradient>
              <filter id="bz-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation={blur} />
              </filter>
            </defs>

            {!cfg.exportTransparent && <rect id="bz-bg" x="0" y="0" width={size.w} height={size.h} fill={cfg.bg} />}

            {cfg.grid !== "Off" && (
              <g id="bz-grid">
                {cfg.grid === "Dots"
                  ? <rect x="0" y="0" width={size.w} height={size.h} fill="url(#bz-dots)" />
                  : <>
                    <rect x="0" y="0" width={size.w} height={size.h} fill="url(#bz-fine)" />
                    {cfg.grid === "Fine + major" && <rect x="0" y="0" width={size.w} height={size.h} fill="url(#bz-majorp)" />}
                  </>}
              </g>
            )}

            {cfg.vignette > 0 && !cfg.exportTransparent && (
              <rect id="bz-vignette" x="0" y="0" width={size.w} height={size.h} fill="url(#bz-vig)" pointerEvents="none" />
            )}

            {cfg.frame && (
              <rect x={cfg.margin} y={cfg.margin} width={Math.max(0, size.w - 2 * cfg.margin)}
                height={Math.max(0, size.h - 2 * cfg.margin)} fill="none" stroke={LINE} strokeWidth="1" />
            )}
            {cfg.cornerTicks && (() => {
              const m = cfg.margin, L = 14, x2 = size.w - m, y2 = size.h - m;
              const legs = [
                `M${m} ${m + L} V${m} H${m + L}`, `M${x2 - L} ${m} H${x2} V${m + L}`,
                `M${m} ${y2 - L} V${y2} H${m + L}`, `M${x2 - L} ${y2} H${x2} V${y2 - L}`,
              ];
              return <g>{legs.map((d, i) => <path key={i} d={d} fill="none" stroke={LINE} strokeWidth="1" />)}</g>;
            })()}

            {view && (
              <g key={`${sourceName}:${drawNonce}`}>
                {/* hidden length probe — always present so the colophon stat works */}
                <path id="bz-measure" ref={measureRef} d={view.d} fill="none" stroke="none" style={{ visibility: "hidden" }} />

                {cfg.showCurve && cfg.glow && cfg.glowIntensity > 0 && (
                  <path className={drawCls} style={drawStyle} d={view.d} fill="none" stroke={cfg.glowColor}
                    strokeWidth={bloomW} strokeLinecap="round" strokeLinejoin="round" opacity={0.18}
                    pathLength={pl} filter="url(#bz-glow)" />
                )}
                {cfg.showCurve && cfg.fillShape && (
                  <path d={view.d} fill={cfg.fillColor} fillOpacity={cfg.fillOpacity} stroke="none" />
                )}
                {cfg.showCurve && (
                  <path className={drawCls} style={drawStyle} d={view.d} fill="none" stroke={cfg.curveColor}
                    strokeWidth={cfg.curveWeight} strokeLinecap="round" strokeLinejoin="round"
                    opacity={cfg.curveOpacity} pathLength={pl} />
                )}

                {cfg.showHandles && view.handles.map((h, i) => (
                  <line key={"h" + i} x1={h.from.x} y1={h.from.y} x2={h.to.x} y2={h.to.y}
                    stroke={cfg.handleColor} strokeWidth={cfg.handleWeight * ns} strokeLinecap="round"
                    strokeDasharray={cfg.handleDash > 0 ? `${cfg.handleDash} ${cfg.handleDash}` : undefined}
                    opacity={cfg.handleOpacity} className={nodeCls} style={nodeStyle(i, handleN)} />
                ))}

                {cfg.showControls && view.handles.map((h, i) => {
                  const r = Math.max(0.5, (cfg.controlSize * ns) / 2);
                  return cfg.controlShape === "Ring"
                    ? <circle key={"c" + i} cx={h.to.x} cy={h.to.y} r={r} fill={cfg.bg} stroke={cfg.controlColor}
                        strokeWidth={1.25} className={nodeCls} style={nodeStyle(i, handleN)} />
                    : <circle key={"c" + i} cx={h.to.x} cy={h.to.y} r={r} fill={cfg.controlColor}
                        className={nodeCls} style={nodeStyle(i, handleN)} />;
                })}

                {cfg.showAnchors && view.anchors.map((p, i) => {
                  const s = Math.max(1, cfg.anchorSize * ns);
                  if (cfg.anchorShape === "Dot")
                    return <circle key={"a" + i} cx={p.x} cy={p.y} r={s / 2} fill={cfg.anchorColor}
                      className={nodeCls} style={nodeStyle(i, anchorN)} />;
                  return <rect key={"a" + i} x={p.x - s / 2} y={p.y - s / 2} width={s} height={s}
                    fill={cfg.bg} stroke={cfg.anchorColor} strokeWidth={cfg.anchorStroke}
                    transform={cfg.anchorShape === "Diamond" ? `rotate(45 ${p.x} ${p.y})` : undefined}
                    className={nodeCls} style={nodeStyle(i, anchorN)} />;
                })}

                {showLabels && view.anchors.map((p, i) => (
                  <text key={"l" + i} x={p.x + 9} y={p.y - 7} fontFamily={MONO} fontSize={cfg.labelSize}
                    fill={cfg.labelColor} letterSpacing="0.5" style={{ textTransform: "uppercase" }}>
                    {cfg.labelMode === "Index"
                      ? "P" + String(i).padStart(2, "0")
                      : `${Math.round(view.anchorsArt[i]?.x ?? 0)},${Math.round(view.anchorsArt[i]?.y ?? 0)}`}
                  </text>
                ))}
              </g>
            )}

            {cfg.titleBlock && view && (
              <g>
                <text x={cfg.margin + 4} y={size.h - cfg.margin - 22} fontFamily={MONO} fontSize="11"
                  fill={cfg.labelColor} letterSpacing="1.4">{"■ ANCHOR   ○ CONTROL   — HANDLE"}</text>
                <text x={cfg.margin + 4} y={size.h - cfg.margin - 8} fontFamily={MONO} fontSize="11"
                  fill={cfg.labelColor} letterSpacing="1.4">
                  {`${cfg.caption} · ${subs?.length ?? 0} PATH · ${anchorN} ANCHOR · ${view.segCount} SEG · ${Math.round(pathLen)}u`}
                </text>
              </g>
            )}
          </svg>
        )}
        {status && <div className="bz-status">{status}</div>}
      </div>

      <aside className="sb-studio-panel">
        <div className="sb-studio-title">Bezier Studio</div>

        <div className="sb-studio-sec">
          <div className="sb-studio-sec-h">Source SVG</div>
          <div className="sb-studio-btns">
            <button className="sb-studio-btn" onClick={() => fileRef.current?.click()}>Upload .svg</button>
            <button className="sb-studio-btn" onClick={() => setPaste("")}>Paste SVG</button>
            <button className="sb-studio-btn" onClick={() => loadText(SAMPLES.Wave, "Wave")}>Reset</button>
          </div>
          <label className="sb-studio-row" style={{ marginTop: 8 }}>
            <span>Sample</span>
            <select className="sb-studio-select" value={Object.keys(SAMPLES).includes(sourceName) ? sourceName : ""}
              onChange={(e) => loadText(SAMPLES[e.target.value], e.target.value)}>
              {!Object.keys(SAMPLES).includes(sourceName) && <option value="">{sourceName}</option>}
              {Object.keys(SAMPLES).map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </label>
          <input ref={fileRef} type="file" accept=".svg,image/svg+xml" hidden onChange={(e) => {
            const file = e.target.files?.[0]; if (!file) return;
            const r = new FileReader();
            r.onload = () => loadText(String(r.result), file.name.replace(/\.svg$/i, ""));
            r.readAsText(file); e.target.value = "";
          }} />
        </div>

        {SECTIONS.map((sec) => (
          <div key={sec.title} className="sb-studio-sec">
            <div className="sb-studio-sec-h">{sec.title}</div>
            {sec.fields.map((f) => {
              const v = cfg[f.key];
              if (f.kind === "toggle") return (
                <label key={f.key} className="sb-studio-row sb-studio-toggle">
                  <span>{f.label}</span>
                  <input type="checkbox" checked={Boolean(v)} onChange={(e) => set(f.key, e.target.checked as never)} />
                </label>
              );
              if (f.kind === "color") return (
                <label key={f.key} className="sb-studio-row">
                  <span>{f.label}</span>
                  <input type="color" className="sb-studio-color" value={String(v)} onChange={(e) => set(f.key, e.target.value as never)} />
                </label>
              );
              if (f.kind === "select") return (
                <label key={f.key} className="sb-studio-row">
                  <span>{f.label}</span>
                  <select className="sb-studio-select" value={String(v)} onChange={(e) => set(f.key, e.target.value as never)}>
                    {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </label>
              );
              if (f.kind === "text") return (
                <label key={f.key} className="sb-studio-row">
                  <span>{f.label}</span>
                  <input type="text" className="sb-studio-text" value={String(v)} onChange={(e) => set(f.key, e.target.value as never)} />
                </label>
              );
              return (
                <label key={f.key} className="sb-studio-row">
                  <span>{f.label}</span>
                  <span className="sb-studio-rangewrap">
                    <input type="range" min={f.min} max={f.max} step={f.step} value={Number(v)}
                      onChange={(e) => set(f.key, parseFloat(e.target.value) as never)} />
                    <em>{Number(v).toFixed(f.step < 1 ? 2 : 0)}</em>
                  </span>
                </label>
              );
            })}
            {sec.title === "Motion" && (
              <div className="sb-studio-btns"><button className="sb-studio-btn" onClick={replay}>↻ Replay draw</button></div>
            )}
            {sec.title === "Export" && (
              <div className="sb-studio-btns">
                <button className="sb-studio-btn primary" onClick={saveSVG}>Save .svg</button>
                <button className="sb-studio-btn" onClick={savePNG}>Save .png</button>
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
