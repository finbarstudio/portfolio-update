import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — finbar✶studio",
  description:
    "Brisbane-based graphic designer and Framer developer. Originally from London, studied in London and Brighton, now open for design roles.",
};

export default function AboutPage() {
  return (
    <div className="px-6 md:px-10">
      {/* Back nav */}
      <div className="py-5">
        <Link
          href="/"
          className="mono-label text-ink-soft hover:text-pink transition-colors"
        >
          ← HOME
        </Link>
      </div>

      {/* Display heading */}
      <div className="pt-4 pb-12">
        <p className="mono-label text-ink-soft mb-4">About</p>
        <h1
          className="font-sans font-bold uppercase text-ink leading-[1.0]"
          style={{ fontSize: "var(--text-display)", letterSpacing: "0.02em" }}
        >
          Finbar<br />Skitini
        </h1>
      </div>

      {/* Bio */}
      <div className="mb-14 max-w-2xl">
        <p className="mono-label text-ink-soft mb-5">Background</p>
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

      {/* What I do */}
      <div className="mb-14">
        <p className="mono-label text-ink-soft mb-8">What I do</p>
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
            <div key={heading}>
              <p className="font-sans font-bold text-ink mb-4" style={{ fontSize: "var(--text-small)" }}>
                {heading}
              </p>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item} className="font-sans text-ink-soft" style={{ fontSize: "var(--text-small)" }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <div className="pb-14">
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
  );
}
