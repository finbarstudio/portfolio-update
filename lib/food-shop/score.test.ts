import { describe, expect, test } from "bun:test";
import { type Offer, type ScoreInput, cardChips, convenienceScore, nutritionScore, priceFor, scoreProduct } from "./score";
import { DEFAULT_SETTINGS, GOAL_PRESETS, type Settings } from "./settings";

// Lancashire Farm Fat Free Natural Yogurt 1kg, as the scorer saw it (his nutrition subscore: 10)
const clubcardOffer: Offer = { kind: "price", label: "£1.60 Clubcard Price", minQty: 1, unitPrice: 1.6, discount: 0.289 };
const yogurt: ScoreInput = {
  id: "281381417",
  name: "Lancashire Farm Fat Free Natural Yogurt 1kg",
  cat: "dairy-eggs",
  regular: 2.25,
  offers: [clubcardOffer],
  best: clubcardOffer,
  onOffer: true,
  packProtein: 50.3,
  n100: { kcal: 48, protein: 5.03, fat: 0.1, sat: 0.05, carbs: 7.3, sugar: 4, salt: 0.18 },
  flags: null,
  ingredients: "Fat Free Yogurt (Milk), Contains Pasteurised Cow's Milk",
  proc: { nova: 1 },
  processing: 9,
  shelf: 3,
  valueParts: { deal: 3, protein: 10, cheap: 10, onOffer: true, fullKg: 2.25, typicalKg: 9.94, ppp: 31.4, typicalPpp: 14.4 },
};

// a Clubcard-only deal that really matters: £5 on the shelf, £3 with a Clubcard
const thighOffer: Offer = { kind: "price", label: "£3 Clubcard Price", minQty: 1, unitPrice: 3, discount: 0.4 };
const thighs: ScoreInput = {
  ...yogurt,
  id: "t1",
  name: "Chicken Thighs 1kg",
  cat: "chicken-turkey",
  regular: 5,
  offers: [thighOffer],
  best: thighOffer,
  packProtein: 100,
  n100: { kcal: 180, protein: 20, fat: 11, sat: 3, carbs: 0, sugar: 0, salt: 0.2 },
  ingredients: null,
  valueParts: { deal: 7, protein: 10, cheap: 9, onOffer: true, fullKg: 5, typicalKg: 5, ppp: 33.3, typicalPpp: 16 },
};

const make = (over: Partial<ScoreInput>): ScoreInput => ({ ...yogurt, ingredients: null, offers: [], best: null, onOffer: false, valueParts: null, ...over });
const settings = (over: Partial<Settings> = {}): Settings => ({ ...DEFAULT_SETTINGS, ...over });
// his settings: protein 2, every watch at 1 (kcal off), the "protein" goal preset
const his = settings({ goal: "protein", ...GOAL_PRESETS.protein });

