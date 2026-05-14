import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF, firstHeroImage } from "@/components/template/blocks/shared";

/** v8 — Apple Bento & Glassmorphism: glass card grid over an ambient backdrop. */
export function AboutV8({ data }: BlockProps) {
  const img = data.galleryImages?.[0] ?? firstHeroImage(data);
  return (
    <section id="about" className="site-about-section site-about-v8 relative overflow-hidden py-24 md:py-32" style={{ backgroundColor: "color-mix(in oklab, var(--site-primary) 6%, #f5f5f4)" }}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-5 md:grid-cols-5">
          <div className="group relative overflow-hidden rounded-[2rem] border border-white/40 bg-white/60 p-10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.25)] md:col-span-3 md:p-14">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.4em]" style={{ color: "var(--site-primary)" }}>Our Story</p>
            <h2 className="hotel-title text-4xl font-semibold leading-[1.05] tracking-tight text-neutral-950 md:text-5xl" style={{ fontFamily: SERIF }}>
              Crafted with care.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-neutral-700 md:text-lg">{data.aboutText}</p>
          </div>
          <div className="group relative overflow-hidden rounded-[2rem] border border-white/40 bg-white/60 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.25)] md:col-span-2 min-h-[300px]">
            {img && <img src={img} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />}
          </div>
        </div>
      </div>
    </section>
  );
}
