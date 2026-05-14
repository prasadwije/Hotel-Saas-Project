import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF, amenityIcon, firstHeroImage } from "@/components/template/blocks/shared";

/** v10 — Floating Layered Editorial: backdrop image with floating solid amenity card. */
export function AmenitiesV10({ data }: BlockProps) {
  if (!data.amenities?.length) return null;
  const img = data.galleryImages?.[1] ?? data.galleryImages?.[0] ?? firstHeroImage(data);
  return (
    <section id="amenities" className="site-amenities-section site-amenities-v10 relative bg-neutral-50 pb-24 md:pb-32">
      <div className="relative h-[40vh] w-full md:h-[55vh]">
        {img && <img src={img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-black/25" />
      </div>
      <div className="relative z-10 mx-auto -mt-32 max-w-5xl px-4 md:-mt-44 md:px-6">
        <div className="rounded-sm bg-white p-10 shadow-2xl shadow-neutral-950/15 md:p-16">
          <div className="text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.45em]" style={{ color: "var(--site-primary)" }}>Amenities</p>
            <h2 className="hotel-title mt-4 text-3xl font-light tracking-tight text-neutral-950 md:text-5xl" style={{ fontFamily: SERIF }}>Thoughtful comforts</h2>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4">
            {data.amenities.map((label) => {
              const Icon = amenityIcon(label);
              return (
                <div key={label} className="flex flex-col items-center gap-3 text-center">
                  <Icon className="h-6 w-6" style={{ color: "var(--site-primary)" }} />
                  <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-neutral-700">{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
