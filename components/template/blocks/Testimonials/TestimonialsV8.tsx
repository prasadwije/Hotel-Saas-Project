"use client";
import { Star } from "lucide-react";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF } from "@/components/template/blocks/shared";

/** v8 — Apple Bento & Glassmorphism: glass review tiles in a bento grid. */
export function TestimonialsV8({ data }: BlockProps) {
  if (!data.testimonials?.length) return null;
  return (
    <section className="site-testimonials-section site-testimonials-v8 relative overflow-hidden py-24 md:py-32" style={{ backgroundColor: "color-mix(in oklab, var(--site-primary) 6%, #f5f5f4)" }}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.4em]" style={{ color: "var(--site-primary)" }}>Reviews</p>
          <h2 className="hotel-title text-4xl font-semibold tracking-tight text-neutral-950 md:text-5xl" style={{ fontFamily: SERIF }}>Words from our guests</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {data.testimonials.map((t, i) => {
            const big = i === 0;
            return (
              <figure key={t.author + i} className={`group flex flex-col rounded-[2rem] border border-white/40 bg-white/60 p-7 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] ${big ? "md:col-span-2 md:row-span-2" : ""}`}>
                <div className="mb-4 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4" style={{ color: idx < t.rating ? "var(--site-primary)" : "rgb(229 229 229)", fill: idx < t.rating ? "var(--site-primary)" : "transparent" }} />
                  ))}
                </div>
                <blockquote className={`flex-1 font-light leading-relaxed text-neutral-800 ${big ? "text-2xl md:text-3xl" : "text-base"}`} style={{ fontFamily: SERIF }}>“{t.text}”</blockquote>
                <figcaption className="mt-6 text-xs font-medium uppercase tracking-[0.25em] text-neutral-500">— {t.author}</figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
