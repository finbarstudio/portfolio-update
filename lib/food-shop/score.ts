/**
 * Per-person Fit and Value. Pure: no server-only, no DB.
 *
 * The scorer on Finbar's machine judges every product once, for him (nutrition, processing, shelf life,
 * convenience, value). The publish script stores the neutral parts of that; this file redoes the parts that
 * depend on the person (what they watch, how they cook, whether they have a Clubcard, what they won't eat)
 * from those stored inputs. The nutrition and value maths mirror scripts/score.ts so a person with his
 * settings gets his numbers; every deviation is a multiplier from their Settings.
 */
import { type Allergen, type Settings, weightsFor } from "./settings";

export interface Offer {
  kind: string;
  label: string;
  minQty?: number | null;
  /** £ per item when the offer applies. */
  unitPrice: number | null;
  /** 0-1 fraction off the shelf price. */
  discount: number | null;
  from?: string | null;
  until?: string | null;
  bundle?: unknown;
}

/** Per 100g. */
export interface Nutrients {
  kcal?: number | null;
  protein?: number | null;
  fat?: number | null;
  sat?: number | null;
  carbs?: number | null;
  sugar?: number | null;
  fibre?: number | null;
  salt?: number | null;
}

export interface MarketRef {
  typical: number;
  mine: number;
}

/** The scorer's value inputs, as stored in products.value_parts. */
export interface ValueParts {
  deal?: number | null;
  protein?: number | null;
  cheap?: number | null;
  onOffer?: boolean;
  fullKg?: number | null;
  typicalKg?: number | null;
  ppp?: number | null;
  typicalPpp?: number | null;
  /** Protein powders: £ per 100g protein vs the UK market. */
  market?: MarketRef | null;
  /** Creatine: £ per kg of creatine vs the UK market. */
  creatineMarket?: MarketRef | null;
}

export interface ScoreInput {
  id: string;
  name: string;
  cat: string;
  /** Shelf price, £. */
  regular: number | null;
  offers: Offer[];
  best: Offer | null;
  onOffer: boolean;
  /** Grams of protein in the whole pack. */
  packProtein: number | null;
  n100: Nutrients | null;
  flags: { airfry?: boolean; fromFrozen?: boolean; microwave?: boolean; oven?: boolean; freezable?: boolean } | null;
  /** null = not scraped yet. */
  ingredients: string | null;
  proc: { nova?: number | null } | null;
  /** Neutral 0-10 subscores from the scorer (no personal avoid rules). */
  processing: number | null;
  shelf: number | null;
  valueParts: ValueParts | null;
}

export interface Scored {
  fit: number;
  value: number;
  hidden: boolean;
  /** Allergens are set but this product has no ingredients list yet, so we can't promise it's safe. */
  checkLabel: boolean;
  parts: { nutrition: number; processing: number; shelf: number; convenience: number };
  hideReason?: string;
}

export interface Chip {
  label: string;
  tone: "good" | "ok" | "bad" | "warn";
}

const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));
// Tesco writes Clubcard deals as "Clubcard Price" and also as "CC £3 MEAL DEAL"
export const CLUBCARD = /clubcard|\bcc\b/i;

// ---------------------------------------------------------------- price

function cheapest(offers: Offer[]): Offer | null {
  let best: Offer | null = null;
  for (const o of offers) if (o.unitPrice != null && (best == null || o.unitPrice < (best.unitPrice ?? Infinity))) best = o;
  return best;
}

/**
 * The price this person pays. With a Clubcard it is the scraped best offer; without one, every Clubcard
 * offer is ignored and it is the cheapest offer left, else the shelf price. `clubcardOnly` says the
 * headline (best) offer needs a Clubcard, whatever this person has.
 */
export function priceFor(p: ScoreInput, s: Settings): { unitPrice: number | null; offer: Offer | null; clubcardOnly: boolean } {
  const clubcardOnly = p.best != null && CLUBCARD.test(p.best.label);
  const offer = s.clubcard ? (p.best?.unitPrice != null ? p.best : cheapest(p.offers)) : cheapest(p.offers.filter((o) => !CLUBCARD.test(o.label)));
  return { unitPrice: offer?.unitPrice ?? p.regular ?? null, offer, clubcardOnly };
}

