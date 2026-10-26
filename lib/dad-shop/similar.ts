import { prepApplies, prepOf, type Prep } from "./prep";
import { gbp, groupPromo, pctOff, satTone, type Tone } from "./format";
import { nowPence, offerLabel, priceView, tidyMoney } from "./pricing";
import { BASE_PATH, type ProductCard } from "./types";

/**
 * Similar products: what counts as "the same type", how a pool is ordered
 * with this product pinned, and which value wins each column in Compare.
 * Pure, so it can be tested; the database part is catalog.ts `getSimilarSection`.
 */

/** Fewer than this many others in a group and we widen to the next one. */
export const MIN_SIMILAR = 6;

/** A department can hold hundreds; show the best of them. */
export const MAX_SHOWN = 120;

export type SimilarScope = "group" | "category+animal" | "category" | "department";

/** How many OTHER products share each level with the one being looked at. */
export interface ScopeCounts {
  /** Same category and same animal (0 when the animal is not known). */
  categoryAnimal: number;
  category: number;
  department: number;
}

/**
 * The same category, narrowed to the same animal when it is known (chicken
 * next to chicken, not next to salmon). Too few? Drop the animal. Still too
 * few? Use the whole department.
 */
export function pickScope(c: ScopeCounts): SimilarScope {
  if (c.categoryAnimal >= MIN_SIMILAR) return "category+animal";
  if (c.category >= MIN_SIMILAR) return "category";
  return "department";
}

/** What the heading calls the group: "mince · beef", "raw chicken breast & fillet", "dairy". Plain words. */
export function scopeLabel(
  scope: SimilarScope,
  me: { category: string | null; department: string | null; animal: string | null; productGroup?: string | null },
  prep: Prep | null = null,
  protein: string | null = null,
): string {
  if (scope === "group" && me.productGroup) return protein ? `${me.productGroup} · ${protein}` : me.productGroup;
  const cat = (me.category ?? me.department ?? "").toLowerCase();
  const dept = (me.department ?? me.category ?? "").toLowerCase();
  const base = scope === "department" ? dept : scope === "category" ? cat : me.animal && cat && !cat.includes(me.animal) ? `${me.animal} · ${cat}` : cat;
  return prep ? `${prep} ${base}` : base;
}

/** What `similarScope` needs to know about a product. */
export interface Candidate {
  id: string;
  name: string;
  zone: string | null;
  department: string | null;
  category: string | null;
  animal: string | null;
  /** The comparison group, once the pipeline has classified it. */
  productGroup: string | null;
  proteinMain: string | null;
}

export interface ScopeResult {
  scope: SimilarScope;
  /** The ids of the other products that count as similar (this one is not in it). */
  ids: string[];
  /** Set when only products prepared the same way (raw, cooked, breaded, marinated) were kept. Only without a group. */
  prep: Prep | null;
  /** The comparison group, when that is what similar means. */
  group: string | null;
  /** The proteins in the group, to narrow by; empty when it has one (or none). */
  proteins: { protein: string; n: number }[];
  /** The protein the list is narrowed to, null for all. */
  protein: string | null;
}

/**
 * THE one place that decides what "similar" means.
 *
 * With a comparison group (products.product_group): everything in the same
 * group, and nothing else. The groups already keep raw, cooked, breaded and
 * marinated apart, so there is no widening to the department when the group is
 * small. Where the group covers several proteins (mince: beef, lamb, pork...) it
 * is narrowed to this product's own protein unless `choice` says "any" or another one.
 *
 * Without a group (not classified yet): the same category, narrowed to the same
 * animal when it is known, widened to the department when the category is small,
 * and for fresh and frozen meat and fish only products prepared the same way
 * (prep.ts). `all` is the group, or else the department, this product is in.
 */
