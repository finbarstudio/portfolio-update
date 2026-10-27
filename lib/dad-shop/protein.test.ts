import { describe, expect, test } from "bun:test";
import { gramsText, isHighProtein } from "./protein";

describe("high protein", () => {
  test("15g per 100g counts whatever the calories", () => {
    expect(isHighProtein(15, 400)).toBe(true);
    expect(isHighProtein(14.9, 400)).toBe(false);
    expect(isHighProtein(15, null)).toBe(true);
  });

  test("8g per 100 kcal counts: Fage Total 5% (9g, 97 kcal)", () => {
    expect(isHighProtein(9, 97)).toBe(true);
    expect(isHighProtein(9, 130)).toBe(false);
  });

  test("vegetables and unknowns never count", () => {
    expect(isHighProtein(3, 34)).toBe(false);
    expect(isHighProtein(null, 100)).toBe(false);
    expect(isHighProtein(0, 0)).toBe(false);
    expect(isHighProtein(9, null)).toBe(false);
  });

  test("grams read like a pack", () => {
    expect(gramsText(9)).toBe("9g");
    expect(gramsText(9.34)).toBe("9.3g");
    expect(gramsText(21.4)).toBe("21g");
  });
});
