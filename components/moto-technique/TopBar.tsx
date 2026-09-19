"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The bar: the wordmark top left, a few icons and the menu top right.
 *
 * Every icon opens the same small window under the bar with one thing in it:
 * the phone number, the email address, where the workshop is, or the menu. It
 * is a window, not a page and not a full-screen takeover, because each holds a
 * line or two. One is open at a time; Escape, a click outside, or the same icon
 * again closes it, and focus goes back to the icon that opened it.
 *
 * WHITE, UNLESS IT IS OVER WHITE. The bar is white. The one thing that turns it
 * black is sitting over a light section, and nothing else does: not a bright
 * photograph, not a pale patch of one. (It used to invert against whatever was
 * under it, pixel by pixel, which also flipped it over bright parts of a
 * photograph and turned it odd colours over anything that was not black or
 * white.) Each section says what it is with `data-tone`, and on scroll this
 * looks at what is under each end of the bar and reads that section's tone.
 *
 * The two ends decide separately, because when the hero splits they really are
 * over different things: the wordmark over the photograph, the icons over the
 * white panel.
 *
 * Icons are Material Symbols (outlined), inlined so they take `currentColor`.
 * Everything shown comes from content/moto-technique.ts.
 */

type Panel = "call" | "mail" | "place" | "menu";

type Contact = {
  name: string;
  address: string[];
  phone: string;
  phoneHref: string;
  email: string;
  instagram: string;
  maps: string;
};

const ICON: Record<Panel | "close", string> = {
  call: "M6.54 5c.06.89.21 1.76.45 2.59l-1.2 1.2c-.41-1.2-.67-2.47-.76-3.79h1.51m9.86 12.02c.85.24 1.72.39 2.6.45v1.49c-1.32-.09-2.59-.35-3.8-.75l1.2-1.19M7.5 3H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.49c0-.55-.45-1-1-1-1.24 0-2.45-.2-3.57-.57-.1-.04-.21-.05-.31-.05-.26 0-.51.1-.71.29l-2.2 2.2c-2.83-1.45-5.15-3.76-6.59-6.59l2.2-2.2c.28-.28.36-.67.25-1.02C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1z",
  mail: "M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z",
  place:
    "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9zm5-2.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z",
  menu: "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z",
  close: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
};

const LABEL: Record<Panel, string> = {
  call: "Phone",
  mail: "Email",
  place: "Find us",
  menu: "Menu",
};

function Icon({ name }: { name: Panel | "close" }) {
  return (
    <svg viewBox="0 0 24 24" className="mt-icon" fill="currentColor" aria-hidden="true" focusable="false">
      <path d={ICON[name]} />
    </svg>
  );
}

export default function TopBar({
  name,
  nav,
  contact,
}: {
  name: string;
  nav: { label: string; href: string }[];
  contact: Contact;
}) {
  const [panel, setPanel] = useState<Panel | null>(null);
  const win = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLAnchorElement>(null);
  const toolbox = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /** The tone of whatever section is under the middle of `el`. */
    const toneUnder = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      const stack = document.elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      // skip the bar itself and anything else that floats above the page
      const below = stack.find((n) => !n.closest(".mt-bar, .mt-window, .mt-cursor, .mt-pre"));
      return below?.closest<HTMLElement>("[data-tone]")?.dataset.tone === "light" ? "light" : "dark";
    };

    let frame = 0;
    const update = () => {
      frame = 0;
      for (const el of [word.current, toolbox.current]) {
        if (!el) continue;
        const tone = toneUnder(el);
        if (el.dataset.over !== tone) el.dataset.over = tone;
      }
    };
    // Two frames, not one. The hero moves its white panel in a frame callback of
    // its own on the same scroll event; reading in the very next frame can land
    // before that and see where the panel WAS. One frame later it has moved.
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(() => (frame = requestAnimationFrame(update)));
    };

    onScroll();
    // The page under the bar also changes with no scroll at all: once when the
    // preloader lifts, and whenever fonts or images settle.
    const settle = window.setTimeout(onScroll, 1200);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.clearTimeout(settle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  const opener = useRef<HTMLButtonElement | null>(null);

  const close = (refocus = true) => {
    setPanel(null);
    if (refocus) opener.current?.focus();
  };

  useEffect(() => {
    if (!panel) return;
    win.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (win.current?.contains(t)) return;
      // The icons toggle themselves; do not close first and reopen on click.
      if ((t as HTMLElement).closest?.(".mt-bar-tools")) return;
      close(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [panel]);

  /** Menu links ride the smooth scroll if it is running, and jump if it is not. */
  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const lenis = (window as unknown as { __mtLenis?: { scrollTo(t: string | number): void } }).__mtLenis;
    close(false);
    if (!lenis) return;
    e.preventDefault();
    lenis.scrollTo(href === "#top" ? 0 : href);
  };

  const tools: Panel[] = ["call", "mail", "place", "menu"];

  return (
    <>
      <header className="mt-bar">
        <a ref={word} href="#top" className="mt-wordmark" data-over="dark" aria-label={`${name}, back to the top`} onClick={(e) => go(e, "#top")}>
          {name}
        </a>

        <div ref={toolbox} className="mt-bar-tools" data-over="dark">
          {tools.map((id) => (
            <button
              key={id}
              type="button"
              className="mt-tool"
              data-tool={id}
              aria-label={LABEL[id]}
              aria-expanded={panel === id}
              aria-controls="mt-window"
              onClick={(e) => {
                opener.current = e.currentTarget;
                setPanel((p) => (p === id ? null : id));
              }}
            >
              <Icon name={panel === id ? "close" : id} />
            </button>
          ))}
        </div>
      </header>

      <div
        ref={win}
        id="mt-window"
        className="mt-window"
        role="dialog"
        aria-label={panel ? LABEL[panel] : undefined}
        tabIndex={-1}
        data-open={panel ? "1" : "0"}
        inert={!panel}
      >
        {panel === "call" ? (
          <>
            <span className="mt-window-label">Call the workshop</span>
            <a className="mt-window-lead" href={contact.phoneHref}>
              {contact.phone}
            </a>
          </>
        ) : null}

        {panel === "mail" ? (
          <>
            <span className="mt-window-label">Email the workshop</span>
            <a className="mt-window-lead" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
          </>
        ) : null}

        {panel === "place" ? (
          <>
            <span className="mt-window-label">{contact.name}</span>
            <address className="mt-window-address">
              {contact.address.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </address>
            <a className="mt-window-link" href={contact.maps} target="_blank" rel="noopener noreferrer">
              Open in Maps
            </a>
          </>
        ) : null}

        {panel === "menu" ? (
          <>
            <nav aria-label="Sections" className="mt-window-nav">
              {nav.map((n) => (
                <a key={n.href} href={n.href} onClick={(e) => go(e, n.href)}>
                  {n.label}
                </a>
              ))}
            </nav>
            <div className="mt-window-foot">
              <a href={contact.phoneHref}>{contact.phone}</a>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
              <a href={contact.instagram} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
