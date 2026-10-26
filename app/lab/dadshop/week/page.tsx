import NotConnected from "@/components/dad-shop/NotConnected";
import WeekView from "@/components/dad-shop/WeekView";
import { nowIso } from "@/lib/dad-shop/api";
import { getDb } from "@/lib/dad-shop/db";
import { getLastBasket } from "@/lib/dad-shop/queries";
import type { BasketView } from "@/lib/dad-shop/types";

export const dynamic = "force-dynamic";

/** This week's basket: shows the last one, and makes a new one on request. */
export default async function WeekPage() {
  const sql = getDb();
  if (!sql) return <NotConnected />;

  let last: BasketView | null = null;
  try {
    last = await getLastBasket(sql);
  } catch (err) {
    // The page still opens; making a new basket may work even if reading the old one did not.
    console.error("[dad-shop] last basket failed to load:", err instanceof Error ? err.message : err);
  }
  return <WeekView initial={last} nowIso={nowIso()} />;
}
