import { healthBreakdown, isWholeFood, valueBreakdown } from "./breakdown";
import { overallScore } from "./overall";
import { fullPence, livePromos, nowPence, offerLabel, priceView, tidyMoney, toPence } from "./pricing";
import { shownPromos } from "./format";
import taxonomy from "./group-taxonomy.json";
import type { Nutrition, ProductCard, Promo } from "./types";

/**
 * The catalogue the app downloads once (api/app/catalog) and works on in the browser, in the field names the Tesco
 * app uses (its deals.json items) filled with Sainsbury's values and Dad's own scores. PURE: the database side lives
 * in app-catalog-db.ts, which feeds ProductCards (catalog.ts mapCard, the one scoring path) into toItem.
 *
 * Nothing here knows about him: health, value and score are the objective, taste-neutral numbers. His ratings live in
 * app_docs and the client blends them in. A slim item has no ingredients text, no fitWhy and no raw nutrition; the
 * product page asks api/app/product/[id] for those.
 */

export { CATALOG_PARTS } from "./app-parts";

export const SAINSBURYS_PRODUCT_URL = "https://www.sainsburys.co.uk/gol-ui/product/";

/** The staples his shop is built around (api/app/meta `needs`). */
export const DAD_NEEDS: readonly string[] = [
  "greek yogurt",
  "beef mince",
  "eggs",
  "peri peri chicken",
  "chicken breast",
  "steak",
  "salmon",
  "cottage cheese",
];

export interface ItemBest {
  kind: "price" | "multi";
  label: string;
  minQty: number;
  /** £ each at this offer. */
  unitPrice: number;
  /** 0-1 off the usual price. */
  discount: number;
}

export interface ItemStore {
  /** "unlikely" from the feed is shown as "unknown": the app only says "Check in store", never "not stocked", from absence. */
  status: "yes" | "likely" | "unknown" | "no";
  reason: string;
  inStock: boolean | null;
  checkedAt: string | null;
}

export interface ItemDeal {
  id: string;
  title: string;
  /** Which part of the meal deal it fills ("Main", "Side"...). */
  part: string;
}

export interface Item {
  id: string;
  name: string;
  img?: string;
  /** Sainsbury's product page. */
  url?: string;
  brand?: string;
  /** App category and department, from the comparison group's place in group-taxonomy.json ("other" when unclassified). */
  cat: string;
  dept: string;
  group?: string;
  subtype?: string;
  /** Main protein: beef, chicken, egg... */
  protein?: string;
  rating?: number;
  reviews?: number;
  isNew: boolean;
  /** Shelf price before any offer, £. */
  regular: number;
  regUnit?: { price: number; unit: string };
  offers: string[];
  onOffer: boolean;
  offerShort?: string;
  /** ISO date the soonest offer ends. */
  ends?: string;
  /** 0-1 */
  discount: number;
  best?: ItemBest;
  compare?: { per: string; value: number; kind: "protein" | "unit" };
  packG?: number;
  packLabel?: string;
  packEst?: boolean;
  /** Grams of protein in the whole pack. */
  packProtein?: number;
  /** Grams of protein per £ at the price he pays. */
  proteinPerPound?: number;
  protPer100kcal?: number;
  n100?: { kcal?: number; protein?: number; fat?: number; sat?: number; carbs?: number; sugar?: number; fibre?: number; salt?: number };
  /** Present only when the ingredients have been read. */
  proc?: { count: number; markers: string[] };
  seedOil: "none" | "likely" | "yes" | "unknown";
  /** A label only: never changes a score. */
  folic: boolean;
  /** A plain food you cook with (raw meat, eggs, veg, rice): one ingredient even when the pack lists none. */
  isBasic: boolean;
  /** The objective health score, 0-10 (null: not scored yet). fitRaw and fit are the same number; the client blends his rating in. */
  fitRaw: number | null;
  fit: number | null;
  health: number | null;
  fitParts: { protein: number | null; sat: number | null; processing: number | null };
  why: string[];
  /** 0-10, null when it can't be judged. */
  value: number | null;
  valueParts: { cheap: number; deal: number; discount: number; bestUnit?: number };
  /** Best overall 0-10 (health 0.6, value 0.25, taste 0.15) with taste neutral. */
  score: number;
  /** More than 5g saturates per 100g AND processed (a whole food's saturates are never counted against it). */
  highSat: boolean;
  frozen: boolean;
  storage?: string;
  nonFood: false;
  /** Taste the Difference. */
  premium: boolean;
  /** Sainsbury's own brand (not Taste the Difference). */
  ownBrand: boolean;
  store: ItemStore;
  /** Not at Chislehurst (his report or the feed says no), or out of stock there right now. */
  oos: boolean;
  deal?: ItemDeal;
}

export interface ItemDetail extends Item {
  ingredients: string | null;
  nutrition: Nutrition | null;
  fitWhy: Record<string, string[]>;
  history: { on: string; price: number; nectar: number | null }[];
}

