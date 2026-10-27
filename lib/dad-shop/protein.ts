/**
 * "High protein": 15g or more in every 100g, or 8g or more for every 100
 * calories. The second route lets yoghurt, skyr and lean meat count when they
 * are light; it needs at least 6g in every 100g so that vegetables (broccoli is
 * 8g per 100 kcal on a tiny 3g) and zero-calorie drinks never count.
 * catalog.ts repeats these numbers in SQL (`highProteinTest`).
 */
export const HIGH_PROTEIN_G = 15;
export const HIGH_PROTEIN_PER_100KCAL = 8;
export const HIGH_PROTEIN_FLOOR_G = 6;

export function isHighProtein(protein: number | null, kcal: number | null): boolean {
  if (protein == null || !(protein > 0)) return false;
  if (protein >= HIGH_PROTEIN_G) return true;
  if (kcal == null || !(kcal > 0) || protein < HIGH_PROTEIN_FLOOR_G) return false;
  return (protein / kcal) * 100 >= HIGH_PROTEIN_PER_100KCAL;
}

/** "9g" or "21g": whole grams from 10 up, one decimal below. */
export function gramsText(g: number): string {
  return `${g >= 10 ? Math.round(g) : +g.toFixed(1)}g`;
}
