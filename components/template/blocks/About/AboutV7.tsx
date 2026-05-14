import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF, firstHeroImage } from "@/components/template/blocks/shared";

/** v7 — Apple Product Page: edge-to-edge image with massive minimal copy. */
export function AboutV7({ data }: BlockProps) {
  const img = data.galleryImages?.[0] ?? firstHeroImage(data);
  return (
    <section id="about" className="site-about-section site-about-v7 bg-white pt-32 md:pt-44">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="mb-6 text-xs font-medium uppercase tracking-[0.4em] text-neutral-500">Our Story</p>
        <h2
          className="hotel-title text-balance text-5xl font-semibold leading-[0.95] tracking-tight text-neutral-950 md:text-7xl"
          style={{ fontFamily: SERIF }}
        >
          Crafted with care.
          <br />
          <span className="text-neutral-400">Served with grace.</span>
        </h2>
        <p className="mx-auto mt-8 max-w-2xl text-lg font-light leading-relaxed text-neutral-600 md:text-xl">
          {data.aboutText}
        </p>
      </div>
      {img && (
        <div className="relative mt-20 w-full overflow-hidden">
          <img src={img} alt="" loading="lazy" className="h-[60vh] w-full object-cover md:h-[70vh]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white to-transparent" />
        </div>
      )}
    </section>
  );
}
