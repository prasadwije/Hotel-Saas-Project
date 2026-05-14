"use client";
import type { BlockProps } from "@/components/template/blocks/shared";
import { CarouselHint, SectionHeader, SERIF, layoutClasses } from "@/components/template/blocks/shared";
import { MenuItemImage } from "./MenuItemImage";

export function MenuV2({ data }: BlockProps) {
  if (!data.menuItems?.length) return null;
  const layout = layoutClasses(data.mobileLayouts?.menu, "md:grid-cols-2 lg:grid-cols-3", "gap-6 md:gap-8");
  const fallbacks = data.galleryImages ?? [];
  const items = data.menuItems;
  return (
    <section id="menu" className="site-menu-section site-menu-v2 bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader eyebrow="Menu" title="Seasonal selections" />
        <div className={`site-menu-grid ${layout.container}`}>
          {items.map((item, i) => {
            const fallback = fallbacks.length ? fallbacks[i % fallbacks.length] : undefined;
            return (
              <article key={item.name} className={`site-menu-card group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${layout.item}`}>
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                  <MenuItemImage
                    src={item.image}
                    fallback={fallback}
                    alt={item.name}
                    className="absolute inset-0"
                    imgClassName="transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  <div className="absolute bottom-3 right-3 rounded-full bg-white/95 px-3 py-1 text-xs font-medium tabular-nums backdrop-blur" style={{ color: "var(--site-primary)" }}>{item.price}</div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="hotel-title site-menu-item-name text-2xl font-normal tracking-tight text-neutral-900" style={{ fontFamily: SERIF }}>{item.name}</h3>
                  {item.description && <p className="site-menu-item-desc mt-3 text-sm leading-relaxed text-neutral-500">{item.description}</p>}
                </div>
              </article>
            );
          })}
        </div>
        {layout.isCarousel && <CarouselHint />}
      </div>
    </section>
  );
}
