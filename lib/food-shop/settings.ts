/**
 * What a person cares about, and how that tilts the scores. Pure: no server-only, no DB, so the
 * setup form, the API route, the scorer and the tests all share one definition.
 */

/** Don't mind / A bit / A lot (for protein: Don't mind / Some / Lots). */
export type Level = 0 | 1 | 2;
export type Goal = "protein" | "balanced" | "lighter" | "cheap";
export type Diet = "none" | "vegetarian" | "vegan" | "pescatarian";
export type Allergen = "gluten" | "milk" | "egg" | "nuts" | "peanuts" | "soya" | "fish" | "shellfish" | "sesame";
export type Appliance = "airfryer" | "microwave" | "oven" | "hob";

export interface Settings {
  goal: Goal;
  watch: { sat: Level; salt: Level; sugar: Level; kcal: Level; upf: Level };
  protein: Level;
  /** Optional grams of protein a day, 20-300. */
  proteinTarget: number | null;
  diet: Diet;
  noPork: boolean;
  noBeef: boolean;
  allergens: Allergen[];
  appliances: Appliance[];
  /** "ready meals and minimal cooking" or "happy to cook from scratch". */
  cooking: "ready" | "scratch";
  /** "shop weekly, fresh" or "prefer freezer and cupboard". */
  /** What they buy: frozen food, fresh food, and fresh food they freeze themselves. Most people do a mix. */
  buys: { frozen: boolean; fresh: boolean; freezeFresh: boolean };
  clubcard: boolean;
  /** £ per week, 5-1000. */
  budget: number | null;
  /** UK postcode, upper-case with one space ("BR7 5AG"). Used to show only what Tesco delivers to them. */
  postcode: string | null;
}

// Option lists in the order the setup form shows them (also the order stored arrays are normalised to).
export const GOALS: readonly Goal[] = ["protein", "balanced", "lighter", "cheap"];
export const DIETS: readonly Diet[] = ["none", "vegetarian", "vegan", "pescatarian"];
export const ALLERGENS: readonly Allergen[] = ["gluten", "milk", "egg", "nuts", "peanuts", "soya", "fish", "shellfish", "sesame"];
export const APPLIANCES: readonly Appliance[] = ["airfryer", "microwave", "oven", "hob"];

export const PROTEIN_TARGET_RANGE = { min: 20, max: 300 } as const;
export const BUDGET_RANGE = { min: 5, max: 1000 } as const;

/** What each goal sets for the watch list and protein; the setup form applies one, then lets them adjust. */
export const GOAL_PRESETS: Record<Goal, Pick<Settings, "watch" | "protein">> = {
  protein: { protein: 2, watch: { sat: 1, salt: 1, sugar: 1, kcal: 0, upf: 1 } },
  balanced: { protein: 1, watch: { sat: 1, salt: 1, sugar: 1, kcal: 1, upf: 1 } },
  lighter: { protein: 1, watch: { sat: 1, salt: 1, sugar: 2, kcal: 2, upf: 1 } },
  cheap: { protein: 1, watch: { sat: 1, salt: 1, sugar: 1, kcal: 0, upf: 0 } },
};

export const DEFAULT_SETTINGS: Settings = {
  goal: "balanced",
  watch: { ...GOAL_PRESETS.balanced.watch },
  protein: GOAL_PRESETS.balanced.protein,
  proteinTarget: null,
  diet: "none",
  noPork: false,
  noBeef: false,
  allergens: [],
  appliances: ["microwave", "oven", "hob"],
  cooking: "scratch",
  buys: { frozen: true, fresh: true, freezeFresh: false },
  clubcard: true,
  budget: null,
  postcode: null,
};

// UK postcode: outward code (A9, A99, AA9, AA99, A9A, AA9A) + inward code (9AA). Tesco only delivers in the UK.
const POSTCODE_RE = /^([A-Z]{1,2}\d[A-Z\d]?)\s*(\d[A-Z]{2})$/;