// ---------------------------------------------------------------- nutrition

// plain fruit and veg is judged on its own scale unless it has been turned into something else
const PROCESSED_PLANT = /crisps|chips|fries|wedges|hash brown|waffles|roast potatoes|croquettes|in (butter|cheese|sauce)|gratin|dauphinoise|pie|fritters|bites|dried|juice|smoothie/i;
const OILY_FISH = /salmon|mackerel|sardines?|trout|herring|anchov|kippers?|pilchards?/i;
const FISH_COATED = /battered|breaded|fishcakes?|pie|en croute/i;
const CARB_CATS = ["loaves", "wraps", "bread", "pasta", "rice", "noodles", "cereal", "crackers", "flour", "carbs"];
// no nutrition label yet: a typical score for the kind of food
const CAT_ESTIMATE: Record<string, number> = { "chicken-turkey": 6, fish: 6, "dairy-eggs": 5, "ready-meal": 5, meat: 4, treats: 1 };

const PROTEIN_MULT = [0, 0.6, 1] as const;

/**
 * 0-10 nutrition for this person, unrounded. Mirrors scripts/score.ts: with protein 2 and every watch
 * level 1 (kcal 0) it gives Finbar's number. Protein level scales the protein points, each watch level
 * scales that nutrient's penalty or bonus (0 = ignore it), and kcal adds a term of its own.
 */
export function nutritionScore(p: ScoreInput, s: Settings): number {
  const cat = p.cat;
  const nv = p.n100;
  const m = PROTEIN_MULT[s.protein];
  const { sat: wSat, salt: wSalt, sugar: wSugar, kcal: wKcal } = s.watch;
  // Watching something harder doubles its penalties, never the reward for not having it: otherwise "sat fat
  // a lot" would lift every low-fat food (onion rings, puddings) above the protein a protein-seeker wants.
  const w = (pts: number, level: number) => pts * (pts > 0 ? Math.min(level, 1) : level);

  // coffee, creatine: nutrition isn't what you buy them for
  if (cat === "coffee" || (cat === "supplements" && !/protein|whey|casein|mass/i.test(p.name))) return 6;

  if (cat === "sauces") {
    // a sauce is a few spoonfuls: judge sugar, salt and sat fat, never protein; harmless, never nourishing
    let x = 6;
    if (nv?.sugar != null) x += w(nv.sugar > 20 ? -2 : nv.sugar > 10 ? -1 : nv.sugar <= 5 ? 1 : 0, wSugar);
    if (nv?.salt != null) x += (nv.salt > 3 ? -2 : nv.salt > 1.5 ? -1 : 0) * wSalt;
    if (nv?.sat != null) x += (nv.sat > 5 ? -2 : nv.sat > 2 ? -1 : 0) * wSat;
    return clamp(Math.min(x, 6), 0, 10);
  }

  if ((cat === "veg" || cat === "fruit") && nv && !PROCESSED_PLANT.test(p.name)) {
    // bought for fibre and micronutrients, not protein: start high, penalise what has been added
    let x = 7;
    if ((nv.fibre ?? 0) >= 3) x += 1;
    if (m > 0 && nv.protein != null && nv.kcal && (nv.protein / nv.kcal) * 100 >= 8) x += 1;
    if (nv.salt != null && nv.salt > 0.6) x += (nv.salt > 1.2 ? -2 : -1) * wSalt;
    if (nv.sat != null && nv.kcal && (nv.sat * 9) / nv.kcal > 0.12) x -= 2 * wSat;
    if (nv.sugar != null && cat === "veg" && nv.sugar > 10) x -= 1 * wSugar;
    return clamp(x, 0, 10);
  }

  if (nv?.protein != null && nv.kcal) {
    const pk = (nv.protein / nv.kcal) * 100;
    const protPts = +clamp((pk - 3) * 0.6, 0, 6).toFixed(1);
    // m = 1 is his "2 + protPts"; less interest in protein pulls it toward a neutral 5
    let x = 5 + (protPts - 3) * m;
    const satShare = nv.sat != null ? (nv.sat * 9) / nv.kcal : 0.08;
    x += w(satShare <= 0.05 ? 2 : satShare <= 0.08 ? 1 : satShare <= 0.12 ? 0 : -2, wSat);
    if (nv.salt != null) x += w(nv.salt <= 0.3 ? 1 : nv.salt <= 1 ? 0 : nv.salt <= 1.5 ? -1 : -2, wSalt);
    if (nv.sugar != null && cat !== "fruit" && cat !== "veg") x += (nv.sugar > 15 ? -2 : nv.sugar > 8 ? -1 : 0) * wSugar;
    x += w(nv.kcal <= 100 ? 1 : nv.kcal <= 250 ? 0 : nv.kcal <= 400 ? -1 : -2, wKcal);
    if ((nv.fibre ?? 0) >= 3) x += 1;
    // oily fish: its fat is mostly omega-3, so the sat-fat share undersells it
    if (cat === "fish" && OILY_FISH.test(p.name) && !FISH_COATED.test(p.name)) x += 1;
    return clamp(x, 0, 10);
  }

  // no usable label yet: typical for the kind of food
  if (cat === "veg" || cat === "fruit") return PROCESSED_PLANT.test(p.name) ? 4 : 7;
  if (CARB_CATS.includes(cat)) return 3;
  return CAT_ESTIMATE[cat] ?? 3;
}

