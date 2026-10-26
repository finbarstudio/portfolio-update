import type { Nutrition } from "./types";

/**
 * Fit = how well a product suits him. It is the pipeline's objective health
 * score (0-10) until he rates it, then 60% health + 40% his taste.
 */

const TASTE: Record<number, number> = { 1: 0, 2: 2.5, 3: 5, 4: 7.5, 5: 10 };

export function tasteScore(stars: number): number {
  return TASTE[stars] ?? 5;
}

export function fitScore(health: number | null, stars: number | null): number | null {
  if (stars == null) return health;
  if (health == null) return tasteScore(stars);
  return 0.6 * health + 0.4 * tasteScore(stars);
}

export type Band = "good" | "ok" | "poor" | "none";

export function fitBand(fit: number | null): Band {
  if (fit == null) return "none";
  if (fit >= 7) return "good";
  if (fit >= 5) return "ok";
  return "poor";
}

export function fitWord(fit: number | null): string {
  switch (fitBand(fit)) {
    case "good":
      return "Good for you";
    case "ok":
      return "Okay";
    case "poor":
      return "Not great";
    default:
      return "Not scored yet";
  }
}

/** Whole number out of 10, for the badge. */
export function fitNumber(fit: number | null): string {
  return fit == null ? "?" : String(Math.round(fit));
}

export type Light = "green" | "amber" | "red" | "none";
export type NutrientKey = "fat" | "sat" | "sugars" | "salt" | "protein";

/** Per 100g, UK front-of-pack bands. Protein is good when high, never red. */
const BANDS: Record<NutrientKey, { low: number; high: number }> = {
  fat: { low: 3, high: 17.5 },
  sat: { low: 1.5, high: 5 },
  sugars: { low: 5, high: 22.5 },
  salt: { low: 0.3, high: 1.5 },
  protein: { low: 6, high: 12 },
};

export function nutrientLight(key: NutrientKey, value: number | undefined): Light {
  if (value == null || Number.isNaN(value)) return "none";
  const b = BANDS[key];
  if (key === "protein") return value >= b.high ? "green" : value >= b.low ? "amber" : "none";
  if (value <= b.low) return "green";
  if (value > b.high) return "red";
  return "amber";
}

export function lightWord(key: NutrientKey, light: Light): string {
  if (light === "none") return "";
  if (key === "protein") return light === "green" ? "High" : "Some";
  return light === "green" ? "Low" : light === "amber" ? "Medium" : "High";
}

export interface NutritionRow {
  key: string;
  label: string;
  value: string;
  light: Light;
  word: string;
  /** Sub-rows (sat fat under fat) are drawn smaller. */
  indent: boolean;
}

function amount(v: number | undefined, unit: string): string {
  if (v == null) return "-";
  const r = v >= 10 ? Math.round(v) : Math.round(v * 10) / 10;
  return `${r}${unit}`;
}

/** The nutrition table in the order people read it on a pack. */
export function nutritionRows(n: Nutrition): NutritionRow[] {
  const row = (
    key: string,
    label: string,
    value: number | undefined,
    unit: string,
    light: NutrientKey | null,
    indent = false,
  ): NutritionRow | null => {
    if (value == null) return null;
    const l = light ? nutrientLight(light, value) : "none";
    return { key, label, value: amount(value, unit), light: l, word: light ? lightWord(light, l) : "", indent };
  };
  return [
    row("protein", "Protein", n.protein, "g", "protein"),
    row("kcal", "Energy", n.kcal, " kcal", null),
    row("fat", "Fat", n.fat, "g", "fat"),
    row("sat", "of which saturates", n.sat, "g", "sat", true),
    row("carbs", "Carbohydrate", n.carbs, "g", null),
    row("sugars", "of which sugars", n.sugars, "g", "sugars", true),
    row("fibre", "Fibre", n.fibre, "g", null),
    row("salt", "Salt", n.salt, "g", "salt"),
  ].filter((r): r is NutritionRow => r !== null);
}
