"use client";

/**
 * Asterisk Studio — sandbox studio shell. Mounts the framework-agnostic engine
 * (engine.ts) to a canvas and drives it with native, sandbox-styled controls +
 * a keyframe timeline (rebuilt from scratch to match the site, no lil-gui).
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  createAsteriskEngine, defaultConfig, PRESETS,
  type AsteriskEngine, type Config,
} from "./engine";

type Sync = "material" | "fx" | "geo" | "zoom" | "preset" | "none";
type Field =
  | { kind: "range"; key: keyof Config; label: string; min: number; max: number; step: number; sync: Sync; offAuto?: boolean }
  | { kind: "color"; key: keyof Config; label: string; sync: Sync }
  | { kind: "toggle"; key: keyof Config; label: string; sync: Sync }
  | { kind: "select"; key: keyof Config; label: string; options: string[]; sync: Sync };

const SECTIONS: { title: string; fields: Field[] }[] = [
  { title: "Canvas", fields: [
    { kind: "select", key: "preset", label: "Size", options: Object.keys(PRESETS), sync: "preset" },
    { kind: "color", key: "bg", label: "Background", sync: "material" },
  ]},
  { title: "Shape", fields: [
    { kind: "color", key: "shapeColor", label: "Colour", sync: "material" },
    { kind: "range", key: "metalness", label: "Metalness", min: 0, max: 1, step: 0.01, sync: "material" },
    { kind: "range", key: "roughness", label: "Roughness", min: 0, max: 1, step: 0.01, sync: "material" },
    { kind: "range", key: "depth", label: "Depth", min: 1, max: 60, step: 1, sync: "geo" },
    { kind: "range", key: "bevelAmount", label: "Bevel", min: 0, max: 6, step: 0.05, sync: "geo" },
    { kind: "toggle", key: "wireframe", label: "Wireframe", sync: "material" },
    { kind: "range", key: "iridescent", label: "Iridescent", min: 0, max: 1, step: 0.01, sync: "material" },
  ]},
  { title: "Motion", fields: [
    { kind: "toggle", key: "autoRotate", label: "Auto rotate", sync: "none" },
    { kind: "range", key: "rotSpeedX", label: "Spin X", min: -3, max: 3, step: 0.05, sync: "none" },
    { kind: "range", key: "rotSpeedY", label: "Spin Y", min: -3, max: 3, step: 0.05, sync: "none" },
    { kind: "range", key: "rotSpeedZ", label: "Spin Z", min: -3, max: 3, step: 0.05, sync: "none" },
    { kind: "range", key: "wobble", label: "Wobble", min: 0, max: 1, step: 0.01, sync: "none" },
  ]},
  { title: "Transform", fields: [
    { kind: "range", key: "rotX", label: "Rotate X°", min: -180, max: 180, step: 1, sync: "none", offAuto: true },
    { kind: "range", key: "rotY", label: "Rotate Y°", min: -180, max: 180, step: 1, sync: "none", offAuto: true },
    { kind: "range", key: "rotZ", label: "Rotate Z°", min: -180, max: 180, step: 1, sync: "none", offAuto: true },
    { kind: "range", key: "posX", label: "Move X", min: -200, max: 200, step: 1, sync: "none" },
    { kind: "range", key: "posY", label: "Move Y", min: -200, max: 200, step: 1, sync: "none" },
    { kind: "range", key: "zoom", label: "Zoom (dist)", min: 80, max: 600, step: 1, sync: "zoom" },
  ]},
  { title: "Effects", fields: [
    { kind: "range", key: "bloom", label: "Bloom / glow", min: 0, max: 3, step: 0.01, sync: "fx" },
    { kind: "range", key: "glass", label: "Glass", min: 0, max: 3, step: 0.01, sync: "fx" },
    { kind: "range", key: "ripple", label: "Ripple", min: 0, max: 3, step: 0.01, sync: "fx" },
    { kind: "range", key: "rippleSpeed", label: "Ripple speed", min: 0, max: 5, step: 0.05, sync: "fx" },
    { kind: "range", key: "pixelate", label: "Pixelate", min: 0, max: 40, step: 1, sync: "fx" },
    { kind: "range", key: "chroma", label: "Chromatic", min: 0, max: 5, step: 0.01, sync: "fx" },
    { kind: "range", key: "scanlines", label: "Scanlines", min: 0, max: 1, step: 0.01, sync: "fx" },
    { kind: "range", key: "vignette", label: "Vignette", min: 0, max: 1, step: 0.01, sync: "fx" },
    { kind: "range", key: "grain", label: "Grain", min: 0, max: 0.3, step: 0.005, sync: "fx" },
    { kind: "range", key: "hueShift", label: "Hue shift", min: -3.14, max: 3.14, step: 0.01, sync: "fx" },
    { kind: "range", key: "twist", label: "Twist", min: -2, max: 2, step: 0.01, sync: "fx" },
    { kind: "range", key: "kaleidoscope", label: "Kaleidoscope", min: 0, max: 12, step: 1, sync: "fx" },
    { kind: "range", key: "halftone", label: "Halftone", min: 0, max: 20, step: 1, sync: "fx" },
  ]},
  { title: "Export", fields: [
    { kind: "range", key: "duration", label: "Video secs", min: 1, max: 30, step: 1, sync: "none" },
    { kind: "range", key: "fps", label: "FPS", min: 24, max: 60, step: 1, sync: "none" },
    { kind: "toggle", key: "transparentBg", label: "Transparent bg", sync: "material" },
  ]},
];

export default function AsteriskStudio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<AsteriskEngine | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragKey = useRef(-1);
  const scrubbing = useRef(false);

  const [, setTick] = useState(0);
  const [status, setStatus] = useState("");
  const [paste, setPaste] = useState<string | null>(null);
  const rerender = useCallback(() => setTick((t) => (t + 1) % 1e9), []);

  useEffect(() => {
    if (!canvasRef.current || !stageRef.current) return;
    const eng = createAsteriskEngine(canvasRef.current, stageRef.current, {
      onStatus: setStatus,
      onSync: rerender,
    });
    engineRef.current = eng;
    // Drive the playhead + per-frame slider refresh without thrashing React.
    let raf = 0, last = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const tl = eng.timeline;
      if (playheadRef.current) playheadRef.current.style.left = (tl.time / tl.duration * 100) + "%";
      if (now - last > 90 && (tl.playing || eng.config.autoRotate === false)) { last = now; rerender(); }
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); eng.dispose(); engineRef.current = null; };
  }, [rerender]);

  const eng = engineRef.current;
  const cfg = eng ? eng.config : defaultConfig();
  const tl = eng?.timeline;

  function commit(f: Field, value: number | string | boolean) {
    if (!eng) return;
    (eng.config as Record<string, unknown>)[f.key as string] = value;
    if ((f as { offAuto?: boolean }).offAuto && eng.config.autoRotate) eng.config.autoRotate = false;
    if (f.sync === "material") eng.syncMaterial();
    else if (f.sync === "fx") eng.syncFX();
    else if (f.sync === "geo") eng.buildShape();
    else if (f.sync === "zoom") eng.applyZoomFromConfig();
    else if (f.sync === "preset") eng.applyPreset();
    eng.autoKey();
    rerender();
  }

  function onTrackPointer(e: React.PointerEvent) {
    if (dragKey.current >= 0 || !eng || !trackRef.current) return;
    scrubbing.current = true;
    const r = trackRef.current.getBoundingClientRect();
    eng.setTime(((e.clientX - r.left) / r.width) * eng.timeline.duration);
  }
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const eng = engineRef.current; if (!eng || !trackRef.current) return;
      const r = trackRef.current.getBoundingClientRect();
      const f = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      if (dragKey.current >= 0) {
        const k = eng.timeline.keys[dragKey.current];
        if (k) { eng.setSelectedKeyTime(f * eng.timeline.duration); dragKey.current = eng.timeline.selected; }
      } else if (scrubbing.current) eng.setTime(f * eng.timeline.duration);
    };
    const up = () => { dragKey.current = -1; scrubbing.current = false; };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
  }, []);

  const dur = tl?.duration ?? 6;
  const step = dur <= 8 ? 1 : dur <= 20 ? 2 : 5;
  const ticks: number[] = [];
  for (let t = 0; t <= dur + 1e-6; t += step) ticks.push(t);

  return (
    <div className="sb-studio">
      <div className="sb-studio-stage" ref={stageRef}>
        <canvas ref={canvasRef} className="sb-studio-canvas" />
      </div>

      <aside className="sb-studio-panel">
        <div className="sb-studio-title">Asterisk Studio</div>

        <div className="sb-studio-sec">
          <div className="sb-studio-sec-h">Source SVG</div>
          <div className="sb-studio-btns">
            <button className="sb-studio-btn" onClick={() => fileRef.current?.click()}>Upload .svg</button>
            <button className="sb-studio-btn" onClick={() => setPaste("")}>Paste SVG</button>
            <button className="sb-studio-btn" onClick={() => eng?.resetToAsterisk()}>Reset</button>
          </div>
          <input ref={fileRef} type="file" accept=".svg,image/svg+xml" hidden onChange={(e) => {
            const file = e.target.files?.[0]; if (!file) return;
            const r = new FileReader(); r.onload = () => eng?.loadSVG(String(r.result)); r.readAsText(file);
            e.target.value = "";
          }} />
        </div>

        {SECTIONS.map((sec) => (
          <div key={sec.title} className="sb-studio-sec">
            <div className="sb-studio-sec-h">{sec.title}</div>
            {sec.fields.map((f) => {
              const v = (cfg as Record<string, unknown>)[f.key as string];
              if (f.kind === "toggle") return (
                <label key={f.key as string} className="sb-studio-row sb-studio-toggle">
                  <span>{f.label}</span>
                  <input type="checkbox" checked={Boolean(v)} onChange={(e) => commit(f, e.target.checked)} />
                </label>
              );
              if (f.kind === "color") return (
                <label key={f.key as string} className="sb-studio-row">
                  <span>{f.label}</span>
                  <input type="color" value={String(v)} className="sb-studio-color" onChange={(e) => commit(f, e.target.value)} />
                </label>
              );
              if (f.kind === "select") return (
                <label key={f.key as string} className="sb-studio-row">
                  <span>{f.label}</span>
                  <select value={String(v)} className="sb-studio-select" onChange={(e) => commit(f, e.target.value)}>
                    {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </label>
              );
              return (
                <label key={f.key as string} className="sb-studio-row">
                  <span>{f.label}</span>
                  <span className="sb-studio-rangewrap">
                    <input type="range" min={f.min} max={f.max} step={f.step} value={Number(v)} onChange={(e) => commit(f, parseFloat(e.target.value))} />
                    <em>{Number(v).toFixed(f.step < 1 ? 2 : 0)}</em>
                  </span>
                </label>
              );
            })}
            {sec.title === "Transform" && (
              <div className="sb-studio-btns"><button className="sb-studio-btn" onClick={() => eng?.resetTransform()}>Reset position / rotation</button></div>
            )}
            {sec.title === "Export" && (
              <div className="sb-studio-btns">
                <button className="sb-studio-btn" onClick={() => eng?.recordVideo(false)}>Record .webm</button>
                <button className="sb-studio-btn" onClick={() => eng?.recordVideo(true)}>Record .mp4</button>
                <button className="sb-studio-btn" onClick={() => eng?.savePNG()}>Save .png</button>
                <button className="sb-studio-btn" onClick={() => eng?.exportCode()}>Embed code</button>
                <button className="sb-studio-btn" onClick={() => eng?.exportSettings()}>Settings .json</button>
              </div>
            )}
          </div>
        ))}
      </aside>

      <div className="sb-studio-timeline">
        <div className="sb-tl-controls">
          <button className="sb-studio-btn primary" onClick={() => eng?.togglePlay()}>{tl?.playing ? "Pause" : "Play"}</button>
          <button className="sb-studio-btn" onClick={() => eng?.addKeyframe()}>◆ Add key</button>
          <button className="sb-studio-btn" onClick={() => eng?.deleteSelectedKey()}>Delete</button>
          <button className="sb-studio-btn" onClick={() => eng?.clearKeys()}>Clear</button>
          <label className="sb-tl-check"><input type="checkbox" checked={Boolean(tl?.drive)} onChange={(e) => eng?.setDrive(e.target.checked)} />Drive scene</label>
          <label className="sb-tl-check"><input type="checkbox" checked={Boolean(tl?.xform)} onChange={(e) => eng?.setXform(e.target.checked)} />Keyframe rotation</label>
          <label className="sb-tl-check"><input type="checkbox" checked={tl?.loop ?? true} onChange={(e) => { if (eng) { eng.timeline.loop = e.target.checked; rerender(); } }} />Loop</label>
          <span className="sb-tl-spacer" />
          <label className="sb-tl-num">Dur <input type="number" min={1} max={30} value={dur} onChange={(e) => eng?.setDuration(parseFloat(e.target.value))} /></label>
          <label className="sb-tl-num">Time <input type="number" min={0} max={dur} step={0.1} value={tl ? +tl.time.toFixed(2) : 0} onChange={(e) => eng?.setTime(parseFloat(e.target.value))} /></label>
        </div>
        <div className="sb-tl-track" ref={trackRef} onPointerDown={onTrackPointer}>
          {ticks.map((t) => (
            <div key={t} className="sb-tl-tick" style={{ left: (t / dur * 100) + "%" }}><span>{t}s</span></div>
          ))}
          {tl?.keys.map((k, i) => (
            <div
              key={i}
              className={"sb-tl-key" + (i === tl.selected ? " selected" : "")}
              style={{ left: (k.t / dur * 100) + "%" }}
              title={k.t.toFixed(2) + "s"}
              onPointerDown={(e) => { e.stopPropagation(); eng?.selectKey(i); dragKey.current = i; }}
            />
          ))}
          <div className="sb-tl-playhead" ref={playheadRef} />
        </div>
      </div>

      <div className="sb-studio-status">{status}</div>

      {paste !== null && (
        <div className="sb-studio-modal" onClick={(e) => { if (e.target === e.currentTarget) setPaste(null); }}>
          <div className="sb-studio-modal-box">
            <div className="sb-studio-sec-h">Paste SVG code</div>
            <textarea autoFocus value={paste} onChange={(e) => setPaste(e.target.value)} placeholder="<svg ...>...</svg>" />
            <div className="sb-studio-btns" style={{ justifyContent: "flex-end" }}>
              <button className="sb-studio-btn" onClick={() => setPaste(null)}>Cancel</button>
              <button className="sb-studio-btn primary" onClick={() => { if (paste.trim()) eng?.loadSVG(paste.trim()); setPaste(null); }}>Load</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
