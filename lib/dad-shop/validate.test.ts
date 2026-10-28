import { describe, expect, test } from "bun:test";
import { parseFindParams, parseMaxUpf, parseSimilarParams } from "./validate";

const parse = (qs: string) => {
  const r = parseFindParams(new URLSearchParams(qs));
  if (!r.ok) throw new Error(r.error);
  return r.value;
};

describe("the new filters", () => {
  test("all off unless the address says so", () => {
    const f = parse("");
    expect(f.highProtein).toBe(false);
    expect(f.hideFolic).toBe(false);
    expect(f.hideAvoided).toBe(false);
    expect(f.maxUpf).toBeNull();
  });

  test("they read from the address", () => {
    const f = parse("hp=1&folic=1&hideAvoided=1&upf=1");
    expect(f.highProtein).toBe(true);
    expect(f.hideFolic).toBe(true);
    expect(f.hideAvoided).toBe(true);
    expect(f.maxUpf).toBe(1);
  });

  test("the ultra-processing choice is 0, 1, 2 or any", () => {
    expect(parseMaxUpf("0")).toBe(0);
    expect(parseMaxUpf("2")).toBe(2);
    expect(parseMaxUpf("3")).toBeNull();
    expect(parseMaxUpf(null)).toBeNull();
    expect(parseMaxUpf("none")).toBeNull();
  });
});

describe("similar products start unfiltered", () => {
  test("nothing is hidden, not even the foods he doesn't eat", () => {
    const f = parseSimilarParams({});
    expect(f.hideAvoided).toBe(false);
    expect(f.hideSat).toBe(false);
    expect(f.noSeedOil).toBe(false);
    expect(f.maxUpf).toBeNull();
  });

  test("the switches on a product page's address still apply", () => {
    const f = parseSimilarParams({ hp: "1", folic: "1", upf: "0", hideAvoided: "1" });
    expect(f.highProtein).toBe(true);
    expect(f.hideFolic).toBe(true);
    expect(f.maxUpf).toBe(0);
    expect(f.hideAvoided).toBe(true);
  });
});
