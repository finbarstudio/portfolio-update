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
 * A one-shot preset animates the shot under the playhead. A multi-shot preset
 * replaces the whole timeline with its own shots and lengths. Either way the
 * preset sets its own pose, so nothing left over from manual edits leaks in.
 */
function applyPreset(preset: AnimationPreset) {
  const {
    shots,
    playhead,
    deviceExtents,
    deviceScreen,
    composition,
    setShots,
    setPlayhead,
    setPlaying,
  } = useStudio.getState();
  // Each shot's zoom is solved for this device and canvas shape, so the preset frames the device wherever it is applied.
  const framing: FramingContext = {
    extents: deviceExtents,
    screen: deviceScreen,
    aspect: composition.width / composition.height,
  };

  const built = (): Shot[] =>
    preset.shots.map((part) => {
      const duration = Math.round(part.seconds * 1000);
      return {
        id: crypto.randomUUID(),
        name: part.name,
        duration,
        tracks: part.build(duration, framing),
      };
    });

  // Two or more highlighted shots: the preset takes their place, however many shots it has.
  const picked = useShotSelection.getState().ids;
  const indices = shots
    .map((shot, index) => (picked.includes(shot.id) ? index : -1))
    .filter((index) => index >= 0);
  if (indices.length >= 2) {
    const first = Math.min(...indices);
    const last = Math.max(...indices);
    const fresh = built();
    setShots([...shots.slice(0, first), ...fresh, ...shots.slice(last + 1)]);
    useShotSelection.getState().select(
      fresh.map((shot) => shot.id),
      fresh[0]?.id ?? null,
    );
    setPlayhead(
      shots.slice(0, first).reduce((sum, shot) => sum + shot.duration, 0),
    );
    setPlaying(true);
    return;
  }

  if (preset.shots.length === 1) {
    // The take is paced for its own length: a slow twelve second study squeezed into a three second shot is a
    // different animation, so the shot takes the preset's length along with its moves.
    const { shot, startMs } = locateShot(shots, playhead);
    const [part] = preset.shots;
    const duration = Math.round(part.seconds * 1000);
    setShots(
      shots.map((each) =>
        each.id === shot.id
          ? { ...each, duration, tracks: part.build(duration, framing) }
          : each,
      ),
    );
    setPlayhead(startMs);
  } else {
    setShots(built());
    useShotSelection.getState().clear();
  }
  setPlaying(true);
}

/** The families the list folds into, in order. A preset not placed in one lands in the last. */
const GROUPS = [
  "Cinematic",
  "For this device",
  "Showcase",
  "Turns",
  "Close-ups",
  "Lid",
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
  "lid-open": "Lid",
  "lid-close": "Lid",
};

function groupOf(preset: AnimationPreset): (typeof GROUPS)[number] {
  if (isTailored(preset)) return "For this device";
  return GROUP_OF[preset.id] ?? "Simple";
}

export function PresetsSection() {
  const device = useStudio((s) => getDevice(s.deviceId));
  const presets = PRESETS.filter((preset) => presetSuits(preset, device));
  const groups = GROUPS.map((title) => ({
    title,
    presets: presets.filter((preset) => groupOf(preset) === title),
  })).filter((group) => group.presets.length > 0);

  return (
    <Section title="Animation presets">
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
