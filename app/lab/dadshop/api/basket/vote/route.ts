import { badRequest, failed, json, notConnected } from "@/lib/dad-shop/api";
import { getDb } from "@/lib/dad-shop/db";
import { setVote } from "@/lib/dad-shop/queries";
import { parseProductId, parseVote, readJsonBody } from "@/lib/dad-shop/validate";

export const dynamic = "force-dynamic";

/** Yes (1) or No (-1) on a basket pick, or null to take the answer back. */
export async function POST(request: Request): Promise<Response> {
  const sql = getDb();
  if (!sql) return notConnected();
  const body = await readJsonBody(request);
  if (!body.ok) return badRequest(body.error, body.status);
  const id = parseProductId(body.body.productId);
  if (!id.ok) return badRequest(id.error);
  const vote = parseVote(body.body.vote);
  if (!vote.ok) return badRequest(vote.error);
  try {
    const found = await setVote(sql, id.value, vote.value);
    if (!found) return badRequest("I couldn't find that product.", 404);
    return json({ vote: vote.value });
  } catch (err) {
    return failed(err);
  }
}
