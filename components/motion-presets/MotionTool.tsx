"use client";

import { useEffect, useRef, useState } from "react";
import {
  BASE_LOOK,
  CANVAS_MAX,
  CANVAS_MIN,
  CANVAS_SIZES,
  CARD_SHAPES,
  MOTION_KEYS,
  MOTION_RANGES,
  PRESETS,
  adjustmentFor,
  applyAdjustments,
  canvasSide,
  parseSetup,
  ratioPart,
  type Adjustments,
  type Look,
  type MotionKey,
  type Preset,
  type SavedSetup,
} from "./engine";
import { createRenderer, type MediaItem, type Renderer, type Scene } from "./renderer";

interface Thumb {
  id: number;
  url: string;
  isVideo: boolean;
}

/** Presets grouped under their layout's name, in catalogue order. */
const GROUPS = PRESETS.reduce<{ title: string; presets: Preset[] }[]>((groups, preset) => {
  const title = preset.name.replace(/ \d+$/, "");
  const last = groups[groups.length - 1];
  if (last?.title === title) last.presets.push(preset);
  else groups.push({ title, presets: [preset] });
  return groups;
}, []);

const RECORDING_TYPES = ["video/mp4;codecs=avc1.640033", "video/mp4", "video/webm;codecs=vp9", "video/webm"];

/** A numbered colour card, shown until the first upload. */
function placeholder(renderer: Renderer, index: number): MediaItem {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const hue = (index * 47 + 200) % 360;
    const fill = ctx.createLinearGradient(0, 0, 512, 512);
    fill.addColorStop(0, `hsl(${hue} 70% 62%)`);
    fill.addColorStop(1, `hsl(${(hue + 60) % 360} 70% 38%)`);
    ctx.fillStyle = fill;
    ctx.fillRect(0, 0, 512, 512);
    ctx.fillStyle = "#fffc";
    ctx.font = "600 150px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(index + 1).padStart(2, "0"), 256, 268);
  }
  return { id: -1 - index, texture: renderer.texture(canvas, true), aspect: 1 };
}

