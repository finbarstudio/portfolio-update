"use client";

import { useEffect, useRef, useState } from "react";
import {
  BASE_EASING,
  BASE_LOOK,
  CANVAS_MAX,
  CANVAS_MIN,
  CANVAS_SIZES,
  CARD_SHAPES,
  EASINGS,
  FOUR_WAY,
  HAS_FOCUS,
  HAS_RADIUS,
  MOTION_KEYS,
  PRESETS,
  SHAPE_LABEL,
  adjustmentFor,
  applyAdjustments,
  bezier,
  canvasSide,
  clamp,
  pathGrid,
  parseSetup,
  presetOptions,
  rangeFor,
  ratioPart,
  type Adjustments,
  type Bezier,
  type Direction,
  type Focus,
  type Look,
  type MotionKey,
  type Options,
  type Origin,
  type Preset,
  type SavedSetup,
  type TiltMode,
} from "./engine";
import ColourPicker from "./ColourPicker";
import { createRenderer, type MediaItem, type Renderer, type Scene } from "./renderer";

interface Thumb {
  id: number;
  url: string;
  isVideo: boolean;
}

/** Presets grouped under their family name, in catalogue order. */
const groupOf = (preset: Preset) => preset.name.replace(/ \d+$/, "");
const GROUPS = PRESETS.reduce<{ title: string; presets: Preset[] }[]>((groups, preset) => {
  const title = groupOf(preset);
  const last = groups[groups.length - 1];
  if (last?.title === title) last.presets.push(preset);
  else groups.push({ title, presets: [preset] });
  return groups;
}, []);

/** The little previews on the preset buttons: a 4 by 5 frame. */
const PREVIEW_LOOK: Look = { ...BASE_LOOK, width: 160, height: 200, background: "#1b1b1e" };
/** Shades of the grey cards that stand in for media, in previews and before the first upload. */
const GREYS = [0.82, 0.58, 0.72, 0.46, 0.9, 0.52, 0.66, 0.4];
/** Previews are redrawn a few per frame, in turn, so all of them cost little. */
const PREVIEWS_PER_FRAME = 6;

function greyCard(renderer: Renderer, index: number): MediaItem {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 4;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const level = Math.round(GREYS[index] * 255);
    ctx.fillStyle = `rgb(${level} ${level} ${level})`;
    ctx.fillRect(0, 0, 4, 4);
  }
  return { id: -1 - index, texture: renderer.texture(canvas, false), aspect: 1 };
}
const greyCards = (renderer: Renderer) => GREYS.map((_, index) => greyCard(renderer, index));

/** Shown at the foot of the preset list. Bump it when the tool changes in a way worth naming. */
const VERSION = "v2.1";

/** Finbar's Stripe payment page. Change the link here. */
const PINT_URL = "https://donate.stripe.com/cNi6oH8vP2f6eHlaoQ8N200";

const RECORDING_TYPES = ["video/mp4;codecs=avc1.640033", "video/mp4", "video/webm;codecs=vp9", "video/webm"];

/**
 * Uploads are compressed on the way in. A photo straight off a camera is some
 * 24 million pixels, about 100 MB once decoded; twelve of them held at that
 * size is what makes a page crawl. So each picture is decoded once, off the
 * main thread, drawn down to a small copy for the preview and a tiny one for
 * its thumbnail, and the decoded original is thrown away. Only the file itself
 * is kept, and an export re-reads it at full quality for as long as it records.
 */
const PREVIEW_PICTURE = 1024;
const EXPORT_PICTURE = 2560;
const THUMB_PICTURE = 160;
const PREVIEW_VIDEO = 640;
const PREVIEW_CANVAS = 1280;

/** A copy of a picture or video frame no longer than `longest` on its long side. */
function drawnDown(source: ImageBitmap | HTMLVideoElement, longest: number): HTMLCanvasElement {
  const width = source instanceof HTMLVideoElement ? source.videoWidth : source.width;
  const height = source instanceof HTMLVideoElement ? source.videoHeight : source.height;
  const ratio = Math.min(1, longest / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * ratio));
  canvas.height = Math.max(1, Math.round(height * ratio));
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  }
  return canvas;
}

const toBlob = (canvas: HTMLCanvasElement) => new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.8));

