"use client";
import { MapPin, Phone, MessageCircle } from "lucide-react";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF, telHrefOf, waHrefOf } from "@/components/template/blocks/shared";

// V2 — Full-width map with floating glassmorphism contact card
export function LocationV2({ data }: BlockProps) {
  const telHref = telHrefOf(data.phone);
  const waHref = waHrefOf(data.whatsapp);
  return (
    <section id="location" className="site-location-section site-location-v2 relative">
      <div className="site-map-wrapper relative h-[80vh] min-h-[520px] w-full overflow-hidden">
        <iframe title={`Map to ${data.businessName}`} src={data.mapEmbedUrl} className="site-map-iframe absolute inset-0 h-full w-full border-0 grayscale-[15%]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />
        <div className="absolute inset-x-4 bottom-6 z-10 md:inset-x-auto md:left-12 md:top-1/2 md:bottom-auto md:w-[420px] md:-translate-y-1/2">
          <div className="site-address-card pointer-events-auto rounded-3xl border border-white/40 bg-white/70 p-8 shadow-2xl backdrop-blur-2xl">
            <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full" style={{ backgroundColor: "color-mix(in oklab, var(--site-primary) 14%, transparent)", color: "var(--site-primary)" }}>
              <MapPin className="h-5 w-5" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.35em]" style={{ color: "var(--site-primary)" }}>Visit</p>
            <h3 className="hotel-title mt-2 text-3xl font-light text-neutral-900" style={{ fontFamily: SERIF }}>{data.businessName}</h3>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-neutral-700">{data.address}</p>
            <div className="mt-6 flex flex-col gap-2 text-sm">
              <a href={telHref} className="flex items-center gap-2 text-neutral-800 hover:opacity-70"><Phone className="h-4 w-4" />{data.phone}</a>
              <a href={waHref} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-neutral-800 hover:opacity-70"><MessageCircle className="h-4 w-4" />Message on WhatsApp</a>
            </div>
            <a href={telHref} className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full text-sm font-medium text-white shadow-md transition-transform hover:scale-[1.02]" style={{ backgroundColor: "var(--site-primary)" }}>Reserve Now</a>
          </div>
        </div>
      </div>
    </section>
  );
}
