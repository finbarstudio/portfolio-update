import { describe, expect, test } from "bun:test";
import {
  LAYOUT_KEY,
  MIN_SIMILAR,
  bestInColumns,
  compareValues,
  parseLayout,
  pickScope,
  scopeLabel,
  offerPill,
  selectSimilar,
  similarScope,
  type Candidate,
  unitText,
  type CompareValues,
  type PoolRow,
} from "./similar";
import type { ProductCard } from "./types";

function card(id: string, over: Partial<ProductCard> = {}): ProductCard {
  return {
    id,
    name: id,
    brand: null,
    imageUrl: null,
    zone: null,
    department: null,
    category: null,
    price: 2,
    wasPrice: null,
    offerPrice: null,
    nectarPrice: null,
    promos: [],
    unitPrice: null,
    unitMeasure: null,
    packGrams: null,
    storage: null,
    seedOil: "none",
    health: 6,
    stars: null,
    fit: 6,
    protein: null,
    sat: null,
    ingredientCount: null,
    upfCount: null,
    reviewAvg: null,
    reviewCount: null,
    isNew: false,
    animal: null,
    notAtStore: false,
    onList: false,
    isAvailable: true,
    value: 5,
    valueBasis: null,
    valuePct: null,
    discount: 0,
    per100Protein: null,
    paidBefore: null,
    isBasic: false,
    vote: null,
    ingredientsSource: null,
    nutritionSource: null,
    kcal: null,
    upfMarkers: [],
    folicAcid: false,
    packText: null,
    packEst: false,
    seedOilsFound: [],
    reasons: [],
    storeStatus: "unknown", storeStock: null, storeStockAt: null,
    storeReason: null,
    productGroup: null,
    proteinMain: null,
    ...over,
  };
}


const NOW = new Date("2026-10-26T10:00:00Z");

function vals(id: string, over: Partial<CompareValues> = {}): CompareValues {
  return { id, unit: null, unitMeasure: null, protein: null, sat: null, satTone: null, ingredients: null, upf: null, ...over };
}

describe("pickScope", () => {
  test("same category and animal when there are enough", () => {
    expect(pickScope({ categoryAnimal: MIN_SIMILAR, category: 30, department: 90 })).toBe("category+animal");
  });
  test("drops the animal when too few share it", () => {
    expect(pickScope({ categoryAnimal: MIN_SIMILAR - 1, category: 12, department: 90 })).toBe("category");
  });
  test("an unknown animal never narrows", () => {
    expect(pickScope({ categoryAnimal: 0, category: 20, department: 90 })).toBe("category");
  });
  test("falls back to the department when the category has fewer than 6 others", () => {
    expect(pickScope({ categoryAnimal: 2, category: MIN_SIMILAR - 1, department: 40 })).toBe("department");
  });
  test("a department is used even when it is small too", () => {
    expect(pickScope({ categoryAnimal: 0, category: 0, department: 3 })).toBe("department");
  });
});

describe("scopeLabel", () => {
  const me = { category: "Chicken breast & fillet", department: "Chicken", animal: "chicken" };
  test("does not repeat the animal when the category already says it", () => {
    expect(scopeLabel("category+animal", me)).toBe("chicken breast & fillet");
  });
  test("adds the animal when the category does not say it", () => {
    expect(scopeLabel("category+animal", { category: "Indian ready meals", department: "Ready meals", animal: "chicken" })).toBe("chicken · indian ready meals");
  });
  test("department scope names the department", () => {
    expect(scopeLabel("department", me)).toBe("chicken");
  });
  test("a group names itself, with the protein when narrowed", () => {
    const g = { category: null, department: null, animal: null, productGroup: "mince" };
    expect(scopeLabel("group", g)).toBe("mince");
    expect(scopeLabel("group", g, null, "beef")).toBe("mince · beef");
  });
  test("says when only the same preparation is compared", () => {
    expect(scopeLabel("category+animal", me, "raw")).toBe("raw chicken breast & fillet");
    expect(scopeLabel("category+animal", me, "cooked")).toBe("cooked chicken breast & fillet");
  });
});

function cand(id: string, name: string, over: Partial<Candidate> = {}): Candidate {
  return { id, name, zone: "Meat & fish", department: "Chicken", category: "Chicken breast & fillet", animal: "chicken", productGroup: null, proteinMain: null, ...over };
}

