import { badRequest, failed, json } from "@/lib/dad-shop/api";
import { emptyBasket, getDoc } from "@/lib/dad-shop/app-docs";
import { getDb } from "@/lib/dad-shop/db";

export const dynamic = "force-dynamic";

/** The basket: `{ items: { [id]: qty }, ticked: { [id]: true }, updated }`. Seeded from his unticked list the first time. */
export async function GET(): Promise<Response> {
  const sql = getDb();
  if (!sql) return json(emptyBasket(new Date().toISOString()));
  try {
    return json(await getDoc(sql, "basket"));
  } catch (err) {
    return failed(err);
  }
}

/** Whole-basket writes are refused: a stale tab used them to overwrite newer changes. Use basket/op. */
export function POST(): Response {
  return badRequest("Reload the page: the basket changes one item at a time (basket/op).", 409);
}
