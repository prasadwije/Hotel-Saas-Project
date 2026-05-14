"use client";
import type { BlockProps } from "@/components/template/blocks/shared";

export function TrustBadgesV2({ data }: BlockProps) {
  if (!data.trustBadges?.length) return null;
  return (
    <section className="site-trust-section site-trust-v2 bg-neutral-50 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-10 text-center text-[10px] uppercase tracking-[0.35em]" style={{ color: "var(--site-primary)" }}>Awards & recognition</p>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {data.trustBadges.map((src, i) => (
            <div key={src + i} className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-20 w-full items-center justify-center rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                <img src={src} alt={`Award ${i + 1}`} loading="lazy" className="max-h-full max-w-full object-contain" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-500">Recognition #{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}