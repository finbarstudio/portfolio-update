import { badRequest, failed, json, notConnected } from "@/lib/dad-shop/api";
import { getDb } from "@/lib/dad-shop/db";
import { setRating } from "@/lib/dad-shop/queries";
import { parseProductId, parseStars, readJsonBody } from "@/lib/dad-shop/validate";

export const dynamic = "force-dynamic";

/** Saves a 1-5 star rating, or clears it when `stars` is null. */
export async function POST(request: Request): Promise<Response> {
  const sql = getDb();
  if (!sql) return notConnected();
  const body = await readJsonBody(request);
  if (!body.ok) return badRequest(body.error, body.status);
  const id = parseProductId(body.body.productId);
  if (!id.ok) return badRequest(id.error);
  const stars = parseStars(body.body.stars);
  if (!stars.ok) return badRequest(stars.error);
  try {
    const found = await setRating(sql, id.value, stars.value);
    if (!found) return badRequest("I couldn't find that product.", 404);
    return json({ stars: stars.value });
  } catch (err) {
    return failed(err);
  }
}