describe("similarScope", () => {
  const raw = (n: number): Candidate[] => Array.from({ length: n }, (_, i) => cand(`r${i}`, `Sainsbury's British Chicken Breast Fillets ${i}`));
  const cooked = (n: number): Candidate[] => Array.from({ length: n }, (_, i) => cand(`c${i}`, `Sainsbury's Roast Chicken Breast Sliced (Ready to Eat) ${i}`));

  test("raw chicken is never compared with deli chicken", () => {
    const me = cand("me", "Sainsbury's British Chicken Breast Fillets 640g");
    const r = similarScope(me, [me, ...raw(8), ...cooked(8)]);
    expect(r.prep).toBe("raw");
    expect(r.ids.every((i) => i.startsWith("r"))).toBe(true);
    expect(r.ids).toHaveLength(8);
    expect(r.scope).toBe("category+animal");
  });
  test("deli chicken is compared with deli chicken", () => {
    const me = cand("me", "Sainsbury's Roast British Chicken Breast sliced 360g (Ready to Eat)");
    const r = similarScope(me, [me, ...raw(8), ...cooked(7)]);
    expect(r.prep).toBe("cooked");
    expect(r.ids.every((i) => i.startsWith("c"))).toBe(true);
  });
  test("does not include itself", () => {
    const me = cand("me", "Sainsbury's British Chicken Breast Fillets 640g");
    expect(similarScope(me, [me, ...raw(8)]).ids).not.toContain("me");
  });
  test("widens to the department when the category has too few of the same prep", () => {
    const me = cand("me", "Sainsbury's British Chicken Breast Fillets 640g");
    const thighs = Array.from({ length: 9 }, (_, i) => cand(`t${i}`, `Sainsbury's Chicken Thighs ${i}`, { category: "Chicken thighs" }));
    const r = similarScope(me, [me, ...raw(2), ...thighs, ...cooked(5)]);
    expect(r.scope).toBe("department");
    expect(r.ids).toHaveLength(11);
    expect(r.ids.some((i) => i.startsWith("c"))).toBe(false);
  });
  test("prep does not split a non-meat category", () => {
    const yog = (id: string, name: string): Candidate => ({ id, name, zone: "Chilled food", department: "Yogurts", category: "Greek yogurt", animal: null, productGroup: null, proteinMain: null });
    const me = yog("me", "Greek Yogurt Honey Flavoured 500g");
    const all = [me, ...Array.from({ length: 7 }, (_, i) => yog(`y${i}`, `Greek Yogurt Natural ${i}`))];
    const r = similarScope(me, all);
    expect(r.prep).toBeNull();
    expect(r.ids).toHaveLength(7);
  });
  test("a ready meal with chicken is not split by a tikka name", () => {
    const meal = (id: string, name: string) => cand(id, name, { zone: "Chilled food", department: "Ready meals", category: "Indian ready meals" });
    const me = meal("me", "Chicken Tikka Masala 400g");
    const r = similarScope(me, [me, ...Array.from({ length: 7 }, (_, i) => meal(`m${i}`, `Chicken Korma ${i}`))]);
    expect(r.prep).toBeNull();
    expect(r.ids).toHaveLength(7);
  });
});

