/**
 * ToolCard — a tile on the Sandbox landing grid. Live tools link through; the
 * rest render as "soon" placeholders.
 */

import Link from "next/link";

export type Tool = {
  title: string;
  blurb: string;
  href?: string;
  status: "live" | "soon";
  tag?: string;
};

export default function ToolCard({ tool, index = 0 }: { tool: Tool; index?: number }) {
  // Catalog code, archive-style (SB-01, SB-02 …) — the research-center treatment.
  const code = `SB-${String(index + 1).padStart(2, "0")}`;
  const live = tool.status === "live";
  const inner = (
    <>
      <span className="sb-row-code mono-label">{code}</span>
      <span className="sb-row-title">{tool.title}</span>
      <span className="sb-row-blurb">{tool.blurb}</span>
      {tool.tag && <span className="sb-row-tag mono-label">{tool.tag}</span>}
      <span className={`sb-row-status ${live ? "is-live" : "is-soon"}`}>{live ? "Live" : "Soon"}</span>
      <span className="sb-row-arrow" aria-hidden="true">→</span>
    </>
  );

  if (live && tool.href) {
    return (
      <Link href={tool.href} className="sb-row is-live">
        {inner}
      </Link>
    );
  }
  return (
    <div className="sb-row is-soon" aria-disabled="true">
      {inner}
    </div>
  );
}
