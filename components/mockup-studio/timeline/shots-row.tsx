"use client";

import type { KeyboardEvent, PointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { locateShot } from "@/lib/mockup-studio/scene/animation";
import { useStudio } from "@/lib/mockup-studio/scene/store";
import type { Shot } from "@/lib/mockup-studio/scene/types";
import { formatSeconds, percent, pointerToMs, snapToFrame } from "./geometry";
import { MoreIcon, PlusIcon } from "./icons";
import { Row } from "./row";
import { useShotSelection } from "./selection";
import { ShotMenu, type ShotMenuAnchor } from "./shot-menu";

interface ShotsRowProps {
  span: number;
  laneWidth: number;
  /** Pin the visible span while a resize drag changes the total, so the edge follows the pointer. */
  onFreezeSpan(span: number | null): void;
}

/** An in-flight body drag. `leftMs` is where the dragged block's left edge currently sits. */
interface Drag {
  id: string;
  leftMs: number;
}

interface Press {
  id: string;
  startX: number;
  grabMs: number;
  moved: boolean;
  /** Cmd or Ctrl was down: the click adds to or removes from the highlighted shots. */
  toggle: boolean;
  /** Shift was down: the click highlights everything from the anchor to here. */
  extend: boolean;
}

/** Highlight a shot: on its own, added to the others (cmd/ctrl), or as a run from the anchor (shift). */
function highlight(
  shots: Shot[],
  id: string,
  toggle: boolean,
  extend: boolean,
) {
  const { ids, anchor, select } = useShotSelection.getState();
  if (extend) {
    const from = shots.findIndex((shot) => shot.id === (anchor ?? id));
    const to = shots.findIndex((shot) => shot.id === id);
    const [a, b] = from <= to ? [from, to] : [to, from];
    select(shots.slice(a, b + 1).map((shot) => shot.id));
    return;
  }
  if (toggle) {
    const next = ids.includes(id)
      ? ids.filter((each) => each !== id)
      : [...ids, id];
    select(
      shots.filter((shot) => next.includes(shot.id)).map((shot) => shot.id),
      id,
    );
    return;
  }
  select([id], id);
}

interface Resize {
  id: string;
  startX: number;
  startDuration: number;
  startMs: number;
  span: number;
  laneWidth: number;
}

const DRAG_THRESHOLD_PX = 4;
const RESIZE_SNAP_MS = 10;
const KEY_RESIZE_MS = 100;

export function ShotsRow({ span, laneWidth, onFreezeSpan }: ShotsRowProps) {
  const shots = useStudio((s) => s.shots);
  const activeId = useStudio((s) => locateShot(s.shots, s.playhead).shot.id);
  const selectedIds = useShotSelection((s) => s.ids);
  const laneRef = useRef<HTMLDivElement>(null);
  const pressRef = useRef<Press | null>(null);
  const resizeRef = useRef<Resize | null>(null);
  const renameRef = useRef<HTMLInputElement>(null);
  const cancelRenameRef = useRef(false);

  const [drag, setDrag] = useState<Drag | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [menu, setMenu] = useState<{
    shotId: string;
    anchor: ShotMenuAnchor;
  } | null>(null);

  useEffect(() => {
    if (renamingId) {
      renameRef.current?.focus();
      renameRef.current?.select();
    }
  }, [renamingId]);

  const starts: number[] = [];
  let total = 0;
  for (const shot of shots) {
    starts.push(total);
    total += shot.duration;
  }

  // Body drag: reorder -------------------------------------------------------

  const onBodyDown = (
    event: PointerEvent<HTMLButtonElement>,
    shot: Shot,
    start: number,
  ) => {
    const lane = laneRef.current;
    if (event.button !== 0 || !lane) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pressRef.current = {
      id: shot.id,
      startX: event.clientX,
      grabMs: pointerToMs(event.clientX, lane, span) - start,
      moved: false,
      toggle: event.metaKey || event.ctrlKey,
      extend: event.shiftKey,
    };
  };

  const onBodyMove = (event: PointerEvent<HTMLButtonElement>) => {
    const press = pressRef.current;
    const lane = laneRef.current;
    if (!press || !lane) return;
    if (
      !press.moved &&
      Math.abs(event.clientX - press.startX) < DRAG_THRESHOLD_PX
    )
      return;
    press.moved = true;

    const { shots: current, moveShot } = useStudio.getState();
    const dragged = current.find((shot) => shot.id === press.id);
    if (!dragged) return;
    const leftMs = pointerToMs(event.clientX, lane, span) - press.grabMs;
    // The block lands where its centre falls among the other blocks.
    const centre = leftMs + dragged.duration / 2;
    let index = 0;
    let cursor = 0;
    for (const other of current) {
      if (other.id === press.id) continue;
      if (cursor + other.duration / 2 < centre) index++;
      cursor += other.duration;
    }
    if (current.findIndex((shot) => shot.id === press.id) !== index)
      moveShot(press.id, index);
    setDrag({ id: press.id, leftMs });
  };

  const endBodyPress = (
    event: PointerEvent<HTMLButtonElement>,
    commit: boolean,
  ) => {
    const press = pressRef.current;
    const lane = laneRef.current;
    pressRef.current = null;
    setDrag(null);
    if (commit && press && !press.moved && lane) {
      const { setPlaying, setPlayhead, shots: current } = useStudio.getState();
      highlight(current, press.id, press.toggle, press.extend);
      if (press.toggle || press.extend) return;
      setPlaying(false);
      setPlayhead(snapToFrame(pointerToMs(event.clientX, lane, span)));
    }
  };

  const onBodyKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    shot: Shot,
    index: number,
  ) => {
    if (
      !event.altKey ||
      (event.key !== "ArrowLeft" && event.key !== "ArrowRight")
    )
      return;
    event.preventDefault();
    useStudio
      .getState()
      .moveShot(shot.id, index + (event.key === "ArrowLeft" ? -1 : 1));
  };

  // Edge drag: duration -------------------------------------------------------

  const onEdgeDown = (
    event: PointerEvent<HTMLButtonElement>,
    shot: Shot,
    start: number,
  ) => {
    const lane = laneRef.current;
    if (event.button !== 0 || !lane) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    resizeRef.current = {
      id: shot.id,
      startX: event.clientX,
      startDuration: shot.duration,
      startMs: start,
      span,
      laneWidth: lane.getBoundingClientRect().width,
    };
    onFreezeSpan(span);
  };

  const onEdgeMove = (event: PointerEvent<HTMLButtonElement>) => {
    const resize = resizeRef.current;
    if (!resize || resize.laneWidth === 0) return;
    const delta =
      ((event.clientX - resize.startX) / resize.laneWidth) * resize.span;
    const wanted =
      Math.round((resize.startDuration + delta) / RESIZE_SNAP_MS) *
      RESIZE_SNAP_MS;
    // The frozen lane ends at `span`; stop at its right edge rather than overflowing it.
    useStudio
      .getState()
      .setShotDuration(
        resize.id,
        Math.min(wanted, resize.span - resize.startMs),
      );
  };

  const endEdge = () => {
    if (!resizeRef.current) return;
    resizeRef.current = null;
    onFreezeSpan(null);
  };

  const onEdgeKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    shot: Shot,
  ) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const amount =
      (event.shiftKey ? 10 : 1) *
      KEY_RESIZE_MS *
      (event.key === "ArrowLeft" ? -1 : 1);
    useStudio.getState().setShotDuration(shot.id, shot.duration + amount);
  };

  // Rename --------------------------------------------------------------------

  const finishRename = (shot: Shot, value: string) => {
    setRenamingId(null);
    const name = value.trim();
    if (!cancelRenameRef.current && name && name !== shot.name)
      useStudio.getState().renameShot(shot.id, name);
    cancelRenameRef.current = false;
  };

  const menuShot = menu
    ? shots.find((shot) => shot.id === menu.shotId)
    : undefined;

  return (
    <Row className="h-9" label="Shots" laneRef={laneRef}>
      {shots.map((shot, index) => {
        const start = starts[index];
        const widthPx = (laneWidth * shot.duration) / span;
        const isActive = shot.id === activeId;
        const isSelected = selectedIds.includes(shot.id);
        const dragLeft = drag && drag.id === shot.id ? drag.leftMs : null;
        const isDragged = dragLeft !== null;
        // translateX % is of the block's own width, so no lane measurement is needed.
        const shiftPercent =
          dragLeft !== null ? ((dragLeft - start) / shot.duration) * 100 : 0;

        return (
          <div
            className={`absolute inset-y-1 ${isDragged ? "z-10" : ""}`}
            key={shot.id}
            style={{
              left: percent(start, span),
              width: percent(shot.duration, span),
              transform: isDragged ? `translateX(${shiftPercent}%)` : undefined,
            }}
          >
            <div
              className={`relative flex size-full items-center overflow-hidden rounded-ms-control border ${
                isActive ? "border-ms-ink bg-ms-hover" : "border-ms-line bg-ms-raised"
              } ${isSelected ? "ring-2 ring-ms-ink ring-inset" : ""} ${isDragged ? "opacity-90" : ""}`}
            >
              {renamingId === shot.id ? (
                <input
                  aria-label={`Rename ${shot.name}`}
                  className="mx-1 h-6 min-w-0 flex-1 select-text rounded-ms-control bg-ms-canvas px-1.5 text-ms-ink"
                  defaultValue={shot.name}
                  onBlur={(event) =>
                    finishRename(shot, event.currentTarget.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") event.currentTarget.blur();
                    if (event.key === "Escape") {
                      cancelRenameRef.current = true;
                      event.currentTarget.blur();
                    }
                  }}
                  ref={renameRef}
                  spellCheck={false}
                  type="text"
                />
              ) : (
                <button
                  aria-current={isActive}
                  className="flex h-full min-w-0 flex-1 cursor-grab touch-none items-center gap-2 px-2 text-left select-none active:cursor-grabbing"
                  onClick={(event) => {
                    // Mouse clicks seek in pointer-up; this is Enter on a focused block.
                    if (event.detail === 0) {
                      const { setPlaying, setPlayhead } = useStudio.getState();
                      setPlaying(false);
                      setPlayhead(start);
                    }
                  }}
                  onContextMenu={(event) => {
                    event.preventDefault();
                    setMenu({
                      shotId: shot.id,
                      anchor: {
                        x: event.clientX,
                        top: event.clientY,
                        bottom: event.clientY,
                      },
                    });
                  }}
                  onDoubleClick={() => setRenamingId(shot.id)}
                  onKeyDown={(event) => onBodyKeyDown(event, shot, index)}
                  onPointerCancel={(event) => endBodyPress(event, false)}
                  onPointerDown={(event) => onBodyDown(event, shot, start)}
                  onPointerMove={onBodyMove}
                  onPointerUp={(event) => endBodyPress(event, true)}
                  aria-selected={isSelected}
                  title={`${shot.name}: drag to reorder, double-click the name to rename, Alt+arrows to move. Cmd-click or Shift-click to highlight several, then a preset replaces them all.`}
                  type="button"
                >
                  <span className="min-w-0 truncate text-ms-ink">{shot.name}</span>
                  {widthPx >= 72 ? (
                    <span className="ml-auto text-ms-ink-faint tabular-nums">
                      {formatSeconds(shot.duration)}
                    </span>
                  ) : null}
                </button>
              )}
              {widthPx >= 96 ? (
                <button
                  aria-haspopup="menu"
                  aria-label={`${shot.name} options`}
                  className="grid size-6 shrink-0 place-items-center rounded-ms-control text-ms-ink-muted hover:bg-ms-hover hover:text-ms-ink"
                  onClick={(event) => {
                    const rect = event.currentTarget.getBoundingClientRect();
                    setMenu({
                      shotId: shot.id,
                      anchor: {
                        x: rect.left,
                        top: rect.top,
                        bottom: rect.bottom,
                      },
                    });
                  }}
                  title="Shot options"
                  type="button"
                >
                  <MoreIcon />
                </button>
              ) : null}
              <button
                aria-label={`Resize ${shot.name}`}
                className="h-full w-2 shrink-0 cursor-col-resize touch-none bg-transparent hover:bg-ms-ink/30 focus-visible:bg-ms-ink/30"
                onKeyDown={(event) => onEdgeKeyDown(event, shot)}
                onPointerCancel={endEdge}
                onPointerDown={(event) => onEdgeDown(event, shot, start)}
                onPointerMove={onEdgeMove}
                onPointerUp={endEdge}
                title="Drag to change the length (arrow keys: 0.1s, Shift: 1s)"
                type="button"
              />
            </div>
          </div>
        );
      })}
      <button
        aria-label="Add shot"
        className="absolute top-1 grid size-7 place-items-center rounded-ms-control border border-dashed border-ms-line text-ms-ink-muted hover:bg-ms-hover hover:text-ms-ink"
        onClick={() => useStudio.getState().addShot()}
        style={{ left: `calc(${percent(total, span)} + 6px)` }}
        title="Add shot"
        type="button"
      >
        <PlusIcon />
      </button>
      {menu && menuShot ? (
        <ShotMenu
          anchor={menu.anchor}
          canDelete={shots.length > 1}
          onClose={() => setMenu(null)}
          onDelete={() => useStudio.getState().removeShot(menuShot.id)}
          onDuplicate={() => useStudio.getState().duplicateShot(menuShot.id)}
          onRename={() => setRenamingId(menuShot.id)}
        />
      ) : null}
    </Row>
  );
}
