import { badRequest, failed, json, notConnected } from "@/lib/dad-shop/api";
import { getDb } from "@/lib/dad-shop/db";
import { setNotAtStore } from "@/lib/dad-shop/queries";
import { parseBool, parseProductId, readJsonBody } from "@/lib/dad-shop/validate";

export const dynamic = "force-dynamic";

/** Marks (or unmarks) a product as not stocked at his store. */
export async function POST(request: Request): Promise<Response> {
  const sql = getDb();
  if (!sql) return notConnected();
  const body = await readJsonBody(request);
  if (!body.ok) return badRequest(body.error, body.status);
  const id = parseProductId(body.body.productId);
  if (!id.ok) return badRequest(id.error);
  const value = parseBool(body.body.value);
  if (!value.ok) return badRequest(value.error);
  try {
    const found = await setNotAtStore(sql, id.value, value.value);
    if (!found) return badRequest("I couldn't find that product.", 404);
    return json({ notAtStore: value.value });
  } catch (err) {
    return failed(err);
  }
}
