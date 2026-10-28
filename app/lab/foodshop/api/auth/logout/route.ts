import { badRequest, failed, json, notConnected } from "@/lib/food-shop/api";
import { endSession, readGuardedJson } from "@/lib/food-shop/auth";
import { getDb } from "@/lib/food-shop/db";

export const dynamic = "force-dynamic";

/** Logs this browser out. Send `{}` as the JSON body. */
export async function POST(request: Request): Promise<Response> {
  const sql = getDb();
  if (!sql) return notConnected();
  const body = await readGuardedJson(request);
  if (!body.ok) return badRequest(body.error, body.status);
  try {
    await endSession(sql);
    return json({ ok: true });
  } catch (err) {
    return failed(err);
  }
}
