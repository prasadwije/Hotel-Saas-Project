"use client";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF, normalizeHeroImages } from "@/components/template/blocks/shared";
import { useBooking } from "@/components/booking/BookingContext";

/** v10 — Floating Layered Editorial: cinematic backdrop with a floating solid card overlapping the image. */
export function HeroV10({ data }: BlockProps) {
  const imgs = normalizeHeroImages(data.heroImages);
  const hero = imgs[0];
  const { openBooking } = useBooking();
  return (
    <section id="top" className="site-hero-section site-hero-v10 relative w-full overflow-hidden bg-white">
      <div className="relative h-[80vh] w-full md:h-[92vh]">
        {hero && (
          <img src={hero.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/25" />
      </div>
      <div className="relative z-10 mx-auto -mt-40 max-w-3xl px-4 md:-mt-56 md:px-0">
        <div className="rounded-sm bg-white p-10 text-center shadow-2xl shadow-neutral-950/15 md:p-16">
          <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.45em]" style={{ color: "var(--site-primary)" }}>{data.businessName}</p>
          <h1 className="hotel-title site-main-title text-balance text-4xl font-light leading-[1.05] tracking-tight text-neutral-950 md:text-6xl" style={{ fontFamily: SERIF }}>
            {data.heroTitle}
          </h1>
          {data.heroSubtitle && (
            <p className="mx-auto mt-6 max-w-lg text-base font-light leading-relaxed tracking-wide text-neutral-600 md:text-lg">
              {data.heroSubtitle}
            </p>
          )}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => openBooking()}
              className="inline-flex h-12 items-center justify-center rounded-full px-9 text-sm font-medium tracking-wide text-white shadow-sm transition-all hover:scale-[1.02]"
              style={{ backgroundColor: "var(--site-primary)" }}
            >
              Reserve
            </button>
            <a
              href="#about"
              className="inline-flex h-12 items-center justify-center rounded-full border border-neutral-200 bg-white px-9 text-sm font-medium tracking-wide text-neutral-900 transition-all hover:bg-neutral-50"
            >
              Discover
            </a>
          </div>
        </div>
      </div>
      <div className="h-24 md:h-32" />
    </section>
  );
}
