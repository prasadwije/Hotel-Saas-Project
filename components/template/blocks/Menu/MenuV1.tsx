"use client";
import type { BlockProps } from "@/components/template/blocks/shared";
import { CarouselHint, SectionHeader, SERIF, layoutClasses, isPageEnabled, useIsDedicatedPage } from "@/components/template/blocks/shared";
import { MenuItemImage } from "./MenuItemImage";
import { ReadMoreCTA } from "@/components/template/ReadMoreCTA";

export function MenuV1({ data }: BlockProps) {
  if (!data.menuItems?.length) return null;
  const layout = layoutClasses(data.mobileLayouts?.menu, "md:grid-cols-2 lg:grid-cols-3", "gap-x-12 gap-y-10");
  const fallbacks = data.galleryImages ?? [];
  const truncate = isPageEnabled(data, "menu") && !useIsDedicatedPage("menu");
  const items = truncate ? data.menuItems.slice(0, 3) : data.menuItems;
  return (
    <section id="menu" className="site-menu-section site-menu-v1 relative overflow-hidden py-24 md:py-32" style={{ background: "linear-gradient(180deg, #fafaf9 0%, #f5f5f4 100%)" }}>
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader eyebrow="Menu" title="Seasonal selections" />
        <div className={`site-menu-grid ${layout.container}`}>
          {items.map((item, i) => (
            <article key={item.name} className={`site-menu-card group rounded-2xl bg-white/60 p-7 shadow-sm ring-1 ring-black/5 backdrop-blur transition-all duration-500 hover:-translate-y-1 hover:bg-white hover:shadow-xl ${layout.item}`}>
              <MenuItemImage
                src={item.image}
                fallback={fallbacks.length ? fallbacks[i % fallbacks.length] : undefined}
                alt={item.name}
                className="mb-5 aspect-[16/10] w-full overflow-hidden rounded-xl"
              />
              <div className="flex items-baseline gap-3">
                <h3 className="hotel-title site-menu-item-name text-xl font-normal tracking-tight text-neutral-900" style={{ fontFamily: SERIF }}>{item.name}</h3>
                <span className="flex-1 translate-y-[-3px] border-b border-dotted border-neutral-300" />
                <span className="site-menu-item-price text-base font-medium tabular-nums" style={{ color: "var(--site-primary)" }}>{item.price}</span>
              </div>
              {item.description && <p className="site-menu-item-desc mt-4 text-sm leading-relaxed tracking-wide text-neutral-500">{item.description}</p>}
            </article>
          ))}
        </div>
        {layout.isCarousel && <CarouselHint />}
        <div className="mt-10 flex justify-center">
          <ReadMoreCTA data={data} sectionKey="menu" label="View full menu" />
        </div>
      </div>
    </section>
  );
}