describe("similarScope with comparison groups", () => {
  const inGroup = (group: string, protein: string | null, n: number, prefix: string): Candidate[] =>
    Array.from({ length: n }, (_, i) => cand(`${prefix}${i}`, `${prefix} product ${i}`, { productGroup: group, proteinMain: protein, category: `cat ${prefix}` }));

  test("similar is the same group and nothing else, across categories", () => {
    const me = cand("me", "Cooked chicken pieces", { productGroup: "cooked chicken pieces & skewers", proteinMain: "chicken", category: "Chicken breast & fillet" });
    const all = [me, ...inGroup("cooked chicken pieces & skewers", "chicken", 5, "a"), ...inGroup("breast & fillets (plain, raw)", "chicken", 9, "b")];
    const r = similarScope(me, all);
    expect(r.scope).toBe("group");
    expect(r.group).toBe("cooked chicken pieces & skewers");
    expect(r.ids).toHaveLength(5);
    expect(r.ids.every((i) => i.startsWith("a"))).toBe(true);
    expect(r.proteins).toEqual([]);
    expect(r.protein).toBeNull();
  });
  test("a small group is shown as it is, never widened to the department", () => {
    const me = cand("me", "Smoked wings", { productGroup: "wings", proteinMain: "chicken" });
    const all = [me, ...inGroup("wings", "chicken", 2, "w"), ...inGroup("breast & fillets (plain, raw)", "chicken", 30, "b")];
    const r = similarScope(me, all);
    expect(r.ids).toHaveLength(2);
    expect(r.scope).toBe("group");
  });
  test("a group of several proteins starts on this product's own", () => {
    const me = cand("me", "Beef mince", { productGroup: "mince", proteinMain: "beef" });
    const all = [me, ...inGroup("mince", "beef", 4, "b"), ...inGroup("mince", "lamb", 3, "l"), ...inGroup("mince", "pork", 2, "p")];
    const r = similarScope(me, all);
    expect(r.protein).toBe("beef");
    expect(r.ids).toHaveLength(4);
    expect(r.proteins).toEqual([
      { protein: "beef", n: 5 },
      { protein: "lamb", n: 3 },
      { protein: "pork", n: 2 },
    ]);
  });
  test("the pills can ask for another protein, or all of them", () => {
    const me = cand("me", "Beef mince", { productGroup: "mince", proteinMain: "beef" });
    const all = [me, ...inGroup("mince", "beef", 4, "b"), ...inGroup("mince", "lamb", 3, "l")];
    expect(similarScope(me, all, "lamb").ids).toHaveLength(3);
    expect(similarScope(me, all, "lamb").protein).toBe("lamb");
    expect(similarScope(me, all, "any").ids).toHaveLength(7);
    expect(similarScope(me, all, "any").protein).toBeNull();
    // a protein that is not in the group is ignored
    expect(similarScope(me, all, "duck & game").protein).toBe("beef");
  });
  test("a product with no group falls back to category and prep", () => {
    const me = cand("me", "Sainsbury's British Chicken Breast Fillets 640g");
    const rawN = Array.from({ length: 8 }, (_, i) => cand(`r${i}`, `Sainsbury's British Chicken Breast Fillets ${i}`));
    const r = similarScope(me, [me, ...rawN]);
    expect(r.group).toBeNull();
    expect(r.prep).toBe("raw");
    expect(r.ids).toHaveLength(8);
  });
});

describe("selectSimilar", () => {
  const rows: PoolRow[] = [
    { id: "a", passes: true, best: 8, score: 8 },
    { id: "me", passes: false, best: 6, score: 6 },
    { id: "c", passes: false, best: 9, score: 9 },
    { id: "d", passes: true, best: 7, score: 7 },
    { id: "e", passes: true, best: 5, score: null },
  ];
  test("keeps this one pinned first even when the filters would hide it", () => {
    const s = selectSimilar(rows, "me");
    expect(s.ids).toEqual(["me", "a", "d", "e"]);
  });
  test("counts what the filters hid, this one never counted as hidden", () => {
    const s = selectSimilar(rows, "me");
    expect(s.total).toBe(5);
    expect(s.hidden).toBe(1);
  });
  test("ranks every product on best overall, whatever the sort or filters", () => {
    const s = selectSimilar(rows, "me");
    expect(s.rank).toBe(4);
    expect(s.ranks.c).toBe(1);
    expect(s.ranks.e).toBe(5);
  });
  test("a score of null sorts last, ties go by id", () => {
    const tie: PoolRow[] = [
      { id: "z", passes: true, best: 1, score: 5 },
      { id: "y", passes: true, best: 1, score: 5 },
      { id: "n", passes: true, best: 1, score: null },
      { id: "me", passes: true, best: 1, score: 9 },
    ];
    expect(selectSimilar(tie, "me").ids).toEqual(["me", "y", "z", "n"]);
  });
  test("with nothing hidden everything shows", () => {
    const all = rows.map((r) => ({ ...r, passes: true }));
    const s = selectSimilar(all, "me");
    expect(s.hidden).toBe(0);
    expect(s.ids).toHaveLength(5);
  });
});

describe("selectSimilar cap", () => {
  test("cuts the long tail and says how many", () => {
    const many: PoolRow[] = Array.from({ length: 10 }, (_, i) => ({ id: `p${i}`, passes: true, best: i, score: i }));
    const s = selectSimilar(many, "p0", 4);
    expect(s.ids).toHaveLength(4);
    expect(s.ids[0]).toBe("p0");
    expect(s.capped).toBe(6);
    expect(s.hidden).toBe(0);
  });
});

