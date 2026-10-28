import { describe, expect, test } from "bun:test";
import {
  applyBasketOp,
  basketSeed,
  emptyBasket,
  parseBasketOp,
  parseOrderDelete,
  parseOrderPost,
  parseStoreReportPost,
  parseWholeDoc,
  ratingsSeed,
  type BasketDoc,
} from "./app-docs";

const T0 = "2026-10-28T10:00:00.000Z";
const T1 = "2026-10-28T10:05:00.000Z";

function mustOk<T>(r: { ok: true; value: T } | { ok: false; error: string }): T {
  if (!r.ok) throw new Error(r.error);
  return r.value;
}

function mustFail(r: { ok: true; value: unknown } | { ok: false; error: string }): string {
  if (r.ok) throw new Error("expected a failure");
  return r.error;
}

describe("parseBasketOp", () => {
  test("a delta", () => {
    expect(mustOk(parseBasketOp({ id: "123", delta: 1 }))).toEqual({ kind: "delta", id: "123", delta: 1 });
    expect(mustOk(parseBasketOp({ id: "123", delta: -3 }))).toEqual({ kind: "delta", id: "123", delta: -3 });
  });

  test("a tick, on or off", () => {
    expect(mustOk(parseBasketOp({ id: "123", tick: true }))).toEqual({ kind: "tick", id: "123", tick: true });
    expect(mustOk(parseBasketOp({ id: "123", tick: false }))).toEqual({ kind: "tick", id: "123", tick: false });
  });

  test("ids are digit strings", () => {
    mustFail(parseBasketOp({ id: "abc", delta: 1 }));
    mustFail(parseBasketOp({ id: 123, delta: 1 }));
    mustFail(parseBasketOp({ id: "", delta: 1 }));
    mustFail(parseBasketOp({ id: "1".repeat(21), delta: 1 }));
    mustFail(parseBasketOp({ id: "1; drop table products", delta: 1 }));
  });

  test("delta is a whole number, not zero, at most 99 either way", () => {
    mustFail(parseBasketOp({ id: "1", delta: 0 }));
    mustFail(parseBasketOp({ id: "1", delta: 1.5 }));
    mustFail(parseBasketOp({ id: "1", delta: 100 }));
    mustFail(parseBasketOp({ id: "1", delta: -100 }));
    mustFail(parseBasketOp({ id: "1", delta: "2" }));
    mustFail(parseBasketOp({ id: "1" }));
    mustOk(parseBasketOp({ id: "1", delta: 99 }));
    mustOk(parseBasketOp({ id: "1", delta: -99 }));
  });

  test("tick must be a boolean and can't come with a delta", () => {
    mustFail(parseBasketOp({ id: "1", tick: "yes" }));
    mustFail(parseBasketOp({ id: "1", tick: true, delta: 1 }));
  });
});

describe("applyBasketOp", () => {
  const basket: BasketDoc = { items: { "1": 2, "2": 1 }, ticked: { "1": true }, updated: T0 };

  test("adds to a quantity and starts a new item", () => {
    expect(applyBasketOp(basket, { kind: "delta", id: "1", delta: 1 }, T1).items).toEqual({ "1": 3, "2": 1 });
    expect(applyBasketOp(basket, { kind: "delta", id: "9", delta: 2 }, T1).items).toEqual({ "1": 2, "2": 1, "9": 2 });
  });

  test("keeps the tick when the quantity changes, stamps the time, never changes its input", () => {
    const next = applyBasketOp(basket, { kind: "delta", id: "1", delta: 1 }, T1);
    expect(next.ticked).toEqual({ "1": true });
    expect(next.updated).toBe(T1);
    expect(basket.items).toEqual({ "1": 2, "2": 1 });
    expect(basket.updated).toBe(T0);
  });

  test("taking an item to zero removes it and clears its tick", () => {
    const next = applyBasketOp(basket, { kind: "delta", id: "1", delta: -2 }, T1);
    expect(next.items).toEqual({ "2": 1 });
    expect(next.ticked).toEqual({});
  });

  test("below zero stops at zero, and taking from an item that is not there does nothing", () => {
    expect(applyBasketOp(basket, { kind: "delta", id: "2", delta: -5 }, T1).items).toEqual({ "1": 2 });
    expect(applyBasketOp(basket, { kind: "delta", id: "7", delta: -1 }, T1).items).toEqual({ "1": 2, "2": 1 });
  });

  test("a quantity stops at 99", () => {
    const big = applyBasketOp({ items: { "1": 98 }, ticked: {}, updated: T0 }, { kind: "delta", id: "1", delta: 5 }, T1);
    expect(big.items).toEqual({ "1": 99 });
  });

  test("ticking sets and clears the tick, and only sticks on an item in the basket", () => {
    expect(applyBasketOp(basket, { kind: "tick", id: "2", tick: true }, T1).ticked).toEqual({ "1": true, "2": true });
    expect(applyBasketOp(basket, { kind: "tick", id: "1", tick: false }, T1).ticked).toEqual({});
    expect(applyBasketOp(basket, { kind: "tick", id: "9", tick: true }, T1).ticked).toEqual({ "1": true });
    expect(applyBasketOp(basket, { kind: "tick", id: "2", tick: true }, T1).items).toEqual({ "1": 2, "2": 1 });
  });

  test("starts from an empty basket", () => {
    expect(applyBasketOp(emptyBasket(T0), { kind: "delta", id: "5", delta: 1 }, T1)).toEqual({ items: { "5": 1 }, ticked: {}, updated: T1 });
  });
});

