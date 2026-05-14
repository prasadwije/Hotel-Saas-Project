import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF, firstHeroImage } from "@/components/template/blocks/shared";

/** v9 — Cinematic Elegant Minimal: full-bleed image with hairline framed text. */
export function AboutV9({ data }: BlockProps) {
  const img = data.galleryImages?.[0] ?? firstHeroImage(data);
  return (
    <section id="about" className="site-about-section site-about-v9 bg-white">
      <div className="relative w-full">
        {img && <img src={img} alt="" loading="lazy" className="h-[70vh] w-full object-cover md:h-[85vh]" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
      </div>
      <div className="mx-auto max-w-3xl px-6 py-24 text-center md:py-32">
        <p className="text-[11px] font-light uppercase tracking-[0.55em]" style={{ color: "var(--site-primary)" }}>Our Story</p>
        <div className="mx-auto mt-6 h-px w-12 bg-neutral-300" />
        <h2 className="hotel-title mt-8 text-balance text-4xl font-light leading-[1.1] tracking-tight text-neutral-950 md:text-6xl" style={{ fontFamily: SERIF }}>
          A quiet sense of place.
        </h2>
        <p className="mx-auto mt-8 max-w-2xl text-base font-light leading-relaxed tracking-wide text-neutral-600 md:text-lg">
          {data.aboutText}
        </p>
      </div>
    </section>
  );
}
