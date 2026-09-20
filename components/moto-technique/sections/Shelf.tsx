"use client";

import { useEffect, useRef, useState } from "react";

type Project = {
  id: string;
  name: string;
  line: string;
  image: string;
  href: string;
  focus?: string;
};

/**
 * The shelf: the projects stood side by side like books, one of them open.
 *
 * Every project is a full-height slice of its own photograph with its name
 * running down it like a spine. Point at one and it opens to most of the
 * screen while the rest close up to make room; the first is open when the
 * section arrives, and the last one you opened stays open when you leave, so
 * the shelf never snaps back under you. Click the open one and its page opens.
 *
 * HOW IT OPENS. The slices are flex items and the open one simply asks for
 * more of the row (the stylesheet sets how much). The photograph inside each
 * slice is fixed at the open width and centred, so it is never squeezed or
 * stretched as its slice grows: opening a book reveals more of the same
 * picture, it does not rescale it.
 *
 * DEPTH, LIKE THE HERO. The shelf pins at the top while the next section rises
 * over it, and its photographs drift: down a little as the shelf arrives, up a
 * little as it is covered. This file reports where the shelf is as --mt-par,
 * from -1 (just entering from below) through 0 (pinned, filling the screen) to
 * 1 (fully covered); the stylesheet turns that into movement. It is measured
 * off a marker placed just before the shelf, because a pinned element reports
 * its pinned position, not where it sits in the page.
 *
 * THE TYPE RIDES THE EDGE. As the next section comes up over the pinned shelf
 * it would cover the names first, since they sit low. Instead each name (spine
 * or open face alike) moves up with that rising edge from its very first pixel,
 * keeping exactly the gap above it that it had above the bottom of the screen,
 * so the edge never closes in on the type and there is no moment where one is
 * moving and the other is not. It stops when it reaches the top of its own
 * picture, and only then is it covered. Worked out here per element, as
 * --mt-ride in pixels: simply how far the edge has come, capped by the room
 * above the type. All the reading of sizes
 * happens before any writing, so it costs one layout per frame. On a phone the
 * shelf is rows, each name is already in the middle of its own row, and this
 * is skipped.
 *
 * WHO GETS WHAT. Each slice is one real link. Focusing it opens it, so a
 * keyboard walks the shelf with Tab and follows with Enter. A touch screen has
 * no hover, so the first tap opens a slice and the second follows the link. On
 * a phone the shelf turns on its side: rows instead of columns, names level.
 */
export default function Shelf({
  projects,
}: {
  projects: { title: string; items: Project[] };
}) {
  const [open, setOpen] = useState(projects.items[0]?.id ?? "");
  const mark = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const at = mark.current;
    const el = root.current;
    if (!at || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /** Room kept under the bar at the top, where the type stops rising. */
    const CEILING = 96;

    let frame = 0;
    const update = () => {
      frame = 0;
      const par = Math.min(1, Math.max(-1, -at.getBoundingClientRect().top / window.innerHeight));
      el.style.setProperty("--mt-par", par.toFixed(4));

      const type = el.querySelectorAll<HTMLElement>(".mt-book-spine, .mt-book-face");
      if (window.innerWidth <= 760) {
        for (const t of type) t.style.removeProperty("--mt-ride");
        return;
      }
      // how far up the shelf the covering section's top edge has come
      const h = el.offsetHeight;
      const covered = Math.max(0, par) * h;
      // read everything, then write everything
      const rides = [...type].map((t) => Math.min(Math.max(0, t.offsetTop - CEILING), covered));
      type.forEach((t, i) => t.style.setProperty("--mt-ride", `${rides[i].toFixed(1)}px`));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div ref={mark} className="mt-shelf-mark" aria-hidden="true" />
      <section
        ref={root}
        className="mt-shelf"
        id="projects"
        data-tone="dark"
        aria-label={projects.title}
      >
        <h2 className="mt-sr">{projects.title}</h2>

        <div
          className="mt-shelf-row"
          style={{ ["--mt-count" as string]: projects.items.length }}
        >
          {projects.items.map((p) => {
            const isOpen = open === p.id;
            return (
              <a
                key={p.id}
                href={p.href}
                className="mt-book"
                data-open={isOpen ? "1" : "0"}
                data-cursor={isOpen ? "Open" : undefined}
                aria-label={p.line ? `${p.name}. ${p.line}` : p.name}
                onPointerEnter={(e) => {
                  if (e.pointerType !== "touch") setOpen(p.id);
                }}
                onFocus={() => setOpen(p.id)}
                onClick={(e) => {
                  // closed: a tap or click opens it. Only the open one is a link.
                  if (!isOpen) {
                    e.preventDefault();
                    setOpen(p.id);
                  }
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt=""
                  className="mt-book-img"
                  style={p.focus ? { objectPosition: p.focus } : undefined}
                  loading="lazy"
                  decoding="async"
                />
                <span className="mt-book-shade" aria-hidden="true" />

                <span className="mt-book-spine" aria-hidden="true">
                  <span className="mt-book-name">{p.name}</span>
                </span>

                <span className="mt-book-face" aria-hidden="true">
                  <span className="mt-book-title">{p.name}</span>
                  {p.line ? (
                    <span className="mt-book-line">{p.line}</span>
                  ) : null}
                  <span className="mt-book-go">View the project</span>
                </span>
              </a>
            );
          })}
        </div>
      </section>
    </>
  );
}
