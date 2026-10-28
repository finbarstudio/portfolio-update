/**
 * Mirrors Finbar's scored Tesco products into the food shop: the database (product rows, for search and
 * "not available" reports) and the product file the cloned app loads (gzipped JSON, uploaded to R2 when
 * FOOD_SHOP_R2 names a bucket, e.g. FOOD_SHOP_R2=r2:food-shop-catalog). Each person's Fit and Value are worked
 * out in their own browser from that file, so nothing is re-scored here.
 *
 *   bun --env-file=.env.local scripts/food-shop-publish.ts [--deals <path>] [--force] [--dry-run]
 *
 * Only product data goes out: the fields below are copied one by one, never the whole record, so nothing
 * personal to Finbar (his fit, ratings, needs, swaps, text) can ride along. The scorer's neutral
 * subscores (processing, shelf) and value inputs are stored; each person's own Fit and Value are
 * computed from them in lib/food-shop/score.ts.
 *
 * Idempotent. Upserts in a few big statements (the database is far away; row by row takes ages), marks
 * anything that dropped out of deals.json inactive instead of deleting it, so ratings and lists survive.
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { gzipSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import postgres from "postgres";
import { CATALOG_CACHE_FILE, PERSONAL_FIELDS } from "../lib/food-shop/catalog";

const DEFAULT_DEALS = "/Users/finbar/Documents/Food Shop/data/deals.json";
const SCHEMA = fileURLToPath(new URL("../lib/food-shop/schema.sql", import.meta.url));
const CHUNK = 1000;
// a scrape that lost more than this share of the catalogue is probably broken, not a real drop
const MIN_KEEP = 0.9;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// ---------------------------------------------------------------- the file

/** The bits of a deals.json record this script reads. Everything is optional: it is a local file, but it is rewritten constantly. */
interface Deal {
  id?: string | number;
  name?: string;
  img?: string;
  url?: string;
  cat?: string;
  group?: string;
  dept?: string;
  subtype?: string;
  regular?: number;
  regUnit?: unknown;
  ccUnit?: unknown;
  offers?: unknown[];
  best?: unknown;
  onOffer?: boolean;
  offerShort?: string;
  ends?: string;
  packG?: number;
  packLabel?: string;
  packProtein?: number;
  n100?: unknown;
  nutrition?: { flags?: unknown; ingredients?: string | null };
  storage?: string;
  freeze?: string | null;
  proc?: unknown;
  fitParts?: { processing?: number; processingBase?: number; shelf?: number };
  valueParts?: unknown;
  compare?: unknown;
  honesty?: unknown;
  luxury?: boolean;
  rating?: number;
  reviews?: number;
  oos?: boolean;
  priceStale?: boolean;
  seenAt?: string | number;
  part?: string;
  slot?: string;
  isNew?: boolean;
  nonFood?: boolean;
  variantOf?: string;
}

/** The file is rewritten in place several times an hour, so a read can land mid-write: retry a broken parse. */
async function readDeals(path: string): Promise<Deal[]> {
  let last: unknown;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const parsed: unknown = JSON.parse(readFileSync(path, "utf8"));
      if (!Array.isArray(parsed)) throw new Error("expected a JSON array of products");
      return parsed as Deal[];
    } catch (err) {
      last = err;
      if ((err as NodeJS.ErrnoException).code === "ENOENT") break;
      if (attempt < 3) {
        console.log(`deals.json not readable yet (${err instanceof Error ? err.message : err}), retrying in 5s`);
        await sleep(5000);
      }
    }
  }
  throw new Error(`could not read ${path}: ${last instanceof Error ? last.message : last}`);
}

// ---------------------------------------------------------------- the mapping

// column, Postgres type: the recordset the upsert reads, in table order
const COLUMNS = [
  ["id", "text"],
  ["name", "text"],
  ["img", "text"],
  ["url", "text"],
  ["cat", "text"],
  ["grp", "text"],
  ["dept", "text"],
  ["subtype", "text"],
  ["regular", "numeric"],
  ["reg_unit", "jsonb"],
  ["cc_unit", "jsonb"],
  ["offers", "jsonb"],
  ["best", "jsonb"],
  ["on_offer", "boolean"],
  ["offer_short", "text"],
  ["ends", "text"],
  ["pack_g", "numeric"],
  ["pack_label", "text"],
  ["pack_protein", "numeric"],
  ["n100", "jsonb"],
  ["flags", "jsonb"],
  ["ingredients", "text"],
  ["storage", "text"],
  ["freeze_state", "text"],
  ["proc", "jsonb"],
  ["processing", "smallint"],
  ["shelf", "smallint"],
  ["value_parts", "jsonb"],
  ["compare", "jsonb"],
  ["honesty", "jsonb"],
  ["luxury", "boolean"],
  ["rating", "real"],
  ["reviews", "int"],
  ["oos", "boolean"],
  ["price_stale", "boolean"],
  ["seen_at", "timestamptz"],
  ["part", "text"],
  ["slot", "text"],
  ["is_new", "boolean"],
  ["non_food", "boolean"],
  ["variant_of", "text"],
] as const;

