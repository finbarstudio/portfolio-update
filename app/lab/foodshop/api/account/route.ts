import { badRequest, failed, json, notConnected, unauthorized } from "@/lib/food-shop/api";
import { endSession, getCurrentUser, readGuardedJson } from "@/lib/food-shop/auth";
import { verifyPassword } from "@/lib/food-shop/auth-core";
import { getDb } from "@/lib/food-shop/db";

export const dynamic = "force-dynamic";

/**
 * The account's own data (UK GDPR rights of access and erasure):
 *   GET     everything stored about them, as a JSON file to download
 *   DELETE  { password }  deletes the account and everything it owns, then logs them out
 */
export async function GET(): Promise<Response> {
  const sql = getDb();
  if (!sql) return notConnected();
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  try {
    const [[account], [settings], docs, reports, sessions] = await Promise.all([
      sql<{ email: string; name: string | null; created_at: Date; last_seen_at: Date | null }[]>`select email, name, created_at, last_seen_at from users where id = ${user.id}`,
      sql<{ data: unknown; updated_at: Date }[]>`select data, updated_at from settings where user_id = ${user.id}`,
      sql<{ kind: string; data: unknown; updated_at: Date }[]>`select kind, data, updated_at from user_docs where user_id = ${user.id} order by kind`,
      sql<{ area: string; product_id: string; created_at: Date }[]>`select area, product_id, created_at from unavailable_reports where user_id = ${user.id} order by created_at`,
      sql<{ created_at: Date; expires_at: Date }[]>`select created_at, expires_at from sessions where user_id = ${user.id} order by created_at`,
    ]);
    const body = {
      exportedAt: new Date().toISOString(),
      note: "Everything the food shop beta stores about you. Your password is stored only as a one-way scrambled hash, so it isn't included.",
      account,
      settings: settings ?? null,
      saved: Object.fromEntries(docs.map((d) => [d.kind, { data: d.data, updatedAt: d.updated_at }])),
      notAvailableReports: reports,
      signedInDevices: sessions,
    };
    return new Response(JSON.stringify(body, null, 2), {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "content-disposition": `attachment; filename="food-shop-my-data.json"`,
        "cache-control": "private, no-store",
      },
    });
  } catch (err) {
    return failed(err);
  }
}

const MAX_TRIES = 10;

export async function DELETE(request: Request): Promise<Response> {
  const sql = getDb();
  if (!sql) return notConnected();
  const body = await readGuardedJson(request);
  if (!body.ok) return badRequest(body.error, body.status);
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const { password } = body.body;
  if (typeof password !== "string" || password.length === 0) return badRequest("Enter your password to confirm.");
  try {
    // wrong passwords count toward the same limit as logging in
    await sql`insert into login_attempts (email, ip) values (${user.email}, null)`;
    const [recent] = await sql<{ n: number }[]>`select count(*)::int as n from login_attempts where email = ${user.email} and at > now() - interval '15 minutes'`;
    if (recent.n > MAX_TRIES) return badRequest("Too many tries. Wait 15 minutes and try again.", 429);
    const [row] = await sql<{ password_hash: string }[]>`select password_hash from users where id = ${user.id}`;
    if (!row || !(await verifyPassword(password, row.password_hash))) return badRequest("That password isn't right.", 401);
    await endSession(sql);
    // settings, sessions, saved documents and area reports go with it (on delete cascade)
    await sql.begin(async (tx) => {
      await tx`delete from login_attempts where email = ${user.email}`;
      await tx`delete from users where id = ${user.id}`;
    });
    return json({ ok: true });
  } catch (err) {
    return failed(err);
  }
}
