"use client";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF, firstHeroImage } from "@/components/template/blocks/shared";
import { useBooking } from "@/components/booking/BookingContext";

/** v3 — Split & Overlapping: asymmetrical 60/40 split with image overlapping the copy card. */
export function HeroV3({ data }: BlockProps) {
  const img = firstHeroImage(data);
  const { openBooking } = useBooking();
  return (
    <section
      id="top"
      className="site-hero-section site-hero-v3 relative overflow-hidden bg-neutral-50"
    >
      <div className="mx-auto grid min-h-[92vh] max-w-7xl grid-cols-1 items-center gap-10 px-6 py-24 md:grid-cols-12 md:gap-0 md:py-0">
        <div className="relative z-10 md:col-span-7 md:py-32">
          <div
            className="rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-black/5 md:-mr-24 md:p-14"
          >
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
              <p className="site-hero-subtitle mt-7 max-w-lg text-base font-light leading-relaxed text-neutral-600 md:text-lg">
                {data.heroSubtitle}
              </p>
            )}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => openBooking()}
                className="site-primary-btn inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-medium text-white shadow-lg transition-transform hover:scale-[1.02]"
                style={{ backgroundColor: "var(--site-primary)" }}
              >
                Reserve Now
              </button>
              <a
                href="#rooms"
                className="site-secondary-btn inline-flex h-12 items-center justify-center rounded-full border border-neutral-300 bg-white px-8 text-sm font-medium tracking-wide text-neutral-900 transition-all hover:border-neutral-400"
              >
                Explore Rooms
              </a>
            </div>
          </div>
        </div>
        <div className="relative md:col-span-5 md:h-screen">
          <div className="absolute inset-0 -z-10 hidden md:block" style={{ background: "linear-gradient(135deg, color-mix(in oklab, var(--site-primary) 18%, transparent), transparent)" }} />
          {img ? (
            <img
              src={img}
              alt={data.businessName}
              className="h-[60vh] w-full rounded-3xl object-cover shadow-2xl ring-1 ring-black/5 md:h-screen md:rounded-none"
              loading="eager"
            />
          ) : (
            <div className="h-[60vh] w-full bg-neutral-200 md:h-screen" />
          )}
        </div>
      </div>
    </section>
  );
}
