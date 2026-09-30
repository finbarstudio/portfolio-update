import type { Metadata } from "next";
import Link from "next/link";
import ContactCta from "@/components/ContactCta";

/**
 * Where every unbuilt link in a demo site lands (the /lindon and /mt demos
 * link here as /demo?site=<key>). It sits inside (site), so it wears the studio's
 * own nav, footer and contact popup: the visitor steps out of the demo and into
 * finbar.studio, with a way to start a project, see prices, or go back.
 */
export const metadata: Metadata = {
  title: "Not built in this demo",
  robots: { index: false, follow: true },
};

const DEMOS: Record<string, { name: string; href: string }> = {
  lindon: { name: "Lindon Homes", href: "/lindon" },
  mt: { name: "Moto Technique", href: "/mt" },
};

export default async function DemoNotBuilt({
  searchParams,
}: {
  searchParams: Promise<{ site?: string }>;
}) {
  const { site } = await searchParams;
  const demo = site ? DEMOS[site] : undefined;

  return (
    <div className="px-5 md:px-10 pt-16 md:pt-28 pb-24 md:pb-36">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mono-label text-ink-soft">{demo ? `${demo.name} demo` : "Demo"}</p>
        <h1
          className="mt-4 font-bold text-ink leading-[1.02] text-balance"
          style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)", letterSpacing: "-0.02em" }}
        >
          Not built in this demo
        </h1>
        <p className="mt-6 text-ink leading-relaxed text-pretty" style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.25rem)" }}>
          This page gets built in the real project, with the client&rsquo;s own content.
          The demo shows the look, the feel and how it moves. If you&rsquo;d like a site
          like it, I&rsquo;d love to hear about your project.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <ContactCta className="sticker-pill is-pink">Start a project</ContactCta>
          <Link href="/pricing" className="sticker-pill">See pricing</Link>
          {demo && (
            <Link href={demo.href} className="sticker-pill">Back to the demo</Link>
          )}
          <Link href="/" className="sticker-pill">Home</Link>
        </div>
      </div>
    </div>
  );
}
