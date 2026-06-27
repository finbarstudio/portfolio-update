"use server";

import { promises as fs } from "fs";
import path from "path";

/**
 * Server capture of a sandbox suggestion. Appends a readable entry to
 * content/sandbox-suggestions.txt (tracked in git, so you can just open it) when
 * the filesystem is writable — i.e. when you run the site locally (`npm run dev`).
 *
 * NOTE: on a read-only host (Vercel) the write no-ops, so suggestions submitted on
 * the DEPLOYED sandbox stay in the visitor's localStorage, not this file. To
 * collect deployed submissions you'd need email or a database (easy to add later).
 */
export async function saveSuggestion(input: { kind: string; tool: string; text: string }) {
  const text = (input.text || "").trim().slice(0, 2000);
  if (!text) return { ok: false as const };

  const kind = input.kind === "tool" ? "TOOL" : "FEATURE";
  const tool = String(input.tool || "Sandbox").slice(0, 80);
  const stamp = new Date().toISOString().replace("T", " ").replace(/\.\d+Z$/, " UTC");
  const entry = `[${stamp}]  ${kind}  ·  ${tool}\n  ${text.replace(/\n/g, "\n  ")}\n\n`;

  try {
    await fs.appendFile(path.join(process.cwd(), "content", "sandbox-suggestions.txt"), entry, "utf8");
  } catch {
    /* read-only filesystem in production — localStorage holds it client-side */
  }
  return { ok: true as const };
}
