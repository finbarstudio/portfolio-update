import type { Metadata } from "next";
import { Exo_2, Open_Sans } from "next/font/google";
import "./ross-hogno-site.css";
import SmoothScroll from "@/components/ross-hogno/SmoothScroll";
import DemoPreloader from "@/components/DemoPreloader";

// Ross Hogno Constructions demo. Lives outside the (site) route group, so it
// inherits only the root <html>/<body> — none of the portfolio chrome. Its
// styling is scoped under `.ross-hogno-site` and it runs its own Lenis instance.
// noindex: a private demo Finbar sends, reachable from the /ross-hogno pitch.
const display = Exo_2({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-rh-display",
  display: "swap",
});
const body = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-rh-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    absolute: "Ross Hogno Constructions | Award-Winning Toowoomba Builder",
  },
  description:
    "Ross Hogno Constructions builds award-winning custom homes across Toowoomba and the Darling Downs. A demo build by Finbar Studio.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function RossHognoSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`ross-hogno-site ${display.variable} ${body.variable}`}>
      <DemoPreloader storageKey="ross-hogno:preloaded">
        <span
          className="violet text-[var(--ink)] whitespace-nowrap"
          style={{ fontSize: "clamp(1.8rem, 7vw, 3.2rem)", letterSpacing: "0.08em", fontWeight: 600 }}
        >
          ROSS&nbsp;HOGNO
        </span>
      </DemoPreloader>
      {/* Pink brand bubble back to the Ross Hogno pitch — collapsed to an arrow,
          expands on hover to reveal the label. Styled like the main site. */}
      <a href="/ross-hogno" className="ld-back" aria-label="Back to finbar.studio">
        <span className="ld-back-arrow" aria-hidden="true">&larr;</span>
        <span className="ld-back-text">back to finbar.studio</span>
      </a>
      <SmoothScroll>{children}</SmoothScroll>
    </div>
  );
}
