import "server-only";
import postgres from "postgres";

/**
 * The one place the database is opened. Lazy: nothing connects at import time
 * or at build time, and `getDb()` returns null when DATABASE_URL is not set so
 * pages can show "Not connected yet" and APIs can answer 503.
 */
export type Sql = postgres.Sql;

// Cached on globalThis so dev hot-reloads and warm serverless invocations
// reuse one pool instead of opening a new one each time.
const holder = globalThis as typeof globalThis & { __dadShopSql?: Sql };

export function getDb(): Sql | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!holder.__dadShopSql) {
    holder.__dadShopSql = postgres(url, {
      max: 3,
      idle_timeout: 20,
      connect_timeout: 10,
      // Neon's pooled endpoint (pgbouncer) does not keep named prepared statements.
      prepare: false,
      onnotice: () => undefined,
    });
  }
  return holder.__dadShopSql;
}