/** "br75ag" / " BR7  5AG " → "BR7 5AG"; null when it isn't a UK postcode. */
export function normalisePostcode(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const m = POSTCODE_RE.exec(input.trim().toUpperCase().replace(/\s+/g, " "));
  return m ? `${m[1]} ${m[2]}` : null;
}

const isLevel = (v: unknown): v is Level => v === 0 || v === 1 || v === 2;
const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

type Parsed<T> = { ok: true; value: T } | { ok: false; error: string };

function pickOne<T extends string>(v: unknown, options: readonly T[], what: string): Parsed<T> {
  if (typeof v === "string" && (options as readonly string[]).includes(v)) return { ok: true, value: v as T };
  return { ok: false, error: `${what} must be one of: ${options.join(", ")}.` };
}

function pickMany<T extends string>(v: unknown, options: readonly T[], what: string): Parsed<T[]> {
  if (!Array.isArray(v)) return { ok: false, error: `${what} must be a list.` };
  const bad = v.find((x) => typeof x !== "string" || !(options as readonly string[]).includes(x));
  if (bad !== undefined) return { ok: false, error: `${what} has something we don't know: ${String(bad).slice(0, 40)}.` };
  // dedupe, and keep the form's order so equal choices store equal
  return { ok: true, value: options.filter((o) => v.includes(o)) };
}

function pickNumber(v: unknown, range: { min: number; max: number }, what: string): Parsed<number | null> {
  if (v === null) return { ok: true, value: null };
  if (typeof v !== "number" || !Number.isFinite(v)) return { ok: false, error: `${what} must be a number, or left empty.` };
  const n = Math.round(v);
  if (n < range.min || n > range.max) return { ok: false, error: `${what} must be between ${range.min} and ${range.max}.` };
  return { ok: true, value: n };
}

/**
 * Strict check of settings from the browser (or a stored row). A field that is missing falls back to the
 * default; a field that is there but wrong is an error, so a typo never silently changes someone's scores.
 * Unknown keys are dropped. Arrays are deduped, numbers rounded and range-checked.
 */
