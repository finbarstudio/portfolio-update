import { badRequest, failed, json, notConnected, unauthorized } from "@/lib/food-shop/api";
import { getCurrentUser, readGuardedJson } from "@/lib/food-shop/auth";
import { getDb } from "@/lib/food-shop/db";
import { parseSettings } from "@/lib/food-shop/settings";

export const dynamic = "force-dynamic";

/** Saves their settings (setup or the settings page). The app scores products from them in the browser. */
export async function POST(request: Request): Promise<Response> {
  const sql = getDb();
  if (!sql) return notConnected();
  const body = await readGuardedJson(request);
  if (!body.ok) return badRequest(body.error, body.status);
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const settings = parseSettings(body.body.settings);
  if (!settings.ok) return badRequest(settings.error);
  try {
    await sql`
      insert into settings (user_id, data, setup_done, updated_at)
      values (${user.id}, ${JSON.stringify(settings.value)}::text::jsonb, true, now())
      on conflict (user_id) do update set data = excluded.data, setup_done = true, updated_at = now()`;
    return json({ ok: true });
  } catch (err) {
    return failed(err);
  }
}
