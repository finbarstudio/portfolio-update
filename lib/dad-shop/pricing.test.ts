import { describe, expect, test } from "bun:test";
import { nowPence, offerLabel, priceList, priceView, readPromo, type PricedRow } from "./pricing";
import type { DealLink, Promo } from "./types";

const NOW = new Date("2026-10-26T12:00:00Z");

function promo(over: Partial<Promo>): Promo {
  return { uid: "p1", text: "", kind: "other", nectar: true, start: "2026-10-01", end: "2026-12-01", ...over };
}

function row(id: number, qty: number, price: number, promos: Promo[], extra: Partial<PricedRow["item"]> = {}): PricedRow {
  return { id, qty, item: { price, nectarPrice: null, promos, ...extra } };
}

const anyTwoForTwo = promo({ uid: "any2", text: "Buy any 2 for £2.00 with Nectar", kind: "multibuy", qty: 2, dealPrice: 2, mixMatch: true });

describe("readPromo", () => {
  test("reads the real Sainsbury's wordings the old rows left as 'other'", () => {
    expect(readPromo(promo({ text: "Buy 1 for 1.7" }))).toMatchObject({ kind: "price_cut", dealPrice: 1.7 });
    expect(readPromo(promo({ text: "Buy 1 for £1.70" }))).toMatchObject({ kind: "price_cut", dealPrice: 1.7 });
    expect(readPromo(promo({ text: "Save 25% with Nectar" }))).toMatchObject({ kind: "price_cut", savePct: 25 });
    expect(readPromo(promo({ text: "Save 1/3 with Nectar" })).savePct).toBeCloseTo(33.33, 2);
    expect(readPromo(promo({ text: "Buy any 2 for £2.00 with Nectar" }))).toMatchObject({ kind: "multibuy", qty: 2, dealPrice: 2, mixMatch: true });
    expect(readPromo(promo({ text: "Buy 3 get cheapest 1 free with Nectar" }))).toMatchObject({ kind: "multibuy", qty: 3, getFree: 1, mixMatch: true });
    expect(readPromo(promo({ text: "Buy any 3 or more save 20% with Nectar" }))).toMatchObject({ kind: "multibuy", qty: 3, savePct: 20 });
    expect(readPromo(promo({ text: "Half Price with Nectar" }))).toMatchObject({ kind: "price_cut", savePct: 50 });
  });

  test("a dinner meal deal is never a price cut", () => {
    const m = readPromo(promo({ text: "Meal Deal for £15.00 with Nectar", kind: "price_cut" }));
    expect(m.kind).toBe("mealdeal");
    expect(m.dealPrice).toBe(15);
  });

  test("fields that are already there win over the wording", () => {
    const m = readPromo(promo({ text: "Buy any 2 for £2.00", kind: "multibuy", qty: 2, dealPrice: 1.8 }));
    expect(m.dealPrice).toBe(1.8);
  });
});

describe("single price (Nectar taken as read)", () => {
  test("uses the cheapest of shelf, offer price, Nectar price and a running price cut", () => {
    expect(nowPence({ price: 2.2, nectarPrice: null, promos: [] }, NOW)).toBe(220);
    expect(nowPence({ price: 2.2, nectarPrice: 1.9, promos: [] }, NOW)).toBe(190);
    expect(nowPence({ price: 2.2, nectarPrice: null, offerPrice: 1.75, promos: [] }, NOW)).toBe(175);
    expect(nowPence({ price: 2.2, nectarPrice: null, promos: [promo({ text: "Buy 1 for 1.7" })] }, NOW)).toBe(170);
    expect(nowPence({ price: 2, nectarPrice: null, promos: [promo({ text: "Save 25% with Nectar" })] }, NOW)).toBe(150);
  });

  test("an offer that has ended is ignored", () => {
    const old = promo({ text: "Buy 1 for 1.7", end: "2026-10-01" });
    expect(nowPence({ price: 2.2, nectarPrice: null, promos: [old] }, NOW)).toBe(220);
  });

  test("priceView says when the cut is a Nectar one", () => {
    const v = priceView({ price: 2.2, nectarPrice: null, promos: [promo({ text: "Buy 1 for 1.7" })] }, NOW);
    expect(v).toMatchObject({ nowPence: 170, fullPence: 220, cut: true, nectar: true });
    const plain = priceView({ price: 2.2, nectarPrice: null, promos: [] }, NOW);
    expect(plain.cut).toBe(false);
  });
});

