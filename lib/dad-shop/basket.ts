import { fitScore } from "./fit";
import { bestMultibuy, dealLabel, linePrice, toPence, toPounds } from "./pricing";
import type { BasketItem, Promo, SeedOil, Settings } from "./types";
import { DEFAULT_SETTINGS } from "./types";

/**
 * The weekly basket generator. PURE and deterministic: same input, same
 * output, no randomness, no clock (the caller passes `now`), no DB. Ties break
 * on product id. It never throws on bad data: it returns fewer items and a
 * warning instead.
 *
 * Order of play (see SPEC.md):
 *   1. keep favourites (rated 4+ in the previous basket)
 *   2. protein anchors, best protein per pound first, to ~70% of the target
 *   3. fill to the budget by fit per pound, with variety limits
 *   4. learning: a few unrated products he has not tried (cap = unrated share)
 * and never go over the budget.
 */

export interface Candidate {
  id: string;
  name: string;
  zone: string | null;
  category: string | null;
  price: number;
  nectarPrice: number | null;
  packGrams: number | null;
  promos: Promo[];
  isAvailable: boolean;
  isFood: boolean;
  storage: string | null;
  /** Protein in g per 100g (or 100ml). */
  protein: number | null;
  seedOil: SeedOil;
  health: number | null;
  /** When the price was last seen. */
  listedAt: string | Date;
  /** True when nutrition and ingredients are both known. */
  hasDetail: boolean;
}

export interface BasketInput {
  candidates: Candidate[];
  /** product id -> stars (1-5) */
  ratings: Record<string, number>;
  /** product ids he has marked "not at my store" */
  notAtStore: string[];
  settings: Settings;
  previous: { items: BasketItem[] } | null;
  now: Date;
}

export interface BasketResult {
  items: BasketItem[];
  total: number;
  /** Protein in the whole basket, in grams. */
  proteinG: number;
  warnings: string[];
  settings: Settings;
}

export const MAX_AGE_DAYS = 14;
const MAX_CHILLED = 7;
const MAX_QTY = 3;
const MIN_HEALTH = 5;
const ANCHOR_MIN_FIT = 6;
const ANCHOR_SHARE = 0.7;
const ANCHOR_SPEND_SHARE = 0.65;
const LEARN_MIN_HEALTH = 7;
/** Below this many liked-or-neutral rated products there is nothing to learn from yet. */
const MIN_RATED_POOL = 5;
const FULL_DETAIL_FLOOR = 30;
const DAY_MS = 24 * 3600 * 1000;

type Kind = "favourite" | "anchor" | "fill" | "learn";

interface Entry {
  c: Candidate;
  stars: number | null;
  fit: number;
  /** Units to buy at once: a multi-buy's full quantity, or 1. */
  bundleQty: number;
  /** Pence per unit when bought as that bundle. */
  unitPence: number;
  /** Grams of protein in one unit. */
  proteinUnit: number;
  proteinPerPound: number;
  fitPerPound: number;
  ageDays: number;
}

interface Chosen {
  e: Entry;
  qty: number;
  kind: Kind;
  pence: number;
}

