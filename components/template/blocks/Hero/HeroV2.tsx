"use client";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF } from "@/components/template/blocks/shared";
import { HeroSlider } from "./HeroSlider";

export function HeroV2({ data }: BlockProps) {
  return (
    <section
      id="top"
      className="site-hero-section site-hero-v2 relative grid min-h-[92vh] grid-cols-1 overflow-hidden bg-neutral-50 md:grid-cols-2"
    >
      <div className="relative flex items-center px-6 py-24 md:px-16 md:py-0">
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-60" style={{ background: "radial-gradient(circle at 20% 20%, color-mix(in oklab, var(--site-primary) 14%, transparent), transparent 60%)" }} />
        <div className="mx-auto max-w-xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--site-primary)" }} />
            <p className="site-hero-eyebrow text-[10px] uppercase tracking-[0.4em] text-neutral-700">{data.businessName}</p>
          </div>
          <h1 className="hotel-title site-main-title text-balance text-5xl font-light leading-[1.02] tracking-tight text-neutral-900 md:text-7xl" style={{ fontFamily: SERIF }}>
            {data.heroTitle}
          </h1>
          {data.heroSubtitle && (
            <p className="site-hero-subtitle mt-7 max-w-lg text-base font-light leading-relaxed text-neutral-600 md:text-lg">{data.heroSubtitle}</p>
          )}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="#menu"
              className="site-primary-btn group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full px-8 text-sm font-medium tracking-wide text-white shadow-[0_12px_30px_-10px_color-mix(in_oklab,var(--site-primary)_70%,black)] ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-10px_color-mix(in_oklab,var(--site-primary)_85%,black)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--site-primary)]/60"
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
              className="site-secondary-btn inline-flex h-12 items-center justify-center rounded-full border border-neutral-300 bg-white px-8 text-sm font-medium tracking-wide text-neutral-900 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-400 hover:bg-neutral-50 hover:shadow-md active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
            >
              Find Us
            </a>
          </div>
        </div>
      </div>
      <div className="relative min-h-[50vh] md:min-h-0">
        <HeroSlider
          images={data.heroImages ?? []}
          alt={data.businessName}
          transition={data.heroTransition ?? "fade"}
          overlay={
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-neutral-50/40 md:to-neutral-50/0" />
          }
        />
      </div>
    </section>
  );
}
