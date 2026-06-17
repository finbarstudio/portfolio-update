import type { Metadata } from "next";
import ToolCard, { type Tool } from "@/components/sandbox/ToolCard";

export const metadata: Metadata = {
  title: "Mockups",
  description:
    "3D mockup tools from finbar✶studio — drop in your media and export looping video, stills, GIFs or an embed.",
};

const TOOLS: Tool[] = [
  {
    title: "Phone Mockup",
    blurb:
      "Drop your images or videos onto a cycling 3D iPhone carousel and export a looping video, stills, a GIF or an embed.",
    href: "/phone-mockup",
    status: "live",
    tag: "3D · WebGL",
  },
  {
    title: "Mac Mockup",
    blurb:
      "Set a screenshot or screen recording on a 3D Studio Display and export a looping turntable video, stills, a GIF or an embed.",
    href: "/mac-mockup",
    status: "live",
    tag: "3D · WebGL",
  },
  {
    title: "Album Wall",
    blurb: "Arrange cover art on a light-catching gallery wall and export the render.",
    status: "soon",
    tag: "3D",
  },
  {
    title: "Magazine Flip",
    blurb: "Flip your spreads through an interactive 3D magazine and capture the loop.",
    status: "soon",
    tag: "3D",
  },
];

export default function MockupsPage() {
  return (
    <section className="sb-landing">
      <div className="sb-grid">
        {TOOLS.map((tool) => (
          <ToolCard key={tool.title} tool={tool} />
        ))}
      </div>
    </section>
  );
}