type Row = Record<(typeof COLUMNS)[number][0], unknown>;

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : null);
const int = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? Math.round(v) : null);
const str = (v: unknown) => (typeof v === "string" && v !== "" ? v : null);
const iso = (v: unknown) => {
  if (typeof v !== "string" && typeof v !== "number") return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
};

/** One product row, or null when it lacks what the table requires. Copies fields by name, never spreads. */
function toRow(p: Deal): Row | null {
  const id = p.id == null ? null : String(p.id);
  const name = str(p.name);
  const url = str(p.url);
  const cat = str(p.cat);
  if (!id || !name || !url || !cat) return null;
  const processing = p.fitParts?.processingBase ?? p.fitParts?.processing;
  return {
    id,
    name,
    img: str(p.img),
    url,
    cat,
    grp: str(p.group),
    dept: str(p.dept),
    subtype: str(p.subtype),
    regular: num(p.regular),
    reg_unit: p.regUnit ?? null,
    cc_unit: p.ccUnit ?? null,
    offers: Array.isArray(p.offers) ? p.offers : [],
    best: p.best ?? null,
    on_offer: p.onOffer === true,
    offer_short: str(p.offerShort),
    ends: str(p.ends),
    pack_g: num(p.packG),
    pack_label: str(p.packLabel),
    pack_protein: num(p.packProtein),
    n100: p.n100 ?? null,
    flags: p.nutrition?.flags ?? null,
    ingredients: str(p.nutrition?.ingredients),
    storage: str(p.storage),
    freeze_state: str(p.freeze),
    proc: p.proc ?? null,
    // the neutral subscores, before any of Finbar's avoid rules; never his nutrition or convenience
    processing: int(processing),
    shelf: int(p.fitParts?.shelf),
    value_parts: p.valueParts ?? null,
    compare: p.compare ?? null,
    honesty: p.honesty ?? null,
    luxury: p.luxury === true,
    rating: num(p.rating),
    reviews: int(p.reviews),
    oos: p.oos === true,
    price_stale: p.priceStale === true,
    seen_at: iso(p.seenAt),
    part: str(p.part),
    slot: str(p.slot),
    is_new: p.isNew === true,
    non_food: p.nonFood === true,
    variant_of: str(p.variantOf),
  };
}

// One statement per chunk: a recordset in, an upsert out. Values only ever travel as $1 / $2.
const UPSERT = `
insert into products (${COLUMNS.map(([c]) => c).join(", ")}, active, published_at)
select ${COLUMNS.map(([c]) => `t.${c}`).join(", ")}, true, $2::timestamptz
from jsonb_to_recordset($1::text::jsonb) as t(${COLUMNS.map(([c, type]) => `${c} ${type}`).join(", ")})
on conflict (id) do update set
  ${COLUMNS.filter(([c]) => c !== "id")
    .map(([c]) => `${c} = excluded.${c}`)
    .join(",\n  ")},
  active = true,
  published_at = excluded.published_at
`;

// ---------------------------------------------------------------- main

interface Args {
  deals: string;
  force: boolean;
  dryRun: boolean;
}

function parseArgs(argv: string[]): Args {
  const args: Args = { deals: DEFAULT_DEALS, force: false, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--force") args.force = true;
    else if (a === "--dry-run") args.dryRun = true;
    else if (a === "--deals") {
      const v = argv[++i];
      if (!v) throw new Error("--deals needs a path.");
      args.deals = v;
    } else throw new Error(`Unknown argument: ${a}. Usage: food-shop-publish.ts [--deals <path>] [--force] [--dry-run]`);
  }
  return args;
}

