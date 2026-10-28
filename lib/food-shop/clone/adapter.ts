/**
 * The friends' copy of Finbar's app is his own page (public/index.html), unchanged apart from a few patches
 * in scripts/food-shop-sync-app.ts. This script runs first and stands in for his local server: every fetch
 * the page makes to /api/* or /data/* is answered here, per account.
 *
 *   /api/deals              the shared product file, scored in the browser for THIS person (their settings:
 *                           Fit, Value, the four Fit parts, the reasons), minus anything their diet, allergies
 *                           or postcode area rule out; without a Clubcard, Clubcard offers are taken off
 *   /api/basket(/op), ratings, removals, locks, orders
 *                           passed to /foodshop/api/app/*, which keeps them per account in the same shapes
 *   /data/meta.json, group-taxonomy.json, ingredient-rules.json
 *                           answered from here (bundled copies)
 *   Tesco push, trolley and stock checks, price history
 *                           answered "nothing here": those stay on Finbar's machine
 *
 * Built into the page by the sync script (bun build, browser target), so it must stay free of server code.
 */
import { fitPartViews } from "../explain";
import { endsOf, offerShortOf } from "../offers";
import { CLUBCARD, type Offer, priceFor, type ScoreInput, scoreProduct } from "../score";
import { type Settings, weightsFor } from "../settings";
import ingredientRules from "./data/ingredient-rules.json";
import taxonomy from "./data/group-taxonomy.json";

const BASE = "/foodshop";
const realFetch = window.fetch.bind(window);

interface Me {
  user: { name: string | null; email: string };
  settings: Settings;
  area: string | null;
  unavailable: string[];
  catalog: { url: string; updatedAt: string; scrapedAt: string };
}

type Doc = Record<string, unknown> & {
  id: string;
  name: string;
  url: string;
  cat: string;
  regular?: number | null;
  offers?: Offer[];
  best?: Offer | null;
  onOffer?: boolean;
  packProtein?: number | null;
  n100?: ScoreInput["n100"];
  nutrition?: { flags?: ScoreInput["flags"]; ingredients?: string | null } | null;
  proc?: ScoreInput["proc"];
  fitParts?: { processing?: number | null; shelf?: number | null; [part: string]: number | null | undefined };
  valueParts?: ScoreInput["valueParts"];
  storage?: string | null;
  freeze?: string | null;
};

declare global {
  interface Window {
    /** What the patched page reads instead of his constants: Fit weights (his 35/25/20/20), weekly budget (his £75), protein a day (his 100g). */
    FS: { weights: { nutrition: number; processing: number; shelf: number; convenience: number }; budget: number; proteinDay: number; area: string | null };
  }
}

window.FS = { weights: { nutrition: 0.35, processing: 0.25, shelf: 0.2, convenience: 0.2 }, budget: 75, proteinDay: 100, area: null };
// without a target of their own: a sensible day's protein for how much they said they care about it
const PROTEIN_DAY = [60, 80, 100] as const;
const DEFAULT_BUDGET = 75;

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

let mePromise: Promise<Me> | null = null;
function me(): Promise<Me> {
  mePromise ??= realFetch(`${BASE}/api/app/me`, { cache: "no-store" }).then(async (r) => {
    if (r.status === 401) {
      location.href = `${BASE}/login`;
      throw new Error("logged out");
    }
    const m = (await r.json()) as Me;
    window.FS.weights = weightsFor(m.settings);
    window.FS.budget = m.settings.budget ?? DEFAULT_BUDGET;
    window.FS.proteinDay = m.settings.proteinTarget ?? PROTEIN_DAY[m.settings.protein];
    window.FS.area = m.area;
    return m;
  });
  return mePromise;
}

const toInput = (d: Doc): ScoreInput => ({
  id: d.id,
  name: d.name,
  cat: d.cat,
  regular: d.regular ?? null,
  offers: d.offers ?? [],
  best: d.best ?? null,
  onOffer: d.onOffer === true,
  packProtein: d.packProtein ?? null,
  n100: d.n100 ?? null,
  flags: d.nutrition?.flags ?? null,
  ingredients: d.nutrition?.ingredients ?? null,
  proc: d.proc ?? null,
  processing: d.fitParts?.processing ?? null,
  shelf: d.fitParts?.shelf ?? null,
  valueParts: d.valueParts ?? null,
});

