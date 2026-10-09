import { create } from "zustand";
import type { AnimPath } from "@/lib/mockup-studio/scene/params";

export interface KeyframeRef {
  shotId: string;
  path: AnimPath;
  id: string;
}

interface SelectionState {
  selected: KeyframeRef | null;
  select(ref: KeyframeRef | null): void;
}

/** The keyframe picked in Pro Mode. Lives outside the scene store: it is UI state, never saved. */
export const useSelection = create<SelectionState>()((set) => ({
  selected: null,
  select: (selected) => set({ selected }),
}));

interface ShotSelectionState {
  /** Shots highlighted in the timeline, in timeline order. A preset applied with two or more replaces them all. */
  ids: string[];
  /** The shot a shift-click extends from. */
  anchor: string | null;
  select(ids: string[], anchor?: string | null): void;
  clear(): void;
}

/** Which shot blocks are highlighted. UI state, never saved. */
export const useShotSelection = create<ShotSelectionState>()((set) => ({
  ids: [],
  anchor: null,
  select: (ids, anchor) =>
    set((state) => ({
      ids,
      anchor: anchor === undefined ? state.anchor : anchor,
    })),
  clear: () => set({ ids: [], anchor: null }),
}));
