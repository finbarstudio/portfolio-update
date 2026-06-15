import type { Project } from "./projects";

/**
 * Work-page filters. Each discipline on the home "What I do" slider links to
 * /work?filter=<key>, and /work shows these as chips. A project matches a filter
 * if any of its categories/skills contains one of the filter's terms.
 */
export type WorkFilter = { key: string; label: string; terms: string[] };

export const WORK_FILTERS: WorkFilter[] = [
  { key: "brand", label: "Brand identity", terms: ["brand"] },
  { key: "editorial", label: "Editorial & print", terms: ["publication", "print", "editorial", "infographic", "information"] },
  { key: "web", label: "Web & UI", terms: ["web", "ui", "framer"] },
  { key: "motion", label: "Motion & social", terms: ["motion", "social", "campaign", "digital"] },
  { key: "art", label: "Art direction", terms: ["art direction", "cover", "photography", "imagery", "packaging", "event"] },
];

export function projectMatchesFilter(project: Project, key: string | undefined): boolean {
  if (!key) return true;
  const f = WORK_FILTERS.find((x) => x.key === key);
  if (!f) return true;
  // Match on the higher-level categories only (skills are too granular and make
  // nearly everything match "brand").
  const hay = project.categories.join(" ").toLowerCase();
  return f.terms.some((t) => hay.includes(t));
}

export function filterLabel(key: string | undefined): string | null {
  return WORK_FILTERS.find((x) => x.key === key)?.label ?? null;
}