/** Big photos are drawn down to 2048px so 60 of them still fit on the GPU. */
function shrink(image: HTMLImageElement): TexImageSource {
  const longest = Math.max(image.naturalWidth, image.naturalHeight);
  if (longest <= 2048) return image;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round((image.naturalWidth * 2048) / longest);
  canvas.height = Math.round((image.naturalHeight * 2048) / longest);
  canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function loadFile(renderer: Renderer, file: File, id: number): Promise<MediaItem> {
  const url = URL.createObjectURL(file);
  return new Promise((resolve, reject) => {
    const fail = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Could not read ${file.name}.`));
    };
    if (file.type.startsWith("video/")) {
      const video = document.createElement("video");
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.onloadeddata = () => {
        void video.play();
        resolve({ id, texture: renderer.texture(video, false), aspect: video.videoWidth / video.videoHeight, video, url });
      };
      video.onerror = fail;
      video.src = url;
    } else {
      const image = new Image();
      image.onload = () =>
        resolve({ id, texture: renderer.texture(shrink(image), true), aspect: image.naturalWidth / image.naturalHeight, url });
      image.onerror = fail;
      image.src = url;
    }
  });
}

function discard(renderer: Renderer, items: MediaItem[]) {
  for (const item of items) {
    renderer.deleteTexture(item.texture);
    item.video?.pause();
    if (item.url) URL.revokeObjectURL(item.url);
  }
}

function download(blob: Blob, name: string) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 10_000);
}

/** A number box that only commits a finished value, so typing "2000" never passes through "2". */
function NumberField({ label, value, onCommit }: { label: string; value: number; onCommit: (value: number) => void }) {
  const [text, setText] = useState(String(value));
  const commit = () => {
    const parsed = Number(text);
    if (text.trim() !== "" && Number.isFinite(parsed) && parsed > 0) onCommit(parsed);
    else setText(String(value));
  };
  return (
    <label className="mp-field">
      {label}
      <input
        type="text"
        inputMode="decimal"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
        }}
      />
    </label>
  );
}

export default function MotionTool() {
  const [preset, setPreset] = useState<Preset>(PRESETS[0]);
  // What the sliders have been moved by, measured against each preset's own
  // defaults, so a taste for slower, bouncier or tighter follows you around.
  const [adjustments, setAdjustments] = useState<Adjustments>({});
  const [look, setLook] = useState<Look>(BASE_LOOK);
  const [thumbs, setThumbs] = useState<Thumb[]>([]);
  const [status, setStatus] = useState("");
  const [exporting, setExporting] = useState(false);
  const [unsupported, setUnsupported] = useState(false);
  const [dragging, setDragging] = useState(false);

  const motion = applyAdjustments(preset, adjustments);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const mediaRef = useRef<MediaItem[]>([]);
  const placeholdersRef = useRef(true);
  const sceneRef = useRef<Omit<Scene, "media">>({ preset, motion, look });
  const loopStartRef = useRef(0);
  const nextIdRef = useRef(0);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const setupInputRef = useRef<HTMLInputElement>(null);

  // The draw loop reads the latest settings without restarting.
  useEffect(() => {
    sceneRef.current = { preset, motion, look };
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = createRenderer(canvas);
    if (!renderer) {
      setUnsupported(true);
      return;
    }
    rendererRef.current = renderer;
    mediaRef.current = Array.from({ length: 8 }, (_, index) => placeholder(renderer, index));
    placeholdersRef.current = true;
    loopStartRef.current = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const { duration } = sceneRef.current.look;
      renderer.draw(((now - loopStartRef.current) / 1000) % duration, { ...sceneRef.current, media: mediaRef.current });
      frame = requestAnimationFrame(tick);
    });
    return () => {
      cancelAnimationFrame(frame);
      discard(renderer, mediaRef.current);
      mediaRef.current = [];
      rendererRef.current = null;
    };
  }, []);

  const syncThumbs = () =>
    setThumbs(
      placeholdersRef.current
        ? []
        : mediaRef.current.flatMap((item) => (item.url ? [{ id: item.id, url: item.url, isVideo: Boolean(item.video) }] : [])),
    );

  async function addFiles(files: FileList | null) {
    const renderer = rendererRef.current;
    if (!renderer || !files) return;
    const wanted = [...files].filter((file) => file.type.startsWith("image/") || file.type.startsWith("video/"));
    if (!wanted.length) return;
    const results = await Promise.allSettled(wanted.map((file) => loadFile(renderer, file, nextIdRef.current++)));
    const loaded = results.flatMap((result) => (result.status === "fulfilled" ? [result.value] : []));
    const failed = results.flatMap((result) => (result.status === "rejected" ? [String((result.reason as Error).message)] : []));
    if (rendererRef.current !== renderer) return discard(renderer, loaded); // left the page while loading
    if (loaded.length && placeholdersRef.current) {
      discard(renderer, mediaRef.current);
      mediaRef.current = [];
      placeholdersRef.current = false;
    }
    mediaRef.current.push(...loaded);
    syncThumbs();
    setStatus(failed.join(" "));
  }

  function removeMedia(id: number) {
    const renderer = rendererRef.current;
    if (!renderer) return;
    discard(renderer, mediaRef.current.filter((item) => item.id === id));
    mediaRef.current = mediaRef.current.filter((item) => item.id !== id);
    if (!mediaRef.current.length) {
      mediaRef.current = Array.from({ length: 8 }, (_, index) => placeholder(renderer, index));
      placeholdersRef.current = true;
    }
    syncThumbs();
  }

  function choosePreset(next: Preset) {
    setPreset(next);
    loopStartRef.current = performance.now();
  }

  const setMotion = (key: MotionKey, value: number) =>
    setAdjustments((current) => ({ ...current, [key]: adjustmentFor(key, value, preset) }));
  const patchLook = (patch: Partial<Look>) => setLook((current) => ({ ...current, ...patch }));

  function saveSetup() {
    const setup: SavedSetup = { app: "motion-presets", version: 1, preset: preset.name, motion, look };
    download(new Blob([JSON.stringify(setup, null, 2)], { type: "application/json" }), `${preset.name.toLowerCase().replace(" ", "-")}-setup.json`);
    setStatus("Setup saved. It holds the settings, not the media.");
  }

  async function loadSetup(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    const parsed = parseSetup(await file.text());
    if (typeof parsed === "string") return setStatus(parsed);
    const loaded: Adjustments = {};
    for (const key of MOTION_KEYS) loaded[key] = adjustmentFor(key, parsed.motion[key], parsed.preset);
    setAdjustments(loaded);
    setLook(parsed.look);
    choosePreset(parsed.preset);
    setStatus(`Loaded ${parsed.preset.name}.`);
  }

  // Records one loop as it plays, so an 8 second loop takes 8 seconds to export.
  function exportVideo() {
    const canvas = canvasRef.current;
    if (!canvas || typeof MediaRecorder === "undefined") return setStatus("This browser cannot record video.");
    const type = RECORDING_TYPES.find((candidate) => MediaRecorder.isTypeSupported(candidate));
    if (!type) return setStatus("This browser cannot record video.");
    const { duration } = sceneRef.current.look;
    const name = `${sceneRef.current.preset.name.toLowerCase().replace(" ", "-")}.${type.includes("mp4") ? "mp4" : "webm"}`;
    const recorder = new MediaRecorder(canvas.captureStream(60), { mimeType: type, videoBitsPerSecond: 24_000_000 });
    const chunks: Blob[] = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size) chunks.push(event.data);
    };
    recorder.onstop = () => {
      download(new Blob(chunks, { type: type.split(";")[0] }), name);
      setExporting(false);
      setStatus(`Saved ${name}`);
    };
    recorder.onerror = () => {
      setExporting(false);
      setStatus("Recording failed.");
    };
    setExporting(true);
    setStatus(`Recording ${duration} seconds…`);
    for (const item of mediaRef.current) if (item.video) item.video.currentTime = 0;
    loopStartRef.current = performance.now();
    recorder.start();
    setTimeout(() => recorder.stop(), duration * 1000);
  }

  const adjusted = Object.keys(adjustments).length > 0;

  return (
    <div
      className="mp-tool"
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        void addFiles(event.dataTransfer.files);
      }}
    >
      <nav className="mp-panel mp-panel-left" aria-label="Presets">
        <h1>Motion presets</h1>
        {GROUPS.map((group) => (
          <section key={group.title}>
            <h2>{group.title}</h2>
            <div className="mp-presets">
              {group.presets.map((item) => (
                <button key={item.name} type="button" aria-pressed={item === preset} onClick={() => choosePreset(item)}>
                  {item.name}
                </button>
              ))}
            </div>
          </section>
        ))}
      </nav>

      <main className="mp-stage">
        {unsupported ? (
          <p>This browser cannot draw the preview. Try a current version of Chrome, Safari or Firefox.</p>
        ) : (
          <canvas ref={canvasRef} aria-label="Animation preview" style={{ aspectRatio: `${look.width} / ${look.height}` }} />
        )}
      </main>

      <aside className="mp-panel mp-panel-right" aria-label="Settings">
        <h2>Media</h2>
        <div className={dragging ? "mp-drop is-over" : "mp-drop"}>
          <button type="button" onClick={() => imageInputRef.current?.click()}>
            Add images or videos
          </button>
          <input
            ref={imageInputRef}
            className="mp-hidden"
            type="file"
            accept="image/*,video/*"
            multiple
            aria-label="Add images or videos"
            tabIndex={-1}
            onChange={(event) => {
              void addFiles(event.target.files);
              event.target.value = "";
            }}
          />
          <p>or drop files anywhere</p>
        </div>
        {thumbs.length > 0 && (
          <ul className="mp-media">
            {thumbs.map((thumb, index) => (
              <li key={thumb.id}>
                {thumb.isVideo ? <video src={thumb.url} muted /> : <img src={thumb.url} alt={`Media ${index + 1}`} />}
                <button type="button" aria-label={`Remove media ${index + 1}`} onClick={() => removeMedia(thumb.id)}>
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        <h2>Motion</h2>
        {MOTION_KEYS.map((key) => {
          const { label, min, max, step } = MOTION_RANGES[key];
          return (
            <label className="mp-row" key={key}>
              {label}
              <input type="range" min={min} max={max} step={step} value={motion[key]} onChange={(event) => setMotion(key, Number(event.target.value))} />
              <output>{step >= 1 ? motion[key] : motion[key].toFixed(2)}</output>
            </label>
          );
        })}
        <label className="mp-row">
          Loop (sec)
          <input type="range" min={3} max={120} step={1} value={look.duration} onChange={(event) => patchLook({ duration: Number(event.target.value) })} />
          <output>{look.duration}</output>
        </label>
        <button type="button" disabled={!adjusted} onClick={() => setAdjustments({})}>
          Reset motion to each preset&apos;s own
        </button>

        <h2>Canvas</h2>
        <div className="mp-choices">
          {CANVAS_SIZES.map((size) => (
            <button
              key={size.label}
              type="button"
              aria-pressed={look.width === size.width && look.height === size.height}
              onClick={() => patchLook({ width: size.width, height: size.height })}
            >
              {size.label}
            </button>
          ))}
        </div>
        <div className="mp-pair">
          <NumberField key={`w${look.width}`} label={`Width, ${CANVAS_MIN} to ${CANVAS_MAX} px`} value={look.width} onCommit={(value) => patchLook({ width: canvasSide(value) })} />
          <NumberField key={`h${look.height}`} label={`Height, ${CANVAS_MIN} to ${CANVAS_MAX} px`} value={look.height} onCommit={(value) => patchLook({ height: canvasSide(value) })} />
        </div>

        <h2>Card shape</h2>
        <div className="mp-choices">
          {CARD_SHAPES.map((shape) => (
            <button
              key={shape.label}
              type="button"
              aria-pressed={look.cardW === shape.w && look.cardH === shape.h}
              onClick={() => patchLook({ cardW: shape.w, cardH: shape.h })}
            >
              {shape.label}
            </button>
          ))}
        </div>
        <div className="mp-pair">
          <NumberField key={`cw${look.cardW}`} label="Ratio, width" value={look.cardW} onCommit={(value) => patchLook({ cardW: ratioPart(value) })} />
          <NumberField key={`ch${look.cardH}`} label="Ratio, height" value={look.cardH} onCommit={(value) => patchLook({ cardH: ratioPart(value) })} />
        </div>

        <h2>Look</h2>
        <label className="mp-row">
          Corners
          <input type="range" min={0} max={0.5} step={0.01} value={look.radius} onChange={(event) => patchLook({ radius: Number(event.target.value) })} />
          <output>{look.radius.toFixed(2)}</output>
        </label>
        <label className="mp-row">
          Background
          <input type="color" value={look.background} onChange={(event) => patchLook({ background: event.target.value })} />
        </label>

        <h2>Setup</h2>
        <div className="mp-pair">
          <button type="button" onClick={saveSetup}>
            Save setup
          </button>
          <button type="button" onClick={() => setupInputRef.current?.click()}>
            Load setup
          </button>
        </div>
        <input
          ref={setupInputRef}
          className="mp-hidden"
          type="file"
          accept="application/json,.json"
          aria-label="Load a saved setup"
          tabIndex={-1}
          onChange={(event) => {
            void loadSetup(event.target.files);
            event.target.value = "";
          }}
        />

        <h2>Export</h2>
        <button type="button" className="mp-primary" disabled={exporting || unsupported} onClick={exportVideo}>
          Export video
        </button>
        <p className="mp-status" role="status">
          {status}
        </p>
      </aside>
    </div>
  );
}
