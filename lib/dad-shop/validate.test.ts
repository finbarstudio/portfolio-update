import { describe, expect, test } from "bun:test";
import { queryFor } from "./find";
import { parseFindParams, parseMaxUpf, parseSimilarParams, SIMILAR_DEFAULTS } from "./validate";

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

  test("they read from the address and write back to it", () => {
    const f = parse("hp=1&folic=1&hideAvoided=1&upf=1");
    expect(f.highProtein).toBe(true);
    expect(f.hideFolic).toBe(true);
    expect(f.hideAvoided).toBe(true);
    expect(f.maxUpf).toBe(1);
    const again = parse(queryFor(f));
    expect(again.highProtein).toBe(true);
    expect(again.hideFolic).toBe(true);
    expect(again.hideAvoided).toBe(true);
    expect(again.maxUpf).toBe(1);
  });

  test("hide foods I don't eat is kept when off, so a reload doesn't turn it back on", () => {
    const off = parse(queryFor({ ...SIMILAR_DEFAULTS, hideAvoided: false }));
    expect(off.hideAvoided).toBe(false);
    expect(queryFor({ ...SIMILAR_DEFAULTS, hideAvoided: false })).toMatch(/hideAvoided=0/);
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
