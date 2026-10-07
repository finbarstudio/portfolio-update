"use client";

import { useEffect, useRef, useState } from "react";
import { generatePathway, type Pathway } from "./pathway";
import { BRANDS, GRADIENT, textPresets, type BrandKey } from "./palette";
import { media, corsMedia } from "@/lib/media";

/**
 * Share to Buy pathway maker. One screen, no scroll: controls on the left, the
 * canvas on the right.
 *
 * FORMATS. Three only, the ones social posts use: 1:1, 3:4 and the 9:16 reel,
 * each exported with its long side at 2048.
 *
 * CAROUSEL. One line drawn across three panels side by side, exported as three
 * files that join edge to edge when swiped. The line is generated once for the
 * whole strip (three panels wide) and each panel is a window onto it, so the
 * line, the gradient and the scrolling text all carry straight across the
 * joins. Every panel shares the same loop length, so each video loops cleanly
 * on its own and the three stay in step.
 *
 * The canvas on screen is a preview (the strip is drawn at half size, to keep
 * it quick). Every download is drawn fresh at full size, off screen.
 */

const LONG = 2048;
const SIZES = [
  { label: "1:1", w: LONG, h: LONG },
  { label: "3:4", w: 1536, h: LONG },
  { label: "Reel 9:16", w: 1152, h: LONG },
];
/** Panels in a carousel. */
const PANELS = 3;

/** Line thickness: three steps only, named by their width in px on a
 *  1080 x 1920 reel. Other formats take the same share of their short side. */
const THICKNESSES = [100, 150, 200];

/** The gradient always runs ALONG the line, like water in a pipe. This is how
 *  much line one full run of the colours covers (short side = 1). */
const FLOW_PERIOD = 2.5;

const FONT = '"Share to Buy", system-ui, sans-serif';
/** The brand face lives in the media bucket, so it is registered from script
 *  (CSS may not point at /media). Fonts are always fetched with CORS. */
const FONT_FILES = [
  ["400", "/media/lab/pathway/share-to-buy-regular.woff2"],
  ["700", "/media/lab/pathway/share-to-buy-bold.woff2"],
] as const;

type Alpha = "none" | "bg" | "line";

interface Look {
  bg: string;
  line: string;
  alpha: Alpha;
  text: string;
  /** One colour per repeat of the text, in turn. */
  textColours: string[];
  /** Line thickness, as a share of the short side. */
  stroke: number;
  /** Text reads the other way along the line (and so sits the other way up). */
  flip: boolean;
}

const RGB = GRADIENT.map((hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
});

/** The gradient as a loop: t = 0 and t = 1 are the same colour. */
function flowColour(t: number) {
  const f = (((t % 1) + 1) % 1) * RGB.length;
  const i = Math.floor(f) % RGB.length;
  const a = RGB[i];
  const b = RGB[(i + 1) % RGB.length];
  const k = f - Math.floor(f);
  return `rgb(${a.map((v, c) => Math.round(v + (b[c] - v) * k)).join(",")})`;
}

