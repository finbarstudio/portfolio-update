"use client";

import { useState } from "react";

type Project = { id: string; name: string; line: string; image: string; href: string };

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
 * WHO GETS WHAT. Each slice is one real link. Focusing it opens it, so a
 * keyboard walks the shelf with Tab and follows with Enter. A touch screen has
 * no hover, so the first tap opens a slice and the second follows the link. On
 * a phone the shelf turns on its side: rows instead of columns, names level.
 */
export default function Shelf({ projects }: { projects: { title: string; items: Project[] } }) {
  const [open, setOpen] = useState(projects.items[0]?.id ?? "");

  return (
    <section className="mt-shelf" id="projects" data-tone="dark" aria-label={projects.title}>
      <h2 className="mt-sr">{projects.title}</h2>

      <div className="mt-shelf-row" style={{ ["--mt-count" as string]: projects.items.length }}>
        {projects.items.map((p, i) => {
          const isOpen = open === p.id;
          return (
            <a
              key={p.id}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
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
              <img src={p.image} alt="" className="mt-book-img" loading="lazy" decoding="async" />
              <span className="mt-book-shade" aria-hidden="true" />

              <span className="mt-book-spine" aria-hidden="true">
                <span className="mt-book-no">{String(i + 1).padStart(2, "0")}</span>
                <span className="mt-book-name">{p.name}</span>
              </span>

              <span className="mt-book-face" aria-hidden="true">
                <span className="mt-book-no">{String(i + 1).padStart(2, "0")}</span>
                <span className="mt-book-title">{p.name}</span>
                {p.line ? <span className="mt-book-line">{p.line}</span> : null}
                <span className="mt-book-go">View the project</span>
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
