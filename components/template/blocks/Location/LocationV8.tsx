"use client";
import { MapPin, Phone, MessageCircle } from "lucide-react";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF, telHrefOf, waHrefOf } from "@/components/template/blocks/shared";

/** v8 — Apple Bento & Glassmorphism: glass map tile + contact glass tile. */
export function LocationV8({ data }: BlockProps) {
  const telHref = telHrefOf(data.phone);
  const waHref = waHrefOf(data.whatsapp);
  return (
    <section id="location" className="site-location-section site-location-v8 relative overflow-hidden py-24 md:py-32" style={{ backgroundColor: "color-mix(in oklab, var(--site-primary) 6%, #f5f5f4)" }}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.4em]" style={{ color: "var(--site-primary)" }}>Visit</p>
          <h2 className="hotel-title text-4xl font-semibold tracking-tight text-neutral-950 md:text-5xl" style={{ fontFamily: SERIF }}>Find us</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-5">
          <div className="group relative overflow-hidden rounded-[2rem] border border-white/40 bg-white/60 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-0.5 md:col-span-3 min-h-[360px]">
            {data.mapEmbedUrl ? (
              <iframe title={`Map to ${data.businessName}`} src={data.mapEmbedUrl} className="absolute inset-0 h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-neutral-400">No map available</div>
            )}
          </div>
          <div className="group relative flex flex-col rounded-[2rem] border border-white/40 bg-white/60 p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-0.5 md:col-span-2">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/40 bg-white/70 backdrop-blur" style={{ color: "var(--site-primary)" }}>
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="hotel-title text-2xl font-semibold tracking-tight text-neutral-950" style={{ fontFamily: SERIF }}>{data.businessName}</h3>
            {data.address && <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-neutral-600">{data.address}</p>}
            <div className="mt-6 space-y-2 text-sm">
              {data.phone && (
                <a href={telHref} className="flex items-center gap-2 text-neutral-700 hover:opacity-70"><Phone className="h-4 w-4" />{data.phone}</a>
              )}
              {data.whatsapp && (
                <a href={waHref} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-neutral-700 hover:opacity-70"><MessageCircle className="h-4 w-4" />Message on WhatsApp</a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
