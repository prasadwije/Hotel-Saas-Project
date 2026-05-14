"use client";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SectionHeader, SERIF } from "@/components/template/blocks/shared";
import { MenuItemImage } from "./MenuItemImage";

/** v5 — Trendy Bento Box: rounded card grid, image-forward dishes. */
export function MenuV5({ data }: BlockProps) {
  if (!data.menuItems?.length) return null;
  const fallbacks = data.galleryImages ?? [];
  return (
    <section id="menu" className="site-menu-section site-menu-v5 bg-neutral-100 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader eyebrow="Menu" title="Seasonal selections" rule={false} />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.menuItems.map((item, i) => (
            <article key={item.name} className="hotel-card overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-black/5 transition-all hover:-translate-y-1 hover:shadow-xl">
              <MenuItemImage
                src={item.image}
                fallback={fallbacks.length ? fallbacks[i % fallbacks.length] : undefined}
                alt={item.name}
                className="aspect-[16/10] w-full overflow-hidden"
              />
              <div className="p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="hotel-title text-lg font-normal tracking-tight text-neutral-900" style={{ fontFamily: SERIF }}>{item.name}</h3>
                  <span className="text-base font-medium tabular-nums" style={{ color: "var(--site-primary)" }}>{item.price}</span>
                </div>
                {item.description && <p className="mt-3 text-sm leading-relaxed text-neutral-500 line-clamp-3">{item.description}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
