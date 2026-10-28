import { badRequest, failed, json, notConnected } from "@/lib/dad-shop/api";
import { parseStoreReportPost, readBodyUpTo } from "@/lib/dad-shop/app-docs";
import { getDb } from "@/lib/dad-shop/db";
import { setStoreReport } from "@/lib/dad-shop/queries";

export const dynamic = "force-dynamic";

/**
 * `{ id, status: "found" | "missing", source: "button" | "tick" }`: Dad's own report from the shop. It beats the range
 * feed and the live stock reading everywhere (see store_eff in catalog.ts). The older api/store-report takes
 * `productId` and no source, so it doesn't fit the app's contract; both end in the same setStoreReport.
 */
export async function POST(request: Request): Promise<Response> {
  const sql = getDb();
  if (!sql) return notConnected();
  const body = await readBodyUpTo(request, 1024);
  if (!body.ok) return badRequest(body.error, body.status);
  const report = parseStoreReportPost(body.body);
  if (!report.ok) return badRequest(report.error);
  try {
    const found = await setStoreReport(sql, report.value.id, report.value.status, report.value.source);
    if (!found) return badRequest("I couldn't find that product.", 404);
    return json({ status: report.value.status });
  } catch (err) {
    return failed(err);
  }
}
