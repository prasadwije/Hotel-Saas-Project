import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF, firstHeroImage } from "@/components/template/blocks/shared";

/** v5 — Centered & Spacious: centered text above an edge-to-edge image. */
export function AboutV5({ data }: BlockProps) {
  const img = data.galleryImages?.[0] ?? firstHeroImage(data);
  return (
    <section id="about" className="site-about-section site-about-v5 bg-white py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="mb-5 text-xs uppercase tracking-[0.4em]" style={{ color: "var(--site-primary)" }}>Our Story</p>
        <h2 className="hotel-title text-balance text-4xl font-light leading-[1.05] tracking-tight text-neutral-900 md:text-6xl" style={{ fontFamily: SERIF }}>
          Crafted with care, served with grace.
        </h2>
        <div className="mx-auto my-10 h-px w-16" style={{ backgroundColor: "var(--site-primary)" }} />
        <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-neutral-600">{data.aboutText}</p>
      </div>
      {img && (
        <div className="mt-16 w-full">
          <img src={img} alt="" loading="lazy" className="h-[60vh] w-full object-cover" />
        </div>
      )}
    </section>
  );
}
