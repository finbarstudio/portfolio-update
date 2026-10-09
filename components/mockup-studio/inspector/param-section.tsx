"use client";

import type { ReactNode } from "react";
import { IconButton } from "@/components/mockup-studio/ui/button";
import { ResetIcon } from "@/components/mockup-studio/ui/icons";
import { ParamSlider } from "@/components/mockup-studio/ui/param-slider";
import { Section } from "@/components/mockup-studio/ui/section";
import { getDevice } from "@/lib/mockup-studio/scene/devices";
import {
  type AnimPath,
  type ParamGroup,
  pathsInGroup,
} from "@/lib/mockup-studio/scene/params";
import { useStudio } from "@/lib/mockup-studio/scene/store";

export interface ParamSectionProps {
  title: string;
  group: ParamGroup;
  defaultOpen?: boolean;
  /** Extra controls placed next to a given parameter's slider. */
  renderExtra?: (path: AnimPath) => ReactNode;
}

/** A section with one slider per parameter in a group, plus a reset button. */
export function ParamSection({
  title,
  group,
  defaultOpen,
  renderExtra,
}: ParamSectionProps) {
  const resetValues = useStudio((s) => s.resetValues);
  const hasLid = useStudio((s) => getDevice(s.deviceId).lid !== undefined);
  // The lid slider only means something on a device that has one.
  const paths = pathsInGroup(group).filter(
    (path) => path !== "object.lid" || hasLid,
  );

  return (
    <Section
      title={title}
      defaultOpen={defaultOpen}
      actions={
        <IconButton label={`Reset ${title}`} onClick={() => resetValues(paths)}>
          <ResetIcon width={14} height={14} />
        </IconButton>
      }
    >
      {paths.map((path) => (
        <ParamSlider key={path} path={path} extra={renderExtra?.(path)} />
      ))}
    </Section>
  );
}
