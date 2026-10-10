"use client";

/**
 * BriefForm — the project brief a prospect fills in so a site can be scoped
 * and quoted. Lives at /webform. Posts to Web3Forms, which emails the answers
 * to Finbar; the mailto branch is only a safety net if the key is ever removed.
 */

import { useCallback, useState } from "react";

const EMAIL = "finbar@finbar.studio";
/* Web3Forms access keys are public by design (they ship in the page), so this
   form's own key lives here and works without any environment setup. */
const W3F_KEY = "507b6a42-46fc-48a2-91bd-691168385977";

type Status = "idle" | "sending" | "sent" | "error";

const GOALS = [
  "Get more enquiries",
  "Take quote or booking requests",
  "Show off our work",
  "Look more professional",
  "Be easier to use on a phone",
  "Be easier for us to update",
];

const PAGES = [
  "Home",
  "About",
  "Services",
  "Projects or gallery",
  "Reviews",
  "Blog or news",
  "Contact",
];

const FEATURES = [
  "Contact form",
  "Quote or estimate tool",
  "Online booking",
  "Photo gallery",
  "Edit it ourselves (CMS)",
  "Customer reviews",
  "Map or service areas",
  "Animation and motion",
  "Newsletter sign-up",
];

/** Guide prices, the same three as /pricing. Each one is a full build. */
const SIZES = [
  { value: "Landing page, about £1,750", name: "Landing page", price: "£1,750", note: "One page that does one job properly." },
  { value: "Small site, about £3,500", name: "Small site", price: "£3,500", note: "Around three pages, such as home, about and contact." },
  { value: "Custom site, from £4,000", name: "Custom site", price: "from £4,000", note: "More pages, project or blog posts, custom tools, a CMS." },
  { value: "Not sure yet", name: "Not sure yet", price: "", note: "Tell me what you need and I will suggest the right size." },
];

const UPDATE_FREQ = ["Every week", "Every month", "A few times a year", "Hardly ever"];
const UPDATE_WHAT = ["New projects or photos", "Prices or services", "News or blog posts", "Offers", "Opening hours or contact details", "Reviews"];
const UPDATE_HOW = ["I do it myself", "Someone on my team does", "I pay a web person or agency", "Nobody, it never gets updated"];
const PLATFORMS = ["WordPress", "Wix", "Squarespace", "Shopify", "GoDaddy", "No idea"];
const UPDATE_EASE = ["Easy", "Fiddly but I manage", "Painful, I avoid it"];
const AI_USE = ["Yes, most days", "Now and then", "No"];
const TIMELINES = ["As soon as possible", "In the next 1 to 2 months", "In 3 months or more", "No deadline"];
const PHOTOS = ["We have good photos", "We have some, they need work", "We need new photos"];
const WORDS = ["We will write it", "We need help with the words", "Keep what is on our site now"];
const HOSTING = ["Yes, host it for me", "No, I have hosting", "Not sure"];

