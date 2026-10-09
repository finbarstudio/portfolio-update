"use client";

import { useState } from "react";
import { Button, IconButton } from "@/components/mockup-studio/ui/button";
import { FileButton } from "@/components/mockup-studio/ui/file-button";
import {
  CloseIcon,
  FolderOpenIcon,
  ResetIcon,
  SaveIcon,
} from "@/components/mockup-studio/ui/icons";
import { loadSceneFile, saveSceneFile } from "@/lib/mockup-studio/export";
import { useStudio } from "@/lib/mockup-studio/scene/store";

function messageOf(error: unknown): string {
  return error instanceof Error && error.message
    ? error.message
    : "Something went wrong.";
}

/** The app's name with opening, saving and resetting a scene under it, at the head of the left panel. */
export function AppHeader() {
  const [error, setError] = useState<string | null>(null);
  const resetScene = useStudio((s) => s.resetScene);

  async function openFile(file: File) {
    try {
      await loadSceneFile(file);
      setError(null);
    } catch (e) {
      setError(`Could not open ${file.name}. ${messageOf(e)}`);
    }
  }

  function save() {
    try {
      saveSceneFile();
      setError(null);
    } catch (e) {
      setError(`Could not save the scene. ${messageOf(e)}`);
    }
  }

  return (
    <header className="flex flex-col gap-3 border-ms-line border-b p-4">
      <h1 className="font-semibold text-sm">Mockup Studio</h1>
      <div className="grid grid-cols-2 gap-2">
        <FileButton
          accept=".json,application/json"
          title="Open a saved scene"
          onFiles={([file]) => openFile(file)}
        >
          <FolderOpenIcon width={14} height={14} />
          Open
        </FileButton>
        <Button onClick={save} title="Save this scene to a file">
          <SaveIcon width={14} height={14} />
          Save
        </Button>
        <Button
          onClick={resetScene}
          title="Back to the default pose and an empty timeline. Keeps your device, media, lights and background."
          className="col-span-2"
        >
          <ResetIcon width={14} height={14} />
          Reset pose and animation
        </Button>
      </div>
      {error ? (
        <div role="alert" className="flex items-start gap-1 text-ms-rec">
          <p className="min-w-0 flex-1 text-pretty">{error}</p>
          <IconButton label="Dismiss error" onClick={() => setError(null)}>
            <CloseIcon width={12} height={12} />
          </IconButton>
        </div>
      ) : null}
    </header>
  );
}
