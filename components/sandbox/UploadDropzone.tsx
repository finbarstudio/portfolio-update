"use client";

/**
 * UploadDropzone — drag/drop or pick image/video files (or paste a public image
 * URL for embeds), then manage them as a reorderable thumbnail list. Reordering
 * works by pointer (mouse + touch) via drag, with ‹ › nudge buttons as an
 * accessible fallback. Validation/ingest is the parent's job.
 */

import { useRef, useState } from "react";
import { ACCEPT_ATTR, MAX_PHONES, type MediaAsset } from "@/lib/sandbox/media";
import { isGeneratedSrc, parseCardNumber } from "@/lib/sandbox/demo-cards";

export default function UploadDropzone({
  assets,
  onAddFiles,
  onAddUrl,
  onRemove,
  onMove,
  onReorder,
  messages,
  maxItems = MAX_PHONES,
  hint,
  landscapeThumbs = false,
}: {
  assets: MediaAsset[];
  onAddFiles: (files: File[]) => void;
  onAddUrl?: (url: string) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, dir: -1 | 1) => void;
  onReorder?: (id: string, toIndex: number) => void;
  messages: { errors: string[]; warnings: string[] };
  maxItems?: number;
  hint?: string;
  landscapeThumbs?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [url, setUrl] = useState("");
  const [dragId, setDragId] = useState<string | null>(null);

  // Placeholder demo cards don't count toward the limit — the first real upload
  // replaces them — so only count the user's own media.
  const realCount = assets.filter((a) => !a.isDemo).length;
  const allDemos = assets.length > 0 && realCount === 0;
  const full = realCount >= maxItems;
  const canReorder = !!onReorder && assets.length > 1;

  const handleFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    onAddFiles(Array.from(list));
  };

  const submitUrl = () => {
    const v = url.trim();
    if (!v) return;
    onAddUrl?.(v);
    setUrl("");
  };

  // Pointer-based reorder (mouse + touch). To stay smooth we DON'T reorder the
  // array or measure layout on every move — the grabbed tile just follows the
  // finger via a cheap start-delta transform, the drop target is highlighted
  // imperatively (no re-render), and the reorder is committed once on drop.
  const drag = useRef<{
    id: string;
    startX: number;
    startY: number;
    el: HTMLElement;
    target: HTMLElement | null;
  } | null>(null);

  const onTilePointerDown = (e: React.PointerEvent, id: string) => {
    if (!canReorder || e.button > 0) return;
    const el = e.currentTarget as HTMLElement;
    drag.current = { id, startX: e.clientX, startY: e.clientY, el, target: null };
    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    setDragId(id);
  };

  const onTilePointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    // Follow the finger (no layout reads — offset from where the drag started).
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    d.el.style.transform = `translate(${dx}px, ${dy}px) scale(1.08)`;
    // Highlight the tile under the pointer as the drop target (imperative).
    const over = (document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null)?.closest(
      "[data-thumb-id]",
    ) as HTMLElement | null;
    const next = over && over.getAttribute("data-thumb-id") !== d.id ? over : null;
    if (next !== d.target) {
      d.target?.classList.remove("is-drop-target");
      next?.classList.add("is-drop-target");
      d.target = next;
    }
  };

  const endDrag = () => {
    const d = drag.current;
    if (!d) return;
    d.el.style.transform = "";
    d.target?.classList.remove("is-drop-target");
    const overId = d.target?.getAttribute("data-thumb-id");
    if (overId) {
      const toIndex = assets.findIndex((a) => a.id === overId);
      if (toIndex >= 0) onReorder?.(d.id, toIndex);
    }
    drag.current = null;
    setDragId(null);
  };

  return (
    <div className="sb-panel">
      <div className="sb-panel-head">
        <h3 className="sb-panel-title mono-heading">Media</h3>
        <span className="mono-label sb-count">
          {allDemos ? `${assets.length} demo` : `${realCount}/${maxItems}`}
        </span>
      </div>

      <div
        className={`sb-dropzone ${dragOver ? "is-over" : ""} ${full ? "is-full" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          if (!full) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (!full) handleFiles(e.dataTransfer.files);
        }}
        onClick={() => !full && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Add media files"
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !full) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_ATTR}
          multiple
          hidden
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <span className="sb-dropzone-text">
          {full
            ? `Limit reached (${maxItems})`
            : allDemos
              ? "Drop images or videos to replace the demo"
              : "Drop images or videos, or click to browse"}
        </span>
        <span className="mono-label sb-dropzone-hint">{hint ?? "PNG · JPG · WebP · MP4 · WebM"}</span>
      </div>

      {onAddUrl && (
        <div className="sb-url-row">
          <input
            type="url"
            inputMode="url"
            className="sb-url-input"
            placeholder="…or paste a public image URL (for embeds)"
            value={url}
            disabled={full}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submitUrl();
              }
            }}
            aria-label="Image URL"
          />
          <button
            type="button"
            className="sb-btn sb-url-add"
            onClick={submitUrl}
            disabled={full || !url.trim()}
          >
            Add
          </button>
        </div>
      )}

      {(messages.errors.length > 0 || messages.warnings.length > 0) && (
        <ul className="sb-messages" role="status" aria-live="polite">
          {messages.errors.map((m, i) => (
            <li key={`e${i}`} className="sb-msg is-error">
              {m}
            </li>
          ))}
          {messages.warnings.map((m, i) => (
            <li key={`w${i}`} className="sb-msg is-warn">
              {m}
            </li>
          ))}
        </ul>
      )}

      {assets.length > 0 && (
        <ul className="sb-thumbs" aria-label="Selected media">
          {assets.map((a, i) => (
            <li
              key={a.id}
              className={`sb-thumb ${dragId === a.id ? "is-dragging" : ""}`}
              data-thumb-id={a.id}
            >
              <div
                className={`sb-thumb-media ${landscapeThumbs ? "is-landscape" : ""} ${canReorder ? "is-grab" : ""}`}
                onPointerDown={(e) => onTilePointerDown(e, a.id)}
                onPointerMove={onTilePointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                title={canReorder ? "Drag to reorder" : undefined}
              >
                {isGeneratedSrc(a.src) ? (
                  // Procedural placeholder — no real URL, so draw a mini card.
                  <span className="sb-thumb-gen" aria-label={a.name}>
                    {parseCardNumber(a.src)}
                  </span>
                ) : a.kind === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.src} alt={a.name} loading="lazy" draggable={false} />
                ) : (
                  // A static placeholder, not a live <video> — keeps the browser's
                  // limited video decoders free for the carousel + export.
                  <span className="sb-thumb-video" aria-label={`Video: ${a.name}`}>
                    <span className="sb-thumb-play" aria-hidden="true">▶</span>
                  </span>
                )}
                {a.isDemo && <span className="sb-thumb-badge">demo</span>}
              </div>
              <div className="sb-thumb-controls">
                <button
                  type="button"
                  className="sb-thumb-btn"
                  aria-label={`Move ${a.name} earlier`}
                  disabled={i === 0}
                  onClick={() => onMove(a.id, -1)}
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="sb-thumb-btn"
                  aria-label={`Move ${a.name} later`}
                  disabled={i === assets.length - 1}
                  onClick={() => onMove(a.id, 1)}
                >
                  ›
                </button>
                <button
                  type="button"
                  className="sb-thumb-btn is-remove"
                  aria-label={`Remove ${a.name}`}
                  onClick={() => onRemove(a.id)}
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
