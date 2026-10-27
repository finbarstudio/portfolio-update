import { LEARNED_MAX, tasteScore } from "./fit";
import { unitPriceLabel } from "./format";
import { LENIENT_GROUPS } from "./lenient-groups";
import { OVERALL_WEIGHTS, overallParts } from "./overall";
import type { ProductCard } from "./types";

/**
 * The working behind the two scores on a card, so "Why Fit 8?" and "Why Value 7?"
 * can show real numbers. PURE.
 *
 * Health mirrors the pipeline's score (Lab/dad-shop/src/score.ts): 35% protein,
 * 30% saturated fat, 35% processing, then the seed-oil and missing-data caps.
 * Saturated fat only counts against processed food: a whole food (steak, full-fat
 * Greek yoghurt, cheese on its own) scores a full 10 on it. Folic acid is a label,
 * never a score.
 * The final number shown is always the stored health; the parts are recomputed
 * here from the same inputs so he can see where it came from.
 */

const clamp = (n: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, n));
const r1 = (n: number): number => Math.round(n * 10) / 10;

/**
 * A whole food, exactly as the pipeline decides it (Lab/dad-shop/src/score.ts `isWholeFood`): a plain ingredient
 * (is_basic), or a short, clean list: 3 or fewer ingredients (the count must be known), no ultra-processing
 * markers, and seed oil 'none' (yes, likely and unknown all fail). Saturated fat is not counted against these.
 */
export function isWholeFood(c: Pick<ProductCard, "isBasic" | "ingredientCount" | "upfMarkers" | "seedOil">): boolean {
  if (c.isBasic) return true;
  return c.ingredientCount != null && c.ingredientCount <= 3 && c.upfMarkers.length === 0 && c.seedOil === "none";
}

/** g protein per 100 kcal: 10 or more => 10, linear down to 2 or less => 1. */
export function proteinScore(protein: number, kcal: number): number {
  if (kcal <= 0) return protein > 0 ? 10 : 1;
  const per100kcal = (protein / kcal) * 100;
  return clamp(1 + ((per100kcal - 2) / 8) * 9, 1, 10);
}

/** % of kcal from saturates: 5% or less => 10, 10% => 6, 20% or more => 1, then -2 when 5g/100g or more. */
export function satScore(sat: number, kcal: number): number {
  const pct = kcal <= 0 ? (sat > 0 ? 100 : 0) : ((sat * 9) / kcal) * 100;
  let s: number;
  if (pct <= 5) s = 10;
  else if (pct <= 10) s = 10 - (pct - 5) * (4 / 5);
  else if (pct < 20) s = 6 - (pct - 10) * (5 / 10);
  else s = 1;
  if (sat >= 5) s -= 2;
  return clamp(s, 0, 10);
}

/**
 * From the ingredient count, on one scale per comparison group; minus 1.5 per marker (at most 6).
 * Lenient groups (LENIENT_GROUPS, where a long list is normal) and products with no group:
 *   1-2 => 10, up to 5 => 8, up to 10 => 6, up to 20 => 4, more => 2.
 * Every other group: 1-2 => 10, 3 => 9, 4 => 8, 5 => 7, 6-7 => 6, 8-10 => 5, 11-15 => 4, 16-20 => 3, more => 2.
 */
export function processingScore(count: number, markers: number, group: string | null = null): number {
  const lenient = group === null || LENIENT_GROUPS.has(group);
  const base = lenient
    ? count <= 2 ? 10 : count <= 5 ? 8 : count <= 10 ? 6 : count <= 20 ? 4 : 2
    : count <= 2 ? 10 : count <= 3 ? 9 : count <= 4 ? 8 : count <= 5 ? 7 : count <= 7 ? 6 : count <= 10 ? 5 : count <= 15 ? 4 : count <= 20 ? 3 : 2;
  return clamp(base - Math.min(markers * 1.5, 6), 0, 10);
}

export interface HealthPart {
  key: "protein" | "sat" | "processing";
  label: string;
  /** 0-10, null when it could not be judged. */
  score: number | null;
  /** 0.35 / 0.3 / 0.35 */
  weight: number;
  /** score x weight */
  points: number | null;
  detail: string;
}

export interface HealthBreakdown {
  /** "full" uses all three parts; "processing" is the fallback when nutrition is missing; "none" means nothing to judge from. */
  mode: "full" | "processing" | "none";
  parts: HealthPart[];
  /** Before the caps. */
  raw: number | null;
  caps: string[];
  /** The stored health score. */
  final: number | null;
  reasons: string[];
  /** Honest notes about where the data came from or what is missing. */
  notes: string[];
}

type HealthInput = Pick<
  ProductCard,
  | "protein"
  | "sat"
  | "kcal"
  | "ingredientCount"
  | "upfMarkers"
  | "seedOil"
  | "seedOilsFound"
  | "health"
  | "reasons"
  | "ingredientsSource"
  | "nutritionSource"
  | "isBasic"
  | "folicAcid"
  | "productGroup"
