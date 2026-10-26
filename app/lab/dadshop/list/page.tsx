import NotConnected from "@/components/dad-shop/NotConnected";
import ShopList from "@/components/dad-shop/ShopList";
import { nowIso } from "@/lib/dad-shop/api";
import { getDb } from "@/lib/dad-shop/db";
import { getList, getSettings } from "@/lib/dad-shop/queries";
import { DEFAULT_SETTINGS, type ListItem, type Settings } from "@/lib/dad-shop/types";

export const dynamic = "force-dynamic";

/** The shopping list. */
export default async function ListPage() {
  const sql = getDb();
  if (!sql) return <NotConnected />;

  let initial: ListItem[] = [];
  let settings: Settings = DEFAULT_SETTINGS;
  let loadFailed = false;
  try {
    [initial, settings] = await Promise.all([getList(sql), getSettings(sql)]);
  } catch (err) {
    // The page still opens, from what his phone saved last.
    console.error("[dad-shop] list failed to load:", err instanceof Error ? err.message : err);
    loadFailed = true;
  }
  return <ShopList initial={initial} loadFailed={loadFailed} settings={settings} nowIso={nowIso()} />;
}
