"use client";

import { Button } from "@/components/mockup-studio/ui/button";
import { ColourPicker } from "@/components/mockup-studio/ui/colour-picker";
import { Fold } from "@/components/mockup-studio/ui/fold";
import { CheckIcon } from "@/components/mockup-studio/ui/icons";
import { Section } from "@/components/mockup-studio/ui/section";
import { creditFor, creditLine } from "@/lib/mockup-studio/scene/credits";
import { DEVICE_CATEGORIES, DEVICES, getDevice } from "@/lib/mockup-studio/scene/devices";
import { useStudio } from "@/lib/mockup-studio/scene/store";

export function MockupSection() {
  const deviceId = useStudio((s) => s.deviceId);
  const setDevice = useStudio((s) => s.setDevice);
  const bodyColor = useStudio((s) => s.bodyColor);
  const setBodyColor = useStudio((s) => s.setBodyColor);
  const { colors, url } = getDevice(deviceId);
  const credit = creditFor(url);

  return (
    <Section title="Mockup">
      {DEVICE_CATEGORIES.map((category) => {
        const devices = DEVICES.filter(
          (device) => device.category === category,
        );
        if (devices.length === 0) return null;
        return (
          <Fold
            key={category}
            title={category}
            storageKey={`devices:${category}`}
            // The folder holding the current device starts open.
            defaultOpen={devices.some((device) => device.id === deviceId)}
            note={devices.length}
          >
            <ul className="flex flex-col gap-1">
              {devices.map((device) => {
                const selected = device.id === deviceId;
                const made = creditFor(device.url);
                return (
                  <li key={device.id}>
                    <Button
                      size="lg"
                      justify="between"
                      pressed={selected}
                      onClick={() => setDevice(device.id)}
                      title={made ? `Model: ${creditLine(made)}` : undefined}
                      className="w-full"
                    >
                      <span className="truncate">{device.name}</span>
                      {selected ? (
                        <CheckIcon
                          width={14}
                          height={14}
                          className="shrink-0"
                        />
                      ) : null}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </Fold>
        );
      })}
      {credit ? (
        <p className="mt-2 text-[11px] text-ms-ink-faint text-pretty">
          Model:{" "}
          <a
            href={credit.source}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ms-ink-muted underline-offset-2 hover:text-ms-ink hover:underline"
          >
            {credit.title}
          </a>{" "}
          by {credit.author}, {credit.license}
        </p>
      ) : null}
      <fieldset className="mt-2 flex min-w-0 flex-wrap items-center gap-1.5">
        <legend className="sr-only">Finish</legend>
        {colors.map((color) => {
          const selected = color.hex === bodyColor;
          return (
            <button
              key={color.name}
              type="button"
              title={color.name}
              aria-label={color.name}
              aria-pressed={selected}
              onClick={() => setBodyColor(color.hex)}
              className="grid size-7 place-items-center rounded-full border border-transparent aria-pressed:border-ms-ink"
            >
              <span
                className="size-5 rounded-full border border-ms-line"
                style={{
                  background:
                    color.hex ??
                    "conic-gradient(#8c8c8c, #ececec, #5c5c5c, #8c8c8c)",
                }}
              />
            </button>
          );
        })}
        <span className="ml-1 truncate text-ms-ink-muted">
          {colors.find((color) => color.hex === bodyColor)?.name ?? "Custom"}
        </span>
      </fieldset>
      {/* Any colour at all, on top of the finishes it is sold in. */}
      <ColourPicker
        label="Custom"
        value={bodyColor ?? "#8c8c8c"}
        onChange={(hex) => setBodyColor(hex)}
      />
    </Section>
  );
}