// ---------------------------------------------------------------- convenience

export function convenienceScore(p: ScoreInput, s: Settings): number {
  const f = p.flags;
  const has = (a: Settings["appliances"][number]) => s.appliances.includes(a);
  let c = 2;
  if (f?.airfry && has("airfryer")) c += 3;
  if (f?.fromFrozen && (has("oven") || has("airfryer"))) c += 2;
  if (f?.microwave && has("microwave")) c += 2;
  // someone who cooks from scratch gets half the credit for a ready meal
  if (p.cat === "ready-meal") c += s.cooking === "ready" ? 3 : 1.5;
  if (/stir fry|steam|ready to eat|microwav/i.test(p.name)) c += 2;
  if (p.cat === "dairy-eggs" && /yog|skyr|kvarg|quark|mousse|pot/i.test(p.name)) c += 3;
  return clamp(c, 0, 10);
}

// ---------------------------------------------------------------- what they won't eat

const words = (list: string) => new RegExp(`\\b(?:${list})\\b`, "i");

// "gluten free", "dairy-free"... say what is NOT in it, so they must not trigger a match
const FREE_FROM = /\b(?:gluten|wheat|dairy|milk|lactose|egg|nut|peanut|soya?|fish|sesame|shellfish)[- ]?free\b/g;
// plant milks and butters, cocoa butter, butter beans, cream crackers: not dairy
const NOT_DAIRY =
  /\b(?:coconut|almond|oat|soya?|soy|rice|hazelnut|cashew|pea|hemp|plant|nut)\s+(?:milk|drink|cream|butter|yogh?urt|cheese)\b|\b(?:cocoa|cacao|shea|peanut|almond|cashew|nut)\s*butter\b|\bbutter\s*beans?\b|\bcream of tartar\b|\bcream crackers?\b|\bcreamed coconut\b|\bcoconut (?:milk|cream)\b/g;
// "chicken flavour", "bacon style": a flavouring, not the meat
const FLAVOUR =
  /\b(?:beef|chicken|pork|lamb|bacon|ham|turkey|duck|sausage|steak|meat|fish|prawn|shrimp|crab|salmon|tuna|cheese|egg|honey|milk|cream|butter|yogh?urt)\s+(?:flavou?r(?:ed|ing|s)?|style|seasoning)\b/g;
// beef tomatoes are tomatoes
const BEEF_TOMATO = /\bbeef(?:steak)? tomato(?:es)?\b/g;

const MEAT_FREE = words("vegan|vegetarian|veggie|plant[- ]based|meat[- ]?free|meatless|quorn|jackfruit|seitan|tofu|tempeh|mycoprotein|fakin|no meat");
const VEGAN_NAME = words("vegan|plant[- ]based|dairy[- ]free|non[- ]dairy|alpro|oatly|violife|provamel|tofu|tempeh");
const PLANT_DRINK = /\b(?:soya?|soy|oat|almond|coconut|cashew|hazelnut|pea|rice)\b.*\b(?:milk|drink|yogh?urt|alternative|dessert|cream|custard)\b/i;

