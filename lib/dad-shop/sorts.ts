import { overallScore } from "./overall";
import type { ProductCard, Sort } from "./types";

/**
 * The same sorts the database uses (catalog.ts `sortScore`), for pages that
 * already hold every product and just re-order them: deal pages and shelves.
 * "best" is Best overall (overall.ts): health, value and his taste, weighted.
 */
export type SortKey = Sort;

export function sortScoreOf(c: ProductCard, sort: SortKey): number {
  const fit = c.fit ?? 5;
  const value = c.value ?? 5;
  switch (sort) {
    case "rec":
      return fit + 0.5 * value + 2.5 * Math.min(c.discount, 0.6) + (c.stars != null ? (c.stars - 3) * 0.8 : 0) + ((c.protein ?? 0) >= 15 ? 0.5 : 0);
    case "value":
      return (c.value ?? 0) * 100 + fit * 8 + c.discount * 10;
    case "saving":
      return c.discount * 1000 + (c.value ?? 0);
    case "score":
      return ((c.value ?? 0) + (c.health ?? 0)) * 100 + c.discount;
    case "price":
      return -priceNow(c) * 100;
    case "few":
      return -(c.ingredientCount ?? 999) * 100 + (c.value ?? 0);
    case "ppp": {
      const protein = c.packGrams != null && c.protein != null ? (c.packGrams * c.protein) / 100 : null;
      const now = priceNow(c);
      return protein != null && now > 0 ? protein / now : -1;
    }
    case "best":
      return overallScore(c) * 100 - (c.upfCount ?? 0);
  }
}

/** What he pays for one: the cheapest of shelf, offer price and Nectar price. */
function priceNow(c: Pick<ProductCard, "price" | "offerPrice" | "nectarPrice">): number {
  let n = c.price;
  if (c.offerPrice != null && c.offerPrice > 0) n = Math.min(n, c.offerPrice);
  if (c.nectarPrice != null && c.nectarPrice > 0) n = Math.min(n, c.nectarPrice);
  return n;
}

export function sortCards<T extends ProductCard>(items: T[], sort: SortKey): T[] {
  return items
    .map((c, i) => ({ c, i, score: sortScoreOf(c, sort) }))
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .map((x) => x.c);
}

/**
 * A clearly better product from the same deal (or the same part of one): fits
 * him at least 1.5 better, and is not worse on value by more than 1. Skips
 * anything already on his list. Returns the best such one.
 */
export function betterSwap<T extends ProductCard>(mine: T, pool: T[], onList: Set<string>): T | null {
  if (mine.fit == null) return null;
  let best: T | null = null;
  for (const alt of pool) {
    if (alt.id === mine.id || onList.has(alt.id) || alt.notAtStore || alt.fit == null) continue;
    if (alt.fit < mine.fit + 1.5) continue;
    if ((alt.value ?? 0) < (mine.value ?? 0) - 1) continue;
    if (!best || (alt.fit ?? 0) > (best.fit ?? 0)) best = alt;
  }
  return best;
}
