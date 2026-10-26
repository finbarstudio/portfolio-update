import { fitScore, learnedFit } from "./fit";
import { bestMultibuy, dealLabel, linePrice, singlePence, toPence, toPounds } from "./pricing";
import { estimateTaste, type TasteEstimate, type TasteProfile } from "./taste";
import type { BasketItem, MealCoverage, Promo, SeedOil, Settings, StoreStatus } from "./types";
import { DEFAULT_SETTINGS } from "./types";
import { NO_DAYS } from "./votes";

/**
 * The weekly basket generator. PURE and deterministic: same input, same
 * output, no randomness, no clock (the caller passes `now`), no DB. Ties break
 * on product id. It never throws on bad data: it returns fewer items and a
 * warning instead.
 *
 * It builds a WEEK OF FOOD, not a pile of the cheapest protein:
 *   dinners     protein mains (meat, fish, meat-free, a good ready meal) or a dinner meal deal
 *   breakfasts  eggs, yoghurt, porridge and cereal, bread
 *   lunches     soup, tins, bread, cheese, eggs
 *   veg & fruit
 *   a few staples (milk, rice, pasta, tea...)
 * Servings scale with people x 7 days. The protein target is a soft goal, reported honestly.
 *
 * Votes: every Yes from the last basket stays; every No stays out for NO_DAYS
 * days. Ratings and his learned taste rank things inside each slot. Nothing
 * ever takes the total over the budget.
 */

export type Slot = "dinner" | "breakfast" | "lunch" | "veg" | "staples";

export interface Candidate {
  id: string;
  name: string;
  zone: string | null;
  category: string | null;
  department?: string | null;
  brand?: string | null;
  price: number;
  nectarPrice: number | null;
  packGrams: number | null;
  promos: Promo[];
  isAvailable: boolean;
  isFood: boolean;
  storage: string | null;
  /** Protein in g per 100g (or 100ml). */
  protein: number | null;
  /** Saturated fat in g per 100g. */
  sat?: number | null;
  seedOil: SeedOil;
  health: number | null;
  /** When the price was last seen. */
  listedAt: string | Date;
  /** True when nutrition and ingredients are both known. */
  hasDetail: boolean;
  ingredientCount?: number | null;
  /** A whole food with no label to read: plain fruit and veg (or one ingredient). Allowed even when its seed oil status is unknown. */
  wholeFood?: boolean;
  reviewAvg?: number | null;
  reviewCount?: number | null;
  /** On the shelf at Chislehurst? "no" is never picked; "yes" and "likely" are preferred. Missing counts as unknown. */
  storeStatus?: StoreStatus | null;
}

/** A dinner meal deal (Dine In and the like) with the products that can fill each part. */
export interface BasketDeal {
  id: string;
  title: string;
  /** The bundle price. */
  price: number;
  parts: { listId: number; label: string; qty: number }[];
  items: { listId: number; productId: string }[];
}

export interface VoteInfo {
  vote: 1 | -1;
  at: string | Date;
}

export interface BasketInput {
  candidates: Candidate[];
  /** product id -> stars (1-5) */
  ratings: Record<string, number>;
  /** product ids he has marked "not at my store" */
  notAtStore: string[];
  /** His Yes / No on basket picks, by product id. */
  votes?: Record<string, VoteInfo>;
  /** What he likes, learned (taste.ts). Without it, ratings and votes still count. */
  taste?: TasteProfile | null;
  deals?: BasketDeal[];
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
  meals: MealCoverage[];
}

