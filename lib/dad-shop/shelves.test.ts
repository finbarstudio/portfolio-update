import { describe, expect, test } from "bun:test";
import { SHELF_SIZE, buildShelves, notForMe, whyFor } from "./shelves";
import { buildTaste, type TasteRow } from "./taste";
import type { Deal, ProductCard } from "./types";

function card(id: string, over: Partial<ProductCard> = {}): ProductCard {
  return {
    id, name: id, brand: "Acme", imageUrl: null, zone: "Meat & fish", department: "Chicken", category: "Chicken breast",
    price: 3, wasPrice: null, offerPrice: null, nectarPrice: null, promos: [], unitPrice: null, unitMeasure: null, packGrams: 500,
    storage: null, seedOil: "none", health: 8, stars: null, fit: 8, protein: 22, sat: 1, ingredientCount: 1, upfCount: 0,
    reviewAvg: null, reviewCount: null, isNew: false, animal: null, notAtStore: false, onList: false, isAvailable: true,
    value: 7, valueBasis: null, valuePct: null, discount: 0, per100Protein: null, paidBefore: null,
    isBasic: false, vote: null, ingredientsSource: null, nutritionSource: null, kcal: 120, upfMarkers: [], seedOilsFound: [], reasons: [],
    ...over,
  };
}

const rating = (productId: string, value: number, over: Partial<TasteRow> = {}): TasteRow => ({
  productId, source: "rating", value, category: "Chicken breast", department: "Chicken", brand: "Acme", ...over,
});

const none = { dealsThatFit: [] as Deal[] };
const keys = (r: { shelves: { key: string }[] }) => r.shelves.map((s) => s.key);

describe("buildShelves", () => {
  test("with nothing rated yet the shelves go by his rules, and say so", () => {
    const r = buildShelves({ cards: [card("a"), card("b", { discount: 0.3, fit: 6.5, health: 6.5 }), card("c", { seedOil: "likely", health: 4, fit: 4 })], profile: buildTaste([]), ...none });
    expect(r.rated).toBe(0);
    expect(keys(r)).toContain("top");
    expect(keys(r)).toContain("deals");
    const all = r.shelves.flatMap((s) => s.items.map((i) => i.id));
    expect(all).not.toContain("c");
    expect(r.shelves.find((s) => s.key === "top")?.items[0].why).toBe("fits all your rules");
  });

  test("each product is on only the first shelf it fits", () => {
    const profile = buildTaste([rating("r1", 5), rating("r2", 5)]);
    const fav = card("fav", { stars: 5, discount: 0.3, isNew: true });
    const r = buildShelves({ cards: [fav, card("x", { discount: 0.3, isNew: true })], profile, ...none });
    const where = r.shelves.filter((s) => s.items.some((i) => i.id === "fav"));
    expect(where).toHaveLength(1);
    expect(where[0].key).toBe("fav");
    const ids = r.shelves.flatMap((s) => s.items.map((i) => i.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("favourites on offer include a Yes vote; a Yes with no offer is not a favourite-on-offer", () => {
    const yes = card("yes", { vote: 1, discount: 0.2, fit: 5, health: 5 });
    const yesNoOffer = card("yes2", { vote: 1, discount: 0, fit: 5, health: 5 });
    const r = buildShelves({ cards: [yes, yesNoOffer], profile: buildTaste([]), ...none });
    expect(r.shelves.find((s) => s.key === "fav")?.items.map((i) => i.id)).toEqual(["yes"]);
  });

  test("the unrated look-alikes of things he loves land in 'You might like these'", () => {
    const profile = buildTaste([rating("r1", 5), rating("r2", 5), rating("r3", 5)]);
    const maybe = card("maybe", { health: 5, fit: 5, value: 4 });
    const r = buildShelves({ cards: [maybe], profile, ...none });
    expect(r.rated).toBe(3);
    expect(r.shelves.find((s) => s.key === "try")?.items[0].id).toBe("maybe");
    expect(r.shelves.find((s) => s.key === "try")?.items[0].why).toMatch(/like chicken breast/);
  });

  test("things he would not want never show", () => {
    expect(notForMe(card("a", { stars: 2 }))).toBe(true);
    expect(notForMe(card("a", { vote: -1 }))).toBe(true);
    expect(notForMe(card("a", { onList: true }))).toBe(true);
    expect(notForMe(card("a", { notAtStore: true }))).toBe(true);
    expect(notForMe(card("a"))).toBe(false);
    const hated = buildTaste([rating("r1", 1), rating("r2", 1), rating("r3", 1)]);
    const r = buildShelves({ cards: [card("same-kind")], profile: hated, ...none });
    expect(r.shelves.flatMap((s) => s.items)).toHaveLength(0);
  });

  test("new in needs food he likes; once he has rated things, a new product in food he rated badly is skipped", () => {
    const hated = buildTaste([rating("r1", 1), rating("r2", 2)]);
    const loved = buildTaste([rating("r1", 5), rating("r2", 5)]);
    const fresh = card("fresh", { isNew: true, fit: 5, health: 5, value: 5 });
    expect(keys(buildShelves({ cards: [fresh], profile: loved, ...none }))).toContain("new");
    expect(keys(buildShelves({ cards: [fresh], profile: hated, ...none }))).not.toContain("new");
  });

  test("a shelf holds at most SHELF_SIZE and mixes kinds of food", () => {
    const many = Array.from({ length: 60 }, (_, i) => card(`p${String(i).padStart(2, "0")}`, { category: i % 2 ? "Fish" : "Chicken breast", health: 8 + (i % 3) * 0.1, fit: 8 + (i % 3) * 0.1 }));
    const r = buildShelves({ cards: many, profile: buildTaste([]), ...none });
    const top = r.shelves.find((s) => s.key === "top");
    expect(top?.items.length).toBe(SHELF_SIZE);
    const firstSix = top?.items.slice(0, 6).map((i) => i.category);
    expect(new Set(firstSix).size).toBe(2);
  });

  test("dinner deals that fit get their own shelf; ordered-before comes from past shops", () => {
    const deal: Deal = { id: "d", slug: "d", title: "Dine in", strap: "", price: 15, nectar: true, endsOn: null, parts: [], products: 4, typical: null };
    const ordered = card("old", { paidBefore: { each: 2.5, at: "2026-09-01", offer: null }, fit: 5, health: 5, value: 5 });
    const r = buildShelves({ cards: [ordered], profile: buildTaste([]), dealsThatFit: [deal] });
    expect(keys(r)).toEqual(["meals", "ordered"]);
    expect(r.shelves[0].deals?.[0].id).toBe("d");
    expect(r.shelves[1].items[0].why).toMatch(/paid £2.50/);
  });

  test("whyFor says only what the card does not already show, in at most two short bits", () => {
    const w = whyFor(card("a", { stars: 5, discount: 0.3, isNew: true }), "fav");
    expect(w).toBe("you gave it 5 stars · new in");
    expect(w).not.toMatch(/off|seed|protein/);
    expect(whyFor(card("b"), "top")).toBe("fits all your rules");
  });
});
