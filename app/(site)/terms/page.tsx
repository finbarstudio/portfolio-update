import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "The terms for using the Finbar Studio website.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

const UPDATED = "18 July 2026";

export default function TermsPage() {
  return (
    <div className="px-5 md:px-10 pt-8 md:pt-12 pb-16">
      <h1
        className="font-bold text-ink leading-[1.02]"
        style={{ fontSize: "var(--text-h1)", letterSpacing: "-0.01em" }}
      >
        Terms of use
      </h1>

      <div
        className="mt-8 max-w-2xl space-y-6 text-ink leading-relaxed"
        style={{ fontSize: "var(--text-body)" }}
      >
        <p className="text-ink-soft" style={{ fontSize: "var(--text-small)" }}>Last updated {UPDATED}.</p>

        <p>
          This website is run by Finbar Skitini, trading as Finbar Studio, based in Brisbane,
          Australia. By using the site you agree to these terms. They&rsquo;re written plainly, not
          as legal boilerplate.
        </p>

        <section className="space-y-3">
          <h2 className="mono-heading text-ink">Using the site</h2>
          <p style={{ fontSize: "var(--text-small)" }}>
            You&rsquo;re welcome to browse, read and get in touch. Please don&rsquo;t misuse the site:
            no attempting to break, overload or gain unauthorised access to it, and no scraping or
            copying it wholesale. Booking a call or sending an enquiry is an invitation to talk, not a
            binding contract for work; any project is agreed separately in writing.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="mono-heading text-ink">The work on here is mine</h2>
          <p style={{ fontSize: "var(--text-small)" }}>
            The design, code, words, images and case studies on this site are my work (or my
            clients&rsquo;, shown with permission) and are protected by copyright. Client names and
            logos belong to those clients. Please don&rsquo;t reuse anything here without asking
            first. A link back to the site is always welcome.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="mono-heading text-ink">No guarantees on the site itself</h2>
          <p style={{ fontSize: "var(--text-small)" }}>
            The site is provided as is. I keep it accurate and online as best I can, but I can&rsquo;t
            promise it will always be available, error-free, or that the information is complete or
            current. Nothing here is professional advice, and case-study results describe specific
            projects, not a promise of the same outcome for you.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="mono-heading text-ink">Links out</h2>
          <p style={{ fontSize: "var(--text-small)" }}>
            The site links to other places (client sites, booking, social). I don&rsquo;t control
            those and am not responsible for their content or their own terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="mono-heading text-ink">Liability</h2>
          <p style={{ fontSize: "var(--text-small)" }}>
            To the extent the law allows, I&rsquo;m not liable for any loss arising from your use of
            this website. Nothing in these terms limits rights you have under the Australian Consumer
            Law or other rights that can&rsquo;t be excluded.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="mono-heading text-ink">Changes and governing law</h2>
          <p style={{ fontSize: "var(--text-small)" }}>
            I may update these terms from time to time; the date above shows when. These terms are
            governed by the laws of Queensland, Australia.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="mono-heading text-ink">Contact</h2>
          <p style={{ fontSize: "var(--text-small)" }}>
            Questions about these terms:{" "}
            <a href="mailto:finbar@finbar.studio" className="u-underline">finbar@finbar.studio</a>.
            See also the{" "}
            <a href="/privacy" className="u-underline">privacy policy</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
