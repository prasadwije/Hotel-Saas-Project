import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF, amenityIcon } from "@/components/template/blocks/shared";

/** v8 — Apple Bento & Glassmorphism: rounded glass tiles for each amenity. */
export function AmenitiesV8({ data }: BlockProps) {
  if (!data.amenities?.length) return null;
  return (
    <section id="amenities" className="site-amenities-section site-amenities-v8 relative overflow-hidden py-24 md:py-32" style={{ backgroundColor: "color-mix(in oklab, var(--site-primary) 6%, #f5f5f4)" }}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.4em]" style={{ color: "var(--site-primary)" }}>Amenities</p>
          <h2 className="hotel-title text-4xl font-semibold tracking-tight text-neutral-950 md:text-5xl" style={{ fontFamily: SERIF }}>Thoughtful comforts</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {data.amenities.map((label) => {
            const Icon = amenityIcon(label);
            return (
              <div key={label} className="group flex flex-col items-center justify-center rounded-[1.5rem] border border-white/40 bg-white/60 p-6 text-center shadow-[0_8px_30px_-8px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)]">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/40 bg-white/70 backdrop-blur" style={{ color: "var(--site-primary)" }}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="mt-4 text-sm font-medium tracking-wide text-neutral-800">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