describe("first-read seeding", () => {
  test("ratings: stars become a 1-10 fit with the product's name", () => {
    const doc = ratingsSeed([
      { product_id: "10", stars: 5, name: "Fage Total 5%", at: T0 },
      { product_id: "11", stars: 2, name: "Plain crisps", at: T1 },
    ]);
    expect(doc).toEqual({
      "10": { fit: 10, name: "Fage Total 5%", at: T0 },
      "11": { fit: 4, name: "Plain crisps", at: T1 },
    });
    expect(ratingsSeed([])).toEqual({});
  });

  test("basket: the unticked list becomes the items, repeated products added up", () => {
    const doc = basketSeed(
      [
        { product_id: "10", qty: 2 },
        { product_id: "11", qty: 1 },
        { product_id: "10", qty: 3 },
      ],
      T0,
    );
    expect(doc).toEqual({ items: { "10": 5, "11": 1 }, ticked: {}, updated: T0 });
    expect(basketSeed([], T0)).toEqual({ items: {}, ticked: {}, updated: T0 });
  });
});

describe("parseWholeDoc", () => {
  test("ratings: digit ids, fit 1 to 10, name and time optional", () => {
    const doc = mustOk(parseWholeDoc("ratings", { "123": { fit: 8, name: "Fage", at: T0 }, "124": { fit: 3 } }));
    expect(doc).toEqual({ "123": { fit: 8, name: "Fage", at: T0 }, "124": { fit: 3, name: "", at: "" } });
  });

  test("ratings: bad ids, out-of-range fits and junk are refused", () => {
    mustFail(parseWholeDoc("ratings", { abc: { fit: 8 } }));
    mustFail(parseWholeDoc("ratings", { "1": { fit: 0 } }));
    mustFail(parseWholeDoc("ratings", { "1": { fit: 11 } }));
    mustFail(parseWholeDoc("ratings", { "1": { fit: "8" } }));
    mustFail(parseWholeDoc("ratings", { "1": 8 }));
    mustFail(parseWholeDoc("ratings", { "1": { fit: 8, name: "x".repeat(201) } }));
  });

  test("removals: digit ids with an object each", () => {
    mustOk(parseWholeDoc("removals", { "5": { reason: "too salty", at: T0 } }));
    mustFail(parseWholeDoc("removals", { x: { reason: "no" } }));
    mustFail(parseWholeDoc("removals", { "5": "no" }));
  });

  test("locks: an offer label with an items map of digit ids and whole quantities", () => {
    mustOk(parseWholeDoc("locks", { "2 for £5": { offer: "2 for £5", lockedAt: T0, items: { "1": 1, "2": 1 } } }));
    mustFail(parseWholeDoc("locks", { "2 for £5": { items: { "1": 0 } } }));
    mustFail(parseWholeDoc("locks", { "2 for £5": { items: { x: 1 } } }));
    mustFail(parseWholeDoc("locks", { "2 for £5": "locked" }));
  });

  test("a document over 512KB is refused", () => {
    const big: Record<string, unknown> = {};
    for (let i = 0; i < 4000; i++) big[String(i)] = { reason: "x".repeat(200) };
    expect(mustFail(parseWholeDoc("removals", big))).toMatch("too big");
  });

  test("an empty document is fine (clearing it)", () => {
    expect(mustOk(parseWholeDoc("locks", {}))).toEqual({});
  });
});

describe("orders", () => {
  test("a good order, with and without fresh", () => {
    const post = mustOk(parseOrderPost({ order: { id: "2026-10-28T10:00:00.000Z", total: 41.2, items: [{ id: "1", qty: 2 }] }, fresh: true }));
    expect(post.fresh).toBe(true);
    expect(post.order.id).toBe("2026-10-28T10:00:00.000Z");
    expect(post.order.total).toBe(41.2);
    expect(mustOk(parseOrderPost({ order: { id: "a1", items: [{}] } })).fresh).toBe(false);
  });

  test("an empty or malformed order is refused", () => {
    expect(mustFail(parseOrderPost({ order: { id: "a1", items: [] } }))).toBe("empty order");
    mustFail(parseOrderPost({ order: { id: "a1" } }));
    mustFail(parseOrderPost({ order: { items: [{}] } }));
    mustFail(parseOrderPost({ order: { id: "bad id!", items: [{}] } }));
    mustFail(parseOrderPost({}));
    mustFail(parseOrderPost({ order: { id: "a1", items: [{}] }, fresh: "yes" }));
    mustFail(parseOrderPost({ order: { id: "a1", items: new Array(301).fill({}) } }));
  });

  test("deleting needs an id", () => {
    expect(mustOk(parseOrderDelete({ id: "a1" }))).toBe("a1");
    mustFail(parseOrderDelete({}));
    mustFail(parseOrderDelete({ id: 5 }));
  });
});

describe("parseStoreReportPost", () => {
  test("found or missing, from a button or a tick", () => {
    expect(mustOk(parseStoreReportPost({ id: "42", status: "found", source: "tick" }))).toEqual({ id: "42", status: "found", source: "tick" });
    expect(mustOk(parseStoreReportPost({ id: "42", status: "missing", source: "button" })).source).toBe("button");
  });

  test("source defaults to button; everything else is refused", () => {
    expect(mustOk(parseStoreReportPost({ id: "42", status: "missing" })).source).toBe("button");
    mustFail(parseStoreReportPost({ id: "x", status: "found" }));
    mustFail(parseStoreReportPost({ id: "42", status: "maybe" }));
    mustFail(parseStoreReportPost({ id: "42", status: "found", source: "robot" }));
  });
});
