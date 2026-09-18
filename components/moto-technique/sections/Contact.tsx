"use client";

import Reveal from "../Reveal";

/**
 * Contact and footer in one full-height frame, over the Dino.
 * Their real details, and the same phone number that sits in the nav.
 */
export default function Contact({
  contact,
  name,
  established,
}: {
  contact: {
    name: string;
    address: string[];
    phone: string;
    phoneHref: string;
    email: string;
    instagram: string;
    image: string;
    credit?: string;
  };
  name: string;
  established: string;
}) {
  return (
    <section className="mt-contact" id="contact" data-tone="dark">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={contact.image} alt="" className="mt-contact-img" loading="lazy" decoding="async" />
      <div className="mt-contact-scrim" aria-hidden="true" />

      <div className="mt-wrap mt-contact-inner">
        <Reveal as="h2" className="mt-contact-h2">
          Bring us the car
        </Reveal>

        <Reveal className="mt-contact-grid" delay={0.1}>
          <div>
            <span className="mt-eyebrow">Workshop</span>
            <address>
              {contact.address.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </address>
          </div>
          <div>
            <span className="mt-eyebrow">Speak to Kevin</span>
            <a href={contact.phoneHref} className="mt-contact-big" data-cursor="Call">
              {contact.phone}
            </a>
            <a href={`mailto:${contact.email}`} className="mt-contact-big" data-cursor="Email">
              {contact.email}
            </a>
          </div>
          <div>
            <span className="mt-eyebrow">Follow</span>
            <a href={contact.instagram} target="_blank" rel="noopener noreferrer" data-cursor="Open">
              Instagram
            </a>
          </div>
        </Reveal>
      </div>

      <div className="mt-footer-mark" aria-hidden="true">
        <span>{name}</span>
        <span className="mt-footer-est">{established}</span>
      </div>

      {contact.credit ? <span className="mt-credit mt-credit-abs">Photo by {contact.credit}</span> : null}
    </section>
  );
}
