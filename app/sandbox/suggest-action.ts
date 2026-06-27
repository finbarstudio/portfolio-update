"use server";

import { promises as fs } from "fs";
import path from "path";

/**
 * Best-effort server capture of a sandbox suggestion. Appends one JSON line to
 * content/sandbox-suggestions.jsonl when the filesystem is writable (local dev), so
 * ideas can be collected off-device. On a read-only host (Vercel) this no-ops — the
 * client already keeps the suggestion in localStorage, so nothing is lost.
 */
export async function saveSuggestion(input: { kind: string; tool: string; text: string }) {
  const text = (input.text || "").trim().slice(0, 2000);
  if (!text) return { ok: false as const };
  const line = JSON.stringify({
    kind: input.kind === "tool" ? "tool" : "feature",
    tool: String(input.tool || "Sandbox").slice(0, 80),
    text,
    at: new Date().toISOString(),
  }) + "\n";
  try {
    await fs.appendFile(path.join(process.cwd(), "content", "sandbox-suggestions.jsonl"), line, "utf8");
  } catch {
    /* read-only filesystem in production — localStorage holds it client-side */
  }
  return { ok: true as const };
}
