"use client";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF } from "@/components/template/blocks/shared";
import { MenuItemImage } from "./MenuItemImage";

/** v3 — Ultra-Luxury Dark: gold accents on black, refined plate-style cards. */
export function MenuV3({ data }: BlockProps) {
  if (!data.menuItems?.length) return null;
  const fallbacks = data.galleryImages ?? [];
  return (
    <section id="menu" className="site-menu-section site-menu-v3 bg-neutral-950 py-24 text-white md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.4em]" style={{ color: "var(--site-primary)" }}>Menu</p>
          <h2 className="hotel-title text-4xl font-light tracking-tight md:text-5xl" style={{ fontFamily: SERIF }}>Seasonal selections</h2>
          <div className="mx-auto mt-6 h-px w-16" style={{ backgroundColor: "var(--site-primary)" }} />
        </div>
        <div className="space-y-8">
          {data.menuItems.map((item, i) => (
            <article key={item.name} className="hotel-card grid items-center gap-6 border-b border-white/10 pb-8 md:grid-cols-[120px_1fr_auto]">
              <MenuItemImage
                src={item.image}
                fallback={fallbacks.length ? fallbacks[i % fallbacks.length] : undefined}
                alt={item.name}
                className="aspect-square w-full overflow-hidden rounded-full ring-1 ring-white/15 md:w-[120px]"
              />
              <div>
                <h3 className="hotel-title text-2xl font-light tracking-tight" style={{ fontFamily: SERIF }}>{item.name}</h3>
                {item.description && <p className="mt-2 text-sm leading-relaxed text-white/60">{item.description}</p>}
              </div>
              <span className="text-xl font-light tabular-nums md:text-2xl" style={{ fontFamily: SERIF, color: "var(--site-primary)" }}>{item.price}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