>;

const SOURCE_WORDS: Record<string, string> = {
  tesco: "the same product's label at Tesco",
  openfoodfacts: "Open Food Facts",
};

/** "" when it is Sainsbury's own label (or unknown), else a plain note. */
export function sourceNotes(c: Pick<ProductCard, "ingredientsSource" | "nutritionSource">): string[] {
  const ing = c.ingredientsSource && c.ingredientsSource !== "sainsburys" ? SOURCE_WORDS[c.ingredientsSource] : undefined;
  const nut = c.nutritionSource && c.nutritionSource !== "sainsburys" ? SOURCE_WORDS[c.nutritionSource] : undefined;
  if (ing && nut && ing === nut) return [`Ingredients and nutrition from ${ing}`];
  const out: string[] = [];
  if (ing) out.push(`Ingredients from ${ing}`);
  if (nut) out.push(`Nutrition from ${nut}`);
  return out;
}

export function healthBreakdown(c: HealthInput): HealthBreakdown {
  const notes = sourceNotes(c);
  const complete = c.kcal != null && c.protein != null && c.sat != null;
  const count = c.ingredientCount;
  const markers = c.upfMarkers.length;
  const procScore = count != null ? processingScore(count, markers, c.productGroup) : null;

  const protein: HealthPart = {
    key: "protein",
    label: "Protein",
    weight: 0.35,
    score: null,
    points: null,
    detail: "Nutrition not read yet",
  };
  const sat: HealthPart = { key: "sat", label: "Saturated fat", weight: 0.3, score: null, points: null, detail: "Nutrition not read yet" };
  const proc: HealthPart = { key: "processing", label: "Processing", weight: 0.35, score: procScore, points: null, detail: "" };

  if (c.protein != null && c.kcal != null) {
    protein.score = proteinScore(c.protein, c.kcal);
    const per100kcal = c.kcal > 0 ? Math.round((c.protein / c.kcal) * 100) : 0;
    protein.detail = `${r1(c.protein)}g protein per 100g (about ${per100kcal}g for every 100 calories; scoring compares protein to calories so yoghurt and steak can be compared fairly)`;
  } else if (c.protein != null) {
    protein.detail = `${r1(c.protein)}g protein per 100g, but no calories to judge it against`;
  }
  if (c.sat != null && c.kcal != null) {
    const pct = c.kcal > 0 ? ((c.sat * 9) / c.kcal) * 100 : 0;
    const raw = satScore(c.sat, c.kcal);
    const plain = `${r1(c.sat)}g sat fat, ${Math.round(pct)}% of the calories${c.sat >= 5 ? " (high: minus 2)" : ""}`;
    if (isWholeFood(c)) {
      // A whole food scores 10 whatever its fat. The line only appears where the complaint would have fired.
      sat.score = 10;
      sat.detail = c.sat >= 5 || raw <= 4 ? `A whole food, so its saturated fat isn't counted against it (${plain})` : plain;
    } else {
      sat.score = raw;
      sat.detail = markers > 0 && raw <= 4 ? `${plain}. Processed and high in saturated fat` : plain;
    }
  } else if (c.sat != null) {
    sat.detail = `${r1(c.sat)}g sat fat per 100g, but no calories to judge it against`;
  }
  if (count != null) {
    proc.detail =
      markers > 0
        ? `${count} ${count === 1 ? "ingredient" : "ingredients"}, with ${c.upfMarkers.join(", ")} (minus ${r1(Math.min(markers * 1.5, 6))})`
        : `${count} ${count === 1 ? "ingredient" : "ingredients"}, no additives found`;
  } else {
    proc.detail = "Ingredients not read yet, so it counts as a middle 5";
  }

  const caps: string[] = [];
  let mode: HealthBreakdown["mode"];
  let raw: number | null;
  if (complete && protein.score != null && sat.score != null) {
    mode = "full";
    const p = procScore ?? 5;
    proc.points = p * proc.weight;
    protein.points = protein.score * protein.weight;
    sat.points = sat.score * sat.weight;
    raw = protein.points + sat.points + proc.points;
  } else if (procScore != null) {
    mode = "processing";
    raw = Math.min(procScore, 6);
    proc.points = raw;
    proc.weight = 1;
    notes.push("Nutrition is missing, so only the ingredients count here, and the score stops at 6.");
  } else {
    mode = "none";
    raw = null;
  }
  if (raw != null) {
    if (c.seedOil === "yes") caps.push(`Seed oils (${c.seedOilsFound.join(", ") || "found"}) cap it at 3`);
    else if (c.seedOil === "likely") caps.push("Unnamed vegetable oil (probably a seed oil) caps it at 5");
  }
  if (c.folicAcid) notes.push("Contains folic acid. Shown as a warning only; it doesn't change the score.");
  const parts = mode === "processing" ? [proc] : [protein, sat, proc];
  return { mode, parts, raw: raw != null ? r1(raw) : null, caps, final: c.health, reasons: c.reasons, notes };
}

