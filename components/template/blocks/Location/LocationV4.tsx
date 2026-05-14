"use client";
import { MapPin, Phone, MessageCircle } from "lucide-react";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF, telHrefOf, waHrefOf } from "@/components/template/blocks/shared";

/** v4 — Editorial Magazine: massive type, address & contact stacked beside an offset map. */
export function LocationV4({ data }: BlockProps) {
  return (
    <section id="location" className="site-location-section site-location-v4 bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-end gap-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="mb-3 text-xs uppercase tracking-[0.4em]" style={{ color: "var(--site-primary)" }}>Visit</p>
            <h2 className="hotel-title text-balance text-6xl font-light leading-[0.95] tracking-tight text-neutral-900 md:text-8xl" style={{ fontFamily: SERIF }}>
              Find <em className="not-italic" style={{ color: "var(--site-primary)" }}>us</em>.
            </h2>
            {data.address && <p className="mt-8 max-w-md whitespace-pre-line text-base leading-relaxed text-neutral-600">{data.address}</p>}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-700">
              {data.phone && <a href={telHrefOf(data.phone)} className="flex items-center gap-2 hover:opacity-70"><Phone className="h-4 w-4" />{data.phone}</a>}
              {data.whatsapp && <a href={waHrefOf(data.whatsapp)} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:opacity-70"><MessageCircle className="h-4 w-4" />WhatsApp</a>}
            </div>
          </div>
          <div className="md:col-span-6 md:-mt-16">
            {data.mapEmbedUrl ? (
              <div className="relative aspect-square overflow-hidden rounded-sm shadow-xl">
                <iframe title={`Map to ${data.businessName}`} src={data.mapEmbedUrl} className="absolute inset-0 h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
              </div>
            ) : (
              <div className="aspect-square w-full rounded-sm bg-neutral-100 ring-1 ring-black/5" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
