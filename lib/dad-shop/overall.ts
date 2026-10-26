import { TASTE_NEUTRAL, VOTE_NO_TASTE, VOTE_YES_TASTE, tasteScore } from "./fit";

/**
 * "Best overall": the default sort almost everywhere. A weighted blend of
 *   health   the pipeline's objective score (protein, sat fat, processing, seed oils),
 *   value    protein or £/kg per £ against its own category, plus the size of any deal,
 *   taste    his own stars, or his Yes / No on a basket pick (5 = no opinion yet).
 * The weights live here, in one place, so they can be tuned later. The sort
 * in catalog.ts and the explanation on the card both read this one constant.
 */
export const OVERALL_WEIGHTS = { health: 0.5, value: 0.35, taste: 0.15 } as const;

const PCT = (n: number): string => `${Math.round(n * 100)}%`;

/** "Health 50% · value 35% · your taste 15%" */
export function overallWeightsLine(): string {
  return `Health ${PCT(OVERALL_WEIGHTS.health)} · value ${PCT(OVERALL_WEIGHTS.value)} · your taste ${PCT(OVERALL_WEIGHTS.taste)}`;
}

export interface OverallInput {
  health: number | null;
  value: number | null;
  stars: number | null;
  vote: 1 | -1 | null;
}

export interface OverallParts {
  health: { score: number; known: boolean };
  value: { score: number; known: boolean };
  taste: { score: number; how: "stars" | "vote" | "none" };
  /** 0-10 */
  total: number;
}

/** The taste term: his stars first, then his vote, otherwise neutral. */
export function tasteTerm(c: Pick<OverallInput, "stars" | "vote">): { score: number; how: "stars" | "vote" | "none" } {
  if (c.stars != null) return { score: tasteScore(c.stars), how: "stars" };
  if (c.vote != null) return { score: c.vote > 0 ? VOTE_YES_TASTE : VOTE_NO_TASTE, how: "vote" };
  return { score: TASTE_NEUTRAL, how: "none" };
}

/** Anything not yet judged (no nutrition read, no value basis) counts as 5, a middle mark. */
export function overallParts(c: OverallInput): OverallParts {
  const health = { score: c.health ?? 5, known: c.health != null };
  const value = { score: c.value ?? 5, known: c.value != null };
  const taste = tasteTerm(c);
  const total = health.score * OVERALL_WEIGHTS.health + value.score * OVERALL_WEIGHTS.value + taste.score * OVERALL_WEIGHTS.taste;
  return { health, value, taste, total };
}

export function overallScore(c: OverallInput): number {
  return overallParts(c).total;
}
