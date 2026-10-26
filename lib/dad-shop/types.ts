/**
 * Shared types for Dad's shop. Plain data only: safe to import from both the
 * server (queries, API) and the browser (components), and from `bun test`.
 */

export interface Promo {
  uid: string;
  text: string;
  kind: "price_cut" | "multibuy" | "other";
  nectar: boolean;
  start: string;
  end: string;
  qty?: number;
  dealPrice?: number;
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

/** What the app needs to price a product on the shelf. */
export interface PriceInfo {
  price: number;
  nectarPrice: number | null;
  promos: Promo[];
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
}

/** A product as shown on a card in Find, or at the top of a sheet. */
export interface ProductCard extends PriceInfo {
  id: string;
  name: string;
  brand: string | null;
  imageUrl: string | null;
  zone: string | null;
  category: string | null;
  unitPrice: number | null;
  unitMeasure: string | null;
  seedOil: SeedOil;
  health: number | null;
  stars: number | null;
  /** Health blended with his own taste rating (see fit.ts). */
  fit: number | null;
  protein: number | null;
  sat: number | null;
  ingredientCount: number | null;
  notAtStore: boolean;
  onList: boolean;
  isAvailable: boolean;
}

export interface ProductDetail extends ProductCard {
  slug: string;
  department: string | null;
  storage: string | null;
  packGrams: number | null;
  nutrition: Nutrition | null;
  ingredients: string | null;
  seedOilsFound: string[];
  upfMarkers: string[];
  reasons: string[];
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
}

export interface Freshness {
  lastListed: string | null;
  products: number;
  withDetails: number;
}

export const SORTS = ["best", "protein", "price"] as const;
export type Sort = (typeof SORTS)[number];

export interface FindFilters {
  q: string;
  noSeedOil: boolean;
  highProtein: boolean;
  lowSat: boolean;
  fewIngredients: boolean;
  onOffer: boolean;
  zone: string;
  sort: Sort;
  page: number;
}

export const PAGE_SIZE = 30;

/** Store sections in the order you walk Sainsbury's. Unknown ones sort after. */
export const ZONE_ORDER = [
  "Fruit & vegetables",
  "Bakery",
  "Meat & fish",
  "Dairy eggs & chilled",
  "Frozen",
  "Food cupboard",
  "Drinks",
] as const;

/** Where Find's section dropdown starts: the food sections we seed. */
export const FOOD_ZONES = [
  "Meat & fish",
  "Dairy eggs & chilled",
  "Fruit & vegetables",
  "Bakery",
  "Frozen",
  "Food cupboard",
] as const;

export const BASE_PATH = "/dadshop";
