import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF, firstHeroImage } from "@/components/template/blocks/shared";
import { useBooking } from "@/components/booking/BookingContext";

/** v5 — Centered & Spacious: large centered text above an edge-to-edge image. */
export function HeroV5({ data }: BlockProps) {
  const img = firstHeroImage(data);
  const { openBooking } = useBooking();
  return (
    <section id="top" className="site-hero-section site-hero-v5 bg-white">
      <div className="mx-auto max-w-4xl px-6 pb-16 pt-32 text-center md:pb-24 md:pt-44">
        <p className="mb-6 text-xs uppercase tracking-[0.5em]" style={{ color: "var(--site-primary)" }}>
          {data.businessName}
        </p>
        <h1
          className="hotel-title site-main-title text-balance text-5xl font-light leading-[1.02] tracking-tight text-neutral-900 md:text-8xl"
          style={{ fontFamily: SERIF }}
        >
          {data.heroTitle}
        </h1>
        <div className="mx-auto my-10 h-px w-16" style={{ backgroundColor: "var(--site-primary)" }} />
        {data.heroSubtitle && (
          <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-neutral-600 md:text-xl">
            {data.heroSubtitle}
          </p>
        )}
        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => openBooking()}
            className="inline-flex h-12 items-center justify-center rounded-full px-10 text-sm font-medium text-white shadow transition-transform hover:scale-[1.02]"
            style={{ backgroundColor: "var(--site-primary)" }}
          >
            Reserve a Stay
          </button>
        </div>
      </div>
      {img ? (
        <div className="w-full">
          <img src={img} alt={data.businessName} className="h-[70vh] w-full object-cover" loading="eager" />
        </div>
      ) : (
        <div className="h-[60vh] w-full bg-neutral-100" />
      )}
    </section>
  );
}
