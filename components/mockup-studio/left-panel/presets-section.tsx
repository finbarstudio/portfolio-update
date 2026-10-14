"use client";

import { useShotSelection } from "@/components/mockup-studio/timeline/selection";
import { Button } from "@/components/mockup-studio/ui/button";
import { Fold } from "@/components/mockup-studio/ui/fold";
import { Section } from "@/components/mockup-studio/ui/section";
import { locateShot } from "@/lib/mockup-studio/scene/animation";
import { getDevice } from "@/lib/mockup-studio/scene/devices";
import type { FramingContext } from "@/lib/mockup-studio/scene/framing";
import {
  type AnimationPreset,
  isTailored,
  PRESETS,
  presetSuits,
} from "@/lib/mockup-studio/scene/presets";
import { useStudio } from "@/lib/mockup-studio/scene/store";
import type { Shot } from "@/lib/mockup-studio/scene/types";

/**
 * A preset replaces the whole timeline with its own shots and lengths, or, when shots are highlighted in the
 * timeline, just those. Either way the preset sets its own pose, so nothing left over from manual edits leaks in.
 */
function applyPreset(preset: AnimationPreset) {
  const {
    shots,
    deviceId,
    deviceExtents,
    deviceScreen,
    composition,
    background,
    setShots,
    setPlayhead,
    setPlaying,
  } = useStudio.getState();
  // Each shot's zoom is solved for this device and canvas shape, so the preset frames the device wherever it is applied.
  const framing: FramingContext = {
    extents: deviceExtents,
    screen: deviceScreen,
    aspect: composition.width / composition.height,
    // A laptop is always seen from above its deck, never from underneath.
    // With a floor on, the view also stays above the ground rather than dipping under it.
    minPitch: getDevice(deviceId).lid
      ? LAPTOP_MIN_PITCH
      : background.floor !== "none"
        ? FLOOR_MIN_PITCH
        : undefined,
  };

  const built = (): Shot[] =>
    preset.shots.map((part) => {
      const duration = Math.round(part.seconds * 1000);
      return {
        id: crypto.randomUUID(),
        name: part.name,
        duration,
        tracks: part.build(duration, framing),
        preset: preset.id,
      };
    });

  // Shots highlighted in the timeline: the preset takes their place, however many shots it has. Nothing highlighted:
  // it takes over the whole timeline.
  const picked = useShotSelection.getState().ids;
  const indices = shots
    .map((shot, index) => (picked.includes(shot.id) ? index : -1))
    .filter((index) => index >= 0);
  const fresh = built();
  if (indices.length > 0) {
    const first = Math.min(...indices);
    const last = Math.max(...indices);
    setShots([...shots.slice(0, first), ...fresh, ...shots.slice(last + 1)]);
    setPlayhead(
      shots.slice(0, first).reduce((sum, shot) => sum + shot.duration, 0),
    );
  } else {
    setShots(fresh);
  }
  // The next preset goes back to replacing everything until shots are picked again.
  useShotSelection.getState().clear();
  setPlaying(true);
}

/** Degrees above the ground every take stays at or over while a floor is on. */
const FLOOR_MIN_PITCH = 3;

/** Degrees above the deck every laptop take stays at or over. */
const LAPTOP_MIN_PITCH = 6;

/** The families the list folds into, in order. A preset not placed in one lands in the last. */
const GROUPS = [
  "Cinematic",
  "For this device",
  "Showcase",
  "Turns",
  "Close-ups",
  "Simple",
] as const;

const GROUP_OF: Record<string, (typeof GROUPS)[number]> = {
  "signature-cut": "Cinematic",
  "sweep-in": "Cinematic",
  "pull-back-reveal": "Cinematic",
  "edge-to-face": "Cinematic",
  "wake-loop": "Cinematic",
  "light-pulse": "Cinematic",
  "screen-pan": "Cinematic",
  "corner-push": "Cinematic",
  "screen-showcase": "Showcase",
  "dark-reveal": "Showcase",
  keynote: "Showcase",
  "studio-turn": "Turns",
  "slow-orbit": "Turns",
  "around-the-back": "Turns",
  "low-hero": "Turns",
  overhead: "Turns",
  "edge-and-face": "Turns",
  "screen-first": "Close-ups",
  "macro-study": "Close-ups",
  "lean-in": "Close-ups",
  "corner-study": "Close-ups",
  "glide-down": "Close-ups",
  "side-skim": "Close-ups",
  "macro-push": "Close-ups",
  "close-orbit": "Close-ups",
  "over-the-top": "Close-ups",
  "into-focus": "Close-ups",
  "detail-cuts": "Close-ups",
};

function groupOf(preset: AnimationPreset): (typeof GROUPS)[number] {
  if (isTailored(preset)) return "For this device";
  return GROUP_OF[preset.id] ?? "Simple";
}

export function PresetsSection() {
  const device = useStudio((s) => getDevice(s.deviceId));
  const presets = PRESETS.filter((preset) => presetSuits(preset, device));
  // The preset behind the shot under the playhead, so the list shows what is playing.
  const activeId = useStudio(
    (s) => locateShot(s.shots, s.playhead).shot.preset ?? null,
  );
  const active = PRESETS.find((preset) => preset.id === activeId);
  const picked = useShotSelection((s) => s.ids.length);
  const groups = GROUPS.map((title) => ({
    title,
    presets: presets.filter((preset) => groupOf(preset) === title),
  })).filter((group) => group.presets.length > 0);

  return (
    <Section title="Animation presets">
      <p className="mb-2 text-ms-ink-muted">
        {active ? (
          <>
            This shot uses <span className="text-ms-ink">{active.name}</span>
          </>
        ) : (
          "This shot uses no preset"
        )}
      </p>
      <p className="mb-2 text-ms-ink-faint">
        {picked > 0
          ? `A preset replaces the ${picked === 1 ? "highlighted shot" : `${picked} highlighted shots`}.`
          : "A preset replaces the whole timeline. Click shots in the timeline to replace only those."}
      </p>
      <div>
        {groups.map((group, index) => (
          <Fold
            key={group.title}
            title={group.title}
            storageKey={`presets:${group.title}`}
            defaultOpen={index === 0}
            note={group.presets.length}
          >
            <ul className="flex flex-col gap-1">
              {group.presets.map((preset) => (
                <li key={preset.id}>
                  <Button
                    size="auto"
                    justify="start"
                    onClick={() => applyPreset(preset)}
                    pressed={preset.id === activeId}
                    className="w-full"
                  >
                    <span className="flex flex-col gap-0.5">
                      <span className="font-medium">
                        {preset.featured ? (
                          <span
                            aria-label="Featured"
                            className="mr-1.5 text-amber-400"
                            role="img"
                            title="Built from mckp.live's own preset for this device"
                          >
                            ★
                          </span>
                        ) : null}
                        {preset.name}
                        <span className="ml-1.5 font-normal text-ms-ink-faint">
                          {preset.shots.length > 1
                            ? `${preset.shots.length} shots`
                            : "1 shot"}
                        </span>
                      </span>
                    </span>
                  </Button>
                </li>
              ))}
            </ul>
          </Fold>
        ))}
      </div>
    </Section>
  );
}
