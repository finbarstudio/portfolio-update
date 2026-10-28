import "server-only";
import postgres from "postgres";

/**
 * The one place the food shop's database is opened. Lazy: nothing connects at import time
 * or at build time, and `getDb()` returns null when no database URL is set so pages can
 * show "Not connected yet" and APIs can answer 503.
 */
export type Sql = postgres.Sql;

// Cached on globalThis so dev hot-reloads and warm serverless invocations
// reuse one pool instead of opening a new one each time.
const holder = globalThis as typeof globalThis & { __foodShopSql?: Sql };

export function getDb(): Sql | null {
  // FOOD_SHOP_DB_DATABASE_URL is set by the Neon integration on Vercel (namespaced because the
  // whole site shares one project); FOOD_SHOP_DATABASE_URL / DATABASE_URL are local dev.
  const url = process.env.FOOD_SHOP_DB_DATABASE_URL ?? process.env.FOOD_SHOP_DATABASE_URL ?? process.env.DATABASE_URL;
  if (!url) return null;
  if (!holder.__foodShopSql) {
    holder.__foodShopSql = postgres(url, {
      max: 3,
      idle_timeout: 20,
      connect_timeout: 10,
      // Neon's pooled endpoint (pgbouncer) does not keep named prepared statements.
      prepare: false,
      onnotice: () => undefined,
    });
  }
  return holder.__foodShopSql;
}
