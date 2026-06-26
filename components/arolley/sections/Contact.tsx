import ContactForm from "../ContactForm";

/** Contact: a brief invitation + the details, beside the enquiry form. Lives at
 *  the bottom of the home and the about pages. */
export default function Contact() {
  return (
    <section id="contact" className="frame pad-y" style={{ background: "var(--paper-2)" }}>
      <div className="wrap grid grid-cols-1 md:grid-cols-12" style={{ gap: "clamp(36px,5vw,80px)" }}>
        <div className="md:col-span-5">
          <p className="eyebrow">Start a project</p>
          <h2 className="display" style={{ fontSize: "var(--step-h2)", marginTop: "0.5em", maxWidth: "16ch" }}>
            Let&rsquo;s talk about your build.
          </h2>
          <p className="lead" style={{ marginTop: "clamp(16px,2vw,26px)", maxWidth: "40ch" }}>
            The best homes start with an early conversation. Tell us about your site and your plans,
            and we will take it from there.
          </p>

          <dl style={{ marginTop: "clamp(28px,4vw,52px)", display: "grid", gap: "clamp(16px,2vw,24px)" }}>
            <div>
              <dt className="eyebrow" style={{ marginBottom: 6 }}>Call</dt>
              <dd style={{ fontSize: "var(--step-body)" }}><a href="tel:+61754996811" className="hover:text-[var(--terracotta)]">07 5499 6811</a></dd>
            </div>
            <div>
              <dt className="eyebrow" style={{ marginBottom: 6 }}>Visit</dt>
              <dd style={{ fontSize: "var(--step-body)" }}>37 Ascot Way, Little Mountain QLD 4551<br /><span style={{ color: "var(--ink-soft)" }}>By appointment</span></dd>
            </div>
          </dl>
        </div>

        <div className="md:col-span-7 md:col-start-6">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
