"use client";

import { locateShot, totalDuration } from "@/lib/mockup-studio/scene/animation";
import { useStudio } from "@/lib/mockup-studio/scene/store";
import { formatSeconds } from "./geometry";
import { IconButton } from "./icon-button";
import {
  ClipIcon,
  KeyframeIcon,
  LoopIcon,
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
} from "./icons";

function TimeReadout() {
  const playhead = useStudio((s) => s.playhead);
  const total = useStudio((s) => totalDuration(s.shots));
  return (
    <span
      className="whitespace-nowrap text-ms-ink-muted tabular-nums"
      role="timer"
    >
      <span className="text-ms-ink">{formatSeconds(playhead)}</span> /{" "}
      {formatSeconds(total)}
    </span>
  );
}

/** Length of the shot under the playhead, edited in seconds. Commits on Enter or blur. */
function ShotLength() {
  const shot = useStudio((s) => locateShot(s.shots, s.playhead).shot);
  const setShotDuration = useStudio((s) => s.setShotDuration);

  const commit = (input: HTMLInputElement) => {
    const seconds = Number.parseFloat(input.value);
    if (Number.isFinite(seconds) && seconds > 0)
      setShotDuration(shot.id, seconds * 1000);
    // The store clamps, so show what it actually kept (also reverts bad input).
    const current = locateShot(
      useStudio.getState().shots,
      useStudio.getState().playhead,
    ).shot;
    input.value = (current.duration / 1000).toFixed(2);
  };

  return (
    <label className="flex items-center gap-1.5 text-ms-ink-muted">
      <span className="max-w-24 truncate" title={shot.name}>
        {shot.name}
      </span>
      <input
        aria-label={`Length of ${shot.name} in seconds`}
        className="h-7 w-14 select-text rounded-ms-control border border-ms-line bg-ms-raised px-1.5 text-right text-ms-ink tabular-nums"
        defaultValue={(shot.duration / 1000).toFixed(2)}
        inputMode="decimal"
        // Remount when the shot or its length changes elsewhere so the field never shows stale text.
        key={`${shot.id}:${shot.duration}`}
        onBlur={(event) => commit(event.currentTarget)}
        onFocus={(event) => event.currentTarget.select()}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
          if (event.key === "Escape") {
            event.currentTarget.value = (shot.duration / 1000).toFixed(2);
            event.currentTarget.blur();
          }
        }}
        spellCheck={false}
        type="text"
      />
      <span aria-hidden="true">s</span>
    </label>
  );
}

/** Length of the whole timeline. Changing it stretches or squeezes every shot and its keyframes together. */
function TotalLength() {
  const total = useStudio((s) => totalDuration(s.shots));
  const fitTimelineTo = useStudio((s) => s.fitTimelineTo);

  const commit = (input: HTMLInputElement) => {
    const seconds = Number.parseFloat(input.value);
    if (Number.isFinite(seconds) && seconds > 0) fitTimelineTo(seconds * 1000);
    input.value = (totalDuration(useStudio.getState().shots) / 1000).toFixed(2);
  };

  return (
    <label
      className="flex items-center gap-1.5 text-ms-ink-muted"
      title="Retime everything: all shots and keyframes scale together"
    >
      <span>Total</span>
      <input
        aria-label="Length of the whole timeline in seconds"
        className="h-7 w-14 select-text rounded-ms-control border border-ms-line bg-ms-raised px-1.5 text-right text-ms-ink tabular-nums"
        defaultValue={(total / 1000).toFixed(2)}
        inputMode="decimal"
        key={total}
        onBlur={(event) => commit(event.currentTarget)}
        onFocus={(event) => event.currentTarget.select()}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
          if (event.key === "Escape") {
            event.currentTarget.value = (total / 1000).toFixed(2);
            event.currentTarget.blur();
          }
        }}
        spellCheck={false}
        type="text"
      />
      <span aria-hidden="true">s</span>
    </label>
  );
}

/** Only shown with a video on the screen: one click makes the whole animation last exactly as long as the clip. */
function FitToClip() {
  const duration = useStudio((s) =>
    s.media?.kind === "video" ? (s.media.duration ?? 0) : 0,
  );
  const total = useStudio((s) => totalDuration(s.shots));
  const fitTimelineTo = useStudio((s) => s.fitTimelineTo);
  if (!duration) return null;
  const seconds = (duration / 1000).toFixed(1);
  return (
    <button
      aria-pressed={Math.abs(total - duration) < 20}
      className="flex h-7 shrink-0 items-center gap-1.5 rounded-ms-control border border-ms-line px-2 text-ms-ink-muted transition-colors hover:bg-ms-hover hover:text-ms-ink aria-pressed:border-ms-ink-faint aria-pressed:text-ms-ink"
      onClick={() => fitTimelineTo(duration)}
      title={`Stretch or squeeze every shot so the animation lasts ${seconds}s, the length of the clip`}
      type="button"
    >
      <ClipIcon />
      Fit to clip {seconds}s
    </button>
  );
}

function Divider() {
  return <div aria-hidden="true" className="mx-1 h-4 w-px shrink-0 bg-ms-line" />;
}

/** A tick that makes the last frame match the first, so the animation can repeat without a jump. */
function SeamlessLoop() {
  const seamless = useStudio((s) => s.seamlessLoop);
  const setSeamlessLoop = useStudio((s) => s.setSeamlessLoop);
  return (
    <label
      className="flex h-7 shrink-0 cursor-pointer items-center gap-1.5 rounded-ms-control border border-ms-line px-2 text-ms-ink-muted transition-colors hover:bg-ms-hover hover:text-ms-ink has-checked:border-ms-ink-faint has-checked:text-ms-ink"
      title="The end of the animation glides back to the first frame, so it repeats without a jump"
    >
      <input
        checked={seamless}
        className="size-3.5 accent-ms-ink"
        onChange={(event) => setSeamlessLoop(event.target.checked)}
        type="checkbox"
      />
      Seamless loop
    </label>
  );
}

export function Transport() {
  const playing = useStudio((s) => s.playing);
  const loop = useStudio((s) => s.loop);
  const proMode = useStudio((s) => s.proMode);

  const { setPlaying, setPlayhead, setLoop, setProMode, addKeyframes } =
    useStudio.getState();

  return (
    <div className="shrink-0 border-b border-ms-line">
      <div className="flex h-10 items-center gap-1 px-2">
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
        <IconButton label="Loop" onClick={() => setLoop(!loop)} pressed={loop}>
          <LoopIcon />
        </IconButton>
        <Divider />
        <IconButton
          label="Add keyframe at playhead"
          onClick={() => addKeyframes()}
          title="Add keyframe at playhead (K)"
        >
          <KeyframeIcon />
        </IconButton>
        <Divider />
        <TimeReadout />
        <Divider />
        <ShotLength />
        <TotalLength />
        <FitToClip />
        <SeamlessLoop />
        <div className="flex-1" />
        <button
          aria-pressed={proMode}
          className="h-7 shrink-0 rounded-ms-control border border-ms-line px-2.5 text-ms-ink-muted transition-colors hover:bg-ms-hover hover:text-ms-ink aria-pressed:border-ms-ink aria-pressed:bg-ms-ink aria-pressed:text-ms-canvas"
          onClick={() => setProMode(!proMode)}
          type="button"
        >
          Pro Mode
        </button>
      </div>
    </div>
  );
}
