/**
 * The screen video's sound, played through the browser's audio engine so it can be shaped like sound coming out of the
 * device: a floor on the bass (small speakers have none), a ceiling that drops when something is in the way, and a
 * level. Browsers only let sound start after a click or key press, so the chain is built on the first one.
 */

import type { SoundShape } from "@/lib/mockup-studio/scene/sound";

interface Chain {
  source: MediaElementAudioSourceNode;
  floor: BiquadFilterNode;
  ceiling: BiquadFilterNode;
  level: GainNode;
}

let context: AudioContext | null = null;
const chains = new WeakMap<HTMLVideoElement, Chain>();

/** How quickly the sound follows a change, in seconds. Fast enough to track a lid, slow enough never to click. */
const FOLLOW = 0.06;

/** Whether a click or key press has already let sound through on this page. */
export function soundUnlocked(): boolean {
  return context?.state === "running";
}

/** Route a video's sound through the chain. Call from a click or key press the first time. */
export function connectSound(video: HTMLVideoElement): void {
  context ??= new AudioContext();
  if (context.state === "suspended") void context.resume();
  if (chains.has(video)) return;
  const source = context.createMediaElementSource(video);
  const floor = context.createBiquadFilter();
  floor.type = "highpass";
  floor.frequency.value = 20;
  const ceiling = context.createBiquadFilter();
  ceiling.type = "lowpass";
  ceiling.frequency.value = 20000;
  const level = context.createGain();
  level.gain.value = 0;
  source
    .connect(floor)
    .connect(ceiling)
    .connect(level)
    .connect(context.destination);
  chains.set(video, { source, floor, ceiling, level });
  video.muted = false;
}

export function disconnectSound(video: HTMLVideoElement): void {
  const chain = chains.get(video);
  if (!chain) return;
  chain.level.disconnect();
  chain.source.disconnect();
  chains.delete(video);
}

export function shapeSound(video: HTMLVideoElement, shape: SoundShape): void {
  const chain = chains.get(video);
  if (!chain || !context) return;
  const now = context.currentTime;
  chain.level.gain.setTargetAtTime(shape.level, now, FOLLOW);
  chain.floor.frequency.setTargetAtTime(shape.floor, now, FOLLOW);
  chain.ceiling.frequency.setTargetAtTime(shape.ceiling, now, FOLLOW);
}
