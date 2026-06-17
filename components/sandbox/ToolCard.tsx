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

export default function ToolCard({ tool }: { tool: Tool }) {
  const inner = (
    <>
      <div className="sb-card-top">
        <span className={`sb-card-status ${tool.status === "live" ? "is-live" : "is-soon"}`}>
          {tool.status === "live" ? "Live" : "Soon"}
        </span>
      </div>
      <h2 className="sb-card-title">{tool.title}</h2>
      <p className="sb-card-blurb">{tool.blurb}</p>
      <div className="sb-card-foot">
        {tool.tag && <span className="mono-label sb-card-tag">{tool.tag}</span>}
        {tool.status === "live" && <span className="sb-card-cta mono-label">Open →</span>}
      </div>
    </>
  );

  if (tool.status === "live" && tool.href) {
    return (
      <Link href={tool.href} className="sb-card is-live">
        {inner}
      </Link>
    );
  }
  return (
    <div className="sb-card is-soon" aria-disabled="true">
      {inner}
    </div>
  );
}
