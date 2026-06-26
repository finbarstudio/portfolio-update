"use client";

import dynamic from "next/dynamic";
import SandboxLoader from "@/components/sandbox/SandboxLoader";

// three.js is client-only; keep it out of the server bundle.
const DrumCredits = dynamic(() => import("./DrumCredits"), {
  ssr: false,
  loading: () => (
    <div className="sb-fx-stage">
      <SandboxLoader label="Loading effect" />
    </div>
  ),
});

export default function DrumCreditsClient() {
  return <DrumCredits />;
}
