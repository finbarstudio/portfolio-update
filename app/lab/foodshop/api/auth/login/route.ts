import { badRequest, failed, json, notConnected } from "@/lib/food-shop/api";
import { clientIp, readGuardedJson, startSession } from "@/lib/food-shop/auth";
import { normaliseEmail, verifyAgainstDummy, verifyPassword } from "@/lib/food-shop/auth-core";
import { getDb } from "@/lib/food-shop/db";

export const dynamic = "force-dynamic";

const MISMATCH = "That email and password don't match.";
const TOO_MANY = "Too many tries. Wait 15 minutes and try again.";
const MAX_FAILS_PER_EMAIL = 10;
const MAX_FAILS_PER_IP = 30;

/** Logs in with email and password. Wrong guesses are counted and slowed down. */
export async function POST(request: Request): Promise<Response> {
  const sql = getDb();
  if (!sql) return notConnected();
  const body = await readGuardedJson(request);
  if (!body.ok) return badRequest(body.error, body.status);

  const { email: rawEmail, password } = body.body;
  if (typeof rawEmail !== "string" || typeof password !== "string" || password.length === 0) {
    return badRequest("Enter your email and password.");
  }
  // An email that isn't one can't have an account; it gets the ordinary mismatch below.
  const parsed = normaliseEmail(rawEmail);
  const email = parsed.ok ? parsed.value : null;
  const ip = clientIp(request);

  try {
    // Record the attempt BEFORE counting, so a burst of parallel guesses can't all slip under the limit;
    // a successful login clears its email's rows below.
    await sql`insert into login_attempts (email, ip) values (${email}, ${ip})`;
    const [recent] = await sql<{ by_email: number; by_ip: number }[]>`
      select (count(*) filter (where email = ${email}))::int as by_email,
             (count(*) filter (where ip = ${ip}))::int as by_ip
      from login_attempts
      where at > now() - interval '15 minutes'`;
    if (recent.by_email > MAX_FAILS_PER_EMAIL || recent.by_ip > MAX_FAILS_PER_IP) return badRequest(TOO_MANY, 429);

    const users = email
      ? await sql<{ id: string; password_hash: string }[]>`select id, password_hash from users where email = ${email}`
      : [];
    const user = users[0];
    // Same work either way, so the answer's speed doesn't say whether the email has an account.
    const match = user ? await verifyPassword(password, user.password_hash) : await verifyAgainstDummy(password);

    if (!user || !match) {
      // Sweep old rows as we go, so there is no job to run.
      await sql`delete from login_attempts where at < now() - interval '1 day'`;
      return badRequest(MISMATCH, 401);
    }

    await sql`delete from login_attempts where email = ${email}`;
    await startSession(sql, user.id);
    const [setup] = await sql<{ setup_done: boolean }[]>`select setup_done from settings where user_id = ${user.id}`;
    return json({ ok: true, setupDone: setup?.setup_done ?? false });
  } catch (err) {
    return failed(err);
  }
}
