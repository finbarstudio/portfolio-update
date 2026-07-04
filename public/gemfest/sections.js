/* ============================================================
   GemFest '27 — page sections below the hero.
   Component-style render functions fed by CONTENT (content.js),
   so swapping the data source for Sanity later is trivial.
   NOTE: cart/checkout/newsletter are visual placeholders — see
   TODOs. Does not touch the hero.
   ============================================================ */

/* <TicketCTABand> — hero-scale: giant display heading with two little
   icon bunches hugging its corners (top-left + bottom-right) */
function TicketCTABand({ heading, body, cta }) {
  return `
  <section class="band vh-frame" id="tickets-intro">
    <div class="container band__inner">
      <div class="band__head">
        <div class="band-bunch band-bunch--tl" aria-hidden="true">
          <img src="/gemfest/SVG/Asset 17.svg" alt="" />
          <img src="/gemfest/SVG/Asset 14.svg" alt="" />
          <img src="/gemfest/SVG/Asset 24.svg" alt="" />
          <img src="/gemfest/SVG/Asset 11.svg" alt="" />
          <img src="/gemfest/SVG/Asset 27.svg" alt="" />
          <img src="/gemfest/SVG/Asset 15.svg" alt="" />
          <img src="/gemfest/SVG/Asset 29.svg" alt="" />
          <img src="/gemfest/SVG/Asset 12.svg" alt="" />
          <img src="/gemfest/SVG/Asset 26.svg" alt="" />
        </div>
        <h2 class="display band__display">${heading}</h2>
        <div class="band-bunch band-bunch--br" aria-hidden="true">
          <img src="/gemfest/SVG/Asset 20.svg" alt="" />
          <img src="/gemfest/SVG/Asset 25.svg" alt="" />
          <img src="/gemfest/SVG/Asset 18.svg" alt="" />
          <img src="/gemfest/SVG/Asset 13.svg" alt="" />
          <img src="/gemfest/SVG/Asset 28.svg" alt="" />
          <img src="/gemfest/SVG/Asset 30.svg" alt="" />
          <img src="/gemfest/SVG/Asset 10.svg" alt="" />
          <img src="/gemfest/SVG/Asset 19.svg" alt="" />
        </div>
      </div>
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
        <a class="btn btn--accent btn--small" href="#">Buy</a>
      </div>
    </article>`).join("");
  return `
  <section class="ticket-list vh-frame" id="tickets">
    <div class="container">
      <div class="ticket-list__grid">${cards}</div>
      <p class="smallprint">Prices shown are placeholders. Final tiers to be confirmed.</p>
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
          <span class="sf-socialrow">${socials}</span>
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

/* hero fade-out: as the ticket band scrolls up over the pinned video,
   the whole hero (video + icons + grain) dissolves beneath it */
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.to("#heroSticky", {
    opacity: 0,
    ease: "none",
    scrollTrigger: {
      trigger: "#tickets-intro",
      start: "top 90%",
      end: "top 20%",
      scrub: true,
    },
  });
}

/* ===== bunch tilt: the icon clusters on the ticket heading react in
   3d to the cursor — subtle pitch/yaw toward it, easing off with
   distance, springless (power3 settles) ===== */
(function bunchTilt() {
  if (!window.gsap) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const RADIUS = 340;   // influence range (px)
  const TILT = 14;      // max degrees
  const bunches = [...document.querySelectorAll(".band-bunch")].map((el) => {
    gsap.set(el, { transformPerspective: 700 });
    return {
      el,
      toRX: gsap.quickTo(el, "rotationX", { duration: 0.7, ease: "power3.out" }),
      toRY: gsap.quickTo(el, "rotationY", { duration: 0.7, ease: "power3.out" }),
    };
  });
  if (!bunches.length) return;
  window.addEventListener("pointermove", (e) => {
    for (const b of bunches) {
      const r = b.el.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const dx = e.clientX - cx, dy = e.clientY - cy;
      const d = Math.hypot(dx, dy);
      if (d > RADIUS) { b.toRX(0); b.toRY(0); continue; }
      const n = 1 - d / RADIUS;
      const f = n * n * (3 - 2 * n) * TILT; // smoothstep falloff
      b.toRX((-dy / (d || 1)) * f);
      b.toRY((dx / (d || 1)) * f);
    }
  }, { passive: true });
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
  const hoverable = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 761px)").matches;
  const DEPTH = 14;   // extrusion depth, px
  const LAYERS = 10;  // planes in the stack
  const RANGE = 10;   // gimbal range under the cursor (deg)

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
      /* --ext (on the core) slides the stack diagonally: deeper layers
         shift further, so the thickness visibly grows to bottom-right */
      l.style.transform =
        `translate3d(calc(var(--ext, 0px) * ${t.toFixed(3)}), calc(var(--ext, 0px) * ${t.toFixed(3)}), ${(-DEPTH * t).toFixed(2)}px)`;
      /* CONTINUOUS darkening per layer — the old two-tone split read as
         a second, separate extrusion ("double depth") */
      const mix = (a, b) => Math.round(a + (b - a) * t);
      l.style.background = `rgb(${mix(167, 74)}, ${mix(5, 1)}, ${mix(101, 46)})`;
      core.appendChild(l);
    }
    btn.appendChild(core);

    gsap.set(core, { transformPerspective: 600 });

    if (hoverable) {
      /* enter: button face stays put — the THICKNESS grows out to the
         bottom-right. Then mouse movement gimbals + parallaxes it.
         NOTE: reset goes through the same quickTo tweens — a separate
         gsap.to with overwrite was KILLING the quickTo instances, which
         is why the perspective stopped responding after the first
         hover. */
      const toRX = gsap.quickTo(core, "rotationX", { duration: 0.45, ease: "power3.out" });
      const toRY = gsap.quickTo(core, "rotationY", { duration: 0.45, ease: "power3.out" });
      const toX = gsap.quickTo(core, "x", { duration: 0.45, ease: "power3.out" });
      const toY = gsap.quickTo(core, "y", { duration: 0.45, ease: "power3.out" });

      btn.addEventListener("pointerenter", () => {
        gsap.to(core, { "--ext": "14px", duration: 0.6, ease: "power4.inOut" });
      });
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;  // -0.5 .. 0.5
        const py = (e.clientY - r.top) / r.height - 0.5;
        toRX(-py * RANGE * 2.4);
        toRY(px * RANGE * 2.4);
        toX(px * 12);   // parallax drift with the cursor
        toY(py * 8);
      });
      btn.addEventListener("pointerleave", () => {
        toRX(0); toRY(0); toX(0); toY(0);
        gsap.to(core, { "--ext": "0px", duration: 0.7, ease: "power4.inOut" });
      });
    } else {
      /* mobile: no hover — rest in a subtle version of the pose and
         let scroll velocity nudge the tilt, springing back on settle */
      const REST_RX = 10, REST_RY = -10;
      gsap.set(core, { rotationX: REST_RX, rotationY: REST_RY });
      const toRX = gsap.quickTo(core, "rotationX", { duration: 0.6, ease: "power2.out" });
      let lastY = window.scrollY, settle;
      window.addEventListener("scroll", () => {
        const dy = window.scrollY - lastY;
        lastY = window.scrollY;
        toRX(REST_RX + Math.max(-14, Math.min(14, dy * 0.7)));
        clearTimeout(settle);
        settle = setTimeout(() => toRX(REST_RX), 140);
      }, { passive: true });
    }
  });
})();
