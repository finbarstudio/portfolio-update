/**
 * Shared types for Dad's shop. Plain data only: safe to import from both the
 * server (queries, API) and the browser (components), and from `bun test`.
 */

/**
 * One running offer on a product. Everything after `end` is optional: older
 * rows in the database only have the first six fields, so readers must cope
 * (see `readPromo` in pricing.ts, which fills the gaps from the wording).
 */
export interface Promo {
  uid: string;
  text: string;
  kind: "price_cut" | "multibuy" | "mealdeal" | "other";
  nectar: boolean;
  start: string;
  end: string;
  group?: string;
  type?: string;
  link?: string;
  originalPrice?: number;
  /** price_cut: price per item. multibuy "N for £X": the total for qty N. mealdeal: the bundle price. */
  dealPrice?: number;
  qty?: number;
  /** "Buy 3 get cheapest 1 free": qty 3, getFree 1. */
  getFree?: number;
  savePct?: number;
  /** Different products sharing this uid count together. */
  mixMatch?: boolean;
}

export interface Nutrition {
  kcal?: number;
  fat?: number;
  sat?: number;
  carbs?: number;
  sugars?: number;
  fibre?: number;
  protein?: number;
  salt?: number;
  basis: "100g" | "100ml";
  cooked?: boolean;
}

export type SeedOil = "none" | "likely" | "yes" | "unknown";

/**
 * What the app needs to price a product on the shelf. Dad always has a Nectar
 * card, so every Nectar price and Nectar offer counts as the price he pays.
 */
export interface PriceInfo {
  price: number;
  nectarPrice: number | null;
  promos: Promo[];
  /** Shelf price before an offer (pipeline: promo original price). */
  wasPrice?: number | null;
  /** Cheapest single-unit price he can pay (pipeline). */
  offerPrice?: number | null;
}

/** A dinner meal deal this product can be part of (Dine In etc). */
export interface DealLink {
  id: string;
  title: string;
  /** The bundle price. */
  price: number;
  /** Which part of the deal this product fills. */
  listId: number;
  parts: { listId: number; label: string; qty: number }[];
}

export interface Settings {
  budget_gbp: number;
  people: number;
  protein_g_per_day: number;
  max_per_category: number;
  include_unrated_share: number;
}

export const DEFAULT_SETTINGS: Settings = {
  budget_gbp: 60,
  people: 1,
  protein_g_per_day: 100,
  max_per_category: 2,
  include_unrated_share: 0.2,
};

export interface BasketItem {
  productId: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
  reason: string;
  dealGroup?: string;
  /** Which part of the week it feeds (dinner, breakfast, ...). Older baskets don't have it. */
  slot?: "dinner" | "breakfast" | "lunch" | "veg" | "staples";
}

/** On the shelf at Chislehurst: yes / likely (the feed lists it), unlikely, no, or unknown (the feed does not cover it). */
export type StoreStatus = "yes" | "likely" | "unlikely" | "unknown" | "no";
export const STORE_STATUSES: readonly StoreStatus[] = ["yes", "likely", "unlikely", "unknown", "no"];

