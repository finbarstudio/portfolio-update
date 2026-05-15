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
      <div className="py-5 border-b border-line">
        <Link
          href="/"
          className="mono-label text-ink-soft hover:text-pink transition-colors"
        >
          ← HOME
        </Link>
      </div>

      {/* Heading */}
      <div className="pt-10 pb-8 border-b border-line">
        <p className="mono-label text-ink-soft mb-3">About</p>
        <h1 className="font-mono font-bold text-[clamp(1.5rem,3vw,2rem)] tracking-[0.08em] uppercase text-ink">
          Finbar Skitini
        </h1>
      </div>

      {/* Bio */}
      <div className="py-10 border-b border-line max-w-2xl">
        {/*
         * PLACEHOLDER — refine bio copy.
         * Written from spec; update with Finbar's preferred voice.
         */}
        <div className="space-y-5 text-[15px] leading-relaxed text-ink font-sans">
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
            custom-built websites in Framer. I care about things being visually
            considered, technically tight, and genuinely usable.
          </p>
          <p>
            Accessibility matters to me. I build for real people with real
            constraints, not just for portfolio screenshots.
          </p>
          <p>
            Outside of work: gym and music.{" "}
            {/* PLACEHOLDER — expand if Finbar wants to add more personal detail */}
          </p>
        </div>
      </div>

      {/* What I do */}
      <div className="py-10 border-b border-line">
        <p className="mono-label text-ink-soft mb-6">WHAT I DO</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-8">
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
              <p className="mono-label text-ink mb-3">{heading}</p>
              <ul className="space-y-1.5">
                {items.map((item) => (
                  <li key={item} className="text-sm text-ink-soft font-sans">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <div className="py-10">
        <p className="mono-label text-ink-soft mb-3">
          <span className="status-badge">OPEN FOR WORK</span>
        </p>
        <p className="text-sm text-ink-soft font-sans mb-4">
          Available for full-time design roles and freelance engagements.
          Brisbane-based; remote-friendly.{" "}
          {/* PLACEHOLDER — adjust availability note */}
        </p>
        <a
          href="mailto:finbar@finbar.studio"
          className="inline-block font-sans text-xl font-medium text-ink hover:text-pink transition-colors"
        >
          finbar@finbar.studio
        </a>
      </div>
    </div>
  );
}
