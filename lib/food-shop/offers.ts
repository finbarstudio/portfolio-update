import { gbpShort, shortDate } from "./format";
import type { Offer } from "./score";

/** Wording for an offer on a card. Pure. */

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;

/** "3 for £6", "Save 25%", else "Offer" - for offers that aren't the product's headline one (that has its own offer_short). */
export function offerShortOf(o: Offer): string {
  const tiers = (o as unknown as { tiers?: unknown }).tiers;
  const tier = Array.isArray(tiers) ? tiers[0] : null;
  if (isRecord(tier) && typeof tier.n === "number" && typeof tier.price === "number" && tier.n > 1) return `${tier.n} for ${gbpShort(tier.price)}`;
  if ((o.minQty ?? 1) > 1 && o.unitPrice != null) return `${o.minQty} for ${gbpShort(+(o.unitPrice * (o.minQty ?? 1)).toFixed(2))}`;
  if (o.discount != null && o.discount >= 0.01) return `Save ${Math.round(o.discount * 100)}%`;
  return "Offer";
}

/** "each in 3 for £6" / "each in £5 meal deal": the price shown only applies when you buy the set. Null for a plain price. */
export function eachText(o: Offer, short: string): string | null {
  const bundle = isRecord(o.bundle) && typeof o.bundle.price === "number" ? o.bundle.price : null;
  if (bundle != null) return `each in ${gbpShort(bundle)} meal deal`;
  if ((o.minQty ?? 1) > 1) return `each in ${/^any /i.test(o.label) ? "any " : ""}${short}`;
  return null;
}

/** "Ends 17 Nov", from the offer's own end date. */
export function endsOf(o: Offer, fallback: string | null): string | null {
  return shortDate(o.until) ?? fallback;
}

/** The dates of an offer for the product page: "28 Oct to 17 Nov". */
export function offerDates(o: Offer): string | null {
  const from = shortDate(o.from);
  const until = shortDate(o.until);
  if (from && until) return `${from} to ${until}`;
  if (until) return `until ${until}`;
  return null;
}
