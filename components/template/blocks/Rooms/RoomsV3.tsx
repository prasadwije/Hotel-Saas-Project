"use client";
import { Check } from "lucide-react";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SectionHeader, SERIF, bookRoomWaHref } from "@/components/template/blocks/shared";
import { useRoomDetails } from "@/components/rooms/RoomDetailsContext";

/** v3 — Split & Overlapping: each room is an asymmetrical split with image overlapping the copy card. */
export function RoomsV3({ data }: BlockProps) {
  if (!data.rooms?.length) return null;
  const { openRoomDetails } = useRoomDetails();
  return (
    <section id="rooms" className="site-rooms-section site-rooms-v3 bg-neutral-50 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader eyebrow="Stay" title="Rooms & Suites" />
        <div className="space-y-16 md:space-y-24">
          {data.rooms.map((room, i) => {
            const reverse = i % 2 === 1;
            return (
              <article data-room-clickable role="button" tabIndex={0} onClick={() => openRoomDetails(room, data.whatsapp)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openRoomDetails(room, data.whatsapp); } }} key={room.name} className={`relative grid items-center gap-6 md:grid-cols-12 ${reverse ? "md:[&>div:first-child]:order-2" : ""}`}>
                <div className="md:col-span-7">
                  <img src={room.image} alt={room.name} loading="lazy" className="aspect-[4/3] w-full rounded-3xl object-cover shadow-2xl ring-1 ring-black/5" />
                </div>
                <div className={`relative z-10 md:col-span-6 ${reverse ? "md:-mr-24" : "md:-ml-24"}`}>
                  <div className="rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-black/5 md:p-10">
                    <h3 className="hotel-title text-2xl font-normal tracking-tight text-neutral-900 md:text-3xl" style={{ fontFamily: SERIF }}>{room.name}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-neutral-600">{room.description}</p>
                    <ul className="mt-5 grid grid-cols-2 gap-y-2 gap-x-3 text-xs text-neutral-700">
                      {room.features.map((f) => (
                        <li key={f} className="flex items-center gap-2"><Check className="h-3.5 w-3.5" style={{ color: "var(--site-primary)" }} />{f}</li>
                      ))}
                    </ul>
                    <div className="mt-6 flex items-center justify-between">
                      <p className="text-2xl font-light" style={{ fontFamily: SERIF, color: "var(--site-primary)" }}>{room.price}<span className="ml-1 text-xs uppercase tracking-widest text-neutral-500">/night</span></p>
                      <button onClick={(e) => { e.stopPropagation(); const href = bookRoomWaHref(data.whatsapp, room.name); if (href !== "#") window.open(href, "_blank", "noopener,noreferrer"); }} type="button" className="inline-flex h-11 items-center rounded-full px-6 text-sm font-medium text-white shadow" style={{ backgroundColor: "var(--site-primary)" }}>Book</button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
