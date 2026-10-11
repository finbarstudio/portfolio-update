/**
 * Framing for screen media that is not the shape of the screen: instead of cropping or letterboxing it, the media
 * sits in a window (or a plain card) over a backdrop, the way a screenshot is usually presented.
 */

export type FrameStyle = "none" | "window" | "browser" | "card";

export interface MediaFrame {
  style: FrameStyle;
  /** Hex colour of the window itself: its title bar and whatever shows around the media inside it. */
  windowColor: string;
  /** Id of a built-in wallpaper behind the window, or null to use `backdropColor`. */
  wallpaper: string | null;
  /** Hex colour behind the window when no wallpaper is chosen. */
  backdropColor: string;
  /** Gap between the window and the edge of the screen, 0..40, percent of the screen's short side. */
  screenPadding: number;
  /** Gap between the media and the edge of the window, 0..20, percent of the screen's short side. */
  mediaPadding: number;
  /** Corner rounding, 0..100. */
  radius: number;
  /** Drop shadow under the window, 0..100. */
  shadow: number;
}

export const DEFAULT_FRAME: MediaFrame = {
  style: "none",
  windowColor: "#1c1c1e",
  wallpaper: "dusk",
  backdropColor: "#0c0c0d",
  screenPadding: 8,
  mediaPadding: 0,
  radius: 40,
  shadow: 60,
};

export const FRAME_STYLES: { value: FrameStyle; label: string }[] = [
  { value: "none", label: "None" },
  { value: "window", label: "Window" },
  { value: "browser", label: "Browser" },
  { value: "card", label: "Card" },
];

/** A soft blob of colour: centre and radius as fractions of the picture's width and height. */
interface Blob {
  x: number;
  y: number;
  r: number;
  color: string;
}

export interface Wallpaper {
  id: string;
  name: string;
  base: string;
  blobs: Blob[];
}

/** Drawn, not downloaded: a base colour with a few large soft blobs of light over it. */
export const WALLPAPERS: Wallpaper[] = [
  {
    id: "dusk",
    name: "Dusk",
    base: "#1b1033",
    blobs: [
      { x: 0.15, y: 0.2, r: 0.75, color: "#ff5e7e" },
      { x: 0.9, y: 0.15, r: 0.7, color: "#7a3cff" },
      { x: 0.7, y: 1, r: 0.8, color: "#ffb347" },
    ],
  },
  {
    id: "ocean",
    name: "Ocean",
    base: "#04162e",
    blobs: [
      { x: 0.1, y: 0.9, r: 0.8, color: "#00c2ff" },
      { x: 0.95, y: 0.1, r: 0.75, color: "#2b5bff" },
      { x: 0.6, y: 0.55, r: 0.5, color: "#19e6c1" },
    ],
  },
  {
    id: "aurora",
    name: "Aurora",
    base: "#03130f",
    blobs: [
      { x: 0.2, y: 0.1, r: 0.7, color: "#2bff9a" },
      { x: 0.85, y: 0.35, r: 0.7, color: "#3a7bff" },
      { x: 0.5, y: 1.05, r: 0.7, color: "#b44dff" },
    ],
  },
  {
    id: "peach",
    name: "Peach",
    base: "#ffd9c2",
    blobs: [
      { x: 0.1, y: 0.1, r: 0.75, color: "#ff8fa3" },
      { x: 0.95, y: 0.3, r: 0.7, color: "#ffc46b" },
      { x: 0.5, y: 1.05, r: 0.75, color: "#ffe9a8" },
    ],
  },
  {
    id: "sand",
    name: "Sand",
    base: "#e9e2d6",
    blobs: [
      { x: 0.15, y: 0.15, r: 0.8, color: "#f6f1e8" },
      { x: 0.9, y: 0.9, r: 0.8, color: "#cfc3ae" },
    ],
  },
  {
    id: "forest",
    name: "Forest",
    base: "#0b1f17",
    blobs: [
      { x: 0.2, y: 0.85, r: 0.8, color: "#2f8f5b" },
      { x: 0.9, y: 0.1, r: 0.7, color: "#c8d96b" },
    ],
  },
  {
    id: "graphite",
    name: "Graphite",
    base: "#101114",
    blobs: [
      { x: 0.2, y: 0.1, r: 0.8, color: "#3a3d46" },
      { x: 0.9, y: 1, r: 0.8, color: "#1d1f25" },
    ],
  },
  {
    id: "paper",
    name: "Paper",
    base: "#f3f1ee",
    blobs: [
      { x: 0.1, y: 0.1, r: 0.9, color: "#ffffff" },
      { x: 1, y: 1, r: 0.8, color: "#dedbd5" },
    ],
  },
];

export function getWallpaper(id: string | null): Wallpaper | null {
  return WALLPAPERS.find((wallpaper) => wallpaper.id === id) ?? null;
}

/** The same wallpaper as a CSS background, for the swatches. */
export function wallpaperCss(wallpaper: Wallpaper): string {
  const blobs = wallpaper.blobs.map(
    (blob) =>
      `radial-gradient(circle at ${blob.x * 100}% ${blob.y * 100}%, ${blob.color} 0%, transparent ${blob.r * 100}%)`,
  );
  return [...blobs, wallpaper.base].join(", ");
}

