"use client";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SectionHeader } from "@/components/template/blocks/shared";
import { MapPin } from "lucide-react";

export function ExperiencesV1({ data }: BlockProps) {
  if (!data.experiences?.length) return null;
  return (
    <section id="experiences" className="site-experiences-section site-experiences-v1 bg-neutral-50 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader eyebrow="Nearby" title="Experiences & attractions" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.experiences.map((exp, i) => (
            <article
              key={exp.title + i}
              className="hotel-card group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                <img
                  src={exp.image}
                  alt={exp.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.25em]" style={{ color: "var(--site-primary)" }}>
                  <MapPin className="h-3 w-3" /> {exp.distance}
                </div>
                <h3 className="hotel-title mt-2 text-xl font-light tracking-tight text-neutral-900">{exp.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{exp.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}