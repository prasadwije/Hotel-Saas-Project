"use client";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF, normalizeHeroImages } from "@/components/template/blocks/shared";
import { useBooking } from "@/components/booking/BookingContext";

/** v6 — Floating Cards & Sliders: copy card floats above a horizontal image slider. */
export function HeroV6({ data }: BlockProps) {
  const imgs = normalizeHeroImages(data.heroImages);
  const { openBooking } = useBooking();
  return (
    <section id="top" className="site-hero-section site-hero-v6 relative bg-neutral-100 pt-28 pb-24 md:pt-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-black/5 md:p-14">
          <p className="mb-5 text-xs uppercase tracking-[0.4em]" style={{ color: "var(--site-primary)" }}>
            {data.businessName}
          </p>
          <h1 className="hotel-title site-main-title text-balance text-5xl font-light leading-[1.02] tracking-tight text-neutral-900 md:text-7xl" style={{ fontFamily: SERIF }}>
            {data.heroTitle}
          </h1>
          {data.heroSubtitle && (
            <p className="mt-6 max-w-2xl text-base font-light leading-relaxed text-neutral-600 md:text-lg">{data.heroSubtitle}</p>
          )}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => openBooking()}
              className="inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-medium text-white shadow transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: "var(--site-primary)" }}
            >
              Reserve
            </button>
          </div>
        </div>
        {imgs.length > 0 && (
          <div className="-mx-6 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-3 md:mx-0 md:px-0">
            {imgs.map((img, i) => (
              <div key={img.url + i} className="w-[80%] shrink-0 snap-center overflow-hidden rounded-3xl shadow-xl ring-1 ring-black/5 md:w-[60%]">
                <img src={img.url} alt="" className="aspect-[16/10] w-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