async function loadPicture(renderer: Renderer, file: File, id: number): Promise<MediaItem> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file); // decodes off the main thread, the right way up
  } catch {
    throw new Error(`Could not read ${file.name}.`);
  }
  try {
    const thumb = await toBlob(drawnDown(bitmap, THUMB_PICTURE));
    return {
      id,
      texture: renderer.texture(drawnDown(bitmap, PREVIEW_PICTURE), true),
      aspect: bitmap.width / bitmap.height,
      url: thumb ? URL.createObjectURL(thumb) : undefined,
      file,
      longest: Math.max(bitmap.width, bitmap.height),
    };
  } finally {
    bitmap.close(); // the decoded original is not kept
  }
}

/**
 * A video cannot be re-compressed in the browser in any reasonable time, but
 * what makes it heavy here is not the file: it is sending every full-size
 * frame to the GPU. So the preview draws each frame down to a small canvas
 * first, and the thumbnail is one still, not a second playing copy.
 */
function loadVideo(renderer: Renderer, file: File, id: number): Promise<MediaItem> {
  const videoUrl = URL.createObjectURL(file);
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.onloadeddata = async () => {
      video.onloadeddata = null;
      const frame = drawnDown(video, PREVIEW_VIDEO);
      const thumb = await toBlob(drawnDown(video, THUMB_PICTURE));
      void video.play();
      resolve({
        id,
        texture: renderer.texture(frame, false),
        aspect: video.videoWidth / video.videoHeight,
        video,
        frame,
        videoUrl,
        url: thumb ? URL.createObjectURL(thumb) : undefined,
      });
    };
    video.onerror = () => {
      URL.revokeObjectURL(videoUrl);
      reject(new Error(`Could not read ${file.name}.`));
    };
    video.src = videoUrl;
  });
}

const loadFile = (renderer: Renderer, file: File, id: number) => (file.type.startsWith("video/") ? loadVideo(renderer, file, id) : loadPicture(renderer, file, id));

