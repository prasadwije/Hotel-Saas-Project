import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF, firstHeroImage } from "@/components/template/blocks/shared";

/** v10 — Floating Layered Editorial: backdrop image with solid floating card overlap. */
export function AboutV10({ data }: BlockProps) {
  const img = data.galleryImages?.[0] ?? firstHeroImage(data);
  return (
    <section id="about" className="site-about-section site-about-v10 bg-neutral-50 pb-24 md:pb-32">
      <div className="relative w-full">
        {img && <img src={img} alt="" loading="lazy" className="h-[55vh] w-full object-cover md:h-[70vh]" />}
        <div className="absolute inset-0 bg-black/20" />
      </div>
      <div className="relative z-10 mx-auto -mt-32 grid max-w-6xl gap-6 px-4 md:-mt-44 md:grid-cols-12 md:px-6">
        <div className="rounded-sm bg-white p-10 shadow-2xl shadow-neutral-950/15 md:col-span-7 md:col-start-2 md:p-14">
          <p className="text-[11px] font-medium uppercase tracking-[0.45em]" style={{ color: "var(--site-primary)" }}>Our Story</p>
          <h2 className="hotel-title mt-5 text-3xl font-light leading-[1.1] tracking-tight text-neutral-950 md:text-5xl" style={{ fontFamily: SERIF }}>
            Crafted with care.
          </h2>
          <p className="mt-6 text-base font-light leading-relaxed text-neutral-600 md:text-lg">{data.aboutText}</p>
        </div>
      </div>
    </section>
  );
}
