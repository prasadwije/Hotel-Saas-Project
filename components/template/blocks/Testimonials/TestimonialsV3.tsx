"use client";
import { Star, Quote } from "lucide-react";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF } from "@/components/template/blocks/shared";

/** v3 — Ultra-Luxury Dark: a single rotating-style spotlight on dark backdrop. */
export function TestimonialsV3({ data }: BlockProps) {
  if (!data.testimonials?.length) return null;
  return (
    <section className="site-testimonials-section site-testimonials-v3 bg-neutral-950 py-24 text-white md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.4em]" style={{ color: "var(--site-primary)" }}>Reviews</p>
          <h2 className="hotel-title text-4xl font-light tracking-tight md:text-5xl" style={{ fontFamily: SERIF }}>Words from our guests</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {data.testimonials.map((t, i) => (
            <figure key={t.author + i} className="relative rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur">
              <Quote className="absolute right-6 top-6 h-8 w-8 opacity-20" style={{ color: "var(--site-primary)" }} />
              <div className="mb-5 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} className="h-4 w-4" style={{ color: idx < t.rating ? "var(--site-primary)" : "rgba(255,255,255,0.2)", fill: idx < t.rating ? "var(--site-primary)" : "transparent" }} />
                ))}
              </div>
              <blockquote className="text-xl font-light leading-relaxed text-white/90" style={{ fontFamily: SERIF }}>“{t.text}”</blockquote>
              <figcaption className="mt-6 text-xs font-medium uppercase tracking-[0.25em] text-white/50">— {t.author}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
