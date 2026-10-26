import { badRequest, failed, json, notConnected } from "@/lib/dad-shop/api";
import { getDb } from "@/lib/dad-shop/db";
import { getFreshness, getSettings, saveSettings } from "@/lib/dad-shop/queries";
import { parseSettingsPatch, readJsonBody } from "@/lib/dad-shop/validate";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const sql = getDb();
  if (!sql) return notConnected();
  try {
    const [settings, freshness] = await Promise.all([getSettings(sql), getFreshness(sql)]);
    return json({ settings, freshness });
  } catch (err) {
    return failed(err);
  }
}

/** Saves budget, people and protein per day. */
export async function POST(request: Request): Promise<Response> {
  const sql = getDb();
  if (!sql) return notConnected();
  const body = await readJsonBody(request);
  if (!body.ok) return badRequest(body.error, body.status);
  const patch = parseSettingsPatch(body.body);
  if (!patch.ok) return badRequest(patch.error);
  try {
    await saveSettings(sql, patch.value);
    return json({ settings: await getSettings(sql) });
  } catch (err) {
    return failed(err);
  }
}
