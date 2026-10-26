/**
 * How a meat or fish product has been prepared, read from its name. Sainsbury's
 * own category ("Chicken breast & fillet") mixes raw breasts with roast,
 * chargrilled, breaded and marinated ones, and those should never be compared.
 *
 * Interim: once the pipeline adds a real `product_type` and `prep`, replace
 * `prepOf` with that column (see `similarScope` in similar.ts, the one place
 * that decides what counts as similar).
 */
export type Prep = "raw" | "cooked" | "breaded" | "marinated";

const BREADED = /bread(?:ed|crumb)|crumb|\bkievs?\b|goujon|nugget|\bcoated\b|\bcoating\b|\bbattered?\b|southern fried|\bpanko\b/i;
const COOKED = /ready[- ]to[- ]eat|\bcooked\b|\broast(?:ed)?\b|char-?grill(?:ed|s)?|\bsliced\b|\bsmoked\b|\bgrills?\b|\bhot[- ]smoked\b/i;
const MARINATED = /marinat|\bbbq\b|barbecue|piri[- ]?piri|peri[- ]?peri|tikka|tandoori|\bjerk\b|cajun|harissa|sizzler|flavou?red|\bjust cook\b|\bbasted\b|\bstuffed\b/i;

/** Breaded beats cooked beats marinated: "Tikka sliced chicken breast (ready to eat)" is cooked, not raw tikka. */
export function prepOf(name: string): Prep {
  if (BREADED.test(name)) return "breaded";
  if (COOKED.test(name)) return "cooked";
  if (MARINATED.test(name)) return "marinated";
  return "raw";
}

/** Prep only splits fresh and frozen meat and fish; a "tikka" ready meal is still next to a "korma" one. */
export function prepApplies(p: { animal: string | null; zone: string | null; department: string | null }): boolean {
  if (!p.animal) return false;
  return p.zone === "Meat & fish" || p.department === "Meat & poultry" || p.department === "Fish & seafood";
}
