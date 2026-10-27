/**
 * Forgiving search. What he types is split into words; each word matches if the
 * product name or brand contains the word OR any of its variants (a different
 * spelling, the singular, a phrase that means the same). Every word must still
 * match somewhere, so "piri piri chicken" finds "Peri Peri Lemon & Herb Chicken
 * Legs". PURE: the SQL lives in catalog.ts.
 *
 * Matching is a substring match, so the singular already finds the plural
 * ("sausage" finds "sausages", "mince" finds "minced"); the work here is to
 * turn a typed plural into its singular and to cover spelling variants.
 */

/** Words that mean the same thing as each other. Every member of a group expands to the whole group. */
const SAME: readonly (readonly string[])[] = [
  ["piri", "peri"],
  ["yoghurt", "yogurt", "yoghourt"],
  ["kyiv", "kiev"],
  ["minced", "mince"],
  ["houmous", "hummus", "humous", "hommus"],
  ["chilli", "chili"],
  ["wholemeal", "whole wheat", "wholewheat"],
  ["couscous", "cous cous"],
  ["doughnut", "donut"],
  ["barbecue", "bbq"],
  ["pitta", "pita"],
  ["omelette", "omelet"],
  ["aubergine", "eggplant"],
  ["courgette", "zucchini"],
  ["coriander", "cilantro"],
  ["rocket", "arugula"],
];

const GROUP_OF = new Map<string, readonly string[]>();
for (const g of SAME) for (const w of g) GROUP_OF.set(w, g);

/** Words that stay as they are even though they end in s. */
const KEEP_S = /(?:ss|us|is|os)$/;

/** "sausages" => "sausage", "berries" => "berry", "tomatoes" => "tomato". Short words and ones like "hummus" are left alone. */
export function singular(word: string): string {
  if (word.length < 5 || KEEP_S.test(word) || !word.endsWith("s")) return word;
  if (word.endsWith("ies")) return `${word.slice(0, -3)}y`;
  if (/(?:oes|ches|shes|xes|sses)$/.test(word)) return word.slice(0, -2);
  return word.slice(0, -1);
}

/** The word itself first, then everything that should also count as a match. No duplicates. */
export function expandTerm(word: string): string[] {
  const w = word.toLowerCase();
  const out = new Set<string>([w]);
  const stem = singular(w);
  out.add(stem);
  for (const base of [w, stem]) {
    const group = GROUP_OF.get(base);
    if (group) for (const g of group) out.add(g);
  }
  return [...out];
}

/** Splits what he typed into search terms: lower case, "whole wheat" kept together, repeats dropped, at most six. */
export function searchTerms(q: string): string[] {
  const words = q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  const terms: string[] = [];
  for (let i = 0; i < words.length; i++) {
    if (words[i] === "whole" && words[i + 1] === "wheat") {
      terms.push("whole wheat");
      i++;
    } else if (words[i] === "cous" && words[i + 1] === "cous") {
      terms.push("cous cous");
      i++;
    } else {
      terms.push(words[i]);
    }
  }
  return [...new Set(terms)].slice(0, 6);
}

/** One list of acceptable spellings per typed term; a product must match one spelling of every term. */
export function searchVariants(q: string): string[][] {
  return searchTerms(q).map(expandTerm);
}