/** A product as shown on a card in Find, or at the top of a sheet. */
export interface ProductCard extends PriceInfo {
  id: string;
  name: string;
  brand: string | null;
  imageUrl: string | null;
  zone: string | null;
  department: string | null;
  category: string | null;
  unitPrice: number | null;
  unitMeasure: string | null;
  packGrams: number | null;
  storage: string | null;
  seedOil: SeedOil;
  health: number | null;
  stars: number | null;
  /** Health blended with his own taste rating (see fit.ts). */
  fit: number | null;
  protein: number | null;
  sat: number | null;
  ingredientCount: number | null;
  /** How many ultra-processing markers the ingredients have, null when not read yet. */
  upfCount: number | null;
  reviewAvg: number | null;
  reviewCount: number | null;
  isNew: boolean;
  animal: string | null;
  /** Marked by him as not on the shelf here (his own report). Also folded into storeStatus. */
  notAtStore: boolean;
  /** Is it on the shelf at Chislehurst? His latest report wins, then the daily range feed (see StoreStatus). */
  storeStatus: StoreStatus;
  /** One plain sentence on why, shown when he taps the store chip. */
  storeReason: string | null;
  /** The comparison group (what you would buy instead of it, prep state built in), when classified. */
  productGroup: string | null;
  /** The main protein: beef, chicken, salmon, egg, veggie... when classified. */
  proteinMain: string | null;
  onList: boolean;
  isAvailable: boolean;
  /** 0-10: protein or £/kg per £ against similar products, plus the size of any deal. Null when it can't be judged. */
  value: number | null;
  valueBasis: "protein" | "kg" | null;
  /** 0-1: how much cheaper than the other products in its category (1 = cheapest). */
  valuePct: number | null;
  /** 0-1: the best saving on offer, a multi-buy counted per item. */
  discount: number;
  /** £ per 100g of protein at the price he pays, null when unknown. */
  per100Protein: number | null;
  /** What he paid each last time, and when, from his past shops. */
  paidBefore: { each: number; at: string; offer: string | null } | null;
  /** A plain ingredient: meat, fish, eggs, veg, rice, tofu... (the pipeline's call). */
  isBasic: boolean;
  /** His Yes (1) or No (-1) on a basket pick, if he gave one. */
  vote: 1 | -1 | null;
  /** Where the ingredients and nutrition on this card came from, when not Sainsbury's own label. */
  ingredientsSource: string | null;
  nutritionSource: string | null;
  /** Energy per 100g, for the Fit breakdown. */
  kcal: number | null;
  /** The ultra-processing markers found in the ingredients, and the seed oils found. */
  upfMarkers: string[];
  seedOilsFound: string[];
  /** The pipeline's plain-English reasons behind the health score. */
  reasons: string[];
  /** His taste for this product worked out from what he has rated, voted and bought (0-10), when he has not rated it himself. */
  learned?: { taste: number; conf: number; from: string[] } | null;
}

export interface ProductDetail extends ProductCard {
  slug: string;
  nutrition: Nutrition | null;
  ingredients: string | null;
  listedAt: string;
}

/** One row of the shopping list. Free-text rows have no product behind them. */
export interface ListItem {
  id: number;
  productId: string | null;
  name: string;
  brand: string | null;
  imageUrl: string | null;
  zone: string | null;
  qty: number;
  ticked: boolean;
  price: number | null;
  nectarPrice: number | null;
  promos: Promo[];
  seedOil: SeedOil | null;
  wasPrice?: number | null;
  offerPrice?: number | null;
  /** Grams of protein in the whole pack. */
  packProtein?: number | null;
  value?: number | null;
  /** Dinner meal deals this product is part of. */
  deals?: DealLink[];
}

export interface BasketLine extends BasketItem {
  name: string;
  brand: string | null;
  imageUrl: string | null;
  zone: string | null;
}

/** A generated (or last saved) basket, ready to show. */
export interface BasketView {
  id: number | null;
  createdAt: string | null;
  settings: Settings;
  items: BasketLine[];
  total: number;
  proteinG: number;
  warnings: string[];
  /** True when this is an older basket shown because a new one could not be made. */
  fromHistory: boolean;
  /** His Yes / No on this basket's picks, by product id. */
  votes: Record<string, 1 | -1>;
  /** What his votes have taught so far, in plain words. */
  taught: string[];
  /** Calendar slots the week is made of, with how many servings of each the basket covers. */
  meals: MealCoverage[];
}

/** One slot of the week (dinners, breakfasts...): how much of it the basket covers. */
export interface MealCoverage {
  slot: "dinner" | "breakfast" | "lunch" | "veg" | "staples";
  label: string;
  have: number;
  need: number;
}

export interface Freshness {
  lastListed: string | null;
  products: number;
  withDetails: number;
}

