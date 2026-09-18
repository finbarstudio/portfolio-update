/**
 * media() — THE way an asset under public/media reaches a browser.
 *
 * Locally (NEXT_PUBLIC_MEDIA_URL unset) it is a no-op: "/media/images/x.webp"
 * is served straight off disk by Next. In production the variable is the
 * Cloudflare R2 hostname, public/media is not deployed to Vercel at all
 * (.vercelignore), and the same path becomes
 *
 *   https://media.finbar.studio/images/x.webp?v=<manifest hash>
 *
 * The bucket root IS public/media, so the "/media" prefix drops off. `v` comes
 * from content/media-manifest.json and changes whenever any media file does,
 * which is what lets the bucket serve everything as immutable for a year.
 *
 * Never write the hostname into source. See AGENTS.md, "The media rule".
 */
import manifest from "@/content/media-manifest.json";

const BASE = (process.env.NEXT_PUBLIC_MEDIA_URL ?? "").replace(/\/+$/, "");
const PREFIX = "/media/";

export const MEDIA_BASE = BASE;

export function media<T extends string | undefined | null>(src: T): T {
  if (!BASE || typeof src !== "string" || !src.startsWith(PREFIX)) return src;
  // The bucket root is public/media, so "/media" drops off. Only spaces need
  // escaping; literals that are already percent-encoded pass through untouched.
  const path = src.slice(PREFIX.length - 1).replace(/ /g, "%20");
  return `${BASE}${path}?v=${manifest.hash}` as T;
}

/** media() over every string in a content tree (content/projects.ts etc). */
export function mediaDeep<T>(value: T): T {
  if (typeof value === "string") return media(value) as T;
  if (Array.isArray(value)) return value.map(mediaDeep) as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = mediaDeep(v);
    return out as T;
  }
  return value;
}

/** Absolute URL for metadata and JSON-LD, whichever origin the file lives on. */
export function absoluteMedia(src: string, siteUrl: string): string {
  const url = media(src);
  return /^https?:\/\//.test(url) ? url : `${siteUrl}${url}`;
}
