"use client";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF } from "@/components/template/blocks/shared";

/** v6 — Ultra-Minimalist: massive single quote, paginated by simple dot nav (static first review). */
export function TestimonialsV6({ data }: BlockProps) {
  if (!data.testimonials?.length) return null;
  return (
    <section className="site-testimonials-section site-testimonials-v6 bg-white py-32 md:py-44">
      <div className="mx-auto max-w-5xl px-6">
        <div className="space-y-24">
          {data.testimonials.map((t, i) => (
            <figure key={t.author + i} className="text-center">
              <blockquote className="text-balance text-3xl font-light leading-[1.2] tracking-tight text-neutral-900 md:text-5xl" style={{ fontFamily: SERIF }}>
                “{t.text}”
              </blockquote>
              <figcaption className="mt-8 text-xs uppercase tracking-[0.4em] text-neutral-500">— {t.author}</figcaption>
              {i < data.testimonials!.length - 1 && (
                <div className="mx-auto mt-16 h-px w-12 bg-neutral-200" />
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
