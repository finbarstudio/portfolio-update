import type { ReactNode } from "react";

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      viewBox="0 0 16 16"
    >
      {children}
    </svg>
  );
}

export function PlayIcon() {
  return (
    <Icon>
      <path
        d="M5 3.2v9.6a.5.5 0 0 0 .76.43l7.8-4.8a.5.5 0 0 0 0-.86l-7.8-4.8A.5.5 0 0 0 5 3.2Z"
        fill="currentColor"
      />
    </Icon>
  );
}

export function PauseIcon() {
  return (
    <Icon>
      <path d="M5.5 3.5v9M10.5 3.5v9" strokeWidth={2.2} />
    </Icon>
  );
}

export function SkipBackIcon() {
  return (
    <Icon>
      <path d="M4 3.5v9" />
      <path
        d="M12.5 3.6v8.8a.4.4 0 0 1-.62.33L6 8.33a.4.4 0 0 1 0-.66l5.88-4.4a.4.4 0 0 1 .62.33Z"
        fill="currentColor"
      />
    </Icon>
  );
}

export function LoopIcon() {
  return (
    <Icon>
      <path d="M3 7.5V7a2.5 2.5 0 0 1 2.5-2.5H13M13 4.5l-2-2M13 4.5l-2 2" />
      <path d="M13 8.5V9a2.5 2.5 0 0 1-2.5 2.5H3M3 11.5l2-2M3 11.5l2 2" />
    </Icon>
  );
}

export function KeyframeIcon() {
  return (
    <Icon>
      <path d="M8 2.5 13.5 8 8 13.5 2.5 8 8 2.5Z" />
    </Icon>
  );
}

export function MoreIcon() {
  return (
    <Icon>
      <circle cx="3.5" cy="8" fill="currentColor" r="1" stroke="none" />
      <circle cx="8" cy="8" fill="currentColor" r="1" stroke="none" />
      <circle cx="12.5" cy="8" fill="currentColor" r="1" stroke="none" />
    </Icon>
  );
}

export function PlusIcon() {
  return (
    <Icon>
      <path d="M8 3.5v9M3.5 8h9" />
    </Icon>
  );
}

export function CloseIcon() {
  return (
    <Icon>
      <path d="m4 4 8 8M12 4l-8 8" />
    </Icon>
  );
}

/** A strip of film: the uploaded clip. */
export function ClipIcon() {
  return (
    <Icon>
      <rect x="2" y="3" width="12" height="10" rx="1.5" />
      <path d="M5 3v10M11 3v10M2 6h3M2 10h3M11 6h3M11 10h3" />
    </Icon>
  );
}
