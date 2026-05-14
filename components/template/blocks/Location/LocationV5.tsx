"use client";
import { MapPin, Phone, MessageCircle, Clock } from "lucide-react";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SectionHeader, telHrefOf, waHrefOf } from "@/components/template/blocks/shared";

/** v5 — Trendy Bento Box: contact info split into rounded info cards beside the map. */
export function LocationV5({ data }: BlockProps) {
  return (
    <section id="location" className="site-location-section site-location-v5 bg-neutral-100 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader eyebrow="Visit" title="Find us" rule={false} />
        <div className="grid gap-5 md:grid-cols-3">
          <div className="overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-black/5 md:col-span-2 md:row-span-2 md:aspect-auto aspect-video">
            {data.mapEmbedUrl ? (
              <iframe title={`Map to ${data.businessName}`} src={data.mapEmbedUrl} className="h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            ) : (
              <div className="h-full w-full bg-neutral-200" />
            )}
          </div>
          {data.address && (
            <InfoCard icon={<MapPin className="h-5 w-5" />} label="Address">
              <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-700">{data.address}</p>
            </InfoCard>
          )}
          {(data.phone || data.whatsapp) && (
            <InfoCard icon={<Phone className="h-5 w-5" />} label="Contact">
              <div className="space-y-2 text-sm text-neutral-700">
                {data.phone && <a href={telHrefOf(data.phone)} className="flex items-center gap-2 hover:opacity-70"><Phone className="h-4 w-4" />{data.phone}</a>}
                {data.whatsapp && <a href={waHrefOf(data.whatsapp)} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:opacity-70"><MessageCircle className="h-4 w-4" />WhatsApp</a>}
              </div>
            </InfoCard>
          )}
          {!data.address && !data.phone && !data.whatsapp && (
            <InfoCard icon={<Clock className="h-5 w-5" />} label="Hours"><p className="text-sm text-neutral-500">Open daily.</p></InfoCard>
          )}
        </div>
      </div>
    </section>
  );
}

function InfoCard({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-black/5">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl" style={{ backgroundColor: "color-mix(in oklab, var(--site-primary) 12%, transparent)", color: "var(--site-primary)" }}>
        {icon}
      </div>
      <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-neutral-500">{label}</p>
      {children}
    </div>
  );
}
