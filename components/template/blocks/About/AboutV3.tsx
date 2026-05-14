import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF, firstHeroImage } from "@/components/template/blocks/shared";

/** v3 — Split & Overlapping: image overlaps a copy card to create depth. */
export function AboutV3({ data }: BlockProps) {
  const img = data.galleryImages?.[0] ?? firstHeroImage(data);
  return (
    <section id="about" className="site-about-section site-about-v3 relative overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative grid grid-cols-1 items-center gap-8 md:grid-cols-12">
          {img && (
            <div className="md:col-span-7">
              <img src={img} alt="" loading="lazy" className="aspect-[4/3] w-full rounded-3xl object-cover shadow-2xl ring-1 ring-black/5" />
            </div>
          )}
          <div className="relative z-10 md:col-span-6 md:-ml-24">
            <div className="rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-black/5 md:p-12">
              <p className="mb-4 text-xs uppercase tracking-[0.35em]" style={{ color: "var(--site-primary)" }}>Our Story</p>
              <h2 className="hotel-title text-4xl font-light leading-[1.05] tracking-tight text-neutral-900 md:text-5xl" style={{ fontFamily: SERIF }}>
                Crafted with care, served with grace.
              </h2>
              <p className="site-about-text mt-6 text-base leading-relaxed text-neutral-600">{data.aboutText}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
