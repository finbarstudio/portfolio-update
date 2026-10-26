import { describe, expect, test } from "bun:test";
import { fitBlend, healthBreakdown, overallSum, processingScore, proteinScore, satScore, sourceNotes, valueBreakdown } from "./breakdown";

const base = {
  protein: 31,
  sat: 1,
  kcal: 150,
  ingredientCount: 1,
  upfMarkers: [] as string[],
  seedOil: "none" as const,
  seedOilsFound: [] as string[],
  health: 9.8,
  reasons: ["31g protein per 100g"],
  ingredientsSource: null,
  nutritionSource: null,
};

describe("health breakdown", () => {
  test("repeats the pipeline's maths: 35% protein, 30% sat fat, 35% processing", () => {
    const b = healthBreakdown(base);
    expect(b.mode).toBe("full");
    expect(b.parts.map((p) => p.weight)).toEqual([0.35, 0.3, 0.35]);
    expect(proteinScore(31, 150)).toBe(10);
    expect(satScore(1, 150)).toBeCloseTo(9.2, 5);
    expect(processingScore(1, 0)).toBe(10);
    expect(b.raw).toBe(9.8);
    expect(b.final).toBe(9.8);
  });

  test("processing counts markers and high sat fat loses two points", () => {
    expect(processingScore(8, 2)).toBe(3);
    expect(processingScore(30, 9)).toBe(0);
    expect(satScore(5, 100)).toBeLessThan(satScore(4.9, 100) + 0.01);
  });

  test("missing nutrition: processing only, never above 6", () => {
    const b = healthBreakdown({ ...base, protein: null, sat: null, kcal: null, health: 6 });
    expect(b.mode).toBe("processing");
    expect(b.raw).toBe(6);
    expect(b.notes.join(" ")).toMatch(/stops at 6/);
  });

  test("seed oils are named as the cap", () => {
    const b = healthBreakdown({ ...base, seedOil: "yes", seedOilsFound: ["rapeseed oil"], health: 3 });
    expect(b.caps[0]).toMatch(/rapeseed oil/);
    expect(b.caps[0]).toMatch(/3/);
    expect(healthBreakdown({ ...base, seedOil: "likely", health: 5 }).caps[0]).toMatch(/5/);
    expect(healthBreakdown(base).caps).toHaveLength(0);
  });

  test("nothing to judge from says so", () => {
    const b = healthBreakdown({ ...base, protein: null, sat: null, kcal: null, ingredientCount: null, health: null });
    expect(b.mode).toBe("none");
    expect(b.raw).toBeNull();
  });

  test("says honestly when the label came from somewhere else", () => {
    expect(sourceNotes({ ingredientsSource: "sainsburys", nutritionSource: "sainsburys" })).toEqual([]);
    expect(sourceNotes({ ingredientsSource: "tesco", nutritionSource: null })).toEqual(["Ingredients from the same product's label at Tesco"]);
    expect(sourceNotes({ ingredientsSource: "openfoodfacts", nutritionSource: "openfoodfacts" })).toEqual(["Ingredients and nutrition from Open Food Facts"]);
    expect(healthBreakdown({ ...base, ingredientsSource: "openfoodfacts" }).notes[0]).toMatch(/Open Food Facts/);
  });
});

describe("value breakdown", () => {
  const v = { value: 8, valueBasis: "protein" as const, valuePct: 0.9, discount: 0.2, per100Protein: 1.8, unitPrice: null, unitMeasure: null, category: "Chicken breast", department: "Chicken" };
  test("70% cheapness + 30% deal, the same as the catalogue's formula", () => {
    const b = valueBreakdown(v);
    const pts = b.parts.reduce((s, p) => s + (p.points ?? 0), 0);
    expect(Math.round(pts)).toBe(Math.round(10 * (0.7 * 0.9 + 0.3 * 0.5)));
    expect(b.parts[0].detail).toMatch(/£1.80 per 100g of protein/);
    expect(b.parts[0].detail).toMatch(/90%/);
    expect(b.parts[1].detail).toMatch(/20% off/);
  });
  test("no peers to compare is a middle mark and says so", () => {
    const b = valueBreakdown({ ...v, valuePct: null, valueBasis: null, discount: 0, value: null });
    expect(b.parts[0].detail).toMatch(/middle 5/);
    expect(b.parts[1].detail).toBe("No offer on now");
    expect(b.note).toBeTruthy();
  });
});

describe("overall sum", () => {
  test("writes the actual points", () => {
    const o = overallSum({ health: 8.5, value: 7, stars: 4, vote: null });
    expect(o.text).toBe("Health 8.5 × 0.5 + Value 7 × 0.35 + taste 4★ × 0.15 = 7.8");
    expect(overallSum({ health: 5, value: 5, stars: null, vote: 1 }).text).toMatch(/taste yes/);
    expect(overallSum({ health: 5, value: 5, stars: null, vote: null }).text).toMatch(/taste 5 \(no opinion yet\)/);
  });
});

describe("fit blend", () => {
  test("says how his stars or learned taste moved Fit", () => {
    expect(fitBlend({ health: 8, fit: 8.8, stars: 5, learned: null })).toBe("Your 5★ counts 40%: health 8 × 0.6 + taste 10 × 0.4 = 8.8.");
    const learned = fitBlend({ health: 8, fit: 8.3, stars: null, learned: { taste: 9, conf: 0.5, from: ["chicken (3 you've tried)"] } });
    expect(learned).toMatch(/≈9/);
    expect(learned).toMatch(/counts 15%/);
    expect(fitBlend({ health: 8, fit: 8, stars: null, learned: null })).toMatch(/haven't rated/);
    expect(fitBlend({ health: null, fit: null, stars: null, learned: null })).toMatch(/Not scored/);
  });
});