describe("nutrition", () => {
  test("with his settings the sample yogurt is his 9.5, which rounds to his 10", () => {
    // base 2 + 4.5 protein + 2 sat + 1 salt
    expect(nutritionScore(yogurt, his)).toBeCloseTo(9.5, 5);
    expect(scoreProduct(yogurt, his).parts.nutrition).toBe(10);
  });

  test("less interest in protein lowers a high-protein yogurt, and Fit with it", () => {
    const base = { watch: { sat: 1, salt: 1, sugar: 1, kcal: 0, upf: 1 } } as const;
    const lots = scoreProduct(yogurt, settings({ ...base, protein: 2 }));
    const none = scoreProduct(yogurt, settings({ ...base, protein: 0 }));
    expect(lots.parts.nutrition).toBe(10);
    expect(none.parts.nutrition).toBe(8);
    expect(lots.fit).toBeGreaterThan(none.fit);
  });

  test("watching sat fat harder lowers a high-sat cheese; not watching it ignores the fat", () => {
    const cheese = make({
      name: "Mature Cheddar Cheese 400g",
      n100: { kcal: 400, protein: 25, fat: 33, sat: 21, carbs: 0.1, sugar: 0.5, salt: 1.8 },
      processing: 6,
      shelf: 6,
    });
    const watch = { sat: 1, salt: 1, sugar: 1, kcal: 0, upf: 1 } as const;
    const a = scoreProduct(cheese, settings({ watch: { ...watch, sat: 0 } }));
    const b = scoreProduct(cheese, settings({ watch: { ...watch, sat: 2 } }));
    expect(b.parts.nutrition).toBeLessThan(a.parts.nutrition);
    expect(b.fit).toBeLessThan(a.fit);
  });

  test("calories only count when they are watched", () => {
    // protein off keeps the sum under the 10 cap: 5 + 2 sat + 1 salt = 8. 48 kcal/100g is a +1 bonus once watched
    // (bonuses never double); a 450 kcal food is -2 at level 1 and -4 at level 2
    const off = nutritionScore(yogurt, settings({ protein: 0, watch: { ...DEFAULT_SETTINGS.watch, kcal: 0 } }));
    const on = nutritionScore(yogurt, settings({ protein: 0, watch: { ...DEFAULT_SETTINGS.watch, kcal: 2 } }));
    expect(off).toBeCloseTo(8, 5);
    expect(on).toBeCloseTo(9, 5);
    const dense = { ...yogurt, n100: { ...yogurt.n100, kcal: 450 } } as ScoreInput;
    const bit = nutritionScore(dense, settings({ protein: 0, watch: { ...DEFAULT_SETTINGS.watch, kcal: 1 } }));
    const lot = nutritionScore(dense, settings({ protein: 0, watch: { ...DEFAULT_SETTINGS.watch, kcal: 2 } }));
    expect(lot).toBeLessThan(bit);
  });

  test("a sauce never scores above 6 and coffee is neutral", () => {
    const sauce = make({ name: "Tomato Ketchup", cat: "sauces", n100: { kcal: 100, protein: 1, sugar: 4, salt: 0.5, sat: 0.1 } });
    expect(nutritionScore(sauce, his)).toBe(6);
    expect(nutritionScore(make({ name: "Ground Coffee", cat: "coffee", n100: null }), his)).toBe(6);
  });

  test("no label yet falls back to the typical score for the kind of food", () => {
    expect(nutritionScore(make({ name: "Chicken Pieces", cat: "chicken-turkey", n100: null }), his)).toBe(6);
    expect(nutritionScore(make({ name: "Chocolate Cake", cat: "treats", n100: null }), his)).toBe(1);
    expect(nutritionScore(make({ name: "Fusilli", cat: "pasta", n100: null }), his)).toBe(3);
  });
});

describe("convenience follows the kitchen", () => {
  const nuggets = make({ name: "Chicken Nuggets", cat: "chicken-turkey", n100: null, flags: { airfry: true, fromFrozen: true } });

  test("no air fryer, no air fryer bonus", () => {
    expect(convenienceScore(nuggets, settings({ appliances: ["airfryer", "oven"] }))).toBe(7); // 2 + 3 airfry + 2 from frozen
    expect(convenienceScore(nuggets, settings({ appliances: ["oven"] }))).toBe(4); // 2 + 2 from frozen
    expect(convenienceScore(nuggets, settings({ appliances: ["hob"] }))).toBe(2);
  });

  test("a microwave flag only counts for someone with a microwave", () => {
    const meal = make({ name: "Chicken Nuggets", cat: "chicken-turkey", n100: null, flags: { microwave: true } });
    expect(convenienceScore(meal, settings({ appliances: ["microwave"] }))).toBe(4);
    expect(convenienceScore(meal, settings({ appliances: ["oven"] }))).toBe(2);
  });

  test("ready meals suit people who want minimal cooking more", () => {
    const meal = make({ name: "Chicken Tikka Masala", cat: "ready-meal", n100: null });
    expect(convenienceScore(meal, settings({ cooking: "ready" }))).toBeGreaterThan(convenienceScore(meal, settings({ cooking: "scratch" })));
  });
});

