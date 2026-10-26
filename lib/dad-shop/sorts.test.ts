import { describe, expect, test } from "bun:test";
import { betterSwap, sortCards, sortScoreOf } from "./sorts";
import type { ProductCard } from "./types";

function card(id: string, over: Partial<ProductCard> = {}): ProductCard {
  return {
    id,
    name: id,
    brand: null,
    imageUrl: null,
    zone: null,
    department: null,
    category: null,
    price: 2,
    wasPrice: null,
    offerPrice: null,
    nectarPrice: null,
    promos: [],
    unitPrice: null,
    unitMeasure: null,
    packGrams: null,
    storage: null,
    seedOil: "none",
    health: 6,
    stars: null,
    fit: 6,
    protein: null,
    sat: null,
    ingredientCount: null,
    upfCount: null,
    reviewAvg: null,
    reviewCount: null,
    isNew: false,
    animal: null,
    notAtStore: false,
    onList: false,
    isAvailable: true,
    value: 5,
    valueBasis: null,
    valuePct: null,
    discount: 0,
    per100Protein: null,
    paidBefore: null,
    ...over,
  };
}

describe("sortCards", () => {
  test("lowest price uses the Nectar price", () => {
    const a = card("a", { price: 2 });
    const b = card("b", { price: 3, nectarPrice: 1.5 });
    expect(sortCards([a, b], "price").map((c) => c.id)).toEqual(["b", "a"]);
  });

  test("biggest saving first", () => {
    const sorted = sortCards([card("a", { discount: 0.1 }), card("b", { discount: 0.4 }), card("c", { discount: 0.2 })], "saving");
    expect(sorted.map((c) => c.id)).toEqual(["b", "c", "a"]);
  });

  test("protein per pound", () => {
    const a = card("a", { price: 2, packGrams: 500, protein: 20 });
    const b = card("b", { price: 4, packGrams: 500, protein: 20 });
    expect(sortCards([b, a], "ppp").map((c) => c.id)).toEqual(["a", "b"]);
  });

  test("all round prefers fit, then value, and keeps ties in their order", () => {
    const a = card("a", { fit: 8, value: 5 });
    const b = card("b", { fit: 6, value: 7 });
    const c = card("c", { fit: 8, value: 5 });
    expect(sortCards([b, a, c], "round").map((x) => x.id)).toEqual(["a", "c", "b"]);
    expect(sortScoreOf(a, "round")).toBeGreaterThan(sortScoreOf(b, "round"));
  });

  test("fewest ingredients first, products with no list last", () => {
    const sorted = sortCards([card("none"), card("long", { ingredientCount: 12 }), card("short", { ingredientCount: 3 })], "few");
    expect(sorted.map((c) => c.id)).toEqual(["short", "long", "none"]);
  });
});

describe("betterSwap", () => {
  const mine = card("mine", { fit: 5, value: 6 });

  test("offers a clearly better product from the same deal", () => {
    const alt = card("alt", { fit: 8, value: 6 });
    expect(betterSwap(mine, [mine, card("meh", { fit: 5.5 }), alt], new Set())?.id).toBe("alt");
  });

  test("skips ones already on the list, not at his store, or much worse value", () => {
    const pool = [card("a", { fit: 9 }), card("b", { fit: 9, notAtStore: true }), card("c", { fit: 9, value: 2 })];
    expect(betterSwap(mine, pool, new Set(["a"]))).toBeNull();
  });

  test("nothing when his own fit is unknown", () => {
    expect(betterSwap(card("x", { fit: null }), [card("y", { fit: 9 })], new Set())).toBeNull();
  });
});
