/**
 * media — upload validation + the media-asset model for the phone-mockup tool.
 *
 * Mixed images and videos are allowed (each item tagged). We read intrinsic
 * dimensions so the fit math + aspect warnings work, and own the object URLs so
 * they can be revoked on remove/unmount (no leaks). Demo reels seed the canvas
 * so it's never empty (and, being public URLs, are embeddable).
 */

import { MAX_PHONES, MIN_PHONES, type PhoneMediaKind } from "@/components/phone/phone-config";

export { MAX_PHONES, MIN_PHONES };

export const ACCEPTED_IMAGE = ["image/png", "image/jpeg", "image/webp"];
export const ACCEPTED_VIDEO = ["video/mp4", "video/webm"];
export const ACCEPTED_TYPES = [...ACCEPTED_IMAGE, ...ACCEPTED_VIDEO];
export const ACCEPT_ATTR = ACCEPTED_TYPES.join(",");

export const SOFT_CAP_IMAGE = 25 * 1024 * 1024; // 25MB
export const SOFT_CAP_VIDEO = 50 * 1024 * 1024; // 50MB
export const HARD_CAP = 100 * 1024 * 1024; // 100MB

export type MediaAsset = {
  id: string;
  kind: PhoneMediaKind;
  /** Object URL (uploaded) or public URL (demo). */
  src: string;
  name: string;
  width: number;
  height: number;
  /** True for public seed media (no object URL to revoke; embeddable). */
  isDemo?: boolean;
};

let _seq = 0;
function genId(): string {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  } catch {
    /* fall through */
  }
  return `m${Date.now().toString(36)}-${_seq++}`;
}

export function kindOf(type: string): PhoneMediaKind | null {
  if (ACCEPTED_IMAGE.includes(type)) return "image";
  if (ACCEPTED_VIDEO.includes(type)) return "video";
  return null;
}

/** Read intrinsic dimensions from an object URL for the given kind. */
export function readDimensions(url: string, kind: PhoneMediaKind): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    if (kind === "image") {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth || 1, height: img.naturalHeight || 1 });
      img.onerror = () => resolve({ width: 1, height: 1 });
      img.src = url;
    } else {
      const v = document.createElement("video");
      v.preload = "metadata";
      v.muted = true;
      v.onloadedmetadata = () => resolve({ width: v.videoWidth || 1, height: v.videoHeight || 1 });
      v.onerror = () => resolve({ width: 1, height: 1 });
      v.src = url;
    }
  });
}

export type IngestResult = {
  assets: MediaAsset[];
  errors: string[];
  warnings: string[];
};

/**
 * Validate + ingest dropped/selected files against the current asset count.
 * Rejects unsupported types, enforces the 1..10 count cap and the hard size cap,
 * warns on soft size limits, and reads dimensions for each accepted file.
 */
export async function ingestFiles(files: File[], existingCount: number): Promise<IngestResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const accepted: MediaAsset[] = [];

  let slots = MAX_PHONES - existingCount;
  if (slots <= 0) {
    errors.push(`You can use up to ${MAX_PHONES} items. Remove one to add more.`);
    return { assets: [], errors, warnings };
  }

  for (const file of files) {
    const kind = kindOf(file.type);
    if (!kind) {
      errors.push(`"${file.name}" — unsupported type (${file.type || "unknown"}). Use PNG/JPEG/WebP or MP4/WebM.`);
      continue;
    }
    if (file.size > HARD_CAP) {
      errors.push(`"${file.name}" is too large (${mb(file.size)}). Max ${mb(HARD_CAP)}.`);
      continue;
    }
    if (slots <= 0) {
      warnings.push(`Reached the ${MAX_PHONES}-item limit — "${file.name}" was skipped.`);
      continue;
    }
    const softCap = kind === "image" ? SOFT_CAP_IMAGE : SOFT_CAP_VIDEO;
    if (file.size > softCap) {
      warnings.push(`"${file.name}" is large (${mb(file.size)}) — exports may be slow.`);
    }

    const src = URL.createObjectURL(file);
    const { width, height } = await readDimensions(src, kind);
    accepted.push({ id: genId(), kind, src, name: file.name, width, height });
    slots--;
  }

  return { assets: accepted, errors, warnings };
}

/** Revoke an asset's object URL (no-op for demo/public URLs). */
export function revokeAsset(asset: MediaAsset): void {
  if (asset.isDemo) return;
  if (asset.src.startsWith("blob:")) {
    try {
      URL.revokeObjectURL(asset.src);
    } catch {
      /* ignore */
    }
  }
}

function mb(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(0)}MB`;
}

const TMYR_REELS = ["Anthony", "Freya", "Katie", "Kiran", "Lauren", "Molly", "Olu"];

/** Public TMYR reels — seed media so the canvas is never empty (and embeddable). */
export const DEMO_MEDIA: MediaAsset[] = TMYR_REELS.map((name) => ({
  id: `demo-${name.toLowerCase()}`,
  kind: "video" as const,
  src: `/images/tmyr/1080x1920%20IG%20Reels/${name}.webm`,
  name: `${name}.webm`,
  width: 1080,
  height: 1920,
  isDemo: true,
}));