export function parseSettings(input: unknown): { ok: true; value: Settings } | { ok: false; error: string } {
  if (!isRecord(input)) return { ok: false, error: "Settings must be an object." };
  const d = DEFAULT_SETTINGS;

  const goal = input.goal === undefined ? ({ ok: true, value: d.goal } as const) : pickOne(input.goal, GOALS, "Goal");
  if (!goal.ok) return goal;
  const diet = input.diet === undefined ? ({ ok: true, value: d.diet } as const) : pickOne(input.diet, DIETS, "Diet");
  if (!diet.ok) return diet;
  const cooking = input.cooking === undefined ? ({ ok: true, value: d.cooking } as const) : pickOne(input.cooking, ["ready", "scratch"] as const, "Cooking");
  if (!cooking.ok) return cooking;
  // the old single "fresh weekly / freezer & cupboard" answer (stored before 29 Oct) still reads sensibly
  const buys = { ...d.buys };
  if (input.buys !== undefined) {
    if (!isRecord(input.buys)) return { ok: false, error: "Buys must be an object." };
    for (const k of ["frozen", "fresh", "freezeFresh"] as const) {
      const v = input.buys[k];
      if (v === undefined) continue;
      if (typeof v !== "boolean") return { ok: false, error: `buys.${k} must be true or false.` };
      buys[k] = v;
    }
  } else if (input.shopping === "longlife") Object.assign(buys, { frozen: true, fresh: true, freezeFresh: true });
  else if (input.shopping === "fresh") Object.assign(buys, { frozen: false, fresh: true, freezeFresh: false });
  const allergens = input.allergens === undefined ? ({ ok: true, value: [] as Allergen[] } as const) : pickMany(input.allergens, ALLERGENS, "Allergens");
  if (!allergens.ok) return allergens;
  const appliances = input.appliances === undefined ? ({ ok: true, value: [...d.appliances] } as const) : pickMany(input.appliances, APPLIANCES, "Appliances");
  if (!appliances.ok) return appliances;
  const target = input.proteinTarget === undefined ? ({ ok: true, value: null } as const) : pickNumber(input.proteinTarget, PROTEIN_TARGET_RANGE, "Protein target");
  if (!target.ok) return target;
  const budget = input.budget === undefined ? ({ ok: true, value: null } as const) : pickNumber(input.budget, BUDGET_RANGE, "Budget");
  if (!budget.ok) return budget;

  let postcode: string | null = null;
  if (input.postcode !== undefined && input.postcode !== null && input.postcode !== "") {
    postcode = normalisePostcode(input.postcode);
    if (!postcode) return { ok: false, error: "That doesn't look like a UK postcode." };
  }

  let protein = d.protein;
  if (input.protein !== undefined) {
    if (!isLevel(input.protein)) return { ok: false, error: "Protein must be 0, 1 or 2." };
    protein = input.protein;
  }

  const watch = { ...d.watch };
  if (input.watch !== undefined) {
    if (!isRecord(input.watch)) return { ok: false, error: "Watch must be an object." };
    for (const k of Object.keys(watch) as (keyof Settings["watch"])[]) {
      const v = input.watch[k];
      if (v === undefined) continue;
      if (!isLevel(v)) return { ok: false, error: `Watch ${k} must be 0, 1 or 2.` };
      watch[k] = v;
    }
  }

  const flags = {} as Record<"noPork" | "noBeef" | "clubcard", boolean>;
  for (const k of ["noPork", "noBeef", "clubcard"] as const) {
    const v = input[k];
    if (v === undefined) flags[k] = d[k];
    else if (typeof v === "boolean") flags[k] = v;
    else return { ok: false, error: `${k} must be true or false.` };
  }

  return {
    ok: true,
    value: {
      goal: goal.value,
      watch,
      protein,
      proteinTarget: target.value,
      diet: diet.value,
      noPork: flags.noPork,
      noBeef: flags.noBeef,
      allergens: allergens.value,
      appliances: [...appliances.value],
      cooking: cooking.value,
      buys,
      clubcard: flags.clubcard,
      budget: budget.value,
      postcode,
    },
  };
}

export interface FitWeights {
  nutrition: number;
  processing: number;
  shelf: number;
  convenience: number;
}

/**
 * How much each part counts toward Fit. Starts from the original .35 / .25 / .2 / .2, then moves
 * processing with how much they mind ultra-processed food, shelf with how they shop, convenience with
 * how they cook, and scales back to sum to 1.
 */
export function weightsFor(s: Settings): FitWeights {
  const processing = [0.15, 0.25, 0.35][s.watch.upf] ?? 0.25;
  // shelf life matters most to someone who only buys frozen, least to someone who only buys fresh
  const shelf = s.buys.frozen && !s.buys.fresh ? 0.25 : s.buys.fresh && !s.buys.frozen ? 0.1 : 0.15;
  const convenience = s.cooking === "ready" ? 0.25 : 0.15;
  // the goal decides how much nutrition counts against shelf life and ease: a high-protein or lighter
  // eater shouldn't see frozen onion rings rise just because they keep and air-fry well
  const nutrition = { protein: 0.55, lighter: 0.55, balanced: 0.45, cheap: 0.35 }[s.goal];
  const sum = nutrition + processing + shelf + convenience;
  return { nutrition: nutrition / sum, processing: processing / sum, shelf: shelf / sum, convenience: convenience / sum };
}

/** Their postcode area ("BR7"): what a "Not available to me" report applies to. Null without a postcode. */
export const areaOf = (s: Settings): string | null => s.postcode?.split(" ")[0] ?? null;
