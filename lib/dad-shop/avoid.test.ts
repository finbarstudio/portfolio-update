import { describe, expect, test } from "bun:test";
import { avoidFromRows, isAvoided, readAvoid } from "./avoid";
import { DEFAULT_SETTINGS } from "./types";
import { parseAvoidList, parseSettingsPatch } from "./validate";

describe("foods he doesn't eat", () => {
  test("pork is off the table until he says otherwise", () => {
    expect(DEFAULT_SETTINGS.avoid_proteins).toEqual(["pork"]);
    expect(avoidFromRows([{ key: "budget_gbp", value: 60 }])).toEqual(["pork"]);
    expect(avoidFromRows([])).toEqual(["pork"]);
  });

  test("a list he saved wins, even an empty one", () => {
    expect(avoidFromRows([{ key: "avoid_proteins", value: ["beef", "tuna"] }])).toEqual(["beef", "tuna"]);
    expect(avoidFromRows([{ key: "avoid_proteins", value: [] }])).toEqual([]);
  });

  test("rubbish in the database falls back, unknown names are dropped", () => {
    expect(readAvoid("pork")).toEqual(["pork"]);
    expect(readAvoid(null)).toEqual(["pork"]);
    expect(readAvoid(["pork", "unicorn", 3, "pork"])).toEqual(["pork"]);
  });

  test("mixed meat, egg, dairy and veggie are not choices", () => {
    expect(parseAvoidList(["mixed meat"]).ok).toBe(false);
    expect(parseAvoidList(["egg"]).ok).toBe(false);
    expect(parseAvoidList("pork").ok).toBe(false);
  });

  test("a good list is cleaned and ordered like the choices", () => {
    expect(parseAvoidList(["beef", "pork", "beef"])).toEqual({ ok: true, value: ["pork", "beef"] });
    expect(parseAvoidList([])).toEqual({ ok: true, value: [] });
  });

  test("the settings patch takes the list", () => {
    expect(parseSettingsPatch({ avoid_proteins: ["lamb"] })).toEqual({ ok: true, value: { avoid_proteins: ["lamb"] } });
    expect(parseSettingsPatch({ avoid_proteins: ["lamb", "cat"] }).ok).toBe(false);
    expect(parseSettingsPatch({}).ok).toBe(false);
  });

  test("only the product's own main protein counts: bacon and mixed meat pass", () => {
    expect(isAvoided("pork", ["pork"])).toBe(true);
    expect(isAvoided("mixed meat", ["pork"])).toBe(false);
    expect(isAvoided(null, ["pork"])).toBe(false);
    expect(isAvoided("beef", [])).toBe(false);
  });
});
