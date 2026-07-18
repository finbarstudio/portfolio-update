import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Finbar Studio handles your data, what's collected, why, who it's shared with, and how to have it deleted.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

const UPDATED = "18 July 2026";

export default function PrivacyPage() {
  return (
    <div className="px-5 md:px-10 pt-8 md:pt-12 pb-16">
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
          This site is run by Finbar Skitini, trading as Finbar Studio, a designer based in
          Brisbane, Australia, working with clients in Australia and the UK. This page explains what
          data the site collects, why, who it&rsquo;s shared with, and how to have it removed.
        </p>

        <section className="space-y-3">
          <h2 className="mono-heading text-ink">What I collect</h2>
          <ul className="space-y-2 text-ink-soft" style={{ fontSize: "var(--text-small)" }}>
            <li className="text-ink"><strong className="text-ink">Things you send me.</strong> If you email, call, send an enquiry through a form, or book a call, I keep that information and correspondence so I can reply and work with you.</li>
            <li className="text-ink"><strong className="text-ink">Mailing list.</strong> If you sign up to my mailing list, I keep the email address you enter so I can email you occasional updates. You can unsubscribe or ask to be removed at any time.</li>
            <li className="text-ink"><strong className="text-ink">Advertising and analytics.</strong> This site runs the Meta (Facebook) pixel, which measures how ads perform and helps show relevant ads. It sets cookies (including <code>_fbp</code> and <code>_fbc</code>) and sends Meta events about your visit, both from your browser and from my server (the Conversions API). When you complete a booking, a hashed (not readable) version of the email and phone you enter may be sent to Meta to match the conversion. See &ldquo;Cookies and tracking&rdquo; below.</li>
            <li className="text-ink"><strong className="text-ink">Basic technical data.</strong> Like any website, the host records standard server logs (for example IP address and browser) to run and secure the site. A couple of small browser preferences (like whether you&rsquo;ve dismissed a notice) are stored locally on your device, not sent to me.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="mono-heading text-ink">Cookies and tracking</h2>
          <p style={{ fontSize: "var(--text-small)" }}>
            The Meta pixel is the only advertising tracker on the site. It sets cookies to recognise
            return visits and measure ad results. You can opt out at any time: block or clear cookies
            in your browser, use your{" "}
            <a href="https://www.facebook.com/adpreferences/ad_settings" target="_blank" rel="noopener noreferrer" className="u-underline">Meta ad preferences</a>, or the industry opt-outs at{" "}
            <a href="https://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer" className="u-underline">Your Online Choices</a>. The site uses no other advertising or analytics cookies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="mono-heading text-ink">Why, and the lawful basis</h2>
          <p style={{ fontSize: "var(--text-small)" }}>
            Enquiries and bookings are handled on the basis of your request and my legitimate
            interest in responding. Mailing-list emails are collected only with your{" "}
            <strong>consent</strong>, to send you occasional updates. Advertising measurement runs on
            the basis of legitimate interest, and you can opt out as above. Server logs are kept for
            the legitimate interest of running a secure site.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="mono-heading text-ink">Who processes it</h2>
          <p style={{ fontSize: "var(--text-small)" }}>
            The site relies on a small set of providers, each handling only what it needs:{" "}
            <strong>Meta Platforms</strong> (the advertising pixel and Conversions API),{" "}
            <strong>Cal.com</strong> (call bookings), and <strong>Web3Forms</strong> (which delivers
            enquiry forms and mailing-list signups to my inbox). The site is hosted on{" "}
            <strong>Vercel</strong>. These providers may process data on servers outside your country
            under their own safeguards. I don&rsquo;t sell your data.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="mono-heading text-ink">How long I keep it</h2>
          <p style={{ fontSize: "var(--text-small)" }}>
            Correspondence and enquiries are kept as long as needed to work together and for a
            reasonable period after. Mailing-list emails are kept until you unsubscribe or ask to be
            removed. Advertising cookies expire on their own (Meta&rsquo;s are typically up to 90
            days) or when you clear them.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="mono-heading text-ink">Your rights, and deleting your data</h2>
          <p style={{ fontSize: "var(--text-small)" }}>
            You can ask to access, correct or delete your data, withdraw consent, or object to its
            use, at any time. If you&rsquo;re in the UK or EU you also have the right to complain to
            your data protection authority. To have your data deleted or to make any of these
            requests, email{" "}
            <a href="mailto:finbar@finbar.studio?subject=Data%20request" className="u-underline">finbar@finbar.studio</a>{" "}
            and I&rsquo;ll action it and confirm when it&rsquo;s done.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="mono-heading text-ink">Contact</h2>
          <p style={{ fontSize: "var(--text-small)" }}>
            Questions about this policy:{" "}
            <a href="mailto:finbar@finbar.studio" className="u-underline">finbar@finbar.studio</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
