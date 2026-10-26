import { describe, expect, test } from "bun:test";
import { generateBasket, type BasketInput, type Candidate } from "./basket";
import { DEFAULT_SETTINGS, type Promo } from "./types";

const NOW = new Date("2026-10-26T12:00:00Z");
const FRESH = "2026-10-24T08:00:00Z";

function cand(id: string, over: Partial<Candidate> = {}): Candidate {
  return {
    id,
    name: `Product ${id}`,
    zone: "Meat & fish",
    category: `Category ${id}`,
    price: 2,
    nectarPrice: null,
    packGrams: 300,
    promos: [],
    isAvailable: true,
    isFood: true,
    storage: "ambient",
    protein: 20,
    seedOil: "none",
    health: 8,
    listedAt: FRESH,
    hasDetail: true,
    ...over,
  };
}

function input(candidates: Candidate[], over: Partial<BasketInput> = {}): BasketInput {
  return {
    candidates,
    ratings: {},
    notAtStore: [],
    settings: { ...DEFAULT_SETTINGS },
    previous: null,
    now: NOW,
    ...over,
  };
}

/** A varied catalogue: different prices, protein, health. */
function catalogue(n: number): Candidate[] {
  const out: Candidate[] = [];
  for (let i = 0; i < n; i++) {
    out.push(
      cand(`p${String(i).padStart(3, "0")}`, {
        price: 0.8 + ((i * 37) % 11) * 0.45,
        protein: 4 + ((i * 13) % 26),
        health: 5 + ((i * 7) % 50) / 10,
        packGrams: 150 + ((i * 29) % 7) * 100,
        storage: i % 3 === 0 ? "chilled" : "ambient",
        zone: i % 2 === 0 ? "Meat & fish" : "Food cupboard",
      }),
    );
  }
  return out;
}

const multibuy: Promo = {
  uid: "promo-1",
  text: "Buy 2 for £4.00 with Nectar",
  kind: "multibuy",
  nectar: true,
  start: "2026-10-01",
  end: "2026-12-08",
  qty: 2,
  dealPrice: 4,
};