describe("priceList", () => {
  test("any 2 for £2 mixes two different products", () => {
    const p = priceList([row(1, 1, 1.5, [anyTwoForTwo]), row(2, 1, 1.2, [anyTwoForTwo])], NOW);
    expect(p.total).toBe(200);
    expect(p.full).toBe(270);
    expect(p.groups).toHaveLength(1);
    expect(p.groups[0]).toMatchObject({ uid: "any2", have: 2, need: 0, unlocked: true, total: 200, full: 270, saving: 70, letter: "A", size: 2 });
    expect(p.groupOfRow.get(1)).toBe("any2");
    expect(p.groupOfRow.get(2)).toBe("any2");
  });

  test("a partial set is priced at the single price and asks for one more", () => {
    const p = priceList([row(1, 1, 1.5, [anyTwoForTwo])], NOW);
    expect(p.total).toBe(150);
    expect(p.groups[0]).toMatchObject({ have: 1, need: 1, unlocked: false, saving: 0 });
  });

  test("three units: one full set plus the cheapest left over at the single price", () => {
    const p = priceList([row(1, 2, 1.5, [anyTwoForTwo]), row(2, 1, 1.2, [anyTwoForTwo])], NOW);
    // dearest two make the set (£2.00), the £1.20 one is left over
    expect(p.total).toBe(320);
    expect(p.groups[0]).toMatchObject({ have: 3, need: 1, unlocked: false });
  });

  test("a set that costs more than buying one by one is not used", () => {
    const cheap = promo({ uid: "x", kind: "multibuy", qty: 2, dealPrice: 3, text: "Buy 2 for £3.00" });
    const p = priceList([row(1, 2, 1.0, [cheap])], NOW);
    expect(p.total).toBe(200);
  });

  test("buy 3 get the cheapest free, across products", () => {
    const free = promo({ uid: "free3", text: "Buy 3 get cheapest 1 free with Nectar", kind: "multibuy", qty: 3, getFree: 1, mixMatch: true });
    const p = priceList([row(1, 1, 3, [free]), row(2, 1, 2, [free]), row(3, 1, 1, [free])], NOW);
    expect(p.total).toBe(500);
    expect(p.full).toBe(600);
    expect(p.groups[0]).toMatchObject({ unlocked: true, need: 0, saving: 100 });
  });

  test("buy 3 get cheapest free with only 2 pays full", () => {
    const free = promo({ uid: "free3", text: "Buy 3 get cheapest 1 free", kind: "multibuy", qty: 3, getFree: 1 });
    const p = priceList([row(1, 1, 3, [free]), row(2, 1, 2, [free])], NOW);
    expect(p.total).toBe(500);
    expect(p.groups[0]).toMatchObject({ need: 1, unlocked: false });
  });

  test("two sets of buy 3 get cheapest free take the dearest three together", () => {
    const free = promo({ uid: "free3", text: "Buy 3 get cheapest 1 free", kind: "multibuy", qty: 3, getFree: 1 });
    const p = priceList([row(1, 6, 2, [free])], NOW);
    expect(p.total).toBe(800);
  });

  test("save 20% when you buy 3 or more", () => {
    const pct = promo({ uid: "pct", text: "Buy any 3 or more save 20% with Nectar", kind: "multibuy", qty: 3, savePct: 20 });
    const two = priceList([row(1, 2, 2, [pct])], NOW);
    expect(two.total).toBe(400);
    expect(two.groups[0].need).toBe(1);
    const three = priceList([row(1, 2, 2, [pct]), row(2, 1, 2, [pct])], NOW);
    expect(three.total).toBe(480);
    expect(three.groups[0]).toMatchObject({ unlocked: true, saving: 120 });
  });

  const dine: DealLink[] = [
    {
      id: "dine",
      title: "Taste the Difference Dine In",
      price: 15,
      listId: 1,
      parts: [
        { listId: 1, label: "Main", qty: 1 },
        { listId: 2, label: "Side", qty: 1 },
        { listId: 3, label: "Dessert", qty: 1 },
        { listId: 4, label: "Wine", qty: 1 },
      ],
    },
  ];
  const dealPromo = promo({ uid: "dine", text: "Meal Deal for £15.00 with Nectar", kind: "mealdeal", dealPrice: 15 });
  const part = (listId: number): DealLink[] => dine.map((d) => ({ ...d, listId }));

  test("a meal deal bundle needs every part", () => {
    const rows = [
      row(1, 1, 6, [dealPromo], { deals: part(1) }),
      row(2, 1, 4, [dealPromo], { deals: part(2) }),
      row(3, 1, 4, [dealPromo], { deals: part(3) }),
      row(4, 1, 10, [dealPromo], { deals: part(4) }),
    ];
    const p = priceList(rows, NOW);
    expect(p.total).toBe(1500);
    expect(p.full).toBe(2400);
    expect(p.groups[0]).toMatchObject({ kind: "mealdeal", label: "Taste the Difference Dine In", unlocked: true, need: 0, saving: 900, size: 4 });
    expect(p.groups[0].partsText).toBe("1 Main + 1 Side + 1 Dessert + 1 Wine");
  });

  test("a meal deal with a part missing is priced item by item and says what is missing", () => {
    const rows = [
      row(1, 1, 6, [dealPromo], { deals: part(1) }),
      row(2, 1, 4, [dealPromo], { deals: part(2) }),
      row(3, 1, 4, [dealPromo], { deals: part(3) }),
    ];
    const p = priceList(rows, NOW);
    expect(p.total).toBe(1400);
    expect(p.groups[0]).toMatchObject({ unlocked: false, need: 1, saving: 0 });
  });

  test("a meal deal whose parts are not known is never priced as a bundle", () => {
    const rows = [row(1, 1, 6, [dealPromo]), row(2, 1, 4, [dealPromo]), row(3, 1, 4, [dealPromo])];
    const p = priceList(rows, NOW);
    expect(p.total).toBe(1400);
    expect(p.groups).toHaveLength(0);
  });

  test("two mains do not make up for a missing wine", () => {
    const rows = [
      row(1, 2, 6, [dealPromo], { deals: part(1) }),
      row(2, 1, 4, [dealPromo], { deals: part(2) }),
      row(3, 1, 4, [dealPromo], { deals: part(3) }),
    ];
    expect(priceList(rows, NOW).total).toBe(2000);
  });

  test("each row shows its share of the group, and the shares add up exactly", () => {
    const rows = [row(1, 1, 1.5, [anyTwoForTwo]), row(2, 1, 1.2, [anyTwoForTwo]), row(3, 1, 1.1, [anyTwoForTwo])];
    const p = priceList(rows, NOW);
    let sum = 0;
    for (const r of rows) sum += p.lines.get(r.id)!.cost;
    expect(sum).toBe(p.total);
    // shared by usual price: 1.50 gets the biggest share of the group
    expect(p.lines.get(1)!.cost).toBeGreaterThan(p.lines.get(2)!.cost);
    expect(p.lines.get(2)!.cost).toBeGreaterThan(p.lines.get(3)!.cost);
    expect(p.lines.get(1)!.full).toBe(150);
  });

  test("a product cheaper than the set price per item stays out of the group", () => {
    const p = priceList([row(1, 1, 1.5, [anyTwoForTwo]), row(2, 1, 0.9, [anyTwoForTwo])], NOW);
    expect(p.groups[0].rowIds).toEqual([1]);
    expect(p.total).toBe(240);
  });

  test("single items use the Nectar price and are not grouped", () => {
    const p = priceList([row(1, 2, 2.2, [promo({ text: "Buy 1 for 1.7" })])], NOW);
    expect(p.total).toBe(340);
    expect(p.full).toBe(440);
    expect(p.groups).toHaveLength(0);
  });

  test("groups are lettered in the order products were added", () => {
    const other = promo({ uid: "other", text: "Buy any 3 for £5", kind: "multibuy", qty: 3, dealPrice: 5 });
    const p = priceList([row(1, 1, 2, [other]), row(2, 1, 1.5, [anyTwoForTwo])], NOW);
    expect(p.groups.map((g) => [g.uid, g.letter])).toEqual([
      ["other", "A"],
      ["any2", "B"],
    ]);
  });

  test("wording is tidied for the list", () => {
    expect(offerLabel(promo({ text: "Buy any 2 for £2.00 with Nectar, £1.20 / ltr" }))).toBe("Any 2 for £2.00");
    expect(offerLabel(promo({ text: "Buy 3 get cheapest 1 free with Nectar" }))).toBe("Buy 3 get cheapest 1 free");
    expect(offerLabel(promo({ text: "Buy 1 for 1.7" }))).toBe("£1.70 with Nectar");
  });
});
