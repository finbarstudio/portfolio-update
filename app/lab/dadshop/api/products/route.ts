import { badRequest, failed, json, notConnected } from "@/lib/dad-shop/api";
import { getDb } from "@/lib/dad-shop/db";
import { searchProducts } from "@/lib/dad-shop/queries";
import { parseFindParams, parseLimit } from "@/lib/dad-shop/validate";

export const dynamic = "force-dynamic";

/** Find: search, filters, sort and paging. Also feeds the add-item dropdown. */
export async function GET(request: Request): Promise<Response> {
  const sql = getDb();
  if (!sql) return notConnected();
  const params = new URL(request.url).searchParams;
  const filters = parseFindParams(params);
  if (!filters.ok) return badRequest(filters.error);
  try {
    return json(await searchProducts(sql, filters.value, parseLimit(params)));
  } catch (err) {
    return failed(err);
  }
}
