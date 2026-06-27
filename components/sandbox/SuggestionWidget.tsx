"use client";

/**
 * A small fixed chip (bottom-left of the device screen) that opens a compose panel
 * for feature / tool ideas. Context-aware from the path: on a tool it asks for a
 * feature for THAT tool; on the sandbox home / index pages it asks for a new tool.
 *
 * Suggestions are kept in localStorage (so they persist + show back to you in any
 * browser) and also sent, best-effort, to a server action that appends them to a
 * local file when running in dev — so they can be collected off-device too.
 */

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { saveSuggestion } from "@/app/sandbox/suggest-action";

// Tool pages get a "feature" box named for the tool; everything else under
// /sandbox (home + index pages) gets a "tool" box.
const TOOL_NAMES: Record<string, string> = {
  "/sandbox/bezier": "Bezier Studio",
  "/sandbox/asterisk": "3D SVG Studio",
  "/sandbox/phone-mockup": "Phone Mockup",
  "/sandbox/mac-mockup": "Mac Mockup",
  "/sandbox/library/drum-credits": "Drum Credits",
};

type Saved = { text: string; at: number };

export default function SuggestionWidget() {
  const pathname = usePathname() || "/sandbox";
  const tool = TOOL_NAMES[pathname];
  const kind: "feature" | "tool" = tool ? "feature" : "tool";
  const storeKey = `sb-suggest:${kind}:${tool ?? "sandbox"}`;

  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [saved, setSaved] = useState<Saved[]>([]);
  const [done, setDone] = useState(false);

  // Reload the saved list whenever the context (tool/kind) changes.
  useEffect(() => {
    try { setSaved(JSON.parse(localStorage.getItem(storeKey) || "[]") as Saved[]); }
    catch { setSaved([]); }
    setText(""); setDone(false);
  }, [storeKey]);

  async function submit() {
    const t = text.trim();
    if (!t) return;
    const next = [{ text: t, at: Date.now() }, ...saved].slice(0, 50);
    setSaved(next);
    try { localStorage.setItem(storeKey, JSON.stringify(next)); } catch { /* private mode */ }
    setText(""); setDone(true);
    try { await saveSuggestion({ kind, tool: tool ?? "Sandbox", text: t }); } catch { /* best-effort */ }
  }

  const label = kind === "tool" ? "Suggest a tool" : "Suggest a feature";
  const heading = kind === "tool" ? "Suggest a tool" : `Suggest a feature · ${tool}`;
  const placeholder = kind === "tool"
    ? "A tool you'd love to see in the sandbox…"
    : "What would make this tool better?";

  return (
    <div className="sb-suggest" data-open={open || undefined}>
      {open && (
        <div className="sb-suggest-panel" role="dialog" aria-label={heading}>
          <div className="sb-suggest-head">
            <span>{heading}</span>
            <button className="sb-suggest-x" onClick={() => setOpen(false)} aria-label="Close">×</button>
          </div>
          <textarea
            className="sb-suggest-text"
            value={text}
            maxLength={2000}
            autoFocus
            onChange={(e) => { setText(e.target.value); setDone(false); }}
            placeholder={placeholder}
          />
          <div className="sb-suggest-row">
            <span className="sb-suggest-note">{done ? "Saved ✓" : saved.length ? `${saved.length} saved` : "Saved to this browser"}</span>
            <button className="sb-suggest-send" disabled={!text.trim()} onClick={submit}>Save</button>
          </div>
          {saved.length > 0 && (
            <ul className="sb-suggest-list">
              {saved.slice(0, 4).map((s, i) => <li key={i}>{s.text}</li>)}
            </ul>
          )}
        </div>
      )}
      <button className="sb-suggest-chip" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="sb-suggest-plus" aria-hidden="true">＋</span> {label}
      </button>
    </div>
  );
}
