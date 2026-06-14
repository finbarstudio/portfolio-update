import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How finbar✶studio handles your data — what's collected, why, and your rights.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

const UPDATED = "14 June 2026";

export default function PrivacyPage() {
  return (
    <div className="px-5 md:px-10 pt-8 md:pt-12 pb-16">
      <p className="mono-label text-ink-soft mb-6">Privacy</p>
      <h1
        className="font-bold text-ink leading-[1.02]"
        style={{ fontSize: "var(--text-h1)", letterSpacing: "-0.01em" }}
      >
        Privacy policy
      </h1>

      <div
        className="mt-8 max-w-2xl space-y-6 text-ink leading-relaxed"
        style={{ fontSize: "var(--text-body)" }}
      >
        <p className="text-ink-soft" style={{ fontSize: "var(--text-small)" }}>Last updated {UPDATED}.</p>

        <p>
          This site is run by Finbar Skitini, trading as finbar✶studio, a graphic designer based in
          Brisbane, Australia. This page explains what data I collect, why, and what you can do
          about it. I keep the collection deliberately small.
        </p>

        <section className="space-y-3">
          <h2 className="mono-heading text-ink">What I collect</h2>
          <ul className="space-y-2 text-ink-soft" style={{ fontSize: "var(--text-small)" }}>
            <li className="text-ink"><strong className="text-ink">Launch waitlist email.</strong> If you sign up to be notified when a product launches, I store the email address you enter, along with the time you gave consent.</li>
            <li className="text-ink"><strong className="text-ink">Things you send me.</strong> If you email or call, I keep that correspondence so I can reply.</li>
            <li className="text-ink"><strong className="text-ink">Basic technical data.</strong> Like any website, the host records standard server logs (e.g. IP address, browser) to run and secure the site. There are no advertising or tracking cookies. A single browser preference (sidebar open/closed) is stored locally on your device, not sent to me.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="mono-heading text-ink">Why, and the lawful basis</h2>
          <p style={{ fontSize: "var(--text-small)" }}>
            The waitlist email is collected only with your <strong>consent</strong> (the tick box at
            sign-up), and used for one purpose: to email you when the product launches. Correspondence
            you send is handled on the basis of your request. Server logs are kept for the legitimate
            interest of running a secure website.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="mono-heading text-ink">Who processes it</h2>
          <p style={{ fontSize: "var(--text-small)" }}>
            Waitlist emails are stored in <strong>Shopify</strong>, which acts as a processor for that
            list. The site is hosted on <strong>Vercel</strong>. Both may process data on servers
            outside your country under their own safeguards. I don&rsquo;t sell your data or share it
            with anyone else.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="mono-heading text-ink">How long I keep it</h2>
          <p style={{ fontSize: "var(--text-small)" }}>
            Waitlist emails are kept until the launch you signed up for, or until you ask to be
            removed or withdraw consent — whichever comes first.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="mono-heading text-ink">Your rights</h2>
          <p style={{ fontSize: "var(--text-small)" }}>
            You can ask to access, correct or delete your data, withdraw consent, or object to its
            use, at any time. If you&rsquo;re in the UK or EU you also have the right to complain to
            your data protection authority. To do any of this, email{" "}
            <a href="mailto:finbar@finbar.studio" className="waitlist-link">finbar@finbar.studio</a>{" "}
            and I&rsquo;ll action it.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="mono-heading text-ink">Contact</h2>
          <p style={{ fontSize: "var(--text-small)" }}>
            Questions about this policy:{" "}
            <a href="mailto:finbar@finbar.studio" className="waitlist-link">finbar@finbar.studio</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
