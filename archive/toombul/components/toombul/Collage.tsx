"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { collageMeta, type CollagePos } from "@/content/toombulCollage";

gsap.registerPlugin(ScrollTrigger);

// The paraphernalia collage. Renders items from a positions array (x/y are %
// of the section for each item's top-left corner; w is vw; rot is degrees).
// Add ?edit=1 to the URL to drag / resize / rotate every item and Save the
// exact coordinates back to content/toombul-collage.json (dev only).

type Drag =
  | { kind: "move"; key: string; px: number; py: number; ox: number; oy: number }
  | { kind: "resize"; key: string; px: number; ow: number }
  | { kind: "rotate"; key: string; cx: number; cy: number; start: number; orot: number };

export default function Collage({
  layout,
  layoutMobile,
}: {
  layout: CollagePos[];
  layoutMobile?: CollagePos[];
}) {
  const [items, setItems] = useState<CollagePos[]>(layout);
  const [edit, setEdit] = useState(false);
  const [sel, setSel] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [saved, setSaved] = useState<"idle" | "saving" | "ok" | "err">("idle");
  const sectionRef = useRef<HTMLElement>(null);
  const drag = useRef<Drag | null>(null);

  useEffect(() => {
    setEdit(new URLSearchParams(window.location.search).has("edit"));
  }, []);

  // Phones get their own portrait arrangement (never while editing —
  // the editor always works on the canonical desktop layout).
  useEffect(() => {
    if (!layoutMobile || edit) return;
    const mq = window.matchMedia("(max-width: 700px)");
    const apply = () => setItems(mq.matches ? layoutMobile : layout);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [layout, layoutMobile, edit]);

  const update = useCallback((key: string, patch: Partial<CollagePos>) => {
    setItems((prev) => prev.map((it) => (it.key === key ? { ...it, ...patch } : it)));
  }, []);

  const remove = useCallback((key: string) => {
    setItems((prev) => prev.filter((it) => it.key !== key));
    setSel((s) => (s === key ? null : s));
  }, []);

  const onPointerMove = useCallback((e: PointerEvent) => {
    const d = drag.current;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!d || !rect) return;
    if (d.kind === "move") {
      const dx = ((e.clientX - d.px) / rect.width) * 100;
      const dy = ((e.clientY - d.py) / rect.height) * 100;
      update(d.key, { x: +(d.ox + dx).toFixed(2), y: +(d.oy + dy).toFixed(2) });
    } else if (d.kind === "resize") {
      const dw = ((e.clientX - d.px) / window.innerWidth) * 100;
      update(d.key, { w: +Math.max(2, d.ow + dw).toFixed(2) });
    } else if (d.kind === "rotate") {
      const ang = (Math.atan2(e.clientY - d.cy, e.clientX - d.cx) * 180) / Math.PI;
      update(d.key, { rot: Math.round(d.orot + (ang - d.start)) });
    }
  }, [update]);

  const endDrag = useCallback(() => { drag.current = null; }, []);

  useEffect(() => {
    if (!edit) return;
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", endDrag);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
    };
  }, [edit, onPointerMove, endDrag]);

  // keyboard nudge for the selected item (fine control)
  useEffect(() => {
    if (!edit || !sel) return;
    const onKey = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;
      const step = e.shiftKey ? 1 : 0.2;
      const it = items.find((i) => i.key === sel);
      if (!it) return;
      if (e.key === "ArrowLeft") { update(sel, { x: +(it.x - step).toFixed(2) }); e.preventDefault(); }
      else if (e.key === "ArrowRight") { update(sel, { x: +(it.x + step).toFixed(2) }); e.preventDefault(); }
      else if (e.key === "ArrowUp") { update(sel, { y: +(it.y - step).toFixed(2) }); e.preventDefault(); }
      else if (e.key === "ArrowDown") { update(sel, { y: +(it.y + step).toFixed(2) }); e.preventDefault(); }
      else if (e.key === "Delete" || e.key === "Backspace") { remove(sel); e.preventDefault(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [edit, sel, items, update, remove]);

  // GSAP: entrance stagger + idle float + cursor parallax. Skipped while
  // editing and for reduced-motion. inner layer = entrance/parallax,
  // float layer = idle drift (kept off the wrap's base rotate).
  useEffect(() => {
    if (edit) return;
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cleanup = () => {};
    const ctx = gsap.context(() => {
      const inners = gsap.utils.toArray<HTMLElement>(section.querySelectorAll(".tc-para-inner"));
      const floats = gsap.utils.toArray<HTMLElement>(section.querySelectorAll(".tc-para-float"));
      const crest = section.querySelector<HTMLElement>(".tc-collage-crest");
      if (!inners.length) return;

      // entrance — items assemble outward from the crest
      const sr = section.getBoundingClientRect();
      const cx = sr.width / 2, cy = sr.height / 2;
      const ordered = inners
        .map((el) => {
          const r = el.getBoundingClientRect();
          const ex = r.left - sr.left + r.width / 2;
          const ey = r.top - sr.top + r.height / 2;
          return { el, dist: Math.hypot(ex - cx, ey - cy) };
        })
        .sort((a, b) => a.dist - b.dist);

      gsap.set(inners, { opacity: 0, scale: 0.7 });
      if (crest) gsap.set(crest, { opacity: 0, scale: 0.5 });
      const tl = gsap.timeline();
      if (crest) tl.to(crest, { opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.7)" }, 0.05);
      ordered.forEach((o, i) => {
        tl.to(o.el, { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" }, 0.15 + i * 0.03);
      });

      // idle float — gentle independent drift
      floats.forEach((el) => {
        gsap.to(el, {
          y: gsap.utils.random(-8, 8),
          rotation: gsap.utils.random(-2.2, 2.2),
          duration: gsap.utils.random(3.5, 6.5),
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: gsap.utils.random(0, 2.5),
        });
      });

      // cursor parallax — depth scaled by item width (bigger = nearer) — and a
      // subtle gradient-map shift near the pointer (small hue swing, the
      // red->yellow ramp warms/cools as the cursor passes over items).
      const xs = inners.map((el) => gsap.quickTo(el, "x", { duration: 0.7, ease: "power2" }));
      const ys = inners.map((el) => gsap.quickTo(el, "y", { duration: 0.7, ease: "power2" }));
      const depth = inners.map((el) => parseFloat(el.dataset.w || "10") * 0.9);
      const onMove = (e: PointerEvent) => {
        const r = section.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        inners.forEach((el, i) => {
          xs[i](-nx * depth[i]);
          ys[i](-ny * depth[i]);
          const ir = el.getBoundingClientRect();
          const d = Math.hypot(e.clientX - (ir.left + ir.width / 2), e.clientY - (ir.top + ir.height / 2));
          const f = Math.max(0, 1 - d / 380); // 0..1 proximity
          el.style.filter = f > 0.01
            ? `hue-rotate(${(-14 * f).toFixed(1)}deg) saturate(${(1 + 0.18 * f).toFixed(3)})`
            : "";
        });
      };
      section.addEventListener("pointermove", onMove);

      // scroll scatter — leaving section one, the collage blows outward from
      // the crest and fades, scrubbed to scroll.
      const scatters = gsap.utils.toArray<HTMLElement>(section.querySelectorAll(".tc-para-scatter"));
      scatters.forEach((el) => {
        const r = el.getBoundingClientRect();
        const ex = r.left - sr.left + r.width / 2 - cx;
        const ey = r.top - sr.top + r.height / 2 - cy;
        const len = Math.max(60, Math.hypot(ex, ey));
        const ux = ex / len, uy = ey / len;
        const push = 260 + len * 0.9;
        gsap.to(el, {
          x: ux * push,
          y: uy * push,
          opacity: 0,
          ease: "power2.in",
          scrollTrigger: { trigger: section, start: "top top", end: "88% top", scrub: true },
        });
      });
      if (crest) {
        // fromTo + immediateRender:false so this scrub tween doesn't record
        // the entrance animation's mid-flight values as its start state.
        gsap.fromTo(
          crest,
          { scale: 1, opacity: 1 },
          {
            scale: 0.6,
            opacity: 0,
            ease: "power2.in",
            immediateRender: false,
            scrollTrigger: { trigger: section, start: "top top", end: "70% top", scrub: true },
          }
        );
      }

      cleanup = () => section.removeEventListener("pointermove", onMove);
    }, section);

    return () => { cleanup(); ctx.revert(); };
  }, [edit, items.length]);

  // Bitmap "boil": cycle each item's 3 dither frames (x.png / x.b1.png /
  // x.b2.png) at a desynced ~8fps so the grain shimmers. Motion-only.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const imgs = Array.from(section.querySelectorAll<HTMLImageElement>("img.tc-para"));
    if (!imgs.length) return;
    const states = imgs.map((img) => {
      const base = img.getAttribute("src") || "";
      const frames = [base, base.replace(/\.png$/, ".b1.png"), base.replace(/\.png$/, ".b2.png")];
      frames.slice(1).forEach((f) => { const im = new Image(); im.src = f; }); // preload
      return { img, frames, i: 0, period: 90 + Math.random() * 70, acc: Math.random() * 160 };
    });
    let raf = 0;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = t - last; last = t;
      for (const s of states) {
        s.acc += dt;
        if (s.acc >= s.period) {
          s.acc = 0;
          s.i = (s.i + 1) % 3;
          s.img.src = s.frames[s.i];
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [items.length]);

  // Failsafe: if the entrance animation can't run for any reason, never leave
  // the pre-hidden collage blank — force everything visible after a moment.
  useEffect(() => {
    if (edit) return;
    const t = setTimeout(() => {
      sectionRef.current
        ?.querySelectorAll<HTMLElement>(".tc-para-inner, .tc-collage-crest")
        .forEach((el) => {
          if (getComputedStyle(el).opacity === "0") gsap.set(el, { opacity: 1, scale: 1 });
        });
    }, 2600);
    return () => clearTimeout(t);
  }, [edit]);

  const startMove = (e: React.PointerEvent, it: CollagePos) => {
    if (!edit) return;
    e.preventDefault();
    setSel(it.key);
    drag.current = { kind: "move", key: it.key, px: e.clientX, py: e.clientY, ox: it.x, oy: it.y };
  };
  const startResize = (e: React.PointerEvent, it: CollagePos) => {
    e.preventDefault(); e.stopPropagation();
    setSel(it.key);
    drag.current = { kind: "resize", key: it.key, px: e.clientX, ow: it.w };
  };
  const startRotate = (e: React.PointerEvent, it: CollagePos, el: HTMLElement) => {
    e.preventDefault(); e.stopPropagation();
    setSel(it.key);
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const start = (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI;
    drag.current = { kind: "rotate", key: it.key, cx, cy, start, orot: it.rot };
  };

  const save = async () => {
    setSaved("saving");
    try {
      const res = await fetch("/api/toombul-collage", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(items, null, 2),
      });
      setSaved(res.ok ? "ok" : "err");
    } catch { setSaved("err"); }
    setTimeout(() => setSaved("idle"), 2000);
  };

  const copy = () => navigator.clipboard.writeText(JSON.stringify(items, null, 2));

  const selItem = items.find((i) => i.key === sel);

  return (
    <section ref={sectionRef} id="one" className={`tc-collage${edit ? " tc-collage--edit" : ""}`}>
      {items.map((it) => {
        const meta = collageMeta[it.key];
        if (!meta) return null;
        const isSel = edit && sel === it.key;
        return (
          <div
            key={it.key}
            className={`tc-para-wrap${isSel ? " is-sel" : ""}`}
            style={{
              left: `${it.x}%`,
              top: `${it.y}%`,
              width: `calc(${it.w}vw * var(--para-scale, 1))`,
              transform: it.rot ? `rotate(${it.rot}deg)` : undefined,
              // Bradman always rides on top of the pile.
              zIndex: isSel ? 20 : it.key === "bradman" ? 10 : 1,
            }}
            onPointerDown={(e) => startMove(e, it)}
          >
            {/* animation layers: inner = entrance + cursor parallax/hue,
                scatter = scroll scatter, float = idle drift; keeps GSAP off
                the wrap's base rotate */}
            <div className="tc-para-inner" data-w={it.w}>
              <div className="tc-para-scatter">
                <div className="tc-para-float">
                  <img
                    src={meta.src}
                    alt={meta.alt}
                    className="tc-para"
                    draggable={false}
                    loading="eager"
                  />
                </div>
              </div>
            </div>
            {isSel && (
              <>
                <span
                  className="tc-h tc-h-resize"
                  onPointerDown={(e) => startResize(e, it)}
                />
                <span
                  className="tc-h tc-h-rotate"
                  onPointerDown={(e) => startRotate(e, it, e.currentTarget.parentElement as HTMLElement)}
                />
              </>
            )}
          </div>
        );
      })}

      {/* Crest: locked, centred, not editable. */}
      <img
        src="/toombul/logo.svg"
        alt="Toombul District Cricket Club crest"
        className="tc-collage-crest"
        draggable={false}
      />

      {edit && collapsed && (
        <button className="tc-editor-chip" onClick={() => setCollapsed(false)}>
          ▸ Editor
        </button>
      )}

      {edit && !collapsed && (
        <div className="tc-editor" onPointerDown={(e) => e.stopPropagation()}>
          <div className="tc-editor-head">
            <span className="tc-editor-title">Collage editor</span>
            <button className="tc-editor-hide" onClick={() => setCollapsed(true)} title="Hide panel">
              Hide ▾
            </button>
          </div>
          {selItem ? (
            <>
              <div className="tc-editor-fields">
                <strong>{selItem.key}</strong>
                {(["x", "y", "w", "rot"] as const).map((f) => (
                  <label key={f}>
                    {f}
                    <input
                      type="number"
                      step={f === "rot" ? 1 : 0.1}
                      value={selItem[f]}
                      onChange={(e) => update(selItem.key, { [f]: +e.target.value })}
                    />
                  </label>
                ))}
              </div>
              <button className="tc-editor-del" onClick={() => remove(selItem.key)}>
                Delete “{selItem.key}” (or press ⌫)
              </button>
            </>
          ) : (
            <div className="tc-editor-hint">Click an item. Drag to move, corner = resize, top dot = rotate. Arrow keys nudge (Shift = bigger), ⌫ deletes.</div>
          )}
          <div className="tc-editor-row">
            <button onClick={save}>
              {saved === "saving" ? "Saving…" : saved === "ok" ? "Saved ✓" : saved === "err" ? "Failed" : "Save to file"}
            </button>
            <button onClick={copy}>Copy JSON</button>
            <button onClick={() => { setItems(layout); setSel(null); }}>Reset</button>
          </div>
        </div>
      )}
    </section>
  );
}
