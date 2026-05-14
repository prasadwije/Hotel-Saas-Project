"use client";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF } from "@/components/template/blocks/shared";
import { HeroSlider } from "./HeroSlider";

export function HeroV1({ data }: BlockProps) {
  return (
    <section
      id="top"
      className="site-hero-section site-hero-v1 relative flex min-h-[92vh] items-center justify-center overflow-hidden"
    >
      <HeroSlider
        images={data.heroImages ?? []}
        alt={data.businessName}
        transition={data.heroTransition ?? "fade"}
        overlay={
          <>
            {/* Adaptive blend stack — ensures legibility over any background image */}
            <div className="site-hero-overlay absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/75" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.45)_100%)]" />
            <div className="absolute inset-0 bg-black/10 [mix-blend-mode:multiply]" />
          </>
        }
      />
      <div className="absolute top-24 right-5 z-10 hidden md:block">
        <div className="site-booking-badge rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/70 [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]">Now Booking</p>
          <p className="mt-1 text-sm font-light [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]">Spring · Summer 2026</p>
        </div>
      </div>
      <div className="relative z-10 mx-auto w-full max-w-3xl px-6 text-center">
        <div className="site-hero-card mx-auto px-8 py-12 text-white md:px-14 md:py-16">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)] backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--site-primary)" }} />
            <p className="site-hero-eyebrow text-[10px] uppercase tracking-[0.4em] text-white/90 [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]">{data.businessName}</p>
          </div>
          <h1 className="hotel-title site-main-title text-balance text-5xl font-light leading-[1.02] tracking-tight [text-shadow:0_2px_24px_rgba(0,0,0,0.55),0_1px_2px_rgba(0,0,0,0.45)] md:text-7xl" style={{ fontFamily: SERIF }}>
            {data.heroTitle}
          </h1>
          {data.heroSubtitle && (
            <p className="site-hero-subtitle mx-auto mt-7 max-w-xl text-base font-light leading-relaxed text-white/90 [text-shadow:0_1px_12px_rgba(0,0,0,0.5),0_1px_2px_rgba(0,0,0,0.4)] md:text-lg">{data.heroSubtitle}</p>
          )}
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#menu"
              className="site-primary-btn group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full px-8 text-sm font-medium tracking-wide text-white shadow-[0_12px_30px_-10px_color-mix(in_oklab,var(--site-primary)_70%,black)] ring-1 ring-white/15 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-10px_color-mix(in_oklab,var(--site-primary)_85%,black)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, color-mix(in oklab, var(--site-primary) 92%, white) 0%, var(--site-primary) 55%, color-mix(in oklab, var(--site-primary) 80%, black) 100%)",
              }}
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">View Menu</span>
            </a>
            <a
              href="#location"
              className="site-secondary-btn inline-flex h-12 items-center justify-center rounded-full border border-white/35 bg-white/10 px-8 text-sm font-medium tracking-wide text-white shadow-[0_8px_24px_-12px_rgba(0,0,0,0.7)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/55 hover:bg-white/20 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              Find Us
            </a>
          </div>
        </div>
        <div className="mt-10 flex items-center justify-center gap-2 text-white/80 [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
          <span className="h-px w-8 bg-white/50" />
          <span className="text-[10px] uppercase tracking-[0.4em]">Scroll</span>
          <span className="h-px w-8 bg-white/50" />
        </div>
      </div>
    </section>
  );
}
