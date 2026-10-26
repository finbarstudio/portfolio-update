import type { PriceInfo, Promo } from "./types";

/**
 * Shelf pricing, shared by the basket generator (server) and the list total
 * (browser). Pure: no clock, no DB. Money is whole pence inside, pounds at the
 * edges.
 */

export function toPence(pounds: number): number {
  return Math.round(pounds * 100);
}

export function toPounds(pence: number): number {
  return Math.round(pence) / 100;
}

/** The price of one unit: the Nectar price when there is one, else shelf. */
export function singlePence(p: Pick<PriceInfo, "price" | "nectarPrice">): number {
  const shelf = toPence(p.price);
  if (p.nectarPrice != null && p.nectarPrice > 0) return Math.min(shelf, toPence(p.nectarPrice));
  return shelf;
}

function dayValue(s: string): number {
  const t = Date.parse(s);
  return Number.isNaN(t) ? Number.NaN : t;
}

/** Promos that are running at `now`. A promo with unreadable dates counts as running. */
export function activePromos(promos: Promo[], now: Date): Promo[] {
  const t = now.getTime();
  return promos.filter((p) => {
    const start = dayValue(p.start);
    const end = dayValue(p.end);
    // `end` is a date: it runs to the end of that day.
    if (!Number.isNaN(start) && t < start) return false;
    if (!Number.isNaN(end) && t > end + 24 * 3600 * 1000 - 1) return false;
    return true;
  });
}

/** The multi-buy that actually saves money per unit, if any. */
export function bestMultibuy(p: PriceInfo, now: Date): Promo | null {
  const single = singlePence(p);
  let best: Promo | null = null;
  let bestUnit = single;
  for (const promo of activePromos(p.promos, now)) {
    if (promo.kind !== "multibuy") continue;
    const qty = promo.qty;
    const deal = promo.dealPrice;
    if (!qty || qty < 2 || !deal || deal <= 0) continue;
    const unit = toPence(deal) / qty;
    if (unit < bestUnit - 0.0001) {
      best = promo;
      bestUnit = unit;
    }
  }
  return best;
}

export interface Line {
  pence: number;
  /** Set when at least one full multi-buy applies to this quantity. */
  dealGroup?: string;
}

/**
 * Price of `qty` units. A multi-buy only applies to complete groups: with a
 * "2 for £4" offer, 1 unit costs the single price, 2 cost £4, 3 cost £4 plus
 * one single.
 */
export function linePrice(p: PriceInfo, qty: number, now: Date): Line {
  const single = singlePence(p);
  const deal = bestMultibuy(p, now);
  if (!deal || !deal.qty || !deal.dealPrice) return { pence: single * qty };
  const groups = Math.floor(qty / deal.qty);
  const rest = qty - groups * deal.qty;
  const pence = groups * toPence(deal.dealPrice) + rest * single;
  return groups > 0 ? { pence, dealGroup: deal.uid } : { pence };
}

/** "2 for £4 with Nectar" */
export function dealLabel(promo: Promo): string {
  const price = promo.dealPrice ?? 0;
  const money = Number.isInteger(price) ? `£${price}` : `£${price.toFixed(2)}`;
  return `${promo.qty} for ${money}${promo.nectar ? " with Nectar" : ""}`;
}
