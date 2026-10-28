import type { Allergen, Appliance, Diet, Goal, Level, Settings } from "./settings";

/** Plain-words names for the settings, shared by the forms, the cards and the product page. */
export const GOAL_LABELS: Record<Goal, { title: string; blurb: string }> = {
  protein: { title: "High protein", blurb: "Protein counts most: more grams per 100g and per pound, still watching sat fat and salt." },
  balanced: { title: "Balanced", blurb: "A bit of everything: decent protein, not too much sat fat, salt or sugar." },
  lighter: { title: "Lighter", blurb: "Fewer calories and less sugar, with enough protein to stay full." },
  cheap: { title: "Cheapest", blurb: "Price first, as long as the food is decent." },
};

export const DIET_LABELS: Record<Diet, string> = {
  none: "Anything",
  vegetarian: "Vegetarian",
  vegan: "Vegan",
  pescatarian: "Pescatarian",
};

export const ALLERGEN_LABELS: Record<Allergen, string> = {
  gluten: "Gluten",
  milk: "Milk",
  egg: "Egg",
  nuts: "Tree nuts",
  peanuts: "Peanuts",
  soya: "Soya",
  fish: "Fish",
  shellfish: "Shellfish",
  sesame: "Sesame",
};

export const APPLIANCE_LABELS: Record<Appliance, string> = {
  airfryer: "Air fryer",
  microwave: "Microwave",
  oven: "Oven",
  hob: "Hob",
};

export const WATCH_LABELS: Record<keyof Settings["watch"], string> = {
  sat: "Saturated fat",
  salt: "Salt",
  sugar: "Sugar",
  kcal: "Calories",
  upf: "Ultra-processed & additives",
};

/** Short lower-case forms for sentences. */
export const WATCH_SHORT: Record<keyof Settings["watch"], string> = {
  sat: "sat fat",
  salt: "salt",
  sugar: "sugar",
  kcal: "calories",
  upf: "ultra-processed food",
};

export const LEVEL_LABELS: readonly [string, string, string] = ["Don't mind", "A bit", "A lot"];
export const PROTEIN_LEVEL_LABELS: readonly [string, string, string] = ["Don't mind", "Some", "Lots"];

export const levelLabel = (l: Level, protein = false): string => (protein ? PROTEIN_LEVEL_LABELS : LEVEL_LABELS)[l];

export const DEPT_LABELS: Record<string, string> = {
  bakery: "Bread & bakery",
  baking: "Baking & spreads",
  carbs: "Pasta, rice & noodles",
  cereal: "Cereal & breakfast",
  dairy: "Dairy & eggs",
  drinks: "Coffee & drinks",
  fish: "Fish",
  fruit: "Fruit",
  herbs: "Herbs, spices & stocks",
  meat: "Meat & poultry",
  ready: "Ready meals & pizza",
  sauces: "Sauces, dips & oils",
  snacks: "Snacks",
  soup: "Soup",
  supplements: "Supplements & shakes",
  treats: "Treats & desserts",
  veg: "Veg, beans & potatoes",
  veggie: "Meat-free",
};

/** products.dept is null for the products the scorer couldn't place; the URL calls that bucket "other". */
export const OTHER_DEPT = "other";

export const deptLabel = (d: string | null): string => (d == null || d === OTHER_DEPT ? "Everything else" : (DEPT_LABELS[d] ?? d.charAt(0).toUpperCase() + d.slice(1)));