/** What a ProductCard cannot say on its own. */
export interface ItemExtra {
  slug: string | null;
  nutrition: Nutrition | null;
  deal: ItemDeal | null;
}

// ── helpers ──────────────────────────────────────────────────────────────────

const r1 = (n: number): number => Math.round(n * 10) / 10;
const r2 = (n: number): number => Math.round(n * 100) / 100;
const r3 = (n: number): number => Math.round(n * 1000) / 1000;
const pounds = (pence: number): number => Math.round(pence) / 100;
const money = (pence: number): string => `£${(Math.round(pence) / 100).toFixed(2)}`;

interface TaxEntry {
  g: string;
  cat?: string;
  dept?: string;
}

const GROUP_PLACE: ReadonlyMap<string, { cat: string; dept: string }> = new Map(
  (taxonomy.groups as TaxEntry[]).map((g) => [g.g, { cat: g.cat ?? "other", dept: g.dept ?? g.cat ?? "other" }] as const),
);

/** The app category and department a comparison group is filed under. Unclassified products are "other". */
export function placeOfGroup(group: string | null): { cat: string; dept: string } {
  return (group !== null ? GROUP_PLACE.get(group) : undefined) ?? { cat: "other", dept: "other" };
}

/** The cheapest each-price a multi-buy gives, in pence, when it beats buying one at a time. */
function multiUnitPence(p: Promo, single: number, full: number): number | null {
  const qty = p.qty;
  if (!qty || qty < 2) return null;
  let unit: number | null = null;
  if (p.getFree && p.getFree > 0 && p.getFree < qty) unit = (single * (qty - p.getFree)) / qty;
  else if (p.savePct && p.savePct > 0) unit = Math.min(single, full * (1 - p.savePct / 100));
  else if (p.dealPrice && p.dealPrice > 0) unit = toPence(p.dealPrice) / qty;
  return unit !== null && unit < single - 0.0001 ? unit : null;
}

const PREMIUM = /taste the difference/i;

function isPremium(c: Pick<ProductCard, "name" | "brand">): boolean {
  return PREMIUM.test(c.name) || PREMIUM.test(c.brand ?? "");
}

