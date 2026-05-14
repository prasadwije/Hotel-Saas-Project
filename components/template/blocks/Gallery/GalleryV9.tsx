"use client";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF } from "@/components/template/blocks/shared";

/** v9 — Cinematic Elegant Minimal: edge-to-edge cinematic gallery with hairline gutters. */
export function GalleryV9({ data }: BlockProps) {
  if (!data.galleryImages?.length) return null;
  return (
    <section id="gallery" className="site-gallery-section site-gallery-v9 bg-white">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center md:py-32">
        <p className="text-[11px] font-light uppercase tracking-[0.55em]" style={{ color: "var(--site-primary)" }}>Gallery</p>
        <div className="mx-auto mt-6 h-px w-12 bg-neutral-300" />
        <h2 className="hotel-title mt-8 text-4xl font-light tracking-tight text-neutral-950 md:text-6xl" style={{ fontFamily: SERIF }}>
          A glimpse inside.
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-px bg-neutral-200 md:grid-cols-2">
        {data.galleryImages.map((src, i) => (
          <div key={src + i} className={`group relative overflow-hidden bg-white ${i === 0 ? "md:col-span-2" : ""}`}>
            <img src={src} alt={`${data.businessName} ${i + 1}`} loading="lazy" className={`w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] ${i === 0 ? "h-[80vh]" : "h-[60vh]"}`} />
          </div>
        ))}
      </div>
    </section>
  );
}
