"use client";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF } from "@/components/template/blocks/shared";

/** v7 — Apple Product Page: huge title + edge-to-edge image strip. */
export function GalleryV7({ data }: BlockProps) {
  if (!data.galleryImages?.length) return null;
  return (
    <section id="gallery" className="site-gallery-section site-gallery-v7 bg-white py-32 md:py-44">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <p className="mb-6 text-xs font-medium uppercase tracking-[0.4em] text-neutral-500">Gallery</p>
        <h2 className="hotel-title text-balance text-5xl font-semibold leading-[0.95] tracking-tight text-neutral-950 md:text-7xl" style={{ fontFamily: SERIF }}>
          A glimpse inside.
        </h2>
      </div>
      <div className="mt-20 grid grid-cols-1 gap-1 md:grid-cols-3">
        {data.galleryImages.map((src, i) => (
          <div key={src + i} className="group relative aspect-[4/5] overflow-hidden bg-neutral-100">
            <img src={src} alt={`${data.businessName} ${i + 1}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
          </div>
        ))}
      </div>
    </section>
  );
}
