import { describe, expect, test } from "bun:test";
import { generateBasket, slotsOf, type BasketDeal, type BasketInput, type Candidate } from "./basket";
import { buildTaste } from "./taste";
import { DEFAULT_SETTINGS, type BasketItem, type Promo } from "./types";

const NOW = new Date("2026-10-26T12:00:00Z");
const FRESH = "2026-10-24T08:00:00Z";

function cand(id: string, over: Partial<Candidate> = {}): Candidate {
  return {
    id,
    name: `Product ${id}`,
    zone: "Meat & fish",
    department: "Chicken",
    category: `Category ${id}`,
    brand: "Acme",
    price: 2,
    nectarPrice: null,
    packGrams: 480,
    promos: [],
    isAvailable: true,
    isFood: true,
    storage: "ambient",
    protein: 20,
    sat: 1,
    seedOil: "none",
    health: 8,
    listedAt: FRESH,
    hasDetail: true,
    ingredientCount: 1,
    wholeFood: false,
    ...over,
  };
}

function input(candidates: Candidate[], over: Partial<BasketInput> = {}): BasketInput {
  return {
    candidates,
    ratings: {},
    notAtStore: [],
    votes: {},
    settings: { ...DEFAULT_SETTINGS },
    previous: null,
    now: NOW,
    ...over,
  };
}

const DEPTS: { department: string; zone: string; n: number; packGrams: number; price: number; storage: string; protein: number }[] = [
  { department: "Chicken", zone: "Meat & fish", n: 6, packGrams: 640, price: 4.5, storage: "chilled", protein: 23 },
  { department: "Fish & seafood", zone: "Meat & fish", n: 6, packGrams: 240, price: 3.5, storage: "chilled", protein: 19 },
  { department: "Beef", zone: "Meat & fish", n: 4, packGrams: 500, price: 5.5, storage: "chilled", protein: 20 },
  { department: "Meat free", zone: "Meat & fish", n: 4, packGrams: 300, price: 2.2, storage: "chilled", protein: 15 },
  { department: "Eggs", zone: "Chilled food", n: 3, packGrams: 360, price: 2.1, storage: "chilled", protein: 13 },
  { department: "Yogurts", zone: "Chilled food", n: 4, packGrams: 600, price: 1.6, storage: "chilled", protein: 9 },
  { department: "Breakfast cereals", zone: "Food cupboard", n: 3, packGrams: 900, price: 2.4, storage: "ambient", protein: 11 },
  { department: "Fresh soup", zone: "Chilled food", n: 3, packGrams: 600, price: 2.2, storage: "chilled", protein: 5 },
  { department: "Bread", zone: "Bakery", n: 3, packGrams: 800, price: 1.5, storage: "ambient", protein: 9 },
  { department: "Fresh fruit", zone: "Fruit and vegetables", n: 5, packGrams: 900, price: 2, storage: "ambient", protein: 1 },
  { department: "Fresh vegetables", zone: "Fruit and vegetables", n: 5, packGrams: 800, price: 1.6, storage: "ambient", protein: 3 },
  { department: "Milk", zone: "Chilled food", n: 2, packGrams: 2272, price: 1.65, storage: "chilled", protein: 3.5 },
  { department: "Rice", zone: "Food cupboard", n: 2, packGrams: 1000, price: 1.8, storage: "ambient", protein: 7 },
];

/** A week's worth of varied, healthy food across every slot. */
function larder(): Candidate[] {
  const out: Candidate[] = [];
  for (const d of DEPTS) {
    for (let i = 0; i < d.n; i++) {
      out.push(
        cand(`${d.department.slice(0, 3).toLowerCase()}${String(i).padStart(2, "0")}`, {
          department: d.department,
          zone: d.zone,
          category: `${d.department} type ${i % 4}`,
          packGrams: d.packGrams,
          price: Math.round((d.price + i * 0.2) * 100) / 100,
          storage: d.storage,
          protein: d.protein,
          health: 7 + (i % 3) * 0.5,
          wholeFood: d.zone === "Fruit and vegetables",
        }),
      );
    }
  }
  return out;
}

