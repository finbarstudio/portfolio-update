/** Small formatting helpers shared by pages and client components. Pure. */

export const gbp = (n: number | null | undefined): string => (n == null ? "–" : `£${n.toFixed(2)}`);

/** £6 for a whole number of pounds, £4.50 otherwise. */
export const gbpShort = (n: number): string => (Number.isInteger(n) ? `£${n}` : `£${n.toFixed(2)}`);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "17/11/2026" (as scraped) to "17 Nov"; null when it isn't a date. */
export function shortDate(dmy: string | null | undefined): string | null {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(dmy ?? "");
  if (!m) return null;
  const month = MONTHS[Number(m[2]) - 1];
  return month ? `${Number(m[1])} ${month}` : null;
}

/** "Prices updated" wording: just now / 12 min ago / 3 h ago / 2 days ago. */
export function timeAgo(then: Date, now: Date = new Date()): string {
  const mins = Math.max(0, Math.round((now.getTime() - then.getTime()) / 60_000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

/** The text a "Copy list" line uses: `2 × Tesco Chicken Breast Fillets 640g, £4.50`. */
export function listLine(name: string, qty: number, lineTotal: number | null): string {
  return `${qty} × ${name}${lineTotal == null ? "" : `, ${gbp(lineTotal)}`}`;
}