function cmp(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function clamp(n: unknown, lo: number, hi: number, fallback: number): number {
  const v = typeof n === "number" && Number.isFinite(n) ? n : fallback;
  return Math.min(hi, Math.max(lo, v));
}

export function sanitiseSettings(s: Settings): Settings {
  return {
    budget_gbp: clamp(s?.budget_gbp, 1, 1000, DEFAULT_SETTINGS.budget_gbp),
    people: Math.round(clamp(s?.people, 1, 10, DEFAULT_SETTINGS.people)),
    protein_g_per_day: clamp(s?.protein_g_per_day, 20, 300, DEFAULT_SETTINGS.protein_g_per_day),
    max_per_category: Math.round(clamp(s?.max_per_category, 1, 5, DEFAULT_SETTINGS.max_per_category)),
    include_unrated_share: clamp(s?.include_unrated_share, 0, 0.5, DEFAULT_SETTINGS.include_unrated_share),
  };
}

function ageInDays(listedAt: string | Date, now: Date): number | null {
  const t = listedAt instanceof Date ? listedAt.getTime() : Date.parse(listedAt);
  if (Number.isNaN(t)) return null;
  return Math.max(0, (now.getTime() - t) / DAY_MS);
}

function proteinPerUnit(c: Candidate): number {
  if (c.packGrams == null || c.protein == null) return 0;
  const g = (c.packGrams * c.protein) / 100;
  return Number.isFinite(g) && g > 0 ? g : 0;
}

function categoryKey(c: Candidate): string {
  return c.category ?? c.zone ?? `~${c.id}`;
}

function money(n: number): string {
  return Number.isInteger(n) ? `£${n}` : `£${n.toFixed(2)}`;
}

function emptyResult(settings: Settings, warnings: string[]): BasketResult {
  return { items: [], total: 0, proteinG: 0, warnings, settings };
}

export function generateBasket(input: BasketInput): BasketResult {
  const settings = sanitiseSettings(input.settings);
  const { now } = input;
  const warnings: string[] = [];

  if (input.candidates.length === 0) {
    return emptyResult(settings, ["There are no products to choose from yet."]);
  }

  const blocked = new Set(input.notAtStore);
  const budget = toPence(settings.budget_gbp);
  const weeklyProtein = settings.protein_g_per_day * 7 * settings.people;

  // ── Eligibility ────────────────────────────────────────────────────────────
  const pool: Entry[] = [];
  let stale = 0;
  for (const c of [...input.candidates].sort((a, b) => cmp(a.id, b.id))) {
    if (!c.isFood || !c.isAvailable) continue;
    if (blocked.has(c.id)) continue;
    if (c.seedOil === "yes") continue;
    if (!(c.price > 0)) continue;
    const stars = Object.prototype.hasOwnProperty.call(input.ratings, c.id) ? input.ratings[c.id] : null;
    if (stars != null && stars <= 2) continue;
    const liked = stars != null && stars >= 4;
    if (!liked && !(c.health != null && c.health >= MIN_HEALTH)) continue;

    const age = ageInDays(c.listedAt, now);
    if (age == null || age > MAX_AGE_DAYS) {
      stale += 1;
      continue;
    }

    const deal = bestMultibuy(c, now);
    const bundleQty = deal?.qty ?? 1;
    const unitPence = linePrice(c, bundleQty, now).pence / bundleQty;
    const proteinUnit = proteinPerUnit(c);
    const fit = fitScore(c.health, stars) ?? 0;
    pool.push({
      c,
      stars,
      fit,
      bundleQty,
      unitPence,
      proteinUnit,
      proteinPerPound: unitPence > 0 ? proteinUnit / (unitPence / 100) : 0,
      fitPerPound: unitPence > 0 ? fit / (unitPence / 100) : 0,
      ageDays: age,
    });
  }

  if (stale > 0) {
    warnings.push(
      `${stale} ${stale === 1 ? "product was" : "products were"} left out because ${stale === 1 ? "its price is" : "their prices are"} over ${MAX_AGE_DAYS} days old.`,
    );
  }
  if (pool.length === 0) {
    warnings.push("Nothing in the catalogue fits your rules right now.");
    return emptyResult(settings, warnings);
  }

  const ratedPool = pool.filter((e) => e.stars != null && e.stars >= 3).length;
  const coldStart = ratedPool < MIN_RATED_POOL;

  // ── Working state ──────────────────────────────────────────────────────────
  const picks = new Map<string, Chosen>();
  const categories = new Map<string, number>();
  let spend = 0;
  let protein = 0;
  let chilled = 0;
  let unrated = 0;

  /** Add `qty` more of a product if every limit allows it. */
  function tryAdd(e: Entry, qty: number, kind: Kind, spendCap: number): boolean {
    const existing = picks.get(e.c.id);
    const newQty = (existing?.qty ?? 0) + qty;
    if (newQty > Math.max(MAX_QTY, e.bundleQty)) return false;
    const newPence = linePrice(e.c, newQty, now).pence;
    const delta = newPence - (existing?.pence ?? 0);
    if (spend + delta > Math.min(budget, spendCap)) return false;

    if (!existing) {
      const key = categoryKey(e.c);
      const free = kind === "favourite";
      if (!free && (categories.get(key) ?? 0) >= settings.max_per_category) return false;
      if (!free && e.c.storage === "chilled" && chilled >= MAX_CHILLED) return false;
      if (e.stars == null && !coldStart) {
        // Learning picks: only well-scored products, and only a small share.
        if (e.c.health == null || e.c.health < LEARN_MIN_HEALTH) return false;
        if (unrated + 1 > Math.ceil(settings.include_unrated_share * (picks.size + 1))) return false;
      }
      categories.set(key, (categories.get(key) ?? 0) + 1);
      if (e.c.storage === "chilled") chilled += 1;
      if (e.stars == null) unrated += 1;
    }

    spend += delta;
    protein += e.proteinUnit * qty;
    picks.set(e.c.id, { e, qty: newQty, kind: existing?.kind ?? kind, pence: newPence });
    return true;
  }

  /** The whole multi-buy if it fits, else a single unit at the single price. */
  function addBest(e: Entry, kind: Kind, spendCap = Number.POSITIVE_INFINITY): boolean {
    if (tryAdd(e, e.bundleQty, kind, spendCap)) return true;
    // A multi-buy that does not fit whole is bought as one unit at the single
    // price, but only as a first pick: never topped up half-way.
    return e.bundleQty > 1 && !picks.has(e.c.id) && tryAdd(e, 1, kind, spendCap);
  }

  const byId = new Map(pool.map((e) => [e.c.id, e]));

  // ── 1. Favourites from the last basket ─────────────────────────────────────
  const previous = [...(input.previous?.items ?? [])].sort((a, b) => cmp(a.productId, b.productId));
  for (const prev of previous) {
    const e = byId.get(prev.productId);
    if (!e || e.stars == null || e.stars < 4) continue;
    const want = Math.min(MAX_QTY, Math.max(1, Math.round(prev.qty) || 1));
    if (!tryAdd(e, want, "favourite", Number.POSITIVE_INFINITY)) tryAdd(e, 1, "favourite", Number.POSITIVE_INFINITY);
  }

  // ── 2. Protein anchors ─────────────────────────────────────────────────────
  const anchorTarget = weeklyProtein * ANCHOR_SHARE;
  const anchorCap = Math.floor(budget * ANCHOR_SPEND_SHARE);
  if (protein < anchorTarget) {
    const ranked = pool
      .filter((e) => e.fit >= ANCHOR_MIN_FIT && e.proteinUnit > 0)
      .sort((a, b) => b.proteinPerPound - a.proteinPerPound || cmp(a.c.id, b.c.id));
    for (const e of ranked) {
      if (protein >= anchorTarget) break;
      if (!picks.has(e.c.id)) addBest(e, "anchor", anchorCap);
    }
    // Still short: a second (and third) pack of what is best value.
    for (const e of ranked) {
      if (protein >= anchorTarget) break;
      if (picks.has(e.c.id)) addBest(e, "anchor", anchorCap);
    }
  }

  // ── 3 + 4. Fill to the budget; learning picks are policed inside tryAdd ───
  const rest = pool
    .filter((e) => !picks.has(e.c.id))
    .sort((a, b) => b.fitPerPound - a.fitPerPound || cmp(a.c.id, b.c.id));
  for (const e of rest) {
    if (spend >= budget) break;
    addBest(e, e.stars == null && !coldStart ? "learn" : "fill");
  }

  // ── Result ─────────────────────────────────────────────────────────────────
  const items: BasketItem[] = [];
  let maxAge = 0;
  for (const p of picks.values()) {
    const line = linePrice(p.e.c, p.qty, now);
    const item: BasketItem = {
      productId: p.e.c.id,
      qty: p.qty,
      unitPrice: toPounds(line.pence / p.qty),
      lineTotal: toPounds(line.pence),
      reason: reasonFor(p, line.dealGroup !== undefined, now),
    };
    if (line.dealGroup) item.dealGroup = line.dealGroup;
    items.push(item);
    maxAge = Math.max(maxAge, p.e.ageDays);
  }

  if (items.length === 0) {
    warnings.push(`Nothing we found fits in ${money(settings.budget_gbp)}. Try a bigger budget in Settings.`);
    return emptyResult(settings, warnings);
  }

  if (maxAge >= 7) warnings.push(`Some prices are ${Math.floor(maxAge)} days old.`);
  if (protein < weeklyProtein * 0.95) {
    const perDay = Math.round(protein / 7 / settings.people);
    warnings.push(
      `Couldn't reach your protein target within ${money(settings.budget_gbp)}: this gives about ${perDay}g a day against ${Math.round(settings.protein_g_per_day)}g.`,
    );
  }
  const detailed = pool.filter((e) => e.c.hasDetail).length;
  if (detailed < FULL_DETAIL_FLOOR) {
    warnings.push(`Only ${detailed} ${detailed === 1 ? "product has" : "products have"} full details yet.`);
  }
  if (coldStart) {
    warnings.push("You haven't rated many products yet, so this is mostly a best guess. Rating things helps.");
  }

  return {
    items,
    total: toPounds(spend),
    proteinG: Math.round(protein),
    warnings,
    settings,
  };
}

function reasonFor(p: Chosen, dealApplied: boolean, now: Date): string {
  const c = p.e.c;
  const deal = dealApplied ? bestMultibuy(c, now) : null;
  const offer = deal
    ? `on offer: ${dealLabel(deal)}`
    : c.nectarPrice != null && c.nectarPrice > 0 && c.nectarPrice < c.price
      ? `on offer: ${money(c.nectarPrice)} with Nectar`
      : null;
  const stars = p.e.stars;

  if (p.kind === "favourite") {
    const base = `You rated it ${stars ?? 4}★`;
    return offer ? `${base}, and it's ${offer}` : base;
  }
  if (offer) return offer.charAt(0).toUpperCase() + offer.slice(1);
  if (stars != null && stars >= 4) return `You rated it ${stars}★`;
  if (p.kind === "anchor") return "High protein for the price";
  if (p.kind === "learn") return `Worth a try: scores ${Math.round(c.health ?? p.e.fit)} out of 10`;
  return `Good fit for you (${Math.round(p.e.fit)} out of 10) at a fair price`;
}
