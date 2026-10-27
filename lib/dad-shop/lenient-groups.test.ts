import { describe, expect, test } from "bun:test";
import { GROUP_NAMES } from "./groups";
import { LENIENT_GROUPS } from "./lenient-groups";

describe("lenient groups", () => {
  test("every name is a real comparison group", () => {
    const unknown = [...LENIENT_GROUPS].filter((g) => !GROUP_NAMES.has(g));
    expect(unknown).toEqual([]);
  });

  test("the list has the pipeline's 47 groups", () => {
    expect(LENIENT_GROUPS.size).toBe(47);
    expect(LENIENT_GROUPS.has("pizza")).toBe(true);
    expect(LENIENT_GROUPS.has("butter")).toBe(false);
  });
});
