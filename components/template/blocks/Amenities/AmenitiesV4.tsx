import type { BlockProps } from "@/components/template/blocks/shared";
import { SectionHeader, SERIF, amenityIcon } from "@/components/template/blocks/shared";

/** v4 — Bento/Grid: amenities laid out as varied bento tiles with structured borders. */
export function AmenitiesV4({ data }: BlockProps) {
  if (!data.amenities?.length) return null;
  return (
    <section id="amenities" className="site-amenities-section site-amenities-v4 bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader eyebrow="Amenities" title="Thoughtful comforts" rule={false} />
        <div className="grid auto-rows-[140px] grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {data.amenities.map((label, i) => {
            const Icon = amenityIcon(label);
            const featured = i % 5 === 0;
            return (
              <div
                key={label}
                className={`flex flex-col justify-between rounded-2xl border border-neutral-200 bg-neutral-50 p-5 transition-all hover:-translate-y-0.5 hover:shadow-md ${featured ? "row-span-2" : ""}`}
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: "color-mix(in oklab, var(--site-primary) 12%, transparent)", color: "var(--site-primary)" }}>
                  <Icon className="h-5 w-5" />
                </span>
                <p className="text-base font-normal tracking-tight text-neutral-900" style={{ fontFamily: SERIF }}>{label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
