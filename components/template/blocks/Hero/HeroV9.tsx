"use client";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF, normalizeHeroImages } from "@/components/template/blocks/shared";
import { useBooking } from "@/components/booking/BookingContext";

/** v9 — Cinematic Elegant Minimal: edge-to-edge cinematic image, hairline rule, refined typography. */
export function HeroV9({ data }: BlockProps) {
  const imgs = normalizeHeroImages(data.heroImages);
  const hero = imgs[0];
  const { openBooking } = useBooking();
  return (
    <section id="top" className="site-hero-section site-hero-v9 relative min-h-[100svh] w-full overflow-hidden bg-neutral-950 text-white">
      {hero && (
        <img src={hero.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-5xl flex-col items-center justify-end px-6 pb-24 text-center md:pb-32">
        <p className="mb-6 text-[11px] font-light uppercase tracking-[0.55em] text-white/80">{data.businessName}</p>
        <div className="mx-auto h-px w-12 bg-white/40" />
        <h1
          className="hotel-title site-main-title mt-8 text-balance text-5xl font-light leading-[1.05] tracking-tight md:text-7xl"
          style={{ fontFamily: SERIF }}
        >
          {data.heroTitle}
        </h1>
        {data.heroSubtitle && (
          <p className="mx-auto mt-6 max-w-xl text-sm font-light leading-relaxed tracking-wider text-white/85 md:text-base">
            {data.heroSubtitle}
          </p>
        )}
        <button
          type="button"
          onClick={() => openBooking()}
          className="mt-10 inline-flex h-12 items-center justify-center rounded-none border border-white/60 px-10 text-[11px] font-medium uppercase tracking-[0.4em] text-white transition-all hover:bg-white hover:text-neutral-950"
        >
          Reserve
        </button>
      </div>
    </section>
  );
}
