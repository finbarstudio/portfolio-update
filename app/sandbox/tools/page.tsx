import type { Metadata } from "next";
import SandboxLinkButton from "@/components/sandbox/SandboxLinkButton";

export const metadata: Metadata = {
  title: "Tools",
  description:
    "Creative tools from finbar✶studio. Asterisk Studio: extrude an SVG into 3D, animate it on a timeline, and export. Bezier Studio: visualise an SVG's bezier curves and anchors.",
};

const TOOLS = [
  { title: "Asterisk Studio", href: "/asterisk" },
  { title: "Bezier Studio", href: "/bezier" },
];

export default function ToolsPage() {
  return (
    <section className="sb-mockups">
      {TOOLS.map((tool) => (
        <SandboxLinkButton key={tool.href} href={tool.href}>
          {tool.title}
        </SandboxLinkButton>
      ))}
    </section>
  );
}
