import { describe, expect, test } from "bun:test";
import { fitWhyOf, placeOfGroup, toItem, toItemDetail, type ItemExtra } from "./app-catalog";
import type { Promo, ProductCard } from "./types";

const NOW = new Date("2026-10-28T12:00:00Z");
const NO_EXTRA: ItemExtra = { slug: null, nutrition: null, deal: null };

function card(over: Partial<ProductCard> = {}): ProductCard {
  return {
    id: "1001",
    name: "Test Greek Yogurt 500g",
    brand: "Fage",
    imageUrl: null,
    zone: "Chilled food",
    department: "Yogurts",
    category: "Greek yogurt",
    price: 2,
    wasPrice: null,
    offerPrice: null,
    nectarPrice: null,
    promos: [],
    unitPrice: 4,
    unitMeasure: "kg",
    packGrams: 500,
    storage: "chilled",
    seedOil: "none",
    health: 8,
    stars: null,
    fit: 8,
    protein: 10,
    sat: 3,
    ingredientCount: 2,
    upfCount: 0,
    reviewAvg: 4.5,
    reviewCount: 120,
    isNew: false,
    animal: null,
    notAtStore: false,
    storeStatus: "yes",
    storeReason: "On the Chislehurst shelf list.",
    storeStock: null,
    storeStockAt: null,
    productGroup: null,
    proteinMain: "cheese & dairy",
    onList: false,
    isAvailable: true,
    value: 6,
    valueBasis: "kg",
    valuePct: 0.6,
    discount: 0,
    per100Protein: null,
    paidBefore: null,
    isBasic: false,
    vote: null,
    ingredientsSource: null,
    nutritionSource: null,
    kcal: 100,
    folicAcid: false,
    packText: "500g",
    packEst: false,
    upfMarkers: [],
    seedOilsFound: [],
    reasons: ["Short ingredient list (2)"],
    ...over,
  };
}

const multibuy = (over: Partial<Promo> = {}): Promo => ({
  uid: "p1",
  text: "Buy 2 for £5 with Nectar",
  kind: "multibuy",
  nectar: true,
  start: "2020-01-01",
  end: "2099-01-01",
  qty: 2,
  dealPrice: 5,
  ...over,
});

describe("price he pays", () => {
  test("a Nectar price is the best price and says so", () => {
    const i = toItem(card({ price: 2, nectarPrice: 1.5 }), NO_EXTRA, NOW);
    expect(i.best).toEqual({ kind: "price", label: "£1.50 Nectar Price", minQty: 1, unitPrice: 1.5, discount: 0.25 });
    expect(i.regular).toBe(2);
    expect(i.onOffer).toBe(true);
    expect(i.offerShort).toBe("£1.50 Nectar Price");
  });

  test("no offer: no best, not on offer, regular is the shelf price", () => {
    const i = toItem(card({ price: 2 }), NO_EXTRA, NOW);
    expect(i.best).toBeUndefined();
    expect(i.onOffer).toBe(false);
    expect(i.regular).toBe(2);
    expect(i.offers).toEqual([]);
    expect(i.offerShort).toBeUndefined();
  });

  test("a was price lifts regular above the shelf price", () => {
    const i = toItem(card({ price: 1.5, wasPrice: 2 }), NO_EXTRA, NOW);
    expect(i.regular).toBe(2);
  });

  test("a multi-buy that saves is the best, per item", () => {
    const i = toItem(card({ price: 3, promos: [multibuy()] }), NO_EXTRA, NOW);
    expect(i.best?.kind).toBe("multi");
    expect(i.best?.label).toBe("2 for £5");
    expect(i.best?.minQty).toBe(2);
    expect(i.best?.unitPrice).toBe(2.5);
    expect(i.offerShort).toBe("2 for £5");
    expect(i.offers).toEqual(["2 for £5"]);
    expect(i.onOffer).toBe(true);
    expect(i.ends).toBe("2099-01-01");
  });

  test("a multi-buy that does not beat the single price is not the best", () => {
    const i = toItem(card({ price: 2, promos: [multibuy()] }), NO_EXTRA, NOW);
    expect(i.best).toBeUndefined();
  });

  test("protein comparison uses the price he pays", () => {
    const i = toItem(card({ valueBasis: "protein", per100Protein: 1.2 }), NO_EXTRA, NOW);
    expect(i.compare).toEqual({ per: "100g protein", value: 1.2, kind: "protein" });
    const kg = toItem(card({ price: 2, nectarPrice: 1, unitPrice: 4 }), NO_EXTRA, NOW);
    expect(kg.compare).toEqual({ per: "kg", value: 2, kind: "unit" });
  });
});

