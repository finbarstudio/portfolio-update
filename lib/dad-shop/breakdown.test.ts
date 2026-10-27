import { describe, expect, test } from "bun:test";
import { fitBlend, healthBreakdown, isWholeFood, overallSum, processingScore, proteinScore, satScore, sourceNotes, valueBreakdown } from "./breakdown";

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
  isBasic: false,
  folicAcid: false,
  productGroup: null as string | null,
};

describe("whole food", () => {
  const wf = { isBasic: false, ingredientCount: 5, upfMarkers: [] as string[], seedOil: "none" as const };

  test("a plain ingredient is a whole food", () => {
    expect(isWholeFood({ ...wf, isBasic: true, ingredientCount: null })).toBe(true);
    expect(isWholeFood({ ...wf, isBasic: true, ingredientCount: 12, seedOil: "yes", upfMarkers: ["emulsifier"] })).toBe(true);
  });

  test("three ingredients or fewer, no markers, seed oil 'none'", () => {
    expect(isWholeFood({ ...wf, ingredientCount: 1 })).toBe(true);
    expect(isWholeFood({ ...wf, ingredientCount: 3 })).toBe(true);
    expect(isWholeFood({ ...wf, ingredientCount: 4 })).toBe(false);
    expect(isWholeFood({ ...wf, ingredientCount: 2, upfMarkers: ["flavouring"] })).toBe(false);
    expect(isWholeFood({ ...wf, ingredientCount: 2, seedOil: "yes" })).toBe(false);
    expect(isWholeFood({ ...wf, ingredientCount: 2, seedOil: "likely" })).toBe(false);
  });

  test("seed oil 'unknown' fails the clean-list branch, and so does an unread ingredient count", () => {
    expect(isWholeFood({ ...wf, ingredientCount: 2, seedOil: "unknown" })).toBe(false);
    expect(isWholeFood({ ...wf, ingredientCount: null })).toBe(false);
    expect(isWholeFood({ ...wf, ingredientCount: null, isBasic: true, seedOil: "unknown" })).toBe(true);
  });
});

