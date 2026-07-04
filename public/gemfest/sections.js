/* ============================================================
   GemFest '27 — page sections below the hero.
   Component-style render functions fed by CONTENT (content.js),
   so swapping the data source for Sanity later is trivial.
   NOTE: cart/checkout/newsletter are visual placeholders — see
   TODOs. Does not touch the hero.
   ============================================================ */

/* <TicketCTABand> */
function TicketCTABand({ heading, body, cta }) {
  return `
  <section class="band" id="tickets-intro">
    <div class="container band__inner">
      <h2 class="display">${heading}</h2>
      <p class="band__body">${body}</p>
      <a class="btn btn--accent" href="${cta.href}">${cta.label}</a>
    </div>
  </section>`;
}

/* <TicketList> */
function TicketList(tickets) {
  /* TODO: quantity controls + Buy are VISUAL ONLY — no cart logic. */
  const cards = tickets.map((t) => `
    <article class="ticket">
      <div class="ticket__info">
        <h3>${t.name}</h3>
        <p>${t.desc}</p>
      </div>
      <div class="ticket__buy">
        <span class="ticket__price">£${t.price}</span>
        <div class="qty" aria-label="Quantity (placeholder)">
          <button type="button" class="qty__btn" data-qty="-1">−</button>
          <span class="qty__num">1</span>
          <button type="button" class="qty__btn" data-qty="1">+</button>
        </div>
        <a class="btn btn--accent btn--small" href="/tickets">Buy</a>
      </div>
    </article>`).join("");
  return `
  <section class="ticket-list" id="tickets">
    <div class="container">
      <div class="ticket-list__grid">${cards}</div>
      <p class="smallprint">Prices shown are placeholders — final tiers to be confirmed.</p>
    </div>
  </section>`;
}

/* <DiscoverGrid> */
function DiscoverGrid(items) {
  const tiles = items.map((d, i) => `
    <a class="tile tile--${i % 4}" href="${d.href}">
      <span class="tile__tag">${d.tag}</span>
      <span class="tile__heading">${d.heading}</span>
      <span class="tile__arrow" aria-hidden="true">→</span>
    </a>`).join("");
  return `
  <section class="discover" id="discover">
    <div class="container">
      <h2 class="display">Discover</h2>
      <div class="discover__grid">${tiles}</div>
    </div>
  </section>`;
}

/* <NewsGrid> */
function NewsGrid(items) {
  const cards = items.map((n) => `
    <a class="news-card" href="${n.slug}">
      <div class="news-card__meta">
        <span class="news-card__tag">${n.tag}</span>
        <span class="news-card__date">${n.date}</span>
      </div>
      <h3>${n.headline}</h3>
      <span class="news-card__more" aria-hidden="true">Read →</span>
    </a>`).join("");
  return `
  <section class="news" id="news">
    <div class="container">
      <h2 class="display">Latest</h2>
      <div class="news__grid">${cards}</div>
    </div>
  </section>`;
}

/* <Footer> */
function Footer(f, meta) {
  const cols = f.columns.map((c) => `
    <div class="footer__col">
      <h4>${c.title}</h4>
      <ul>${c.links.map((l) => `<li><a href="${l.href}">${l.label}</a></li>`).join("")}</ul>
    </div>`).join("");
  const socials = f.socials.map((s) =>
    `<a href="${s.href}" target="_blank" rel="noopener">${s.label}</a>`).join("");
  return `
  <footer class="footer" id="footer">
    <div class="container footer__inner">
      <div class="footer__brand">
        <p class="footer__logo">GemFest<span class="footer__year">'27</span></p>
        <h4>${f.newsletter.heading}</h4>
        <p class="footer__blurb">${f.newsletter.body}</p>
        <!-- TODO: newsletter form is not wired to a backend -->
        <form class="newsletter" onsubmit="return false">
          <input type="email" placeholder="Email address" aria-label="Email address" required />
          <button type="submit" class="btn btn--accent btn--small">Sign up</button>
        </form>
      </div>
      <div class="footer__cols">${cols}</div>
    </div>
    <div class="container footer__base">
      <div class="footer__socials">${socials}</div>
      <p class="footer__credit">${meta.location} · ${meta.dates} · ${f.credit}</p>
    </div>
  </footer>`;
}

/* mount */
document.getElementById("site").innerHTML =
  TicketCTABand(CONTENT.ticketBand) +
  TicketList(CONTENT.tickets) +
  DiscoverGrid(CONTENT.discover) +
  NewsGrid(CONTENT.news) +
  Footer(CONTENT.footer, CONTENT.meta);

/* qty controls — visual only (TODO: real cart) */
document.getElementById("site").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-qty]");
  if (!btn) return;
  const num = btn.parentElement.querySelector(".qty__num");
  num.textContent = Math.max(1, parseInt(num.textContent, 10) + parseInt(btn.dataset.qty, 10));
});
