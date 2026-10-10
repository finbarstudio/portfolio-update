"use client";

/**
 * BriefForm — the website brief a prospect fills in so a site can be scoped.
 * Lives at /webform. It asks for what Finbar can NOT see by looking at their
 * current site: how the business gets work, how the site is run day to day,
 * and what they want from a new one. No prices here; the quote comes after.
 * Posts to Web3Forms, which emails the answers to Finbar; the mailto branch is
 * only a safety net if the key is ever removed.
 */

import { useCallback, useState } from "react";

const EMAIL = "finbar@finbar.studio";
/* Web3Forms access keys are public by design (they ship in the page), so this
   form's own key lives here and works without any environment setup. */
const W3F_KEY = "507b6a42-46fc-48a2-91bd-691168385977";

type Status = "idle" | "sending" | "sent" | "error";

const SOURCES = ["Google search", "Word of mouth", "Repeat customers", "Social media", "Directories or review sites", "Paid ads", "Not sure"];
const CONTACT_WAYS = ["Phone call", "WhatsApp or text", "Email", "The form on my site", "Social media messages"];
const SITE_WORKS = ["Yes, a lot", "Some", "Hardly any", "No idea"];

const UPDATE_FREQ = ["Every week", "Every month", "A few times a year", "Hardly ever"];
const UPDATE_WHAT = ["New projects or photos", "Prices or services", "News or blog posts", "Offers", "Opening hours or contact details", "Reviews"];
const UPDATE_HOW = ["I do it myself", "Someone on my team does", "I pay a web person or agency", "Nobody, it never gets updated"];
const UPDATE_EASE = ["Easy", "Fiddly but I manage", "Painful, I avoid it"];
const PLATFORMS = ["WordPress", "Wix", "Squarespace", "Shopify", "GoDaddy", "Custom built", "No idea"];
const PLATFORM_HAPPY = ["Yes, it works for me", "It is fine, but I would change if it were easy", "No, I would prefer something else"];
const SWITCH = ["Yes, happy to move", "Yes, as long as I can still update it myself", "I would prefer to stay where I am", "Not sure, tell me more"];
const LOGINS = ["Yes, I have them all", "Some of them", "No, someone else set it up", "Not sure"];
const UPDATE_WAY = ["A simple editing screen I log in to", "Ask an AI tool to make the change", "Send the change to you", "Not sure yet"];
const AFTER_LAUNCH = ["Hand it all over, I will run it", "Hand it over, but stay on call for changes", "Look after it for me", "Not sure yet"];
const AI_USE = ["Yes, most days", "Now and then", "No"];

const GOALS = [
  "Get more enquiries",
  "Get better enquiries, not more",
  "Take quote or booking requests",
  "Show off our work",
  "Look more professional",
  "Work properly on a phone",
  "Save us time answering the same questions",
];

const PAGES = [
  "Exactly as on my site now",
  "Home",
  "About",
  "Services",
  "Projects or gallery",
  "Reviews",
  "Blog or news",
  "Contact",
];

const DEVICES = ["Mostly on a phone", "Mostly on a computer", "About half and half", "Not sure"];
const BRAND = ["Yes, keep them", "Yes, but they could be sharper", "No, I need them"];
const PHOTOS = ["We have good photos", "We have some, they need work", "We need new photos"];
const WORDS = ["We will write it", "We need help with the words", "Keep what is on our site now"];
const TIMELINES = ["As soon as possible", "In the next 1 to 2 months", "In 3 months or more", "No deadline"];
const DECIDES = ["Just me", "Me and a partner", "A few of us"];

