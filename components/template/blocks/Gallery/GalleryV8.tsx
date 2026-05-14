"use client";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF } from "@/components/template/blocks/shared";

/** v8 — Apple Bento & Glassmorphism: rounded glass-framed bento gallery. */
export function GalleryV8({ data }: BlockProps) {
  if (!data.galleryImages?.length) return null;
  return (
    <section id="gallery" className="site-gallery-section site-gallery-v8 relative overflow-hidden py-24 md:py-32" style={{ backgroundColor: "color-mix(in oklab, var(--site-primary) 6%, #f5f5f4)" }}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.4em]" style={{ color: "var(--site-primary)" }}>Gallery</p>
          <h2 className="hotel-title text-4xl font-semibold tracking-tight text-neutral-950 md:text-5xl" style={{ fontFamily: SERIF }}>A glimpse inside</h2>
        </div>
        <div className="grid auto-rows-[160px] grid-cols-2 gap-4 md:auto-rows-[200px] md:grid-cols-4">
          {data.galleryImages.map((src, i) => {
            const spans = ["col-span-2 row-span-2", "col-span-1 row-span-1", "col-span-1 row-span-2", "col-span-2 row-span-1", "col-span-1 row-span-1", "col-span-1 row-span-1"];
            const span = spans[i % spans.length];
            return (
              <div key={src + i} className={`group relative overflow-hidden rounded-[1.5rem] border border-white/40 bg-white/60 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.15)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] ${span}`}>
                <img src={src} alt={`${data.businessName} ${i + 1}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
