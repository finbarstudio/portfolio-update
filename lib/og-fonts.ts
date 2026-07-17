import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Fonts for the next/og share-card routes, read from files committed in
 * assets/og-fonts/ (Google Fonts TTFs, OFL-licensed — satori can't parse
 * woff2, so these are TrueType).
 *
 * These used to be fetched from fonts.googleapis.com at build time; a single
 * transient network failure during prerender left ImageResponse with zero
 * fonts, which is a hard error ("No fonts are loaded") that kills the whole
 * build. It broke three builds (twice locally, once on Vercel) before moving
 * on-disk. Build-time cost only — nothing here reaches the client bundle.
 */
export async function loadOgFonts() {
  const dir = path.join(process.cwd(), "assets", "og-fonts");
  const [host700, mono700, mono400] = await Promise.all([
    readFile(path.join(dir, "host-grotesk-700.ttf")),
    readFile(path.join(dir, "space-mono-700.ttf")),
    readFile(path.join(dir, "space-mono-400.ttf")),
  ]);
  return [
    { name: "Host Grotesk", data: host700, weight: 700 as const, style: "normal" as const },
    { name: "Space Mono", data: mono700, weight: 700 as const, style: "normal" as const },
    { name: "Space Mono", data: mono400, weight: 400 as const, style: "normal" as const },
  ];
}