export const SORTS = ["best", "rec", "value", "saving", "score", "price", "few", "ppp"] as const;
export type Sort = (typeof SORTS)[number];

export const SORT_INFO: Record<Sort, { label: string; sub: string }> = {
  best: { label: "Best overall", sub: "Health 50% · value 35% · your taste 15%" },
  rec: { label: "Picked for you", sub: "Your taste, value and the saving" },
  value: { label: "Best deal", sub: "Value score first, then what suits you" },
  saving: { label: "Biggest saving", sub: "Most off the usual price" },
  score: { label: "Value + health", sub: "Good value and good for you" },
  price: { label: "Lowest price", sub: "Cheapest first" },
  few: { label: "Fewest ingredients", sub: "Shortest ingredients list first" },
  ppp: { label: "Protein per £", sub: "Most protein for your money" },
};

/** Find's five views. */
export const VIEWS = ["all", "foryou", "offers", "multibuys", "deals"] as const;
export type View = (typeof VIEWS)[number];

export const VIEW_LABEL: Record<View, string> = {
  all: "All",
  foryou: "✦ For you",
  offers: "Offers",
  multibuys: "Multi-buys",
  deals: "Meal deals",
};

/** The same, short enough for one slim row on a phone. */
export const VIEW_SHORT: Record<View, string> = {
  all: "All",
  foryou: "✦ For you",
  offers: "Offers",
  multibuys: "Multi",
  deals: "Deals",
};

/** Cross-cutting lists, Tesco style: they cut across the shop's own sections. */
export const COLLECTIONS = [
  { key: "meals", label: "Ready meals", desc: "Heat and eat: chilled and frozen meals, pizza, pies, soup" },
  { key: "protein", label: "High protein", desc: "15g or more protein in every 100g" },
  { key: "freezer", label: "Freezer backups", desc: "Frozen food to keep in" },
  { key: "breakfast", label: "Breakfast", desc: "Cereal, porridge, eggs, bacon, yoghurt" },
  { key: "ttd", label: "Taste the Difference", desc: "Sainsbury's premium own range" },
  { key: "fancy", label: "Fancy night in", desc: "Taste the Difference and dinner deals for a treat" },
  { key: "ordered", label: "Ordered before", desc: "Everything from your past shops, with what you paid then" },
] as const;
export type CollectionKey = (typeof COLLECTIONS)[number]["key"];

export const ANIMALS = ["beef", "pork", "chicken", "lamb", "turkey", "duck", "fish", "seafood", "game"] as const;

export interface FindFilters {
  q: string;
  view: View;
  coll: string;
  zone: string;
  dept: string;
  cat: string;
  animal: string;
  sort: Sort;
  page: number;
  /** Only show */
  noSeedOil: boolean;
  good: boolean;
  frozen: boolean;
  rated: boolean;
  onList: boolean;
  fewIngredients: boolean;
  /** Hide */
  hideSat: boolean;
  hideOwn: boolean;
  /** Single-ingredient foods: anything with one ingredient, or a plain food like chicken breast, rice, eggs (is_basic). */
  hideSingle: boolean;
  /** Only Sainsbury's Taste the Difference range. */
  tasteDiff: boolean;
  /** Only products on offer (a price cut or a multi-buy). */
  onOffer: boolean;
  /** Hides what is known not to be at Chislehurst. Unknown stays. */
  atStore: boolean;
  /** Only what is confirmed at Chislehurst (yes or likely). */
  atStoreSure: boolean;
  /** One comparison group ("mince", "wings"). */
  group: string;
  /** One main protein (beef, chicken...). On a product page: "" = this product's own, "any" = all of them. */
  protein: string;
}

