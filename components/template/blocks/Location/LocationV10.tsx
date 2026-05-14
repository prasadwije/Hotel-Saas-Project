"use client";
import { MapPin, Phone, MessageCircle } from "lucide-react";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF, telHrefOf, waHrefOf } from "@/components/template/blocks/shared";

/** v10 — Floating Layered Editorial: full-bleed map with floating solid contact card overlay. */
export function LocationV10({ data }: BlockProps) {
  const telHref = telHrefOf(data.phone);
  const waHref = waHrefOf(data.whatsapp);
  return (
    <section id="location" className="site-location-section site-location-v10 relative bg-neutral-50 pb-24 md:pb-32">
      <div className="relative h-[60vh] w-full md:h-[80vh]">
        {data.mapEmbedUrl ? (
          <iframe title={`Map to ${data.businessName}`} src={data.mapEmbedUrl} className="absolute inset-0 h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-200 text-neutral-500">No map available</div>
        )}
      </div>
      <div className="relative z-10 mx-auto -mt-40 max-w-md px-4 md:-mt-56 md:max-w-lg md:px-0">
        <div className="rounded-sm bg-white p-8 shadow-2xl shadow-neutral-950/15 md:p-12">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-full" style={{ backgroundColor: "color-mix(in oklab, var(--site-primary) 12%, white)", color: "var(--site-primary)" }}>
            <MapPin className="h-5 w-5" />
          </div>
          <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.45em]" style={{ color: "var(--site-primary)" }}>Visit</p>
          <h3 className="hotel-title mt-3 text-3xl font-light tracking-tight text-neutral-950 md:text-4xl" style={{ fontFamily: SERIF }}>{data.businessName}</h3>
          {data.address && <p className="mt-4 whitespace-pre-line text-sm font-light leading-relaxed text-neutral-600">{data.address}</p>}
          <div className="mt-6 flex flex-col gap-3 border-t border-neutral-200 pt-6 text-sm">
            {data.phone && (
              <a href={telHref} className="inline-flex items-center gap-3 text-neutral-700 hover:text-neutral-950"><Phone className="h-4 w-4" />{data.phone}</a>
            )}
            {data.whatsapp && (
              <a href={waHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 text-neutral-700 hover:text-neutral-950"><MessageCircle className="h-4 w-4" />Message on WhatsApp</a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
