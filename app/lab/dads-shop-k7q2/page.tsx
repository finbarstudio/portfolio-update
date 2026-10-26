import NotConnected from "@/components/dad-shop/NotConnected";
import ShopList from "@/components/dad-shop/ShopList";
import { nowIso } from "@/lib/dad-shop/api";
import { getDb } from "@/lib/dad-shop/db";
import { getList } from "@/lib/dad-shop/queries";
import type { ListItem } from "@/lib/dad-shop/types";

export const dynamic = "force-dynamic";

/** The shopping list: the home screen. */
export default async function ListPage() {
  const sql = getDb();
  if (!sql) return <NotConnected />;

  let initial: ListItem[] = [];
  let loadFailed = false;
  try {
    initial = await getList(sql);
  } catch (err) {
    // The page still opens, from what his phone saved last.
    console.error("[dad-shop] list failed to load:", err instanceof Error ? err.message : err);
    loadFailed = true;
  }
  return <ShopList initial={initial} loadFailed={loadFailed} nowIso={nowIso()} />;
}