// ── Value ───────────────────────────────────────────────────────────────────

export interface ValuePart {
  key: "cheap" | "deal";
  label: string;
  score: number | null;
  weight: number;
  points: number | null;
  detail: string;
}

export interface ValueBreakdown {
  parts: ValuePart[];
  final: number | null;
  /** Said when there is nothing to compare. */
  note: string | null;
}

type ValueInput = Pick<ProductCard, "value" | "valueBasis" | "valuePct" | "discount" | "per100Protein" | "unitPrice" | "unitMeasure" | "category" | "department">;

const gbp = (n: number): string => `£${n.toFixed(2)}`;

/** Value = 70% how cheap it is against the same kind of food + 30% the size of any deal. Mirrors catalog.ts. */
export function valueBreakdown(c: ValueInput): ValueBreakdown {
  const kind = (c.category ?? c.department ?? "its section").toLowerCase();
  const cheapScore = c.valuePct != null ? c.valuePct * 10 : null;
  let cheapDetail: string;
  if (c.valuePct != null && c.valueBasis === "protein") {
    cheapDetail = `${c.per100Protein != null ? `${gbp(c.per100Protein)} per 100g of protein, ` : ""}cheaper than ${Math.round(c.valuePct * 100)}% of other ${kind}`;
  } else if (c.valuePct != null) {
    const unit = unitPriceLabel(c.unitPrice, c.unitMeasure);
    cheapDetail = `${unit ? `${unit}, ` : ""}cheaper than ${Math.round(c.valuePct * 100)}% of other ${kind}`;
  } else {
    cheapDetail = `Not enough ${kind} to compare with, so a middle 5`;
  }
  const dealScore = Math.min(c.discount / 0.4, 1) * 10;
  const dealDetail = c.discount > 0.005 ? `${Math.round(c.discount * 100)}% off the usual price (40% off or more is full marks)` : "No offer on now";
  const cheapPts = (cheapScore ?? 5) * 0.7;
  const dealPts = dealScore * 0.3;
  const judged = c.value != null;
  return {
    parts: [
      { key: "cheap", label: c.valueBasis === "protein" ? "Protein per £" : "Price for what you get", score: cheapScore ?? 5, weight: 0.7, points: cheapPts, detail: cheapDetail },
      { key: "deal", label: "Deal", score: dealScore, weight: 0.3, points: dealPts, detail: dealDetail },
    ],
    final: c.value,
    note: judged ? null : "Can't judge the price yet: no pack weight or protein to compare, and no offer on.",
  };
}

// ── Best overall ────────────────────────────────────────────────────────────

/** "Health 8.5 × 0.6 + Value 7 × 0.25 + taste 4★ × 0.15 = 7.9" */
export function overallSum(c: Pick<ProductCard, "health" | "value" | "stars" | "vote">): { text: string; total: number } {
  const p = overallParts(c);
  const taste =
    p.taste.how === "stars" ? `${c.stars}★` : p.taste.how === "vote" ? (c.vote === 1 ? "yes" : "no") : "5 (no opinion yet)";
  const num = (n: number): string => String(r1(n));
  return {
    text: `Health ${num(p.health.score)} × ${OVERALL_WEIGHTS.health} + Value ${num(p.value.score)} × ${OVERALL_WEIGHTS.value} + taste ${taste} × ${OVERALL_WEIGHTS.taste} = ${num(p.total)}`,
    total: p.total,
  };
}

// ── Fit = health, blended with his taste ───────────────────────────────────

/** One or two plain sentences on how his taste moved (or did not move) the Fit number. */
export function fitBlend(c: Pick<ProductCard, "health" | "fit" | "stars" | "learned">): string {
  if (c.health == null) return "Not scored yet: the ingredients and nutrition have not been read, so there is no Fit.";
  const h = r1(c.health);
  if (c.stars != null) {
    return `Your ${c.stars}★ counts 40%: health ${h} × 0.6 + taste ${tasteScore(c.stars)} × 0.4 = ${r1(c.fit ?? c.health)}.`;
  }
  if (c.learned) {
    const w = LEARNED_MAX * c.learned.conf;
    return `Taste ≈${r1(c.learned.taste)}, worked out from ${c.learned.from.slice(0, 2).join(" and ")}, counts ${Math.round(w * 100)}%: health ${h} × ${(1 - w).toFixed(2)} + taste ${r1(c.learned.taste)} × ${w.toFixed(2)} = ${r1(c.fit ?? c.health)}.`;
  }
  return "You haven't rated it yet, so Fit is the health score. Rate it with the stars to add your taste.";
}
