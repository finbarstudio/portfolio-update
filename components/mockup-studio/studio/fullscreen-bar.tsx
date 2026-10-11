"use client";

import { useEffect, useState } from "react";
import { formatSeconds } from "@/components/mockup-studio/timeline/geometry";
import { IconButton } from "@/components/mockup-studio/timeline/icon-button";
import {
  CloseIcon,
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
} from "@/components/mockup-studio/timeline/icons";
import { totalDuration } from "@/lib/mockup-studio/scene/animation";
import { useStudio } from "@/lib/mockup-studio/scene/store";

/** The bar fades out after this long without the pointer moving, while the animation plays. */
const IDLE_MS = 2500;

/**
 * Playback controls for full screen, where the timeline is out of sight: play, back to start, a scrub bar, the time,
 * and a way out. It gets out of the way while the animation plays and comes back when the pointer moves.
 */
export function FullscreenBar({ onExit }: { onExit(): void }) {
  const playing = useStudio((s) => s.playing);
  const playhead = useStudio((s) => s.playhead);
  const total = useStudio((s) => totalDuration(s.shots));
  const [awake, setAwake] = useState(true);

  useEffect(() => {
    let timer = window.setTimeout(() => setAwake(false), IDLE_MS);
    const wake = () => {
      setAwake(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setAwake(false), IDLE_MS);
    };
    window.addEventListener("pointermove", wake);
    window.addEventListener("keydown", wake);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointermove", wake);
      window.removeEventListener("keydown", wake);
    };
  }, []);

  const { setPlaying, setPlayhead } = useStudio.getState();
  const hidden = playing && !awake;

  return (
    <div
      className={`absolute inset-x-0 bottom-4 z-10 mx-auto flex w-[min(44rem,calc(100%-12rem))] items-center gap-1 rounded-full border border-ms-line bg-ms-panel/80 py-1 pr-1 pl-2 backdrop-blur-md transition-opacity duration-200 focus-within:opacity-100 ${hidden ? "pointer-events-none opacity-0" : "opacity-100"}`}
    >
      <IconButton
        label={playing ? "Pause" : "Play"}
        onClick={() => setPlaying(!playing)}
        title={`${playing ? "Pause" : "Play"} (Space)`}
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </IconButton>
      <IconButton label="Back to start" onClick={() => setPlayhead(0)}>
        <SkipBackIcon />
      </IconButton>
      <input
        aria-label="Playhead"
        aria-valuetext={formatSeconds(playhead)}
        className="h-7 min-w-0 flex-1 cursor-pointer accent-ms-ink"
        max={total}
        min={0}
        onChange={(event) => {
          setPlaying(false);
          setPlayhead(Number(event.target.value));
        }}
        step={1}
        type="range"
        value={Math.min(playhead, total)}
      />
      <span className="shrink-0 px-2 text-ms-ink-muted tabular-nums">
        {formatSeconds(playhead)} / {formatSeconds(total)}
      </span>
      <IconButton
        label="Leave full screen"
        onClick={onExit}
        title="Leave full screen (F or Esc)"
      >
        <CloseIcon />
      </IconButton>
    </div>
  );
}
