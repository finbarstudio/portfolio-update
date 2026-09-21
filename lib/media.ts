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
 * The bucket root IS public/media, so the "/media" prefix drops off. `v` is the
 * file's own content hash from content/media-versions.json: it changes only
 * when that file does, which lets the bucket serve everything as immutable for
 * a year and keeps Vercel from re-optimising images that did not change.
 *
 * Never write the hostname into source. See AGENTS.md, "The media rule".
 */
import versions from "@/content/media-versions.json";

const BASE = (process.env.NEXT_PUBLIC_MEDIA_URL ?? "").replace(/\/+$/, "");
const PREFIX = "/media/";

export const MEDIA_BASE = BASE;

const VERSIONS = versions as Record<string, string>;
function version(path: string): string {
  let key = path.slice(1);
  try { key = decodeURIComponent(key); } catch { /* keep as written */ }
  return VERSIONS[key] ?? "1"; // cursors/ are not versioned: they never change
}

export function media<T extends string | undefined | null>(src: T): T {
  if (!BASE || typeof src !== "string" || !src.startsWith(PREFIX)) return src;
  // The bucket root is public/media, so "/media" drops off. Only spaces need
  // escaping; literals that are already percent-encoded pass through untouched.
  const path = src.slice(PREFIX.length - 1).replace(/ /g, "%20");
  return `${BASE}${path}?v=${version(path)}` as T;
}

/**
 * corsMedia() — the address to use when a media file is requested WITH CORS:
 * a three.js texture, a `crossOrigin="anonymous"` <img> or <video>, a fetch().
 * Pass it a URL that has already been through media().
 *
 * WHY. One address must only ever be asked for one way. The bucket serves every
 * file as immutable for a year, and it only adds its CORS headers (and
 * `Vary: Origin`) when the request carries an Origin. So if a plain <img> gets
 * there first, the browser keeps a copy with no CORS headers and no Vary, and
 * for the next year hands that copy to any CORS request for the same address,
 * which is then refused: the texture never loads, the image shows nothing. It
 * only bites browsers that happened to make the plain request first, so it
 * looks fine on a fresh machine and broken on the owner's.
 *
 * The extra parameter means nothing to the bucket. It just gives the CORS
 * request an address of its own, so the two copies can never be mixed up.
 */
export function corsMedia<T extends string | undefined | null>(url: T): T {
  if (typeof url !== "string" || url.startsWith("data:") || url.startsWith("blob:")) return url;
  if (/[?&]cors=1(&|$)/.test(url)) return url;
  return `${url}${url.includes("?") ? "&" : "?"}cors=1` as T;
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
