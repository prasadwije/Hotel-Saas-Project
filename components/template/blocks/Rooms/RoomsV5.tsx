"use client";
import { Check } from "lucide-react";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SectionHeader, SERIF, bookRoomWaHref } from "@/components/template/blocks/shared";
import { useRoomDetails } from "@/components/rooms/RoomDetailsContext";

/** v5 — Centered & Spacious: each room is a centered, full-width module with edge-to-edge image. */
export function RoomsV5({ data }: BlockProps) {
  if (!data.rooms?.length) return null;
  const { openRoomDetails } = useRoomDetails();
  return (
    <section id="rooms" className="site-rooms-section site-rooms-v5 bg-white py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <SectionHeader eyebrow="Stay" title="Rooms & Suites" />
      </div>
      <div className="space-y-24 md:space-y-32">
        {data.rooms.map((room, i) => (
          <article data-room-clickable role="button" tabIndex={0} onClick={() => openRoomDetails(room, data.whatsapp)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openRoomDetails(room, data.whatsapp); } }} key={room.name} className="hotel-card space-y-10 cursor-pointer">
            <img src={room.image} alt={room.name} loading="lazy" className="h-[60vh] w-full object-cover" />
            <div className="mx-auto max-w-3xl px-6 text-center">
              <p className="text-xs uppercase tracking-[0.35em]" style={{ color: "var(--site-primary)" }}>Room {String(i + 1).padStart(2, "0")}</p>
              <h3 className="hotel-title mt-4 text-3xl font-light leading-tight text-neutral-900 md:text-5xl" style={{ fontFamily: SERIF }}>{room.name}</h3>
              <p className="mx-auto mt-6 max-w-xl text-base font-light leading-relaxed text-neutral-600 md:text-lg">{room.description}</p>
              <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-neutral-700">
                {room.features.map((f) => (
                  <li key={f} className="flex items-center gap-2"><Check className="h-4 w-4" style={{ color: "var(--site-primary)" }} />{f}</li>
                ))}
              </ul>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
                <p className="text-3xl font-light" style={{ fontFamily: SERIF, color: "var(--site-primary)" }}>{room.price}<span className="ml-1 text-xs uppercase tracking-widest text-neutral-500">/night</span></p>
                <button onClick={(e) => { e.stopPropagation(); const href = bookRoomWaHref(data.whatsapp, room.name); if (href !== "#") window.open(href, "_blank", "noopener,noreferrer"); }} type="button" className="inline-flex h-12 items-center rounded-full px-10 text-sm font-medium text-white shadow" style={{ backgroundColor: "var(--site-primary)" }}>Reserve</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
