/**
 * Food shop admin: invites, users and password resets. Run from the site repo:
 *
 *   bun --env-file=.env.local scripts/food-shop-admin.ts help
 *
 * Talks to the database directly (not through the site), so it works for anything the
 * web app can't do: there is no email, so a forgotten password is reset here.
 */
import postgres from "postgres";
import { hashPassword, MIN_INVITE, newInviteCode, normaliseEmail, normaliseInvite } from "../lib/food-shop/auth-core";
import { randomBytes } from "node:crypto";

const HELP = `Food shop admin

  invite [code] [--uses N] [--note "who it's for"]   make an invite code (random if no code given), or raise its uses
  invites                                            list invite codes and how many are used
  users                                              list accounts
  reset-password <email>                             set a new random password (printed once) and log them out everywhere
  delete-user <email>                                delete an account and everything it owns
  help                                               this text

Database: FOOD_SHOP_DB_DATABASE_URL_UNPOOLED, else FOOD_SHOP_DATABASE_URL, else DATABASE_URL.`;

class UsageError extends Error {}

const url = process.env.FOOD_SHOP_DB_DATABASE_URL_UNPOOLED ?? process.env.FOOD_SHOP_DATABASE_URL ?? process.env.DATABASE_URL;

/** Parsed command line: positional words, plus --flag value pairs. */
function parseArgs(args: string[]): { words: string[]; flags: Map<string, string> } {
  const words: string[] = [];
  const flags = new Map<string, string>();
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      const value = args[i + 1];
      if (value === undefined) throw new UsageError(`${arg} needs a value.`);
      flags.set(arg.slice(2), value);
      i++;
    } else {
      words.push(arg);
    }
  }
  return { words, flags };
}

function table(headers: string[], rows: string[][]): string {
  const widths = headers.map((h, i) => Math.max(h.length, ...rows.map((r) => r[i].length)));
  const line = (cells: string[]) => cells.map((c, i) => c.padEnd(widths[i])).join("  ").trimEnd();
  return [line(headers), line(widths.map((w) => "-".repeat(w))), ...rows.map(line)].join("\n");
}

const day = (d: Date | null) => (d ? d.toISOString().slice(0, 16).replace("T", " ") : "-");

async function main(): Promise<void> {
  const [command = "help", ...rest] = process.argv.slice(2);
  if (command === "help" || command === "--help" || command === "-h") {
    console.log(HELP);
    return;
  }
  if (!url) throw new UsageError("No database URL. Run with --env-file=.env.local, or set FOOD_SHOP_DATABASE_URL.");
  const { words, flags } = parseArgs(rest);
  const sql = postgres(url, { max: 1, prepare: false, onnotice: () => undefined });
  try {
    switch (command) {
      case "invite": {
        const code = normaliseInvite(words[0] ?? newInviteCode());
        if (!code.ok) throw new UsageError(`${code.error} Use letters, numbers and dashes, ${MIN_INVITE}-40 long, or leave it out for a random one.`);
        const usesRaw = flags.get("uses") ?? "1";
        const uses = Number(usesRaw);
        if (!Number.isInteger(uses) || uses < 1 || uses > 10000) throw new UsageError("--uses should be a whole number from 1 to 10000.");
        const note = flags.get("note")?.trim() || null;
        const [row] = await sql<{ code: string; uses: number; max_uses: number; note: string | null }[]>`
          insert into invites (code, max_uses, note) values (${code.value}, ${uses}, ${note})
          on conflict (code) do update
            set max_uses = greatest(invites.max_uses, excluded.max_uses), note = coalesce(excluded.note, invites.note)
          returning code, uses, max_uses, note`;
        console.log(`Invite ${row.code}: ${row.uses}/${row.max_uses} used${row.note ? ` (${row.note})` : ""}`);
        return;
      }
      case "invites": {
        const rows = await sql<{ code: string; uses: number; max_uses: number; note: string | null }[]>`
          select code, uses, max_uses, note from invites order by created_at`;
        if (rows.length === 0) return console.log("No invites yet.");
        console.log(table(["code", "uses", "note"], rows.map((r) => [r.code, `${r.uses}/${r.max_uses}`, r.note ?? ""])));
        return;
      }
      case "users": {
        const rows = await sql<{ email: string; name: string | null; created_at: Date; last_seen_at: Date | null; setup_done: boolean }[]>`
          select u.email, u.name, u.created_at, u.last_seen_at, coalesce(s.setup_done, false) as setup_done
          from users u left join settings s on s.user_id = u.id
          order by u.created_at`;
        if (rows.length === 0) return console.log("No users yet.");
        console.log(
          table(
            ["email", "name", "created", "last seen", "setup done"],
            rows.map((r) => [r.email, r.name ?? "", day(r.created_at), day(r.last_seen_at), r.setup_done ? "yes" : "no"]),
          ),
        );
        return;
      }
      case "reset-password": {
        const email = normaliseEmail(words[0]);
        if (!email.ok) throw new UsageError(email.error);
        // Generated, never typed: a password on the command line ends up in shell history.
        const password = { value: randomBytes(9).toString("base64url") };
        const hash = await hashPassword(password.value);
        const done = await sql.begin(async (tx) => {
          const updated = await tx<{ id: string }[]>`update users set password_hash = ${hash} where email = ${email.value} returning id`;
          if (updated.length === 0) return null;
          const dropped = await tx`delete from sessions where user_id = ${updated[0].id}`;
          await tx`delete from login_attempts where email = ${email.value}`;
          return dropped.count;
        });
        if (done === null) throw new UsageError(`No account for ${email.value}.`);
        console.log(`Password reset for ${email.value}. New password: ${password.value}\nLogged out of ${done} session${done === 1 ? "" : "s"}.`);
        return;
      }
      case "delete-user": {
        const email = normaliseEmail(words[0]);
        if (!email.ok) throw new UsageError(email.error);
        const [gone] = await sql<{ email: string; sessions: number; docs: number }[]>`
          with u as (select id, email from users where email = ${email.value}),
               counts as (
                 select u.email,
                        (select count(*)::int from sessions where user_id = u.id) as sessions,
                        (select count(*)::int from user_docs where user_id = u.id) as docs
                 from u),
               del as (delete from users where id in (select id from u))
          select * from counts`;
        if (!gone) throw new UsageError(`No account for ${email.value}.`);
        console.log(`Deleted ${gone.email} (${gone.sessions} sessions, ${gone.docs} saved documents: basket, ratings, past shops…, plus their settings and area reports).`);
        return;
      }
      default:
        throw new UsageError(`I don't know "${command}".\n\n${HELP}`);
    }
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((err: unknown) => {
  console.error(err instanceof UsageError ? err.message : `Failed: ${err instanceof Error ? err.message : String(err)}`);
  process.exitCode = 1;
});
