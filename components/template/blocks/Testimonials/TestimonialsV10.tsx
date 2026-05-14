"use client";
import { Star } from "lucide-react";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF, firstHeroImage } from "@/components/template/blocks/shared";

/** v10 — Floating Layered Editorial: backdrop image with floating solid review card. */
export function TestimonialsV10({ data }: BlockProps) {
  if (!data.testimonials?.length) return null;
  const img = data.galleryImages?.[3] ?? data.galleryImages?.[0] ?? firstHeroImage(data);
  return (
    <section className="site-testimonials-section site-testimonials-v10 bg-neutral-50 pb-24 md:pb-32">
      <div className="relative h-[40vh] w-full md:h-[55vh]">
        {img && <img src={img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-black/30" />
      </div>
      <div className="relative z-10 mx-auto -mt-32 max-w-6xl px-4 md:-mt-44 md:px-6">
        <div className="rounded-sm bg-white p-8 shadow-2xl shadow-neutral-950/15 md:p-14">
          <div className="mb-10 text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.45em]" style={{ color: "var(--site-primary)" }}>Reviews</p>
            <h2 className="hotel-title mt-3 text-3xl font-light tracking-tight text-neutral-950 md:text-5xl" style={{ fontFamily: SERIF }}>Words from our guests</h2>
          </div>
          <div className="grid gap-10 md:grid-cols-2 md:gap-x-14">
            {data.testimonials.map((t, i) => (
              <figure key={t.author + i} className="border-t border-neutral-200 pt-8">
                <div className="mb-4 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4" style={{ color: idx < t.rating ? "var(--site-primary)" : "rgb(229 229 229)", fill: idx < t.rating ? "var(--site-primary)" : "transparent" }} />
                  ))}
                </div>
                <blockquote className="text-lg font-light leading-relaxed text-neutral-800 md:text-xl" style={{ fontFamily: SERIF }}>&ldquo;{t.text}&rdquo;</blockquote>
                <figcaption className="mt-6 text-[11px] font-medium uppercase tracking-[0.3em] text-neutral-500">— {t.author}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
