"use client";
import { Star } from "lucide-react";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF } from "@/components/template/blocks/shared";

/** v4 — Editorial Magazine: huge pull-quote with stacked supporting reviews. */
export function TestimonialsV4({ data }: BlockProps) {
  if (!data.testimonials?.length) return null;
  const [feature, ...rest] = data.testimonials;
  return (
    <section className="site-testimonials-section site-testimonials-v4 bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-3 text-xs uppercase tracking-[0.4em]" style={{ color: "var(--site-primary)" }}>Press · Guests · Critics</p>
        <blockquote className="text-balance text-5xl font-light leading-[1.05] tracking-tight text-neutral-900 md:text-7xl" style={{ fontFamily: SERIF }}>
          “{feature.text}”
        </blockquote>
        <p className="mt-6 text-sm uppercase tracking-[0.25em] text-neutral-500">— {feature.author}</p>
        {rest.length > 0 && (
          <div className="mt-16 grid gap-10 border-t border-neutral-200 pt-12 md:grid-cols-3 md:gap-12">
            {rest.map((t, i) => (
              <figure key={t.author + i}>
                <div className="mb-3 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="h-3.5 w-3.5" style={{ color: idx < t.rating ? "var(--site-primary)" : "rgb(229 229 229)", fill: idx < t.rating ? "var(--site-primary)" : "transparent" }} />
                  ))}
                </div>
                <blockquote className="text-base leading-relaxed text-neutral-700">“{t.text}”</blockquote>
                <figcaption className="mt-4 text-xs uppercase tracking-[0.2em] text-neutral-500">— {t.author}</figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