const MEAT = words(
  "beef|veal|pork|lamb(?!['\\u2019]s lettuce)|mutton|chicken|turkey|duck|goose|venison|rabbit|ham|bacon|gammon|chorizo|salami|pepperoni|prosciutto|pancetta|mortadella|nduja|jamon|serrano|sausages?|frankfurters?|hot dogs?|mince(?! pies?)|meatballs?|brisket|oxtail|kebabs?|pastrami|biltong|jerky|black pudding|haggis|lard|(?<!vegetable )suet|tallow|gelatine?|dripping|poultry|meat",
);
const STEAK = /\bsteaks?\b/i;
const FISH_STEAK = words("tuna|salmon|cod|haddock|swordfish|halibut|fish|cauliflower|mushroom|portobello");

const FISH_ONLY = "fish|salmon|tuna|cod|haddock|mackerel|sardines?|pilchards?|anchov(?:y|ies)|trout|herring|kippers?|pollock|plaice|hake|halibut|bass|bream|basa|monkfish|swordfish|surimi|isinglass|roe|caviar|taramasalata";
const SHELLFISH = "prawns?|shrimps?|crab(?! apple)|lobster|langoustines?|crayfish|scampi|mussels?|oysters?|scallops?|clams?|squid|calamari|octopus|cockles?|whelks?|krill|crustaceans?|molluscs?|shellfish";
const FISH = words(`${FISH_ONLY}|${SHELLFISH}`);

const DAIRY = "milk|cheese|cheddar|mozzarella|parmesan|feta|halloumi|paneer|mascarpone|ricotta|brie|camembert|butter|buttermilk|ghee|cream|yogh?urts?|skyr|kefir|quark|curd|custard|whey|casein(?:ate)?s?|lactose|dairy|lactoglobulin";
const EGG = "eggs?|albumen|albumin|ovalbumin|lysozyme";
const VEGAN_ANIMAL = words(`${DAIRY}|${EGG}|honey|beeswax|shellac|carmine|cochineal|mayo(?:nnaise)?|aspic`);

const PORK = words("pork|ham|bacon|gammon|chorizo|salami|pepperoni|prosciutto|pancetta|lard|serrano|jamon|nduja|mortadella|black pudding|scratchings|crackling|pigs? in blankets?");
const SAUSAGE = words("sausages?|frankfurters?|hot dogs?|chipolatas?|bangers");
const OTHER_MEAT_FOR_SAUSAGE = words("chicken|turkey|beef|lamb|duck|vegetarian|vegan|veggie|meat[- ]?free|plant");

const BEEF = words("beef|veal|brisket|oxtail|corned|sirloin|ribeye|rib[- ]eye|rump|topside|silverside|bresaola|biltong");
const NOT_BEEF_STEAK = words("tuna|salmon|cod|haddock|swordfish|halibut|fish|cauliflower|mushroom|portobello|veg(?:etables?|etarian|an|gie|gies)?|veggie|quorn|plant|chicken|turkey|pork|lamb|gammon");
const MINCEISH = words("mince(?! pies?)|burgers?|meatballs?|bolognese|lasagne|cottage pie");
const OTHER_MEAT_FOR_MINCE = words("chicken|turkey|pork|lamb|duck|fish|salmon|cod|tuna|prawn|beans?|chickpea|falafel|halloumi|mushroom|veg(?:etables?|etarian|an|gie|gies)?|veggie|quorn|meat[- ]?free|plant|soya?|tofu|lentil|paneer");

/** One matcher per allergen; the product page reuses them to highlight the words in an ingredients list. */
export const ALLERGEN_RE: Record<Allergen, RegExp> = {
  gluten: words("gluten|wheat|barley|rye|spelt|kamut|durum|semolina|couscous|bulgur|farro|triticale|oats?|malt(?:ed)?"),
  milk: words(DAIRY),
  egg: words(EGG),
  nuts: words("almonds?|hazelnuts?|walnuts?|cashews?|pecans?|pistachios?|brazil nuts?|macadamias?|tree nuts?|nuts?|marzipan|praline|gianduja"),
  peanuts: words("peanuts?|groundnuts?|arachis|monkey nuts?"),
  soya: words("soya?|soy|soybeans?|soyabeans?|edamame|tofu|tempeh|miso|tamari"),
  fish: words(FISH_ONLY),
  shellfish: words(SHELLFISH),
  sesame: words("sesame|tahini|gomasio|benne"),
};
const GLUTEN_GRAINS = words("wheat|barley|rye|spelt|kamut");
const GLUTEN_FREE_NAME = /gluten[- ]?free/i;

