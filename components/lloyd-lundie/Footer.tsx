/**
 * The footer: how to reach them, the legal name, and a small credit line
 * crediting the demo back to finbar.studio. No wordmark here: the name lives
 * in the bar.
 */
export default function Footer({
  phoneMobile,
  phoneMobileHref,
  phoneOffice,
  phoneOfficeHref,
  email,
  facebookHandle,
  facebookHref,
  legalName,
  credit,
}: {
  phoneMobile: string;
  phoneMobileHref: string;
  phoneOffice: string;
  phoneOfficeHref: string;
  email: string;
  facebookHandle: string;
  facebookHref: string;
  legalName: string;
  credit: { label: string; href: string };
}) {
  return (
    <footer className="ll-footer">
      <div className="ll-footer-grid">
        <div>
          <span className="ll-footer-label">Call us</span>
          <a href={phoneMobileHref}>{phoneMobile}</a>
          <a href={phoneOfficeHref}>{phoneOffice}</a>
        </div>

        <div>
          <span className="ll-footer-label">Email</span>
          <a href={`mailto:${email}`}>{email}</a>
          <a href={facebookHref} target="_blank" rel="noopener noreferrer">
            {facebookHandle}
          </a>
        </div>

        <div>
          <span className="ll-footer-label">Company</span>
          <span>{legalName}</span>
          <a href={credit.href} target="_blank" rel="noopener noreferrer" className="ll-footer-credit">
            {credit.label}
          </a>
        </div>
      </div>
    </footer>
  );
}