describe("generateBasket", () => {
  test("never exceeds the budget", () => {
    for (const budget of [1, 4, 10, 25, 60, 150]) {
      const result = generateBasket(
        input(catalogue(80), { settings: { ...DEFAULT_SETTINGS, budget_gbp: budget } }),
      );
      expect(result.total).toBeLessThanOrEqual(budget);
      const sum = result.items.reduce((s, i) => s + Math.round(i.lineTotal * 100), 0);
      expect(sum).toBe(Math.round(result.total * 100));
    }
  });

  test("is deterministic, whatever order the products arrive in", () => {
    const cands = catalogue(60);
    const a = generateBasket(input(cands));
    const b = generateBasket(input(cands));
    const c = generateBasket(input([...cands].reverse()));
    expect(JSON.stringify(b)).toBe(JSON.stringify(a));
    expect(JSON.stringify(c)).toBe(JSON.stringify(a));
    expect(a.items.length).toBeGreaterThan(0);
  });

  test("leaves out seed oils, 1-2 star products and ones not at his store", () => {
    // All three are cheap, high protein and healthy, so they would be picked first.
    const great = { price: 0.5, protein: 30, health: 9 };
    const cands = [
      ...catalogue(20),
      cand("oil", { ...great, seedOil: "yes" }),
      cand("hated", great),
      cand("disliked", great),
      cand("missing", great),
      cand("good", great),
    ];
    const result = generateBasket(
      input(cands, { ratings: { hated: 1, disliked: 2 }, notAtStore: ["missing"] }),
    );
    const ids = result.items.map((i) => i.productId);
    expect(ids).toContain("good");
    for (const bad of ["oil", "hated", "disliked", "missing"]) {
      expect(ids).not.toContain(bad);
    }
  });

  test("prices a half-filled multi-buy at the single price", () => {
    const deal = cand("deal", { price: 2.44, promos: [multibuy], packGrams: 320, protein: 30.6 });
    // £3 cannot hold the £4 pair, but can hold one at £2.44.
    const tight = generateBasket(input([deal], { settings: { ...DEFAULT_SETTINGS, budget_gbp: 3 } }));
    expect(tight.items).toHaveLength(1);
    expect(tight.items[0].qty).toBe(1);
    expect(tight.items[0].lineTotal).toBe(2.44);
    expect(tight.items[0].unitPrice).toBe(2.44);
    expect(tight.items[0].dealGroup).toBeUndefined();
    expect(tight.total).toBe(2.44);

    // £10 holds the whole pair, at the deal price.
    const roomy = generateBasket(input([deal], { settings: { ...DEFAULT_SETTINGS, budget_gbp: 10 } }));
    expect(roomy.items[0].qty).toBe(2);
    expect(roomy.items[0].lineTotal).toBe(4);
    expect(roomy.items[0].dealGroup).toBe("promo-1");
    expect(roomy.items[0].reason).toBe("On offer: 2 for £4 with Nectar");
  });

  test("keeps favourites (4+ stars) from the previous basket", () => {
    // Low protein and middling health: nothing else would pick it.
    const fav = cand("fav", { price: 3, protein: null, packGrams: null, health: 5 });
    const cands = [...catalogue(0), fav, ...Array.from({ length: 20 }, (_, i) => cand(`cheap${i}`, { price: 1 }))];
    const settings = { ...DEFAULT_SETTINGS, budget_gbp: 10 };

    const without = generateBasket(input(cands, { settings, ratings: { fav: 5 } }));
    expect(without.items.map((i) => i.productId)).not.toContain("fav");

    const previous = {
      items: [{ productId: "fav", qty: 1, unitPrice: 3, lineTotal: 3, reason: "x" }],
    };
    const kept = generateBasket(input(cands, { settings, ratings: { fav: 5 }, previous }));
    const line = kept.items.find((i) => i.productId === "fav");
    expect(line).toBeTruthy();
    expect(line?.reason).toBe("You rated it 5★");
    expect(kept.total).toBeLessThanOrEqual(10);
  });

  test("an empty catalogue gives a warning, not an error", () => {
    const result = generateBasket(input([]));
    expect(result.items).toHaveLength(0);
    expect(result.total).toBe(0);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  test("a catalogue where nothing is eligible also warns without throwing", () => {
    const result = generateBasket(
      input([cand("a", { seedOil: "yes" }), cand("b", { isFood: false }), cand("c", { isAvailable: false })]),
    );
    expect(result.items).toHaveLength(0);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  test("leaves out stale prices (over 14 days) and says so", () => {
    const fresh = cand("fresh");
    const stale = cand("stale", { listedAt: "2026-10-11T00:00:00Z", price: 0.5 });
    const result = generateBasket(input([fresh, stale]));
    const ids = result.items.map((i) => i.productId);
    expect(ids).toContain("fresh");
    expect(ids).not.toContain("stale");
    expect(result.warnings.some((w) => /14 days/.test(w))).toBe(true);
  });

  test("keeps unrated picks to a small share once he has rated things", () => {
    const rated = Array.from({ length: 8 }, (_, i) => cand(`rated${i}`, { price: 1.2, health: 7 }));
    const ratings = Object.fromEntries(rated.map((c) => [c.id, 4]));
    const unrated = Array.from({ length: 40 }, (_, i) => cand(`new${String(i).padStart(2, "0")}`, { price: 1, health: 9 }));
    const result = generateBasket(
      input([...rated, ...unrated], {
        ratings,
        settings: { ...DEFAULT_SETTINGS, budget_gbp: 100, max_per_category: 5 },
      }),
    );
    const unratedPicked = result.items.filter((i) => i.productId.startsWith("new")).length;
    expect(unratedPicked).toBeLessThanOrEqual(Math.ceil(0.2 * result.items.length));
  });
});
