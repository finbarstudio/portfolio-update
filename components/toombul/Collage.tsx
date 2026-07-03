"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { collageMeta, type CollagePos } from "@/content/toombulCollage";

// The paraphernalia collage. Renders items from a positions array (x/y are %
// of the section for each item's top-left corner; w is vw; rot is degrees).
// Add ?edit=1 to the URL to drag / resize / rotate every item and Save the
// exact coordinates back to content/toombul-collage.json (dev only).

type Drag =
  | { kind: "move"; key: string; px: number; py: number; ox: number; oy: number }
  | { kind: "resize"; key: string; px: number; ow: number }
  | { kind: "rotate"; key: string; cx: number; cy: number; start: number; orot: number };

export default function Collage({ layout }: { layout: CollagePos[] }) {
  const [items, setItems] = useState<CollagePos[]>(layout);
  const [edit, setEdit] = useState(false);
  const [sel, setSel] = useState<string | null>(null);
  const [saved, setSaved] = useState<"idle" | "saving" | "ok" | "err">("idle");
  const sectionRef = useRef<HTMLElement>(null);
  const drag = useRef<Drag | null>(null);

  useEffect(() => {
    setEdit(new URLSearchParams(window.location.search).has("edit"));
  }, []);

  const update = useCallback((key: string, patch: Partial<CollagePos>) => {
    setItems((prev) => prev.map((it) => (it.key === key ? { ...it, ...patch } : it)));
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
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [edit, sel, items, update]);

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
              width: `${it.w}vw`,
              transform: it.rot ? `rotate(${it.rot}deg)` : undefined,
              zIndex: isSel ? 20 : meta.z ?? 1,
            }}
            onPointerDown={(e) => startMove(e, it)}
          >
            <img
              src={meta.src}
              alt={meta.alt}
              className={`tc-para${meta.raw ? " tc-para--raw" : ""}`}
              draggable={false}
              loading="eager"
            />
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

      {edit && (
        <div className="tc-editor" onPointerDown={(e) => e.stopPropagation()}>
          <div className="tc-editor-title">Collage editor</div>
          {selItem ? (
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
          ) : (
            <div className="tc-editor-hint">Click an item. Drag to move, corner = resize, top dot = rotate. Arrow keys nudge (Shift = bigger).</div>
          )}
          <div className="tc-editor-row">
            <button onClick={save}>
              {saved === "saving" ? "Saving…" : saved === "ok" ? "Saved ✓" : saved === "err" ? "Failed" : "Save to file"}
            </button>
            <button onClick={copy}>Copy JSON</button>
            <button onClick={() => setItems(layout)}>Reset</button>
          </div>
        </div>
      )}
    </section>
  );
}