/** What the pack says about itself, lower-case; null when the list isn't scraped yet. */
function ingredientsOf(p: ScoreInput): string | null {
  // labels mark allergens as _milk_ or *milk*: those are word characters to a regex, so \bmilk\b would miss them
  const t = p.ingredients?.replace(/[_*]+/g, " ").trim();
  return t ? t.toLowerCase() : null;
}

const forDiet = (t: string) => t.replace(FREE_FROM, " ").replace(FLAVOUR, " ").replace(BEEF_TOMATO, " ");

/** Why a diet hides this product, or null. Meat and poultry for every diet but 'none', fish for vegetarian and vegan, animal products for vegan. */
function dietReason(p: ScoreInput, diet: Settings["diet"]): string | null {
  if (diet === "none") return null;
  // what the pack says about itself ("vegan", "dairy free") is read off the name as written
  const raw = p.name.toLowerCase();
  const name = forDiet(raw);
  const ing = ingredientsOf(p);
  const ingText = ing && forDiet(ing);
  const meatFree = MEAT_FREE.test(raw);

  if (!meatFree && (p.cat === "chicken-turkey" || p.cat === "meat" || MEAT.test(name) || (STEAK.test(name) && !FISH_STEAK.test(name)))) return "meat or poultry";
  if (ingText && MEAT.test(ingText)) return "meat in the ingredients";
  if (diet === "pescatarian") return null;

  if (!meatFree && (p.cat === "fish" || FISH.test(name))) return "fish";
  if (ingText && FISH.test(ingText)) return "fish in the ingredients";
  if (diet === "vegetarian") return null;

  // vegan: dairy, egg, honey and friends, unless the pack says it is vegan or a plant alternative
  if (VEGAN_NAME.test(raw)) return null;
  const clean = (t: string) => t.replace(NOT_DAIRY, " ");
  if (ingText && VEGAN_ANIMAL.test(clean(ingText))) return "dairy, egg or honey in the ingredients";
  // the name and category still count when there is a list: it may be in another language ("Lait écrémé")
  if (p.cat === "dairy-eggs") return PLANT_DRINK.test(name) ? null : "dairy or egg";
  return VEGAN_ANIMAL.test(clean(name)) ? "dairy, egg or honey" : null;
}

function porkReason(p: ScoreInput): string | null {
  const raw = p.name.toLowerCase();
  if (MEAT_FREE.test(raw)) return null;
  const name = forDiet(raw);
  if (PORK.test(name)) return "pork";
  if (SAUSAGE.test(name) && !OTHER_MEAT_FOR_SAUSAGE.test(name)) return "pork sausages";
  const ing = ingredientsOf(p);
  return ing && PORK.test(forDiet(ing)) ? "pork in the ingredients" : null;
}

function beefReason(p: ScoreInput): string | null {
  const raw = p.name.toLowerCase();
  if (MEAT_FREE.test(raw)) return null;
  const name = forDiet(raw);
  if (BEEF.test(name)) return "beef";
  if (STEAK.test(name) && !NOT_BEEF_STEAK.test(name)) return "steak";
  if (MINCEISH.test(name) && !OTHER_MEAT_FOR_MINCE.test(name)) return "mince, burgers or meatballs";
  const ing = ingredientsOf(p);
  return ing && BEEF.test(forDiet(ing)) ? "beef in the ingredients" : null;
}

/**
 * Allergens are matched on the ingredients text, "may contain" and "traces" statements included, so a
 * peanut allergy hides a bar that is only made near peanuts. No ingredients yet: hide if the name gives
 * it away ("Peanut Butter"), otherwise ask them to check the label.
 */
