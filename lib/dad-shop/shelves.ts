import { applyTaste, likesKind, type TasteProfile } from "./taste";
import type { Deal, ForYou, ProductCard, Shelf } from "./types";

/**
 * For you: shelves of inspiration, each product on the FIRST shelf it fits,
 * each with a short "why". PURE: the database work happens in catalog.ts.
 *
 *   1  Your favourites on offer      rated 4-5 stars, or said Yes, now on offer
 *   2  Top picks for you             healthy, no seed oils, good value, suits his taste
 *   3  New in what you like          new at Sainsbury's, in food he likes
 *   4  You might like these          not tried, but close to things he rated well
 *   5  Big deals on your kinds of food   25% off or more in food he likes
 *   6  This week's dinner deals      when every part has something that fits his rules
 *   7  Ordered before                from his past shops
 *
 * Until he has rated anything, "likes" falls back to his rules (health, no seed
 * oils), so the shelves are never empty on day one.
 */

/** Cards per shelf: divides by 2 (phone) and 3 (desktop). */
export const SHELF_SIZE = 18;

export function hasOffer(c: ProductCard): boolean {
  return c.discount >= 0.05;
}

/** Mixed-in score for ordering inside a shelf. Higher is better. */
export function recScore(c: ProductCard): number {
  const taste = c.learned && c.stars == null && c.vote == null ? (c.learned.taste - 6) * 0.8 * c.learned.conf : 0;
  return (
    (c.fit ?? 5) +
    0.5 * (c.value ?? 5) +
    2.5 * Math.min(c.discount, 0.6) +
    (c.stars != null ? (c.stars - 3) * 0.8 : 0) +
    (c.vote === 1 ? 0.8 : 0) +
    taste +
    ((c.protein ?? 0) >= 15 ? 0.5 : (c.protein ?? 0) >= 10 ? 0.25 : 0)
  );
}

/** No-go for him: not at his store, already on his list, rated 1-2 stars, said no, or learned to dislike. */
export function notForMe(c: ProductCard): boolean {
  if (c.notAtStore || c.onList) return true;
  if (c.stars != null && c.stars <= 2) return true;
  if (c.vote === -1) return true;
  return c.learned != null && c.stars == null && c.learned.taste <= 3.5 && c.learned.conf >= 0.4;
}

/**
 * The short reason a product is on a shelf. It leaves out what the card already
 * shows (the % off, no seed oils, the protein), so it only says what is new: his
 * taste, that it is new in, what he paid last time. The full working is in the card's breakdown.
 */
export function whyFor(c: ProductCard, key: string): string {
  const bits: string[] = [];
  if (key === "ordered" && c.paidBefore) bits.push(`you paid £${c.paidBefore.each.toFixed(2)} last time`);
  if (c.stars != null && c.stars >= 4) bits.push(`you gave it ${c.stars} stars`);
  else if (c.vote === 1) bits.push("you said yes to it");
  else if (c.learned && c.learned.taste >= 7 && c.learned.from[0]) bits.push(`like ${c.learned.from[0]}`);
  if (c.isNew) bits.push("new in");
  if (bits.length === 0) {
    if (key === "top") bits.push("fits all your rules");
    else if (key === "deals") bits.push("a big saving on food you like");
    else if (key === "fav") bits.push("one of your favourites");
  }
  return bits.slice(0, 2).join(" · ");
}

interface Rule {
  key: string;
  title: string;
  sub: string;
  fits: (c: ProductCard, likes: boolean) => boolean;
}

const RULES: Rule[] = [
  {
    key: "fav",
    title: "Your favourites on offer",
    sub: "Rated 4 or 5 stars, or a yes, and on offer now",
    fits: (c) => (((c.stars ?? 0) >= 4 || c.vote === 1) && hasOffer(c)),
  },
  {
    key: "top",
    title: "Top picks for you",
    sub: "Healthy, no seed oils, good value, your taste",
    fits: (c) => c.seedOil === "none" && (c.fit ?? 0) >= 7 && (c.value ?? 5) >= 5,
  },
  {
    key: "new",
    title: "New in what you like",
    sub: "New at Sainsbury's, in food you go for",
    fits: (c, likes) => c.isNew && likes && (c.value ?? 5) >= 4,
  },
  {
    key: "try",
    title: "You might like these",
    sub: "Not tried yet, but close to things you rated well",
    fits: (c) => c.stars == null && c.vote == null && c.learned != null && c.learned.taste >= 7 && c.learned.conf >= 0.3,
  },
  {
    key: "deals",
    title: "Big deals on your kinds of food",
    sub: "25% off or more, in food you like",
    fits: (c, likes) => c.discount >= 0.25 && likes && (c.value ?? 5) >= 5,
  },
  {
    key: "ordered",
    title: "Ordered before",
    sub: "From your past shops, with what you paid then",
    fits: (c) => c.paidBefore != null,
  },
];

/** Round-robin down the list so the same kind of food does not fill a whole shelf. */
function spreadOut(list: ProductCard[]): ProductCard[] {
  const seen = new Map<string, number>();
  const scored = list.map((c) => {
    const k = c.category ?? c.department ?? c.id;
    const n = seen.get(k) ?? 0;
    seen.set(k, n + 1);
    return { c, s: recScore(c) - 1.2 * n };
  });
  scored.sort((a, b) => b.s - a.s || (a.c.id < b.c.id ? -1 : 1));
  return scored.map((x) => x.c);
}

export function buildShelves(input: { cards: ProductCard[]; profile: TasteProfile; dealsThatFit: Deal[] }): ForYou {
  const { profile } = input;
  const cold = profile.ratedCount === 0 && profile.byProduct.size === 0;
  const cards = applyTaste(input.cards, profile);
  const likes = (c: ProductCard): boolean =>
    cold
      ? c.seedOil === "none" && (c.health ?? 0) >= 6
      : likesKind(profile, { id: c.id, category: c.category, department: c.department, brand: c.brand, reviewAvg: c.reviewAvg, reviewCount: c.reviewCount });

  const taken = new Set<string>();
  const byShelf = new Map<string, ProductCard[]>();
  for (const c of cards) {
    if (notForMe(c)) continue;
    const l = likes(c);
    const rule = RULES.find((r) => r.fits(c, l));
    if (!rule) continue;
    if (taken.has(c.id)) continue;
    taken.add(c.id);
    byShelf.set(rule.key, [...(byShelf.get(rule.key) ?? []), c]);
  }

  const mealShelf: Shelf = {
    key: "meals",
    title: "This week's dinner deals",
    sub: "Every part has something that fits your rules",
    items: [],
    deals: input.dealsThatFit,
  };
  const shelves: Shelf[] = [];
  for (const rule of RULES) {
    // The dinner deals sit just before "ordered before".
    if (rule.key === "ordered" && input.dealsThatFit.length > 0) shelves.push(mealShelf);
    const picked = spreadOut(byShelf.get(rule.key) ?? []).slice(0, SHELF_SIZE);
    if (picked.length > 0) {
      shelves.push({ key: rule.key, title: rule.title, sub: rule.sub, items: picked.map((c) => ({ ...c, why: whyFor(c, rule.key) })) });
    }
  }
  return { shelves, rated: profile.ratedCount };
}
