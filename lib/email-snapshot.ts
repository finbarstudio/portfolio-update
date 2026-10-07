/**
 * A picture of the whole preview, top to bottom, made in the browser with no
 * library: the previewed document is copied, its images are read in as data
 * (so the canvas is allowed to export them), the copy is drawn through an SVG
 * foreignObject onto a canvas, and the canvas is saved small.
 *
 * Images on a host that does not allow cross-origin reads cannot be included;
 * they are drawn as grey boxes and counted, so the caller can say so.
 */

export interface Snapshot {
  blob: Blob;
  width: number;
  height: number;
  /** images that could not be read and were drawn as placeholders */
  skipped: number;
}

/** Longest side the canvas is allowed; keeps the file light and inside browser canvas limits. */
const MAX_WIDTH = 900;
const MAX_HEIGHT = 12000;
const QUALITY = 0.72;

async function toDataUrl(url: string, cache: Map<string, Promise<string | null>>): Promise<string | null> {
  if (url.startsWith("data:")) return url;
  let pending = cache.get(url);
  if (!pending) {
    // "reload" skips the browser cache: the preview already loaded these images without CORS,
    // and a cached copy of that response is refused for a CORS read.
    pending = fetch(url, { mode: "cors", cache: "reload" })
      .then((res) => (res.ok ? res.blob() : Promise.reject(new Error(String(res.status)))))
      .then(
        (blob) =>
          new Promise<string | null>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : null);
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(blob);
          }),
      )
      .catch(() => null);
    cache.set(url, pending);
  }
  return pending;
}

/** Replaces every url(...) in a piece of CSS with the image's data, or with none when it cannot be read. */
async function inlineCssUrls(css: string, base: string, cache: Map<string, Promise<string | null>>, onSkip: () => void): Promise<string> {
  const matches = [...css.matchAll(/url\(\s*(['"]?)([^)'"]*)\1\s*\)/gi)];
  let out = css;
  for (const m of matches) {
    const raw = m[2].trim();
    if (!raw) continue;
    let data: string | null = null;
    try {
      data = await toDataUrl(new URL(raw, base).href, cache);
    } catch {
      data = null;
    }
    if (!data) onSkip();
    out = out.replace(m[0], data ? `url("${data}")` : "none");
  }
  return out;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("The preview could not be drawn."));
    img.src = src;
  });
}

function canvasBlob(canvas: HTMLCanvasElement, type: string): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, QUALITY));
}

export async function snapshotDocument(doc: Document): Promise<Snapshot> {
  const root = doc.documentElement;
  const width = root.clientWidth;
  const height = Math.max(root.scrollHeight, doc.body?.scrollHeight ?? 0);
  if (!width || !height) throw new Error("There is no preview to capture yet.");

  const cache = new Map<string, Promise<string | null>>();
  let skipped = 0;
  const skip = () => {
    skipped++;
  };
  const base = doc.baseURI.startsWith("about:") ? window.location.href : doc.baseURI;

  const clone = root.cloneNode(true) as HTMLElement;
  for (const el of clone.querySelectorAll("script, link, meta, title, iframe, object, embed")) el.remove();
  // Comments go too: Outlook's conditional comments are not well-formed XML ("<!--[if !mso]><!-- -->").
  const comments: Node[] = [];
  const walker = doc.createTreeWalker(clone, NodeFilter.SHOW_COMMENT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) comments.push(node);
  for (const node of comments) node.parentNode?.removeChild(node);

  for (const img of clone.querySelectorAll("img")) {
    const src = img.getAttribute("src");
    img.removeAttribute("srcset");
    img.removeAttribute("loading");
    if (!src) continue;
    let data: string | null = null;
    try {
      data = await toDataUrl(new URL(src, base).href, cache);
    } catch {
      data = null;
    }
    if (data) {
      img.setAttribute("src", data);
    } else {
      skip();
      img.removeAttribute("src");
      img.setAttribute("style", `${img.getAttribute("style") ?? ""};background:#cccccc;`);
    }
  }
  for (const el of clone.querySelectorAll<HTMLElement>("[style*='url(']")) {
    el.setAttribute("style", await inlineCssUrls(el.getAttribute("style") ?? "", base, cache, skip));
  }
  for (const el of clone.querySelectorAll<HTMLElement>("[background]")) {
    const raw = el.getAttribute("background") ?? "";
    el.removeAttribute("background");
    if (!raw) continue;
    let data: string | null = null;
    try {
      data = await toDataUrl(new URL(raw, base).href, cache);
    } catch {
      data = null;
    }
    if (data) el.setAttribute("style", `background-image:url("${data}");${el.getAttribute("style") ?? ""}`);
    else skip();
  }
  for (const style of clone.querySelectorAll("style")) {
    style.textContent = await inlineCssUrls(style.textContent ?? "", base, cache, skip);
  }

  // Filters inside an SVG default to linear RGB, which shifts the colours of an inverted
  // (dark mode) preview; the page itself filters in sRGB, so ask for the same here.
  clone.setAttribute("style", `${clone.getAttribute("style") ?? ""};color-interpolation-filters:sRGB;`);
  // The copy has to be well-formed XML to sit inside an SVG.
  const markup = new XMLSerializer().serializeToString(clone);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" color-interpolation-filters="sRGB"><foreignObject x="0" y="0" width="${width}" height="${height}">${markup}</foreignObject></svg>`;
  const picture = await loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);

  const scale = Math.min(1, MAX_WIDTH / width, MAX_HEIGHT / height);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("This browser could not make a canvas.");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(picture, 0, 0, canvas.width, canvas.height);

  // WebP where the browser can write it (smaller for flat colour), JPEG otherwise.
  let blob: Blob | null;
  try {
    blob = await canvasBlob(canvas, "image/webp");
    if (!blob || blob.type !== "image/webp") blob = await canvasBlob(canvas, "image/jpeg");
  } catch {
    throw new Error("The browser would not export the picture, usually because an image in the email comes from a host that blocks it.");
  }
  if (!blob) throw new Error("The picture could not be saved.");
  return { blob, width: canvas.width, height: canvas.height, skipped };
}
