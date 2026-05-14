"use client";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF } from "@/components/template/blocks/shared";

/** v10 — Floating Layered Editorial: hero image with floating gallery card overlap. */
export function GalleryV10({ data }: BlockProps) {
  if (!data.galleryImages?.length) return null;
  const [first, ...rest] = data.galleryImages;
  return (
    <section id="gallery" className="site-gallery-section site-gallery-v10 bg-neutral-50 pb-24 md:pb-32">
      <div className="relative h-[55vh] w-full md:h-[70vh]">
        <img src={first} alt={`${data.businessName} cover`} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/20" />
      </div>
      <div className="relative z-10 mx-auto -mt-32 max-w-6xl px-4 md:-mt-44 md:px-6">
        <div className="rounded-sm bg-white p-6 shadow-2xl shadow-neutral-950/15 md:p-10">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.45em]" style={{ color: "var(--site-primary)" }}>Gallery</p>
              <h2 className="hotel-title mt-3 text-3xl font-light tracking-tight text-neutral-950 md:text-4xl" style={{ fontFamily: SERIF }}>A glimpse inside</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {(rest.length ? rest : [first]).map((src, i) => (
              <div key={src + i} className="group relative aspect-[4/5] overflow-hidden bg-neutral-100">
                <img src={src} alt={`${data.businessName} ${i + 1}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
