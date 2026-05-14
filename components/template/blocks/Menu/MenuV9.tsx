"use client";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF } from "@/components/template/blocks/shared";

/** v9 — Cinematic Elegant Minimal: hairline-divided menu rows, no card chrome. */
export function MenuV9({ data }: BlockProps) {
  if (!data.menuItems?.length) return null;
  return (
    <section id="menu" className="site-menu-section site-menu-v9 bg-white py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <p className="text-[11px] font-light uppercase tracking-[0.55em]" style={{ color: "var(--site-primary)" }}>Menu</p>
          <div className="mx-auto mt-6 h-px w-12 bg-neutral-300" />
          <h2 className="hotel-title mt-8 text-4xl font-light tracking-tight text-neutral-950 md:text-6xl" style={{ fontFamily: SERIF }}>
            Seasonal selections.
          </h2>
        </div>
        <div className="mt-20 divide-y divide-neutral-200 border-y border-neutral-200">
          {data.menuItems.map((item) => (
            <article key={item.name} className="hotel-card py-8">
              <div className="flex items-baseline gap-4">
                <h3 className="hotel-title min-w-0 flex-1 text-xl font-light tracking-tight text-neutral-950 md:text-2xl" style={{ fontFamily: SERIF }}>{item.name}</h3>
                <span className="whitespace-nowrap text-base font-light tabular-nums tracking-wide text-neutral-700">{item.price}</span>
              </div>
              {item.description && <p className="mt-3 max-w-xl text-sm font-light leading-relaxed tracking-wide text-neutral-500">{item.description}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