/** Sainsbury's own range (same test as the Find filter in catalog.ts), without the premium Taste the Difference line. */
function isOwnBrand(c: Pick<ProductCard, "name" | "brand">): boolean {
  return (/^sainsbury/i.test(c.brand ?? "") || /^sainsbury's /i.test(c.name)) && !PREMIUM.test(c.name);
}

function storeOf(c: ProductCard): ItemStore {
  const s = c.storeStatus;
  return {
    status: s === "yes" || s === "likely" || s === "no" ? s : "unknown",
    reason: c.storeReason ?? "",
    inStock: c.storeStock === "in" ? true : c.storeStock === "out" ? false : null,
    checkedAt: c.storeStockAt,
  };
}

function n100Of(n: Nutrition | null): Item["n100"] {
  if (!n) return undefined;
  const out: NonNullable<Item["n100"]> = {};
  if (n.kcal != null) out.kcal = n.kcal;
  if (n.protein != null) out.protein = n.protein;
  if (n.fat != null) out.fat = n.fat;
  if (n.sat != null) out.sat = n.sat;
  if (n.carbs != null) out.carbs = n.carbs;
  if (n.sugars != null) out.sugar = n.sugars;
  if (n.fibre != null) out.fibre = n.fibre;
  if (n.salt != null) out.salt = n.salt;
  return Object.keys(out).length > 0 ? out : undefined;
}

// ── The slim item ────────────────────────────────────────────────────────────

/**
 * One product as the app sees it. Nectar is taken as read: `best` and `regular` use the price he pays (the cheapest of
 * shelf, offer and Nectar price, price cuts included), never the shelf price alone.
 */
export function toItem(c: ProductCard, extra: ItemExtra, now: Date = new Date()): Item {
  const live = livePromos(c.promos, now);
  const priced = { ...c, promos: live };
  const single = nowPence(priced, now);
  const full = Math.max(fullPence(priced), single);
  const cut = single < full - 0.0001;
  const view = priceView(priced, now);

  // The multi-buy that gives the cheapest each-price (any shape: N for £X, buy 3 get the cheapest free, save N%).
  let multi: { promo: Promo; unit: number } | null = null;
  for (const promo of live) {
    if (promo.kind !== "multibuy") continue;
    const unit = multiUnitPence(promo, single, full);
    if (unit !== null && (multi === null || unit < multi.unit)) multi = { promo, unit };
  }

  let best: ItemBest | undefined;
  if (multi && multi.promo.qty) {
    best = { kind: "multi", label: tidyMoney(offerLabel(multi.promo)), minQty: multi.promo.qty, unitPrice: pounds(multi.unit), discount: r3(1 - multi.unit / full) };
  } else if (cut) {
    best = { kind: "price", label: `${money(single)} ${view.nectar ? "Nectar Price" : "Offer Price"}`, minQty: 1, unitPrice: pounds(single), discount: r3(1 - single / full) };
  }

  const shown = shownPromos(live, now);
  const offers = [...new Set(shown.map((p) => tidyMoney(offerLabel(p))))];
  const ends = shown
    .map((p) => p.end)
    .filter((e) => e && !Number.isNaN(Date.parse(e)))
    .map((e) => e.slice(0, 10))
    .sort()[0];

  const breakdown = healthBreakdown(c);
  const part = (key: "protein" | "sat" | "processing"): number | null => {
    const s = breakdown.parts.find((p) => p.key === key)?.score;
    return s == null ? null : r1(s);
  };
  const vb = valueBreakdown(c);
  const nowPounds = single / 100;
  const packProtein = c.packGrams != null && c.protein != null ? c.packGrams * (c.protein / 100) : null;

  let compare: Item["compare"];
  if (c.valueBasis === "protein" && c.per100Protein != null) compare = { per: "100g protein", value: c.per100Protein, kind: "protein" };
  else if (c.unitPrice != null && c.unitPrice > 0 && (c.unitMeasure === "kg" || c.unitMeasure === "ltr") && c.price > 0) {
    compare = { per: c.unitMeasure === "ltr" ? "litre" : "kg", value: r2((c.unitPrice * single) / 100 / c.price), kind: "unit" };
  }

  const valueParts: Item["valueParts"] = {
    cheap: r1(vb.parts[0]?.score ?? 5),
    deal: r1(vb.parts[1]?.score ?? 0),
    discount: c.discount,
  };
  if (multi) valueParts.bestUnit = pounds(multi.unit);

  const health = c.health;
  const store = storeOf(c);
  const item: Item = {
    id: c.id,
    name: c.name,
    img: c.imageUrl ?? undefined,
    url: extra.slug ? SAINSBURYS_PRODUCT_URL + extra.slug : undefined,
    brand: c.brand ?? undefined,
    ...placeOfGroup(c.productGroup),
    group: c.productGroup ?? undefined,
    subtype: c.productGroup ?? undefined,
    protein: c.proteinMain ?? undefined,
    rating: c.reviewAvg ?? undefined,
    reviews: c.reviewCount ?? undefined,
    isNew: c.isNew,
    regular: pounds(full),
    regUnit: c.unitPrice != null && c.unitMeasure ? { price: c.unitPrice, unit: c.unitMeasure } : undefined,
    offers,
    onOffer: cut || offers.length > 0,
    offerShort: multi ? best?.label : (offers[0] ?? (cut ? best?.label : undefined)),
    ends,
    discount: c.discount,
    best,
    compare,
    packG: c.packGrams ?? undefined,
    packLabel: c.packText ?? undefined,
    packEst: c.packText != null && c.packEst ? true : undefined,
    packProtein: packProtein != null ? r1(packProtein) : undefined,
    proteinPerPound: packProtein != null && nowPounds > 0 ? r1(packProtein / nowPounds) : undefined,
    protPer100kcal: c.protein != null && c.kcal != null && c.kcal > 0 ? r1((c.protein / c.kcal) * 100) : undefined,
    n100: n100Of(extra.nutrition),
    proc: c.ingredientCount != null ? { count: c.ingredientCount, markers: c.upfMarkers } : undefined,
    seedOil: c.seedOil,
    folic: c.folicAcid,
    isBasic: c.isBasic,
    fitRaw: health,
    fit: health,
    health,
    fitParts: { protein: part("protein"), sat: part("sat"), processing: part("processing") },
    why: c.reasons,
    value: c.value,
    valueParts,
    score: r2(overallScore({ health, value: c.value, stars: null, vote: null })),
    highSat: c.sat != null && c.sat > 5 && !isWholeFood(c),
    frozen: c.storage === "frozen",
    storage: c.storage ?? undefined,
    nonFood: false,
    premium: isPremium(c),
    ownBrand: isOwnBrand(c),
    store,
    oos: store.inStock === false || store.status === "no",
    deal: extra.deal ?? undefined,
  };
  return item;
}

// ── The product page ─────────────────────────────────────────────────────────

/** Plain-English working behind the Fit parts, by part, for "Why Fit 8?". */
export function fitWhyOf(c: ProductCard): Record<string, string[]> {
  const b = healthBreakdown(c);
  const out: Record<string, string[]> = {};
  for (const p of b.parts) if (p.detail) out[p.key] = [p.detail];
  if (b.caps.length > 0) out.caps = b.caps;
  if (b.notes.length > 0) out.notes = b.notes;
  return out;
}

export function toItemDetail(
  c: ProductCard,
  extra: ItemExtra,
  more: { ingredients: string | null; history: ItemDetail["history"] },
  now: Date = new Date(),
): ItemDetail {
  return { ...toItem(c, extra, now), ingredients: more.ingredients, nutrition: extra.nutrition, fitWhy: fitWhyOf(c), history: more.history };
}
