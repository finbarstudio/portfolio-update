import type { Metadata } from "next";
import SandboxLinkButton from "@/components/sandbox/SandboxLinkButton";

export const metadata: Metadata = {
  title: "Mockups",
  description:
    "3D mockup tools from finbar✶studio. Drop in your media and export looping video, stills, GIFs or an embed.",
};

// Only the live tools, titles only.
const LIVE_TOOLS = [
  { title: "Phone Mockup", href: "/phone-mockup" },
  { title: "Mac Mockup", href: "/mac-mockup" },
];

export default function MockupsPage() {
  return (
    <section className="sb-mockups">
      {LIVE_TOOLS.map((tool) => (
        <SandboxLinkButton key={tool.href} href={tool.href}>
          {tool.title}
        </SandboxLinkButton>
      ))}
    </section>
  );
}
