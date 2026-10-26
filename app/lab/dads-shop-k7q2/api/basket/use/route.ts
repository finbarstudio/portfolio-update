import { badRequest, failed, json, notConnected } from "@/lib/dad-shop/api";
import { getDb } from "@/lib/dad-shop/db";
import { addBasketToList, getList } from "@/lib/dad-shop/queries";
import { parseListId, readJsonBody } from "@/lib/dad-shop/validate";

export const dynamic = "force-dynamic";

/** "Add all to my list": puts a basket's items on the list, skipping what is already there. */
export async function POST(request: Request): Promise<Response> {
  const sql = getDb();
  if (!sql) return notConnected();
  const body = await readJsonBody(request);
  if (!body.ok) return badRequest(body.error, body.status);
  let basketId: number | null = null;
  if (body.body.basketId !== undefined && body.body.basketId !== null) {
    const id = parseListId(body.body.basketId);
    if (!id.ok) return badRequest("That basket isn't valid.");
    basketId = id.value;
  }
  try {
    const done = await addBasketToList(sql, basketId);
    if (!done) return badRequest("There is no basket to add yet.", 404);
    return json({ ...done, items: await getList(sql) });
  } catch (err) {
    return failed(err);
  }
}