export function similarScope(me: Candidate, all: Candidate[], choice = ""): ScopeResult {
  if (me.productGroup) {
    const inGroup = all.filter((c) => c.productGroup === me.productGroup);
    const tally = new Map<string, number>();
    for (const c of inGroup) if (c.proteinMain) tally.set(c.proteinMain, (tally.get(c.proteinMain) ?? 0) + 1);
    const proteins = tally.size > 1 ? [...tally.entries()].map(([protein, n]) => ({ protein, n })).sort((a, b) => b.n - a.n || (a.protein < b.protein ? -1 : 1)) : [];
    let protein: string | null = null;
    if (proteins.length > 0 && choice !== "any") {
      if (choice && tally.has(choice)) protein = choice;
      else if (me.proteinMain && tally.has(me.proteinMain)) protein = me.proteinMain;
    }
    const ids = inGroup.filter((c) => c.id !== me.id && (protein === null || c.proteinMain === protein)).map((c) => c.id);
    return { scope: "group", ids, prep: null, group: me.productGroup, proteins, protein };
  }

  const prep = prepApplies(me) ? prepOf(me.name) : null;
  const others = all.filter((c) => c.id !== me.id && c.department === me.department && (prep === null || (prepApplies(c) && prepOf(c.name) === prep)));
  const inCat = me.category != null ? others.filter((c) => c.category === me.category) : [];
  const inCatAnimal = me.animal != null ? inCat.filter((c) => c.animal === me.animal) : [];
  const scope = pickScope({ categoryAnimal: inCatAnimal.length, category: inCat.length, department: others.length });
  const pool = scope === "category+animal" ? inCatAnimal : scope === "category" ? inCat : others;
  return { scope, ids: pool.map((c) => c.id), prep, group: null, proteins: [], protein: null };
}

export interface PoolRow {
  id: string;
  /** Passes the filters that are on. */
  passes: boolean;
  /** Best overall score (higher is better), always worked out so the rank does not move with the sort. */
  best: number | null;
  /** The chosen sort's score (higher first). */
  score: number | null;
}

export interface Selection {
  /** This product first, then the ones that pass, in the chosen sort. */
  ids: string[];
  /** Everything compared, this one included. */
  total: number;
  /** Left out by the filters (this one is never left out). */
  hidden: number;
  /** Passed the filters but cut off to keep the page light. */
  capped: number;
  /** This one's place on Best overall among all of them, 1 is best. */
  rank: number | null;
  /** Everyone's place on Best overall. */
  ranks: Record<string, number>;
}

function byScore<T extends { id: string }>(items: T[], get: (t: T) => number | null): T[] {
  return items
    .slice()
    .sort((a, b) => {
      const x = get(a);
      const y = get(b);
      if (x === null && y === null) return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
      if (x === null) return 1;
      if (y === null) return -1;
      return y - x || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    });
}

/** Pins `meId` first, applies the filters to the rest, and works out the count line and the ranks. */
export function selectSimilar(rows: PoolRow[], meId: string, cap: number = MAX_SHOWN): Selection {
  const ranks: Record<string, number> = {};
  byScore(rows, (r) => r.best).forEach((r, i) => {
    ranks[r.id] = i + 1;
  });
  const others = byScore(
    rows.filter((r) => r.id !== meId && r.passes),
    (r) => r.score,
  );
  const hasMe = rows.some((r) => r.id === meId);
  const all = hasMe ? [meId, ...others.map((r) => r.id)] : others.map((r) => r.id);
  const ids = all.slice(0, cap);
  return { ids, total: rows.length, hidden: rows.length - all.length, capped: all.length - ids.length, rank: ranks[meId] ?? null, ranks };
}

// ── Compare ─────────────────────────────────────────────────────────────────

export type CompareColumn = "unit" | "protein" | "sat" | "ingredients" | "upf";

export interface CompareValues {
  id: string;
  /** What he pays per kg or litre, Nectar and offers counted. */
  unit: number | null;
  unitMeasure: "kg" | "ltr" | null;
  /** Grams per 100g. */
  protein: number | null;
  sat: number | null;
  satTone: Tone | null;
  ingredients: number | null;
  upf: number | null;
}

