// Writes the two committed indexes of public/media, from git's own index so it
// is instant and content-accurate (blob hashes, not mtimes):
//
//   content/media-manifest.json  { hash, files, bytes }. What the build checks
//                                the R2 bucket against (media-check.mjs).
//   content/media-versions.json  path -> 8 chars of its git blob hash. The ?v=
//                                on each CDN URL (lib/media.ts), so replacing
//                                one file busts one cache entry, not all of
//                                them. cursors/ is left out: 12,000 gifs that
//                                never change would only bloat the bundle.
//   content/asia-photos.json     folder -> web images for the /asia guide, which
//                                used to scan the disk at render time. The disk
//                                is not there on Vercel any more.
//
// Run by the pre-commit hook whenever public/media changes. `--check` exits 1
// if the committed files are out of date, and writes nothing.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, existsSync, statSync } from "node:fs";

const ROOT = "public/media/";
const WEB_IMG = /\.(jpe?g|png|webp|avif|mp4)$/i;
const check = process.argv.includes("--check");

const rows = execFileSync("git", ["ls-files", "-s", "-z", "--", ROOT], { maxBuffer: 1 << 28 })
  .toString()
  .split("\0")
  .filter(Boolean)
  .map((r) => {
    const [meta, file] = r.split("\t");
    return { blob: meta.split(" ")[1], file: file.slice(ROOT.length) };
  })
  .filter((r) => !/(^|\/)(\.DS_Store|\.gitignore|README\.md)$/.test(r.file))
  .sort((a, b) => (a.file < b.file ? -1 : 1));

const hash = createHash("sha256");
let bytes = 0;
for (const r of rows) {
  hash.update(`${r.file}\t${r.blob}\n`);
  try { bytes += statSync(ROOT + r.file).size; } catch { /* staged delete */ }
}
const manifest = { hash: hash.digest("hex").slice(0, 16), files: rows.length, bytes };

const asia = {};
for (const r of rows) {
  const m = r.file.match(/^asia\/([^/]+)\/([^/]+)$/);
  if (m && WEB_IMG.test(m[2])) (asia[m[1]] ??= []).push(m[2]);
}

const versions = {};
for (const r of rows) if (!r.file.startsWith("cursors/")) versions[r.file] = r.blob.slice(0, 8);

const out = [
  ["content/media-manifest.json", JSON.stringify(manifest, null, 2) + "\n"],
  ["content/media-versions.json", JSON.stringify(versions, null, 1) + "\n"],
  ["content/asia-photos.json", JSON.stringify(asia, null, 2) + "\n"],
];
let stale = false;
for (const [file, text] of out) {
  const same = existsSync(file) && readFileSync(file, "utf8") === text;
  if (same) continue;
  stale = true;
  if (!check) writeFileSync(file, text);
}
if (check && stale) {
  console.error("✖ the media manifests in content/ are out of date. Run: npm run media:manifest, then commit it.");
  process.exit(1);
}
console.log(`media manifest ${manifest.hash} · ${manifest.files} files · ${(bytes / 1e6).toFixed(1)} MB${stale && !check ? " (updated)" : ""}`);
