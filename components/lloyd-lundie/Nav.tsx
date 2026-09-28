"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The bar, and the wordmark that travels into it.
 *
 * The bar: a home icon on the left, a mail icon and the quote button on the
 * right, nothing in the middle but room for the name. The mail icon opens one
 * small window under the bar with the email and both phone numbers (the /mt
 * pattern): Escape, a click outside or the icon again closes it, and focus goes
 * back to the icon.
 *
 * The travelling wordmark: at the top of the page "Lloyd Lundie" sits large
 * and white in the middle of the hero photograph with "Building Contractors"
 * under it. As the page scrolls it rises and shrinks until, at DOCK of a screen
 * height, it lands in the centre of the bar at the bar's own size, with the
 * descriptor gone so it is no taller than the icons beside it. It is one fixed
 * element moved with a transform, so nothing reflows. The scroll progress also
 * goes on <html> as --ll-p, which the hero's laurel reads to fade out as the
 * name passes it.
 *
 * Over the hero the bar has no background and white icons; once the name has
 * docked it turns white with navy icons and the name turns navy. The page's
 * smooth scroll (Lenis) drives native scroll, so a scroll listener is enough.
 */

const DOCK = 0.55;

const ICON = {
  home: "M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z",
  mail: "M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z",
  close: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
};

function Icon({ name }: { name: keyof typeof ICON }) {
  return (
    <svg viewBox="0 0 24 24" className="ll-icon" fill="currentColor" aria-hidden="true" focusable="false">
      <path d={ICON[name]} />
    </svg>
  );
}

export default function Nav({
  email,
  phones,
}: {
  email: string;
  phones: { label: string; value: string; href: string }[];
}) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  const name = useRef<HTMLSpanElement>(null);
  const win = useRef<HTMLDivElement>(null);
  const mailBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let frame = 0;
    const root = document.documentElement;

    const place = () => {
      frame = 0;
      const m = mark.current;
      const n = name.current;
      const b = bar.current;
      if (!m || !n || !b) return;

      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, window.scrollY / (vh * DOCK)));
      // ease in and out, so it leaves the hero gently and settles into the bar
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;

      const big = parseFloat(getComputedStyle(n).fontSize);
      const small = window.innerWidth < 700 ? 22 : 26;
      const scale = 1 + (small / big - 1) * e;
      const h = n.offsetHeight;
      const y0 = vh * 0.44 - h / 2;
      const y1 = b.offsetHeight / 2 - (h * small) / big / 2;
      const y = y0 + (y1 - y0) * e;

      m.style.transform = `translate3d(-50%, ${y}px, 0) scale(${scale})`;
      m.style.setProperty("--ll-desc", String(Math.max(0, 1 - p * 3)));
      root.style.setProperty("--ll-p", p.toFixed(3));
      setSolid(p >= 1);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(place);
    };

    place();
    document.fonts?.ready.then(place);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      root.style.removeProperty("--ll-p");
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    win.current?.focus();
    const close = (refocus: boolean) => {
      setOpen(false);
      if (refocus) mailBtn.current?.focus();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (win.current?.contains(t) || mailBtn.current?.contains(t)) return;
      close(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const toTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOpen(false);
    const lenis = (window as unknown as { __llLenis?: { scrollTo(t: number): void } }).__llLenis;
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const tone = solid || open ? "1" : "0";

  return (
    <>
      <header ref={bar} className="ll-nav" data-solid={tone}>
        <div className="ll-nav-inner">
          <a href="#top" className="ll-icon-btn" aria-label="Home, back to the top" onClick={toTop}>
            <Icon name="home" />
          </a>

          <div className="ll-nav-right">
            <button
              ref={mailBtn}
              type="button"
              className="ll-icon-btn"
              aria-label={open ? "Close contact details" : "Email and phone"}
              aria-expanded={open}
              aria-controls="ll-window"
              onClick={() => setOpen((o) => !o)}
            >
              <Icon name={open ? "close" : "mail"} />
            </button>
            <a href="#contact" className="ll-btn ll-btn-primary ll-nav-cta">
              Get a quote
            </a>
          </div>
        </div>
      </header>

      {/* The name. Decorative here: the hero's h1 and the home icon carry it for
          screen readers, so it never swallows a click. */}
      <div ref={mark} className="ll-fly" data-solid={tone} aria-hidden="true">
        <span ref={name} className="ll-fly-name">
          Lloyd Lundie
        </span>
        <span className="ll-fly-desc">Building Contractors</span>
      </div>

      <div
        ref={win}
        id="ll-window"
        className="ll-window"
        role="dialog"
        aria-label="Email and phone"
        tabIndex={-1}
        data-open={open ? "1" : "0"}
        inert={!open}
      >
        <span className="ll-window-label">Email us</span>
        <a className="ll-window-lead" href={`mailto:${email}`}>
          {email}
        </a>
        <span className="ll-window-label ll-window-label-gap">Call us</span>
        {phones.map((ph) => (
          <a key={ph.href} className="ll-window-phone" href={ph.href}>
            <span>{ph.label}</span>
            {ph.value}
          </a>
        ))}
      </div>
    </>
  );
}
