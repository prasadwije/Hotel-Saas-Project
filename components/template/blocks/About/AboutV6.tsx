import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF, firstHeroImage } from "@/components/template/blocks/shared";

/** v6 — Floating Cards: copy in a floating shadow card with a side image card. */
export function AboutV6({ data }: BlockProps) {
  const img = data.galleryImages?.[0] ?? firstHeroImage(data);
  return (
    <section id="about" className="site-about-section site-about-v6 bg-neutral-100 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-stretch gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-10 shadow-xl ring-1 ring-black/5 md:p-14">
            <p className="mb-4 text-xs uppercase tracking-[0.35em]" style={{ color: "var(--site-primary)" }}>Our Story</p>
            <h2 className="hotel-title text-3xl font-light leading-tight text-neutral-900 md:text-5xl" style={{ fontFamily: SERIF }}>
              Crafted with care.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-neutral-600">{data.aboutText}</p>
          </div>
          {img ? (
            <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-black/5">
              <img src={img} alt="" loading="lazy" className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="rounded-3xl bg-white shadow-xl ring-1 ring-black/5" />
          )}
        </div>
      </div>
    </section>
  );
}
