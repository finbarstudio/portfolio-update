import { getDevice } from "@/lib/mockup-studio/scene/devices";
import { OPEN_SOUND, type SoundShape, speakerShape } from "@/lib/mockup-studio/scene/sound";
import { resolveAt, useStudio } from "@/lib/mockup-studio/scene/store";

/**
 * The soundtrack of an export: the screen video's own sound, looped the way the video loops, and shaped frame by
 * frame with the same numbers the live preview uses. Rendered offline, so it is exact however long the export takes.
 * Resolves to null when there is nothing to hear: sound off, the media is not a video, or the video has no audio.
 */
export async function renderSoundtrack(
  fps: number,
  frameCount: number,
): Promise<AudioBuffer | null> {
  const { media, sound, speakerSound, deviceId } = useStudio.getState();
  if (!sound || media?.kind !== "video") return null;

  let clip: AudioBuffer;
  const probe = new AudioContext();
  try {
    const data = await (await fetch(media.url)).arrayBuffer();
    // Rejects for a video with no audio track, which simply means a silent export.
    clip = await probe.decodeAudioData(data);
  } catch {
    return null;
  } finally {
    void probe.close();
  }

  const seconds = frameCount / fps;
  const context = new OfflineAudioContext(
    Math.min(2, clip.numberOfChannels),
    Math.ceil(seconds * clip.sampleRate),
    clip.sampleRate,
  );
  const source = context.createBufferSource();
  source.buffer = clip;
  // The picture restarts every `media.duration`; the sound has to restart with it, not at its own length.
  source.loop = true;
  source.loopEnd = media.duration
    ? Math.min(clip.duration, media.duration / 1000)
    : clip.duration;
  const floor = context.createBiquadFilter();
  floor.type = "highpass";
  const ceiling = context.createBiquadFilter();
  ceiling.type = "lowpass";
  const level = context.createGain();
  source
    .connect(floor)
    .connect(ceiling)
    .connect(level)
    .connect(context.destination);

  const def = getDevice(deviceId);
  for (let i = 0; i <= frameCount; i++) {
    const at = i / fps;
    const shape: SoundShape = speakerSound
      ? speakerShape(def, resolveAt(at * 1000))
      : OPEN_SOUND;
    if (i === 0) {
      level.gain.setValueAtTime(shape.level, 0);
      floor.frequency.setValueAtTime(shape.floor, 0);
      ceiling.frequency.setValueAtTime(shape.ceiling, 0);
    } else {
      level.gain.linearRampToValueAtTime(shape.level, at);
      floor.frequency.linearRampToValueAtTime(shape.floor, at);
      ceiling.frequency.linearRampToValueAtTime(shape.ceiling, at);
    }
  }
  source.start(0);
  return context.startRendering();
}
