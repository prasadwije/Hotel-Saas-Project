"use client";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF } from "@/components/template/blocks/shared";

/** v6 — Ultra-Minimalist: edge-to-edge horizontal scroller, no chrome. */
export function GalleryV6({ data }: BlockProps) {
  if (!data.galleryImages?.length) return null;
  return (
    <section id="gallery" className="site-gallery-section site-gallery-v6 bg-white py-24 md:py-32">
      <div className="mx-auto mb-12 max-w-6xl px-6">
        <h2 className="hotel-title text-balance text-5xl font-light leading-[0.95] tracking-tight text-neutral-900 md:text-7xl" style={{ fontFamily: SERIF }}>
          A glimpse inside.
        </h2>
      </div>
      <div className="flex snap-x snap-mandatory gap-1 overflow-x-auto pb-4">
        {data.galleryImages.map((src, i) => (
          <div key={src + i} className="aspect-[3/4] w-[80vw] shrink-0 snap-center md:w-[40vw] lg:w-[32vw]">
            <img src={src} alt={`${data.businessName} gallery ${i + 1}`} loading="lazy" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
