"use client";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF } from "@/components/template/blocks/shared";
import { MenuItemImage } from "./MenuItemImage";

/** v7 — Apple Product Page: huge title, minimalist list rows, generous whitespace. */
export function MenuV7({ data }: BlockProps) {
  if (!data.menuItems?.length) return null;
  const fallbacks = data.galleryImages ?? [];
  return (
    <section id="menu" className="site-menu-section site-menu-v7 bg-white py-32 md:py-44">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.4em] text-neutral-500">Menu</p>
          <h2 className="hotel-title text-balance text-5xl font-semibold leading-[0.95] tracking-tight text-neutral-950 md:text-7xl" style={{ fontFamily: SERIF }}>
            Seasonal selections.
          </h2>
        </div>
        <div className="mt-20 divide-y divide-neutral-200">
          {data.menuItems.map((item, i) => (
            <article key={item.name} className="hotel-card group flex items-center gap-6 py-8">
              <MenuItemImage
                src={item.image}
                fallback={fallbacks.length ? fallbacks[i % fallbacks.length] : undefined}
                alt={item.name}
                className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-3">
                  <h3 className="hotel-title min-w-0 truncate text-lg font-semibold tracking-tight text-neutral-950 md:text-2xl" style={{ fontFamily: SERIF }}>{item.name}</h3>
                  <span aria-hidden className="hidden flex-1 self-end border-b border-dotted border-neutral-300 pb-2 sm:block" />
                  <span className="ml-auto whitespace-nowrap text-base font-medium tabular-nums sm:ml-0" style={{ color: "var(--site-primary)" }}>{item.price}</span>
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
