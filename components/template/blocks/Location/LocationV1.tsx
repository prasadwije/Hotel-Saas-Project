"use client";
import { MapPin, Phone, MessageCircle } from "lucide-react";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SectionHeader, telHrefOf, waHrefOf } from "@/components/template/blocks/shared";
import { ReadMoreCTA } from "@/components/template/ReadMoreCTA";

export function LocationV1({ data }: BlockProps) {
  const telHref = telHrefOf(data.phone);
  const waHref = waHrefOf(data.whatsapp);
  return (
    <section id="location" className="site-location-section site-location-v1 bg-neutral-50 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader eyebrow="Visit" title="Find us" rule={false} />
        <div className="grid gap-8 md:grid-cols-5 md:gap-10">
          <div className="site-map-wrapper relative aspect-video overflow-hidden rounded-2xl border border-neutral-200 shadow-sm md:col-span-3 md:aspect-auto">
            <iframe title={`Map to ${data.businessName}`} src={data.mapEmbedUrl} className="site-map-iframe absolute inset-0 h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          </div>
          <div className="site-address-card flex flex-col justify-center rounded-2xl border border-neutral-200 bg-white p-8 md:col-span-2">
            <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full" style={{ backgroundColor: "color-mix(in oklab, var(--site-primary) 12%, transparent)", color: "var(--site-primary)" }}>
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="hotel-title text-xl font-medium text-neutral-900">{data.businessName}</h3>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-neutral-600">{data.address}</p>
            <div className="mt-6 space-y-2 text-sm">
              <a href={telHref} className="flex items-center gap-2 text-neutral-700 hover:opacity-70"><Phone className="h-4 w-4" />{data.phone}</a>
              <a href={waHref} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-neutral-700 hover:opacity-70"><MessageCircle className="h-4 w-4" />Message on WhatsApp</a>
            </div>
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <ReadMoreCTA data={data} sectionKey="location" label="See location & directions" />
        </div>
      </div>
    </section>
  );
}