export const MAX_AGE_DAYS = 14;
const MAX_CHILLED = 12;
const MAX_QTY = 3;
const MIN_HEALTH = 5;
const MAX_SAT = 5;
const FULL_DETAIL_FLOOR = 30;
const DAY_MS = 24 * 3600 * 1000;
const STAPLE_ITEMS = 4;
/** Quality points for how sure we are it is on the shelf (a point is about one Fit point). */
const STORE_YES = 1.2;
const STORE_LIKELY = 0.8;
const STORE_UNLIKELY = 0.8;
/** At least this many different products in each part of the week, when there are that many to choose from. */
const MIN_VARIETY = 3;
/** A multi-buy has to be at least this much cheaper per item to be worth chasing. */
const GOOD_DEAL = 0.08;
/** How much of any one meat or fish the dinners may be. */
const DINNER_KIND_SHARE = 0.45;

const SLOT_ORDER: Slot[] = ["dinner", "breakfast", "lunch", "veg", "staples"];

const SLOT_INFO: Record<Slot, { label: string; share: number; perPersonWeek: number }> = {
  dinner: { label: "Dinners", share: 0.46, perPersonWeek: 7 },
  breakfast: { label: "Breakfasts", share: 0.12, perPersonWeek: 7 },
  lunch: { label: "Lunches", share: 0.15, perPersonWeek: 7 },
  veg: { label: "Fruit and veg", share: 0.16, perPersonWeek: 14 },
  staples: { label: "Staples", share: 0.07, perPersonWeek: 0 },
};

interface Entry {
  c: Candidate;
  stars: number | null;
  vote: 1 | -1 | null;
  taste: TasteEstimate | null;
  fit: number;
  slots: Slot[];
  /** Units to buy at once: a multi-buy's full quantity, or 1. */
  bundleQty: number;
  /** Pence per unit at the price he pays (as the bundle when it is a good one). */
  unitPence: number;
  proteinUnit: number;
  ageDays: number;
  /** Grams of protein per pound at the price he pays. */
  proteinPerPound: number;
}

interface Chosen {
  e: Entry;
  qty: number;
  slot: Slot;
  kind: "kept" | "deal" | "pick" | "topup";
  /** Pence for the whole line. A deal's lines are shares of the bundle price. */
  pence: number;
  dealGroup?: string;
  dealNote?: string;
  /** A deal's lines are fixed: later passes never top them up. */
  locked: boolean;
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
  return c.category ?? c.department ?? c.zone ?? `~${c.id}`;
}

function money(n: number): string {
  return Number.isInteger(n) ? `£${n}` : `£${n.toFixed(2)}`;
}

function emptyResult(settings: Settings, warnings: string[]): BasketResult {
  return { items: [], total: 0, proteinG: 0, warnings, settings, meals: [] };
}

// ── Which part of the week a product feeds ──────────────────────────────────

const LOW = (s: string | null | undefined): string => (s ?? "").toLowerCase();

const DINNER_DEPTS = /^(chicken|beef|pork|lamb|turkey|gammon|game and venison|fish & seafood|meat free|just cook & slow cooked|meat & fish essentials|meat & poultry|ready meals|pizza, pasta & garlic bread|vegetarian)$/;
const STAPLE_DEPTS = /^(milk|rice|pasta|flour|tea)$/;
const PRODUCE_DEPTS = /^(fresh fruit|fresh vegetables|fresh salad)$/;

