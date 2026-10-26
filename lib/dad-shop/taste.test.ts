import { describe, expect, test } from "bun:test";
import { learnedFit } from "./fit";
import { applyTaste, buildTaste, estimateTaste, likesKind, type TasteRow } from "./taste";
import type { ProductCard } from "./types";

function row(productId: string, source: TasteRow["source"], value: number, over: Partial<TasteRow> = {}): TasteRow {
  return { productId, source, value, category: "Chicken breast", department: "Chicken", brand: "Acme", ...over };
}

const subject = (id: string, over: Record<string, unknown> = {}) => ({ id, category: "Chicken breast", department: "Chicken", brand: "Other", ...over });

describe("buildTaste / estimateTaste", () => {
  test("knows nothing until he has done something", () => {
    const p = buildTaste([]);
    expect(p.ratedCount).toBe(0);
    expect(estimateTaste(p, subject("x"))).toBeNull();
  });

  test("his own rating is the answer for that product, at full confidence", () => {
    const p = buildTaste([row("a", "rating", 5)]);
    const e = estimateTaste(p, subject("a"));
    expect(e?.src).toBe("you");
    expect(e?.taste).toBe(10);
    expect(e?.conf).toBe(1);
  });

  test("a product like the ones he loves is guessed to be good, and like the ones he hates, bad", () => {
    const loves = buildTaste([row("a", "rating", 5), row("b", "rating", 5), row("c", "rating", 4)]);
    const hates = buildTaste([row("a", "rating", 1), row("b", "rating", 1), row("c", "rating", 2)]);
    const good = estimateTaste(loves, subject("new"));
    const bad = estimateTaste(hates, subject("new"));
    expect(good?.src).toBe("learned");
    expect(good?.taste).toBeGreaterThan(7.5);
    expect(bad?.taste).toBeLessThan(2.5);
    expect(good?.conf).toBeGreaterThan(0.3);
    expect(good?.from.length).toBeGreaterThan(0);
  });

  test("more signals mean more confidence", () => {
    const one = estimateTaste(buildTaste([row("a", "rating", 5)]), subject("n"));
    const many = estimateTaste(buildTaste(["a", "b", "c", "d", "e"].map((id) => row(id, "rating", 5))), subject("n"));
    expect(many?.conf ?? 0).toBeGreaterThan(one?.conf ?? 1);
  });

  test("a Yes vote lifts similar products and a No vote drags them down", () => {
    const yes = estimateTaste(buildTaste([row("a", "vote", 1)]), subject("n"));
    const no = estimateTaste(buildTaste([row("a", "vote", -1)]), subject("n"));
    expect(yes?.taste ?? 0).toBeGreaterThan(7);
    expect(no?.taste ?? 10).toBeLessThan(3);
  });

  test("his stars beat his vote on the same product", () => {
    const p = buildTaste([row("a", "vote", -1), row("a", "rating", 5)]);
    expect(estimateTaste(p, subject("a"))?.taste).toBe(10);
    expect(p.ratedCount).toBe(1);
  });

  test("a different kind of food is not touched by it", () => {
    const p = buildTaste([row("a", "rating", 5), row("b", "rating", 5)]);
    expect(estimateTaste(p, subject("n", { category: "Biscuits", department: "Biscuits", brand: "Zed" }))).toBeNull();
  });

  test("buying and listing count for less than a rating", () => {
    const bought = estimateTaste(buildTaste([row("a", "shop", 1)]), subject("n"));
    const listed = estimateTaste(buildTaste([row("a", "list", 1)]), subject("n"));
    const rated = estimateTaste(buildTaste([row("a", "rating", 5)]), subject("n"));
    expect(bought?.conf ?? 1).toBeLessThan(rated?.conf ?? 0);
    expect(listed?.conf ?? 1).toBeLessThan(bought?.conf ?? 0);
  });

  test("the brand he rated badly within a kind of food is marked down further than the kind alone", () => {
    const p = buildTaste([row("a", "rating", 1), row("z", "rating", 5, { brand: "Zed" })]);
    const same = estimateTaste(p, subject("n", { brand: "Acme" }));
    const other = estimateTaste(p, subject("n", { brand: "Other" }));
    expect(same?.taste ?? 10).toBeLessThan(other?.taste ?? 0);
  });

  test("Sainsbury's own review average is a faint extra, never the whole answer", () => {
    const p = buildTaste([row("a", "rating", 5)]);
    const keen = estimateTaste(p, subject("n", { reviewAvg: 5, reviewCount: 200 }));
    const meh = estimateTaste(p, subject("n", { reviewAvg: 1, reviewCount: 200 }));
    expect(keen?.taste ?? 0).toBeGreaterThan(meh?.taste ?? 10);
    expect((keen?.taste ?? 0) - (meh?.taste ?? 0)).toBeLessThan(2);
    expect(estimateTaste(buildTaste([]), subject("n", { reviewAvg: 5, reviewCount: 200 }))).toBeNull();
  });

  test("likesKind needs a clear lean and some confidence", () => {
    expect(likesKind(buildTaste([]), subject("n"))).toBe(false);
    expect(likesKind(buildTaste([row("a", "rating", 5), row("b", "rating", 5)]), subject("n"))).toBe(true);
    expect(likesKind(buildTaste([row("a", "rating", 1), row("b", "rating", 1)]), subject("n"))).toBe(false);
  });
});

describe("learnedFit / applyTaste", () => {
  test("blends at a lower weight than his own rating, and not at all without health", () => {
    const rated = 0.6 * 6 + 0.4 * 10; // fitScore(6, 5 stars)
    const learned = learnedFit(6, 10, 1) ?? 0;
    expect(learned).toBeGreaterThan(6);
    expect(learned).toBeLessThan(rated);
    expect(learnedFit(null, 10, 1)).toBeNull();
    expect(learnedFit(6, 10, 0)).toBe(6);
  });

  test("applyTaste moves Fit for unrated products only", () => {
    const base = { health: 6, fit: 6, category: "Chicken breast", department: "Chicken", brand: "Other", reviewAvg: null, reviewCount: null } as unknown as ProductCard;
    const unrated = { ...base, id: "n", stars: null };
    const rated = { ...base, id: "r", stars: 3 };
    const out = applyTaste([unrated, rated], buildTaste([row("a", "rating", 5), row("b", "rating", 5)]));
    expect(out[0].fit ?? 0).toBeGreaterThan(6);
    expect(out[0].learned?.taste).toBeGreaterThan(8);
    expect(out[1]).toBe(rated);
    expect(applyTaste([unrated], buildTaste([]))[0]).toBe(unrated);
  });
});
