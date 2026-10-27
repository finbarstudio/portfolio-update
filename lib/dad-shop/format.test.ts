import { describe, expect, test } from "bun:test";
import { processing } from "./format";

describe("processing chip wording", () => {
  test("a plain food", () => {
    expect(processing({ upfCount: 0, ingredientCount: 1 })).toEqual({ label: "Unprocessed · 1 ingredient", tone: "g" });
  });

  test("no markers, longer list", () => {
    expect(processing({ upfCount: 0, ingredientCount: 11 })).toEqual({ label: "No UPF additives · 11 ingredients", tone: "g" });
    expect(processing({ upfCount: 0, ingredientCount: null })?.label).toBe("No UPF additives");
  });

  test("with markers it is never green", () => {
    expect(processing({ upfCount: 1, ingredientCount: 4 })).toEqual({ label: "Ultra-processed · 1 marker", tone: "a" });
    expect(processing({ upfCount: 2, ingredientCount: 4 })).toEqual({ label: "Ultra-processed · 2 markers", tone: "a" });
    expect(processing({ upfCount: 3, ingredientCount: 20 })?.tone).toBe("r");
  });

  test("not read yet says nothing", () => {
    expect(processing({ upfCount: null, ingredientCount: null })).toBeNull();
  });
});
