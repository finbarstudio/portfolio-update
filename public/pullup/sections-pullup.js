/* ============================================================
   PullUp Recordings — sections below the hero + nav behaviour.
   Reuses the shared section styles in styles.css (band / tiles /
   footer). Nav "Home" quick-scrolls back through the hero.
   ============================================================ */

/* <EventsSection> */
function EventsSection(events) {
  const cards = events.map((e) => `
    <a class="news-card" href="${e.cta.href}"${e.cta.href.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>
      <div class="news-card__meta">
        <span class="news-card__tag">Event</span>
        ${e.price ? `<span class="news-card__date">${e.price}</span>` : ""}
      </div>
      <h3>${e.name}</h3>
      <p class="pu-eventdesc">${e.desc}</p>
      <span class="news-card__more" aria-hidden="true">${e.cta.label} →</span>
    </a>`).join("");
  return `
  <section class="news vh-frame" id="events">
    <div class="container">
      <h2 class="display">Events</h2>
      <div class="news__grid">${cards}</div>
    </div>
  </section>`;
}

/* <MerchBand> */
function MerchBand(m) {
  return `
  <section class="band vh-frame" id="store">
    <div class="container band__inner">
      <h2 class="display">${m.heading}</h2>
      <p class="band__body">${m.body}</p>
      <a class="btn btn--accent" href="${m.cta.href}" target="_blank" rel="noopener">${m.cta.label}</a>
    </div>
  </section>`;
}

/* <ReleaseBand> */
function ReleaseBand(r) {
  return `
  <section class="band vh-frame" id="release" style="background:#f4f0ff">
    <div class="container band__inner">
      <h2 class="display">${r.heading}</h2>
      <p class="band__body">${r.body}</p>
      <a class="btn btn--accent" href="${r.cta.href}">${r.cta.label}</a>
    </div>
  </section>`;
}

/* <JoinGrid> */
function JoinGrid(items) {
  const tiles = items.map((d, i) => `
    <a class="tile tile--${i % 4}" href="${d.href}">
      <span class="tile__tag">${d.tag}</span>
      <span class="tile__heading">${d.heading}</span>
      <span class="tile__arrow" aria-hidden="true">→</span>
    </a>`).join("");
  return `
  <section class="discover vh-frame" id="join">
    <div class="container">
      <h2 class="display">Join the family</h2>
      <div class="discover__grid">${tiles}</div>
    </div>
  </section>`;
}

/* <Footer> */
function Footer(f) {
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
          <img class="footer-brandmark" src="/pullup/SVG/pullup-logo.svg" alt="PullUp Recordings" />
          <span class="sf-label">${f.subscribe.heading}</span>
          <p class="sf-blurb">${f.subscribe.body}</p>
          <!-- TODO: not wired to a backend -->
          <form class="newsletter" onsubmit="return false">
            <input type="email" placeholder="Email address" aria-label="Email address" required />
            <button type="submit" class="btn btn--accent btn--small">Subscribe</button>
          </form>
        </div>
      </div>
      ${cols}
      <div class="sf-col sf-col-end sf-reveal">
        <div class="sf-reveal-inner">
          <span class="sf-label">Follow</span>
          <span class="sf-socialrow">${socials}</span>
          <span class="sf-label">${f.credit}</span>
        </div>
      </div>
    </div>
  </footer>`;
}

/* ---------- mount ---------- */
document.getElementById("site").innerHTML =
  EventsSection(PU.events) +
  MerchBand(PU.merch) +
  ReleaseBand(PU.release) +
  JoinGrid(PU.join) +
  Footer(PU.footer);

/* Lenis measured the page BEFORE these sections existed, so its max-scroll
   was stuck at the hero height (couldn't scroll past it). Re-measure now,
   and again once fonts/images settle + ScrollTrigger refreshes. */
function refreshScroll() {
  window.__lenis?.resize();
  if (window.ScrollTrigger) ScrollTrigger.refresh();
}
requestAnimationFrame(refreshScroll);
window.addEventListener("load", refreshScroll);
document.fonts?.ready.then(refreshScroll).catch(() => {});

/* ---------- nav behaviour ---------- */
/* Home ease: very gentle, drawn-out start so the constellation dispersal
   reads, then smoothly through and a soft settle. Quintic in/out. */
function homeEase(t) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
}
function scrollToTarget(target) {
  const lenis = window.__lenis;
  // Home scrolls DOWN through the hero to the first section, slower the whole
  // way so the constellation dispersal reads — Lenis's default eased curve.
  const id = target === "home" ? "events" : target;
  const el = document.getElementById(id);
  if (!el) return;
  const cur = lenis ? lenis.scroll : (window.scrollY || 0);
  const y = Math.round(el.getBoundingClientRect().top + cur - 10);
  const home = target === "home";
  if (lenis) {
    lenis.scrollTo(y, {
      duration: home ? 5.0 : 1.1,   // slower for Home
      easing: home ? homeEase : undefined,   // long gentle start, soft settle
      force: true,                  // scroll even if lenis is momentarily locked
    });
  } else {
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}
document.querySelectorAll("[data-nav]").forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    scrollToTarget(a.dataset.nav);
    // close the mobile menu if open
    document.getElementById("mobileMenu")?.classList.remove("is-open");
    document.getElementById("navBurger")?.setAttribute("aria-expanded", "false");
    document.documentElement.style.overflow = "";
  });
});

/* footer reveal (near scroll-bottom) */
(function footerReveal() {
  const footer = document.getElementById("footer");
  if (!footer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  footer.classList.add("is-armed");
  let done = false;
  const check = () => {
    if (done) return;
    const remaining = footer.getBoundingClientRect().bottom - window.innerHeight;
    if (remaining < window.innerHeight * 0.22) { done = true; footer.classList.add("is-revealed"); window.removeEventListener("scroll", check); }
  };
  requestAnimationFrame(() => { check(); window.addEventListener("scroll", check, { passive: true }); window.addEventListener("resize", check); });
})();
