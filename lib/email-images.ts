/**
 * Image audit of the rendered email, run against the preview frame's
 * document: does each image load, is it being shown larger than the file
 * (soft), squashed out of proportion, or only just big enough (soft on
 * high-density screens), and how heavy is it. Everything here is measured
 * from the page, so it is true of this email by inspection.
 */

export interface ImageRow {
  /** file name, for display */
  name: string;
  src: string;
  /** the file's own pixel size; 0 when it did not load */
  naturalWidth: number;
  naturalHeight: number;
  /** the size it is shown at in the preview */
  shownWidth: number;
  shownHeight: number;
  /** did not load at all */
  broken: boolean;
  /** shown wider than the file is: the browser stretches it and it goes soft */
  stretched: boolean;
  /** shown at a different shape from the file */
  distorted: boolean;
  /** file is under 1.5 times the shown size, so it is soft on phone and laptop screens with dense pixels */
  lowDensity: boolean;
  /** bytes, once measured; null when the host does not allow it to be read */
  bytes: number | null;
  /** how many times this file is used */
  uses: number;
}

export interface ImageReport {
  rows: ImageRow[];
  broken: number;
  stretched: number;
  distorted: number;
  lowDensity: number;
}

/** Decorative slivers (spacers, rules, tracking pixels) are not worth a density warning. */
const SMALL = 24;

export function auditImages(doc: Document): ImageReport {
  const byUrl = new Map<string, ImageRow>();
  for (const img of doc.querySelectorAll("img")) {
    const src = img.currentSrc || img.getAttribute("src") || "";
    if (!src || src.startsWith("data:")) continue;
    const seen = byUrl.get(src);
    if (seen) {
      seen.uses++;
      continue;
    }
    const rect = img.getBoundingClientRect();
    const shownWidth = Math.round(rect.width);
    const shownHeight = Math.round(rect.height);
    const { naturalWidth, naturalHeight } = img;
    const broken = img.complete && naturalWidth === 0;
    const visible = shownWidth > 0 && shownHeight > 0;
    const meaningful = visible && shownWidth > SMALL && shownHeight > SMALL;
    const stretched = !broken && visible && naturalWidth > 0 && shownWidth > naturalWidth + 1;
    const distorted =
      !broken && meaningful && naturalWidth > 0 && naturalHeight > 0 && Math.abs(shownWidth / shownHeight - naturalWidth / naturalHeight) / (naturalWidth / naturalHeight) > 0.04;
    const lowDensity = !broken && !stretched && meaningful && naturalWidth > 0 && naturalWidth < shownWidth * 1.5;
    byUrl.set(src, {
      name: decodeURIComponent(src.split(/[?#]/)[0].split("/").pop() ?? src).slice(-40),
      src,
      naturalWidth,
      naturalHeight,
      shownWidth,
      shownHeight,
      broken,
      stretched,
      distorted,
      lowDensity,
      bytes: null,
      uses: 1,
    });
  }
  const rows = [...byUrl.values()];
  return {
    rows,
    broken: rows.filter((r) => r.broken).length,
    stretched: rows.filter((r) => r.stretched).length,
    distorted: rows.filter((r) => r.distorted).length,
    lowDensity: rows.filter((r) => r.lowDensity).length,
  };
}

/** File sizes, read where the image host allows it. Resolves to a map of src to bytes. */
export async function measureImageBytes(srcs: string[], signal: AbortSignal): Promise<Map<string, number>> {
  const sizes = new Map<string, number>();
  await Promise.all(
    srcs.map(async (src) => {
      try {
        const res = await fetch(src, { mode: "cors", cache: "reload", signal });
        if (!res.ok) return;
        sizes.set(src, (await res.blob()).size);
      } catch {
        // The host does not allow the read, or the request was dropped: size stays unknown.
      }
    }),
  );
  return sizes;
}
