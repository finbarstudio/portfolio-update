// Build gate (package.json "prebuild"). Three checks, all about public/media:
//
//  1. No asset path bypasses the media folder: nothing heavy may live in
//     public/ outside public/media (public/downloads is the one exception).
//  2. A build that has no public/media (Vercel, see .vercelignore) must know
//     the R2 hostname, or it would deploy with every image missing.
//  3. When the build serves media from R2 (NEXT_PUBLIC_MEDIA_URL is set, i.e.
//     Vercel), the bucket's manifest must equal the committed one. A push that
//     skipped the sync cannot deploy.
//
// If this fails, fix the cause. Editing or bypassing the check is not a fix.
import { readdirSync, statSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const HEAVY = /\.(png|jpe?g|webp|avif|gif|mp4|webm|mov|glb|gltf|splinecode|pdf)$/i;
const ALLOWED = ["public/media", "public/downloads", "public/cursormania"];
const stray = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (ALLOWED.some((a) => p === a || p.startsWith(a + "/"))) continue;
    if (statSync(p).isDirectory()) walk(p);
    else if (HEAVY.test(name)) stray.push(p);
  }
})("public");
if (stray.length) {
  console.error("✖ media outside public/media:\n  " + stray.join("\n  ") + "\n  Move it under public/media and reference it through media().");
  process.exit(1);
}

const base = (process.env.NEXT_PUBLIC_MEDIA_URL ?? "").replace(/\/+$/, "");
if (!base) {
  // .vercelignore keeps public/media off Vercel. Without the R2 hostname a
  // deploy would ship with every image missing, so refuse to build it.
  if (!existsSync("public/media/images")) {
    console.error("✖ public/media is not in this build and NEXT_PUBLIC_MEDIA_URL is not set. Set it in the Vercel project (Production and Preview) to the R2 hostname, then redeploy.");
    process.exit(1);
  }
  console.log("media check: ok (local media, no bucket to compare)");
  process.exit(0);
}

const local = JSON.parse(readFileSync("content/media-manifest.json", "utf8"));
const res = await fetch(`${base}/manifest.json?t=${Date.now()}`, { cache: "no-store" });
if (!res.ok) { console.error(`✖ could not read ${base}/manifest.json (${res.status}). Run: npm run media:sync`); process.exit(1); }
const remote = await res.json();
if (remote.hash !== local.hash) {
  console.error(`✖ the R2 bucket (${remote.hash}) does not match the repo (${local.hash}). Run: npm run media:sync, then redeploy.`);
  process.exit(1);
}
console.log(`media check: ok (bucket matches ${local.hash})`);
