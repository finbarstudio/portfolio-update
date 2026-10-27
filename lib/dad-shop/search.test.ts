import { describe, expect, test } from "bun:test";
import { expandTerm, searchTerms, searchVariants, singular } from "./search";

describe("search variants", () => {
  test("piri and peri are the same word, either way round", () => {
    expect(expandTerm("piri")).toEqual(["piri", "peri"]);
    expect(expandTerm("peri")).toEqual(["peri", "piri"]);
  });

  test("spelling pairs from the call", () => {
    expect(expandTerm("yoghurt")).toContain("yogurt");
    expect(expandTerm("yogurt")).toContain("yoghurt");
    expect(expandTerm("kyiv")).toContain("kiev");
    expect(expandTerm("kiev")).toContain("kyiv");
    expect(expandTerm("minced")).toContain("mince");
    expect(expandTerm("mince")).toContain("minced");
    for (const w of ["houmous", "hummus", "humous"]) for (const v of ["houmous", "hummus", "humous"]) expect(expandTerm(w)).toContain(v);
    expect(expandTerm("chilli")).toContain("chili");
    expect(expandTerm("chili")).toContain("chilli");
    expect(expandTerm("wholemeal")).toContain("whole wheat");
    expect(expandTerm("whole wheat")).toContain("wholemeal");
  });

  test("tikka has no variants", () => {
    expect(expandTerm("tikka")).toEqual(["tikka"]);
  });

  test("a typed plural also searches the singular", () => {
    expect(expandTerm("sausages")).toEqual(["sausages", "sausage"]);
    expect(expandTerm("prawns")).toContain("prawn");
    expect(expandTerm("crisps")).toContain("crisp");
    expect(singular("berries")).toBe("berry");
    expect(singular("tomatoes")).toBe("tomato");
    expect(singular("sandwiches")).toBe("sandwich");
  });

  test("short words and words that only look plural are left alone", () => {
    expect(singular("peas")).toBe("peas");
    expect(singular("oats")).toBe("oats");
    expect(singular("hummus")).toBe("hummus");
    expect(singular("couscous")).toBe("couscous");
    expect(singular("glass")).toBe("glass");
    expect(expandTerm("hummus")).not.toContain("hummu");
  });

  test("a plural that is also in a spelling group joins both", () => {
    for (const v of ["yoghurts", "yoghurt", "yogurt"]) expect(expandTerm("yoghurts")).toContain(v);
  });

  test("is case-blind", () => {
    expect(expandTerm("PIRI")).toEqual(["piri", "peri"]);
  });

  test("terms: whole wheat stays one term, repeats are dropped, six at most", () => {
    expect(searchTerms("piri piri chicken")).toEqual(["piri", "chicken"]);
    expect(searchTerms("whole wheat bread")).toEqual(["whole wheat", "bread"]);
    expect(searchTerms("a b c d e f g h")).toHaveLength(6);
    expect(searchTerms("   ")).toEqual([]);
  });

  test("piri piri chicken: every word must match one of its spellings", () => {
    const v = searchVariants("piri piri chicken");
    expect(v).toEqual([["piri", "peri"], ["chicken"]]);
  });

  test("greek yoghurt reaches yogurt too", () => {
    expect(searchVariants("greek yoghurt")).toEqual([["greek"], ["yoghurt", "yogurt", "yoghourt"]]);
  });
});
