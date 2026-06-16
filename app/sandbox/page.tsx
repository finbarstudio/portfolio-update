import ToolCard, { type Tool } from "@/components/sandbox/ToolCard";

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

export default function SandboxLanding() {
  return (
    <section className="sb-landing">
      <div className="sb-landing-intro">
        <p className="mono-label sb-eyebrow">Studio tools</p>
        <h1 className="sb-landing-title">The Sandbox</h1>
        <p className="sb-landing-lede">
          A workshop of small, free creative tools — pieces of the finbar✶studio site, pulled out so
          you can use them on your own work. More land here over time.
        </p>
      </div>

      <div className="sb-grid">
        {TOOLS.map((tool) => (
          <ToolCard key={tool.title} tool={tool} />
        ))}
      </div>
    </section>
  );
}
