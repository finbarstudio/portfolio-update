/**
 * The footer, and the only thing after the shelf.
 *
 * Where they are, how to reach them, and the name. It carries id="contact" so
 * the menu's Contact link and the bar's icons all have somewhere to land.
 * Everything in it is from content/moto-technique.ts, verbatim from their
 * contact page.
 */
export default function Footer({
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
    maps: string;
  };
  name: string;
  established: string;
}) {
  return (
    <footer className="mt-footer" id="contact" data-tone="dark">
      <div className="mt-footer-grid">
        <div>
          <span className="mt-eyebrow">Workshop</span>
          <address className="mt-footer-address">
            <span>{contact.name}</span>
            {contact.address.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
          <a className="mt-footer-link" href={contact.maps} target="_blank" rel="noopener noreferrer">
            Open in Maps
          </a>
        </div>

        <div>
          <span className="mt-eyebrow">Speak to Kevin</span>
          <a className="mt-footer-big" href={contact.phoneHref} data-cursor="Call">
            {contact.phone}
          </a>
          <a className="mt-footer-big" href={`mailto:${contact.email}`} data-cursor="Email">
            {contact.email}
          </a>
        </div>

        <div>
          <span className="mt-eyebrow">Follow</span>
          <a className="mt-footer-link" href={contact.instagram} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
        </div>
      </div>

      <div className="mt-footer-base">
        <span className="mt-footer-name">{name}</span>
        <span className="mt-footer-est">{established}</span>
      </div>
    </footer>
  );
}
