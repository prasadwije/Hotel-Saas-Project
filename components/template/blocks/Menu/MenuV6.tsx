"use client";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF } from "@/components/template/blocks/shared";

/** v6 — Ultra-Minimalist: pure typographic list, no images, massive whitespace. */
export function MenuV6({ data }: BlockProps) {
  if (!data.menuItems?.length) return null;
  return (
    <section id="menu" className="site-menu-section site-menu-v6 bg-white py-32 md:py-44">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="hotel-title mb-16 text-center text-5xl font-light tracking-tight text-neutral-900 md:text-7xl" style={{ fontFamily: SERIF }}>Menu</h2>
        <ul>
          {data.menuItems.map((item) => (
            <li key={item.name} className="border-b border-neutral-200 py-6">
              <div className="flex items-baseline gap-4">
                <h3 className="hotel-title text-xl font-light tracking-tight text-neutral-900 md:text-2xl" style={{ fontFamily: SERIF }}>{item.name}</h3>
                <span className="flex-1" />
                <span className="text-lg font-light tabular-nums" style={{ color: "var(--site-primary)" }}>{item.price}</span>
              </div>
              {item.description && <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-500">{item.description}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