function allergenState(p: ScoreInput, allergens: readonly Allergen[]): { reason: string | null; checkLabel: boolean } {
  if (allergens.length === 0) return { reason: null, checkLabel: false };
  const ing = ingredientsOf(p);
  const name = p.name.toLowerCase();
  const glutenFreeName = GLUTEN_FREE_NAME.test(name);
  for (const a of allergens) {
    const prep = (t: string) => {
      const x = t.replace(FREE_FROM, " ");
      return a === "milk" ? x.replace(NOT_DAIRY, " ") : x;
    };
    // a gluten free pack is fine unless the list names a gluten grain
    const re = a === "gluten" && glutenFreeName && ing ? GLUTEN_GRAINS : ALLERGEN_RE[a];
    if (ing && re.test(prep(ing))) return { reason: `${a} in the ingredients`, checkLabel: false };
    if (!(a === "gluten" && glutenFreeName) && ALLERGEN_RE[a].test(prep(name))) return { reason: `${a} in the name`, checkLabel: false };
  }
  return { reason: null, checkLabel: ing == null };
}

/** The first reason this person never sees the product, or null. Exported for the tests and for debugging. */
export function hideReasonFor(p: ScoreInput, s: Settings): { reason: string | null; checkLabel: boolean } {
  const reason = dietReason(p, s.diet) ?? (s.noPork ? porkReason(p) : null) ?? (s.noBeef ? beefReason(p) : null);
  if (reason) return { reason, checkLabel: false };
  return allergenState(p, s.allergens);
}

// ---------------------------------------------------------------- value

// ratio 1 (typical) -> 5, twice as good -> 10, half as good -> 0
const ratioScore = (r: number) => clamp(5 + 5 * Math.log2(r), 0, 10);
const value10 = (d: number) => clamp(Math.round((d * 100) / 6), 1, 10);

type Part = readonly [value: number | null | undefined, weight: number];

/** [deal, protein, cheap] weights for the goal. 'balanced' and 'lighter' are scripts/score.ts's own. */
function goalWeights(goal: Settings["goal"], onOffer: boolean, hasProtein: boolean): readonly [number, number, number] {
  if (goal === "protein") return onOffer ? [0.15, 0.6, 0.25] : [0, 0.7, 0.3];
  if (goal === "cheap") return onOffer ? [0.15, 0.3, 0.55] : [0, 0.35, 0.65];
  if (onOffer) return hasProtein ? [0.15, 0.5, 0.35] : [0.25, 0, 0.75];
  return hasProtein ? [0, 0.6, 0.4] : [0, 0, 1];
}

/** 1-10 value at the price this person pays; never taste. */
export function valueScore(p: ScoreInput, s: Settings): number {
  const vp = p.valueParts;
  if (!vp) return 5;
  const price = priceFor(p, s);
  // the scraped headline deal needs a Clubcard they don't have: price it as if it were not there
  const noClubcard = !s.clubcard && price.clubcardOnly;

  let onOffer = p.onOffer;
  let deal = vp.deal ?? null;
  let protein = vp.protein ?? null;
  let cheap = vp.cheap ?? null;

  // how much more they pay than the price the stored scores were judged at
  const storedPrice = p.best?.unitPrice ?? p.regular;
  const factor = noClubcard && storedPrice && price.unitPrice ? price.unitPrice / storedPrice : 1;

  if (noClubcard) {
    const o = price.offer;
    onOffer = o != null;
    const disc = o ? (o.discount ?? (p.regular && o.unitPrice != null ? 1 - o.unitPrice / p.regular : null)) : null;
    deal = disc != null ? value10(disc) : null;
    if (vp.typicalKg && vp.fullKg && p.regular && price.unitPrice) cheap = Math.round(ratioScore(vp.typicalKg / ((vp.fullKg * price.unitPrice) / p.regular)));
    // powders are judged against the market (not against other protein foods), so scale that score instead
    if (vp.market && vp.market.mine > 0) protein = Math.round(ratioScore(vp.market.typical / (vp.market.mine * factor)));
    else if (vp.ppp && vp.typicalPpp) protein = Math.round(ratioScore(vp.ppp / factor / vp.typicalPpp));
  }

  let parts: Part[];
  const cm = vp.creatineMarket;
  const mk = vp.market;
  if (cm && cm.mine > 0) {
    // creatine: £ per kg of creatine is the whole story
    const score = Math.round(ratioScore(cm.typical / (cm.mine * factor)));
    parts = onOffer ? [[deal, 0.25], [score, 0.75]] : [[score, 1]];
  } else if (mk && mk.mine > 0) {
    // powders: £ per protein gram is the whole story
    parts = onOffer ? [[deal, 0.25], [protein, 0.75]] : [[protein, 1]];
  } else {
    const [wd, wp, wc] = goalWeights(s.goal, onOffer, protein != null);
    parts = [[deal, wd], [protein, wp], [cheap, wc]];
  }

  // weights renormalised over the parts we could score, so a missing part doesn't drag the score
  let sum = 0;
  let weight = 0;
  for (const [v, w] of parts) {
    if (v == null || w <= 0) continue;
    sum += v * w;
    weight += w;
  }
  return weight > 0 ? clamp(Math.round(sum / weight), 1, 10) : 5;
}

