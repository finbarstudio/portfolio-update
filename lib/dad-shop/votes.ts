/**
 * What his Yes / No on basket picks have taught, in plain words. PURE.
 * "You said no to 3 desserts, so fewer of those."
 */

export interface VoteRow {
  vote: 1 | -1;
  department: string | null;
  category: string | null;
}

/** How long a No keeps a product out of baskets. */
export const NO_DAYS = 28;

function kindOf(r: VoteRow): string | null {
  const k = (r.department ?? r.category)?.trim().toLowerCase();
  return k ? k : null;
}

function biggest(rows: VoteRow[], vote: 1 | -1): { kind: string; n: number } | null {
  const counts = new Map<string, number>();
  for (const r of rows) {
    if (r.vote !== vote) continue;
    const k = kindOf(r);
    if (k) counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  let best: { kind: string; n: number } | null = null;
  for (const [kind, n] of [...counts].sort((a, b) => (a[0] < b[0] ? -1 : 1))) {
    if (!best || n > best.n) best = { kind, n };
  }
  return best;
}

function line(said: "no" | "yes", kind: string, n: number): string {
  const plural = kind.endsWith("s") && !kind.endsWith("ss");
  const lead = `You said ${said} to`;
  const tail = said === "no" ? (plural ? "so fewer of those" : "so less of that") : plural ? "so a bit more of those" : "so a bit more of that";
  if (plural) return n === 1 ? `${lead} 1 of the ${kind}, ${tail}.` : `${lead} ${n} ${kind}, ${tail}.`;
  return `${lead} ${n} in ${kind}, ${tail}.`;
}

/** At most two short lines: the kind of food he said no to most, and the one he said yes to most. */
export function describeVotes(rows: VoteRow[]): string[] {
  const out: string[] = [];
  const no = biggest(rows, -1);
  if (no) out.push(line("no", no.kind, no.n));
  const yes = biggest(rows, 1);
  if (yes) out.push(line("yes", yes.kind, yes.n));
  return out;
}
