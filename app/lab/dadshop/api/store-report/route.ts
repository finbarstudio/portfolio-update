import { badRequest, failed, json, notConnected } from "@/lib/dad-shop/api";
import { getDb } from "@/lib/dad-shop/db";
import { setStoreReport } from "@/lib/dad-shop/queries";
import { parseProductId, parseReportStatus, readJsonBody } from "@/lib/dad-shop/validate";

export const dynamic = "force-dynamic";

/** "Found it here" or "Not here", from the buttons on a product page. */
export async function POST(request: Request): Promise<Response> {
  const sql = getDb();
  if (!sql) return notConnected();
  const body = await readJsonBody(request);
  if (!body.ok) return badRequest(body.error, body.status);
  const id = parseProductId(body.body.productId);
  if (!id.ok) return badRequest(id.error);
  const status = parseReportStatus(body.body.status);
  if (!status.ok) return badRequest(status.error);
  try {
    const found = await setStoreReport(sql, id.value, status.value, "button");
    if (!found) return badRequest("I couldn't find that product.", 404);
    return json({ status: status.value });
  } catch (err) {
    return failed(err);
  }
}
