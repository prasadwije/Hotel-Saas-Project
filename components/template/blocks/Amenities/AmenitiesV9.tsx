import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF, amenityIcon } from "@/components/template/blocks/shared";

/** v9 — Cinematic Elegant Minimal: hairline-divided amenity grid, no card chrome. */
export function AmenitiesV9({ data }: BlockProps) {
  if (!data.amenities?.length) return null;
  return (
    <section id="amenities" className="site-amenities-section site-amenities-v9 bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-light uppercase tracking-[0.55em]" style={{ color: "var(--site-primary)" }}>Amenities</p>
          <div className="mx-auto mt-6 h-px w-12 bg-neutral-300" />
          <h2 className="hotel-title mt-8 text-4xl font-light leading-tight tracking-tight text-neutral-950 md:text-6xl" style={{ fontFamily: SERIF }}>
            Quietly considered.
          </h2>
        </div>
        <div className="mx-auto mt-20 grid max-w-5xl grid-cols-2 border-t border-neutral-200 sm:grid-cols-3 md:grid-cols-4">
          {data.amenities.map((label) => {
            const Icon = amenityIcon(label);
            return (
              <div key={label} className="flex flex-col items-center gap-4 border-b border-r border-neutral-200 px-4 py-10 text-center last:border-r-0 [&:nth-child(2n)]:border-r-0 sm:[&:nth-child(2n)]:border-r sm:[&:nth-child(3n)]:border-r-0 md:[&:nth-child(3n)]:border-r md:[&:nth-child(4n)]:border-r-0">
                <Icon className="h-6 w-6" style={{ color: "var(--site-primary)" }} />
                <span className="text-[11px] font-light uppercase tracking-[0.3em] text-neutral-700">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
