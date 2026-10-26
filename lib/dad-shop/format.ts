import { livePromos, nowPence, offerLabel, tidyMoney } from "./pricing";
import { ZONE_ORDER, type PriceInfo, type ProductCard, type Promo } from "./types";

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

/** The words for one running offer, Nectar taken as read. Null when there is nothing to say. */
export function offerText(p: PriceInfo, now: Date): string | null {
  const promo = shownPromos(p.promos, now).find((x) => x.text.trim().length > 0);
  if (promo) return tidyMoney(offerLabel(promo));
  const n = nowPence(p, now);
  if (n < Math.round(p.price * 100)) return `${gbp(n / 100)} with Nectar`;
  return null;
}

/** Running offers worth a tag. Dinner meal deals have their own pages; plain "Buy 1 for X" shows as the price itself. */
export function shownPromos(promos: Promo[], now: Date): Promo[] {
  return livePromos(promos, now).filter((p) => p.kind !== "mealdeal" && !(p.kind === "price_cut" && /^buy\s+1\s+for\b/i.test(p.text ?? "")));
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "3 Nov" from a date, as written (no time zone shifting). */
export function shortDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const m = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  const month = MONTHS[Number(m[2]) - 1];
  return month ? `${Number(m[3])} ${month}` : null;
}

/** "ends 3 Nov": the soonest end among the offers worth a tag. */
export function endsLabel(promos: Promo[], now: Date): string | null {
  const ends = shownPromos(promos, now)
    .map((p) => p.end)
    .filter((e) => e && !Number.isNaN(Date.parse(e)))
    .sort();
  const d = shortDate(ends[0]);
  return d ? `ends ${d}` : null;
}

/** The multi-buy a product is in, for the "each in 3 for £6" link. */
export function groupPromo(p: PriceInfo, now: Date): Promo | null {
  return livePromos(p.promos, now).find((x) => x.kind === "multibuy" && x.qty && x.qty >= 2) ?? null;
}

/** How a multi-buy reads in the "each in …" link under a price. */
export function dealPhrase(promo: Promo): string {
  const any = /\bany\b/i.test(promo.text ?? "");
  const n = promo.qty ?? 2;
  if (promo.getFree && promo.getFree > 0) return `Buy ${n}, cheapest ${promo.getFree === 1 ? "one" : promo.getFree} free`;
  if (promo.savePct && promo.savePct > 0) return `${Math.round(promo.savePct)}% off when you buy ${n}+`;
  if (promo.dealPrice) return `each in ${any ? "any " : ""}${n} for ${tidyMoney(`£${promo.dealPrice.toFixed(2)}`)}`;
  return tidyMoney(offerLabel(promo));
}

/** The name without its trailing pack size, which is shown as its own tag. */
export function shortName(name: string): string {
  return name.replace(/\s*,?\s*\b(\d+\s?x\s?)?\d+(\.\d+)?\s?(kg|g|ml|l|cl|ltr|litres?)\.?\s*$/i, "").trim();
}

/** "500g", "1.2kg", "750ml", "1.5 litres". */
export function packLabel(grams: number | null, measure: string | null): string | null {
  if (grams == null || grams <= 0) return null;
  if (measure === "ltr") return grams >= 1000 ? `${+(grams / 1000).toFixed(2)} litres` : `${Math.round(grams)}ml`;
  return grams >= 1000 ? `${+(grams / 1000).toFixed(2)}kg` : `${Math.round(grams)}g`;
}

export function pctOff(card: Pick<ProductCard, "discount">): number | null {
  const p = Math.round(card.discount * 100);
  return p >= 5 ? p : null;
}

/** One plain sentence on why a Value score is what it is. */
export function valueWhy(c: Pick<ProductCard, "value" | "valueBasis" | "valuePct" | "discount">): string | null {
  if (c.value == null) return null;
  const parts: string[] = [];
  if (c.valuePct != null && c.valueBasis) {
    const cheaperThan = Math.round(c.valuePct * 10);
    const what = c.valueBasis === "protein" ? "Protein for your money" : "The price per kg";
    parts.push(
      cheaperThan >= 5
        ? `${what} beats ${cheaperThan} in 10 similar products`
        : `${what} is poorer than ${10 - cheaperThan} in 10 similar products`,
    );
  }
  const off = Math.round(c.discount * 100);
  if (off >= 5) parts.push(`${off}% off adds a little`);
  if (parts.length === 0) return "Not enough similar products to compare, so this is a middle score.";
  return parts.join(". ") + ".";
}

export type Tone = "g" | "a" | "r";

/** The processing verdict from the ingredients, or null when the label has not been read. */
export function processing(c: Pick<ProductCard, "upfCount" | "ingredientCount">): { label: string; tone: Tone } | null {
  if (c.upfCount == null) return null;
  if (c.ingredientCount === 1) return { label: "Whole food", tone: "g" };
  if (c.upfCount === 0) {
    return { label: c.ingredientCount ? `Simple · ${c.ingredientCount} ingredients` : "No processing markers", tone: "g" };
  }
  return { label: `Ultra-processed · ${c.upfCount} marker${c.upfCount === 1 ? "" : "s"}`, tone: c.upfCount >= 3 ? "r" : "a" };
}

/** Saturated fat per 100g, UK traffic-light bands. */
export function satTone(sat: number | null): Tone | null {
  if (sat == null) return null;
  return sat <= 1.5 ? "g" : sat > 5 ? "r" : "a";
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
