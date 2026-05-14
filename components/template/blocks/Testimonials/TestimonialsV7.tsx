"use client";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF } from "@/components/template/blocks/shared";

/** v7 — Apple Product Page: massive single quote per row, immense whitespace. */
export function TestimonialsV7({ data }: BlockProps) {
  if (!data.testimonials?.length) return null;
  return (
    <section className="site-testimonials-section site-testimonials-v7 bg-white py-32 md:py-44">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="mb-6 text-xs font-medium uppercase tracking-[0.4em] text-neutral-500">Reviews</p>
        <h2 className="hotel-title text-balance text-5xl font-semibold leading-[0.95] tracking-tight text-neutral-950 md:text-7xl" style={{ fontFamily: SERIF }}>
          Loved by guests.
        </h2>
        <div className="mt-20 space-y-20">
          {data.testimonials.map((t, i) => (
            <figure key={t.author + i}>
              <blockquote className="text-balance text-3xl font-light leading-[1.2] tracking-tight text-neutral-800 md:text-5xl" style={{ fontFamily: SERIF }}>
                “{t.text}”
              </blockquote>
              <figcaption className="mt-6 text-xs font-medium uppercase tracking-[0.35em] text-neutral-500">— {t.author}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
