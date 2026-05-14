"use client";
import { Star } from "lucide-react";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SectionHeader, SERIF } from "@/components/template/blocks/shared";

// V2 — Masonry grid via CSS columns
export function TestimonialsV2({ data }: BlockProps) {
  if (!data.testimonials?.length) return null;
  return (
    <section className="site-testimonials-section site-testimonials-v2 bg-neutral-50 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader eyebrow="Reviews" title="Words from our guests" rule={false} />
        <div className="site-testimonials-masonry columns-1 gap-6 sm:columns-2 lg:columns-3 [column-fill:_balance]">
          {data.testimonials.map((t, i) => (
            <figure key={t.author + i} className="site-testimonial-card mb-6 inline-block w-full break-inside-avoid rounded-3xl bg-white p-7 shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-lg">
              <div className="mb-4 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} className="h-4 w-4" style={{ color: idx < t.rating ? "var(--site-primary)" : "rgb(229 229 229)", fill: idx < t.rating ? "var(--site-primary)" : "transparent" }} />
                ))}
              </div>
              <blockquote className="site-testimonial-quote text-lg font-light leading-relaxed text-neutral-800" style={{ fontFamily: SERIF }}>
                “{t.text}”
              </blockquote>
              <figcaption className="mt-5 border-t border-neutral-100 pt-4 text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">— {t.author}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
