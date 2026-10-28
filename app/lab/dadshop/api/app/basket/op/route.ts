import { badRequest, failed, json, notConnected } from "@/lib/dad-shop/api";
import { basketOp, parseBasketOp, readBodyUpTo } from "@/lib/dad-shop/app-docs";
import { getDb } from "@/lib/dad-shop/db";

export const dynamic = "force-dynamic";

/**
 * One basket change, merged in a single SQL statement so two phones never overwrite each other.
 * `{ id, delta }` adds or takes away (an item at 0 leaves the basket and loses its tick);
 * `{ id, tick: true | false }` ticks it off in the shop (only an item in the basket can be ticked).
 * Answers the whole basket.
 */
export async function POST(request: Request): Promise<Response> {
  const sql = getDb();
  if (!sql) return notConnected();
  const body = await readBodyUpTo(request, 1024);
  if (!body.ok) return badRequest(body.error, body.status);
  const op = parseBasketOp(body.body);
  if (!op.ok) return badRequest(op.error);
  try {
    return json(await basketOp(sql, op.value));
  } catch (err) {
    return failed(err);
  }
}
