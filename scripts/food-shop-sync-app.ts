/**
 * Copies Finbar's local app (Food Shop/public/index.html) into the friends' version at /foodshop.
 *
 *   bun scripts/food-shop-sync-app.ts [path/to/index.html]
 *
 * His page goes across as it is, so the friends' app looks and works the same. What changes:
 *   - lib/food-shop/clone/adapter.ts is bundled and run first. It answers the page's /api and /data calls per
 *     account and scores every product for that person (see the adapter for the details).
 *   - A few of his constants become that person's: the Fit weights, the weekly budget, protein a day.
 *   - Tesco-tab features (Send to Tesco, stock and basket checks) are hidden: they need his machine.
 *   - His product rules (group taxonomy, ingredient markers) are copied in for the adapter.
 *
 * Every patch must match exactly as often as expected. When his page changes so one no longer does, this
 * stops and says which, rather than shipping a half-patched app. Read-only on his folder.
 *
 * Writes lib/food-shop/clone/app-html.generated.ts (served by app/lab/foodshop/route.ts). Re-run after he
 * changes his app, then check it in the browser.
 */
import { spawnSync } from "node:child_process";
import { copyFileSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const SHOP = "/Users/finbar/Documents/Food Shop";
const SRC = process.argv[2] ?? `${SHOP}/public/index.html`;
const root = (p: string) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const OUT = root("lib/food-shop/clone/app-html.generated.ts");

interface Patch {
  why: string;
  find: string | RegExp;
  replace: string;
  /** how many matches to expect (default 1) */
  count?: number;
}

const FW = "window.FS.weights";
const PATCHES: Patch[] = [
  // ---- "Why Fit N?" shows this person's weights, not his 35/25/20/20
  {
    why: "Why Fit: weighted sum",
    find: "const raw = p.nutrition * 0.35 + p.processing * 0.25 + p.shelf * 0.2 + p.convenience * 0.2",
    replace: `const FW = ${FW}, pc = (k) => Math.round(FW[k] * 100), raw = p.nutrition * FW.nutrition + p.processing * FW.processing + p.shelf * FW.shelf + p.convenience * FW.convenience`,
  },
  { why: "Why Fit: nutrition row", find: "row('Nutrition', p.nutrition, 35, w.nutrition)", replace: "row('Nutrition', p.nutrition, pc('nutrition'), w.nutrition)" },
  { why: "Why Fit: processing row", find: "row('Processing', p.processing, 25, w.processing)", replace: "row('Processing', p.processing, pc('processing'), w.processing)" },
  { why: "Why Fit: shelf row", find: "row('Shelf life', p.shelf, 20, w.shelf)", replace: "row('Shelf life', p.shelf, pc('shelf'), w.shelf)" },
  { why: "Why Fit: convenience row", find: "row('Convenience', p.convenience, 20, w.convenience)", replace: "row('Convenience', p.convenience, pc('convenience'), w.convenience)" },
  {
    why: "Why Fit: working line",
    find: "${p.nutrition}×0.35 + ${p.processing}×0.25 + ${p.shelf}×0.2 + ${p.convenience}×0.2",
    replace: "${p.nutrition}×${FW.nutrition.toFixed(2)} + ${p.processing}×${FW.processing.toFixed(2)} + ${p.shelf}×${FW.shelf.toFixed(2)} + ${p.convenience}×${FW.convenience.toFixed(2)}",
  },
  // ---- their budget and protein a day
  { why: "weekly budget", find: /const BUDGET = \d+[^\n]*/, replace: "const BUDGET = window.FS.budget // weekly budget (£), from their settings" },
  { why: "basket protein days", find: "prot / 100", replace: "prot / window.FS.proteinDay", count: 2 },
  { why: "past shops protein days", find: "protein / 100", replace: "protein / window.FS.proteinDay", count: 2 },
  { why: "basket protein label", find: "≈ days at 100g/day", replace: '≈ days at <span class="fsPd">100</span>g/day' },
  { why: "past shops protein label", find: "days at 100g</small>", replace: "days at ${window.FS.proteinDay}g</small>" },
  { why: "sat fat guideline", find: "UK guideline for men: no more than 30g a day.", replace: "UK guideline: no more than 30g a day for men, 20g for women." },
  // ---- he polls his local server every 4s to pick up other tabs' changes; for friends each poll is 4 hosted
  // calls that keep the free database awake, so every 30s (and still at once when the tab comes back)
  { why: "cross-tab sync interval", find: "setInterval(() => { if (!document.hidden) syncFromServer() }, 4000)", replace: "setInterval(() => { if (!document.hidden) syncFromServer() }, 30000)" },
  // ---- the adapter runs before his module script (classic scripts run first; modules wait for the page)
  { why: "adapter slot", find: '<script type="module">', replace: '<script>/*FS_ADAPTER*/</script>\n<script type="module">' },
  { why: "extra styles slot", find: "</head>", replace: "<style>/*FS_STYLE*/</style>\n</head>" },
];

// Tesco-tab features need his machine (the logged-in Tesco tab and its watchers)
const STYLE = `
#tpush, #tpushst, #stockbar { display: none !important; }
#fsCopy { width: 100%; margin-top: 6px; }
#fsAccount { text-decoration: none; color: inherit; }
.fsAvail { margin: 4px 0 10px; font-size: 12px; }
`;

function patch(html: string): string {
  let out = html;
  for (const p of PATCHES) {
    const want = p.count ?? 1;
    const found = typeof p.find === "string" ? out.split(p.find).length - 1 : [...out.matchAll(new RegExp(p.find, "g"))].length;
    if (found !== want) throw new Error(`patch "${p.why}" matched ${found} times, expected ${want}: his page changed there, update PATCHES`);
    out = typeof p.find === "string" ? out.split(p.find).join(p.replace) : out.replace(new RegExp(p.find, "g"), p.replace);
  }
  return out;
}

function bundleAdapter(): string {
  const dir = mkdtempSync(join(tmpdir(), "fs-adapter-"));
  try {
    const r = spawnSync("bun", ["build", root("lib/food-shop/clone/adapter.ts"), "--target=browser", "--format=iife", "--minify", `--outfile=${dir}/adapter.js`], { encoding: "utf8" });
    if (r.status !== 0) throw new Error(`bundling the adapter failed:\n${r.stderr || r.stdout}`);
    return readFileSync(`${dir}/adapter.js`, "utf8");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function main(): void {
  for (const f of ["group-taxonomy.json", "ingredient-rules.json"]) copyFileSync(`${SHOP}/data/${f}`, root(`lib/food-shop/clone/data/${f}`));
  const js = bundleAdapter().replace(/<\/script/gi, "<\\/script");
  const html = patch(readFileSync(SRC, "utf8")).replace("/*FS_ADAPTER*/", () => js).replace("/*FS_STYLE*/", () => STYLE);
  writeFileSync(OUT, `// Generated by scripts/food-shop-sync-app.ts from Finbar's local app. Don't edit: re-run the script.\n// biome-ignore-all format: generated\nexport const APP_HTML = ${JSON.stringify(html)};\n`);
  console.log(`synced ${SRC} → ${OUT} (${(html.length / 1024).toFixed(0)}KB, adapter ${(js.length / 1024).toFixed(0)}KB)`);
}

main();
