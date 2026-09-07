import type { Metadata } from "next";
import SubmitForm from "@/components/web/SubmitForm";

export const metadata: Metadata = { title: "Submit" };

const GUIDE_LEFT = [
  {
    title: "Free to submit",
    body: "No fee. Submitting is free and always will be. It does not guarantee a feature.",
  },
  {
    title: "Live sites only",
    body: "Only live, working websites. No mockups, concepts or work in progress. Redesigned sites can be resubmitted.",
  },
  {
    title: "What gets picked",
    body: "It is curated, so not everything goes up. If your site is chosen you will get an email when it is published, usually one site a day across the catalogue and Instagram.",
  },
  {
    title: "No awards",
    body: "No badges, no prizes, no Site of the Day. This is a catalogue of good work, nothing more.",
  },
];

const GUIDE_RIGHT = [
  {
    title: "Credits",
    body: "Design and development credits are published exactly as you give them, so check the spelling.",
  },
  {
    title: "Staying up",
    body: "Featured sites are checked now and then. If a site goes offline or changes beyond recognition it comes down without notice.",
  },
  {
    title: "Privacy and rights",
    body: "Your contact details are only used to talk to you about the submission. Screenshots stay the property of their owners.",
  },
  {
    title: "Removals",
    body: "Want your site taken down? Email finbar@finbar.studio and it goes, no questions asked.",
  },
];

export default function SubmitPage() {
  return (
    <>
      <div className="wf-void is-short" />
      <div className="wf-grid">
        <SubmitForm />
        <section className="wf-guide" aria-labelledby="wf-guide-h">
          <h2 id="wf-guide-h">
            Quick guidelines
            <br />
            (please read before submitting)
          </h2>
          <ol start={1}>
            {GUIDE_LEFT.map((item, i) => (
              <li key={item.title}>
                <span>{i + 1}</span>
                <b>{item.title}</b>
                {item.body}
              </li>
            ))}
          </ol>
          <ol start={GUIDE_LEFT.length + 1}>
            {GUIDE_RIGHT.map((item, i) => (
              <li key={item.title}>
                <span>{GUIDE_LEFT.length + i + 1}</span>
                <b>{item.title}</b>
                {item.body}
              </li>
            ))}
          </ol>
        </section>
      </div>
    </>
  );
}
