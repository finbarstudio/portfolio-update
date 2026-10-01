"use client";

import { useEffect, useRef, useState } from "react";
import { generatePathway, type Pathway } from "./pathway";
import { BRANDS, GRADIENT, textPresets, type BrandKey } from "./palette";
import { media, corsMedia } from "@/lib/media";

/**
 * Share to Buy pathway maker. One screen, no scroll: controls on the left, the
 * canvas on the right. The canvas is always drawn at export size (long side
 * 2048) and scaled down to fit, so what you see is exactly what downloads.
 */

const LONG = 2048;
const SIZES = [
  { label: "1:1", w: LONG, h: LONG },
  { label: "4:3", w: LONG, h: 1536 },
  { label: "3:4", w: 1536, h: LONG },
  { label: "Reel 9:16", w: 1152, h: LONG },
  { label: "Desktop 16:9", w: LONG, h: 1152 },
];

/** Line thickness, as a share of the short side. Not adjustable: it is 150px
 *  on a 1080 x 1920 reel and scales with the format. */
const STROKE = 150 / 1080;

/** "Along the path" gradient: how much line one full run of the colours covers
 *  (short side = 1). */
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
  angle: number;
  /** Text reads the other way along the line (and so sits the other way up). */
  flip: boolean;
  /** Gradient runs along the line (water in a pipe) instead of across the canvas. */
  flow: boolean;
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

