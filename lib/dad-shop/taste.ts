import { VOTE_NO_TASTE, VOTE_YES_TASTE, learnedFit, tasteScore } from "./fit";
import type { ProductCard } from "./types";

/**
 * What he likes, learned from what he does. PURE: no DB, no clock.
 *
 * In the spirit of the Tesco helper's `learn()`: his own star ratings are the
 * strongest signal; his Yes / No on basket picks come next; things he put on
 * his list or bought in past shops count a little. A product he has not rated
 * gets an estimate from products like it (same kind of food, same department,
 * same brand, same brand within the kind), each source backed by how many
 * signals it rests on, with Sainsbury's own review average as a faint extra.
 *
 * The estimate is a taste score 0-10 plus a confidence 0-1. Fit blends it in
 * at a lower weight than his own rating (see learnedFit in fit.ts).
 */

export type TasteSource = "rating" | "vote" | "list" | "shop";

/** One thing he did, with enough about the product to match it to others. */
export interface TasteRow {
  productId: string;
  source: TasteSource;
  /** rating: stars 1-5. vote: 1 or -1. list / shop: how many. */
  value: number;
  category: string | null;
  department: string | null;
  brand: string | null;
}

interface Signal {
  /** 0-10 */
  score: number;
  /** 0-1: how sure we are he feels that way. */
  weight: number;
  category: string | null;
  department: string | null;
  brand: string | null;
  kind: "rating" | "vote" | "inferred";
}

export interface TasteProfile {
  /** Every product he has told us something about, once. */
  byProduct: Map<string, Signal>;
  /** Products he rated with stars. */
  ratedCount: number;
  pools: {
    category: Map<string, Signal[]>;
    department: Map<string, Signal[]>;
    brand: Map<string, Signal[]>;
    brandCategory: Map<string, Signal[]>;
  };
}

export interface TasteEstimate {
  /** 0-10 */
  taste: number;
  /** 0-1 */
  conf: number;
  /** "you" = he told us about this very product. "learned" = worked out from similar ones. */
  src: "you" | "learned";
  /** Plain-English sources, strongest first. */
  from: string[];
}

export interface TasteSubject {
  id: string;
  category: string | null;
  department: string | null;
  brand: string | null;
  reviewAvg?: number | null;
  reviewCount?: number | null;
}

function norm(v: string | null): string | null {
  const t = v?.trim().toLowerCase();
  return t ? t : null;
}

/** Sainsbury's own brand says little about taste, so it counts for little. */
function isOwnBrand(brand: string): boolean {
  return brand.startsWith("sainsbury");
}

function push(map: Map<string, Signal[]>, key: string | null, s: Signal): void {
  if (!key) return;
  const list = map.get(key);
  if (list) list.push(s);
  else map.set(key, [s]);
}

/** How much a pool of n signals backs an estimate: one counts half of `max`, many approach it. */
function backed(n: number, max: number): number {
  return (max * n) / (n + 1);
}

export function buildTaste(rows: TasteRow[]): TasteProfile {
  // One signal per product: his stars beat his vote, which beats what he merely bought or listed.
  const best = new Map<string, Signal>();
  const bought = new Map<string, { qty: number; listed: number } & Pick<Signal, "category" | "department" | "brand">>();
  for (const r of [...rows].sort((a, b) => (a.productId < b.productId ? -1 : a.productId > b.productId ? 1 : a.source < b.source ? -1 : 1))) {
    const base = { category: norm(r.category), department: norm(r.department), brand: norm(r.brand) };
    if (r.source === "rating") {
      if (!Number.isFinite(r.value)) continue;
      best.set(r.productId, { ...base, score: tasteScore(Math.round(r.value)), weight: 1, kind: "rating" });
    } else if (r.source === "vote") {
      const cur = best.get(r.productId);
      if (cur?.kind === "rating") continue;
      best.set(r.productId, { ...base, score: r.value > 0 ? VOTE_YES_TASTE : VOTE_NO_TASTE, weight: 0.8, kind: "vote" });
    } else {
      const cur = bought.get(r.productId) ?? { ...base, qty: 0, listed: 0 };
      if (r.source === "shop") cur.qty += Math.max(1, r.value);
      else cur.listed += 1;
      bought.set(r.productId, cur);
    }
  }
  for (const [id, b] of bought) {
    if (best.has(id)) continue;
    // Bought before is a fair sign he liked it; just putting it on the list is a weaker one.
    const weight = b.qty > 0 ? Math.min(0.7, 0.5 + 0.05 * (b.qty - 1)) : 0.25;
    best.set(id, { category: b.category, department: b.department, brand: b.brand, score: b.qty > 0 ? 7.5 : 7, weight, kind: "inferred" });
  }

  const pools: TasteProfile["pools"] = { category: new Map(), department: new Map(), brand: new Map(), brandCategory: new Map() };
  let ratedCount = 0;
  for (const s of best.values()) {
    if (s.kind === "rating") ratedCount += 1;
    push(pools.category, s.category, s);
    push(pools.department, s.department, s);
    push(pools.brand, s.brand, s);
    if (s.brand && s.category) push(pools.brandCategory, `${s.brand}|${s.category}`, s);
  }
  return { byProduct: best, ratedCount, pools };
}

