import { badRequest, failed, json, notConnected } from "@/lib/food-shop/api";
import { clientIp, readGuardedJson, startSession } from "@/lib/food-shop/auth";
import { hashPassword, normaliseEmail, normaliseInvite, normaliseName, validatePassword } from "@/lib/food-shop/auth-core";
import { getDb } from "@/lib/food-shop/db";

export const dynamic = "force-dynamic";

const BAD_INVITE = "That invite code isn't valid or has been used up.";
const TOO_MANY = "Too many tries. Wait 15 minutes and try again.";
const MAX_BAD_INVITES_PER_IP = 10;

/** A known, user-facing reason to abandon the transaction. */
class SignupError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

/** Makes an account from an invite code and logs the new user straight in. */
export async function POST(request: Request): Promise<Response> {
  const sql = getDb();
  if (!sql) return notConnected();
  const body = await readGuardedJson(request);
  if (!body.ok) return badRequest(body.error, body.status);

  const email = normaliseEmail(body.body.email);
  if (!email.ok) return badRequest(email.error);
  const password = validatePassword(body.body.password, email.value);
  if (!password.ok) return badRequest(password.error);
  const name = normaliseName(body.body.name);
  if (!name.ok) return badRequest(name.error);
  const invite = normaliseInvite(body.body.invite);
  // A code that can't possibly exist gets the same answer as one that was used up.
  if (!invite.ok) return badRequest(BAD_INVITE);
  const ip = clientIp(request);

  try {
    // Wrong invite codes are counted per address (email 'invite:' marks them apart from logins).
    const [recent] = await sql<{ n: number }[]>`
      select count(*)::int as n from login_attempts
      where email = 'invite:' and ip = ${ip} and at > now() - interval '15 minutes'`;
    if (recent.n >= MAX_BAD_INVITES_PER_IP) return badRequest(TOO_MANY, 429);
    // Cheap check before the slow password hash, so junk signups don't burn CPU. The claim
    // below still decides (two people could race for the last use).
    const [usable] = await sql`select 1 from invites where code = ${invite.value} and uses < max_uses`;
    if (!usable) {
      await sql`insert into login_attempts (email, ip) values ('invite:', ${ip})`;
      return badRequest(BAD_INVITE);
    }
    const hash = await hashPassword(password.value);
    // One transaction: if the email is taken, the invite use is rolled back too.
    await sql.begin(async (tx) => {
      const claimed = await tx`
        update invites set uses = uses + 1
        where code = ${invite.value} and uses < max_uses
        returning code`;
      if (claimed.length === 0) throw new SignupError(400, BAD_INVITE);
      const created = await tx<{ id: string }[]>`
        insert into users (email, name, password_hash, invite_code)
        values (${email.value}, ${name.value}, ${hash}, ${invite.value})
        returning id`;
      await startSession(tx, created[0].id);
    });
    return json({ ok: true, setupDone: false });
  } catch (err) {
    if (err instanceof SignupError) return badRequest(err.message, err.status);
    // 23505 is Postgres' unique violation: the only unique column we insert is the email.
    if (typeof err === "object" && err !== null && "code" in err && err.code === "23505") {
      return badRequest("There's already an account with that email. Try logging in.", 409);
    }
    return failed(err);
  }
}
