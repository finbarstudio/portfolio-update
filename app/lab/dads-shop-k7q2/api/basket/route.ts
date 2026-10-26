import { failed, json, notConnected } from "@/lib/dad-shop/api";
import { getDb } from "@/lib/dad-shop/db";
import { buildWeeklyBasket, getLastBasket } from "@/lib/dad-shop/queries";

export const dynamic = "force-dynamic";

/** The last saved basket, or null. */
export async function GET(): Promise<Response> {
  const sql = getDb();
  if (!sql) return notConnected();
  try {
    return json({ basket: await getLastBasket(sql) });
  } catch (err) {
    return failed(err);
  }
}

/** Makes this week's basket. buildWeeklyBasket never throws; it falls back to the last one. */
export async function POST(): Promise<Response> {
  const sql = getDb();
  if (!sql) return notConnected();
  try {
    return json({ basket: await buildWeeklyBasket(sql) });
  } catch (err) {
    return failed(err);
  }
}