// ---------------------------------------------------------------- the lot

export function scoreProduct(p: ScoreInput, s: Settings): Scored {
  const w = weightsFor(s);
  const parts = {
    nutrition: Math.round(nutritionScore(p, s)),
    processing: p.processing ?? 5,
    // 6 is the scorer's "chilled, but the pack says you can freeze it": worth more to someone who freezes fresh food
    shelf: p.shelf === 6 && s.buys.freezeFresh ? 8 : (p.shelf ?? 5),
    convenience: Math.round(convenienceScore(p, s)),
  };
  let fit = Math.round(parts.nutrition * w.nutrition + parts.processing * w.processing + parts.shelf * w.shelf + parts.convenience * w.convenience);
  if (p.cat === "treats" && fit > 3) fit = 3;
  fit = clamp(fit, 1, 10);

  const { reason, checkLabel } = hideReasonFor(p, s);
  return { fit, value: valueScore(p, s), hidden: reason != null, checkLabel, parts, ...(reason ? { hideReason: reason } : {}) };
}

// ---------------------------------------------------------------- card chips

const g = (v: number) => String(+(v < 1 ? v.toFixed(2) : v.toFixed(1)));

/**
 * Up to three facts for the product card, only for what this person cares about, the ones they care about
 * most first. "Check label" (an allergen safety flag) always goes first.
 */
export function cardChips(p: ScoreInput, s: Settings, scored: Pick<Scored, "checkLabel">): Chip[] {
  const n = p.n100;
  const ranked: { chip: Chip; rank: number }[] = [];
  const add = (rank: number, label: string, tone: Chip["tone"]) => ranked.push({ chip: { label, tone }, rank });

  if (s.watch.sat >= 1 && n?.sat != null) {
    // the same share-of-calories bands as nutrition
    const share = n.kcal ? (n.sat * 9) / n.kcal : null;
    add(s.watch.sat, `Sat fat ${g(n.sat)}g`, share == null ? "ok" : share <= 0.08 ? "good" : share <= 0.12 ? "ok" : "bad");
  }
  if (s.watch.salt >= 1 && n?.salt != null) add(s.watch.salt, `Salt ${g(n.salt)}g`, n.salt <= 0.3 ? "good" : n.salt <= 1 ? "ok" : n.salt <= 1.5 ? "warn" : "bad");
  if (s.watch.sugar >= 1 && n?.sugar != null) add(s.watch.sugar, `Sugar ${g(n.sugar)}g`, n.sugar <= 5 ? "good" : n.sugar <= 8 ? "ok" : n.sugar <= 15 ? "warn" : "bad");
  if (s.watch.kcal >= 1 && n?.kcal != null) add(s.watch.kcal, `${Math.round(n.kcal)} kcal/100g`, n.kcal <= 100 ? "good" : n.kcal <= 250 ? "ok" : n.kcal <= 400 ? "warn" : "bad");
  if (s.watch.upf >= 1 && p.proc?.nova === 4) add(s.watch.upf, "Ultra-processed", "warn");
  if (s.protein >= 1 && p.packProtein) {
    const price = priceFor(p, s).unitPrice;
    if (price) {
      const perPound = p.packProtein / price;
      const typical = p.valueParts?.typicalPpp;
      add(s.protein, `${Math.round(perPound)}g protein/£`, typical ? (perPound >= typical * 1.25 ? "good" : perPound >= typical * 0.8 ? "ok" : "warn") : "ok");
    }
  }
  if (scored.checkLabel) add(3, "Check label", "warn");

  return ranked
    .sort((a, b) => b.rank - a.rank)
    .slice(0, 3)
    .map((r) => r.chip);
}