/** One product as his page expects it, for this person; null when they never see it. */
function personalise(d: Doc, m: Me, hidden: Set<string>): Doc | null {
  if (hidden.has(d.id)) return null;
  const s = m.settings;
  const input = toInput(d);
  const sc = scoreProduct(input, s);
  if (sc.hidden) return null;
  const out: Doc = { ...d };

  // no Clubcard: Clubcard offers simply aren't there for them
  if (!s.clubcard && (d.offers ?? []).some((o) => CLUBCARD.test(o.label))) {
    const offers = (d.offers ?? []).filter((o) => !CLUBCARD.test(o.label));
    const price = priceFor(input, s);
    const best = price.offer;
    out.offers = offers;
    out.best = best;
    out.onOffer = offers.length > 0;
    out.ccUnit = undefined;
    out.discount = best?.unitPrice != null && d.regular ? Math.max(0, 1 - best.unitPrice / d.regular) : 0;
    out.offerShort = best ? offerShortOf(best) : "";
    out.ends = best ? (endsOf(best, null) ?? "") : "";
    out.tier = best?.kind === "mealdeal" ? "deal" : (out.discount as number) >= 0.4 ? "great" : (out.discount as number) >= 0.3 ? "good" : (out.discount as number) >= 0.2 ? "ok" : "meh";
    if (d.packProtein && price.unitPrice) out.proteinPerPound = d.packProtein / price.unitPrice;
  }

  const views = fitPartViews(input, s, sc.parts, { storage: d.storage ?? null, freezeState: d.freeze ?? null });
  const line = (k: string) => [views.find((v) => v.key === k)?.text ?? ""];
  const overall: string[] = [];
  if (d.cat === "treats" && sc.fit <= 3) overall.push("treat: capped at 3");
  if (sc.checkLabel) overall.push("Check label: the ingredients haven't come through yet, so this couldn't be checked against your allergies");
  out.fit = sc.fit;
  out.fitRaw = sc.fit;
  out.value = sc.value;
  out.score = sc.fit + sc.value;
  out.fitParts = { ...sc.parts, processingBase: sc.parts.processing };
  out.fitWhy = { nutrition: line("nutrition"), processing: line("processing"), shelf: line("shelf"), convenience: line("convenience"), overall };
  out.why = sc.checkLabel ? ["check label"] : [];
  return out;
}

/** The product file is gzipped. Normally the browser unpacks it (Content-Encoding); if that header is ever lost, unpack it here. */
async function readCatalog(url: string): Promise<unknown> {
  const r = await realFetch(url);
  if (!r.ok) throw new Error(`product file: ${r.status}`);
  const bytes = new Uint8Array(await r.arrayBuffer());
  const gz = bytes[0] === 0x1f && bytes[1] === 0x8b;
  const text = gz ? await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"))).text() : new TextDecoder().decode(bytes);
  return JSON.parse(text);
}

let dealsCache: Promise<Doc[]> | null = null;
function deals(): Promise<Doc[]> {
  dealsCache ??= me().then(async (m) => {
    const all = (await readCatalog(m.catalog.url)) as Doc[];
    const hidden = new Set(m.unavailable);
    return all.map((d) => personalise(d, m, hidden)).filter((d): d is Doc => d !== null);
  });
  return dealsCache;
}

// his local endpoints, and where they live for an account
const PASS = ["/api/basket/op", "/api/basket", "/api/ratings", "/api/removals", "/api/locks", "/api/orders"];
const DATA: Record<string, () => unknown> = {
  "/data/group-taxonomy.json": () => taxonomy,
  "/data/ingredient-rules.json": () => ingredientRules,
};

window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  const path = url.startsWith("/") ? url.split("?")[0] : null;
  if (!path || !(path.startsWith("/api/") || path.startsWith("/data/"))) return realFetch(input, init);

  if (path === "/api/deals") return json(await deals());
  const pass = PASS.find((p) => path === p);
  if (pass) return realFetch(`${BASE}/api/app/${pass.slice(5)}`, init);
  if (path === "/data/meta.json") {
    const { scrapedAt, updatedAt } = (await me()).catalog;
    return json({ scrapedAt, scoredAt: updatedAt });
  }
  if (DATA[path]) return json(DATA[path]());
  if (path === "/api/rescore") return json({ ok: true });
  if (path === "/api/stock-wants" || path === "/api/trolley-check") return json({ ok: true });
  if (path === "/data/price-history.json") return new Response("null", { headers: { "content-type": "application/json" } });
  return json({ error: "not in the friends' version" }, 404);
};