describe("price and value with and without a Clubcard", () => {
  test("with a Clubcard they pay the offer", () => {
    expect(priceFor(thighs, settings())).toEqual({ unitPrice: 3, offer: thighOffer, clubcardOnly: true });
  });

  test("without one a Clubcard-only deal is ignored and they pay the shelf price", () => {
    expect(priceFor(thighs, settings({ clubcard: false }))).toEqual({ unitPrice: 5, offer: null, clubcardOnly: true });
  });

  test("without one they get the cheapest offer that is left", () => {
    const multi: Offer = { kind: "multi", label: "2 for £8", minQty: 2, unitPrice: 4, discount: 0.2 };
    const both = { ...thighs, offers: [thighOffer, multi] };
    expect(priceFor(both, settings({ clubcard: false })).offer).toEqual(multi);
    expect(priceFor(both, settings({ clubcard: false })).unitPrice).toBe(4);
  });

  test("no offers at all is just the shelf price", () => {
    expect(priceFor(make({ regular: 1.2 }), settings({ clubcard: false }))).toEqual({ unitPrice: 1.2, offer: null, clubcardOnly: false });
    expect(priceFor(make({ regular: null }), settings())).toEqual({ unitPrice: null, offer: null, clubcardOnly: false });
  });

  test("dropping a Clubcard-only deal lowers value", () => {
    // on: .15 * 7 + .5 * 10 + .35 * 9 = 9.2. off: protein per £ falls to 20 (7), £/kg is typical (5): .6 * 7 + .4 * 5 = 6.2
    expect(scoreProduct(thighs, settings()).value).toBe(9);
    expect(scoreProduct(thighs, settings({ clubcard: false })).value).toBe(6);
  });

  test("a product with no Clubcard deal is the same either way", () => {
    const plain = { ...thighs, offers: [], best: null, onOffer: false, valueParts: { ...thighs.valueParts, deal: undefined, onOffer: false } };
    expect(scoreProduct(plain, settings({ clubcard: false })).value).toBe(scoreProduct(plain, settings()).value);
  });

  test("the sample yogurt keeps its stored value with a Clubcard", () => {
    expect(scoreProduct(yogurt, settings()).value).toBe(9); // .15 * 3 + .5 * 10 + .35 * 10 = 8.95
  });

  test("the goal changes what value rewards", () => {
    const protein = scoreProduct(thighs, settings({ goal: "protein" })).value;
    const cheap = scoreProduct(thighs, settings({ goal: "cheap" })).value;
    expect(protein).toBeGreaterThanOrEqual(cheap); // protein 10 outweighs cheap 9
  });

  test("a product with no value inputs is a neutral 5", () => {
    expect(scoreProduct(make({}), settings()).value).toBe(5);
  });

  test("protein powder is judged against the powder market, scaled to the price they pay", () => {
    const deal: Offer = { kind: "price", label: "£20 Clubcard Price", unitPrice: 20, discount: 0.33 };
    const powder = make({
      name: "Whey Protein Powder 1kg",
      cat: "supplements",
      regular: 30,
      offers: [deal],
      best: deal,
      onOffer: true,
      packProtein: 800,
      valueParts: { deal: 5, protein: 6, cheap: 5, onOffer: true, market: { typical: 3, mine: 2.5 } },
    });
    expect(scoreProduct(powder, settings()).value).toBe(6); // .25 * 5 + .75 * 6 = 5.75
    expect(scoreProduct(powder, settings({ clubcard: false })).value).toBeLessThan(6);
  });
});