function discard(renderer: Renderer, items: MediaItem[]) {
  for (const item of items) {
    renderer.deleteTexture(item.texture);
    item.video?.pause();
    item.video?.removeAttribute("src");
    if (item.url) URL.revokeObjectURL(item.url);
    if (item.videoUrl) URL.revokeObjectURL(item.videoUrl);
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

/** A section title with a button that puts that section back to the preset's own values. */
function Heading({ title, onReset, changed }: { title: string; onReset: () => void; changed: boolean }) {
  return (
    <div className="mp-head">
      <h2>{title}</h2>
      <button type="button" disabled={!changed} onClick={onReset} aria-label={`Reset ${title.toLowerCase()}`}>
        Reset
      </button>
    </div>
  );
}

/**
 * A slider drawn as one thick bar: the name and the value sit inside it and
 * the fill is the value. Sliders that run either side of zero fill from zero.
 */
function Slider({
  label,
  min,
  max,
  step,
  value,
  onChange,
  onReset,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  /** Double-clicking the bar puts the slider back to its default. */
  onReset: () => void;
}) {
  // While the value is being typed it is text; otherwise it shows the number.
  const [typed, setTyped] = useState<string | null>(null);
  const shown = step >= 1 ? String(value) : value.toFixed(step >= 0.1 ? 1 : 2);
  const at = (v: number) => ((clamp(v, min, max) - min) / (max - min)) * 100;
  const zero = min < 0 && max > 0 ? at(0) : 0;
  const fill = { "--from": `${Math.min(zero, at(value))}%`, "--to": `${Math.max(zero, at(value))}%` } as React.CSSProperties;
  const commit = () => {
    if (typed !== null) {
      const parsed = Number(typed);
      if (typed.trim() !== "" && Number.isFinite(parsed)) onChange(clamp(step >= 1 ? Math.round(parsed) : parsed, min, max));
    }
    setTyped(null);
  };
  return (
    <div className="mp-slider" style={fill}>
      <span>{label}</span>
      <input
        type="range"
        aria-label={label}
        title="Double-click to reset"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        onDoubleClick={onReset}
      />
      <input
        className="mp-slider-value"
        type="text"
        inputMode="decimal"
        aria-label={`${label}, typed`}
        value={typed ?? shown}
        onFocus={(event) => {
          setTyped(shown);
          event.target.select();
        }}
        onChange={(event) => setTyped(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
          if (event.key === "Escape") {
            setTyped(null);
            event.currentTarget.blur();
          }
        }}
      />
    </div>
  );
}

/** A row of mutually exclusive buttons. */
function Choice<T extends string | boolean>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="mp-choice" role="group" aria-label={label}>
      <span>{label}</span>
      <div>
        {options.map((option) => (
          <button key={String(option.value)} type="button" aria-pressed={option.value === value} onClick={() => onChange(option.value)}>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// The curve editor's drawing area: x runs 0 to 1, y runs -0.6 to 1.6 so an overshoot has room.
const PLOT = { left: 8, right: 92, top: 6, bottom: 94, yMin: -0.6, yMax: 1.6 };
const plotX = (x: number) => PLOT.left + x * (PLOT.right - PLOT.left);
const plotY = (y: number) => PLOT.bottom - ((y - PLOT.yMin) / (PLOT.yMax - PLOT.yMin)) * (PLOT.bottom - PLOT.top);

/** Drag the two handles to shape how each move speeds up, slows down and settles. */
function CurveEditor({ curve, onChange }: { curve: Bezier; onChange: (curve: Bezier) => void }) {
  const dragging = useRef<0 | 1 | null>(null);
  const [x1, y1, x2, y2] = curve;

  const moveHandle = (handle: 0 | 1, x: number, y: number) => {
    const next: Bezier = [...curve];
    next[handle * 2] = clamp(x);
    next[handle * 2 + 1] = clamp(y, PLOT.yMin, PLOT.yMax);
    onChange(next);
  };
  const fromPointer = (event: React.PointerEvent<SVGSVGElement>) => {
    if (dragging.current === null) return;
    const box = event.currentTarget.getBoundingClientRect();
    const px = ((event.clientX - box.left) / box.width) * 100;
    const py = ((event.clientY - box.top) / box.height) * 100;
    moveHandle(
      dragging.current,
      (px - PLOT.left) / (PLOT.right - PLOT.left),
      PLOT.yMin + ((PLOT.bottom - py) / (PLOT.bottom - PLOT.top)) * (PLOT.yMax - PLOT.yMin),
    );
  };
  const points = Array.from({ length: 41 }, (_, k) => `${plotX(k / 40).toFixed(2)},${plotY(bezier(curve, k / 40)).toFixed(2)}`).join(" ");
  const handles: [0 | 1, number, number, number, number][] = [
    [0, x1, y1, 0, 0],
    [1, x2, y2, 1, 1],
  ];

  return (
    <svg
      className="mp-curve"
      viewBox="0 0 100 100"
      onPointerMove={fromPointer}
      onPointerUp={() => {
        dragging.current = null;
      }}
      onPointerLeave={() => {
        dragging.current = null;
      }}
    >
      <rect x={PLOT.left} y={plotY(1)} width={PLOT.right - PLOT.left} height={plotY(0) - plotY(1)} className="mp-curve-box" />
      {handles.map(([handle, x, y, anchorX, anchorY]) => (
        <line key={`arm${handle}`} x1={plotX(anchorX)} y1={plotY(anchorY)} x2={plotX(x)} y2={plotY(y)} className="mp-curve-arm" />
      ))}
      <polyline points={points} className="mp-curve-line" />
      {handles.map(([handle, x, y]) => (
        <circle
          key={handle}
          cx={plotX(x)}
          cy={plotY(y)}
          r={4.5}
          tabIndex={0}
          role="slider"
          aria-label={handle === 0 ? "Curve start handle" : "Curve end handle"}
          aria-valuenow={Number(y.toFixed(2))}
          aria-valuemin={PLOT.yMin}
          aria-valuemax={PLOT.yMax}
          className="mp-curve-handle"
          onPointerDown={(event) => {
            dragging.current = handle;
            event.currentTarget.ownerSVGElement?.setPointerCapture(event.pointerId);
          }}
          onKeyDown={(event) => {
            const step = { ArrowLeft: [-0.05, 0], ArrowRight: [0.05, 0], ArrowUp: [0, 0.05], ArrowDown: [0, -0.05] }[event.key];
            if (!step) return;
            event.preventDefault();
            moveHandle(handle, x + step[0], y + step[1]);
          }}
        />
      ))}
    </svg>
  );
}

/** The wall of cards as a small grid: click cells in the order the camera should visit them. */
function PathGrid({ cells, cols, path, onChange }: { cells: number; cols: number; path: number[]; onChange: (path: number[]) => void }) {
  return (
    <div className="mp-path" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }} role="group" aria-label="Camera path">
      {Array.from({ length: cells }, (_, cell) => {
        const stop = path.indexOf(cell);
        return (
          <button
            key={cell}
            type="button"
            aria-pressed={stop >= 0}
            aria-label={stop >= 0 ? `Cell ${cell + 1}, stop ${stop + 1}. Remove from path` : `Cell ${cell + 1}. Add to path`}
            onClick={() => onChange(stop >= 0 ? path.filter((item) => item !== cell) : [...path, cell])}
          >
            {stop >= 0 ? stop + 1 : ""}
          </button>
        );
      })}
    </div>
  );
}

const DIRECTIONS: { value: Direction; label: string }[] = [
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
  { value: "up", label: "Up" },
  { value: "down", label: "Down" },
];
const WAYS: { value: Direction; label: string }[] = [
  { value: "left", label: "Forward" },
  { value: "right", label: "Reverse" },
];
const ORIGINS: { value: Origin; label: string }[] = [
  { value: "centre", label: "Centre" },
  { value: "up", label: "Top" },
  { value: "down", label: "Bottom" },
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
];
const TILTS: { value: TiltMode; label: string }[] = [
  { value: "off", label: "Off" },
  { value: "fan", label: "Fan" },
  { value: "uniform", label: "Uniform" },
  { value: "alternate", label: "Alternate" },
];
const ON_OFF = [
  { value: false, label: "Off" },
  { value: true, label: "On" },
];
const SCENE_KEYS: MotionKey[] = ["scale", "reach", "cardTilt", "count", "size", "gap", "radius", "shape", "turn", "spin", "fade", "offsetX", "offsetY"];
const TIMING_KEYS: MotionKey[] = ["duration", "speed", "rhythm", "stagger", "hold"];
const PACES = [
  { value: false, label: "Continuous" },
  { value: true, label: "Stepped" },
];
/** These show one card at a time, so they always move in steps. */
const ALWAYS_STEPPED = new Set(["flip", "pulse", "zoom"]);
const CAMERA_KEYS: MotionKey[] = ["tilt", "yaw", "roll", "perspective", "distance"];

export default function MotionTool() {
  const [preset, setPreset] = useState<Preset>(PRESETS[0]);
  // What the sliders have been moved by, measured against each preset's own
  // defaults, so a taste for slower, bouncier or tighter follows you around.
  const [adjustments, setAdjustments] = useState<Adjustments>({});
  // Switches the user has set. They hold across presets until reset.
  const [chosen, setChosen] = useState<Partial<Options>>({});
  const [easing, setEasing] = useState<Bezier>(BASE_EASING);
  const [path, setPath] = useState<number[]>(PRESETS[0].path ?? []);
  // Groups start folded, apart from the one holding the chosen preset.
  const [openGroups, setOpenGroups] = useState<ReadonlySet<string>>(() => new Set([groupOf(PRESETS[0])]));
  const [look, setLook] = useState<Look>(BASE_LOOK);
  const [thumbs, setThumbs] = useState<Thumb[]>([]);
  const [status, setStatus] = useState("");
  const [exporting, setExporting] = useState(false);
  const [unsupported, setUnsupported] = useState(false);
  const [dragging, setDragging] = useState(false);
  /** Set while files are being read in or made ready for an export: drives the loading screen. */
  const [loading, setLoading] = useState<{ label: string; done: number; total: number } | null>(null);

  const motion = applyAdjustments(preset, adjustments);
  const options = presetOptions(preset, chosen);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const mediaRef = useRef<MediaItem[]>([]);
  const placeholdersRef = useRef(true);
  const sceneRef = useRef<Omit<Scene, "media">>({ preset, motion, options, easing, path, look });
  const loopStartRef = useRef(0);
  const nextIdRef = useRef(0);
  /** True while an export records: the loop then draws at full size. */
  const fullSizeRef = useRef(false);
  const draggedRef = useRef<number | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const setupInputRef = useRef<HTMLInputElement>(null);
  const previewCanvases = useRef(new Map<string, HTMLCanvasElement>());
  const flowRef = useRef({ adjustments, chosen, easing });

  // The draw loop reads the latest settings without restarting.
  useEffect(() => {
    sceneRef.current = { preset, motion, options, easing, path, look };
    flowRef.current = { adjustments, chosen, easing };
  });

  // One small hidden WebGL canvas draws every preview in turn and copies each
  // onto its button: browsers allow only a handful of WebGL canvases at once.
  useEffect(() => {
    const stage = document.createElement("canvas");
    const renderer = createRenderer(stage);
    if (!renderer) return;
    const greys = greyCards(renderer);
    const visible = new Set<string>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const name = (entry.target as HTMLElement).dataset.preset;
        if (!name) continue;
        if (entry.isIntersecting) visible.add(name);
        else visible.delete(name);
      }
    });
    for (const canvas of previewCanvases.current.values()) observer.observe(canvas);
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cursor = 0;
    let frame = requestAnimationFrame(function tick(now) {
      const shown = PRESETS.filter((item) => visible.has(item.name));
      for (let n = 0; n < Math.min(PREVIEWS_PER_FRAME, shown.length); n++) {
        const item = shown[cursor++ % shown.length];
        const target = previewCanvases.current.get(item.name)?.getContext("2d");
        if (!target) continue;
        const flow = flowRef.current;
        const itemMotion = applyAdjustments(item, flow.adjustments);
        renderer.draw(still ? 1.7 : (now / 1000) % itemMotion.duration, {
          preset: item,
          motion: itemMotion,
          options: presetOptions(item, flow.chosen),
          easing: flow.easing,
          path: item.path ?? [],
          look: PREVIEW_LOOK,
          media: greys,
        });
        target.drawImage(stage, 0, 0);
      }
      frame = requestAnimationFrame(tick);
    });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      discard(renderer, greys);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = createRenderer(canvas);
    if (!renderer) {
      setUnsupported(true);
      return;
    }
    rendererRef.current = renderer;
    mediaRef.current = greyCards(renderer);
    placeholdersRef.current = true;
    loopStartRef.current = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const { duration } = sceneRef.current.motion;
      const { width, height } = sceneRef.current.look;
      const resolution = fullSizeRef.current ? 1 : Math.min(1, PREVIEW_CANVAS / Math.max(width, height));
      renderer.draw(((now - loopStartRef.current) / 1000) % duration, { ...sceneRef.current, media: mediaRef.current, resolution, fullQuality: fullSizeRef.current });
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
    // Three at a time: decoding a dozen camera photos at once would need over a gigabyte for a moment.
    const results: PromiseSettledResult<MediaItem>[] = new Array(wanted.length);
    let next = 0;
    let done = 0;
    setLoading({ label: "Preparing media", done, total: wanted.length });
    const worker = async () => {
      while (next < wanted.length) {
        const index = next++;
        const id = nextIdRef.current++;
        try {
          results[index] = { status: "fulfilled", value: await loadFile(renderer, wanted[index], id) };
        } catch (reason) {
          results[index] = { status: "rejected", reason };
        }
        setLoading({ label: "Preparing media", done: ++done, total: wanted.length });
      }
    };
    await Promise.all(Array.from({ length: Math.min(3, wanted.length) }, worker));
    setLoading(null);
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
      mediaRef.current = greyCards(renderer);
      placeholdersRef.current = true;
    }
    syncThumbs();
  }

  /** Moves one upload to another place in the order. The order is the order cards are filled in. */
  function moveMedia(id: number, to: number) {
    const from = mediaRef.current.findIndex((item) => item.id === id);
    if (from < 0 || to < 0 || to >= mediaRef.current.length || from === to) return;
    const [moved] = mediaRef.current.splice(from, 1);
    mediaRef.current.splice(to, 0, moved);
    syncThumbs();
  }

  function choosePreset(next: Preset) {
    setPreset(next);
    setPath(next.path ?? []);
    setOpenGroups((current) => (current.has(groupOf(next)) ? current : new Set([...current, groupOf(next)])));
    loopStartRef.current = performance.now();
  }

  const setMotion = (key: MotionKey, value: number) =>
    setAdjustments((current) => ({ ...current, [key]: adjustmentFor(key, value, preset) }));
  const setOption = <K extends keyof Options>(key: K, value: Options[K]) => setChosen((current) => ({ ...current, [key]: value }));
  const patchLook = (patch: Partial<Look>) => setLook((current) => ({ ...current, ...patch }));
  const changedAny = (keys: MotionKey[]) => keys.some((key) => adjustments[key] !== undefined);
  const resetKeys = (keys: MotionKey[]) => setAdjustments((current) => Object.fromEntries(Object.entries(current).filter(([key]) => !keys.includes(key as MotionKey))));
  function resetFlow() {
    setAdjustments({});
    setChosen({});
    setEasing(BASE_EASING);
    setPath(preset.path ?? []);
  }

  function saveSetup() {
    const setup: SavedSetup = { app: "motion-presets", version: 2, preset: preset.name, motion, options, easing, path, look };
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
    setChosen(parsed.options);
    setEasing(parsed.easing);
    setLook(parsed.look);
    choosePreset(parsed.preset);
    setPath(parsed.path);
    setStatus(`Loaded ${parsed.preset.name}.`);
  }

  // Records one loop as it plays, so an 8 second loop takes 8 seconds to export.
  async function exportVideo() {
    const canvas = canvasRef.current;
    if (!canvas || typeof MediaRecorder === "undefined") return setStatus("This browser cannot record video.");
    const type = RECORDING_TYPES.find((candidate) => MediaRecorder.isTypeSupported(candidate));
    if (!type) return setStatus("This browser cannot record video.");
    const { duration } = sceneRef.current.motion;
    const name = `${sceneRef.current.preset.name.toLowerCase().replace(" ", "-")}.${type.includes("mp4") ? "mp4" : "webm"}`;
    const renderer = rendererRef.current;
    if (!renderer) return;
    setExporting(true);
    setStatus("Preparing full-size pictures…");
    // Full-size pictures and canvas for the length of the recording, then back to the light ones.
    const previews = new Map<number, WebGLTexture>();
    const heavy = mediaRef.current.filter((item) => item.file && (item.longest ?? 0) > PREVIEW_PICTURE);
    let ready = 0;
    if (heavy.length) setLoading({ label: "Preparing full-size pictures", done: 0, total: heavy.length });
    for (const item of heavy) {
      if (!item.file) continue;
      try {
        const bitmap = await createImageBitmap(item.file);
        const full = renderer.texture(drawnDown(bitmap, EXPORT_PICTURE), true);
        bitmap.close();
        previews.set(item.id, item.texture);
        item.texture = full;
      } catch {
        // This one stays at preview quality rather than failing the whole export.
      }
      setLoading({ label: "Preparing full-size pictures", done: ++ready, total: heavy.length });
    }
    setLoading(null);
    fullSizeRef.current = true;
    const restore = () => {
      fullSizeRef.current = false;
      for (const item of mediaRef.current) {
        const preview = previews.get(item.id);
        if (!preview) continue;
        renderer.deleteTexture(item.texture);
        item.texture = preview;
        previews.delete(item.id);
      }
      // Anything removed mid-export took its full-size picture with it; drop its preview too.
      for (const preview of previews.values()) renderer.deleteTexture(preview);
    };
    // The canvas must already be full size when the recorder first looks at it.
    renderer.draw(0, { ...sceneRef.current, media: mediaRef.current, resolution: 1, fullQuality: true });
    const recorder = new MediaRecorder(canvas.captureStream(60), { mimeType: type, videoBitsPerSecond: 24_000_000 });
    const chunks: Blob[] = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size) chunks.push(event.data);
    };
    recorder.onstop = () => {
      restore();
      download(new Blob(chunks, { type: type.split(";")[0] }), name);
      setExporting(false);
      setStatus(`Saved ${name}`);
    };
    recorder.onerror = () => {
      restore();
      setExporting(false);
      setStatus("Recording failed.");
    };
    setStatus(`Recording ${duration} seconds…`);
    for (const item of mediaRef.current) if (item.video) item.video.currentTime = 0;
    loopStartRef.current = performance.now();
    recorder.start();
    setTimeout(() => recorder.stop(), duration * 1000);
  }

  const { layout } = preset;
  const pins = pathGrid(preset, Math.round(motion.count));
  const fourWay = FOUR_WAY.has(layout);
  const upright = fourWay && (options.direction === "up" || options.direction === "down");
  const focusable = HAS_FOCUS.has(layout);
  const focuses: { value: Focus; label: string }[] = [
    { value: "off", label: "Off" },
    { value: "start", label: upright ? "Top" : "Left" },
    { value: "centre", label: "Centre" },
    { value: "end", label: upright ? "Bottom" : "Right" },
  ];
  const sceneKeys: MotionKey[] = [
    ...((focusable && options.focus !== "off") || layout === "proximity" ? (["scale", "reach"] as const) : []),
    ...(options.tiltMode !== "off" ? (["cardTilt"] as const) : []),
    "count",
    "size",
    "gap",
    ...(HAS_RADIUS.has(layout) ? (["radius"] as const) : []),
    ...(SHAPE_LABEL[layout] ? (["shape"] as const) : []),
    "turn",
    "spin",
    ...(focusable || layout === "proximity" ? (["fade"] as const) : []),
    "offsetX",
    "offsetY",
  ];
  const slider = (key: MotionKey) => {
    return <Slider key={key} {...rangeFor(preset, key)} value={motion[key]} onChange={(value) => setMotion(key, value)} onReset={() => resetKeys([key])} />;
  };
  const stepped = ALWAYS_STEPPED.has(layout) || motion.rhythm > 0;
  const tuned = Object.keys(adjustments).length > 0 || Object.keys(chosen).length > 0 || easing !== BASE_EASING;

  return (
    <div
      className="mp-tool"
      onDragOver={(event) => {
        event.preventDefault();
        // Dragging a thumbnail to reorder it is not a file drop.
        if (event.dataTransfer.types.includes("Files")) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        if (event.dataTransfer.types.includes("Files")) void addFiles(event.dataTransfer.files);
      }}
    >
      <nav className="mp-panel mp-panel-left" aria-label="Presets">
        <h1>Motion presets</h1>
        {GROUPS.map((group) => (
          <details
            key={group.title}
            className="mp-group"
            open={openGroups.has(group.title)}
            onToggle={(event) => {
              const { open } = event.currentTarget;
              setOpenGroups((current) => {
                if (current.has(group.title) === open) return current;
                const next = new Set(current);
                if (open) next.add(group.title);
                else next.delete(group.title);
                return next;
              });
            }}
          >
            <summary>
              <h2>{group.title}</h2>
              <span>{group.presets.length}</span>
            </summary>
            <div className="mp-presets">
              {group.presets.map((item) => (
                <button key={item.name} type="button" aria-pressed={item === preset} onClick={() => choosePreset(item)}>
                  <canvas
                    ref={(element) => {
                      if (element) previewCanvases.current.set(item.name, element);
                      else previewCanvases.current.delete(item.name);
                    }}
                    data-preset={item.name}
                    width={PREVIEW_LOOK.width}
                    height={PREVIEW_LOOK.height}
                    aria-hidden="true"
                  />
                  {item.name}
                </button>
              ))}
            </div>
          </details>
        ))}
        <a className="mp-pint" href={PINT_URL} target="_blank" rel="noopener noreferrer">
          Buy me a pint
        </a>
        <a className="mp-home" href="/" target="_blank" rel="noopener">
          lab.finbar.studio
        </a>
        <p className="mp-version">{VERSION}</p>
      </nav>

      <main className="mp-stage">
        {unsupported ? (
          <p>This browser cannot draw the preview. Try a current version of Chrome, Safari or Firefox.</p>
        ) : (
          <canvas ref={canvasRef} aria-label="Animation preview" style={{ aspectRatio: `${look.width} / ${look.height}` }} />
        )}
        {loading && (
          <div className="mp-loading" role="status" aria-live="polite">
            <p>
              {loading.label}, {loading.done} of {loading.total}
            </p>
            <div className="mp-loading-bar">
              <span style={{ scale: `${loading.total ? loading.done / loading.total : 0} 1` }} />
            </div>
          </div>
        )}
        <a className="mp-pint mp-pint-float" href={PINT_URL} target="_blank" rel="noopener noreferrer">
          Buy me a pint
        </a>
      </main>

      <aside className="mp-panel mp-panel-right" aria-label="Settings">
        <Heading title="Canvas" changed={look.width !== BASE_LOOK.width || look.height !== BASE_LOOK.height} onReset={() => patchLook({ width: BASE_LOOK.width, height: BASE_LOOK.height })} />
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
              <li
                key={thumb.id}
                draggable
                onDragStart={(event) => {
                  draggedRef.current = thumb.id;
                  event.dataTransfer.effectAllowed = "move";
                  event.dataTransfer.setData("text/plain", String(index + 1));
                }}
                onDragOver={(event) => {
                  if (draggedRef.current === null) return;
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";
                }}
                onDrop={(event) => {
                  if (draggedRef.current === null) return;
                  event.preventDefault();
                  event.stopPropagation();
                  moveMedia(draggedRef.current, index);
                  draggedRef.current = null;
                }}
                onDragEnd={() => {
                  draggedRef.current = null;
                }}
              >
                <img src={thumb.url} alt={`${thumb.isVideo ? "Video" : "Media"} ${index + 1}`} draggable={false} />
                {thumb.isVideo && (
                  <span className="mp-media-video" aria-hidden="true">
                    ▶
                  </span>
                )}
                <span className="mp-media-slot">{index + 1}</span>
                <button type="button" className="mp-media-remove" aria-label={`Remove media ${index + 1}`} onClick={() => removeMedia(thumb.id)}>
                  ×
                </button>
                <span className="mp-media-move">
                  <button type="button" aria-label={`Move media ${index + 1} earlier`} disabled={index === 0} onClick={() => moveMedia(thumb.id, index - 1)}>
                    ‹
                  </button>
                  <button type="button" aria-label={`Move media ${index + 1} later`} disabled={index === thumbs.length - 1} onClick={() => moveMedia(thumb.id, index + 1)}>
                    ›
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}

        <Heading
          title="Scene"
          changed={changedAny(SCENE_KEYS) || Object.keys(chosen).length > 0}
          onReset={() => {
            resetKeys(SCENE_KEYS);
            setChosen({});
          }}
        />
        {layout === "zoom" && <Choice label="Grow from" value={options.origin} options={ORIGINS} onChange={(value) => setOption("origin", value)} />}
        {layout !== "tour" && layout !== "zoom" && !(layout === "proximity" && preset.variant.field) && (
          <Choice label="Direction" value={fourWay || options.direction === "left" || options.direction === "right" ? options.direction : "left"} options={fourWay ? DIRECTIONS : WAYS} onChange={(value) => setOption("direction", value)} />
        )}
        {focusable && <Choice label="Scale focus" value={options.focus} options={focuses} onChange={(value) => setOption("focus", value)} />}
        <Choice label="Tilt" value={options.tiltMode} options={TILTS} onChange={(value) => setOption("tiltMode", value)} />
        {focusable && <Choice label="Solo" value={options.solo} options={ON_OFF} onChange={(value) => setOption("solo", value)} />}
        {layout === "orbit" && <Choice label="Centre card" value={options.centre} options={ON_OFF} onChange={(value) => setOption("centre", value)} />}
        {layout === "orbit" && !preset.variant.flat && <Choice label="Face viewer" value={options.faceCamera} options={ON_OFF} onChange={(value) => setOption("faceCamera", value)} />}
        {sceneKeys.map(slider)}
        {pins && (
          <>
            <Heading title={layout === "tour" ? "Camera path" : "Focus path"} changed={path.join() !== (preset.path ?? []).join()} onReset={() => setPath(preset.path ?? [])} />
            <PathGrid cells={pins.cells} cols={pins.cols} path={path} onChange={setPath} />
            <p className="mp-note">
              {layout === "tour"
                ? "Click cells in the order the camera should visit them. Your media fills the cells left to right, top to bottom."
                : "Click spots in the order the focus should travel through them."}
            </p>
          </>
        )}

        <Heading title="Timing" changed={changedAny(TIMING_KEYS)} onReset={() => resetKeys(TIMING_KEYS)} />
        {!ALWAYS_STEPPED.has(layout) && <Choice label="Motion" value={stepped} options={PACES} onChange={(value) => setMotion("rhythm", value ? 1 : 0)} />}
        {slider("duration")}
        {slider("speed")}
        {stepped && layout !== "proximity" && layout !== "tour" && !ALWAYS_STEPPED.has(layout) && slider("stagger")}
        {stepped && slider("hold")}

        {stepped && <Heading title="Easing" changed={easing !== BASE_EASING} onReset={() => setEasing(BASE_EASING)} />}
        <div className="mp-easing" hidden={!stepped}>
          <CurveEditor curve={easing} onChange={setEasing} />
          <div className="mp-easings">
            {EASINGS.map((item) => (
              <button key={item.name} type="button" aria-pressed={item.curve.every((part, index) => part === easing[index])} onClick={() => setEasing(item.curve)}>
                {item.name}
              </button>
            ))}
          </div>
        </div>

        <Heading title="Camera" changed={changedAny(CAMERA_KEYS)} onReset={() => resetKeys(CAMERA_KEYS)} />
        {CAMERA_KEYS.map(slider)}

        <Heading title="Card shape" changed={look.cardW !== BASE_LOOK.cardW || look.cardH !== BASE_LOOK.cardH} onReset={() => patchLook({ cardW: BASE_LOOK.cardW, cardH: BASE_LOOK.cardH })} />
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

        <Heading title="Look" changed={look.radius !== BASE_LOOK.radius || look.background !== BASE_LOOK.background} onReset={() => patchLook({ radius: BASE_LOOK.radius, background: BASE_LOOK.background })} />
        <Slider label="Corners" min={0} max={0.5} step={0.01} value={look.radius} onChange={(radius) => patchLook({ radius })} onReset={() => patchLook({ radius: BASE_LOOK.radius })} />
        <div className="mp-line">
          <span>Background</span>
          <ColourPicker label="Background" value={look.background} onChange={(background) => patchLook({ background })} />
        </div>

        <h2>Setup</h2>
        <button type="button" disabled={!tuned} onClick={resetFlow} style={{ width: "100%", marginBottom: 6 }}>
          Reset everything to each preset&apos;s own
        </button>
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
        <button type="button" className="mp-primary" disabled={exporting || unsupported} onClick={() => void exportVideo()}>
          Export video
        </button>
        <p className="mp-status" role="status">
          {status}
        </p>
      </aside>
    </div>
  );
}