/** Field labels in the order they appear in the email. */
const ORDER: [string, string][] = [
  ["name", "Name"],
  ["business", "Business"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["website", "Current website"],
  ["platform", "Current platform"],
  ["platform_happy", "Happy with the platform"],
  ["update_how", "Who updates it now"],
  ["update_ease", "How updating feels now"],
  ["switch", "Willing to move platform"],
  ["platform_miss", "What they would miss from the platform"],
  ["logins", "Has domain and site logins"],
  ["best_work", "Work they want more of"],
  ["ideal_customer", "Ideal customer"],
  ["sources", "Where enquiries come from"],
  ["enquiries", "Enquiries in a typical week"],
  ["contact_ways", "How customers get in touch"],
  ["questions", "What customers ask before booking"],
  ["competitors", "Competitors"],
  ["site_works", "Does the site bring in work"],
  ["current_likes", "What they like about the current site"],
  ["current_dislikes", "What they do not like about it"],
  ["customer_feedback", "What customers say or get stuck on"],
  ["why_now", "Why now"],
  ["update_freq", "How often they want to update"],
  ["update_what", "What they update"],
  ["ai_use", "Uses AI tools"],
  ["ai_tools", "Which AI tools"],
  ["update_way", "How they want to make updates"],
  ["after_launch", "After launch"],
  ["goals", "Main goals"],
  ["one_thing", "The one thing it must do"],
  ["devices", "How customers visit the site"],
  ["mobile_issues", "Problems on a phone"],
  ["pages", "Pages needed"],
  ["new_ideas", "New things they want on the site"],
  ["inspo_1", "Inspiration link 1"],
  ["inspo_2", "Inspiration link 2"],
  ["inspo_3", "Inspiration link 3"],
  ["likes", "What they like about those sites"],
  ["avoid", "What to avoid"],
  ["brand", "Logo and brand"],
  ["photos", "Photos"],
  ["words", "Words"],
  ["timeline", "Timeline"],
  ["decides", "Who decides"],
  ["notes", "Anything else"],
];

function Chips({ name, options, type = "checkbox" }: { name: string; options: string[]; type?: "checkbox" | "radio" }) {
  return (
    <>
      <div className="brief-chips">
        {options.map((o) => (
          <label key={o} className="brief-chip">
            <input type={type} name={name} value={o} />
            <span>{o}</span>
          </label>
        ))}
      </div>
      {/* Same field name, so a typed answer is sent alongside any chips picked. */}
      <input className="brief-input brief-other" name={name} type="text" placeholder="Something else? Type it here" aria-label="Something else" />
    </>
  );
}

function Choice({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="brief-field">
      <span className="brief-label">{label}</span>
      {hint && <span className="brief-hint">{hint}</span>}
      {children}
    </div>
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

function Text({ name, rows = 3 }: { name: string; rows?: number }) {
  return <textarea className="brief-input" placeholder="Type here" name={name} rows={rows} />;
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
    const subject = `Website brief: ${business}`;

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
        <p>I will read it through and come back to you within two working days with a plan for your site.</p>
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
      </fieldset>

      <fieldset className="brief-section">
        <legend className="mono-heading text-ink">2. Your current setup</legend>
        <Choice label="What is your current site built on?">
          <Chips name="platform" type="radio" options={PLATFORMS} />
        </Choice>
        <Choice label="Are you happy with that platform?">
          <Chips name="platform_happy" type="radio" options={PLATFORM_HAPPY} />
        </Choice>
        <Choice label="Who updates your site at the moment?">
          <Chips name="update_how" type="radio" options={UPDATE_HOW} />
        </Choice>
        <Choice label="How does updating it feel right now?">
          <Chips name="update_ease" type="radio" options={UPDATE_EASE} />
        </Choice>
        <div className="brief-note">
          <p>
            <strong>Worth knowing before you go on.</strong> I do not work in website builders such
            as WordPress, Wix or Squarespace. I design and code every site from scratch.
          </p>
          <p>
            Running the site costs £20 a month. There is no markup on that. It covers what I pay for
            website hosting, media hosting and an editing system, if you want one.
          </p>
          <p>
            You can stop paying at any time. If you do, I will transfer the whole site and its
            original code to you, and walk you through it until you are set up.
          </p>
          <p>
            You keep paying for your domain name as you do now. If you pay monthly for a website
            builder at the moment, cancelling it may well cover this cost.
          </p>
        </div>
        <Choice label="Would you be happy to move off your current platform?">
          <Chips name="switch" type="radio" options={SWITCH} />
        </Choice>
        <Field label="Is there anything your current platform does that you would miss?" hint="Optional. For example a booking plugin, a quote form, or a way you post updates.">
          <Text name="platform_miss" rows={2} />
        </Field>
        <Choice label="Do you have the logins for your domain name and your current site?" hint="It is fine if you do not. It just tells me what we need to track down.">
          <Chips name="logins" type="radio" options={LOGINS} />
        </Choice>
      </fieldset>

      <fieldset className="brief-section">
        <legend className="mono-heading text-ink">3. How your business gets work</legend>
        <Field label="Which jobs or services do you most want more of?" hint="The ones that pay best, or the ones you enjoy most.">
          <Text name="best_work" />
        </Field>
        <Field label="Describe your ideal customer" hint="Who they are, where they are, and what they usually need from you.">
          <Text name="ideal_customer" />
        </Field>
        <Choice label="Where do most of your enquiries come from now?" hint="Pick any that apply">
          <Chips name="sources" options={SOURCES} />
        </Choice>
        <Field label="Roughly how many enquiries do you get in a typical week?">
          <input className="brief-input" placeholder="Type here" name="enquiries" type="text" />
        </Field>
        <Choice label="How do customers usually get in touch?" hint="Pick any that apply">
          <Chips name="contact_ways" options={CONTACT_WAYS} />
        </Choice>
        <Field label="What do customers nearly always ask before they book?" hint="Price, how long it takes, whether you cover their area, and so on.">
          <Text name="questions" />
        </Field>
        <Field label="Who are your main competitors?" hint="Optional. Names or links. It helps to know who you are up against.">
          <Text name="competitors" rows={2} />
        </Field>
      </fieldset>

      <fieldset className="brief-section">
        <legend className="mono-heading text-ink">4. Your website now</legend>
        <Choice label="Does your current site bring in work?">
          <Chips name="site_works" type="radio" options={SITE_WORKS} />
        </Choice>
        <Field label="What do you like about it?" hint="Be specific. A page, a photo, the wording, anything worth keeping.">
          <Text name="current_likes" />
        </Field>
        <Field label="What do you not like about it?" hint="Be specific. For example: hard to find prices, looks dated on a phone, the gallery is slow.">
          <Text name="current_dislikes" />
        </Field>
        <Field label="Do customers ever say anything about the site, or get stuck on it?" hint="Optional">
          <Text name="customer_feedback" rows={2} />
        </Field>
        <Field label="What made you start thinking about a new site now?">
          <Text name="why_now" rows={2} />
        </Field>
      </fieldset>

      <fieldset className="brief-section">
        <legend className="mono-heading text-ink">5. Running the new site</legend>
        <Choice label="How often would you like to update the site?">
          <Chips name="update_freq" type="radio" options={UPDATE_FREQ} />
        </Choice>
        <Choice label="What would you be changing?" hint="Pick any that apply">
          <Chips name="update_what" options={UPDATE_WHAT} />
        </Choice>
        <Choice
          label="Do you use any AI tools, such as ChatGPT or Claude?"
          hint="I ask because the site can be set up so you make your own updates by asking an AI tool, if you would like to work that way."
        >
          <Chips name="ai_use" type="radio" options={AI_USE} />
        </Choice>
        <Field label="Which ones, and what for?" hint="Optional. For example ChatGPT for writing emails.">
          <input className="brief-input" placeholder="Type here" name="ai_tools" type="text" />
        </Field>
        <Choice label="How would you like to make updates on the new site?">
          <Chips name="update_way" type="radio" options={UPDATE_WAY} />
        </Choice>
        <Choice label="Once the site is live, how involved would you like me to be?">
          <Chips name="after_launch" type="radio" options={AFTER_LAUNCH} />
        </Choice>
      </fieldset>

      <fieldset className="brief-section">
        <legend className="mono-heading text-ink">6. The new site</legend>
        <Choice label="What should the new site do for you?" hint="Pick any that apply">
          <Chips name="goals" options={GOALS} />
        </Choice>
        <Field label="If the new site could only do one thing well, what should it be?">
          <Text name="one_thing" rows={2} />
        </Field>
        <Choice label="How do most of your customers look at your site?" hint="I design the phone version first, because that is where most people will see it.">
          <Chips name="devices" type="radio" options={DEVICES} />
        </Choice>
        <Field label="Is there anything about your current site that is awkward on a phone?" hint="Optional. Small text, buttons that are hard to tap, a menu that hides things.">
          <Text name="mobile_issues" rows={2} />
        </Field>
        <Choice label="Which pages do you need?">
          <Chips name="pages" options={PAGES} />
        </Choice>
        <Field label="Is there anything new you want the site to do that it does not do now?" hint="Optional. A new tool, a new section, something you have seen elsewhere.">
          <Text name="new_ideas" />
        </Field>
        <Choice label="Websites you like the look of" hint="Paste up to three links. They do not need to be in your industry.">
          <input className="brief-input" name="inspo_1" type="text" inputMode="url" placeholder="www." aria-label="Inspiration link 1" />
          <input className="brief-input" name="inspo_2" type="text" inputMode="url" placeholder="www." aria-label="Inspiration link 2" />
          <input className="brief-input" name="inspo_3" type="text" inputMode="url" placeholder="www." aria-label="Inspiration link 3" />
        </Choice>
        <Field label="What do you like about them?" hint="The colours, the photos, how simple it is, a particular page.">
          <Text name="likes" />
        </Field>
        <Field label="Is there anything you definitely do not want?" hint="Optional. A style, a colour, a feature you find annoying on other sites.">
          <Text name="avoid" rows={2} />
        </Field>
      </fieldset>

      <fieldset className="brief-section">
        <legend className="mono-heading text-ink">7. Content and timing</legend>
        <Choice label="Do you have a logo and brand colours you are happy with?">
          <Chips name="brand" type="radio" options={BRAND} />
        </Choice>
        <Choice label="Photos">
          <Chips name="photos" type="radio" options={PHOTOS} />
        </Choice>
        <Choice label="The words on the site">
          <Chips name="words" type="radio" options={WORDS} />
        </Choice>
        <Choice label="When do you want it live?">
          <Chips name="timeline" type="radio" options={TIMELINES} />
        </Choice>
        <Choice label="Who makes the final decision on the site?">
          <Chips name="decides" type="radio" options={DECIDES} />
        </Choice>
        <Field label="Anything else I should know?" hint="Optional">
          <Text name="notes" />
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
        <p className="brief-contact">
          Any questions before you send this? Email{" "}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a> or call <a href="tel:+447876492551">+44 7876 492551</a>.
        </p>
      </div>
    </form>
  );
}
