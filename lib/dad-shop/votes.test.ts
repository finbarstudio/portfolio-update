import { describe, expect, test } from "bun:test";
import { describeVotes, type VoteRow } from "./votes";

const v = (vote: 1 | -1, department: string | null, category: string | null = null): VoteRow => ({ vote, department, category });

describe("describeVotes", () => {
  test("says nothing before he has voted", () => {
    expect(describeVotes([])).toEqual([]);
  });

  test("says what the No votes taught, in plain words", () => {
    expect(describeVotes([v(-1, "Desserts"), v(-1, "Desserts"), v(-1, "Desserts")])).toEqual(["You said no to 3 desserts, so fewer of those."]);
  });

  test("handles one vote and kinds that are not plural", () => {
    expect(describeVotes([v(-1, "Desserts")])).toEqual(["You said no to 1 of the desserts, so fewer of those."]);
    expect(describeVotes([v(1, "Bread"), v(1, "Bread")])).toEqual(["You said yes to 2 in bread, so a bit more of that."]);
  });

  test("picks the kind he voted on most, and falls back to the category", () => {
    const lines = describeVotes([v(-1, "Cheese"), v(-1, "Desserts"), v(-1, "Desserts"), v(1, null, "Fish fingers"), v(1, "Yogurts")]);
    expect(lines[0]).toBe("You said no to 2 desserts, so fewer of those.");
    expect(lines).toHaveLength(2);
    expect(lines[1]).toMatch(/yes/);
  });
});
