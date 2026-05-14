"use client";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF, normalizeHeroImages } from "@/components/template/blocks/shared";
import { useBooking } from "@/components/booking/BookingContext";

/** v4 — Bento/Grid: copy block + image tiles arranged as a structured bento. */
export function HeroV4({ data }: BlockProps) {
  const imgs = normalizeHeroImages(data.heroImages);
  const { openBooking } = useBooking();
  const tiles = [imgs[0], imgs[1] ?? imgs[0], imgs[2] ?? imgs[0]].filter(Boolean);
  return (
    <section
      id="top"
      className="site-hero-section site-hero-v4 relative overflow-hidden bg-white py-24 md:py-32"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-6 md:grid-cols-3 md:grid-rows-2 md:gap-5">
        <div className="rounded-3xl bg-neutral-50 p-8 ring-1 ring-black/5 md:col-span-2 md:row-span-2 md:p-14">
          <p className="mb-5 text-xs uppercase tracking-[0.4em]" style={{ color: "var(--site-primary)" }}>
            {data.businessName}
          </p>
          <h1
            className="hotel-title site-main-title text-balance text-5xl font-light leading-[1.02] tracking-tight text-neutral-900 md:text-7xl"
            style={{ fontFamily: SERIF }}
          >
            {data.heroTitle}
          </h1>
          {data.heroSubtitle && (
            <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-neutral-600 md:text-lg">
              {data.heroSubtitle}
            </p>
          )}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => openBooking()}
              className="inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-medium text-white shadow transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: "var(--site-primary)" }}
            >
              Reserve
            </button>
            <a href="#rooms" className="inline-flex h-12 items-center justify-center rounded-full border border-neutral-300 bg-white px-8 text-sm font-medium text-neutral-900 hover:bg-neutral-50">
              Discover
            </a>
          </div>
        </div>
        {tiles[0] && (
          <div className="overflow-hidden rounded-3xl ring-1 ring-black/5">
            <img src={tiles[0].url} alt="" className="h-56 w-full object-cover md:h-full" />
          </div>
        )}
        {tiles[1] && (
          <div className="overflow-hidden rounded-3xl ring-1 ring-black/5">
            <img src={tiles[1].url} alt="" className="h-56 w-full object-cover md:h-full" />
          </div>
        )}
      </div>
    </section>
  );
}
