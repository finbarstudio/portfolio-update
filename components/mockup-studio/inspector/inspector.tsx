"use client";

import { BackgroundSection } from "./background-section";
import { CompositionSection } from "./composition-section";
import { EffectsSection } from "./effects-section";
import { ExportBar } from "./export-bar";
import { LightsSection } from "./lights-section";
import { ParamSection } from "./param-section";

export function Inspector() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <ExportBar />
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <CompositionSection />
        <ParamSection title="Object" group="object" />
        <ParamSection title="Camera" group="camera" />
        <LightsSection />
        <ParamSection
          title="Screen Effects"
          group="screen"
          defaultOpen={false}
        />
        <EffectsSection />
        <BackgroundSection />
      </div>
    </div>
  );
}
