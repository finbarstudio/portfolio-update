import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tools",
  description:
    "Creative tools from finbar✶studio. Asterisk Studio: extrude an SVG into 3D, animate it on a timeline, and export video, stills or an embed.",
};

const TOOLS = [
  { title: "Asterisk Studio", href: "/asterisk" },
  { title: "Bezier Studio", href: "/bezier" },
];

export default function ToolsPage() {
  return (
    <section className="sb-mockups">
      {TOOLS.map((tool) => (
        <Link key={tool.href} href={tool.href} className="sb-mock-btn">
          {tool.title}
        </Link>
      ))}
    </section>
  );
}