/** Index of the last point at or before distance d along the line. */
function locate(cum: number[], d: number) {
  let lo = 0;
  let hi = cum.length - 2;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (cum[mid] <= d) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

/**
 * Add points from..to to the current path as smooth curves, not straight
 * pieces. Each curve leaves a point in the direction the next one arrives in
 * (a Catmull-Rom spline through the walk's points), so there is no corner at
 * any point and nothing for the renderer to join.
 *
 * That matters: fed hundreds of short straight pieces, Safari and iOS treat
 * the tiny turn between two of them as no turn at all and skip the join, which
 * leaves a long thin wedge of background showing on the outside of every bend.
 * Chrome does not. With curves there is no join to skip.
 *
 * The directions always come from the whole line, never from the stretch being
 * drawn, so a stretch laid over the line sits exactly on it.
 */
function trace(ctx: CanvasRenderingContext2D, pts: number[], S: number, from: number, to: number) {
  const last = pts.length / 2 - 1;
  const x = (i: number) => pts[Math.max(0, Math.min(last, i)) * 2] * S;
  const y = (i: number) => pts[Math.max(0, Math.min(last, i)) * 2 + 1] * S;
  ctx.moveTo(x(from), y(from));
  for (let i = from; i < to; i++) {
    ctx.bezierCurveTo(
      x(i) + (x(i + 1) - x(i - 1)) / 6,
      y(i) + (y(i + 1) - y(i - 1)) / 6,
      x(i + 1) - (x(i + 2) - x(i)) / 6,
      y(i + 1) - (y(i + 2) - y(i)) / 6,
      x(i + 1),
      y(i + 1),
    );
  }
}

/** Stroke points from..to of the line. */
function strokeLine(ctx: CanvasRenderingContext2D, path: Pathway, S: number, from: number, to: number, look: Look, gPhase: number) {
  const { pts, cum } = path;
  if (look.alpha === "line") ctx.globalCompositeOperation = "destination-out"; // cut the line out of the background
  if (look.line === "gradient" && look.alpha !== "line") {
    // No canvas gradient can follow a curve, so the line goes down as short
    // pieces, each its own colour, each overlapping the next to hide the seams.
    for (let i = from; i < to; i++) {
      ctx.strokeStyle = flowColour(cum[i] / FLOW_PERIOD - gPhase);
      ctx.beginPath();
      trace(ctx, pts, S, i, Math.min(i + 2, to));
      ctx.stroke();
    }
  } else {
    ctx.strokeStyle = look.line === "gradient" ? "#000" : look.line; // (a cut-out line has no colour of its own)
    ctx.beginPath();
    trace(ctx, pts, S, from, to);
    ctx.stroke();
  }
  ctx.globalCompositeOperation = "source-over";
}

/**
 * The ticker: the text repeated along the line, each repeat in the next colour.
 * tPhase 0 to 1 slides it forward by one full set of colours, so a loop joins up.
 * `range` (px along the line) limits it to the letters around one stretch.
 */
function ticker(ctx: CanvasRenderingContext2D, text: string, strokePx: number) {
  const size = strokePx * 0.42;
  ctx.font = `700 ${size}px ${FONT}`;
  const chars = [...text.toUpperCase()];
  const widths = chars.map((ch) => ctx.measureText(ch).width);
  const tracking = size * 0.1;
  /** One repeat of the text plus the gap after it, in px. */
  const period = widths.reduce((a, b) => a + b + tracking, 0) + size * 1.5;
  return { size, chars, widths, tracking, period };
}

interface Glyph {
  ch: string;
  x: number;
  y: number;
  /** radians */
  angle: number;
  colour: string;
}

/** Where every letter of the ticker goes. Shared by the canvas and the SVG export. */
function layoutText(ctx: CanvasRenderingContext2D, path: Pathway, S: number, look: Look, strokePx: number, tPhase: number, range?: [number, number]) {
  const { size, chars, widths, tracking, period } = ticker(ctx, look.text, strokePx);
  const { pts, cum } = path;
  const total = cum[cum.length - 1] * S;
  const n = look.textColours.length;
  const shift = tPhase * n * period;
  const glyphs: Glyph[] = [];
  for (let k = -Math.ceil(shift / period) - 1; k * period + shift < total; k++) {
    const colour = look.textColours[((k % n) + n) % n];
    let s = k * period + shift;
    for (let c = 0; c < chars.length; c++) {
      // Flipped, the same layout is measured from the far end of the line.
      const at = look.flip ? total - (s + widths[c] / 2) : s + widths[c] / 2;
      s += widths[c] + tracking;
      if (at < 0 || at >= total || (range && (at < range[0] || at > range[1]))) continue;
      const i = locate(cum, at / S);
      const t = (at / S - cum[i]) / (cum[i + 1] - cum[i] || 1);
      const x0 = pts[i * 2], y0 = pts[i * 2 + 1], x1 = pts[i * 2 + 2], y1 = pts[i * 2 + 3];
      glyphs.push({
        ch: chars[c],
        x: (x0 + (x1 - x0) * t) * S,
        y: (y0 + (y1 - y0) * t) * S,
        angle: Math.atan2(y1 - y0, x1 - x0) + (look.flip ? Math.PI : 0),
        colour,
      });
    }
  }
  return { size, glyphs };
}

function drawText(ctx: CanvasRenderingContext2D, path: Pathway, S: number, look: Look, strokePx: number, tPhase: number, range?: [number, number]) {
  const { size, glyphs } = layoutText(ctx, path, S, look, strokePx, tPhase, range);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const g of glyphs) {
    ctx.fillStyle = g.colour;
    ctx.save();
    ctx.translate(g.x, g.y);
    ctx.rotate(g.angle);
    // The face sits a touch high on its middle line; nudge to centre the caps.
    ctx.fillText(g.ch, 0, size * 0.04);
    ctx.restore();
  }
}

