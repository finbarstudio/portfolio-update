import type { Metadata } from "next";
import ClientImage from "@/components/ClientImage";

export const metadata: Metadata = {
  title: "About — finbar✶studio",
  description:
    "Brisbane-based graphic designer and Framer developer. Originally from London, studied in London and Brighton, now open for design roles.",
};

export default function AboutPage() {
  return (
    <div className="px-5 md:px-10 py-6 md:py-8">
      <div className="px-0 md:px-10 py-6 md:py-10">
        {/* Display heading */}
        <div className="pb-10 border-b border-line mb-10">
          <p className="mono-label text-ink-soft mb-3">
            <span className="text-pink">»</span> cat about.txt
          </p>
          <h1
            className="font-sans font-bold uppercase text-ink leading-[1.0]"
            style={{ fontSize: "var(--text-display)", letterSpacing: "0.02em" }}
          >
            Finbar<br />Skitini
          </h1>
        </div>

        {/* Headshot + Bio */}
        <div className="mb-14 flex flex-col md:flex-row gap-10 items-start">
          <div className="shrink-0" style={{ width: 160, height: 160, position: "relative", borderRadius: 4, overflow: "hidden" }}>
            <ClientImage
              src="/images/headshot.webp"
              alt="Finbar Skitini — graphic designer and Framer developer"
              fill
              sizes="160px"
              className="object-cover"
            />
          </div>
        <div className="max-w-2xl">
          <p className="mono-label text-ink-soft mb-5">── Background ──</p>
          <div className="space-y-4 font-sans leading-relaxed text-ink" style={{ fontSize: "var(--text-body)" }}>
            <p>
              I&rsquo;m a Brisbane-based graphic designer and Framer developer
              with four-plus years across brand identity, digital campaigns, web,
              and publication design. Originally from London, I studied design in
              London and Brighton before founding Finbar Studio.
            </p>
            <p>
              My work spans full brand systems from concept to delivery —
              logomarks, colour systems, typographic frameworks, and brand
              guidelines — through to motion campaigns, bespoke publications, and
              custom-built websites in Framer.
            </p>
            <p>
              I care about things being visually considered, technically tight,
              and genuinely usable. Accessibility matters — I build for real
              people, not just portfolio screenshots.
            </p>
          </div>
        </div>
        </div>

        {/* What I do */}
        <div className="mb-14">
          <p className="mono-label text-ink-soft mb-8">── Capabilities ──</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-10">
            {[
              {
                heading: "Brand Identity",
                items: [
                  "Logo design & logomark",
                  "Colour systems",
                  "Typography selection",
                  "Brand guidelines",
                  "Graphic asset systems",
                ],
              },
              {
                heading: "Web & Digital",
                items: [
                  "Framer development",
                  "CMS setup & handover",
                  "Custom interactive components",
                  "Accessibility implementation",
                  "SEO foundations",
                ],
              },
              {
                heading: "Publication & Campaign",
                items: [
                  "Publication design (InDesign)",
                  "Infographic design",
                  "Content writing",
                  "Motion graphics (After Effects)",
                  "Print production",
                ],
              },
            ].map(({ heading, items }) => (
              <div key={heading} className="border-l-2 border-ink pl-4">
                <p className="font-sans font-bold uppercase text-ink mb-4 tracking-wider" style={{ fontSize: "var(--text-small)" }}>
                  {heading}
                </p>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item} className="font-sans text-ink-soft flex gap-2" style={{ fontSize: "var(--text-small)" }}>
                      <span className="text-pink">›</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="pt-8 border-t border-line">
          <div className="mb-3">
            <span className="status-badge">OPEN FOR WORK</span>
          </div>
          <p className="font-sans text-ink-soft mb-5" style={{ fontSize: "var(--text-small)" }}>
            Available for full-time design roles and freelance engagements.
            Brisbane-based; remote-friendly.
          </p>
          <a
            href="mailto:finbar@finbar.studio"
            className="font-sans font-bold text-ink hover:text-pink transition-colors"
            style={{ fontSize: "var(--text-h2)" }}
          >
            finbar@finbar.studio
          </a>
        </div>
      </div>
    </div>
  );
}
