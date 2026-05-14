"use client";
import { Phone, MessageCircle } from "lucide-react";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF, telHrefOf, waHrefOf } from "@/components/template/blocks/shared";

/** v7 — Apple Product Page: huge title above an edge-to-edge map with floating contact rail. */
export function LocationV7({ data }: BlockProps) {
  const telHref = telHrefOf(data.phone);
  const waHref = waHrefOf(data.whatsapp);
  return (
    <section id="location" className="site-location-section site-location-v7 bg-white py-32 md:py-44">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="mb-6 text-xs font-medium uppercase tracking-[0.4em] text-neutral-500">Visit</p>
        <h2 className="hotel-title text-balance text-5xl font-semibold leading-[0.95] tracking-tight text-neutral-950 md:text-7xl" style={{ fontFamily: SERIF }}>
          Find us.
        </h2>
        {data.address && <p className="mx-auto mt-6 max-w-xl whitespace-pre-line text-base font-light leading-relaxed text-neutral-600 md:text-lg">{data.address}</p>}
      </div>
      <div className="relative mt-16 w-full">
        {data.mapEmbedUrl && (
          <div className="relative aspect-[16/9] w-full overflow-hidden md:aspect-[21/9]">
            <iframe title={`Map to ${data.businessName}`} src={data.mapEmbedUrl} className="absolute inset-0 h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          </div>
        )}
        {(data.phone || data.whatsapp) && (
          <div className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-3 px-6">
            {data.phone && (
              <a href={telHref} className="inline-flex h-12 items-center gap-2 rounded-full border border-neutral-200 bg-white px-6 text-sm font-medium text-neutral-900 shadow-sm transition-all hover:scale-[1.03]">
                <Phone className="h-4 w-4" /> {data.phone}
              </a>
            )}
            {data.whatsapp && (
              <a href={waHref} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-medium text-white shadow-sm transition-all hover:scale-[1.03]" style={{ backgroundColor: "var(--site-primary)" }}>
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
