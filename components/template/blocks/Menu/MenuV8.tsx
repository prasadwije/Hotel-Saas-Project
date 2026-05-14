"use client";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF } from "@/components/template/blocks/shared";
import { MenuItemImage } from "./MenuItemImage";

/** v8 — Apple Bento & Glassmorphism: glass tiles per dish. */
export function MenuV8({ data }: BlockProps) {
  if (!data.menuItems?.length) return null;
  const fallbacks = data.galleryImages ?? [];
  return (
    <section id="menu" className="site-menu-section site-menu-v8 relative overflow-hidden py-24 md:py-32" style={{ backgroundColor: "color-mix(in oklab, var(--site-primary) 6%, #f5f5f4)" }}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.4em]" style={{ color: "var(--site-primary)" }}>Menu</p>
          <h2 className="hotel-title text-4xl font-semibold tracking-tight text-neutral-950 md:text-5xl" style={{ fontFamily: SERIF }}>Seasonal selections</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {data.menuItems.map((item, i) => (
            <article key={item.name} className="hotel-card group flex flex-col overflow-hidden rounded-[2rem] border border-white/40 bg-white/60 p-3 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)]">
              <MenuItemImage
                src={item.image}
                fallback={fallbacks.length ? fallbacks[i % fallbacks.length] : undefined}
                alt={item.name}
                className="aspect-[16/10] w-full overflow-hidden rounded-[1.5rem]"
              />
              <div className="flex flex-col gap-3 p-5">
                <div className="flex items-baseline gap-3">
                  <h3 className="hotel-title min-w-0 flex-1 truncate text-lg font-semibold tracking-tight text-neutral-950" style={{ fontFamily: SERIF }}>{item.name}</h3>
                  <span className="whitespace-nowrap text-sm font-medium tabular-nums" style={{ color: "var(--site-primary)" }}>{item.price}</span>
                </div>
                {item.description && <p className="text-sm leading-relaxed text-neutral-600">{item.description}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