describe("saturated fat only counts against processed food", () => {
  const fatty = { ...base, sat: 12, kcal: 250, protein: 25, health: 9 };

  test("a whole food scores 10 on it and says why", () => {
    const b = healthBreakdown({ ...fatty, isBasic: true, ingredientCount: 1 });
    const sat = b.parts.find((p) => p.key === "sat");
    expect(sat?.score).toBe(10);
    expect(sat?.detail).toMatch(/^A whole food, so its saturated fat isn't counted against it/);
  });

  test("the whole-food line only appears where the complaint would have fired", () => {
    // 1g sat in 150 kcal: nothing to excuse, so the plain working shows, but the score is still the whole-food 10.
    const lean = healthBreakdown({ ...base, sat: 1, kcal: 150, isBasic: true });
    const sat = lean.parts.find((p) => p.key === "sat");
    expect(sat?.score).toBe(10);
    expect(sat?.detail).not.toMatch(/whole food/);
    // 5g or more triggers it even when the sat score is not low.
    const five = healthBreakdown({ ...base, sat: 5, kcal: 97, isBasic: true });
    expect(five.parts.find((p) => p.key === "sat")?.detail).toMatch(/^A whole food/);
  });

  test("a processed food keeps its penalty, and says so when it has markers", () => {
    const b = healthBreakdown({ ...fatty, ingredientCount: 9, upfMarkers: ["emulsifier"] });
    const sat = b.parts.find((p) => p.key === "sat");
    expect(sat?.score).toBe(satScore(12, 250));
    expect(sat?.score).toBeLessThan(3);
    expect(sat?.detail).toMatch(/high: minus 2/);
    expect(sat?.detail).toMatch(/Processed and high in saturated fat$/);
    // No markers: the penalty stands but the markers line does not.
    const clean = healthBreakdown({ ...fatty, ingredientCount: 9 });
    expect(clean.parts.find((p) => p.key === "sat")?.detail).not.toMatch(/Processed and high/);
  });

  test("full-fat Greek yoghurt: 3 ingredients or fewer is the line", () => {
    const fage = { ...fatty, sat: 5, kcal: 97, protein: 9, ingredientCount: 2 };
    expect(healthBreakdown(fage).parts.find((p) => p.key === "sat")?.score).toBe(10);
    expect(healthBreakdown({ ...fage, ingredientCount: 6 }).parts.find((p) => p.key === "sat")?.score).toBeLessThan(10);
  });
});

describe("folic acid and protein wording", () => {
  test("folic acid is a note only: the parts and raw score do not change", () => {
    const plain = healthBreakdown(base);
    const folic = healthBreakdown({ ...base, folicAcid: true });
    expect(folic.notes).toContain("Contains folic acid. Shown as a warning only; it doesn't change the score.");
    expect(plain.notes.join(" ")).not.toMatch(/folic/);
    expect(folic.raw).toBe(plain.raw);
    expect(folic.parts.map((p) => p.score)).toEqual(plain.parts.map((p) => p.score));
  });

  test("protein is worded per 100g, with the calorie comparison in brackets", () => {
    const b = healthBreakdown({ ...base, protein: 9, kcal: 97 });
    expect(b.parts[0].detail).toBe(
      "9g protein per 100g (about 9g for every 100 calories; scoring compares protein to calories so yoghurt and steak can be compared fairly)",
    );
  });
});

describe("processing scale per comparison group", () => {
  test("the lenient curve, for lenient groups and for products with no group", () => {
    for (const group of [null, "pizza", "ready meals (chilled & frozen)", "pasta sauces"]) {
      const at = (n: number) => processingScore(n, 0, group);
      expect([at(1), at(2), at(3), at(5), at(6), at(10), at(11), at(20), at(21)]).toEqual([10, 10, 8, 8, 6, 6, 4, 4, 2]);
    }
    expect(processingScore(8, 2)).toBe(3);
  });

  test("the strict curve, for every other group", () => {
    const at = (n: number) => processingScore(n, 0, "butter");
    expect([1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 15, 16, 20, 21].map(at)).toEqual([10, 10, 9, 8, 7, 6, 6, 5, 5, 4, 4, 3, 3, 2]);
  });

  test("markers take 1.5 each, at most 6, on both curves", () => {
    expect(processingScore(8, 2, "butter")).toBe(2);
    expect(processingScore(8, 2, "pizza")).toBe(3);
    expect(processingScore(2, 9, "butter")).toBe(4);
    expect(processingScore(30, 9, "butter")).toBe(0);
  });

  test("the breakdown uses the group's curve", () => {
    const strict = healthBreakdown({ ...base, ingredientCount: 7, productGroup: "butter" });
    const lenient = healthBreakdown({ ...base, ingredientCount: 7, productGroup: "pizza" });
    expect(strict.parts.find((p) => p.key === "processing")?.score).toBe(6);
    expect(lenient.parts.find((p) => p.key === "processing")?.score).toBe(6);
    const four = healthBreakdown({ ...base, ingredientCount: 4, productGroup: "butter" });
    expect(four.parts.find((p) => p.key === "processing")?.score).toBe(8);
    const nine = healthBreakdown({ ...base, ingredientCount: 9, productGroup: "butter" });
    const nineLenient = healthBreakdown({ ...base, ingredientCount: 9, productGroup: "pizza" });
    expect(nine.parts.find((p) => p.key === "processing")?.score).toBe(5);
    expect(nineLenient.parts.find((p) => p.key === "processing")?.score).toBe(6);
  });
});

describe("health breakdown", () => {
  test("repeats the pipeline's maths: 35% protein, 30% sat fat, 35% processing", () => {
    const b = healthBreakdown({ ...base, ingredientCount: 8 });
    expect(b.mode).toBe("full");
    expect(b.parts.map((p) => p.weight)).toEqual([0.35, 0.3, 0.35]);
    expect(proteinScore(31, 150)).toBe(10);
    expect(satScore(1, 150)).toBeCloseTo(9.2, 5);
    expect(processingScore(8, 0)).toBe(6);
    expect(b.raw).toBe(8.4);
    expect(b.final).toBe(9.8);
    // The same food as a plain ingredient: sat fat is not counted, so a full 10.
    expect(healthBreakdown(base).raw).toBe(10);
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
    expect(o.text).toBe("Health 8.5 × 0.6 + Value 7 × 0.25 + taste 4★ × 0.15 = 8");
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