/** Plain-English slot guess from Sainsbury's own sections. A product can feed more than one part of the week. */
export function slotsOf(c: Pick<Candidate, "department" | "category" | "zone" | "name" | "packGrams">): Slot[] {
  const dept = LOW(c.department);
  const cat = LOW(c.category);
  const name = LOW(c.name);
  const both = `${cat} ${name}`;
  const tinned = dept === "canned and tinned food";
  // Big bags of dried pulses are cupboard staples, not a lunch.
  const dryPulses = tinned && /pulses|lentil|\bdal\b|chickpea/.test(both) && (c.packGrams ?? 0) >= 900;
  const out: Slot[] = [];
  if ((PRODUCE_DEPTS.test(dept) || LOW(c.zone) === "fruit and vegetables") && !/dried|\bdry\b/.test(both)) {
    out.push("veg");
  } else if ( (tinned && /tinned tomatoes|tinned vegetables|tinned fruit|sweetcorn|\bpeas\b/.test(both)) || (LOW(c.zone) === "frozen" && /\b(veg|vegetables|fruit|berries)\b/.test(`${dept} ${cat}`))) {
    out.push("veg");
  }
  if (DINNER_DEPTS.test(dept) && !(dept.startsWith("pizza") && /garlic bread|dough balls/.test(both))) out.push("dinner");
  if (dept === "bacon & sausages") out.push(/sausage/.test(both) ? "dinner" : "breakfast");
  if (dept === "eggs" || dept === "yogurts" || dept === "breakfast cereals" || /porridge|oats/.test(cat)) out.push("breakfast");
  if (dept === "eggs" || dept === "bread" || dept === "fresh soup" || dept === "cheese" || dept === "delicatessen" || dept === "wraps, thins and pittas") out.push("lunch");
  if (tinned && !dryPulses && /tinned fish|tuna|salmon|mackerel|sardine|beans|soup/.test(both)) out.push("lunch");
  if (dept === "bread") out.push("breakfast");
  if (tinned && /tinned fish|tuna|salmon|mackerel|sardine/.test(both)) out.push("dinner");
  if (STAPLE_DEPTS.test(dept) || dryPulses) out.push("staples");
  return [...new Set(out)];
}

/** Grams that make one serving of this in this part of the week. */
function servingGrams(c: Candidate, slot: Slot): number {
  const dept = LOW(c.department);
  const cat = `${LOW(c.category)} ${LOW(c.name)}`;
  if (slot === "dinner") {
    if (dept === "ready meals" || dept === "just cook & slow cooked") return 400;
    if (dept.startsWith("pizza")) return 350;
    if (dept === "meat free" || dept === "vegetarian") return 150;
    if (/tuna|salmon|mackerel|sardine/.test(cat) && dept === "canned and tinned food") return 120;
    return 160;
  }
  if (slot === "breakfast") {
    if (dept === "eggs") return 120;
    if (dept === "yogurts") return 150;
    if (dept === "breakfast cereals" || /porridge|oats/.test(cat)) return 45;
    if (dept === "bread") return 70;
    if (dept === "bacon & sausages") return 90;
    return 100;
  }
  if (slot === "lunch") {
    if (dept === "fresh soup") return 300;
    if (dept === "canned and tinned food") return 200;
    if (dept === "bread" || dept === "wraps, thins and pittas") return 70;
    if (dept === "cheese") return 40;
    if (dept === "eggs") return 120;
    return 100;
  }
  if (slot === "veg") return dept === "fresh fruit" ? 150 : 160;
  return 1_000_000;
}

function servingsPerUnit(c: Candidate, slot: Slot): number {
  if (slot === "staples") return 1;
  if (c.packGrams == null || !(c.packGrams > 0)) return 1;
  return Math.min(10, Math.max(1, Math.round(c.packGrams / servingGrams(c, slot))));
}

// ── The basket ──────────────────────────────────────────────────────────────