describe("hidden: diet", () => {
  const vegan = settings({ diet: "vegan" });
  const chicken = make({ name: "British Chicken Breast Fillets 650g", cat: "chicken-turkey" });

  test("a vegan never sees yogurt or chicken, and still sees tofu", () => {
    expect(scoreProduct(yogurt, vegan).hidden).toBe(true);
    expect(scoreProduct(chicken, vegan).hidden).toBe(true);
    expect(scoreProduct(make({ name: "Tofu", cat: "veg" }), vegan).hidden).toBe(false);
    expect(scoreProduct(make({ name: "Tofu", cat: "meat" }), vegan).hidden).toBe(false);
  });

  test("a vegan sees plant milks and anything that says vegan", () => {
    expect(scoreProduct(make({ name: "Oat Drink Barista 1L", cat: "dairy-eggs" }), vegan).hidden).toBe(false);
    expect(scoreProduct(make({ name: "Alpro Soya Yogurt Alternative", cat: "dairy-eggs" }), vegan).hidden).toBe(false);
    expect(scoreProduct(make({ name: "Vegan Cheese Slices", cat: "dairy-eggs" }), vegan).hidden).toBe(false);
    expect(scoreProduct(make({ name: "Free Range Eggs 12 Pack", cat: "dairy-eggs" }), vegan).hidden).toBe(true);
    expect(scoreProduct(make({ name: "Honey Roast Peanuts", cat: "nuts-seeds" }), vegan).hidden).toBe(true);
  });

  test("a vegan reads the ingredients when there are some", () => {
    const dark = make({ name: "Dark Chocolate", cat: "treats", ingredients: "Cocoa mass, sugar, cocoa butter, vanilla" });
    const milk = make({ name: "Dark Chocolate", cat: "treats", ingredients: "Cocoa mass, sugar, skimmed milk powder" });
    expect(scoreProduct(dark, vegan).hidden).toBe(false);
    expect(scoreProduct(milk, vegan).hidden).toBe(true);
  });

  test("vegetarians lose meat and fish but keep dairy and eggs", () => {
    const veggie = settings({ diet: "vegetarian" });
    expect(scoreProduct(chicken, veggie).hidden).toBe(true);
    expect(scoreProduct(make({ name: "Salmon Fillets", cat: "fish" }), veggie).hidden).toBe(true);
    expect(scoreProduct(yogurt, veggie).hidden).toBe(false);
    expect(scoreProduct(make({ name: "Jelly Sweets", cat: "treats", ingredients: "Sugar, gelatine, colour" }), veggie).hidden).toBe(true);
    expect(scoreProduct(make({ name: "Meat Free Sausages", cat: "meat" }), veggie).hidden).toBe(false);
    expect(scoreProduct(make({ name: "Mince Pies 6 Pack", cat: "treats" }), veggie).hidden).toBe(false);
  });

  test("pescatarians keep fish", () => {
    const pesc = settings({ diet: "pescatarian" });
    expect(scoreProduct(make({ name: "Salmon Fillets", cat: "fish" }), pesc).hidden).toBe(false);
    expect(scoreProduct(make({ name: "Salmon Steak", cat: "fish" }), pesc).hidden).toBe(false);
    expect(scoreProduct(chicken, pesc).hidden).toBe(true);
  });

  test("a flavour is not the meat", () => {
    expect(scoreProduct(make({ name: "Roast Chicken Flavour Crisps", cat: "treats" }), settings({ diet: "vegetarian" })).hidden).toBe(false);
  });

  test("everything is visible with no diet, and the reason is recorded when hidden", () => {
    expect(scoreProduct(chicken, settings()).hidden).toBe(false);
    expect(scoreProduct(chicken, vegan).hideReason).toMatch(/meat/);
    expect(scoreProduct(chicken, settings()).hideReason).toBeUndefined();
  });
});

describe("hidden: no pork, no beef", () => {
  const noPork = settings({ noPork: true });
  const noBeef = settings({ noBeef: true });
  const item = (name: string, cat = "meat") => make({ name, cat });

  test("no pork hides pork sausages and bacon, keeps chicken sausages", () => {
    expect(scoreProduct(item("Pork Sausages 8 Pack"), noPork).hidden).toBe(true);
    expect(scoreProduct(item("Cumberland Sausages"), noPork).hidden).toBe(true);
    expect(scoreProduct(item("Smoked Bacon Rashers"), noPork).hidden).toBe(true);
    expect(scoreProduct(item("Smoked Bacon"), noPork).hidden).toBe(true);
    expect(scoreProduct(item("Chicken Sausages", "chicken-turkey"), noPork).hidden).toBe(false);
    expect(scoreProduct(item("Vegetarian Sausages"), noPork).hidden).toBe(false);
    expect(scoreProduct(item("Smoked Bacon Flavour Crisps", "treats"), noPork).hidden).toBe(false);
  });

  test("no pork reads the ingredients too", () => {
    expect(scoreProduct(make({ name: "Scotch Egg", cat: "meat", ingredients: "Egg, pork (30%), breadcrumbs" }), noPork).hidden).toBe(true);
  });

  test("no beef hides beef, steak, mince and burgers, keeps fish steaks and other meats", () => {
    expect(scoreProduct(item("Beef Brisket"), noBeef).hidden).toBe(true);
    expect(scoreProduct(item("Ribeye Steak"), noBeef).hidden).toBe(true);
    expect(scoreProduct(item("Beef Mince 5% Fat"), noBeef).hidden).toBe(true);
    expect(scoreProduct(item("Mince 500g"), noBeef).hidden).toBe(true);
    expect(scoreProduct(item("Spaghetti Bolognese", "ready-meal"), noBeef).hidden).toBe(true);
    expect(scoreProduct(item("Salmon Steak", "fish"), noBeef).hidden).toBe(false);
    expect(scoreProduct(item("Cauliflower Steak", "veg"), noBeef).hidden).toBe(false);
    expect(scoreProduct(item("Chicken Burgers", "chicken-turkey"), noBeef).hidden).toBe(false);
    expect(scoreProduct(item("Quorn Mince", "meat"), noBeef).hidden).toBe(false);
    expect(scoreProduct(item("Vegetable Lasagne", "ready-meal"), noBeef).hidden).toBe(false);
    expect(scoreProduct(item("Beef Tomatoes", "veg"), noBeef).hidden).toBe(false);
    expect(scoreProduct(item("Mince Pies 6 Pack", "treats"), noBeef).hidden).toBe(false);
  });

  test("neither setting hides anything when off", () => {
    expect(scoreProduct(item("Pork Sausages"), settings()).hidden).toBe(false);
    expect(scoreProduct(item("Beef Mince"), settings()).hidden).toBe(false);
  });
});

