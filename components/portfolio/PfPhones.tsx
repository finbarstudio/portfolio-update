"use client";

/**
 * The Moment You Realise in the portfolio: the same live 3D iPhone carousel the
 * case study opens with, reading its model and reels from the project content
 * so the two never drift apart.
 */

import PhoneCarousel from "@/components/PhoneCarousel";
import { projects } from "@/content/projects";

const phones = projects.find((p) => p.slug === "tmyr")?.heroPhones;

export default function PfPhones() {
  if (!phones) return null;
  return (
    <div className="pf-phones">
      <PhoneCarousel model={phones.model} videos={phones.videos} poster={phones.poster} fill />
    </div>
  );
}
