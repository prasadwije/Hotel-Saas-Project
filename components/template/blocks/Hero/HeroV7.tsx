"use client";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF, normalizeHeroImages } from "@/components/template/blocks/shared";
import { useBooking } from "@/components/booking/BookingContext";

/** v7 — Apple Product Page: edge-to-edge image, massive type, soft gradient mask. */
export function HeroV7({ data }: BlockProps) {
  const imgs = normalizeHeroImages(data.heroImages);
  const hero = imgs[0];
  const { openBooking } = useBooking();
  return (
    <section id="top" className="site-hero-section site-hero-v7 relative min-h-[100svh] w-full overflow-hidden bg-white text-neutral-900">
      {hero && (
        <img
          src={hero.url}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-white via-white/70 to-transparent" />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-5xl flex-col items-center justify-start px-6 pt-32 text-center md:pt-40">
        <p className="mb-5 text-xs font-medium uppercase tracking-[0.4em] text-neutral-500">{data.businessName}</p>
        <h1
          className="hotel-title site-main-title text-balance text-6xl font-semibold leading-[0.95] tracking-tight text-neutral-950 md:text-8xl"
          style={{ fontFamily: SERIF }}
        >
          {data.heroTitle}
        </h1>
        {data.heroSubtitle && (
          <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-neutral-700 md:text-xl">
            {data.heroSubtitle}
          </p>
        )}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => openBooking()}
            className="inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-medium text-white shadow-sm transition-all hover:scale-[1.03]"
            style={{ backgroundColor: "var(--site-primary)" }}
          >
            Reserve
          </button>
          <a
            href="#about"
            className="inline-flex h-12 items-center justify-center rounded-full border border-neutral-300 bg-white/80 px-8 text-sm font-medium text-neutral-900 backdrop-blur transition-all hover:bg-white"
          >
            Learn more →
          </a>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white via-white/60 to-transparent" />
    </section>
  );
}
