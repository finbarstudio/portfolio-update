import Nav from "@/components/arolley/Nav";
import ViewCursor from "@/components/arolley/ViewCursor";
import EntryReveal from "@/components/arolley/EntryReveal";
import SiteFooter from "@/components/arolley/sections/SiteFooter";

const BASE = "/a-rolley/editorial";

export const metadata = {
  title: { absolute: "Project | A Rolley & Sons — Editorial" },
};

export default async function ARolleyEditorialProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    <main>
      <Nav base={BASE} />
      <ViewCursor />
      <section className="frame arl-hero">
        <EntryReveal className="flex flex-col items-center">
          <p className="eyebrow">{name}</p>
          <h1 className="display" style={{ fontSize: "var(--step-h2)", maxWidth: "22ch", marginTop: "clamp(14px,1.6vw,24px)" }}>
            Project detail page yet to be developed.
          </h1>
          <a href={`${BASE}/projects`} className="eyebrow" data-cursor="Back" style={{ marginTop: "clamp(24px,3vw,40px)", borderBottom: "1px solid var(--line)", paddingBottom: 4, display: "inline-block" }}>
            Back to projects
          </a>
        </EntryReveal>
      </section>
      <SiteFooter base={BASE} />
    </main>
  );
}
