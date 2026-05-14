import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF, amenityIcon } from "@/components/template/blocks/shared";

/** v7 — Apple Product Page: massive headline with a clean feature grid. */
export function AmenitiesV7({ data }: BlockProps) {
  if (!data.amenities?.length) return null;
  return (
    <section id="amenities" className="site-amenities-section site-amenities-v7 bg-white py-32 md:py-44">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.4em] text-neutral-500">Amenities</p>
          <h2 className="hotel-title text-balance text-5xl font-semibold leading-[0.95] tracking-tight text-neutral-950 md:text-7xl" style={{ fontFamily: SERIF }}>
            Every detail, considered.
          </h2>
        </div>
        <div className="mx-auto mt-20 grid max-w-5xl grid-cols-2 gap-y-16 gap-x-8 sm:grid-cols-3 md:grid-cols-4">
          {data.amenities.map((label) => {
            const Icon = amenityIcon(label);
            return (
              <div key={label} className="flex flex-col items-center text-center">
                <Icon className="h-8 w-8" style={{ color: "var(--site-primary)" }} />
                <span className="mt-4 text-sm font-medium tracking-wide text-neutral-700">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
