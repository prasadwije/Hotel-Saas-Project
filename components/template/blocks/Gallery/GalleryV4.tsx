"use client";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF } from "@/components/template/blocks/shared";

/** v4 — Editorial Magazine: asymmetrical layout with massive type and offset images. */
export function GalleryV4({ data }: BlockProps) {
  if (!data.galleryImages?.length) return null;
  const imgs = data.galleryImages;
  return (
    <section id="gallery" className="site-gallery-section site-gallery-v4 bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-end gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="mb-3 text-xs uppercase tracking-[0.4em]" style={{ color: "var(--site-primary)" }}>Issue 01 — Gallery</p>
            <h2 className="hotel-title text-balance text-6xl font-light leading-[0.95] tracking-tight text-neutral-900 md:text-8xl" style={{ fontFamily: SERIF }}>
              A glimpse <em className="not-italic" style={{ color: "var(--site-primary)" }}>inside</em>.
            </h2>
          </div>
          {imgs[0] && (
            <div className="md:col-span-7 md:-mt-16">
              <img src={imgs[0]} alt="" loading="lazy" className="aspect-[4/3] w-full rounded-sm object-cover shadow-xl" />
            </div>
          )}
        </div>
        <div className="mt-12 grid grid-cols-12 gap-6">
          {imgs.slice(1).map((src, i) => {
            const layouts = [
              "col-span-12 md:col-span-5",
              "col-span-12 md:col-span-7 md:mt-20",
              "col-span-12 md:col-span-8",
              "col-span-12 md:col-span-4 md:mt-24",
            ];
            return (
              <div key={src + i} className={layouts[i % layouts.length]}>
                <img src={src} alt="" loading="lazy" className="aspect-[4/3] w-full rounded-sm object-cover shadow-md" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
