import { badRequest, failed, json, notConnected, unauthorized } from "@/lib/food-shop/api";
import { getCurrentUser, readGuardedJson } from "@/lib/food-shop/auth";
import { getDb } from "@/lib/food-shop/db";
import { areaOf, parseSettings } from "@/lib/food-shop/settings";
import { parseProductId } from "@/lib/food-shop/validate";

export const dynamic = "force-dynamic";

/**
 * "Not available to me", per postcode area:
 *   { productId, unavailable: true }   report it: hidden for everyone in their area
 *   { productId, unavailable: false }  "it's available to me": clears every report for it in their area
 */
export async function POST(request: Request): Promise<Response> {
  const sql = getDb();
  if (!sql) return notConnected();
  const body = await readGuardedJson(request);
  if (!body.ok) return badRequest(body.error, body.status);
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const id = parseProductId(body.body.productId);
  if (!id.ok) return badRequest(id.error);
  if (typeof body.body.unavailable !== "boolean") return badRequest("Say whether it's available or not.");
  try {
    const [row] = await sql<{ data: unknown }[]>`select data from settings where user_id = ${user.id}`;
    const settings = row ? parseSettings(row.data) : null;
    const area = settings?.ok ? areaOf(settings.value) : null;
    if (!area) return badRequest("Add your postcode in Settings first, so this only applies near you.");
    if (body.body.unavailable) {
      const [exists] = await sql`select 1 from products where id = ${id.value}`;
      if (!exists) return badRequest("I couldn't find that product.", 404);
      await sql`
        insert into unavailable_reports (area, product_id, user_id) values (${area}, ${id.value}, ${user.id})
        on conflict do nothing`;
    } else {
      await sql`delete from unavailable_reports where area = ${area} and product_id = ${id.value}`;
    }
    return json({ ok: true, area });
  } catch (err) {
    return failed(err);
  }
}