describe("Chislehurst", () => {
  test("out of stock today means oos, with the reading", () => {
    const i = toItem(card({ storeStatus: "yes", storeStock: "out", storeStockAt: "2026-10-28T09:00:00.000Z" }), NO_EXTRA, NOW);
    expect(i.store).toEqual({ status: "yes", reason: "On the Chislehurst shelf list.", inStock: false, checkedAt: "2026-10-28T09:00:00.000Z" });
    expect(i.oos).toBe(true);
  });

  test("in stock is not oos", () => {
    const i = toItem(card({ storeStock: "in", storeStockAt: "2026-10-28T09:00:00.000Z" }), NO_EXTRA, NOW);
    expect(i.store.inStock).toBe(true);
    expect(i.oos).toBe(false);
  });

  test("a no (his report, or the feed) is oos even with no stock reading", () => {
    const i = toItem(card({ storeStatus: "no", storeReason: "You said it isn't on the shelf here", storeStock: null }), NO_EXTRA, NOW);
    expect(i.store.inStock).toBeNull();
    expect(i.store.status).toBe("no");
    expect(i.oos).toBe(true);
  });

  test("unlikely and unknown both read as unknown: check in store, never not stocked", () => {
    expect(toItem(card({ storeStatus: "unlikely" }), NO_EXTRA, NOW).store.status).toBe("unknown");
    const u = toItem(card({ storeStatus: "unknown", storeReason: null }), NO_EXTRA, NOW);
    expect(u.store).toEqual({ status: "unknown", reason: "", inStock: null, checkedAt: null });
    expect(u.oos).toBe(false);
  });
});

describe("scores", () => {
  test("folic acid is a flag and never moves a score", () => {
    const plain = toItem(card(), NO_EXTRA, NOW);
    const folic = toItem(card({ folicAcid: true }), NO_EXTRA, NOW);
    expect(plain.folic).toBe(false);
    expect(folic.folic).toBe(true);
    expect(folic.health).toBe(plain.health);
    expect(folic.score).toBe(plain.score);
    expect(folic.fitParts).toEqual(plain.fitParts);
  });

  test("score is Best overall with taste neutral, whatever his old stars say", () => {
    // health 8 x 0.6 + value 6 x 0.25 + neutral taste 5 x 0.15
    expect(toItem(card({ health: 8, value: 6 }), NO_EXTRA, NOW).score).toBe(7.05);
    expect(toItem(card({ health: 8, value: 6, stars: 5 }), NO_EXTRA, NOW).score).toBe(7.05);
  });

  test("fit and fitRaw are the objective health score", () => {
    const i = toItem(card({ health: 7.5, fit: 9, stars: 5 }), NO_EXTRA, NOW);
    expect(i.health).toBe(7.5);
    expect(i.fit).toBe(7.5);
    expect(i.fitRaw).toBe(7.5);
  });

  test("fit parts come from the health breakdown (a clean short-label product scores full marks)", () => {
    const i = toItem(card({ protein: 20, kcal: 150, sat: 2, ingredientCount: 2 }), NO_EXTRA, NOW);
    expect(i.fitParts).toEqual({ protein: 10, sat: 10, processing: 10 });
  });

  test("with no nutrition only processing is judged", () => {
    const i = toItem(card({ protein: null, kcal: null, sat: null, ingredientCount: 4 }), NO_EXTRA, NOW);
    expect(i.fitParts.protein).toBeNull();
    expect(i.fitParts.sat).toBeNull();
    expect(i.fitParts.processing).toBe(8);
  });

  test("high sat only counts against processed food", () => {
    const processed = toItem(card({ sat: 7, kcal: 300, ingredientCount: 9, upfMarkers: ["emulsifier"], seedOil: "none" }), NO_EXTRA, NOW);
    expect(processed.highSat).toBe(true);
    const whole = toItem(card({ sat: 7, kcal: 300, isBasic: true }), NO_EXTRA, NOW);
    expect(whole.highSat).toBe(false);
  });

  test("proc is there only when the ingredients were read", () => {
    expect(toItem(card({ ingredientCount: null }), NO_EXTRA, NOW).proc).toBeUndefined();
    expect(toItem(card({ ingredientCount: 5, upfMarkers: ["colour"] }), NO_EXTRA, NOW).proc).toEqual({ count: 5, markers: ["colour"] });
  });
});

