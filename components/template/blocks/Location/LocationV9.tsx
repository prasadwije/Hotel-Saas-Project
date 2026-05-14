"use client";
import { Phone, MessageCircle } from "lucide-react";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF, telHrefOf, waHrefOf } from "@/components/template/blocks/shared";

/** v9 — Cinematic Elegant Minimal: edge-to-edge map with hairline contact strip. */
export function LocationV9({ data }: BlockProps) {
  const telHref = telHrefOf(data.phone);
  const waHref = waHrefOf(data.whatsapp);
  return (
    <section id="location" className="site-location-section site-location-v9 bg-white">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center md:py-32">
        <p className="text-[11px] font-light uppercase tracking-[0.55em]" style={{ color: "var(--site-primary)" }}>Visit</p>
        <div className="mx-auto mt-6 h-px w-12 bg-neutral-300" />
        <h2 className="hotel-title mt-8 text-4xl font-light tracking-tight text-neutral-950 md:text-6xl" style={{ fontFamily: SERIF }}>
          Find us.
        </h2>
        {data.address && <p className="mx-auto mt-6 max-w-xl whitespace-pre-line text-sm font-light leading-relaxed tracking-wider text-neutral-600 md:text-base">{data.address}</p>}
      </div>
      {data.mapEmbedUrl && (
        <div className="relative aspect-[16/9] w-full overflow-hidden md:aspect-[21/9]">
          <iframe title={`Map to ${data.businessName}`} src={data.mapEmbedUrl} className="absolute inset-0 h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
        </div>
      )}
      {(data.phone || data.whatsapp) && (
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-12 gap-y-6 border-y border-neutral-200 px-6 py-10 text-center">
          {data.phone && (
            <a href={telHref} className="inline-flex items-center gap-3 text-[11px] font-light uppercase tracking-[0.35em] text-neutral-700 hover:text-neutral-950">
              <Phone className="h-4 w-4" /> {data.phone}
            </a>
          )}
          {data.whatsapp && (
            <a href={waHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 text-[11px] font-light uppercase tracking-[0.35em] text-neutral-700 hover:text-neutral-950">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          )}
        </div>
      )}
    </section>
  );
}
