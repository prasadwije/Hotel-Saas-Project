"use client";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF } from "@/components/template/blocks/shared";
import { MenuItemImage } from "./MenuItemImage";

/** v4 — Editorial Magazine: large type, two-column asymmetrical menu. */
export function MenuV4({ data }: BlockProps) {
  if (!data.menuItems?.length) return null;
  const fallbacks = data.galleryImages ?? [];
  return (
    <section id="menu" className="site-menu-section site-menu-v4 bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 grid items-end gap-6 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="mb-3 text-xs uppercase tracking-[0.4em]" style={{ color: "var(--site-primary)" }}>The Menu</p>
            <h2 className="hotel-title text-balance text-6xl font-light leading-[0.95] tracking-tight text-neutral-900 md:text-8xl" style={{ fontFamily: SERIF }}>
              Seasonal <em className="not-italic" style={{ color: "var(--site-primary)" }}>selections</em>.
            </h2>
          </div>
          <p className="md:col-span-5 md:col-start-8 text-base leading-relaxed text-neutral-600">A curated list of dishes, refreshed each season by our culinary team.</p>
        </div>
        <div className="grid gap-x-12 gap-y-10 md:grid-cols-2">
          {data.menuItems.map((item, i) => (
            <article key={item.name} className="hotel-card grid grid-cols-[88px_1fr] gap-5">
              <MenuItemImage
                src={item.image}
                fallback={fallbacks.length ? fallbacks[i % fallbacks.length] : undefined}
                alt={item.name}
                className="aspect-square w-[88px] overflow-hidden rounded-sm"
              />
              <div>
                <div className="flex items-baseline gap-3">
                  <h3 className="hotel-title text-2xl font-light tracking-tight text-neutral-900" style={{ fontFamily: SERIF }}>{item.name}</h3>
                  <span className="flex-1 translate-y-[-3px] border-b border-dotted border-neutral-300" />
                  <span className="text-base font-medium tabular-nums" style={{ color: "var(--site-primary)" }}>{item.price}</span>
                </div>
                {item.description && <p className="mt-2 text-sm leading-relaxed text-neutral-500">{item.description}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
