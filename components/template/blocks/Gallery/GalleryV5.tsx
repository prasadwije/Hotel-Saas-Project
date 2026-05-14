"use client";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SectionHeader } from "@/components/template/blocks/shared";

/** v5 — Trendy Bento Box: rounded card grid with structured varied tile sizes. */
export function GalleryV5({ data }: BlockProps) {
  if (!data.galleryImages?.length) return null;
  return (
    <section id="gallery" className="site-gallery-section site-gallery-v5 bg-neutral-100 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader eyebrow="Gallery" title="A glimpse inside" rule={false} />
        <div className="grid auto-rows-[160px] grid-cols-2 gap-4 md:auto-rows-[200px] md:grid-cols-4">
          {data.galleryImages.map((src, i) => {
            const spans = ["col-span-2 row-span-2", "col-span-1", "col-span-1 row-span-2", "col-span-2", "col-span-1", "col-span-1"];
            const span = spans[i % spans.length];
            return (
              <div key={src + i} className={`overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-black/5 ${span}`}>
                <img src={src} alt={`${data.businessName} gallery ${i + 1}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
