import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getCurrentUser, type CurrentUser } from "./auth";
import { getDb, type Sql } from "./db";
import { LOGIN_PATH, SETUP_PATH } from "./paths";
import { DEFAULT_SETTINGS, parseSettings, type Settings } from "./settings";

/** Who is looking, with their settings. */
export interface Gate {
  sql: Sql;
  user: CurrentUser;
  settings: Settings;
}

type Loaded = { kind: "offline" } | { kind: "anon" } | { kind: "ok"; gate: Gate };

/** One load per request (layout, page and components share it): who is here and their settings. */
const load = cache(async (): Promise<Loaded> => {
  const sql = getDb();
  if (!sql) return { kind: "offline" };
  const user = await getCurrentUser();
  if (!user) return { kind: "anon" };
  const [row] = await sql<{ data: unknown }[]>`select data from settings where user_id = ${user.id}`;
  const parsed = row?.data == null ? null : parseSettings(row.data);
  const settings = parsed?.ok ? parsed.value : DEFAULT_SETTINGS;
  return { kind: "ok", gate: { sql, user, settings } };
});

/**
 * Every page except login and setup starts here. Logged out goes to login, not yet set up goes to setup,
 * and null means the shop has no database to talk to (show the Not connected screen).
 */
export async function gate(): Promise<Gate | null> {
  const loaded = await load();
  if (loaded.kind === "offline") return null;
  if (loaded.kind === "anon") redirect(LOGIN_PATH);
  if (!loaded.gate.user.setupDone) redirect(SETUP_PATH);
  return loaded.gate;
}

/** For setup: must be logged in, may not be set up yet. */
export async function gateForSetup(): Promise<Gate | null> {
  const loaded = await load();
  if (loaded.kind === "offline") return null;
  if (loaded.kind === "anon") redirect(LOGIN_PATH);
  return loaded.gate;
}

/** For login: who is already in, if anyone. "offline" when there's no database. */
export async function whoIsHere(): Promise<"offline" | { user: CurrentUser } | null> {
  const loaded = await load();
  if (loaded.kind === "offline") return "offline";
  return loaded.kind === "ok" ? { user: loaded.gate.user } : null;
}
