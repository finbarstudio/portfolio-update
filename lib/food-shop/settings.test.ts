import { describe, expect, test } from "bun:test";
import { DEFAULT_SETTINGS, GOAL_PRESETS, type Settings, normalisePostcode, parseSettings, weightsFor } from "./settings";

function parsed(input: unknown): Settings {
  const r = parseSettings(input);
  if (!r.ok) throw new Error(r.error);
  return r.value;
}

describe("defaults and presets", () => {
  test("the default is the balanced preset", () => {
    expect(DEFAULT_SETTINGS.goal).toBe("balanced");
    expect(DEFAULT_SETTINGS.watch).toEqual(GOAL_PRESETS.balanced.watch);
    expect(DEFAULT_SETTINGS.protein).toBe(GOAL_PRESETS.balanced.protein);
    expect(DEFAULT_SETTINGS.appliances).toEqual(["microwave", "oven", "hob"]);
    expect(DEFAULT_SETTINGS.clubcard).toBe(true);
  });

  test("each goal sets protein and the watch list", () => {
    expect(GOAL_PRESETS.protein).toEqual({ protein: 2, watch: { sat: 1, salt: 1, sugar: 1, kcal: 0, upf: 1 } });
    expect(GOAL_PRESETS.lighter).toEqual({ protein: 1, watch: { sat: 1, salt: 1, sugar: 2, kcal: 2, upf: 1 } });
    expect(GOAL_PRESETS.cheap).toEqual({ protein: 1, watch: { sat: 1, salt: 1, sugar: 1, kcal: 0, upf: 0 } });
  });
});

describe("parseSettings", () => {
  test("a full valid object round-trips", () => {
    expect(parsed(DEFAULT_SETTINGS)).toEqual(DEFAULT_SETTINGS);
  });

  test("missing fields fall back to the defaults", () => {
    expect(parsed({})).toEqual(DEFAULT_SETTINGS);
    expect(parsed({ goal: "cheap" }).goal).toBe("cheap");
  });

  test("rejects things that are not settings", () => {
    for (const junk of [null, undefined, "settings", 7, [], [1, 2]]) expect(parseSettings(junk).ok).toBe(false);
  });

  test("rejects unknown enum values with a plain-English error", () => {
    const bad = parseSettings({ goal: "wild" });
    expect(bad.ok).toBe(false);
    if (!bad.ok) expect(bad.error).toMatch(/Goal must be one of/);
    expect(parseSettings({ diet: "carnivore" }).ok).toBe(false);
    expect(parseSettings({ cooking: "microwave" }).ok).toBe(false);
    expect(parseSettings({ buys: { frozen: "yes" } }).ok).toBe(false);
    expect(parseSettings({ shopping: "longlife" })).toMatchObject({ ok: true, value: { buys: { frozen: true, fresh: true, freezeFresh: true } } });
    expect(parseSettings({ allergens: ["gluten", "kryptonite"] }).ok).toBe(false);
    expect(parseSettings({ allergens: "gluten" }).ok).toBe(false);
    expect(parseSettings({ appliances: ["toaster"] }).ok).toBe(false);
  });

  test("levels are 0, 1 or 2", () => {
    expect(parseSettings({ protein: 3 }).ok).toBe(false);
    expect(parseSettings({ protein: 1.5 }).ok).toBe(false);
    expect(parseSettings({ protein: "2" }).ok).toBe(false);
    expect(parseSettings({ watch: { sat: 3 } }).ok).toBe(false);
    expect(parseSettings({ watch: "lots" }).ok).toBe(false);
    expect(parsed({ watch: { sat: 2 } }).watch).toEqual({ ...DEFAULT_SETTINGS.watch, sat: 2 });
  });

  test("numbers are range-checked and rounded", () => {
    expect(parseSettings({ budget: 2 }).ok).toBe(false);
    expect(parseSettings({ budget: 5000 }).ok).toBe(false);
    expect(parseSettings({ budget: "50" }).ok).toBe(false);
    expect(parseSettings({ budget: Number.NaN }).ok).toBe(false);
    expect(parseSettings({ proteinTarget: 10 }).ok).toBe(false);
    expect(parseSettings({ proteinTarget: 500 }).ok).toBe(false);
    expect(parsed({ proteinTarget: 120.4 }).proteinTarget).toBe(120);
    expect(parsed({ budget: 62.6 }).budget).toBe(63);
    expect(parsed({ budget: null, proteinTarget: null }).budget).toBeNull();
  });

  test("booleans must be booleans", () => {
    expect(parseSettings({ noPork: "yes" }).ok).toBe(false);
    expect(parseSettings({ clubcard: 1 }).ok).toBe(false);
    expect(parsed({ noPork: true, noBeef: true, clubcard: false })).toMatchObject({ noPork: true, noBeef: true, clubcard: false });
  });

  test("arrays are deduped and kept in the form's order", () => {
    expect(parsed({ allergens: ["milk", "gluten", "milk"] }).allergens).toEqual(["gluten", "milk"]);
    expect(parsed({ appliances: ["hob", "airfryer", "hob"] }).appliances).toEqual(["airfryer", "hob"]);
    expect(parsed({ allergens: [] }).allergens).toEqual([]);
  });

  test("unknown keys are dropped", () => {
    const value = parsed({ goal: "lighter", isAdmin: true });
    expect("isAdmin" in value).toBe(false);
    expect(value.goal).toBe("lighter");
  });
});