describe("hidden: allergens", () => {
  const peanuts = settings({ allergens: ["peanuts"] });

  test("a may-contain statement hides the product", () => {
    const bar = make({ name: "Seed Bar", cat: "treats", ingredients: "Oats, honey, seeds. May contain peanuts and tree nuts." });
    const r = scoreProduct(bar, peanuts);
    expect(r.hidden).toBe(true);
    expect(r.hideReason).toMatch(/peanuts/);
    expect(scoreProduct(bar, settings({ allergens: ["nuts"] })).hidden).toBe(true);
  });

  test("coconut, nutmeg and butternut are not nuts", () => {
    const curry = make({ name: "Butternut Curry", cat: "ready-meal", ingredients: "Coconut milk, nutmeg, butternut squash, salt" });
    const r = scoreProduct(curry, settings({ allergens: ["peanuts", "nuts", "milk"] }));
    expect(r.hidden).toBe(false);
    expect(r.checkLabel).toBe(false);
  });

  test("plant milks, cocoa butter and peanut butter are not milk", () => {
    const m = settings({ allergens: ["milk"] });
    expect(scoreProduct(make({ name: "Oat Drink", cat: "dairy-eggs", ingredients: "Oats, water, sunflower oil" }), m).hidden).toBe(false);
    expect(scoreProduct(make({ name: "Almond Milk 1L", cat: "dairy-eggs", ingredients: "Water, almonds (2%)" }), m).hidden).toBe(false);
    expect(scoreProduct(make({ name: "Dark Chocolate", cat: "treats", ingredients: "Cocoa mass, sugar, cocoa butter" }), m).hidden).toBe(false);
    expect(scoreProduct(make({ name: "Crunchy Peanut Butter", cat: "treats", ingredients: "Peanuts, salt" }), m).hidden).toBe(false);
    expect(scoreProduct(yogurt, m).hidden).toBe(true);
  });

  test("peanuts and tree nuts are different allergens", () => {
    const almonds = make({ name: "Flaked Almonds", cat: "nuts-seeds", ingredients: "Almonds" });
    expect(scoreProduct(almonds, peanuts).hidden).toBe(false);
    expect(scoreProduct(almonds, settings({ allergens: ["nuts"] })).hidden).toBe(true);
  });

  test("gluten free in the name is fine unless a gluten grain is listed", () => {
    const g = settings({ allergens: ["gluten"] });
    expect(scoreProduct(make({ name: "Gluten Free Penne", cat: "pasta", ingredients: "Maize flour, rice flour, water" }), g).hidden).toBe(false);
    expect(scoreProduct(make({ name: "Gluten Free Penne", cat: "pasta", ingredients: "Maize flour, wheat starch" }), g).hidden).toBe(true);
    expect(scoreProduct(make({ name: "Penne", cat: "pasta", ingredients: "Durum wheat semolina" }), g).hidden).toBe(true);
  });

  test("shellfish, fish, egg, soya and sesame match their ingredients", () => {
    expect(scoreProduct(make({ name: "Stir Fry Sauce", cat: "sauces", ingredients: "Water, soy sauce, sesame oil" }), settings({ allergens: ["soya", "sesame"] })).hidden).toBe(true);
    expect(scoreProduct(make({ name: "Paella", cat: "ready-meal", ingredients: "Rice, prawns, mussels" }), settings({ allergens: ["shellfish"] })).hidden).toBe(true);
    expect(scoreProduct(make({ name: "Paella", cat: "ready-meal", ingredients: "Rice, prawns, mussels" }), settings({ allergens: ["fish"] })).hidden).toBe(false);
    expect(scoreProduct(make({ name: "Pasta", cat: "pasta", ingredients: "Durum wheat, egg" }), settings({ allergens: ["egg"] })).hidden).toBe(true);
  });

  test("no ingredients: hidden if the name gives it away, otherwise check the label", () => {
    const butter = scoreProduct(make({ name: "Smooth Peanut Butter 340g", cat: "treats" }), peanuts);
    expect(butter.hidden).toBe(true);
    const biscuits = scoreProduct(make({ name: "Chocolate Biscuits", cat: "treats" }), peanuts);
    expect(biscuits.hidden).toBe(false);
    expect(biscuits.checkLabel).toBe(true);
  });

  test("an ingredients list that is clear needs no label check, and no allergens never asks", () => {
    expect(scoreProduct(make({ name: "Sugar", cat: "treats", ingredients: "Sugar" }), peanuts).checkLabel).toBe(false);
    expect(scoreProduct(make({ name: "Chocolate Biscuits", cat: "treats" }), settings()).checkLabel).toBe(false);
  });

  test("hidden products still get a fit and a value", () => {
    const r = scoreProduct(yogurt, settings({ diet: "vegan" }));
    expect(r.hidden).toBe(true);
    expect(r.fit).toBeGreaterThanOrEqual(1);
    expect(r.value).toBeGreaterThanOrEqual(1);
  });
});

