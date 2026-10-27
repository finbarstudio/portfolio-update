import { describe, expect, test } from "bun:test";
import { OVERALL_WEIGHTS, overallParts, overallScore, overallWeightsLine } from "./overall";

describe("Best overall", () => {
  test("health leads, then value, then taste", () => {
    expect(OVERALL_WEIGHTS).toEqual({ health: 0.6, value: 0.25, taste: 0.15 });
  });

  test("the weights add up to one, so the score stays on a 0-10 scale", () => {
    const sum = OVERALL_WEIGHTS.health + OVERALL_WEIGHTS.value + OVERALL_WEIGHTS.taste;
    expect(Math.round(sum * 1000)).toBe(1000);
    expect(overallScore({ health: 10, value: 10, stars: 5, vote: null })).toBeCloseTo(10, 5);
    expect(overallScore({ health: 0, value: 0, stars: 1, vote: null })).toBeCloseTo(0, 5);
  });

  test("blends health, value and taste by the constant", () => {
    const s = overallScore({ health: 8.5, value: 7, stars: 4, vote: null });
    expect(s).toBeCloseTo(8.5 * 0.6 + 7 * 0.25 + 7.5 * 0.15, 5);
    expect(overallParts({ health: 8.5, value: 7, stars: 4, vote: null }).taste.how).toBe("stars");
  });

  test("things he rated or voted Yes get a boost over the same product unrated", () => {
    const base = { health: 7, value: 6 };
    const none = overallScore({ ...base, stars: null, vote: null });
    expect(overallScore({ ...base, stars: 5, vote: null })).toBeGreaterThan(none);
    expect(overallScore({ ...base, stars: null, vote: 1 })).toBeGreaterThan(none);
    expect(overallScore({ ...base, stars: null, vote: -1 })).toBeLessThan(none);
    expect(overallScore({ ...base, stars: 2, vote: null })).toBeLessThan(none);
  });

  test("his stars beat his vote", () => {
    expect(overallParts({ health: 5, value: 5, stars: 1, vote: 1 }).taste.how).toBe("stars");
  });

  test("unjudged products sit in the middle rather than at the top or bottom", () => {
    const p = overallParts({ health: null, value: null, stars: null, vote: null });
    expect(p.health.known).toBe(false);
    expect(p.total).toBeCloseTo(5, 5);
  });

  test("says its weights in words", () => {
    expect(overallWeightsLine()).toBe("Health 60% · value 25% · your taste 15%");
  });
});
