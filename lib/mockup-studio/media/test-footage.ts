/**
 * A stand-in screen recording, drawn and encoded in the browser at the shape of
 * the current device's screen: a feed of vivid cards on true black that scrolls
 * exactly one full cycle, so it loops without a jump. The running timecode makes
 * it easy to see whether the video stays in step with the animation.
 */

const SECONDS = 8;
const FPS = 30;
const MAX_LONG_EDGE = 1920;
const BITS_PER_PIXEL = 0.12;
const ROWS = 6;
const HUES = [338, 262, 204, 158, 38, 12];

interface Layout {
  width: number;
  height: number;
  /** One hundredth of the short edge: every measure below is in these. */
  unit: number;
  columns: number;
  cardWidth: number;
  cardHeight: number;
  rowHeight: number;
  header: number;
}

function layoutFor(width: number, height: number): Layout {
  const unit = Math.min(width, height) / 100;
  const columns = width > height * 1.2 ? 3 : width > height * 0.8 ? 2 : 1;
  const gap = 4 * unit;
  const cardWidth = (width - gap * (columns + 1)) / columns;
  const cardHeight = cardWidth * 0.6;
  return {
    width,
    height,
    unit,
    columns,
    cardWidth,
    cardHeight,
    rowHeight: cardHeight + 15 * unit,
    header: 16 * unit,
  };
}

function timecode(frame: number): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(Math.floor(frame / FPS))}:${pad(frame % FPS)}`;
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  layout: Layout,
  frame: number,
  frameCount: number,
): void {
  const { width, height, unit, columns, cardWidth, cardHeight, rowHeight } =
    layout;
  const gap = 4 * unit;
  const scroll = (frame / frameCount) * ROWS * rowHeight;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);

  const firstRow = Math.floor(scroll / rowHeight);
  const visibleRows = Math.ceil(height / rowHeight) + 1;
  for (let row = firstRow; row < firstRow + visibleRows; row++) {
    const y = layout.header + gap + row * rowHeight - scroll;
    for (let column = 0; column < columns; column++) {
      const x = gap + column * (cardWidth + gap);
      const hue = HUES[(row * columns + column) % HUES.length] ?? 0;
      const fill = ctx.createLinearGradient(
        x,
        y,
        x + cardWidth,
        y + cardHeight,
      );
      fill.addColorStop(0, `hsl(${hue} 100% 52%)`);
      fill.addColorStop(1, `hsl(${(hue + 50) % 360} 95% 36%)`);
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.roundRect(x, y, cardWidth, cardHeight, 3 * unit);
      ctx.fill();

      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.roundRect(
        x,
        y + cardHeight + 3 * unit,
        cardWidth * 0.62,
        2.4 * unit,
        unit,
      );
      ctx.fill();
      ctx.fillStyle = "#6b6b70";
      ctx.beginPath();
      ctx.roundRect(
        x,
        y + cardHeight + 7.4 * unit,
        cardWidth * 0.38,
        1.8 * unit,
        unit,
      );
      ctx.fill();
    }
  }

  // The header stays put while the feed scrolls beneath it.
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, layout.header);
  ctx.fillStyle = "#fff";
  ctx.textBaseline = "middle";
  ctx.font = `600 ${5 * unit}px system-ui, sans-serif`;
  ctx.textAlign = "left";
  ctx.fillText("Test footage", gap, layout.header * 0.58);
  ctx.font = `500 ${3.6 * unit}px system-ui, sans-serif`;
  ctx.textAlign = "right";
  ctx.fillStyle = "#9a9aa0";
  ctx.fillText(timecode(frame), width - gap, layout.header * 0.58);
}

/** Fit the screen's pixel size under the long-edge cap, with the even dimensions H.264 needs. */
function videoSize([width, height]: [number, number]): [number, number] {
  const scale = Math.min(1, MAX_LONG_EDGE / Math.max(width, height));
  const even = (n: number) => Math.max(2, Math.round((n * scale) / 2) * 2);
  return [even(width), even(height)];
}

/** Draw and encode the test clip for a screen of the given pixel size. */
export async function createTestFootage(
  screen: [number, number],
): Promise<File> {
  const [width, height] = videoSize(screen);
  const {
    BufferTarget,
    CanvasSource,
    Mp4OutputFormat,
    Output,
    Quality,
    canEncodeVideo,
  } = await import("mediabunny");

  const quality = new Quality({
    bitrate: Math.round(width * height * FPS * BITS_PER_PIXEL),
  });
  if (
    !(await canEncodeVideo("avc", { width, height, quality, frameRate: FPS }))
  )
    throw new Error("This browser cannot encode the test footage.");

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not draw the test footage.");

  const layout = layoutFor(width, height);
  const frameCount = SECONDS * FPS;
  const target = new BufferTarget();
  const output = new Output({
    format: new Mp4OutputFormat({ fastStart: "in-memory" }),
    target,
  });
  try {
    const source = new CanvasSource(canvas, { codec: "avc", quality });
    output.addVideoTrack(source, { frameRate: FPS });
    await output.start();
    for (let frame = 0; frame < frameCount; frame++) {
      drawFrame(ctx, layout, frame, frameCount);
      await source.add(frame / FPS, 1 / FPS);
    }
    source.close();
    await output.finalize();
  } catch (error) {
    if (output.state !== "finalized" && output.state !== "canceled")
      await output.cancel().catch(() => {});
    throw error;
  }
  if (!target.buffer) throw new Error("The encoder produced no data.");
  return new File([target.buffer], `test-footage-${width}x${height}.mp4`, {
    type: "video/mp4",
  });
}
