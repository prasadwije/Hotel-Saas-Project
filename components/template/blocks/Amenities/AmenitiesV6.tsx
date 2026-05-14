import type { BlockProps } from "@/components/template/blocks/shared";
import { SectionHeader, SERIF, amenityIcon } from "@/components/template/blocks/shared";

/** v6 — Floating Cards & Slider: horizontally scrolling amenity cards. */
export function AmenitiesV6({ data }: BlockProps) {
  if (!data.amenities?.length) return null;
  return (
    <section id="amenities" className="site-amenities-section site-amenities-v6 bg-neutral-100 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader eyebrow="Amenities" title="Thoughtful comforts" rule={false} />
      </div>
      <div className="mx-auto max-w-7xl">
        <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 md:gap-5">
          {data.amenities.map((label) => {
            const Icon = amenityIcon(label);
            return (
              <div key={label} className="flex w-[58%] shrink-0 snap-center flex-col items-start gap-4 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-black/5 sm:w-[40%] md:w-[220px]">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: "color-mix(in oklab, var(--site-primary) 12%, transparent)", color: "var(--site-primary)" }}>
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-base font-normal tracking-tight text-neutral-900" style={{ fontFamily: SERIF }}>{label}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-neutral-400">Included</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
