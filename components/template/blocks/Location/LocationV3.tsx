"use client";
import { MapPin, Phone, MessageCircle } from "lucide-react";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF, telHrefOf, waHrefOf } from "@/components/template/blocks/shared";

/** v3 — Ultra-Luxury Dark: dark backdrop, gold-accented address card. */
export function LocationV3({ data }: BlockProps) {
  const telHref = telHrefOf(data.phone);
  const waHref = waHrefOf(data.whatsapp);
  return (
    <section id="location" className="site-location-section site-location-v3 bg-neutral-950 py-24 text-white md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.4em]" style={{ color: "var(--site-primary)" }}>Visit</p>
          <h2 className="hotel-title text-4xl font-light tracking-tight md:text-5xl" style={{ fontFamily: SERIF }}>Find us</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-5 md:gap-8">
          <div className="relative aspect-video overflow-hidden rounded-3xl ring-1 ring-white/10 md:col-span-3 md:aspect-auto">
            {data.mapEmbedUrl ? (
              <iframe title={`Map to ${data.businessName}`} src={data.mapEmbedUrl} className="absolute inset-0 h-full w-full border-0 grayscale invert opacity-90" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            ) : (
              <div className="absolute inset-0 bg-white/5" />
            )}
          </div>
          <div className="flex flex-col justify-center rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur md:col-span-2">
            <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full" style={{ backgroundColor: "color-mix(in oklab, var(--site-primary) 20%, transparent)", color: "var(--site-primary)" }}>
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="hotel-title text-xl font-light" style={{ fontFamily: SERIF }}>{data.businessName}</h3>
            {data.address && <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-white/70">{data.address}</p>}
            <div className="mt-6 space-y-2 text-sm">
              {data.phone && <a href={telHref} className="flex items-center gap-2 text-white/85 hover:text-white"><Phone className="h-4 w-4" />{data.phone}</a>}
              {data.whatsapp && <a href={waHref} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white/85 hover:text-white"><MessageCircle className="h-4 w-4" />Message on WhatsApp</a>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
