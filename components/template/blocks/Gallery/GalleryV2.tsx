"use client";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF } from "@/components/template/blocks/shared";

export function GalleryV2({ data }: BlockProps) {
  if (!data.galleryImages?.length) return null;
  const images = data.galleryImages;
  return (
    <section id="gallery" className="site-gallery-section site-gallery-v2 overflow-hidden bg-neutral-950 py-24 text-white md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.35em]" style={{ color: "var(--site-primary)" }}>Gallery</p>
          <h2 className="hotel-title text-4xl font-light tracking-tight md:text-5xl" style={{ fontFamily: SERIF }}>A glimpse inside</h2>
        </div>
      </div>
      <div className="site-carousel-scroller flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-6 md:gap-6 md:px-12">
        {images.map((src, i) => (
          <figure key={src + i} className="site-gallery-slide group relative aspect-[4/5] w-[78%] shrink-0 snap-center overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10 md:aspect-[16/10] md:w-[72%]">
            <img src={src} alt={`${data.businessName} gallery ${i + 1}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <figcaption className="absolute bottom-5 left-6 text-[10px] uppercase tracking-[0.4em] text-white/80">
              {String(i + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-white/50">
        <span className="h-px w-6 bg-white/30" />Swipe<span aria-hidden>→</span><span className="h-px w-6 bg-white/30" />
      </div>
    </section>
  );
}
