import type { BlockProps } from "@/components/template/blocks/shared";
import { SectionHeader, amenityIcon, isPageEnabled, useIsDedicatedPage } from "@/components/template/blocks/shared";
import { ReadMoreCTA } from "@/components/template/ReadMoreCTA";

export function AmenitiesV1({ data }: BlockProps) {
  if (!data.amenities?.length) return null;
  const truncate = isPageEnabled(data, "amenities") && !useIsDedicatedPage("amenities");
  const amenities = truncate ? data.amenities.slice(0, 6) : data.amenities;
  return (
    <section id="amenities" className="site-amenities-section site-amenities-v1 bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader eyebrow="Amenities" title="Thoughtful comforts" rule={false} />
        <div className="site-amenities-grid grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-neutral-100 ring-1 ring-black/5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {amenities.map((label) => {
            const Icon = amenityIcon(label);
            return (
              <div key={label} className="site-amenity-item group flex flex-col items-center justify-center gap-3 bg-white px-4 py-8 text-center transition-colors hover:bg-neutral-50">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full transition-transform group-hover:scale-110" style={{ backgroundColor: "color-mix(in oklab, var(--site-primary) 10%, transparent)", color: "var(--site-primary)" }}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="site-amenity-label text-xs font-medium uppercase tracking-[0.18em] text-neutral-700">{label}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-10 flex justify-center">
          <ReadMoreCTA data={data} sectionKey="amenities" label="View all amenities" />
        </div>
      </div>
    </section>
  );
}
