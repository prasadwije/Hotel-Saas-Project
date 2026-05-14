import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF, firstHeroImage } from "@/components/template/blocks/shared";

/** v4 — Bento/Grid: copy + stat tiles + image arranged in a bento grid. */
export function AboutV4({ data }: BlockProps) {
  const img = data.galleryImages?.[0] ?? firstHeroImage(data);
  return (
    <section id="about" className="site-about-section site-about-v4 bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2 md:gap-5">
          <div className="rounded-3xl bg-neutral-50 p-8 ring-1 ring-black/5 md:col-span-2 md:p-10">
            <p className="mb-3 text-xs uppercase tracking-[0.35em]" style={{ color: "var(--site-primary)" }}>Our Story</p>
            <h2 className="hotel-title text-3xl font-light leading-tight text-neutral-900 md:text-5xl" style={{ fontFamily: SERIF }}>
              Crafted with care.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-neutral-600">{data.aboutText}</p>
          </div>
          {img ? (
            <div className="overflow-hidden rounded-3xl ring-1 ring-black/5 md:row-span-2">
              <img src={img} alt="" loading="lazy" className="h-64 w-full object-cover md:h-full" />
            </div>
          ) : (
            <div className="rounded-3xl bg-neutral-100 md:row-span-2" />
          )}
          <div className="rounded-3xl bg-neutral-50 p-8 text-center ring-1 ring-black/5">
            <p className="text-4xl font-light" style={{ fontFamily: SERIF, color: "var(--site-primary)" }}>20+</p>
            <p className="mt-2 text-xs uppercase tracking-widest text-neutral-500">Years of Craft</p>
          </div>
          <div className="rounded-3xl bg-neutral-50 p-8 text-center ring-1 ring-black/5">
            <p className="text-3xl font-light" style={{ fontFamily: SERIF, color: "var(--site-primary)" }}>★★★★★</p>
            <p className="mt-2 text-xs uppercase tracking-widest text-neutral-500">Guest Reviews</p>
          </div>
        </div>
      </div>
    </section>
  );
}
