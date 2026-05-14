"use client";
import { Star } from "lucide-react";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SectionHeader, SERIF } from "@/components/template/blocks/shared";

/** v5 — Trendy Bento Box: rounded card grid with varying tile sizes. */
export function TestimonialsV5({ data }: BlockProps) {
  if (!data.testimonials?.length) return null;
  return (
    <section className="site-testimonials-section site-testimonials-v5 bg-neutral-100 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader eyebrow="Reviews" title="Words from our guests" rule={false} />
        <div className="grid auto-rows-[1fr] grid-cols-1 gap-5 md:grid-cols-3">
          {data.testimonials.map((t, i) => {
            const big = i === 0;
            return (
              <figure key={t.author + i} className={`flex flex-col rounded-3xl bg-white p-7 shadow-md ring-1 ring-black/5 ${big ? "md:col-span-2 md:row-span-2" : ""}`}>
                <div className="mb-4 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4" style={{ color: idx < t.rating ? "var(--site-primary)" : "rgb(229 229 229)", fill: idx < t.rating ? "var(--site-primary)" : "transparent" }} />
                  ))}
                </div>
                <blockquote className={`flex-1 font-light leading-relaxed text-neutral-800 ${big ? "text-2xl md:text-3xl" : "text-base"}`} style={{ fontFamily: SERIF }}>“{t.text}”</blockquote>
                <figcaption className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">— {t.author}</figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
