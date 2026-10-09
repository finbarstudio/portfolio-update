"use client";

import { useRef } from "react";
import { Button, type ButtonProps } from "./button";

export interface FileButtonProps extends ButtonProps {
  accept: string;
  multiple?: boolean;
  /** Called with the chosen files (never empty). */
  onFiles(files: File[]): void;
}

/** A button that opens the native file picker. */
export function FileButton({
  accept,
  multiple,
  onFiles,
  onClick,
  ...props
}: FileButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        {...props}
        onClick={(event) => {
          onClick?.(event);
          inputRef.current?.click();
        }}
      />
      <input
        ref={inputRef}
        type="file"
        hidden
        tabIndex={-1}
        accept={accept}
        multiple={multiple}
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          // Clear so choosing the same file again still fires onChange.
          event.target.value = "";
          if (files.length > 0) onFiles(files);
        }}
      />
    </>
  );
}