describe("weightsFor", () => {
  test("every combination sums to 1", () => {
    for (const upf of [0, 1, 2] as const)
      for (const buys of [{ frozen: true, fresh: false, freezeFresh: false }, { frozen: false, fresh: true, freezeFresh: true }, DEFAULT_SETTINGS.buys])
        for (const cooking of ["ready", "scratch"] as const) {
          const w = weightsFor({ ...DEFAULT_SETTINGS, watch: { ...DEFAULT_SETTINGS.watch, upf }, buys, cooking });
          expect(w.nutrition + w.processing + w.shelf + w.convenience).toBeCloseTo(1, 10);
        }
  });

  test("minding ultra-processed food moves weight to processing", () => {
    const low = weightsFor({ ...DEFAULT_SETTINGS, watch: { ...DEFAULT_SETTINGS.watch, upf: 0 } });
    const high = weightsFor({ ...DEFAULT_SETTINGS, watch: { ...DEFAULT_SETTINGS.watch, upf: 2 } });
    expect(high.processing).toBeGreaterThan(low.processing);
  });

  test("long-life shoppers weight shelf life more, ready-meal cooks weight convenience more", () => {
    expect(weightsFor({ ...DEFAULT_SETTINGS, buys: { frozen: true, fresh: false, freezeFresh: false } }).shelf).toBeGreaterThan(weightsFor(DEFAULT_SETTINGS).shelf);
    expect(weightsFor({ ...DEFAULT_SETTINGS, buys: { frozen: false, fresh: true, freezeFresh: false } }).shelf).toBeLessThan(weightsFor(DEFAULT_SETTINGS).shelf);
    expect(weightsFor({ ...DEFAULT_SETTINGS, cooking: "ready" }).convenience).toBeGreaterThan(weightsFor(DEFAULT_SETTINGS).convenience);
  });

  test("the default (balanced, upf 1, buys fresh and frozen, scratch) is .45 / .25 / .15 / .15 over their sum", () => {
    const w = weightsFor(DEFAULT_SETTINGS);
    expect(w.nutrition).toBeCloseTo(0.45 / 1, 10);
    expect(w.processing).toBeCloseTo(0.25 / 1, 10);
    expect(w.shelf).toBeCloseTo(0.15 / 1, 10);
    expect(w.convenience).toBeCloseTo(0.15 / 1, 10);
  });

  test("high protein and lighter goals weigh nutrition most, cheapest least", () => {
    const n = (goal: Settings["goal"]) => weightsFor({ ...DEFAULT_SETTINGS, goal }).nutrition;
    expect(n("protein")).toBeGreaterThan(n("balanced"));
    expect(n("lighter")).toBeGreaterThan(n("balanced"));
    expect(n("cheap")).toBeLessThan(n("balanced"));
  });
});

describe("postcode", () => {
  test("is normalised and validated", () => {
    expect(normalisePostcode(" br75ag ")).toBe("BR7 5AG");
    expect(normalisePostcode("SW1A 1AA")).toBe("SW1A 1AA");
    expect(normalisePostcode("not a postcode")).toBe(null);
    expect(parseSettings({ postcode: "ec1a1bb" })).toMatchObject({ ok: true, value: { postcode: "EC1A 1BB" } });
    expect(parseSettings({ postcode: "12345" }).ok).toBe(false);
    expect(parseSettings({})).toMatchObject({ ok: true, value: { postcode: null } });
  });
});
