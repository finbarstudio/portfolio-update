import "server-only";
import { cookies } from "next/headers";
import type postgres from "postgres";
import { cache } from "react";
import { getDb } from "./db";
import { hashToken, newSessionToken, SESSION_COOKIE, SESSION_DAYS } from "./auth-core";

/**
 * The cookie and database half of the food shop's login. A session is a random token in an
 * httpOnly cookie; the database only ever holds its sha256, so a leaked table can't be
 * replayed. Hashing and validation live in auth-core.ts.
 */

/** Either the pool or a transaction, so signup can start a session inside its transaction. */
type Queryable = postgres.ISql;

export interface CurrentUser {
  id: string;
  email: string;
  name: string | null;
  setupDone: boolean;
}

interface UserRow {
  id: string;
  email: string;
  name: string | null;
  setup_done: boolean;
  stale: boolean;
}

/**
 * Who is logged in, or null. Cached per request, so a page can call it from the layout, the
 * page and a component and still hit the database once. Bumps `last_seen_at` at most hourly.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const sql = getDb();
  if (!sql) return null;
  const rows = await sql<UserRow[]>`
    select u.id, u.email, u.name, coalesce(st.setup_done, false) as setup_done,
           (u.last_seen_at is null or u.last_seen_at < now() - interval '1 hour') as stale
    from sessions s
    join users u on u.id = s.user_id
    left join settings st on st.user_id = u.id
    where s.token_hash = ${hashToken(token)} and s.expires_at > now()`;
  const row = rows[0];
  if (!row) return null;
  if (row.stale) {
    // Housekeeping only: a failure here must never log someone out.
    await sql`update users set last_seen_at = now() where id = ${row.id}`.catch(() => undefined);
  }
  return { id: row.id, email: row.email, name: row.name, setupDone: row.setup_done };
});

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

/** Opens a session for this user and sets the cookie. Call it from a route handler. */
export async function startSession(sql: Queryable, userId: string): Promise<void> {
  const token = newSessionToken();
  // the browser's previous session (logging in while logged in) goes, and so does anything expired
  const previous = (await cookies()).get(SESSION_COOKIE)?.value;
  if (previous) await sql`delete from sessions where token_hash = ${hashToken(previous)}`;
  await sql`delete from sessions where expires_at < now()`;
  await sql`
    insert into sessions (token_hash, user_id, expires_at)
    values (${hashToken(token)}, ${userId}, now() + make_interval(days => ${SESSION_DAYS}::int))`;
  (await cookies()).set(SESSION_COOKIE, token, cookieOptions(SESSION_DAYS * 24 * 60 * 60));
}

/** Logs out this browser: drops its session row and clears the cookie. */
export async function endSession(sql: Queryable): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await sql`delete from sessions where token_hash = ${hashToken(token)}`;
  store.set(SESSION_COOKIE, "", cookieOptions(0));
}

/**
 * CSRF defence on top of sameSite=lax, for POSTs. A browser always sends Origin on a
 * cross-site POST, so if it is there its host must be ours. And the body must be JSON, which a
 * plain cross-site form can't send. Requests with no Origin (curl, scripts) pass the first check.
 */
export function requireSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (origin !== null) {
    const host = request.headers.get("host");
    try {
      if (!host || new URL(origin).host.toLowerCase() !== host.toLowerCase()) return false;
    } catch {
      return false;
    }
  }
  return (request.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase() === "application/json";
}

/**
 * The visitor's address for throttling: x-real-ip (Vercel sets it), else the first x-forwarded-for
 * entry. IPv6 is keyed on its /64, since one connection can rotate freely inside that block.
 */
export function clientIp(request: Request): string | null {
  const raw = request.headers.get("x-real-ip")?.trim() || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (!raw) return null;
  const ip = raw.slice(0, 64);
  return ip.includes(":") ? `${ip.split(":").slice(0, 4).join(":")}::/64` : ip;
}

const MAX_BODY_BYTES = 10 * 1024;

export type BodyResult = { ok: true; body: Record<string, unknown> } | { ok: false; status: number; error: string };

/**
 * Checks a POST came from our own pages and reads its JSON object body, never more than 10KB.
 * Rejects on Content-Length first, then counts bytes as they stream in so a body with no (or a
 * lying) length is still cut off.
 */
export async function readGuardedJson(request: Request, maxBytes = MAX_BODY_BYTES): Promise<BodyResult> {
  if (!requireSameOrigin(request)) {
    return { ok: false, status: 403, error: "That request didn't come from the shop's own page." };
  }
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > maxBytes) return { ok: false, status: 413, error: "That is too big." };
  if (!request.body) return { ok: false, status: 400, error: "Nothing was sent." };

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel().catch(() => undefined);
      return { ok: false, status: 413, error: "That is too big." };
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let at = 0;
  for (const c of chunks) {
    bytes.set(c, at);
    at += c.byteLength;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return { ok: false, status: 400, error: "That wasn't valid JSON." };
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return { ok: false, status: 400, error: "Send a JSON object." };
  }
  return { ok: true, body: parsed as Record<string, unknown> };
}
