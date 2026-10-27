import { DEFAULT_SETTINGS, isAvoidChoice } from "./types";

/** Foods he doesn't eat. Stored in the settings table under this key as a JSON list of main proteins. */
export const AVOID_KEY = "avoid_proteins";

/** A stored or posted value as a clean list; anything that isn't a list of known choices falls back to the default. */
export function readAvoid(value: unknown): string[] {
  if (!Array.isArray(value)) return [...DEFAULT_SETTINGS.avoid_proteins];
  return [...new Set(value.filter(isAvoidChoice))];
}

/** From settings rows: not set yet means the default (pork). An empty list he saved himself stays empty. */
export function avoidFromRows(rows: { key: string; value: unknown }[]): string[] {
  const row = rows.find((r) => r.key === AVOID_KEY);
  return row ? readAvoid(row.value) : [...DEFAULT_SETTINGS.avoid_proteins];
}

/** True when this product's main protein is one he doesn't eat. Mixed meat is never excluded, and neither is a product with no main protein. */
export function isAvoided(proteinMain: string | null, avoid: readonly string[]): boolean {
  return proteinMain != null && avoid.includes(proteinMain);
}
