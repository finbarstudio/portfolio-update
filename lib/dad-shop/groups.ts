import taxonomy from "./group-taxonomy.json";

/**
 * Tesco-style comparison groups: "what you would buy instead", with how it is
 * prepared built in ("breast & fillets (plain, raw)" is not "deli: sliced cooked
 * meats"). The pipeline fills products.product_group and products.protein_main;
 * this is the list it chooses from, used to check what the address asks for.
 */
export const GROUP_NAMES: ReadonlySet<string> = new Set(taxonomy.groups.map((g) => g.g));

/** Main proteins, in the order they read best. "none" is not a protein to filter by. */
export const PROTEIN_NAMES: readonly string[] = taxonomy.proteins.filter((p) => p !== "none");

export function isGroup(name: string): boolean {
  return GROUP_NAMES.has(name);
}

export function isProtein(name: string): boolean {
  return PROTEIN_NAMES.includes(name);
}
