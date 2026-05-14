"use client";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF } from "@/components/template/blocks/shared";

/** v9 — Cinematic Elegant Minimal: hairline-divided massive quotes. */
export function TestimonialsV9({ data }: BlockProps) {
  if (!data.testimonials?.length) return null;
  return (
    <section className="site-testimonials-section site-testimonials-v9 bg-white py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <p className="text-[11px] font-light uppercase tracking-[0.55em]" style={{ color: "var(--site-primary)" }}>Reviews</p>
          <div className="mx-auto mt-6 h-px w-12 bg-neutral-300" />
        </div>
        <div className="mt-20 divide-y divide-neutral-200 border-y border-neutral-200">
          {data.testimonials.map((t, i) => (
            <figure key={t.author + i} className="py-16 text-center md:py-20">
              <blockquote className="text-balance text-2xl font-light leading-[1.25] tracking-tight text-neutral-900 md:text-4xl" style={{ fontFamily: SERIF }}>
                “{t.text}”
              </blockquote>
              <figcaption className="mt-8 text-[11px] font-light uppercase tracking-[0.45em] text-neutral-500">— {t.author}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