function canvasGradient(ctx: CanvasRenderingContext2D, w: number, h: number, angle: number, phase: number) {
  const a = (angle * Math.PI) / 180;
  const dx = Math.cos(a);
  const dy = Math.sin(a);
  const span = Math.abs(w * dx) + Math.abs(h * dy);
  // The colours repeat every `span`, and the start slides back by one repeat
  // as phase goes 0 to 1, so the loop joins up with itself.
  const sx = w / 2 - dx * span * (0.5 + phase);
  const sy = h / 2 - dy * span * (0.5 + phase);
  const g = ctx.createLinearGradient(sx, sy, sx + dx * span * 2, sy + dy * span * 2);
  const n = GRADIENT.length;
  for (let i = 0; i <= n * 2; i++) g.addColorStop(i / (n * 2), GRADIENT[i % n]);
  return g;
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

/** Stroke points from..to of the line. */
function strokeLine(ctx: CanvasRenderingContext2D, path: Pathway, S: number, from: number, to: number, look: Look, gPhase: number, w: number, h: number) {
  const { pts, cum } = path;
  if (look.alpha === "line") ctx.globalCompositeOperation = "destination-out"; // cut the line out of the background
  if (look.line === "gradient" && look.flow && look.alpha !== "line") {
    // No canvas gradient can follow a curve, so the line goes down as short
    // pieces, each its own colour, each overlapping the next to hide the joins.
    for (let i = from; i < to; i++) {
      ctx.strokeStyle = flowColour(cum[i] / FLOW_PERIOD - gPhase);
      ctx.beginPath();
      ctx.moveTo(pts[i * 2] * S, pts[i * 2 + 1] * S);
      for (let j = i + 1; j <= Math.min(i + 2, to); j++) ctx.lineTo(pts[j * 2] * S, pts[j * 2 + 1] * S);
      ctx.stroke();
    }
  } else {
    ctx.strokeStyle = look.line === "gradient" ? canvasGradient(ctx, w, h, look.angle, gPhase) : look.line;
    ctx.beginPath();
    ctx.moveTo(pts[from * 2] * S, pts[from * 2 + 1] * S);
    for (let i = from + 1; i <= to; i++) ctx.lineTo(pts[i * 2] * S, pts[i * 2 + 1] * S);
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

function drawText(ctx: CanvasRenderingContext2D, path: Pathway, S: number, look: Look, strokePx: number, tPhase: number, range?: [number, number]) {
  const { size, chars, widths, tracking, period } = ticker(ctx, look.text, strokePx);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const { pts, cum } = path;
  const total = cum[cum.length - 1] * S;
  const n = look.textColours.length;
  const shift = tPhase * n * period;
  for (let k = -Math.ceil(shift / period) - 1; k * period + shift < total; k++) {
    ctx.fillStyle = look.textColours[((k % n) + n) % n];
    let s = k * period + shift;
    for (let c = 0; c < chars.length; c++) {
      // Flipped, the same layout is measured from the far end of the line.
      const at = look.flip ? total - (s + widths[c] / 2) : s + widths[c] / 2;
      s += widths[c] + tracking;
      if (at < 0 || at >= total || (range && (at < range[0] || at > range[1]))) continue;
      const i = locate(cum, at / S);
      const t = (at / S - cum[i]) / (cum[i + 1] - cum[i] || 1);
      const x0 = pts[i * 2], y0 = pts[i * 2 + 1], x1 = pts[i * 2 + 2], y1 = pts[i * 2 + 3];
      ctx.save();
      ctx.translate((x0 + (x1 - x0) * t) * S, (y0 + (y1 - y0) * t) * S);
      ctx.rotate(Math.atan2(y1 - y0, x1 - x0) + (look.flip ? Math.PI : 0));
      // The face sits a touch high on its middle line; nudge to centre the caps.
      ctx.fillText(chars[c], 0, size * 0.04);
      ctx.restore();
    }
  }
}

function render(ctx: CanvasRenderingContext2D, w: number, h: number, path: Pathway, look: Look, gPhase: number, tPhase: number) {
  const S = Math.min(w, h);
  const last = path.pts.length / 2 - 1;
  ctx.globalCompositeOperation = "source-over";
  ctx.clearRect(0, 0, w, h);
  if (look.alpha !== "bg") {
    ctx.fillStyle = look.bg;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.lineWidth = STROKE * S;
  ctx.lineJoin = "round";
  ctx.lineCap = "butt";
  strokeLine(ctx, path, S, 0, last, look, gPhase, w, h);
  if (!look.text) return;

  drawText(ctx, path, S, look, STROKE * S, tPhase);
  // Where the line passes over itself, two runs of text would collide. Lay the
  // upper stretch down again over the crossing, then its own letters on top,
  // so the text underneath slides out of sight beneath it.
  const win = STROKE * 0.75;
  for (const j of path.over) {
    const at = path.cum[j];
    strokeLine(ctx, path, S, locate(path.cum, at - win), Math.min(last, locate(path.cum, at + win) + 1), look, gPhase, w, h);
    drawText(ctx, path, S, look, STROKE * S, tPhase, [(at - win - STROKE) * S, (at + win + STROKE) * S]);
  }
}

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
  const [size, setSize] = useState(4);
  const [seed, setSeed] = useState(1);
  const [p, setP] = useState({ rMin: 0.28, rMax: 0.75, length: 5, loop: 0.3, maxCross: 1 });
  const [text, setText] = useState("");
  const [textPreset, setTextPreset] = useState(0);
  const [flipText, setFlipText] = useState(false);
  /** How fast the text travels: % of the short side per second. */
  const [textSpeed, setTextSpeed] = useState(5);
  const [alpha, setAlpha] = useState<Alpha>("none");
  const [flow, setFlow] = useState(false);
  const [angle, setAngle] = useState(30);
  const [animateGradient, setAnimateGradient] = useState(false);
  const [scrollText, setScrollText] = useState(false);
  const [gradientSecs, setGradientSecs] = useState(8);
  /** The length of one seamless loop, worked out in the draw effect. */
  const [loopSecs, setLoopSecs] = useState(8);
  /** null, or how far through an MP4 export we are (0 to 1). */
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

  const { w, h } = SIZES[size];
  const short = Math.min(w, h);
  const colours = BRANDS[brand].combos[combo];
  const live = brand === "live";
  const isGradient = colours.line === "gradient";
  const shownText = live ? text.trim() : "";
  const gradientMoves = animateGradient && isGradient;
  const textMoves = scrollText && shownText !== "";
  const moving = gradientMoves || textMoves;
  const presets = textPresets(colours.line);
  const path = generatePathway(seed, w / short, h / short, { ...p, stroke: STROKE });

  const look: Look = {
    bg: colours.bg,
    line: colours.line,
    // Video has no transparency, so anything that moves is always solid.
    alpha: moving ? "none" : alpha,
    text: shownText,
    textColours: (presets[textPreset] ?? presets[0]).colours,
    angle,
    flip: flipText,
    flow,
  };

  /**
   * One loop, so that a video always joins up with itself. Scrolling text sets
   * the length: the time it takes to travel one full set of its colours at the
   * chosen speed, after which every letter and colour is back where it began.
   * The gradient then fits a whole number of runs into that time. With no
   * scrolling text the loop is simply the gradient's own length.
   */
  const timing = (ctx: CanvasRenderingContext2D) => {
    if (!textMoves) return { secs: gradientSecs, cycles: 1 };
    const set = ticker(ctx, look.text, STROKE * short).period * look.textColours.length;
    const secs = set / ((textSpeed / 100) * short);
    return { secs, cycles: Math.max(1, Math.round(secs / gradientSecs)) };
  };
  /** Draw the frame at t (0 to 1) through the loop. */
  const frame = (ctx: CanvasRenderingContext2D, t: number, cycles: number) =>
    render(ctx, w, h, path, look, gradientMoves ? (t * cycles) % 1 : 0, textMoves ? t : 0);

  useEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx || recording) return; // an export draws its own frames
    const { secs, cycles } = timing(ctx);
    if (Math.abs(secs - loopSecs) > 0.01) setLoopSecs(secs);
    let raf = 0;
    const draw = () => {
      frame(ctx, moving ? ((performance.now() - clock.current) / 1000 / secs) % 1 : 0, cycles);
      if (moving) raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
    // Runs after every render: any control changing, or the font arriving, redraws.
  });

  const set = (patch: Partial<typeof p>) => setP({ ...p, ...patch });
  const restart = () => { clock.current = performance.now(); };
  const name = `${brand}-pathway-${seed}-${w}x${h}`;

  const downloadPng = () => canvas.current?.toBlob((b) => b && save(b, `${name}.png`), "image/png");

  /**
   * MP4, one loop. Frames are drawn and encoded one at a time, not filmed off
   * the screen, so frame N is exactly t = N / total and the last frame runs
   * straight back into the first, whatever the computer's speed.
   */
  const exportVideo = async () => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx || recording) return;
    if (typeof VideoEncoder === "undefined") {
      window.alert("This browser cannot export video. Use Chrome, Edge or Safari.");
      return;
    }
    setProgress(0);
    try {
      const { Muxer, ArrayBufferTarget } = await import("mp4-muxer");
      const fps = 30;
      const { secs, cycles } = timing(ctx);
      const total = Math.max(1, Math.round(secs * fps));
      const muxer = new Muxer({ target: new ArrayBufferTarget(), video: { codec: "avc", width: w, height: h }, fastStart: "in-memory" });
      const encoder = new VideoEncoder({
        output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
        error: (e) => console.error(e),
      });
      encoder.configure({ codec: "avc1.640033", width: w, height: h, bitrate: 16_000_000, framerate: fps });
      for (let i = 0; i < total; i++) {
        frame(ctx, i / total, cycles);
        const picture = new VideoFrame(el, { timestamp: (i * 1e6) / fps, duration: 1e6 / fps });
        encoder.encode(picture, { keyFrame: i % 60 === 0 });
        picture.close();
        if (i % 5 === 0) {
          setProgress(i / total);
          await new Promise((r) => setTimeout(r)); // let the encoder and the screen catch up
        }
        while (encoder.encodeQueueSize > 8) await new Promise((r) => setTimeout(r, 5));
      }
      await encoder.flush();
      muxer.finalize();
      save(new Blob([muxer.target.buffer], { type: "video/mp4" }), `${name}.mp4`);
    } finally {
      restart();
      setProgress(null);
    }
  };

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
          <h2>Size</h2>
          <div className="stb-seg stb-seg-wrap">
            {SIZES.map((s, i) => (
              <button key={s.label} type="button" aria-pressed={size === i} onClick={() => setSize(i)}>
                {s.label}
              </button>
            ))}
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
            <div className="stb-seg">
              <button type="button" aria-pressed={!flow} onClick={() => setFlow(false)}>Across canvas</button>
              <button type="button" aria-pressed={flow} onClick={() => setFlow(true)}>Along the path</button>
            </div>
            {!flow && <Slider label="Angle" value={angle} min={0} max={360} step={5} onChange={setAngle} show={`${angle}°`} />}
            <label className="stb-check">
              <input type="checkbox" checked={animateGradient} onChange={(e) => { restart(); setAnimateGradient(e.target.checked); }} />
              Animate
            </label>
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
          <button type="button" className="stb-primary" onClick={downloadPng} disabled={recording}>
            Download PNG
          </button>
          {moving && (
            <button type="button" className="stb-primary" onClick={exportVideo} disabled={recording}>
              {recording ? `Making the video ${Math.round((progress ?? 0) * 100)}%` : `Download MP4 · ${loopSecs.toFixed(1)}s loop`}
            </button>
          )}
          <p className="stb-note">
            {w} × {h} · seed {seed} · {path.crossings} overlap{path.crossings === 1 ? "" : "s"}
            {path.clean ? "" : " · closest fit, try another"}
          </p>
          <a className="stb-back" href="/">Back to the lab</a>
        </section>
      </aside>

      <main className="stb-stage">
        <canvas ref={canvas} width={w} height={h} style={{ aspectRatio: `${w} / ${h}`, width: `min(100cqw, calc(100cqh * ${w / h}))` }} />
      </main>
    </div>
  );
}
