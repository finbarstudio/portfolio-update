import { activePromos } from "./pricing";
import { ZONE_ORDER, type PriceInfo } from "./types";

export interface ZoneGroup<T> {
  zone: string;
  items: T[];
}

export const OTHER_ZONE = "Other";

/** Groups by store section, in the order you walk the shop. */
export function groupByZone<T extends { zone: string | null }>(items: T[]): ZoneGroup<T>[] {
  const map = new Map<string, T[]>();
  for (const i of items) {
    const zone = i.zone ?? OTHER_ZONE;
    map.set(zone, [...(map.get(zone) ?? []), i]);
  }
  const rank = (z: string): number => {
    if (z === OTHER_ZONE) return 1000;
    const at = (ZONE_ORDER as readonly string[]).indexOf(z);
    return at === -1 ? 500 : at;
  };
  return [...map.entries()]
    .sort((a, b) => rank(a[0]) - rank(b[0]) || (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
    .map(([zone, list]) => ({ zone, items: list }));
}

/** Plain-English formatting helpers. Pure, safe in browser and server. */

export function gbp(n: number): string {
  return `£${n.toFixed(2)}`;
}

/** The offer to show next to a price: a running promo's own words, else a Nectar price. */
export function offerText(p: PriceInfo, now: Date): string | null {
  const promo = activePromos(p.promos, now).find((x) => x.text.trim().length > 0);
  if (promo) return promo.text.trim();
  if (p.nectarPrice != null && p.nectarPrice > 0 && p.nectarPrice < p.price) return `${gbp(p.nectarPrice)} with Nectar`;
  return null;
}

/** "2 days ago", "today". */
export function ago(iso: string | null, now: Date): string {
  if (!iso) return "never";
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "a while ago";
  const days = Math.floor((now.getTime() - t) / (24 * 3600 * 1000));
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 14) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 9) return `${weeks} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

export function daysOld(iso: string | null, now: Date): number | null {
  if (!iso) return null;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return null;
  return Math.max(0, Math.floor((now.getTime() - t) / (24 * 3600 * 1000)));
}

export interface Segment {
  text: string;
  seedOil: boolean;
}

// Display only: the stored `seed_oil` flag is the pipeline's verdict.
const SEED_OIL_TEXT =
  /\b(?:sunflower|rapeseed|canola|cottonseed|grapeseed|safflower|soya|soybean|soy|corn|maize|rice bran)(?: seed)?\s+oil\b|\bvegetable\s+(?:oil|fat)s?\b/gi;

/** Splits an ingredients list so seed oils can be highlighted. */
export function ingredientSegments(text: string): Segment[] {
  const out: Segment[] = [];
  let last = 0;
  for (const m of text.matchAll(SEED_OIL_TEXT)) {
    const at = m.index ?? 0;
    if (at > last) out.push({ text: text.slice(last, at), seedOil: false });
    out.push({ text: m[0], seedOil: true });
    last = at + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last), seedOil: false });
  return out;
}

/** "£7.63 per kg" */
export function unitPriceLabel(unitPrice: number | null, measure: string | null): string | null {
  if (unitPrice == null || !measure) return null;
  const m = measure === "ltr" ? "litre" : measure === "ea" ? "each" : measure;
  return m === "each" ? `${gbp(unitPrice)} each` : `${gbp(unitPrice)} per ${m}`;
}
