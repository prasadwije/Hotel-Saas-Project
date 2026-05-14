"use client";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF, firstHeroImage } from "@/components/template/blocks/shared";

/** v10 — Floating Layered Editorial: backdrop image with floating solid menu card. */
export function MenuV10({ data }: BlockProps) {
  if (!data.menuItems?.length) return null;
  const img = data.galleryImages?.[2] ?? data.galleryImages?.[0] ?? firstHeroImage(data);
  return (
    <section id="menu" className="site-menu-section site-menu-v10 bg-neutral-50 pb-24 md:pb-32">
      <div className="relative h-[40vh] w-full md:h-[55vh]">
        {img && <img src={img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-black/30" />
      </div>
      <div className="relative z-10 mx-auto -mt-32 max-w-4xl px-4 md:-mt-44 md:px-6">
        <div className="rounded-sm bg-white p-8 shadow-2xl shadow-neutral-950/15 md:p-14">
          <div className="text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.45em]" style={{ color: "var(--site-primary)" }}>Menu</p>
            <h2 className="hotel-title mt-3 text-3xl font-light tracking-tight text-neutral-950 md:text-5xl" style={{ fontFamily: SERIF }}>Seasonal selections</h2>
          </div>
          <div className="mt-12 divide-y divide-neutral-200">
            {data.menuItems.map((item) => (
              <article key={item.name} className="hotel-card py-6">
                <div className="flex items-baseline gap-4">
                  <h3 className="hotel-title min-w-0 flex-1 text-lg font-light tracking-tight text-neutral-950 md:text-xl" style={{ fontFamily: SERIF }}>{item.name}</h3>
                  <span className="whitespace-nowrap text-base font-medium tabular-nums" style={{ color: "var(--site-primary)" }}>{item.price}</span>
                </div>
                {item.description && <p className="mt-2 text-sm font-light leading-relaxed text-neutral-500">{item.description}</p>}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
