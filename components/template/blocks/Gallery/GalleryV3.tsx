"use client";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF } from "@/components/template/blocks/shared";

/** v3 — Ultra-Luxury Dark: dark backdrop, gold-accented frames. */
export function GalleryV3({ data }: BlockProps) {
  if (!data.galleryImages?.length) return null;
  return (
    <section id="gallery" className="site-gallery-section site-gallery-v3 bg-neutral-950 py-24 text-white md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.4em]" style={{ color: "var(--site-primary)" }}>Gallery</p>
          <h2 className="hotel-title text-4xl font-light tracking-tight md:text-5xl" style={{ fontFamily: SERIF }}>A glimpse inside</h2>
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
          {data.galleryImages.map((src, i) => (
            <div key={src + i} className="group relative overflow-hidden rounded-xl ring-1 ring-white/10">
              <img src={src} alt={`${data.businessName} gallery ${i + 1}`} loading="lazy" className="aspect-square h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
