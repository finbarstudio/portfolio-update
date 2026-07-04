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
  <section class="band vh-frame" id="tickets-intro">
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
  <section class="ticket-list vh-frame" id="tickets">
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
  <section class="discover vh-frame" id="discover">
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
  <section class="news vh-frame" id="news">
    <div class="container">
      <h2 class="display">Latest</h2>
      <div class="news__grid">${cards}</div>
    </div>
  </section>`;
}

/* <Footer> — full-screen bottom-anchored footer: thin rule up top,
   open space, compact info row, giant logo running along the bottom.
   Reveals (rule wipe + logo rise + column mask-slides) near
   scroll-bottom. Adapted from finbar.studio's SiteFooter. */
function Footer(f, meta) {
  const cols = f.columns.map((c) => `
    <div class="sf-col sf-reveal">
      <div class="sf-reveal-inner">
        <span class="sf-label">${c.title}</span>
        ${c.links.map((l) => `<a class="sf-link" href="${l.href}">${l.label}</a>`).join("")}
      </div>
    </div>`).join("");
  const socials = f.socials.map((s) =>
    `<a class="sf-value" href="${s.href}" target="_blank" rel="noopener">${s.label}</a>`).join("");
  return `
  <footer class="footer" id="footer">
    <div class="footer-info">
      <div class="sf-col sf-col-wide sf-reveal">
        <div class="sf-reveal-inner">
          <img class="footer-brandmark" src="/gemfest/SVG/logo.svg" alt="GemFest" />
          <span class="sf-label">${f.newsletter.heading}</span>
          <p class="sf-blurb">${f.newsletter.body}</p>
          <!-- TODO: newsletter form is not wired to a backend -->
          <form class="newsletter" onsubmit="return false">
            <input type="email" placeholder="Email address" aria-label="Email address" required />
            <button type="submit" class="btn btn--accent btn--small">Sign up</button>
          </form>
        </div>
      </div>
      ${cols}
      <div class="sf-col sf-col-end sf-reveal">
        <div class="sf-reveal-inner">
          <span class="sf-label">Follow</span>
          ${socials}
          <span class="sf-value">${meta.location}</span>
          <span class="sf-value">${meta.dates}</span>
          <span class="sf-label">${f.credit}</span>
        </div>
      </div>
    </div>

    <div class="footer-mark" aria-label="GemFest '27">
      <span class="footer-mark-text" id="footerMark">GemFest<span class="fm-year">'27</span></span>
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

/* fit the giant footer wordmark edge-to-edge (portfolio-style
   iterative fit: converge font-size until scrollWidth fills row) */
(function fitFooterMark() {
  const el = document.getElementById("footerMark");
  if (!el) return;
  const fit = () => {
    const parent = el.parentElement;
    const cs = getComputedStyle(parent);
    const avail = parent.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    if (avail <= 0) return;
    el.style.fontSize = "100px";
    let size = (avail / el.scrollWidth) * 100;
    for (let i = 0; i < 4; i++) {
      el.style.fontSize = `${Math.max(20, size)}px`;
      const m = el.scrollWidth;
      if (Math.abs(m - avail) <= 0.5) break;
      size = size * (avail / m);
    }
  };
  fit();
  requestAnimationFrame(fit);
  document.fonts?.ready.then(fit).catch(() => {});
  window.addEventListener("resize", fit);
})();

/* footer reveal: armed (hidden) until you near the page bottom, then
   the rule wipes, columns mask-slide up, and the giant logo rises */
(function footerReveal() {
  const footer = document.getElementById("footer");
  if (!footer) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  footer.classList.add("is-armed");
  let done = false;
  const check = () => {
    if (done) return;
    const remaining = footer.getBoundingClientRect().bottom - window.innerHeight;
    if (remaining < window.innerHeight * 0.22) {
      done = true;
      footer.classList.add("is-revealed");
      window.removeEventListener("scroll", check);
    }
  };
  requestAnimationFrame(() => {
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
  });
})();

/* qty controls — visual only (TODO: real cart) */
document.getElementById("site").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-qty]");
  if (!btn) return;
  const num = btn.parentElement.querySelector(".qty__num");
  num.textContent = Math.max(1, parseInt(num.textContent, 10) + parseInt(btn.dataset.qty, 10));
});

/* ===== real 3D buttons (desktop) =====
   Rebuild each .btn--accent as a true extruded stack (planes at depth, like the
   hero icons) and tilt it toward the cursor; spring back on leave. Progressive:
   phones/no-hover keep the plain slab button. */
(function extrudeButtons() {
  if (!window.gsap) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 761px)").matches) return;
  const DEPTH = 14;   // extrusion depth, px
  const LAYERS = 10;  // planes in the stack
  const MAX_TILT = 22;

  document.querySelectorAll(".btn--accent").forEach((btn) => {
    const cs = getComputedStyle(btn);
    const pad = cs.padding;
    btn.classList.add("btn-3d");

    const core = document.createElement("span");
    core.className = "btn3d-core";
    core.style.padding = pad;

    const label = document.createElement("span");
    label.className = "btn3d-label";
    while (btn.firstChild) label.appendChild(btn.firstChild);
    core.appendChild(label);

    for (let i = 1; i <= LAYERS; i++) {
      const t = i / LAYERS;
      const l = document.createElement("span");
      l.className = "btn3d-layer";
      l.setAttribute("aria-hidden", "true");
      l.style.transform = `translateZ(${(-DEPTH * t).toFixed(2)}px)`;
      // darken toward the back so the extrusion reads like the icons' slabs
      l.style.background = `linear-gradient(135deg, #8F0159, ${t > 0.55 ? "#5E013A" : "#A70565"})`;
      core.appendChild(l);
    }
    btn.appendChild(core);

    gsap.set(core, { transformPerspective: 600 });
    const toRX = gsap.quickTo(core, "rotationX", { duration: 0.5, ease: "power3.out" });
    const toRY = gsap.quickTo(core, "rotationY", { duration: 0.5, ease: "power3.out" });

    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;  // -0.5 .. 0.5
      const py = (e.clientY - r.top) / r.height - 0.5;
      toRX(-py * MAX_TILT * 2);
      toRY(px * MAX_TILT * 2);
    });
    btn.addEventListener("pointerleave", () => {
      gsap.to(core, { rotationX: 0, rotationY: 0, duration: 0.9, ease: "elastic.out(1, 0.45)" });
    });
  });
})();