describe("offerPill", () => {
  const live = { start: "2026-10-01", end: "2026-11-30", nectar: false };
  test("a multi-buy links to its offer page", () => {
    const p = card("a", { promos: [{ uid: "u1", text: "Any 2 for £4.00", kind: "multibuy", qty: 2, dealPrice: 4, ...live }] });
    const pill = offerPill(p, NOW);
    expect(pill?.text).toBe("Any 2 for £4");
    expect(pill?.href).toContain("/offer/u1");
  });
  test("a meal deal links to the deal, unless already on its page", () => {
    const p = card("a", { promos: [{ uid: "m1", text: "Dinner meal deal", kind: "mealdeal", ...live }] });
    expect(offerPill(p, NOW)?.href).toContain("/meal/m1");
    expect(offerPill(p, NOW, true)).toBeNull();
  });
  test("a plain cut shows its size, nothing shows nothing", () => {
    expect(offerPill(card("a", { discount: 0.24 }), NOW)).toMatchObject({ text: "−24%", href: null, tone: "off" });
    expect(offerPill(card("a"), NOW)).toBeNull();
  });
});

describe("compareValues", () => {
  test("price per kg follows what he pays, not the shelf price", () => {
    const v = compareValues(card("a", { price: 4, nectarPrice: 3, unitPrice: 8, unitMeasure: "kg" }), NOW);
    expect(v.unit).toBe(6);
    expect(unitText(v)).toBe("£6.00/kg");
  });
  test("litres read /l, and each-priced things have no unit price", () => {
    expect(unitText(compareValues(card("a", { price: 2, unitPrice: 1, unitMeasure: "ltr" }), NOW))).toBe("£1.00/l");
    expect(unitText(compareValues(card("b", { price: 2, unitPrice: 1, unitMeasure: "ea" }), NOW))).toBeNull();
  });
  test("a plain food with no label counts as one ingredient", () => {
    expect(compareValues(card("a", { isBasic: true, ingredientCount: null }), NOW).ingredients).toBe(1);
  });
});

describe("bestInColumns", () => {
  const rows: CompareValues[] = [
    vals("a", { unit: 8, unitMeasure: "kg", protein: 20, sat: 1, ingredients: 1, upf: 0 }),
    vals("b", { unit: 6, unitMeasure: "kg", protein: 24, sat: 3, ingredients: 4, upf: 2 }),
    vals("c", { unit: 6, unitMeasure: "kg", protein: 18, sat: null, ingredients: 6, upf: 2 }),
    vals("d", { unit: 2, unitMeasure: "ltr", protein: null, sat: 0.5, ingredients: null, upf: null }),
  ];
  const best = bestInColumns(rows);
  test("cheapest per kg, ties both win, litres are not compared with kilos", () => {
    expect([...best.unit].sort()).toEqual(["b", "c"]);
  });
  test("most protein", () => {
    expect([...best.protein]).toEqual(["b"]);
  });
  test("lowest sat fat ignores unknowns", () => {
    expect([...best.sat]).toEqual(["d"]);
  });
  test("fewest ingredients and UPF markers", () => {
    expect([...best.ingredients]).toEqual(["a"]);
    expect([...best.upf]).toEqual(["a"]);
  });
  test("no highlight when every product is the same, or only one has a value", () => {
    const same = bestInColumns([vals("a", { protein: 10, sat: 2 }), vals("b", { protein: 10, sat: 2 })]);
    expect(same.protein.size).toBe(0);
    expect(same.sat.size).toBe(0);
    expect(bestInColumns([vals("a", { protein: 10 }), vals("b")]).protein.size).toBe(0);
  });
  test("zero protein or zero ingredients are not 'best'", () => {
    const z = bestInColumns([vals("a", { protein: 0, ingredients: 0 }), vals("b", { protein: 0, ingredients: 0 })]);
    expect(z.protein.size).toBe(0);
    expect(z.ingredients.size).toBe(0);
  });
});

describe("parseLayout", () => {
  test("cards unless compare was saved", () => {
    expect(parseLayout(null)).toBe("cards");
    expect(parseLayout("nonsense")).toBe("cards");
    expect(parseLayout("compare")).toBe("compare");
    expect(LAYOUT_KEY.length).toBeGreaterThan(0);
  });
});