const secs = (since: number) => `${((Date.now() - since) / 1000).toFixed(1)}s`;

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const url = process.env.FOOD_SHOP_DB_DATABASE_URL_UNPOOLED ?? process.env.FOOD_SHOP_DATABASE_URL ?? process.env.DATABASE_URL;
  if (!url && !args.dryRun) {
    console.log("food-shop-publish: no database URL set (FOOD_SHOP_DB_DATABASE_URL_UNPOOLED, FOOD_SHOP_DATABASE_URL or DATABASE_URL), nothing to do.");
    return;
  }

  const started = Date.now();
  const runStart = new Date().toISOString();

  const deals = await readDeals(args.deals);
  const sourceMtime = statSync(args.deals).mtime.toISOString();
  const rows = new Map<string, Row>(); // by id: one statement can't touch the same row twice
  let nonFood = 0;
  let invalid = 0;
  for (const d of deals) {
    if (d.nonFood === true) {
      nonFood++;
      continue;
    }
    const row = toRow(d);
    if (row) rows.set(row.id as string, row);
    else invalid++;
  }
  const products = [...rows.values()];
  console.log(`read ${deals.length} records in ${secs(started)}: ${products.length} products, ${nonFood} non-food dropped${invalid ? `, ${invalid} unusable (missing id, name, url or category)` : ""}`);
  if (products.length === 0) throw new Error("no usable products in the file, refusing to publish an empty catalogue");

  const sql = url
    ? postgres(url, { max: 2, idle_timeout: 20, connect_timeout: 30, prepare: false, onnotice: () => undefined })
    : null;
  try {
    // a scrape that lost a big share of the catalogue is probably broken: keep what is live
    let previous: number | null = null;
    if (sql) {
      if (!args.dryRun) await sql.unsafe(readFileSync(SCHEMA, "utf8"));
      // (a dry run on a fresh database has no meta table yet: that just means nothing is live)
      const meta = await sql<{ value: unknown }[]>`select value from meta where key = 'product_count'`.catch(() => []);
      const live = meta[0]?.value;
      previous = typeof live === "number" ? live : null;
    }
    if (previous != null && products.length < previous * MIN_KEEP && !args.force) {
      console.log(`skipped: product count dropped from ${previous} to ${products.length} (run with --force to publish anyway)`);
      return;
    }
    if (args.dryRun || !sql) {
      console.log(`dry run: would publish ${products.length} products${previous != null ? ` (live: ${previous})` : ""}, nothing written`);
      return;
    }

    const upsertStart = Date.now();
    for (let i = 0; i < products.length; i += CHUNK) {
      await sql.unsafe(UPSERT, [JSON.stringify(products.slice(i, i + CHUNK)), runStart]);
    }
    // anything not touched this run has left the catalogue: hide it, keep it for ratings and lists
    const gone = await sql`update products set active = false where published_at < ${runStart}::timestamptz and active`;
    const stamp = (key: string, value: unknown) =>
      sql`insert into meta (key, value) values (${key}, ${JSON.stringify(value)}::text::jsonb) on conflict (key) do update set value = excluded.value`;
    await stamp("updated_at", new Date().toISOString());
    await stamp("product_count", products.length);
    await stamp("source_mtime", sourceMtime);
    // when Tesco was last scraped (meta.json beside deals.json), for the app's "scraped today 14:32" line
    try {
      const scraped = (JSON.parse(readFileSync(`${dirname(args.deals)}/meta.json`, "utf8")) as { scrapedAt?: unknown }).scrapedAt;
      if (typeof scraped === "string") await stamp("scraped_at", scraped);
    } catch {
      // no meta.json: the app falls back to the publish time
    }
    console.log(`published ${products.length} products, ${gone.count} deactivated, in ${secs(upsertStart)}`);

    // housekeeping the privacy page promises: accounts unused for 12 months go (and everything they own,
    // by cascade), as do expired sessions and day-old failed logins
    const stale = await sql`delete from users where coalesce(last_seen_at, created_at) < now() - interval '12 months'`;
    await sql`delete from sessions where expires_at < now()`;
    await sql`delete from login_attempts where at < now() - interval '1 day'`;
    if (stale.count) console.log(`deleted ${stale.count} account${stale.count === 1 ? "" : "s"} unused for 12 months`);

    // the product file: each record as deals.json has it, minus everything that is Finbar's own. His
    // personal Fit parts go too; only the neutral processing and shelf scores stay (the browser does the rest)
    const fileStart = Date.now();
    const docs = deals
      .filter((d) => d.nonFood !== true && rows.has(String(d.id)))
      .map((d) => {
        const doc: Record<string, unknown> = { ...d };
        for (const k of PERSONAL_FIELDS) delete doc[k];
        const fp = d.fitParts as { processing?: number; processingBase?: number; shelf?: number } | undefined;
        doc.fitParts = fp ? { processing: fp.processingBase ?? fp.processing, shelf: fp.shelf } : undefined;
        return doc;
      });
    const gz = gzipSync(JSON.stringify(docs), { level: 9 });
    mkdirSync(dirname(CATALOG_CACHE_FILE), { recursive: true });
    writeFileSync(CATALOG_CACHE_FILE, gz);
    const bucket = process.env.FOOD_SHOP_R2;
    if (bucket) {
      const up = spawnSync(
        "rclone",
        // --header-upload loses Content-Encoding on R2; object metadata (-M) keeps it. --ignore-times: always
        // re-send, or a same-size file is skipped and keeps stale headers
        ["copyto", CATALOG_CACHE_FILE, `${bucket}/catalog.json.gz`, "--ignore-times", "-M",
          "--metadata-set", "content-encoding=gzip", "--metadata-set", "content-type=application/json",
          "--metadata-set", "cache-control=public, max-age=300"],
        { stdio: ["ignore", "ignore", "pipe"], encoding: "utf8" },
      );
      if (up.status !== 0) throw new Error(`upload to ${bucket} failed: ${(up.stderr ?? "").trim().slice(0, 300)}`);
    }
    console.log(`product file ${(gz.length / 1e6).toFixed(1)}MB${bucket ? ` uploaded to ${bucket}` : " (local only)"} in ${secs(fileStart)}; total ${secs(started)}`);
  } finally {
    await sql?.end({ timeout: 5 });
  }
}

main().catch((err) => {
  console.error(`food-shop-publish failed: ${err instanceof Error ? err.message : err}`);
  process.exit(1);
});
