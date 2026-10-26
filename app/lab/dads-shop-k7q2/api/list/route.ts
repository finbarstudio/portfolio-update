import { badRequest, failed, json, notConnected } from "@/lib/dad-shop/api";
import { getDb } from "@/lib/dad-shop/db";
import { applyListAction, getList } from "@/lib/dad-shop/queries";
import { parseListAction, readJsonBody } from "@/lib/dad-shop/validate";

export const dynamic = "force-dynamic";

/** The shopping list. */
export async function GET(): Promise<Response> {
  const sql = getDb();
  if (!sql) return notConnected();
  try {
    return json({ items: await getList(sql) });
  } catch (err) {
    return failed(err);
  }
}

/** One change to the list. Answers with the whole list so the phone can resync. */
export async function POST(request: Request): Promise<Response> {
  const sql = getDb();
  if (!sql) return notConnected();
  const body = await readJsonBody(request);
  if (!body.ok) return badRequest(body.error, body.status);
  const action = parseListAction(body.body);
  if (!action.ok) return badRequest(action.error);
  try {
    const done = await applyListAction(sql, action.value);
    if (!done.found) return badRequest("I couldn't find that product.", 404);
    return json({ id: done.id, items: await getList(sql) });
  } catch (err) {
    return failed(err);
  }
}
