"use client";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SectionHeader, CarouselHint } from "@/components/template/blocks/shared";
import { MapPin } from "lucide-react";

export function ExperiencesV2({ data }: BlockProps) {
  if (!data.experiences?.length) return null;
  return (
    <section id="experiences" className="site-experiences-section site-experiences-v2 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader eyebrow="Nearby" title="Discover the area" />
        <div className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4">
          {data.experiences.map((exp, i) => (
            <article
              key={exp.title + i}
              className="hotel-card group w-[78%] min-w-[78%] shrink-0 snap-center overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 sm:w-[46%] sm:min-w-[46%] lg:w-[32%] lg:min-w-[32%]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                <img src={exp.image} alt={exp.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110" />
                <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-800 backdrop-blur">
                  <MapPin className="h-3 w-3" /> {exp.distance}
                </span>
              </div>
              <div className="p-6">
                <h3 className="hotel-title text-xl font-light tracking-tight text-neutral-900">{exp.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{exp.description}</p>
              </div>
            </article>
          ))}
        </div>
        <CarouselHint />
      </div>
    </section>
  );
}