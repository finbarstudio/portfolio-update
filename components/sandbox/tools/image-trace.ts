/**
 * image-trace — turn an uploaded raster (PNG/JPG) into an SVG string via
 * imagetracerjs, so a logo can be traced to vector and fed straight into the
 * Bezier Studio's SVG parser. Loaded dynamically (client-only) so the tracer
 * never touches the server bundle.
 */

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => rej(new Error("Could not read that image."));
    img.src = src;
  });
}

export type TraceOpts = { colors?: number; detail?: number; maxDim?: number };

export async function traceImageToSVG(dataUrl: string, opts: TraceOpts = {}): Promise<string> {
  const mod = (await import("imagetracerjs")) as unknown as {
    default?: { imagedataToSVG: (d: ImageData, o: Record<string, unknown>) => string };
    imagedataToSVG?: (d: ImageData, o: Record<string, unknown>) => string;
  };
  const ImageTracer = mod.default ?? mod;
  if (!ImageTracer.imagedataToSVG) throw new Error("Tracer failed to load.");

  const img = await loadImage(dataUrl);
  // Downscale large images so the trace stays fast and the path count sane.
  const maxDim = opts.maxDim ?? 560;
  const scale = Math.min(1, maxDim / Math.max(img.width || 1, img.height || 1));
  const w = Math.max(1, Math.round((img.width || 1) * scale));
  const h = Math.max(1, Math.round((img.height || 1) * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable.");
  ctx.drawImage(img, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h);

  const detail = Math.max(0.1, opts.detail ?? 1); // higher = simpler/smoother
  const svg = ImageTracer.imagedataToSVG(data, {
    numberofcolors: Math.max(2, Math.min(32, Math.round(opts.colors ?? 8))),
    ltres: detail,
    qtres: detail,
    pathomit: Math.round(8 * detail),
    rightangleenhance: false,
    linefilter: true,
    blurradius: 0,
    strokewidth: 0,
    scale: 1,
  });
  return svg;
}