describe("category, department, group", () => {
  test("cat and dept come from the group's place in the taxonomy", () => {
    expect(placeOfGroup("protein powder")).toEqual({ cat: "supplements", dept: "supplements" });
    const i = toItem(card({ productGroup: "protein powder", proteinMain: "cheese & dairy" }), NO_EXTRA, NOW);
    expect(i.cat).toBe("supplements");
    expect(i.dept).toBe("supplements");
    expect(i.group).toBe("protein powder");
    expect(i.subtype).toBe("protein powder");
    expect(i.protein).toBe("cheese & dairy");
  });

  test("an unclassified product is other", () => {
    const i = toItem(card({ productGroup: null }), NO_EXTRA, NOW);
    expect(i.cat).toBe("other");
    expect(i.dept).toBe("other");
    expect(i.group).toBeUndefined();
    expect(placeOfGroup("no such group")).toEqual({ cat: "other", dept: "other" });
  });
});

describe("labels and extras", () => {
  test("Taste the Difference is premium, Sainsbury's own range is ownBrand, never both", () => {
    const ttd = toItem(card({ name: "Sainsbury's Taste the Difference Beef Mince 500g", brand: "Sainsbury's" }), NO_EXTRA, NOW);
    expect(ttd.premium).toBe(true);
    expect(ttd.ownBrand).toBe(false);
    const own = toItem(card({ name: "Sainsbury's Beef Mince 5% Fat 500g", brand: "Sainsbury's" }), NO_EXTRA, NOW);
    expect(own.premium).toBe(false);
    expect(own.ownBrand).toBe(true);
    expect(toItem(card(), NO_EXTRA, NOW).ownBrand).toBe(false);
  });

  test("url comes from the slug, frozen from storage, pack protein from the pack", () => {
    const i = toItem(card({ storage: "frozen", protein: 20 }), { slug: "fage-total-5-greek-yogurt-500g", nutrition: null, deal: null }, NOW);
    expect(i.url).toBe("https://www.sainsburys.co.uk/gol-ui/product/fage-total-5-greek-yogurt-500g");
    expect(i.frozen).toBe(true);
    expect(i.packProtein).toBe(100);
    expect(i.proteinPerPound).toBe(50);
    expect(i.protPer100kcal).toBe(20);
    expect(i.nonFood).toBe(false);
  });

  test("n100 maps the nutrition panel (sugars becomes sugar)", () => {
    const i = toItem(card(), { slug: null, nutrition: { basis: "100g", kcal: 97, protein: 9, fat: 5, sat: 3.2, carbs: 4, sugars: 3.9, fibre: 0, salt: 0.1 }, deal: null }, NOW);
    expect(i.n100).toEqual({ kcal: 97, protein: 9, fat: 5, sat: 3.2, carbs: 4, sugar: 3.9, fibre: 0, salt: 0.1 });
    expect(toItem(card(), NO_EXTRA, NOW).n100).toBeUndefined();
  });

  test("a meal deal link rides along", () => {
    const i = toItem(card(), { slug: null, nutrition: null, deal: { id: "d1", title: "Dine In", part: "Main" } }, NOW);
    expect(i.deal).toEqual({ id: "d1", title: "Dine In", part: "Main" });
  });
});

describe("slim catalogue vs product page", () => {
  const nutrition = { basis: "100g" as const, kcal: 97, protein: 9, fat: 5, sat: 3.2, carbs: 4, sugars: 3.9, fibre: 0, salt: 0.1 };

  test("a catalogue item has no ingredients, no fitWhy and no raw nutrition", () => {
    const i = toItem(card(), { slug: "x", nutrition, deal: null }, NOW);
    expect("ingredients" in i).toBe(false);
    expect("fitWhy" in i).toBe(false);
    expect("nutrition" in i).toBe(false);
    expect("history" in i).toBe(false);
    const text = JSON.stringify(i);
    expect(text.includes("fitWhy")).toBe(false);
    expect(text.includes("ingredients")).toBe(false);
  });

  test("the product page adds them", () => {
    const history = [{ on: "2026-10-20", price: 2.1, nectar: null }];
    const d = toItemDetail(card(), { slug: "x", nutrition, deal: null }, { ingredients: "Milk, cream", history }, NOW);
    expect(d.ingredients).toBe("Milk, cream");
    expect(d.nutrition).toEqual(nutrition);
    expect(d.history).toEqual(history);
    expect(d.fitWhy.processing?.length).toBe(1);
    expect(d.id).toBe("1001");
  });

  test("fitWhy carries each part's working, caps and notes", () => {
    const why = fitWhyOf(card({ seedOil: "yes", seedOilsFound: ["sunflower oil"], folicAcid: true }));
    expect(why.protein?.length).toBe(1);
    expect(why.sat?.length).toBe(1);
    expect(why.processing?.length).toBe(1);
    expect(why.caps).toEqual(["Seed oils (sunflower oil) cap it at 3"]);
    expect(why.notes?.length).toBe(1);
  });
});
