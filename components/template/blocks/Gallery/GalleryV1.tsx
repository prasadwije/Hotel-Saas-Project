"use client";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SectionHeader, isPageEnabled, useIsDedicatedPage } from "@/components/template/blocks/shared";
import { ReadMoreCTA } from "@/components/template/ReadMoreCTA";

export function GalleryV1({ data }: BlockProps) {
  if (!data.galleryImages?.length) return null;
  const truncate = isPageEnabled(data, "gallery") && !useIsDedicatedPage("gallery");
  const images = truncate ? data.galleryImages.slice(0, 6) : data.galleryImages;
  return (
    <section id="gallery" className="site-gallery-section site-gallery-v1 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader eyebrow="Gallery" title="A glimpse inside" rule={false} />
        <div className="site-gallery-grid grid auto-rows-[140px] grid-cols-2 gap-3 md:auto-rows-[180px] md:grid-cols-4 md:gap-4">
          {images.map((src, i) => {
            const spans = ["col-span-2 row-span-2", "col-span-1 row-span-1", "col-span-1 row-span-2", "col-span-2 row-span-1", "col-span-1 row-span-1", "col-span-1 row-span-1"];
            const span = spans[i % spans.length];
            return (
              <div key={src + i} className={`site-gallery-item group relative overflow-hidden rounded-2xl bg-neutral-100 shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-xl ${span}`}>
                <img src={src} alt={`${data.businessName} gallery ${i + 1}`} loading="lazy" className="site-gallery-image h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            );
          })}
        </div>
        <div className="mt-10 flex justify-center">
          <ReadMoreCTA data={data} sectionKey="gallery" label="View full gallery" />
        </div>
      </div>
    </section>
  );
}
