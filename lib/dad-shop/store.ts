import type { StoreStatus } from "./types";

/**
 * What the "At Chislehurst" chip says. His own report and the daily range feed
 * give a status (yes / likely / unlikely / unknown / no); the live stock check
 * from Just Eat can add "out of stock right now" on top of a yes or likely.
 * Pure, so it can be tested; the database decides what counts as fresh.
 */

/** A stock reading older than this is ignored (the SQL in catalog.ts uses the same number). */
export const STOCK_FRESH_HOURS = 6;

export type StockState = "in" | "out";
export type ChipTone = "g" | "a" | "n" | "r";

export interface StoreView {
  text: string;
  tone: ChipTone;
  /** What a tap shows: the reason, and the stock reading when there is one. */
  detail: string;
}

/** "2:15pm" in UK time, whatever the phone's own time zone. */
export function timeLabel(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Europe/London" })
    .format(d)
    .replace(/\s/g, "")
    .toLowerCase();
}

const sentence = (s: string): string => (/[.!?]$/.test(s) ? s : `${s}.`);

export function storeView(status: StoreStatus, reason: string | null, stock: StockState | null = null, stockAt: string | null = null): StoreView {
  const sure = status === "yes" || status === "likely";
  const at = stockAt ? timeLabel(stockAt) : "";
  if (sure && stock === "out") {
    return {
      text: "At Chislehurst · out today",
      tone: "a",
      detail: `Chislehurst usually has it, but it's showing out of stock right now${at ? ` (checked ${at})` : ""}`,
    };
  }
  if (sure) {
    const base = reason ?? (status === "yes" ? "On the Chislehurst shelf list." : "Probably on the shelf at Chislehurst.");
    return { text: "At Chislehurst ✓", tone: "g", detail: stock === "in" && at ? `${sentence(base)} In stock at ${at}.` : base };
  }
  if (status === "no") return { text: "Not at Chislehurst", tone: "r", detail: reason ?? "Not on the Chislehurst shelf list." };
  return { text: "Check in store", tone: "n", detail: reason ?? "Not sure it is stocked at Chislehurst. Worth a look when you are there." };
}
