import { badRequest, failed, json, notConnected } from "@/lib/dad-shop/api";
import { isProductDigits } from "@/lib/dad-shop/app-docs";
import { loadItemDetail } from "@/lib/dad-shop/app-catalog-db";
import { getDb } from "@/lib/dad-shop/db";

export const dynamic = "force-dynamic";

/** One product with what the slim catalogue leaves out: ingredients, raw nutrition, the Fit working, price history. */
export async function GET(_request: Request, ctx: { params: Promise<{ id: string }> }): Promise<Response> {
  const { id } = await ctx.params;
  if (!isProductDigits(id)) return badRequest("That product isn't valid.");
  const sql = getDb();
  if (!sql) return notConnected();
  try {
    const item = await loadItemDetail(sql, id);
    if (!item) return badRequest("I couldn't find that product.", 404);
    return json(item);
  } catch (err) {
    return failed(err);
  }
}
