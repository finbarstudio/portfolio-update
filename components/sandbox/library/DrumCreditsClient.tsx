"use client";

import dynamic from "next/dynamic";

// three.js is client-only; keep it out of the server bundle.
const DrumCredits = dynamic(() => import("./DrumCredits"), {
  ssr: false,
  loading: () => <div className="sb-fx-stage" />,
});

export default function DrumCreditsClient() {
  return <DrumCredits />;
}
