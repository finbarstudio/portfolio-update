"use client";

// Minimal nav: text-only links, no backgrounds, no pills.
const LINKS = [
  { href: "/toombul#club", label: "Club" },
  { href: "/toombul#merch", label: "Merch" },
  { href: "/toombul#contact", label: "Contact" },
];

export default function Nav() {
  return (
    <header className="tc-nav">
      <a href="/toombul" className="tc-nav-brand" aria-label="Toombul District Cricket Club, home">
        <span className="tc-nav-word">
          Toombul
          <small>District Cricket Club</small>
        </span>
      </a>
      <nav className="tc-nav-links">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
