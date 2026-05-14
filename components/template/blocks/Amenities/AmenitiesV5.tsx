import type { BlockProps } from "@/components/template/blocks/shared";
import { SectionHeader, amenityIcon } from "@/components/template/blocks/shared";

/** v5 — Centered & Spacious: centered grid with airy spacing and subtle dividers. */
export function AmenitiesV5({ data }: BlockProps) {
  if (!data.amenities?.length) return null;
  return (
    <section id="amenities" className="site-amenities-section site-amenities-v5 bg-white py-32 md:py-44">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <SectionHeader eyebrow="Amenities" title="Thoughtful comforts" />
        <div className="mt-4 grid grid-cols-2 gap-y-12 gap-x-8 sm:grid-cols-3 md:grid-cols-4">
          {data.amenities.map((label) => {
            const Icon = amenityIcon(label);
            return (
              <div key={label} className="flex flex-col items-center gap-4">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: "color-mix(in oklab, var(--site-primary) 10%, transparent)", color: "var(--site-primary)" }}>
                  <Icon className="h-6 w-6" />
                </span>
                <span className="text-sm font-medium tracking-wide text-neutral-700">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