const roomy = { ...DEFAULT_SETTINGS, budget_gbp: 120, max_per_category: 5 };

const multibuy: Promo = {
  uid: "promo-1",
  text: "Buy 2 for £4.00 with Nectar",
  kind: "multibuy",
  nectar: true,
  start: "2026-10-01",
  end: "2026-12-08",
  qty: 2,
  dealPrice: 4,
};

function ids(r: { items: BasketItem[] }): string[] {
  return r.items.map((i) => i.productId);
}

describe("generateBasket", () => {
  test("never exceeds the budget, and the lines add up to the total", () => {
    for (const budget of [1, 4, 10, 25, 60, 150]) {
      const result = generateBasket(input(larder(), { settings: { ...DEFAULT_SETTINGS, budget_gbp: budget } }));
      expect(result.total).toBeLessThanOrEqual(budget);
      const sum = result.items.reduce((s, i) => s + Math.round(i.lineTotal * 100), 0);
      expect(sum).toBe(Math.round(result.total * 100));
    }
  });

  test("is deterministic, whatever order the products arrive in", () => {
    const cands = larder();
    const a = generateBasket(input(cands));
    const b = generateBasket(input(cands));
    const c = generateBasket(input([...cands].reverse()));
    expect(JSON.stringify(b)).toBe(JSON.stringify(a));
    expect(JSON.stringify(c)).toBe(JSON.stringify(a));
    expect(a.items.length).toBeGreaterThan(5);
  });

  test("builds a week of food: dinners, breakfasts, lunches, fruit and veg, a few staples", () => {
    const r = generateBasket(input(larder(), { settings: roomy }));
    const bySlot = (slot: string) => r.items.filter((i) => i.slot === slot);
    for (const slot of ["dinner", "breakfast", "lunch", "veg"]) expect(bySlot(slot).length).toBeGreaterThan(0);
    expect(bySlot("staples").length).toBeGreaterThan(0);
    for (const m of r.meals.filter((m) => m.slot !== "staples")) expect(m.have).toBeGreaterThanOrEqual(m.need);
    expect(r.total).toBeLessThanOrEqual(120);
    // Not just oats and pasta: more than one kind of main.
    const mains = new Set(bySlot("dinner").map((i) => r.items.indexOf(i)));
    expect(mains.size).toBeGreaterThan(1);
  });

  test("scales servings with the number of people", () => {
    const one = generateBasket(input(larder(), { settings: { ...roomy, people: 1 } }));
    const two = generateBasket(input(larder(), { settings: { ...roomy, people: 2, budget_gbp: 250 } }));
    expect(two.meals.find((m) => m.slot === "dinner")?.need).toBe(14);
    expect(one.meals.find((m) => m.slot === "dinner")?.need).toBe(7);
    expect(two.proteinG).toBeGreaterThan(one.proteinG);
  });

  test("a week of dinners is never one pack of one thing", () => {
    const r = generateBasket(input(larder(), { settings: roomy }));
    expect(r.items.filter((i) => i.slot === "dinner").length).toBeGreaterThanOrEqual(3);
    expect(r.items.filter((i) => i.slot === "breakfast").length).toBeGreaterThanOrEqual(3);
    // ...but a thin shelf still gets a basket.
    const thin = generateBasket(input(larder().filter((c) => c.id.startsWith("chi0") || c.id.startsWith("fis0")), { settings: roomy }));
    expect(thin.items.length).toBeGreaterThan(0);
  });

  test("no meat dominates the dinners", () => {
    const r = generateBasket(input(larder(), { settings: roomy }));
    const dinners = r.items.filter((i) => i.slot === "dinner");
    const chicken = dinners.filter((i) => i.productId.startsWith("chi"));
    const share = chicken.reduce((s, i) => s + i.qty, 0) / dinners.reduce((s, i) => s + i.qty, 0);
    expect(share).toBeLessThan(0.7);
  });

  test("leaves out seed oils, unnamed veg oil, 1-2 star products, ones not at his store and unchecked ingredients", () => {
    const great = { price: 0.5, protein: 30, health: 9 };
    const cands = [
      ...larder(),
      cand("oil", { ...great, seedOil: "yes" }),
      cand("likely", { ...great, seedOil: "likely" }),
      cand("unknown", { ...great, seedOil: "unknown", health: null }),
      cand("hated", great),
      cand("disliked", great),
      cand("missing", great),
      cand("good", great),
    ];
    const result = generateBasket(input(cands, { ratings: { hated: 1, disliked: 2, good: 5 }, notAtStore: ["missing"], settings: roomy }));
    expect(ids(result)).toContain("good");
    for (const bad of ["oil", "likely", "unknown", "hated", "disliked", "missing"]) expect(ids(result)).not.toContain(bad);
  });

  test("plain fruit and veg with no label are allowed even though their seed oil is unknown", () => {
    const r = generateBasket(input([cand("apple", { department: "Fresh fruit", zone: "Fruit and vegetables", seedOil: "unknown", health: null, wholeFood: true, protein: null, sat: null })]));
    expect(ids(r)).toEqual(["apple"]);
    expect(r.items[0].slot).toBe("veg");
  });

  test("rated products are picked ahead of identical unrated ones", () => {
    const twins = Array.from({ length: 8 }, (_, i) => cand(`twin${i}`, { department: "Chicken", category: "Chicken breast", price: 4 }));
    const r = generateBasket(input(twins, { ratings: { twin5: 5 }, settings: { ...DEFAULT_SETTINGS, max_per_category: 1 } }));
    expect(ids(r)).toEqual(["twin5"]);
    expect(r.items[0].reason).toMatch(/5★/);
  });

  test("never picks what is known not to be at Chislehurst, and prefers what is", () => {
    const base = larder();
    const picked = generateBasket(input(base)).items.map((i) => i.productId);
    expect(picked.length).toBeGreaterThan(5);
    // Everything it picked is now known not to be there: none of it comes back.
    const off = base.map((c) => (picked.includes(c.id) ? { ...c, storeStatus: "no" as const } : c));
    const again = generateBasket(input(off)).items.map((i) => i.productId);
    expect(again.filter((id) => picked.includes(id))).toEqual([]);

    // An identical twin that is on the shelf wins over one nobody knows about.
    const first = base.find((c) => c.id === picked.find((id) => id.startsWith("chi")))!;
    const twin = { ...first, id: "zzz-twin", name: "Twin", storeStatus: "yes" as const };
    const pair = generateBasket(input([...base.filter((c) => c.id !== first.id), { ...first, storeStatus: null }, twin])).items.map((i) => i.productId);
    expect(pair).toContain("zzz-twin");
  });

  test("prices a half-filled multi-buy at the single price, a whole one at the deal price", () => {
    const deal = cand("deal", { price: 2.44, promos: [multibuy], packGrams: 960, protein: 30.6, storage: "ambient" });
    const tight = generateBasket(input([deal], { settings: { ...DEFAULT_SETTINGS, budget_gbp: 3 } }));
    expect(tight.items).toHaveLength(1);
    expect(tight.items[0].qty).toBe(1);
    expect(tight.items[0].lineTotal).toBe(2.44);
    expect(tight.items[0].dealGroup).toBeUndefined();
    expect(tight.total).toBe(2.44);
    const roomier = generateBasket(input([deal], { settings: { ...DEFAULT_SETTINGS, budget_gbp: 10 } }));
    expect(roomier.items[0].qty).toBe(2);
    expect(roomier.items[0].lineTotal).toBe(4);
    expect(roomier.items[0].dealGroup).toBe("promo-1");
    expect(roomier.items[0].reason).toMatch(/On offer: 2 for £4 with Nectar/);
  });

  test("an empty catalogue gives a warning, not an error", () => {
    const result = generateBasket(input([]));
    expect(result.items).toHaveLength(0);
    expect(result.total).toBe(0);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  test("a catalogue where nothing is eligible also warns without throwing", () => {
    const result = generateBasket(input([cand("a", { seedOil: "yes" }), cand("b", { isFood: false }), cand("c", { isAvailable: false })]));
    expect(result.items).toHaveLength(0);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  test("leaves out stale prices (over 14 days) and says so", () => {
    const stale = cand("stale", { listedAt: "2026-10-11T00:00:00Z", price: 0.5 });
    const result = generateBasket(input([cand("fresh"), stale]));
    expect(ids(result)).toContain("fresh");
    expect(ids(result)).not.toContain("stale");
    expect(result.warnings.some((w) => /14 days/.test(w))).toBe(true);
  });

  test("reports the protein target honestly when it can't be reached", () => {
    const r = generateBasket(input(larder(), { settings: { ...DEFAULT_SETTINGS, budget_gbp: 10, protein_g_per_day: 300 } }));
    expect(r.warnings.some((w) => /protein target/.test(w))).toBe(true);
    expect(r.total).toBeLessThanOrEqual(10);
  });

  test("warns when a part of the week can't be covered, and about thin product details", () => {
    const onlyBreakfast = Array.from({ length: 6 }, (_, i) => cand(`e${i}`, { department: "Eggs", category: `Eggs ${i}`, packGrams: 360 }));
    const r = generateBasket(input(onlyBreakfast));
    expect(r.warnings.some((w) => /dinners/.test(w))).toBe(true);
    expect(r.warnings.some((w) => /full details/.test(w))).toBe(true);
  });

  test("learned taste ranks look-alikes of things he loves ahead of the rest", () => {
    const loved = cand("loved", { department: "Chicken", category: "Chicken breast", brand: "Fave" });
    const like = cand("like", { department: "Chicken", category: "Chicken breast", brand: "Other" });
    const other = cand("other", { department: "Chicken", category: "Chicken thighs", brand: "Other" });
    const taste = buildTaste(["a", "b", "c"].map((id) => ({ productId: id, source: "rating" as const, value: 5, category: "Chicken breast", department: "Chicken", brand: "Fave" })));
    const r = generateBasket(input([like, other, loved], { taste, settings: { ...DEFAULT_SETTINGS, max_per_category: 1 }, ratings: { loved: 1 } }));
    expect(ids(r)).toContain("like");
    expect(ids(r)).not.toContain("loved");
  });
});

describe("votes: Yes and No, and regenerating", () => {
  const settings = roomy;

  test("a Yes stays in the next basket and a No is kept out", () => {
    const cands = larder();
    const first = generateBasket(input(cands, { settings }));
    const picked = ids(first);
    const yesIds = picked.slice(0, 2);
    const noIds = picked.slice(2, 4);
    const votes = {
      [yesIds[0]]: { vote: 1 as const, at: NOW.toISOString() },
      [yesIds[1]]: { vote: 1 as const, at: NOW.toISOString() },
      [noIds[0]]: { vote: -1 as const, at: NOW.toISOString() },
      [noIds[1]]: { vote: -1 as const, at: NOW.toISOString() },
    };
    const again = generateBasket(input(cands, { settings, votes, previous: { items: first.items } }));
    for (const y of yesIds) expect(ids(again)).toContain(y);
    for (const n of noIds) expect(ids(again)).not.toContain(n);
    // Refilled: the dropped slots still get covered by something else.
    expect(again.items.length).toBeGreaterThanOrEqual(first.items.length - 4);
    for (const m of again.meals.filter((m) => m.slot !== "staples")) expect(m.have).toBeGreaterThanOrEqual(m.need * 0.7);
    expect(again.total).toBeLessThanOrEqual(settings.budget_gbp);
  });

  test("regenerating many times with the same votes is stable, and always within budget", () => {
    const cands = larder();
    let prev = generateBasket(input(cands, { settings }));
    const votes = { [ids(prev)[0]]: { vote: 1 as const, at: NOW.toISOString() }, [ids(prev)[1]]: { vote: -1 as const, at: NOW.toISOString() } };
    const a = generateBasket(input(cands, { settings, votes, previous: { items: prev.items } }));
    prev = a;
    const b = generateBasket(input(cands, { settings, votes, previous: { items: prev.items } }));
    expect(JSON.stringify(b.items.map((i) => i.productId))).toBe(JSON.stringify(a.items.map((i) => i.productId)));
    expect(b.total).toBeLessThanOrEqual(settings.budget_gbp);
  });

  test("a No only keeps a product out for 28 days", () => {
    const only = [cand("x1", { category: "A" })];
    const recent = { x1: { vote: -1 as const, at: "2026-10-10T00:00:00Z" } };
    const old = { x1: { vote: -1 as const, at: "2026-09-20T00:00:00Z" } };
    expect(ids(generateBasket(input(only, { votes: recent })))).toEqual([]);
    expect(ids(generateBasket(input(only, { votes: old })))).toEqual(["x1"]);
  });

  test("a Yes is kept even when it would no longer pass the health rule, and the reason says why", () => {
    const meh = cand("meh", { health: 4, department: "Eggs", category: "Eggs meh" });
    const prev: BasketItem = { productId: "meh", qty: 1, unitPrice: 2, lineTotal: 2, reason: "x", slot: "breakfast" };
    const r = generateBasket(input([meh, ...larder()], { settings, votes: { meh: { vote: 1, at: NOW.toISOString() } }, previous: { items: [prev] } }));
    const line = r.items.find((i) => i.productId === "meh");
    expect(line).toBeTruthy();
    expect(line?.reason).toBe("You said yes last time, so it stays");
  });

  test("a Yes that would break the budget is left out with a warning, never overspending", () => {
    const pricey = cand("pricey", { price: 30, department: "Beef", category: "Steak" });
    const prev: BasketItem = { productId: "pricey", qty: 1, unitPrice: 30, lineTotal: 30, reason: "x", slot: "dinner" };
    const r = generateBasket(input([pricey], { settings: { ...DEFAULT_SETTINGS, budget_gbp: 10 }, votes: { pricey: { vote: 1, at: NOW.toISOString() } }, previous: { items: [prev] } }));
    expect(r.total).toBeLessThanOrEqual(10);
    expect(r.items).toHaveLength(0);
    expect(r.warnings.length).toBeGreaterThan(0);
  });

  test("a No teaches: similar products (same kind and brand) are ranked down", () => {
    const loved = cand("a", { category: "Chicken breast", brand: "Acme" });
    const like = cand("b", { category: "Chicken breast", brand: "Acme" });
    const fresh = cand("c", { category: "Chicken breast", brand: "Zed" });
    const taste = buildTaste([{ productId: "z", source: "vote", value: -1, category: "Chicken breast", department: "Chicken", brand: "Acme" }]);
    const r = generateBasket(input([loved, like, fresh], { taste, settings: { ...DEFAULT_SETTINGS, max_per_category: 1 } }));
    expect(ids(r)).toEqual(["c"]);
  });
});

describe("dinner meal deals", () => {
  const deal: BasketDeal = {
    id: "deal1",
    title: "Taste the Difference Dine In",
    price: 10,
    parts: [
      { listId: 1, label: "Main", qty: 1 },
      { listId: 2, label: "Side", qty: 1 },
    ],
    items: [
      { listId: 1, productId: "main1" },
      { listId: 2, productId: "side1" },
    ],
  };
  const main = cand("main1", { department: "Ready meals", zone: "Chilled food", category: "Fish pie", price: 7, packGrams: 400, storage: "chilled" });
  const side = cand("side1", { department: "Fresh vegetables", zone: "Fruit and vegetables", category: "Veg side", price: 5, packGrams: 400, wholeFood: true });

  test("is priced as a bundle when it saves money, and the lines add up to the bundle price", () => {
    const r = generateBasket(input([main, side], { deals: [deal], settings: { ...DEFAULT_SETTINGS, budget_gbp: 20 } }));
    const lines = r.items.filter((i) => i.dealGroup === "deal1");
    expect(lines).toHaveLength(2);
    expect(Math.round(lines.reduce((s, i) => s + i.lineTotal, 0) * 100)).toBe(1000);
    expect(r.total).toBe(10);
    expect(lines[0].reason).toMatch(/Part of Taste the Difference Dine In/);
    expect(lines[0].reason).toMatch(/£10/);
  });

  test("is left alone when it doesn't save anything, or a part has nothing that fits his rules", () => {
    const cheap = { ...deal, price: 12 };
    expect(generateBasket(input([main, side], { deals: [cheap] })).items.some((i) => i.dealGroup === "deal1")).toBe(false);
    const sideBad = { ...side, seedOil: "yes" as const };
    expect(generateBasket(input([main, sideBad], { deals: [deal] })).items.some((i) => i.dealGroup === "deal1")).toBe(false);
  });

  test("never overspends because of a deal", () => {
    const r = generateBasket(input([main, side], { deals: [deal], settings: { ...DEFAULT_SETTINGS, budget_gbp: 6 } }));
    expect(r.total).toBeLessThanOrEqual(6);
  });
});

describe("slotsOf", () => {
  test("reads Sainsbury's sections", () => {
    const base = { name: "x", packGrams: 500 };
    expect(slotsOf({ ...base, department: "Chicken", category: "Chicken breast", zone: "Meat & fish" })).toContain("dinner");
    expect(slotsOf({ ...base, department: "Eggs", category: "Eggs", zone: "Chilled food" })).toEqual(["breakfast", "lunch"]);
    expect(slotsOf({ ...base, department: "Fresh fruit", category: "Apples", zone: "Fruit and vegetables" })).toEqual(["veg"]);
    expect(slotsOf({ ...base, department: "Fresh salad", category: "Salad bags", zone: "Fruit and vegetables" })).toEqual(["veg"]);
    expect(slotsOf({ ...base, department: "Crisps", category: "Crisps", zone: "Snacks" })).toEqual([]);
    expect(slotsOf({ ...base, department: "Canned and tinned food", category: "Tinned tomatoes", zone: "Food cupboard" })).toEqual(["veg"]);
    expect(slotsOf({ ...base, department: "Canned and tinned food", category: "Tinned fish", zone: "Food cupboard", name: "tuna" })).toEqual(["lunch", "dinner"]);
    // A 2kg bag of dried lentils is a cupboard staple, not a lunch or a vegetable.
    expect(slotsOf({ name: "Red Split Lentils 2kg", packGrams: 2000, department: "Canned and tinned food", category: "Pulses and beans", zone: "Food cupboard" })).toEqual(["staples"]);
    expect(slotsOf({ ...base, department: "Cooking ingredients", category: "Gravies", zone: "Food cupboard" })).toEqual([]);
  });
});

describe("foods he doesn't eat", () => {
  const pigs = () => [
    cand("pork1", { proteinMain: "pork", department: "Pork", category: "Pork chops" }),
    cand("pork2", { proteinMain: "pork", department: "Pork", category: "Pork loin" }),
    cand("mixed1", { proteinMain: "mixed meat", department: "Pork", category: "Pork and apple" }),
  ];

  test("pork is left out of the week by default, even when he rated it five stars", () => {
    const r = generateBasket(input([...larder(), ...pigs()], { settings: roomy, ratings: { pork1: 5 } }));
    const ids = r.items.map((i) => i.productId);
    expect(ids).not.toContain("pork1");
    expect(ids).not.toContain("pork2");
  });

  test("mixed meat is not excluded, and turning pork back on brings it back", () => {
    const only = [cand("pork1", { proteinMain: "pork" }), cand("mixed1", { proteinMain: "mixed meat", category: "Mixed" })];
    const off = generateBasket(input(only, { settings: { ...roomy, avoid_proteins: ["pork"] } }));
    expect(off.items.map((i) => i.productId)).toEqual(["mixed1"]);
    const on = generateBasket(input([only[0]], { settings: { ...roomy, avoid_proteins: [] } }));
    expect(on.items.map((i) => i.productId)).toEqual(["pork1"]);
  });

  test("whatever else he lists is left out too", () => {
    const only = [cand("beef1", { proteinMain: "beef", category: "Beef steak" }), cand("fish1", { proteinMain: "salmon", category: "Salmon" })];
    const r = generateBasket(input(only, { settings: { ...roomy, avoid_proteins: ["beef"] } }));
    expect(r.items.map((i) => i.productId)).toEqual(["fish1"]);
  });
});