/** The "Similar products" section of a product page: the compared products, this one pinned first. */
export interface SimilarSection {
  /** This product first (always), then the rest in the chosen sort. */
  items: ProductCard[];
  /** Every product of the same type, this one included. */
  total: number;
  /** Left out by the filters. */
  hidden: number;
  /** Passed the filters but cut off to keep the page light. */
  capped: number;
  /** Where this one sits among all of them on Best overall, 1 is best. */
  rank: number | null;
  /** Each product's place on Best overall among all of them (for the rank on a card). */
  ranks: Record<string, number>;
  /** "chicken breast & fillet", "mince · beef"; what "same type" meant here. */
  scopeLabel: string;
  /** Set when similar means the product's comparison group (the heading names it). */
  group: string | null;
  /** Proteins in that group, to narrow by. Empty when the group has only one (or none). */
  proteins: { protein: string; n: number }[];
  /** The protein it is narrowed to, null for all of them. */
  protein: string | null;
}

export const FILTER_DEFAULTS = { noSeedOil: true, hideSat: true } as const;

/** What the facets (counts for the category menu and the tabs) say about the products. */
export interface Facets {
  total: number;
  zones: { zone: string; n: number }[];
  depts: { zone: string; dept: string; n: number }[];
  cats: { zone: string; dept: string; cat: string; n: number }[];
  colls: Record<string, number>;
  /** Departments inside each collection (a collection spans several). */
  collDepts: Record<string, { zone: string; dept: string; n: number }[]>;
  animals: { animal: string; n: number }[];
  /** Comparison groups inside the chosen category, with counts. */
  groups: { group: string; n: number }[];
  /** Main proteins inside the chosen category and group, with counts. */
  proteins: { protein: string; n: number }[];
}

export const PAGE_SIZE = 30;

/** Store sections (Sainsbury's own section names) in the order you walk the shop. Unknown ones sort after. */
export const ZONE_ORDER = [
  "Fruit and vegetables",
  "Bakery",
  "Meat & fish",
  "Chilled food",
  "Dietary & world foods",
  "Food cupboard",
  "Snacks, sweets and treats",
  "Hot drinks, soft drinks & water",
  "Frozen",
  "Beer, wine and spirits",
] as const;

/** Where Find's section list starts if the database can't list its sections. */
export const FOOD_ZONES = [
  "Fruit and vegetables",
  "Bakery",
  "Meat & fish",
  "Chilled food",
  "Food cupboard",
  "Frozen",
] as const;

export const BASE_PATH = "/dadshop";
/** The shopping list lives here now; the home page is Find, on For you. */
export const LIST_PATH = `${BASE_PATH}/list`;

// ── Meal deals (dinner deals: Dine In, Discovery, Takeaway) ─────────────────

export interface DealPart {
  listId: number;
  label: string;
  qty: number;
}

export interface Deal {
  id: string;
  slug: string;
  title: string;
  strap: string;
  price: number;
  nectar: boolean;
  endsOn: string | null;
  parts: DealPart[];
  products: number;
  /** What the same things cost separately (shelf prices of the cheapest of each part). */
  typical: number | null;
}

export interface DealPage {
  deal: Deal;
  /** Every product in the deal and the part it fills. */
  items: (ProductCard & { listId: number })[];
}

/** One offer shared by several products (the deal manager). */
export interface OfferPage {
  uid: string;
  text: string;
  kind: Promo["kind"];
  qty: number | null;
  endsOn: string | null;
  items: ProductCard[];
}

export interface Shelf {
  key: string;
  title: string;
  sub: string;
  items: (ProductCard & { why: string })[];
  /** The dinner deals shelf lists deals instead of products. */
  deals?: Deal[];
}

/** For you: the shelves, and how much he has told us so far. */
export interface ForYou {
  shelves: Shelf[];
  /** Products he has rated. Zero means the shelves are going by his rules alone. */
  rated: number;
}

/** One finished shop. */
export interface ShopRow {
  id: number;
  finishedAt: string;
  total: number;
  fullPrice: number;
  proteinG: number;
  items: { productId: string | null; name: string; qty: number; paidEach: number; offer: string | null }[];
}
