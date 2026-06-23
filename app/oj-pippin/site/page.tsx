import type { Metadata } from "next";
import Link from "next/link";

// Placeholder for the OJ Pippin Homes demo. Lives OUTSIDE the (site) route
// group on purpose, so it carries none of the portfolio chrome (nav, footer,
// contact drawer), this slot is for Finbar's standalone demo build or an
// <iframe> of the hosted demo. Swap the body below when the real demo is ready.
export const metadata: Metadata = {
  title: { absolute: "OJ Pippin Homes · Demo" },
  description: "Demo site for OJ Pippin Homes.",
  robots: { index: false, follow: false },
};

export default function OjPippinDemoPage() {
  return (
    <main
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.25rem",
        padding: "2rem",
        textAlign: "center",
        background: "var(--bg)",
        color: "var(--ink)",
      }}
    >
      <p className="mono-label text-ink-soft">OJ Pippin Homes · Demo</p>
      <h1 className="home-display-sm" style={{ maxWidth: "20ch" }}>
        The demo lands here.
      </h1>
      <p className="text-ink-soft" style={{ maxWidth: "42ch", lineHeight: 1.5 }}>
        This is the slot for the live demo. Drop the demo build or an embed here
        once it&rsquo;s ready.
      </p>
      <Link href="/oj-pippin" className="lindon-cta lindon-cta-ghost">
        &larr; Back to the note
      </Link>
    </main>
  );
}
