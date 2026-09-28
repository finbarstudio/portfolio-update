"use client";

import { useState, type FormEvent } from "react";
import Reveal from "./Reveal";

/**
 * The contact block: intro + prices note, the form, and the phone/email/
 * Facebook details. This is a demo: submitting the form never makes a network
 * call, it just swaps the form for a thank-you state. No paste blocking,
 * proper <label>s for every field.
 */
export default function ContactSection({
  intro,
  pricesNote,
  formNote,
  thanks,
  phoneMobile,
  phoneMobileHref,
  phoneOffice,
  phoneOfficeHref,
  email,
  facebookHandle,
  facebookHref,
}: {
  intro: string;
  pricesNote: string;
  formNote: string;
  thanks: string;
  phoneMobile: string;
  phoneMobileHref: string;
  phoneOffice: string;
  phoneOfficeHref: string;
  email: string;
  facebookHandle: string;
  facebookHref: string;
}) {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <section className="ll-contact" id="contact">
      <div className="ll-wrap ll-contact-inner">
        <div className="ll-contact-copy">
          <Reveal as="h2" className="ll-section-title">
            Get in touch
          </Reveal>
          <Reveal as="p" className="ll-contact-intro" delay={0.06}>
            {intro}
          </Reveal>
          <Reveal as="p" className="ll-contact-prices" delay={0.1}>
            {pricesNote}
          </Reveal>

          <Reveal className="ll-contact-details" delay={0.14}>
            <a href={phoneMobileHref}>{phoneMobile}</a>
            <a href={phoneOfficeHref}>{phoneOffice}</a>
            <a href={`mailto:${email}`}>{email}</a>
            <a href={facebookHref} target="_blank" rel="noopener noreferrer">
              {facebookHandle}
            </a>
          </Reveal>
        </div>

        <Reveal className="ll-contact-form-wrap" delay={0.1}>
          {sent ? (
            <p className="ll-contact-thanks" role="status">
              {thanks}
            </p>
          ) : (
            <form className="ll-contact-form" onSubmit={handleSubmit}>
              <div className="ll-field">
                <label htmlFor="ll-name">Name</label>
                <input id="ll-name" name="name" type="text" autoComplete="name" required />
              </div>
              <div className="ll-field">
                <label htmlFor="ll-phone">Phone</label>
                <input id="ll-phone" name="phone" type="tel" autoComplete="tel" required />
              </div>
              <div className="ll-field">
                <label htmlFor="ll-email">Email</label>
                <input id="ll-email" name="email" type="email" autoComplete="email" required />
              </div>
              <div className="ll-field">
                <label htmlFor="ll-message">Message</label>
                <textarea id="ll-message" name="message" rows={4} required />
              </div>
              <button type="submit" className="ll-btn ll-btn-primary">
                Send message
              </button>
              <p className="ll-form-note">{formNote}</p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
