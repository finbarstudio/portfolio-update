/** Input checks for the food shop's API routes. Pure. */

export type Checked<T> = { ok: true; value: T } | { ok: false; error: string };

/** Tesco product ids are digits; anything else can't be a product. */
export function parseProductId(input: unknown): Checked<string> {
  if (typeof input === "string" && /^\d{1,20}$/.test(input)) return { ok: true, value: input };
  return { ok: false, error: "That isn't a product." };
}
