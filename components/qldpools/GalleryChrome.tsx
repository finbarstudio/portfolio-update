"use client";

import { useEffect, useState } from "react";

/**
 * Picking chrome shared by the QPI option galleries (heroes + sections): a
 * fixed counter tracking which option is on screen, and a tap-to-jump number
 * grid. Arrow keys / j·k step through. Operates purely on the DOM (frames carry
 * `selector` + data-index) so the option nodes stay server-rendered.
 */
export default function GalleryChrome({
  total,
  selector = ".qpi-hero-frame",
}: {
  total: number;
  selector?: string;
}) {
  const [current, setCurrent] = useState(1);
  const [open, setOpen] = useState(false);

  const jump = (i: number) => {
    const el = document.querySelectorAll<HTMLElement>(selector)[i];
    if (!el) return;
    const w = window as unknown as { __lenis?: { scrollTo: (t: HTMLElement) => void } };
    if (w.__lenis) w.__lenis.scrollTo(el);
    else el.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  useEffect(() => {
    const frames = Array.from(document.querySelectorAll<HTMLElement>(selector));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = Number((e.target as HTMLElement).dataset.index);
            if (!Number.isNaN(i)) setCurrent(i + 1);
          }
        });
      },
      { threshold: 0.35 },
    );
    frames.forEach((f) => io.observe(f));
    return () => io.disconnect();
  }, [selector]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault();
        jump(Math.min(total - 1, current));
      }
      if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault();
        jump(Math.max(0, current - 2));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, total]);

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-4 right-4 z-[120] rounded-full bg-black/75 text-white px-4 py-2 text-xs tabular-nums backdrop-blur"
        aria-label="Toggle option index"
      >
        {String(current).padStart(3, "0")} / {total}
      </button>
      {open && (
        <div
          className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setOpen(false)}
        >
          <div className="max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <p className="text-white/70 text-xs mb-3 text-center">
              Tap a number to jump · arrow keys to step
            </p>
            <div className="grid grid-cols-10 gap-2">
              {Array.from({ length: total }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => jump(i)}
                  className={`aspect-square rounded text-[11px] tabular-nums transition-colors ${
                    current === i + 1
                      ? "bg-white text-black"
                      : "bg-white/15 text-white hover:bg-white/30"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