export function generateBasket(input: BasketInput): BasketResult {
  const settings = sanitiseSettings(input.settings);
  const { now } = input;
  const warnings: string[] = [];

  if (input.candidates.length === 0) {
    return emptyResult(settings, ["There are no products to choose from yet."]);
  }

  const blocked = new Set(input.notAtStore);
  const votes = input.votes ?? {};
  const budget = toPence(settings.budget_gbp);
  const weeklyProtein = settings.protein_g_per_day * 7 * settings.people;
  const taste = input.taste ?? null;

  const noRecently = (id: string): boolean => {
    const v = votes[id];
    if (!v || v.vote !== -1) return false;
    const t = v.at instanceof Date ? v.at.getTime() : Date.parse(v.at);
    return Number.isNaN(t) ? true : now.getTime() - t < NO_DAYS * DAY_MS;
  };
  const yes = (id: string): boolean => votes[id]?.vote === 1;

  // ── Who may be picked ─────────────────────────────────────────────────────
  const pool: Entry[] = [];
  const byId = new Map<string, Entry>();
  let stale = 0;
  for (const c of [...input.candidates].sort((a, b) => cmp(a.id, b.id))) {
    if (!c.isFood || !c.isAvailable || !(c.price > 0)) continue;
    if (blocked.has(c.id) || c.storeStatus === "no") continue;
    if (c.seedOil === "yes" || c.seedOil === "likely") continue;
    if (c.seedOil === "unknown" && !c.wholeFood) continue;
    if (noRecently(c.id)) continue;
    const stars = Object.prototype.hasOwnProperty.call(input.ratings, c.id) ? input.ratings[c.id] : null;
    if (stars != null && stars <= 2) continue;

    const est = taste && stars == null ? estimateTaste(taste, { id: c.id, category: c.category, department: c.department ?? null, brand: c.brand ?? null, reviewAvg: c.reviewAvg, reviewCount: c.reviewCount }) : null;
    if (est && est.src === "learned" && est.taste <= 3.5 && est.conf >= 0.4) continue;

    const keep = yes(c.id) || (stars != null && stars >= 4);
    if (!keep) {
      if (c.sat != null && c.sat > MAX_SAT) continue;
      const healthy = c.health != null ? c.health >= MIN_HEALTH : c.wholeFood === true;
      if (!healthy) continue;
    }

    const age = ageInDays(c.listedAt, now);
    if (age == null || age > MAX_AGE_DAYS) {
      stale += 1;
      continue;
    }

    const slots = slotsOf(c);
    const deal = bestMultibuy(c, now);
    const single = singlePence(c);
    let bundleQty = 1;
    let unitPence = single;
    if (deal?.qty) {
      const bundleUnit = linePrice(c, deal.qty, now).pence / deal.qty;
      if (bundleUnit <= single * (1 - GOOD_DEAL)) {
        bundleQty = deal.qty;
        unitPence = bundleUnit;
      }
    }
    const proteinUnit = proteinPerUnit(c);
    const baseHealth = c.health ?? (c.wholeFood ? 7 : null);
    let fit = fitScore(baseHealth, stars) ?? 5;
    if (est && est.src === "learned") fit = learnedFit(baseHealth, est.taste, est.conf) ?? fit;
    const entry: Entry = {
      c,
      stars,
      vote: votes[c.id]?.vote ?? null,
      taste: est,
      fit,
      slots,
      bundleQty,
      unitPence,
      proteinUnit,
      ageDays: age,
      proteinPerPound: unitPence > 0 ? proteinUnit / (unitPence / 100) : 0,
    };
    pool.push(entry);
    byId.set(c.id, entry);
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

  // ── Working state ─────────────────────────────────────────────────────────
  const picks = new Map<string, Chosen>();
  const categories = new Map<string, number>();
  const dinnerKinds = new Map<string, number>();
  const have: Record<Slot, number> = { dinner: 0, breakfast: 0, lunch: 0, veg: 0, staples: 0 };
  const count: Record<Slot, number> = { dinner: 0, breakfast: 0, lunch: 0, veg: 0, staples: 0 };
  const need: Record<Slot, number> = {
    dinner: SLOT_INFO.dinner.perPersonWeek * settings.people,
    breakfast: SLOT_INFO.breakfast.perPersonWeek * settings.people,
    lunch: SLOT_INFO.lunch.perPersonWeek * settings.people,
    veg: SLOT_INFO.veg.perPersonWeek * settings.people,
    staples: STAPLE_ITEMS,
  };
  let spend = 0;
  let protein = 0;
  let chilled = 0;

  const kindOf = (e: Entry): string => LOW(e.c.department) || categoryKey(e.c);
  const kindCap = Math.max(3, Math.ceil(need.dinner * DINNER_KIND_SHARE));

  /** Quality for ranking inside a part of the week: how well it suits him, how good a deal, how much protein. */
  function quality(e: Entry): number {
    const c = e.c;
    let q = e.fit;
    if (e.stars != null) q += e.stars >= 4 ? 2.5 : e.stars === 3 ? 0.5 : 0;
    if (e.vote === 1) q += 2.5;
    if (e.taste && e.taste.src === "learned") q += (e.taste.taste - 6) * 0.4 * e.taste.conf;
    const full = toPence(c.price);
    if (full > 0 && e.unitPence < full) q += Math.min(0.5, (full - e.unitPence) / full) * 4;
    if (c.protein != null) q += Math.min(c.protein, 25) / 12.5;
    if (c.sat != null && c.sat <= 1.5) q += 0.5;
    if (c.ingredientCount != null && c.ingredientCount <= 5) q += 0.5;
    // Between similar items, the one that is on the shelf at Chislehurst.
    if (c.storeStatus === "yes") q += STORE_YES;
    else if (c.storeStatus === "likely") q += STORE_LIKELY;
    else if (c.storeStatus === "unlikely") q -= STORE_UNLIKELY;
    return q;
  }

  function rank(e: Entry, slot: Slot): number {
    const s = servingsPerUnit(e.c, slot);
    const perServing = e.unitPence / 100 / s;
    // A pack that would feed most of what is still needed crowds out variety.
    const missing = Math.max(1, need[slot] - have[slot]);
    const crowd = slot === "staples" ? 0 : Math.min(2, 0.4 * Math.max(0, s - missing * 0.5));
    return quality(e) - 1.1 * perServing - crowd;
  }

  /** Add `qty` units if every limit allows it. A product already picked only grows when `grow` is set. */
  function tryAdd(e: Entry, qty: number, slot: Slot, kind: Chosen["kind"], spendCap: number, grow = false): boolean {
    const existing = picks.get(e.c.id);
    if (existing && (!grow || existing.locked)) return false;
    const newQty = (existing?.qty ?? 0) + qty;
    if (newQty > Math.max(MAX_QTY, e.bundleQty)) return false;
    const newPence = linePrice(e.c, newQty, now).pence;
    const delta = newPence - (existing?.pence ?? 0);
    if (spend + delta > Math.min(budget, spendCap)) return false;

    const servings = servingsPerUnit(e.c, slot) * qty;
    if (!existing) {
      const free = kind === "kept";
      const key = categoryKey(e.c);
      if (!free && (categories.get(key) ?? 0) >= settings.max_per_category) return false;
      if (!free && e.c.storage === "chilled" && chilled >= MAX_CHILLED) return false;
      categories.set(key, (categories.get(key) ?? 0) + 1);
      if (e.c.storage === "chilled") chilled += 1;
    }
    if (slot === "dinner" && kind !== "kept") {
      const used = dinnerKinds.get(kindOf(e)) ?? 0;
      if (used + servings > kindCap && used > 0) return false;
    }
    if (slot === "dinner") dinnerKinds.set(kindOf(e), (dinnerKinds.get(kindOf(e)) ?? 0) + servings);

    spend += delta;
    protein += e.proteinUnit * qty;
    have[slot] += slot === "staples" ? (existing ? 0 : 1) : servings;
    if (!existing) count[slot] += 1;
    picks.set(e.c.id, { e, qty: newQty, slot: existing?.slot ?? slot, kind: existing?.kind ?? kind, pence: newPence, locked: false });
    return true;
  }

  /** How many units to buy to cover what is still missing, whole multi-buys or single units. */
  function unitsFor(e: Entry, slot: Slot): number {
    const s = servingsPerUnit(e.c, slot);
    const missing = Math.max(1, need[slot] - have[slot]);
    // No one product feeds more than about half the week, so a big pack of chicken doesn't become every dinner.
    const most = Math.max(1, Math.floor((need[slot] * 0.45) / s));
    const want = Math.min(MAX_QTY, most, Math.max(1, Math.ceil(missing / s)));
    if (e.bundleQty > 1) {
      const fresh = e.c.storage === "chilled";
      const whole = e.bundleQty;
      if (!fresh || whole * s <= missing + s) return Math.max(whole, 1);
    }
    return e.bundleQty > 1 ? Math.min(want, e.bundleQty - 1) : want;
  }

  // ── 1. Everything he said Yes to last time stays ──────────────────────────
  const kept = new Set<string>();
  const previous = [...(input.previous?.items ?? [])].sort((a, b) => cmp(a.productId, b.productId));
  for (const prev of previous) {
    if (!yes(prev.productId)) continue;
    const e = byId.get(prev.productId) ?? relaxed(prev.productId);
    if (!e) {
      warnings.push("One of the things you said yes to can't be kept: it isn't on the shelf any more or is not at your store.");
      continue;
    }
    const slot = prev.slot ?? e.slots[0] ?? "staples";
    const want = Math.min(MAX_QTY, Math.max(1, Math.round(prev.qty) || 1));
    if (tryAdd(e, want, slot, "kept", Number.POSITIVE_INFINITY) || tryAdd(e, 1, slot, "kept", Number.POSITIVE_INFINITY)) kept.add(e.c.id);
    else warnings.push(`${e.c.name} stays out because it would take you over ${money(settings.budget_gbp)}.`);
  }

  /** A Yes item that fell out of the pool for a soft reason (health, age) can still be kept. */
  function relaxed(id: string): Entry | null {
    const c = input.candidates.find((x) => x.id === id);
    if (!c || !c.isFood || !c.isAvailable || !(c.price > 0) || blocked.has(id) || c.seedOil === "yes") return null;
    const slots = slotsOf(c);
    const single = singlePence(c);
    const proteinUnit = proteinPerUnit(c);
    return {
      c, stars: input.ratings[id] ?? null, vote: 1, taste: null, fit: fitScore(c.health, input.ratings[id] ?? null) ?? 5, slots,
      bundleQty: 1, unitPence: single, proteinUnit, ageDays: ageInDays(c.listedAt, now) ?? 0, proteinPerPound: single > 0 ? proteinUnit / (single / 100) : 0,
    };
  }

  // ── 2. A dinner meal deal, priced as a bundle, when it genuinely saves ────
  const dealsTaken: string[] = [];
  const dealCap = Math.floor(budget * 0.6);
  const dealOptions: { deal: BasketDeal; lines: { e: Entry; qty: number }[]; saving: number; meals: number }[] = [];
  for (const deal of [...(input.deals ?? [])].sort((a, b) => cmp(a.id, b.id))) {
    const lines = new Map<string, { e: Entry; qty: number }>();
    let ok = deal.parts.length > 0;
    let meals = 0;
    for (const part of [...deal.parts].sort((a, b) => a.listId - b.listId)) {
      const options = deal.items
        .filter((i) => i.listId === part.listId)
        .map((i) => byId.get(i.productId))
        .filter((e): e is Entry => e != null && !picks.has(e.c.id))
        .sort((a, b) => rank(b, "dinner") - rank(a, "dinner") || cmp(a.c.id, b.c.id));
      if (options.length === 0) {
        ok = false;
        break;
      }
      for (let k = 0; k < part.qty; k++) {
        const e = options[Math.min(k, options.length - 1)];
        const cur = lines.get(e.c.id);
        lines.set(e.c.id, { e, qty: (cur?.qty ?? 0) + 1 });
      }
      if (/main|pizza|meal|curry|pasta/i.test(part.label)) meals += part.qty;
    }
    if (!ok) continue;
    const singles = [...lines.values()].reduce((s, l) => s + singlePence(l.e.c) * l.qty, 0);
    const saving = singles - toPence(deal.price);
    if (saving < 50) continue;
    dealOptions.push({ deal, lines: [...lines.values()], saving, meals: Math.max(1, meals) });
  }
  dealOptions.sort((a, b) => b.saving - a.saving || cmp(a.deal.id, b.deal.id));
  for (const opt of dealOptions) {
    if (dealsTaken.length >= 2) break;
    const price = toPence(opt.deal.price);
    if (have.dinner + opt.meals > need.dinner + 1) continue;
    if (spend + price > Math.min(budget, dealCap)) continue;
    if (opt.lines.some((l) => picks.has(l.e.c.id))) continue;
    if (opt.lines.some((l) => (categories.get(categoryKey(l.e.c)) ?? 0) >= settings.max_per_category)) continue;
    const singles = opt.lines.reduce((s, l) => s + singlePence(l.e.c) * l.qty, 0);
    // Share the bundle price between its products by what each would cost alone; the last takes the rounding.
    let given = 0;
    opt.lines.forEach((l, i) => {
      const share = i === opt.lines.length - 1 ? price - given : Math.round((price * singlePence(l.e.c) * l.qty) / singles);
      given += share;
      picks.set(l.e.c.id, {
        e: l.e,
        qty: l.qty,
        slot: "dinner",
        kind: "deal",
        pence: share,
        dealGroup: opt.deal.id,
        dealNote: `Part of ${opt.deal.title}: ${opt.deal.parts.map((p) => `${p.qty} ${p.label.toLowerCase()}`).join(" + ")} for ${money(opt.deal.price)}`,
        locked: true,
      });
      categories.set(categoryKey(l.e.c), (categories.get(categoryKey(l.e.c)) ?? 0) + 1);
      if (l.e.c.storage === "chilled") chilled += 1;
      protein += l.e.proteinUnit * l.qty;
    });
    spend += price;
    have.dinner += opt.meals;
    dealsTaken.push(opt.deal.id);
  }

  // ── 3. Each part of the week, best first, until it is covered ─────────────
  let carry = 0;
  for (const slot of SLOT_ORDER) {
    const startSpend = spend;
    const cap = Math.floor(budget * SLOT_INFO[slot].share) + carry;
    // The first pick in a part of the week may use whatever is left, so a small budget still buys something.
    const startSpendCap = startSpend + cap;
    const ranked = pool
      .filter((e) => e.slots.includes(slot) && !picks.has(e.c.id))
      .sort((a, b) => rank(b, slot) - rank(a, slot) || cmp(a.c.id, b.c.id));
    for (const e of ranked) {
      // Covered, and with some variety: a week of dinners is never one pack of one thing.
      if (have[slot] >= need[slot] && count[slot] >= Math.min(MIN_VARIETY, Math.ceil(need[slot] / 3))) break;
      const qty = unitsFor(e, slot);
      const limit = have[slot] === 0 ? Number.POSITIVE_INFINITY : startSpendCap;
      if (!tryAdd(e, qty, slot, "pick", limit) && qty > 1) tryAdd(e, 1, slot, "pick", limit);
    }
    carry = Math.max(0, startSpendCap - spend);
  }

  // ── 4. Protein is a soft goal: top up with the best protein per pound ─────
  if (protein < weeklyProtein * 0.95) {
    const topup = pool
      .filter((e) => e.proteinUnit > 0 && e.slots.some((s) => s === "dinner" || s === "breakfast" || s === "lunch"))
      .sort((a, b) => b.proteinPerPound - a.proteinPerPound || cmp(a.c.id, b.c.id));
    for (const e of topup) {
      if (protein >= weeklyProtein * 0.95) break;
      const slot = e.slots.find((s) => s === "dinner" || s === "breakfast" || s === "lunch") ?? "dinner";
      if (picks.has(e.c.id)) tryAdd(e, 1, slot, "topup", Number.POSITIVE_INFINITY, true);
      else tryAdd(e, Math.max(1, e.bundleQty === 1 ? 1 : e.bundleQty), slot, "topup", Number.POSITIVE_INFINITY);
    }
  }

  // ── Result ────────────────────────────────────────────────────────────────
  const items: BasketItem[] = [];
  let maxAge = 0;
  const ordered = [...picks.values()].sort((a, b) => SLOT_ORDER.indexOf(a.slot) - SLOT_ORDER.indexOf(b.slot) || cmp(a.e.c.id, b.e.c.id));
  for (const p of ordered) {
    const live = p.kind === "deal" ? null : linePrice(p.e.c, p.qty, now);
    const pence = p.kind === "deal" ? p.pence : (live?.pence ?? p.pence);
    const item: BasketItem = {
      productId: p.e.c.id,
      qty: p.qty,
      unitPrice: toPounds(pence / p.qty),
      lineTotal: toPounds(pence),
      reason: reasonFor(p, live?.dealGroup !== undefined, now),
      slot: p.slot,
    };
    const group = p.dealGroup ?? live?.dealGroup;
    if (group) item.dealGroup = group;
    items.push(item);
    maxAge = Math.max(maxAge, p.e.ageDays);
  }

  if (items.length === 0) {
    warnings.push(`Nothing we found fits in ${money(settings.budget_gbp)}. Try a bigger budget in Settings.`);
    return emptyResult(settings, warnings);
  }

  const meals: MealCoverage[] = SLOT_ORDER.map((slot) => ({
    slot,
    label: SLOT_INFO[slot].label,
    have: Math.round(have[slot]),
    need: need[slot],
  }));
  for (const m of meals) {
    if (m.slot === "staples") continue;
    if (m.have < m.need * 0.7) {
      const word = m.slot === "veg" ? "portions of fruit and veg" : m.label.toLowerCase();
      warnings.push(`Only found enough for ${Math.min(m.have, m.need)} of ${m.need} ${word} that fit your rules.`);
    }
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
  const rated = pool.filter((e) => e.stars != null && e.stars >= 3).length + Object.keys(votes).length;
  if (rated < 5) {
    warnings.push("You haven't rated many products yet, so this is mostly a best guess. Rating things, and saying yes or no below, helps.");
  }

  return {
    items,
    total: toPounds(spend),
    proteinG: Math.round(protein),
    warnings,
    settings,
    meals,
  };
}

const SLOT_LEAD: Record<Slot, string> = {
  dinner: "Dinner",
  breakfast: "Breakfast",
  lunch: "Lunch",
  veg: "Fruit and veg",
  staples: "Staple",
};

function reasonFor(p: Chosen, dealApplied: boolean, now: Date): string {
  const c = p.e.c;
  if (p.kind === "deal" && p.dealNote) return p.dealNote;
  if (p.kind === "kept") {
    return p.e.vote === 1 ? "You said yes last time, so it stays" : `You rated it ${p.e.stars ?? 4}★`;
  }
  const deal = dealApplied ? bestMultibuy(c, now) : null;
  const offer = deal
    ? `On offer: ${dealLabel(deal)}`
    : c.nectarPrice != null && c.nectarPrice > 0 && c.nectarPrice < c.price
      ? `On offer: ${money(c.nectarPrice)} with Nectar`
      : null;
  const stars = p.e.stars;
  const lead = SLOT_LEAD[p.slot];
  const bits: string[] = [];
  if (stars != null && stars >= 4) bits.push(`you rated it ${stars}★`);
  else if (p.e.taste && p.e.taste.src === "learned" && p.e.taste.taste >= 7 && p.e.taste.conf >= 0.3) bits.push("close to things you like");
  else if (c.protein != null && c.protein >= 15 && p.slot !== "veg") bits.push(`${Math.round(c.protein)}g protein per 100g`);
  else if (c.ingredientCount != null && c.ingredientCount <= 2) bits.push(c.ingredientCount === 1 ? "just 1 ingredient" : "just 2 ingredients");
  else if (c.health != null) bits.push(`health ${Math.round(c.health)}/10`);
  const head = bits.length > 0 ? `${lead}: ${bits[0]}` : lead;
  return offer ? `${head}. ${offer}` : head;
}
