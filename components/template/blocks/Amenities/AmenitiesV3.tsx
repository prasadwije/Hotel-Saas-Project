import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF, amenityIcon, firstHeroImage } from "@/components/template/blocks/shared";

/** v3 — Split & Overlapping: image on one side, amenity list overlaps in a card. */
export function AmenitiesV3({ data }: BlockProps) {
  if (!data.amenities?.length) return null;
  const img = data.galleryImages?.[1] ?? data.galleryImages?.[0] ?? firstHeroImage(data);
  return (
    <section id="amenities" className="site-amenities-section site-amenities-v3 bg-neutral-50 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-6 md:grid-cols-12">
          <div className="md:col-span-6">
            {img ? (
              <img src={img} alt="" loading="lazy" className="aspect-[4/5] w-full rounded-3xl object-cover shadow-2xl ring-1 ring-black/5" />
            ) : (
              <div className="aspect-[4/5] w-full rounded-3xl bg-neutral-200" />
            )}
          </div>
          <div className="relative z-10 md:col-span-7 md:-ml-24">
            <div className="rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-black/5 md:p-12">
              <p className="mb-3 text-xs uppercase tracking-[0.35em]" style={{ color: "var(--site-primary)" }}>Amenities</p>
              <h2 className="hotel-title text-3xl font-light leading-tight text-neutral-900 md:text-4xl" style={{ fontFamily: SERIF }}>Thoughtful comforts</h2>
              <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
                {data.amenities.map((label) => {
                  const Icon = amenityIcon(label);
                  return (
                    <li key={label} className="flex items-center gap-2.5 text-sm text-neutral-800">
                      <Icon className="h-4 w-4 flex-shrink-0" style={{ color: "var(--site-primary)" }} />
                      <span>{label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