/** Paint a wallpaper over the whole canvas. */
export function drawWallpaper(
  ctx: CanvasRenderingContext2D,
  wallpaper: Wallpaper,
  width: number,
  height: number,
): void {
  ctx.fillStyle = wallpaper.base;
  ctx.fillRect(0, 0, width, height);
  const reach = Math.max(width, height);
  for (const blob of wallpaper.blobs) {
    const x = blob.x * width;
    const y = blob.y * height;
    const glow = ctx.createRadialGradient(x, y, 0, x, y, blob.r * reach);
    glow.addColorStop(0, blob.color);
    glow.addColorStop(1, `${blob.color}00`);
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
  }
}

/** Whether a hex colour is light enough to need dark details drawn on it. */
function isLight(hex: string): boolean {
  const n = Number.parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 150;
}

/** Title bar height as a fraction of the screen's short side. */
const BAR: Record<FrameStyle, number> = {
  none: 0,
  card: 0,
  window: 0.05,
  browser: 0.085,
};

/**
 * Paint the framed picture: backdrop, shadow, window, its bar, and the media inside. The window takes the media's
 * own shape, as large as the padding allows, so the media is never cropped or stretched.
 */
export function drawFramed(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  frame: MediaFrame,
): void {
  const short = Math.min(width, height);
  const wallpaper = getWallpaper(frame.wallpaper);
  if (wallpaper) drawWallpaper(ctx, wallpaper, width, height);
  else {
    ctx.fillStyle = frame.backdropColor;
    ctx.fillRect(0, 0, width, height);
  }
  if (sourceWidth <= 0 || sourceHeight <= 0) return;

  const outer = (frame.screenPadding / 100) * short;
  const inner = (frame.mediaPadding / 100) * short;
  const bar = BAR[frame.style] * short;
  const aspect = sourceWidth / sourceHeight;
  const roomWidth = Math.max(1, width - outer * 2);
  const roomHeight = Math.max(1, height - outer * 2);
  // As wide as the room allows, unless that would make it too tall.
  const windowWidth = Math.min(
    roomWidth,
    Math.max(1, roomHeight - bar - inner * 2) * aspect + inner * 2,
  );
  const mediaWidth = Math.max(1, windowWidth - inner * 2);
  const mediaHeight = mediaWidth / aspect;
  const windowHeight = bar + mediaHeight + inner * 2;
  const x = (width - windowWidth) / 2;
  const y = (height - windowHeight) / 2;
  const radius = Math.min(
    (frame.radius / 100) * 0.06 * short,
    windowWidth / 2,
    windowHeight / 2,
  );

  ctx.save();
  if (frame.shadow > 0) {
    ctx.shadowColor = `rgba(0, 0, 0, ${0.2 + 0.4 * (frame.shadow / 100)})`;
    ctx.shadowBlur = (frame.shadow / 100) * 0.09 * short;
    ctx.shadowOffsetY = (frame.shadow / 100) * 0.03 * short;
  }
  ctx.fillStyle = frame.windowColor;
  ctx.beginPath();
  ctx.roundRect(x, y, windowWidth, windowHeight, radius);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, windowWidth, windowHeight, radius);
  ctx.clip();

  const light = isLight(frame.windowColor);
  if (bar > 0) {
    const dot = bar * (frame.style === "browser" ? 0.16 : 0.26);
    const middle = y + (frame.style === "browser" ? bar * 0.5 : bar / 2);
    const first = x + dot * 2.6;
    for (const [i, color] of ["#ff5f57", "#febc2e", "#28c840"].entries()) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(first + i * dot * 3.2, middle, dot, 0, Math.PI * 2);
      ctx.fill();
    }
    if (frame.style === "browser") {
      // The address field: a pill a shade away from the window.
      const fieldHeight = bar * 0.5;
      const fieldLeft = first + dot * 10;
      const fieldWidth = Math.max(0, windowWidth - (fieldLeft - x) - dot * 5);
      ctx.fillStyle = light
        ? "rgba(0, 0, 0, 0.07)"
        : "rgba(255, 255, 255, 0.09)";
      ctx.beginPath();
      ctx.roundRect(
        fieldLeft,
        middle - fieldHeight / 2,
        fieldWidth,
        fieldHeight,
        fieldHeight / 2,
      );
      ctx.fill();
    }
    // A hairline under the bar, only where the media meets it.
    if (inner === 0) {
      ctx.fillStyle = light
        ? "rgba(0, 0, 0, 0.1)"
        : "rgba(255, 255, 255, 0.08)";
      ctx.fillRect(x, y + bar - 1, windowWidth, 1);
    }
  }

  const mediaX = x + inner;
  const mediaY = y + bar + inner;
  if (inner > 0) {
    ctx.beginPath();
    ctx.roundRect(mediaX, mediaY, mediaWidth, mediaHeight, radius * 0.5);
    ctx.clip();
  }
  ctx.drawImage(source, mediaX, mediaY, mediaWidth, mediaHeight);
  ctx.restore();
}