describe("fit", () => {
  test("stays within 1 to 10, and treats are capped at 3", () => {
    const r = scoreProduct(yogurt, his);
    expect(r.fit).toBeGreaterThanOrEqual(1);
    expect(r.fit).toBeLessThanOrEqual(10);
    expect(scoreProduct({ ...yogurt, cat: "treats", processing: 10, shelf: 10 }, his).fit).toBeLessThanOrEqual(3);
  });

  test("missing neutral subscores count as 5", () => {
    const r = scoreProduct({ ...yogurt, processing: null, shelf: null }, his);
    expect(r.parts.processing).toBe(5);
    expect(r.parts.shelf).toBe(5);
  });
});

describe("card chips", () => {
  const chips = (p: ScoreInput, s: Settings) => cardChips(p, s, scoreProduct(p, s));
  const labels = (p: ScoreInput, s: Settings) => chips(p, s).map((c) => c.label);

  test("only what they care about, at most three, most cared-about first", () => {
    expect(labels(yogurt, settings())).toEqual(["Sat fat 0.05g", "Salt 0.18g", "Sugar 4g"]);
    expect(labels(yogurt, settings({ protein: 2 }))).toEqual(["31g protein/£", "Sat fat 0.05g", "Salt 0.18g"]);
  });

  test("a nutrient they do not mind about gets no chip", () => {
    const s = settings({ protein: 0, watch: { sat: 2, salt: 0, sugar: 0, kcal: 0, upf: 0 } });
    expect(labels(yogurt, s)).toEqual(["Sat fat 0.05g"]);
    expect(chips(yogurt, s)[0]?.tone).toBe("good");
  });

  test("calories show per 100g when watched", () => {
    expect(labels(yogurt, settings({ protein: 0, watch: { sat: 0, salt: 0, sugar: 0, kcal: 2, upf: 0 } }))).toEqual(["48 kcal/100g"]);
  });

  test("tone follows the same bands as the score", () => {
    const rich = make({ n100: { kcal: 400, protein: 25, sat: 21, salt: 1.8, sugar: 20 } });
    const s = settings({ protein: 0, watch: { sat: 1, salt: 1, sugar: 1, kcal: 0, upf: 0 } });
    expect(chips(rich, s).map((c) => c.tone)).toEqual(["bad", "bad", "bad"]);
  });

  test("ultra-processed only for people who mind", () => {
    const upf = make({ proc: { nova: 4 } });
    const mind = settings({ protein: 0, watch: { sat: 0, salt: 0, sugar: 0, kcal: 0, upf: 1 } });
    expect(chips(upf, mind)).toEqual([{ label: "Ultra-processed", tone: "warn" }]);
    expect(chips(upf, settings({ protein: 0, watch: { sat: 0, salt: 0, sugar: 0, kcal: 0, upf: 0 } }))).toEqual([]);
  });

  test("protein per pound uses the price they pay", () => {
    const s = settings({ protein: 1, clubcard: false, watch: { sat: 0, salt: 0, sugar: 0, kcal: 0, upf: 0 } });
    expect(labels(yogurt, s)).toEqual(["22g protein/£"]); // 50.3 / 2.25
  });

  test("check label comes first", () => {
    const s = settings({ allergens: ["peanuts"] });
    const p = make({ name: "Chocolate Biscuits", cat: "treats", n100: yogurt.n100 });
    const out = chips(p, s);
    expect(out[0]).toEqual({ label: "Check label", tone: "warn" });
    expect(out).toHaveLength(3);
  });
});