// ---- small additions to his page: account links, Copy list, "Not available to me" ----

const gbp = (n: number) => `£${n.toFixed(2)}`;

async function copyList(button: HTMLButtonElement): Promise<void> {
  const [list, basket] = await Promise.all([deals(), realFetch(`${BASE}/api/app/basket`).then((r) => r.json() as Promise<{ items?: Record<string, number> }>)]);
  const m = await me();
  const byId = new Map(list.map((d) => [d.id, d]));
  let total = 0;
  const lines = Object.entries(basket.items ?? {}).flatMap(([id, qty]) => {
    const d = byId.get(id);
    if (!d) return [];
    const each = priceFor(toInput(d), m.settings).unitPrice;
    if (each != null) total += each * qty;
    return [`${qty} × ${d.name}${each != null ? `, ${gbp(each * qty)}` : ""}`];
  });
  const text = lines.length ? `${lines.join("\n")}\n\nTotal about ${gbp(total)}` : "";
  try {
    await navigator.clipboard.writeText(text);
    button.textContent = lines.length ? "Copied" : "Basket is empty";
  } catch {
    button.textContent = "Couldn't copy";
  }
  setTimeout(() => (button.textContent = "Copy list"), 2000);
}

function addAccountLinks(): void {
  const bar = document.querySelector("#hdr .hbar");
  if (!bar || document.getElementById("fsAccount")) return;
  const a = document.createElement("a");
  a.id = "fsAccount";
  a.className = "pbtn";
  a.href = `${BASE}/settings`;
  a.innerHTML = "<b>Settings</b>";
  a.title = "Your settings, account and privacy";
  bar.appendChild(a);
}

function addCopyList(): void {
  const push = document.getElementById("tpush");
  if (!push || document.getElementById("fsCopy")) return;
  const b = document.createElement("button");
  b.id = "fsCopy";
  b.type = "button";
  b.className = "chip";
  b.textContent = "Copy list";
  b.title = "Copies your basket as text, to shop on Tesco or share";
  b.addEventListener("click", () => void copyList(b));
  push.after(b);
}

/** In the product sheet: hide it for everyone in their postcode area (or undo that). */
function watchSheet(): void {
  const pd = document.getElementById("pd");
  if (!pd) return;
  new MutationObserver(async () => {
    if (!pd.hasAttribute("open") || pd.querySelector(".fsAvail")) return;
    const link = pd.querySelector<HTMLAnchorElement>('a[href*="/products/"]');
    const id = link?.href.match(/products\/(\d+)/)?.[1];
    const m = await me();
    if (!id || pd.querySelector(".fsAvail")) return;
    const box = document.createElement("p");
    box.className = "fsAvail muted";
    if (!m.area) box.innerHTML = `Not sold near you? <a href="${BASE}/settings">Add your postcode</a> to hide it for your area.`;
    else {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "linkbtn";
      b.textContent = `Not available to me (hides it for everyone near ${m.area})`;
      b.addEventListener("click", async () => {
        b.disabled = true;
        const r = await realFetch(`${BASE}/api/unavailable`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ productId: id, unavailable: true }) });
        if (r.ok) location.reload();
        else {
          b.disabled = false;
          b.textContent = ((await r.json().catch(() => null)) as { error?: string } | null)?.error ?? "Couldn't save that, try again";
        }
      });
      box.appendChild(b);
    }
    (pd.querySelector("#pdName")?.parentElement ?? pd).appendChild(box);
  }).observe(pd, { attributes: true, attributeFilter: ["open"], childList: true, subtree: true });
}

void me();
document.addEventListener("DOMContentLoaded", () => {
  void me().then(() => {
    for (const el of document.querySelectorAll(".fsPd")) el.textContent = String(window.FS.proteinDay);
  });
  addAccountLinks();
  addCopyList();
  watchSheet();
});
