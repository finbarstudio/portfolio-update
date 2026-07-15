/* QLD Pool Installs demo — working scaffold.
   One 100svh hero + the site nav, ready to design into. Nav items mirror the
   real site's structure (pool range / concrete / renovations / gallery /
   reviews) so the demo maps 1:1 onto their actual content. */

const NAV_LINKS = [
  { label: "Pool Range", href: "#range" },
  { label: "Concrete Pools", href: "#concrete" },
  { label: "Renovations", href: "#renovations" },
  { label: "Gallery", href: "#gallery" },
  { label: "Reviews", href: "#reviews" },
];

export default function Home() {
  return (
    <main className="qpi-main">
      <header className="qpi-nav">
        <a href="#top" className="qpi-logo">
          QLD <span>Pool Installs</span>
        </a>
        <nav className="qpi-nav-links" aria-label="Main navigation">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
        </nav>
        <a href="tel:+61423123248" className="qpi-nav-cta">Get a quote</a>
      </header>

      <section className="qpi-hero" id="top" aria-label="Introduction">
        <p className="qpi-hero-kicker">Brisbane · Gold Coast · Sunshine Coast</p>
        <h1 className="qpi-hero-title">
          Fibreglass and concrete pools, built for Queensland backyards.
        </h1>
        <p className="qpi-hero-sub">
          {/* PLACEHOLDER — hero copy and imagery to come with the design pass. */}
          Design, installation and renovations across South East Queensland and
          Northern NSW.
        </p>
      </section>
    </main>
  );
}
