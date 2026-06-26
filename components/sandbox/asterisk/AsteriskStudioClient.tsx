"use client";

// Client-only loader so three.js (and its examples/jsm addons) never touch the
// server bundle. Mirrors the ssr:false pattern the other sandbox 3D tools use.
import dynamic from "next/dynamic";
import SandboxLoader from "@/components/sandbox/SandboxLoader";

const Studio = dynamic(() => import("./AsteriskStudio"), {
  ssr: false,
  loading: () => (
    <div className="sb-studio-loading">
      <SandboxLoader label="Loading studio" />
    </div>
  ),
});

export default function AsteriskStudioClient() {
  return <Studio />;
}