describe("labels as scraped", () => {
  const vegan: Settings = { ...DEFAULT_SETTINGS, diet: "vegan" };
  test("allergens in _underscores_ still count", () => {
    const uht = { ...yogurt, id: "254277997", name: "Tesco British Skimmed Longlife Uht Milk 1 Litre", ingredients: "UHT skimmed _milk_." };
    expect(scoreProduct(uht, vegan).hidden).toBe(true);
    expect(scoreProduct(uht, { ...DEFAULT_SETTINGS, allergens: ["milk"] }).hidden).toBe(true);
  });
  test("a list in another language still hides by name and category", () => {
    const fr = { ...yogurt, id: "256659600", name: "Delamere Skimmed Sterilised Milk 1 Litre", ingredients: "_Lait_ écrémé" };
    expect(scoreProduct(fr, vegan).hidden).toBe(true);
  });
  test("plant drinks stay for vegans", () => {
    const oat = { ...yogurt, id: "1", name: "Oatly Semi Oat Drink Chilled 1L", ingredients: "Water, oats 10%, rapeseed oil, calcium carbonate, salt" };
    expect(scoreProduct(oat, vegan).hidden).toBe(false);
  });
});

describe("Clubcard wording", () => {
  test("'CC £3 MEAL DEAL' counts as a Clubcard offer", () => {
    const pasta = { ...yogurt, id: "2", name: "Napolina Orzo Pasta 500g", regular: 1.5, offers: [{ kind: "unknown", label: "CC £3 MEAL DEAL - Buy 1 Pasta & 1 Stir In", minQty: 1 }], best: null, onOffer: true } as ScoreInput;
    expect(priceFor(pasta, { ...DEFAULT_SETTINGS, clubcard: false }).offer).toBe(null);
  });
});

describe("watching harder", () => {
  test("doubles penalties but not the bonus for being low in it", () => {
    const rings = make({ name: "Tesco Breaded Onion Rings 750G", cat: "ready-meal", n100: { kcal: 285, protein: 6, fat: 12, sat: 1, carbs: 35, sugar: 3.7, fibre: 3.4, salt: 0.42 } });
    const watch = { sat: 1, salt: 1, sugar: 1, kcal: 0, upf: 1 } as const;
    const bit = nutritionScore(rings, settings({ protein: 2, watch }));
    const lot = nutritionScore(rings, settings({ protein: 2, watch: { ...watch, sat: 2 } }));
    expect(lot).toBe(bit);
  });
});

describe("freezing fresh food", () => {
  test("lifts chilled packs that say they can be frozen", () => {
    const mince = make({ name: "Beef Mince 500g", cat: "meat", shelf: 6 });
    const off = scoreProduct(mince, { ...DEFAULT_SETTINGS, buys: { frozen: true, fresh: true, freezeFresh: false } });
    const on = scoreProduct(mince, { ...DEFAULT_SETTINGS, buys: { frozen: true, fresh: true, freezeFresh: true } });
    expect(on.parts.shelf).toBe(8);
    expect(off.parts.shelf).toBe(6);
  });
});