/** Field labels in the order they appear in the email. */
const ORDER: [string, string][] = [
  ["name", "Name"],
  ["business", "Business"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["website", "Current website"],
  ["about", "What the business does"],
  ["goals", "Main goals"],
  ["current_likes", "What they like about the current site"],
  ["current_dislikes", "What they do not like about it"],
  ["customer_feedback", "What customers say or get stuck on"],
  ["update_freq", "How often they want to update"],
  ["update_what", "What they update"],
  ["update_how", "Who updates it now"],
  ["platform", "Current platform"],
  ["update_ease", "How updating feels now"],
  ["update_future", "Who will update the new site"],
  ["ai_use", "Uses AI tools"],
  ["ai_tools", "Which AI tools"],
  ["pages", "Pages needed"],
  ["services", "Number of services or products"],
  ["features", "Features wanted"],
  ["feature_notes", "Feature notes"],
  ["inspo_1", "Inspiration link 1"],
  ["inspo_2", "Inspiration link 2"],
  ["inspo_3", "Inspiration link 3"],
  ["likes", "What they like about those sites"],
  ["brand", "Logo and brand"],
  ["photos", "Photos"],
  ["words", "Words"],
  ["size", "Size of site"],
  ["timeline", "Timeline"],
  ["hosting", "Hosting"],
  ["notes", "Anything else"],
];

function Chips({ name, options, type = "checkbox", required }: { name: string; options: string[]; type?: "checkbox" | "radio"; required?: boolean }) {
  return (
    <>
      <div className="brief-chips">
        {options.map((o, i) => (
          <label key={o} className="brief-chip">
            <input type={type} name={name} value={o} required={required && type === "radio" && i === 0} />
            <span>{o}</span>
          </label>
        ))}
      </div>
      {/* Same field name, so a typed answer is sent alongside any chips picked. */}
      <input className="brief-input brief-other" name={name} type="text" placeholder="Something else? Type it here" aria-label="Something else" />
    </>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="brief-field">
      <span className="brief-label">{label}</span>
      {hint && <span className="brief-hint">{hint}</span>}
      {children}
    </label>
  );
}

export default function BriefForm() {
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const answers: Record<string, string> = {};
    for (const [key, label] of ORDER) {
      const value = data.getAll(key).map(String).filter(Boolean).join(", ");
      if (value) answers[label] = value;
    }
    const business = answers["Business"] || answers["Name"] || "new enquiry";
    const subject = `Project brief: ${business}`;

    if (W3F_KEY) {
      setStatus("sending");
      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: W3F_KEY,
            subject,
            from_name: "Finbar Studio brief",
            replyto: answers["Email"],
            ...answers,
            botcheck: data.get("botcheck") === "on",
          }),
        });
        const json = await res.json().catch(() => ({}));
        if (res.ok && json.success !== false) {
          setStatus("sent");
          form.reset();
          window.scrollTo({ top: 0 });
        } else {
          console.error("Web3Forms error:", json);
          setStatus("error");
        }
      } catch (err) {
        console.error("Web3Forms fetch error:", err);
        setStatus("error");
      }
    } else {
      const body = Object.entries(answers).map(([k, v]) => `${k}: ${v}`).join("\n\n");
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  }, []);

  if (status === "sent") {
    return (
      <div className="brief-done" role="status">
        <h2 className="mono-heading text-ink">Thanks, that is everything I need.</h2>
        <p>
          I will read it through and come back to you within two working days with what I would
          build and a fixed price.
        </p>
      </div>
    );
  }

  return (
    <form className="brief-form" onSubmit={onSubmit}>
      <fieldset className="brief-section">
        <legend className="mono-heading text-ink">1. You</legend>
        <div className="brief-grid">
          <Field label="Your name">
            <input className="brief-input" placeholder="Type here" name="name" type="text" autoComplete="name" required />
          </Field>
          <Field label="Business name">
            <input className="brief-input" placeholder="Type here" name="business" type="text" autoComplete="organization" required />
          </Field>
          <Field label="Email">
            <input className="brief-input" placeholder="you@example.com" name="email" type="email" autoComplete="email" required />
          </Field>
          <Field label="Phone (optional)">
            <input className="brief-input" placeholder="Type here" name="phone" type="tel" autoComplete="tel" />
          </Field>
        </div>
        <Field label="Your current website" hint="Leave blank if you do not have one">
          <input className="brief-input" name="website" type="text" inputMode="url" placeholder="www." />
        </Field>
        <Field label="What does your business do, and who are your customers?">
          <textarea className="brief-input" placeholder="Type here" name="about" rows={3} required />
        </Field>
      </fieldset>

      <fieldset className="brief-section">
        <legend className="mono-heading text-ink">2. What the site needs to do</legend>
        <div className="brief-field">
          <span className="brief-label">What should the new site do for you?</span>
          <span className="brief-hint">Pick any that apply</span>
          <Chips name="goals" options={GOALS} />
        </div>
        <Field label="What do you like about your current site?" hint="Be specific. A page, a photo, the wording, anything worth keeping.">
          <textarea className="brief-input" placeholder="Type here" name="current_likes" rows={3} />
        </Field>
        <Field label="What do you not like about it?" hint="Be specific. For example: hard to find prices, looks dated on a phone, the gallery is slow.">
          <textarea className="brief-input" placeholder="Type here" name="current_dislikes" rows={3} />
        </Field>
        <Field label="Do customers ever say anything about the site, or get stuck on it?" hint="Optional">
          <textarea className="brief-input" placeholder="Type here" name="customer_feedback" rows={2} />
        </Field>
      </fieldset>

      <fieldset className="brief-section">
        <legend className="mono-heading text-ink">3. Keeping it up to date</legend>
        <div className="brief-field">
          <span className="brief-label">How often would you like to update the site?</span>
          <Chips name="update_freq" type="radio" options={UPDATE_FREQ} />
        </div>
        <div className="brief-field">
          <span className="brief-label">What would you be changing?</span>
          <span className="brief-hint">Pick any that apply</span>
          <Chips name="update_what" options={UPDATE_WHAT} />
        </div>
        <div className="brief-field">
          <span className="brief-label">Who updates your site at the moment?</span>
          <Chips name="update_how" type="radio" options={UPDATE_HOW} />
        </div>
        <div className="brief-field">
          <span className="brief-label">What is your current site built on?</span>
          <Chips name="platform" type="radio" options={PLATFORMS} />
        </div>
        <div className="brief-field">
          <span className="brief-label">How does updating it feel right now?</span>
          <Chips name="update_ease" type="radio" options={UPDATE_EASE} />
        </div>
        <div className="brief-field">
          <span className="brief-label">On the new site, who should make the updates?</span>
          <Chips name="update_future" type="radio" options={["Me or my team", "You, Finbar", "A mix of both", "Not sure"]} />
        </div>
      </fieldset>

      <fieldset className="brief-section">
        <legend className="mono-heading text-ink">4. AI tools</legend>
        <div className="brief-field">
          <span className="brief-label">Do you use any AI tools, such as ChatGPT or Claude?</span>
          <span className="brief-hint">I ask because the site can be set up so you make your own updates by asking an AI tool, if you would like to work that way.</span>
          <Chips name="ai_use" type="radio" options={AI_USE} />
        </div>
        <Field label="Which ones, and what for?" hint="Optional. For example ChatGPT for writing emails.">
          <input className="brief-input" placeholder="Type here" name="ai_tools" type="text" />
        </Field>
      </fieldset>

      <fieldset className="brief-section">
        <legend className="mono-heading text-ink">5. Pages and features</legend>
        <div className="brief-field">
          <span className="brief-label">Which pages do you need?</span>
          <Chips name="pages" options={PAGES} />
        </div>
        <Field label="How many services or products do you offer?" hint="A rough number is fine. It tells me how many pages they need.">
          <input className="brief-input" placeholder="Type here" name="services" type="text" inputMode="numeric" />
        </Field>
        <div className="brief-field">
          <span className="brief-label">Anything the site should be able to do?</span>
          <Chips name="features" options={FEATURES} />
        </div>
        <Field label="Tell me more about any of those" hint="Optional. For example, what a customer should send you to get a quote.">
          <textarea className="brief-input" placeholder="Type here" name="feature_notes" rows={3} />
        </Field>
      </fieldset>

      <fieldset className="brief-section">
        <legend className="mono-heading text-ink">6. Look and content</legend>
        <div className="brief-field">
          <span className="brief-label">Websites you like the look of</span>
          <span className="brief-hint">Paste up to three links. They do not need to be in your industry.</span>
          <input className="brief-input" name="inspo_1" type="text" inputMode="url" placeholder="www." aria-label="Inspiration link 1" />
          <input className="brief-input" name="inspo_2" type="text" inputMode="url" placeholder="www." aria-label="Inspiration link 2" />
          <input className="brief-input" name="inspo_3" type="text" inputMode="url" placeholder="www." aria-label="Inspiration link 3" />
        </div>
        <Field label="What do you like about them?" hint="The colours, the photos, how simple it is, a particular page.">
          <textarea className="brief-input" placeholder="Type here" name="likes" rows={3} />
        </Field>
        <div className="brief-field">
          <span className="brief-label">Do you have a logo and brand colours you are happy with?</span>
          <Chips name="brand" type="radio" options={["Yes, keep them", "Yes, but they could be sharper", "No, I need them"]} />
        </div>
        <div className="brief-field">
          <span className="brief-label">Photos</span>
          <Chips name="photos" type="radio" options={PHOTOS} />
        </div>
        <div className="brief-field">
          <span className="brief-label">The words on the site</span>
          <Chips name="words" type="radio" options={WORDS} />
        </div>
      </fieldset>

      <fieldset className="brief-section">
        <legend className="mono-heading text-ink">7. Size and timing</legend>
        <div className="brief-field">
          <span className="brief-label">Which size sounds closest?</span>
          <span className="brief-hint">
            These are guide prices. Every site is designed and built from scratch, and you get a fixed
            price before any work starts.
          </span>
          <div className="brief-sizes">
            {SIZES.map((s, i) => (
              <label key={s.value} className="brief-size">
                <input type="radio" name="size" value={s.value} required={i === 0} />
                <span className="brief-size-body">
                  <span className="brief-size-name">{s.name}</span>
                  {s.price && <span className="brief-size-price">{s.price}</span>}
                  <span className="brief-size-note">{s.note}</span>
                </span>
              </label>
            ))}
          </div>
        </div>
        <div className="brief-field">
          <span className="brief-label">When do you want it live?</span>
          <Chips name="timeline" type="radio" options={TIMELINES} />
        </div>
        <div className="brief-field">
          <span className="brief-label">Would you like me to host it?</span>
          <span className="brief-hint">Hosting is £20 a month, charged at cost.</span>
          <Chips name="hosting" type="radio" options={HOSTING} />
        </div>
        <Field label="Anything else I should know?" hint="Optional">
          <textarea className="brief-input" placeholder="Type here" name="notes" rows={3} />
        </Field>
      </fieldset>

      <input type="checkbox" name="botcheck" className="brief-hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="brief-actions">
        <button type="submit" className="sticker-pill is-pink" disabled={status === "sending"}>
          {status === "sending" ? "Sending" : "Send brief"}
        </button>
        {status === "error" && (
          <p className="brief-error" role="alert">
            Something went wrong. Please email {EMAIL} instead.
          </p>
        )}
      </div>
    </form>
  );
}