function poolStats(list: Signal[] | undefined): { est: number; n: number } | null {
  if (!list || list.length === 0) return null;
  let w = 0;
  let sum = 0;
  for (const s of list) {
    w += s.weight;
    sum += s.weight * s.score;
  }
  return w > 0 ? { est: sum / w, n: w } : null;
}

/** null when there is nothing to go on. */
export function estimateTaste(profile: TasteProfile, p: TasteSubject): TasteEstimate | null {
  const own = profile.byProduct.get(p.id);
  if (own && own.kind !== "inferred") {
    return { taste: own.score, conf: own.kind === "rating" ? 1 : own.weight, src: "you", from: [own.kind === "rating" ? "you rated it" : own.score >= 5 ? "you said yes to it" : "you said no to it"] };
  }

  const cat = norm(p.category);
  const dept = norm(p.department);
  const brand = norm(p.brand);
  const src: { est: number; w: number; why: string }[] = [];

  if (own) src.push({ est: own.score, w: own.weight, why: "you have had it before" });

  const c = poolStats(cat ? profile.pools.category.get(cat) : undefined);
  if (c && cat) src.push({ est: c.est, w: backed(c.n, 0.6), why: `${cat} (${profile.pools.category.get(cat)?.length} you've tried)` });
  const bc = brand && cat ? poolStats(profile.pools.brandCategory.get(`${brand}|${cat}`)) : null;
  if (bc && brand && cat) src.push({ est: bc.est, w: backed(bc.n, 0.5), why: `${p.brand} ${cat}` });
  const b = poolStats(brand ? profile.pools.brand.get(brand) : undefined);
  if (b && brand) src.push({ est: b.est, w: backed(b.n, isOwnBrand(brand) ? 0.1 : 0.3), why: `${p.brand} (${profile.pools.brand.get(brand)?.length} you've tried)` });
  const d = poolStats(dept ? profile.pools.department.get(dept) : undefined);
  if (d && dept) src.push({ est: d.est, w: backed(d.n, 0.2), why: `${dept} (${profile.pools.department.get(dept)?.length} you've tried)` });

  if (src.length === 0) return null;
  if (p.reviewAvg != null && (p.reviewCount ?? 0) >= 5) src.push({ est: p.reviewAvg * 2, w: 0.1, why: `shoppers give it ${p.reviewAvg.toFixed(1)} out of 5` });

  const sw = src.reduce((a, x) => a + x.w, 0);
  const taste = src.reduce((a, x) => a + x.est * x.w, 0) / sw;
  const conf = 1 - src.reduce((q, x) => q * (1 - x.w), 1);
  return {
    taste: Math.round(Math.min(10, Math.max(0, taste)) * 10) / 10,
    conf: Math.round(conf * 100) / 100,
    src: "learned",
    from: src.sort((x, y) => y.w - x.w).map((x) => x.why),
  };
}

/** Does his taste lean towards this kind of food? Falls back to false when it knows nothing. */
export function likesKind(profile: TasteProfile, p: TasteSubject): boolean {
  const e = estimateTaste(profile, p);
  return e != null && e.taste >= 6.5 && e.conf >= 0.25;
}

/** Fills in `learned` and blends the estimate into `fit` for products he has not rated. */
export function applyTaste<T extends ProductCard>(cards: T[], profile: TasteProfile): T[] {
  if (profile.byProduct.size === 0) return cards;
  return cards.map((c) => {
    if (c.stars != null) return c;
    const e = estimateTaste(profile, { id: c.id, category: c.category, department: c.department, brand: c.brand, reviewAvg: c.reviewAvg, reviewCount: c.reviewCount });
    if (!e) return c;
    return { ...c, fit: learnedFit(c.health, e.taste, e.conf) ?? c.fit, learned: { taste: e.taste, conf: e.conf, from: e.from } };
  });
}

/** The kinds of food (lower-case) he leans towards, so a query can fetch candidates from them. */
export function likedKeys(profile: TasteProfile): { categories: string[]; departments: string[]; brands: string[] } {
  const pick = (m: Map<string, Signal[]>, min: number): string[] => {
    const out: string[] = [];
    for (const [k, list] of m) {
      const st = poolStats(list);
      if (st && st.est >= 6.5 && st.n >= min) out.push(k);
    }
    return out.sort();
  };
  return { categories: pick(profile.pools.category, 0.25), departments: pick(profile.pools.department, 0.25), brands: pick(profile.pools.brand, 0.5) };
}