export function compareValues(c: ProductCard, now: Date): CompareValues {
  const measure = c.unitMeasure === "kg" || c.unitMeasure === "ltr" ? c.unitMeasure : null;
  const each = nowPence(c, now) / 100;
  // The shelf unit price is for the shelf price; scale it to what he really pays.
  const unit = measure && c.unitPrice != null && c.unitPrice > 0 && c.price > 0 ? Math.round(((c.unitPrice * each) / c.price) * 100) / 100 : null;
  return {
    id: c.id,
    unit,
    unitMeasure: unit != null ? measure : null,
    protein: c.protein,
    sat: c.sat,
    satTone: satTone(c.sat),
    ingredients: c.isBasic && c.ingredientCount == null ? 1 : c.ingredientCount,
    upf: c.upfCount,
  };
}

/** "£4.20/kg", "£1.10/l". */
export function unitText(v: CompareValues): string | null {
  return v.unit != null && v.unitMeasure ? `${gbp(v.unit)}/${v.unitMeasure === "ltr" ? "l" : "kg"}` : null;
}

/**
 * The winners of each numeric column: cheapest per kg, most protein, least
 * saturated fat, fewest ingredients, fewest ultra-processing markers. Ties all
 * win. Nothing is marked when fewer than two products have a value, or they
 * are all the same: a highlight must mean something. Per kg only compares
 * products measured the same way (the commonest one).
 */
export function bestInColumns(rows: CompareValues[]): Record<CompareColumn, Set<string>> {
  const out: Record<CompareColumn, Set<string>> = { unit: new Set(), protein: new Set(), sat: new Set(), ingredients: new Set(), upf: new Set() };

  const measures = new Map<string, number>();
  for (const r of rows) if (r.unit != null && r.unitMeasure) measures.set(r.unitMeasure, (measures.get(r.unitMeasure) ?? 0) + 1);
  const common = [...measures.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  const mark = (col: CompareColumn, pick: (r: CompareValues) => number | null, want: "min" | "max") => {
    const vals = rows.map((r) => ({ id: r.id, v: pick(r) })).filter((x): x is { id: string; v: number } => x.v !== null);
    if (vals.length < 2) return;
    const best = want === "min" ? Math.min(...vals.map((x) => x.v)) : Math.max(...vals.map((x) => x.v));
    if (vals.every((x) => x.v === best)) return;
    for (const x of vals) if (x.v === best) out[col].add(x.id);
  };
  mark("unit", (r) => (r.unitMeasure === common ? r.unit : null), "min");
  mark("protein", (r) => (r.protein != null && r.protein > 0 ? r.protein : null), "max");
  mark("sat", (r) => r.sat, "min");
  mark("ingredients", (r) => (r.ingredients != null && r.ingredients > 0 ? r.ingredients : null), "min");
  mark("upf", (r) => r.upf, "min");
  return out;
}

// ── Remembered choice ───────────────────────────────────────────────────────

export type SimilarLayout = "cards" | "compare";
export const LAYOUT_KEY = "dadshop.similar.layout";

export function parseLayout(raw: string | null): SimilarLayout {
  return raw === "compare" ? "compare" : "cards";
}

// ── The offer pill, shared by the card and Compare ──────────────────────────

export interface OfferPill {
  text: string;
  /** Where tapping it goes: the offer's page, or the meal deal. Null for a plain price cut. */
  href: string | null;
  tone: "offer" | "off";
}

/** The one pill on a product: a multi-buy, else a meal deal, else the size of the cut. */
export function offerPill(p: ProductCard, now: Date, inMealPage = false): OfferPill | null {
  const multi = groupPromo(p, now);
  if (multi) return { text: tidyMoney(offerLabel(multi)), href: `${BASE_PATH}/offer/${encodeURIComponent(multi.uid)}`, tone: "offer" };
  const meal = p.promos.find((x) => x.kind === "mealdeal");
  if (meal && !inMealPage) return { text: "Meal deal", href: `${BASE_PATH}/meal/${encodeURIComponent(meal.uid)}`, tone: "offer" };
  const off = pctOff(p);
  if (off != null) return { text: `−${off}%`, href: null, tone: "off" };
  if (priceView(p, now).cut) return { text: "Offer", href: null, tone: "off" };
  return null;
}
