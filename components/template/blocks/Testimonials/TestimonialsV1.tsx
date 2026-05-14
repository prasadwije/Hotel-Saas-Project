"use client";
import { Star } from "lucide-react";
import type { BlockProps } from "@/components/template/blocks/shared";
import { CarouselHint, SectionHeader, SERIF, layoutClasses } from "@/components/template/blocks/shared";

// V1 — Horizontal peek-effect slider (forces carousel on mobile, grid on desktop)
export function TestimonialsV1({ data }: BlockProps) {
  if (!data.testimonials?.length) return null;
  const layout = layoutClasses(data.mobileLayouts?.testimonials ?? "carousel", "md:grid-cols-3", "gap-6 md:gap-8");
  return (
    <section className="site-testimonials-section site-testimonials-v1 bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader eyebrow="Reviews" title="Words from our guests" rule={false} />
        <div className={`site-testimonials-grid ${layout.container}`}>
          {data.testimonials.map((t, i) => (
            <figure key={t.author + i} className={`site-testimonial-card flex flex-col rounded-3xl bg-white p-8 shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-xl ${layout.item}`}>
              <div className="mb-5 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} className="h-4 w-4" style={{ color: idx < t.rating ? "var(--site-primary)" : "rgb(229 229 229)", fill: idx < t.rating ? "var(--site-primary)" : "transparent" }} />
                ))}
              </div>
              <blockquote className="site-testimonial-quote flex-1 text-xl font-light leading-relaxed text-neutral-800" style={{ fontFamily: SERIF }}>
                “{t.text}”
              </blockquote>
              <figcaption className="mt-6 border-t border-neutral-100 pt-5 text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">— {t.author}</figcaption>
            </figure>
          ))}
        </div>
        {layout.isCarousel && <CarouselHint />}
      </div>
    </section>
  );
}
