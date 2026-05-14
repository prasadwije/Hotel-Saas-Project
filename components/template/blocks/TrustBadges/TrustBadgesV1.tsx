"use client";
import type { BlockProps } from "@/components/template/blocks/shared";

export function TrustBadgesV1({ data }: BlockProps) {
  if (!data.trustBadges?.length) return null;
  return (
    <section className="site-trust-section site-trust-v1 border-y border-neutral-200/70 bg-white py-12">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-6 text-center text-[10px] uppercase tracking-[0.35em] text-neutral-400">As featured in</p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {data.trustBadges.map((src, i) => (
            <img
              key={src + i}
              src={src}
              alt={`Trust badge ${i + 1}`}
              loading="lazy"
              className="h-10 w-auto max-w-[140px] object-contain opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0 md:h-12"
            />
          ))}
        </div>
      </div>
    </section>
  );
}