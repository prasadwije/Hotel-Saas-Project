"use client";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF, normalizeHeroImages } from "@/components/template/blocks/shared";
import { useBooking } from "@/components/booking/BookingContext";

/** v8 — Apple Bento & Glassmorphism: floating glass card over a vivid backdrop image. */
export function HeroV8({ data }: BlockProps) {
  const imgs = normalizeHeroImages(data.heroImages);
  const hero = imgs[0];
  const { openBooking } = useBooking();
  return (
    <section id="top" className="site-hero-section site-hero-v8 relative min-h-[100svh] w-full overflow-hidden bg-neutral-950 text-white">
      {hero && (
        <img src={hero.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
      )}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 100%)" }} />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl items-end px-6 pb-16 pt-32 md:items-center md:pb-0">
        <div className="w-full">
          <div className="group/card relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 p-8 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-500 hover:scale-[1.005] hover:shadow-[0_30px_100px_-20px_rgba(0,0,0,0.7)] md:max-w-2xl md:p-12">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.4em] text-white/70">{data.businessName}</p>
            <h1
              className="hotel-title site-main-title text-balance text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl"
              style={{ fontFamily: SERIF }}
            >
              {data.heroTitle}
            </h1>
            {data.heroSubtitle && (
              <p className="mt-5 max-w-lg text-base font-light leading-relaxed text-white/80 md:text-lg">{data.heroSubtitle}</p>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => openBooking()}
                className="inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-medium text-white shadow-lg transition-all hover:scale-[1.03]"
                style={{ backgroundColor: "var(--site-primary)" }}
              >
                Reserve
              </button>
              <a
                href="#rooms"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 bg-white/10 px-8 text-sm font-medium text-white backdrop-blur transition-all hover:bg-white/20"
              >
                Explore rooms
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
