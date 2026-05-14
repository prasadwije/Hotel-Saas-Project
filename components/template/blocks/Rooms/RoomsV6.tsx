"use client";
import { Check } from "lucide-react";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SectionHeader, SERIF, bookRoomWaHref } from "@/components/template/blocks/shared";
import { useRoomDetails } from "@/components/rooms/RoomDetailsContext";

/** v6 — Floating Cards & Slider: horizontal card carousel of rooms. */
export function RoomsV6({ data }: BlockProps) {
  if (!data.rooms?.length) return null;
  const { openRoomDetails } = useRoomDetails();
  return (
    <section id="rooms" className="site-rooms-section site-rooms-v6 bg-neutral-100 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader eyebrow="Stay" title="Rooms & Suites" />
      </div>
      <div className="mx-auto max-w-7xl">
        <div className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-6 md:gap-6">
          {data.rooms.map((room) => (
            <article data-room-clickable role="button" tabIndex={0} onClick={() => openRoomDetails(room, data.whatsapp)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openRoomDetails(room, data.whatsapp); } }} key={room.name} className="hotel-card w-[82%] shrink-0 snap-center overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-black/5 md:w-[420px] cursor-pointer">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={room.image} alt={room.name} loading="lazy" className="h-full w-full object-cover" />
                <div className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-neutral-900 backdrop-blur">
                  <span style={{ color: "var(--site-primary)" }}>{room.price}</span><span className="text-neutral-500"> / night</span>
                </div>
              </div>
              <div className="flex flex-col gap-4 p-6">
                <h3 className="hotel-title text-xl font-normal tracking-tight text-neutral-900" style={{ fontFamily: SERIF }}>{room.name}</h3>
                <p className="text-sm leading-relaxed text-neutral-500 line-clamp-3">{room.description}</p>
                <ul className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-xs text-neutral-700">
                  {room.features.slice(0, 4).map((f) => (
                    <li key={f} className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5" style={{ color: "var(--site-primary)" }} />{f}</li>
                  ))}
                </ul>
                <button onClick={(e) => { e.stopPropagation(); const href = bookRoomWaHref(data.whatsapp, room.name); if (href !== "#") window.open(href, "_blank", "noopener,noreferrer"); }} type="button" className="mt-2 inline-flex h-11 items-center justify-center rounded-full text-sm font-medium text-white shadow" style={{ backgroundColor: "var(--site-primary)" }}>Book Room</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
