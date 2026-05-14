import type { BlockProps } from "@/components/template/blocks/shared";
import { SectionHeader, SERIF, amenityIcon } from "@/components/template/blocks/shared";

export function AmenitiesV2({ data }: BlockProps) {
  if (!data.amenities?.length) return null;
  return (
    <section id="amenities" className="site-amenities-section site-amenities-v2 bg-neutral-50 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader eyebrow="Amenities" title="Thoughtful comforts" rule={false} />
        <ul className="site-amenities-list grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.amenities.map((label) => {
            const Icon = amenityIcon(label);
            return (
              <li key={label} className="site-amenity-row group flex items-center gap-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:shadow-lg">
                <span className="inline-flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl transition-transform group-hover:scale-105" style={{ backgroundColor: "color-mix(in oklab, var(--site-primary) 12%, transparent)", color: "var(--site-primary)" }}>
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-base font-normal tracking-tight text-neutral-900" style={{ fontFamily: SERIF }}>{label}</p>
                  <p className="mt-0.5 text-xs uppercase tracking-[0.2em] text-neutral-400">Included</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