/**
 * Draw one picture: a window w by h onto the line, starting `ox` px along it
 * from the left. S is the px size of the short side of ONE panel, which is the
 * unit the line is measured in. A single image is ox = 0; the second panel of
 * a carousel is ox = one panel's width, and so on.
 */
function render(ctx: CanvasRenderingContext2D, w: number, h: number, S: number, ox: number, path: Pathway, look: Look, gPhase: number, tPhase: number) {
  const last = path.pts.length / 2 - 1;
  ctx.globalCompositeOperation = "source-over";
  ctx.clearRect(0, 0, w, h);
  if (look.alpha !== "bg") {
    ctx.fillStyle = look.bg;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.save();
  ctx.translate(-ox, 0);
  const STROKE = look.stroke;
  ctx.lineWidth = STROKE * S;
  ctx.lineJoin = "round";
  ctx.lineCap = "butt";
  strokeLine(ctx, path, S, 0, last, look, gPhase);
  if (look.text) {
    drawText(ctx, path, S, look, STROKE * S, tPhase);
    // Where the line passes over itself, two runs of text would collide. Lay the
    // upper stretch down again over the crossing, then its own letters on top,
    // so the text underneath slides out of sight beneath it.
    const win = STROKE * 0.75;
    for (const j of path.over) {
      const at = path.cum[j];
      strokeLine(ctx, path, S, locate(path.cum, at - win), Math.min(last, locate(path.cum, at + win) + 1), look, gPhase);
      drawText(ctx, path, S, look, STROKE * S, tPhase, [(at - win - STROKE) * S, (at + win + STROKE) * S]);
    }
  }
  ctx.restore();
}

/**
 * The same picture as an SVG, for Illustrator or Figma.
 *
 * The line is ONE path with a stroke, so its width and colour stay editable.
 * It is drawn as smooth curves through every sixth point of the walk rather
 * than hundreds of tiny straight pieces. The gradient is the one exception:
 * SVG has no gradient that follows a curve, so a gradient line exports as
 * short coloured pieces, exactly as the canvas draws it.
 *
 * `ox` picks the window, as in render(): the file shows w by h starting ox px
 * along, by its viewBox, so a carousel panel is the same drawing cropped.
 *
 * Text stays live text in Share to Buy Bold (the font must be installed where
 * the file is opened), one letter each, already placed and turned.
 */
function buildSvg(ctx: CanvasRenderingContext2D, w: number, h: number, S: number, ox: number, path: Pathway, look: Look) {
  const r = (v: number) => Math.round(v * 10) / 10;
  const { pts, cum } = path;
  const last = pts.length / 2 - 1;
  const sw = r(look.stroke * S);

  /** Points from..to as one smooth path (Catmull-Rom through every `step`th point). */
  const curve = (from: number, to: number, step = 6) => {
    const idx: number[] = [];
    for (let i = from; i < to; i += step) idx.push(i);
    idx.push(to);
    const P = idx.map((i) => [pts[i * 2] * S, pts[i * 2 + 1] * S]);
    let d = `M${r(P[0][0])} ${r(P[0][1])}`;
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
      d += `C${r(p1[0] + (p2[0] - p0[0]) / 6)} ${r(p1[1] + (p2[1] - p0[1]) / 6)} ${r(p2[0] - (p3[0] - p1[0]) / 6)} ${r(p2[1] - (p3[1] - p1[1]) / 6)} ${r(p2[0])} ${r(p2[1])}`;
    }
    return d;
  };

  const flow = look.line === "gradient" && look.alpha !== "line";
  const defs: string[] = [];
  const paint = look.line === "gradient" ? "#000" : look.line;

  /** The line, or a stretch of it, as markup. */
  const line = (from: number, to: number, stroke = paint) => {
    if (!flow) return `<path d="${curve(from, to)}" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;
    let out = "";
    for (let i = from; i < to; i++) {
      const e = Math.min(i + 2, to);
      let d = `M${r(pts[i * 2] * S)} ${r(pts[i * 2 + 1] * S)}`;
      for (let j = i + 1; j <= e; j++) d += `L${r(pts[j * 2] * S)} ${r(pts[j * 2 + 1] * S)}`;
      out += `<path d="${d}" stroke="${flowColour(cum[i] / FLOW_PERIOD)}"/>`;
    }
    return `<g fill="none" stroke-width="${sw}">${out}</g>`;
  };

  const text = (range?: [number, number]) => {
    const { size, glyphs } = layoutText(ctx, path, S, look, look.stroke * S, 0, range);
    const letters = glyphs
      .map((g) => `<text fill="${g.colour}" transform="translate(${r(g.x)} ${r(g.y)}) rotate(${r((g.angle * 180) / Math.PI)})">${g.ch === "&" ? "&amp;" : g.ch === "<" ? "&lt;" : g.ch}</text>`)
      .join("");
    return `<g font-family="Share to Buy" font-weight="700" font-size="${r(size)}" text-anchor="middle" dominant-baseline="central">${letters}</g>`;
  };

  // The stretches that pass over another, and so hide its text.
  const win = look.stroke * 0.75;
  const overs = look.text
    ? path.over.map((j) => ({
        from: locate(cum, cum[j] - win),
        to: Math.min(last, locate(cum, cum[j] + win) + 1),
        range: [(cum[j] - win - look.stroke) * S, (cum[j] + win + look.stroke) * S] as [number, number],
      }))
    : [];

  const body: string[] = [];
  const box = `x="${ox}" y="0" width="${w}" height="${h}"`;
  const rect = `<rect ${box} fill="${look.bg}"/>`;
  if (look.alpha === "line") {
    // The line is a hole in the background: a mask, still one stroked path.
    defs.push(`<mask id="cut" maskUnits="userSpaceOnUse" ${box}><rect ${box} fill="#fff"/>${line(0, last, "#000")}</mask>`);
    body.push(`<g mask="url(#cut)">${rect}</g>`);
    if (look.text) {
      if (overs.length) {
        defs.push(`<mask id="under" maskUnits="userSpaceOnUse" ${box}><rect ${box} fill="#fff"/>${overs.map((o) => line(o.from, o.to, "#000")).join("")}</mask>`);
        body.push(`<g mask="url(#under)">${text()}</g>`);
        for (const o of overs) body.push(text(o.range));
      } else body.push(text());
    }
  } else {
    if (look.alpha !== "bg") body.push(rect);
    body.push(line(0, last));
    if (look.text) {
      body.push(text());
      for (const o of overs) body.push(line(o.from, o.to), text(o.range));
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${ox} 0 ${w} ${h}">${defs.length ? `<defs>${defs.join("")}</defs>` : ""}${body.join("")}</svg>`;
}

const pause = (ms = 0) => new Promise((r) => setTimeout(r, ms));

function save(blob: Blob, name: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function Slider({ label, value, min, max, step, onChange, show }: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; show?: string;
}) {
  return (
    <label className="stb-slider">
      <span>{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      <output>{show ?? value}</output>
    </label>
  );
}

export default function PathwayTool() {
  const [brand, setBrand] = useState<BrandKey>("stb");
  const [combo, setCombo] = useState(0);
  const [size, setSize] = useState(0);
  const [carousel, setCarousel] = useState(false);
  /** Show the canvas inside a mock social post, one panel at a time. */
  const [social, setSocial] = useState(false);
  const [slide, setSlide] = useState(0);
  const [seed, setSeed] = useState(1);
  const [p, setP] = useState({ rMin: 0.28, rMax: 0.75, length: 5, loop: 0.3, maxCross: 1 });
  const [text, setText] = useState("");
  const [textPreset, setTextPreset] = useState(0);
  const [flipText, setFlipText] = useState(false);
  const [thickness, setThickness] = useState(150);
  /** How fast the text travels: % of the short side per second. */
  const [textSpeed, setTextSpeed] = useState(5);
  const [alpha, setAlpha] = useState<Alpha>("none");
  const [animateGradient, setAnimateGradient] = useState(false);
  /** The gradient flows back towards the start of the line instead of away from it. */
  const [reverseFlow, setReverseFlow] = useState(false);
  const [scrollText, setScrollText] = useState(false);
  const [gradientSecs, setGradientSecs] = useState(8);
  /** The length of one seamless loop, worked out in the draw effect. */
  const [loopSecs, setLoopSecs] = useState(8);
  /** null, or how far through an export we are (0 to 1). */
  const [progress, setProgress] = useState<number | null>(null);
  const recording = progress !== null;
  const [fontReady, setFontReady] = useState(false);

  useEffect(() => {
    Promise.all(
      FONT_FILES.map(([weight, file]) => new FontFace("Share to Buy", `url("${corsMedia(media(file))}")`, { weight }).load()),
    )
      .then((faces) => {
        for (const face of faces) document.fonts.add(face);
        setFontReady(true);
      })
      .catch(() => setFontReady(true)); // draw in the fallback face rather than not at all
  }, []);

  const canvas = useRef<HTMLCanvasElement>(null);
  const clock = useRef(0); // when the loop last started
  const drag = useRef<number | null>(null);

  const { w, h } = SIZES[size];
  const short = Math.min(w, h);
  const n = carousel ? PANELS : 1;
  /** The whole strip: one panel, or three side by side. */
  const stripW = w * n;
  /** The canvas on screen: full size for one image, half size for a strip. */
  const view = carousel ? 0.5 : 1;
  const colours = BRANDS[brand].combos[combo];
  const live = brand === "live";
  const isGradient = colours.line === "gradient";
  const shownText = live ? text.trim() : "";
  const gradientMoves = animateGradient && isGradient;
  const textMoves = scrollText && shownText !== "";
  const moving = gradientMoves || textMoves;
  const stroke = thickness / 1080;
  const presets = textPresets(colours.line);
  // A strip is three panels of ground to cover, so the line is that much longer.
  const path = generatePathway(seed, stripW / short, h / short, { ...p, length: p.length * (carousel ? 2.4 : 1), stroke, panels: n });
  const at = Math.min(slide, n - 1);

  const look: Look = {
    bg: colours.bg,
    line: colours.line,
    // Video has no transparency, so anything that moves is always solid.
    alpha: moving ? "none" : alpha,
    text: shownText,
    textColours: (presets[textPreset] ?? presets[0]).colours,
    flip: flipText,
    stroke,
  };

  /**
   * One loop, so that a video always joins up with itself. Scrolling text sets
   * the length: the time it takes to travel one full set of its colours at the
   * chosen speed, after which every letter and colour is back where it began.
   * The gradient then fits a whole number of runs into that time. With no
   * scrolling text the loop is simply the gradient's own length. It is the
   * same for every panel of a carousel. S is the short side being drawn at.
   */
  const timing = (ctx: CanvasRenderingContext2D, S: number) => {
    if (!textMoves) return { secs: gradientSecs, cycles: 1 };
    const set = ticker(ctx, look.text, stroke * S).period * look.textColours.length;
    const secs = set / ((textSpeed / 100) * S);
    return { secs, cycles: Math.max(1, Math.round(secs / gradientSecs)) };
  };
  /** Where the gradient is, t (0 to 1) through the loop. Reversed, it runs the other way. */
  const flowAt = (t: number, cycles: number) => {
    if (!gradientMoves) return 0;
    const at = (t * cycles) % 1;
    return reverseFlow ? (1 - at) % 1 : at;
  };
  /** Draw panel `i` at full size, at t (0 to 1) through the loop. */
  const drawPanel = (ctx: CanvasRenderingContext2D, i: number, t: number, cycles: number) =>
    render(ctx, w, h, short, i * w, path, look, flowAt(t, cycles), textMoves ? t : 0);

  useEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    const S = short * view;
    const { secs, cycles } = timing(ctx, S);
    if (Math.abs(secs - loopSecs) > 0.01) setLoopSecs(secs);
    let raf = 0;
    const draw = () => {
      const t = moving ? ((performance.now() - clock.current) / 1000 / secs) % 1 : 0;
      render(ctx, stripW * view, h * view, S, 0, path, look, flowAt(t, cycles), textMoves ? t : 0);
      if (moving && !recording) raf = requestAnimationFrame(draw); // an export takes the processor; the preview holds
    };
    draw();
    return () => cancelAnimationFrame(raf);
    // Runs after every render: any control changing, or the font arriving, redraws.
  });

  const set = (patch: Partial<typeof p>) => setP({ ...p, ...patch });
  const restart = () => { clock.current = performance.now(); };
  const base = `${brand}-pathway-${seed}-${w}x${h}`;
  const fileName = (i: number, ext: string) => `${base}${n > 1 ? `-${i + 1}of${n}` : ""}.${ext}`;
  const files = n > 1 ? ` · ${n} files` : "";

  /** A full-size canvas, off screen, for the downloads. */
  const sheet = () => {
    const el = document.createElement("canvas");
    el.width = w;
    el.height = h;
    return { el, ctx: el.getContext("2d")! };
  };

  // Stills: a moving gradient or text exports as its first frame. A carousel
  // saves one file per panel, a moment apart so the browser lets them all through.
  const downloadPng = async () => {
    const { el, ctx } = sheet();
    for (let i = 0; i < n; i++) {
      drawPanel(ctx, i, 0, 1);
      const blob = await new Promise<Blob | null>((r) => el.toBlob(r, "image/png"));
      if (blob) save(blob, fileName(i, "png"));
      await pause(350);
    }
  };
  const downloadSvg = async () => {
    const { ctx } = sheet();
    for (let i = 0; i < n; i++) {
      save(new Blob([buildSvg(ctx, w, h, short, i * w, path, look)], { type: "image/svg+xml" }), fileName(i, "svg"));
      await pause(350);
    }
  };

  /**
   * MP4, one loop per panel. Frames are drawn and encoded one at a time, not
   * filmed off the screen, so frame N is exactly t = N / total and the last
   * frame runs straight back into the first, whatever the computer's speed.
   * Every panel gets the same frames at the same times, so they stay in step.
   */
  const exportVideo = async () => {
    if (recording) return;
    if (typeof VideoEncoder === "undefined") {
      window.alert("This browser cannot export video. Use Chrome, Edge or Safari.");
      return;
    }
    setProgress(0);
    try {
      const { Muxer, ArrayBufferTarget } = await import("mp4-muxer");
      const { el, ctx } = sheet();
      const fps = 30;
      const { secs, cycles } = timing(ctx, short);
      const total = Math.max(1, Math.round(secs * fps));
      for (let panel = 0; panel < n; panel++) {
        const muxer = new Muxer({ target: new ArrayBufferTarget(), video: { codec: "avc", width: w, height: h }, fastStart: "in-memory" });
        const encoder = new VideoEncoder({
          output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
          error: (e) => console.error(e),
        });
        encoder.configure({ codec: "avc1.640033", width: w, height: h, bitrate: 16_000_000, framerate: fps });
        for (let i = 0; i < total; i++) {
          drawPanel(ctx, panel, i / total, cycles);
          const picture = new VideoFrame(el, { timestamp: (i * 1e6) / fps, duration: 1e6 / fps });
          encoder.encode(picture, { keyFrame: i % 60 === 0 });
          picture.close();
          if (i % 5 === 0) {
            setProgress((panel + i / total) / n);
            await pause(); // let the encoder and the screen catch up
          }
          while (encoder.encodeQueueSize > 8) await pause(5);
        }
        await encoder.flush();
        muxer.finalize();
        save(new Blob([muxer.target.buffer], { type: "video/mp4" }), fileName(panel, "mp4"));
        await pause(350);
      }
    } finally {
      restart();
      setProgress(null);
    }
  };

  const go = (to: number) => setSlide(Math.max(0, Math.min(n - 1, to)));

  return (
    <div className="stb-tool" data-font={fontReady ? "in" : "wait"}>
      <aside className="stb-panel">
        <h1>Pathway maker</h1>

        <section>
          <h2>Brand</h2>
          <div className="stb-seg">
            {(Object.keys(BRANDS) as BrandKey[]).map((b) => (
              <button key={b} type="button" aria-pressed={brand === b} onClick={() => { setBrand(b); setCombo(0); }}>
                {BRANDS[b].label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2>Colours</h2>
          <div className="stb-swatches">
            {BRANDS[brand].combos.map((c, i) => (
              <button
                key={c.name}
                type="button"
                title={c.name}
                aria-label={c.name}
                aria-pressed={combo === i}
                style={{
                  background: c.bg,
                  ["--line" as string]: c.line === "gradient" ? `linear-gradient(90deg, ${GRADIENT.join(",")})` : c.line,
                }}
                onClick={() => setCombo(i)}
              />
            ))}
          </div>
          <p className="stb-note">{colours.name}</p>
        </section>

        <section>
          <h2>Format</h2>
          <div className="stb-seg">
            {SIZES.map((s, i) => (
              <button key={s.label} type="button" aria-pressed={size === i} onClick={() => setSize(i)}>
                {s.label}
              </button>
            ))}
          </div>
          <div className="stb-seg stb-seg-gap">
            <button type="button" aria-pressed={!carousel} onClick={() => { setCarousel(false); setSlide(0); }}>Single</button>
            <button type="button" aria-pressed={carousel} onClick={() => setCarousel(true)}>Carousel of {PANELS}</button>
          </div>
        </section>

        <section>
          <h2>Pathway</h2>
          <div className="stb-seed">
            <button type="button" className="stb-primary" onClick={() => setSeed(Math.floor(Math.random() * 1_000_000))}>
              New pathway
            </button>
            <label>
              <span>Seed</span>
              <input type="number" value={seed} onChange={(e) => setSeed(Number(e.target.value) || 0)} />
            </label>
          </div>
          <div className="stb-slider">
            <span>Thickness</span>
            <div className="stb-seg">
              {THICKNESSES.map((t) => (
                <button key={t} type="button" aria-pressed={thickness === t} onClick={() => setThickness(t)}>
                  {t}
                </button>
              ))}
            </div>
            <output>px</output>
          </div>
          <Slider label="Tightest bend" value={p.rMin} min={0.15} max={0.5} step={0.01} onChange={(v) => set({ rMin: v, rMax: Math.max(p.rMax, v) })} />
          <Slider label="Widest bend" value={p.rMax} min={0.2} max={1.5} step={0.01} onChange={(v) => set({ rMax: v, rMin: Math.min(p.rMin, v) })} />
          <Slider label="Length" value={p.length} min={2} max={10} step={0.25} onChange={(v) => set({ length: v })} />
          <Slider label="Loops" value={p.loop} min={0} max={1} step={0.05} onChange={(v) => set({ loop: v })} />
          <Slider label="Overlaps" value={p.maxCross} min={0} max={2} step={1} onChange={(v) => set({ maxCross: v })} show={`up to ${p.maxCross}`} />
        </section>

        {live && (
          <section>
            <h2>Ticker text</h2>
            <input className="stb-text" type="text" placeholder="FREE EVENT" value={text} onChange={(e) => setText(e.target.value)} />
            <div className="stb-presets">
              {presets.map((t, i) => (
                <button key={t.name} type="button" title={t.name} aria-label={`Text colour: ${t.name}`} aria-pressed={(presets[textPreset] ? textPreset : 0) === i} onClick={() => setTextPreset(i)}>
                  {t.colours.map((c) => (
                    <i key={c} style={{ background: c }} />
                  ))}
                </button>
              ))}
              <span className="stb-note">{(presets[textPreset] ?? presets[0]).name}</span>
            </div>
            <label className="stb-check">
              <input type="checkbox" checked={flipText} onChange={(e) => setFlipText(e.target.checked)} />
              Flip the text
            </label>
            <label className="stb-check">
              <input type="checkbox" checked={scrollText} onChange={(e) => { restart(); setScrollText(e.target.checked); }} />
              Scroll the text
            </label>
            {scrollText && <Slider label="Speed" value={textSpeed} min={1} max={25} step={1} onChange={setTextSpeed} />}
          </section>
        )}

        {isGradient && (
          <section>
            <h2>Gradient</h2>
            <label className="stb-check">
              <input type="checkbox" checked={animateGradient} onChange={(e) => { restart(); setAnimateGradient(e.target.checked); }} />
              Flow along the path
            </label>
            {animateGradient && (
              <label className="stb-check">
                <input type="checkbox" checked={reverseFlow} onChange={(e) => setReverseFlow(e.target.checked)} />
                Reverse the flow
              </label>
            )}
            {animateGradient && (
              <Slider label="One run" value={gradientSecs} min={2} max={20} step={1} onChange={setGradientSecs} show={textMoves ? `~${gradientSecs}s` : `${gradientSecs}s`} />
            )}
          </section>
        )}

        <section className="stb-export">
          <h2>Export</h2>
          <div className="stb-seg">
            {(["none", "bg", "line"] as Alpha[]).map((a) => (
              <button key={a} type="button" aria-pressed={look.alpha === a} disabled={moving} onClick={() => setAlpha(a)}>
                {a === "none" ? "Solid" : a === "bg" ? "No background" : "No line"}
              </button>
            ))}
          </div>
          <div className="stb-pair">
            <button type="button" className="stb-primary" onClick={downloadPng} disabled={recording}>
              Download PNG
            </button>
            <button type="button" className="stb-primary" onClick={downloadSvg} disabled={recording}>
              Download SVG
            </button>
          </div>
          {moving && (
            <button type="button" className="stb-primary" onClick={exportVideo} disabled={recording}>
              {recording ? `Making the video ${Math.round((progress ?? 0) * 100)}%` : `Download MP4 · ${loopSecs.toFixed(1)}s loop`}
            </button>
          )}
          <p className="stb-note">
            {w} × {h}{files} · seed {seed} · {path.crossings} overlap{path.crossings === 1 ? "" : "s"}
            {path.clean ? "" : " · closest fit, try another"}
          </p>
          <a className="stb-back" href="/" target="_blank" rel="noopener">Back to the lab</a>
        </section>
      </aside>

      <main className="stb-stage">
        <button type="button" className="stb-toggle" aria-pressed={social} onClick={() => { setSocial(!social); setSlide(0); }}>
          {social ? "Show the artwork" : "Preview as a post"}
        </button>
        <div
          className="stb-frame"
          data-social={social ? "1" : "0"}
          style={{ ["--r" as string]: (social ? w : stripW) / h, ["--n" as string]: n, ["--at" as string]: social ? at : 0 }}
        >
          {social && (
            <div className="stb-post-head">
              <i aria-hidden="true" />
              <b>sharetobuy</b>
            </div>
          )}
          <div
            className="stb-view"
            onPointerDown={(e) => { drag.current = e.clientX; }}
            onPointerUp={(e) => {
              // a swipe moves one panel, as it does on a phone
              if (social && drag.current !== null && Math.abs(e.clientX - drag.current) > 30) go(at + (e.clientX < drag.current ? 1 : -1));
              drag.current = null;
            }}
          >
            <canvas ref={canvas} width={Math.round(stripW * view)} height={Math.round(h * view)} />
            {/* where one panel ends and the next begins */}
            {!social && Array.from({ length: n - 1 }, (_, i) => <span key={i} className="stb-cut" style={{ left: `${((i + 1) / n) * 100}%` }} aria-hidden="true" />)}
            {social && n > 1 && at > 0 && <button type="button" className="stb-nav is-prev" aria-label="Previous" onClick={() => go(at - 1)}>‹</button>}
            {social && n > 1 && at < n - 1 && <button type="button" className="stb-nav is-next" aria-label="Next" onClick={() => go(at + 1)}>›</button>}
            {social && n > 1 && <span className="stb-count">{at + 1}/{n}</span>}
          </div>
          {social && (
            <div className="stb-post-foot">
              <span className="stb-icons" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M12 20.5s-7.5-4.4-7.5-10A4.3 4.3 0 0 1 12 8a4.3 4.3 0 0 1 7.5 2.5c0 5.600-7.5 10-7.500 10z" /></svg>
                <svg viewBox="0 0 24 24"><path d="M20.500 11.500a8.500 8.500 0 0 1-12.600 7.400L3.500 20.500l1.600-4.400A8.500 8.500 0 1 1 20.500 11.500z" /></svg>
                <svg viewBox="0 0 24 24"><path d="M21 3 10.500 13.500M21 3l-6.500 18-4-7.500L3 9.500z" /></svg>
              </span>
              {n > 1 && (
                <span className="stb-pips" aria-hidden="true">
                  {Array.from({ length: n }, (_, i) => <i key={i} data-on={i === at ? "1" : "0"} />)}
                </span>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
