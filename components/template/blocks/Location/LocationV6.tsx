"use client";
import { Phone, MessageCircle } from "lucide-react";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF, telHrefOf, waHrefOf } from "@/components/template/blocks/shared";

/** v6 — Ultra-Minimalist: edge-to-edge map with a thin overlay caption. */
export function LocationV6({ data }: BlockProps) {
  return (
    <section id="location" className="site-location-section site-location-v6 bg-white">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center md:py-32">
        <h2 className="hotel-title text-balance text-5xl font-light leading-[1.05] tracking-tight text-neutral-900 md:text-7xl" style={{ fontFamily: SERIF }}>
          Find us.
        </h2>
        {data.address && <p className="mt-8 whitespace-pre-line text-base leading-relaxed text-neutral-600">{data.address}</p>}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-neutral-700">
          {data.phone && <a href={telHrefOf(data.phone)} className="flex items-center gap-2 hover:opacity-70"><Phone className="h-4 w-4" />{data.phone}</a>}
          {data.whatsapp && <a href={waHrefOf(data.whatsapp)} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:opacity-70"><MessageCircle className="h-4 w-4" />WhatsApp</a>}
        </div>
      </div>
      {data.mapEmbedUrl ? (
        <div className="aspect-[21/9] w-full">
          <iframe title={`Map to ${data.businessName}`} src={data.mapEmbedUrl} className="h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
        </div>
      ) : (
        <div className="aspect-[21/9] w-full bg-neutral-100" />
      )}
    </section>
  );
}
