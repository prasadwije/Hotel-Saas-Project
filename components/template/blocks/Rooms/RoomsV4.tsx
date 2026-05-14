"use client";
import { Check } from "lucide-react";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SectionHeader, SERIF, bookRoomWaHref } from "@/components/template/blocks/shared";
import { useRoomDetails } from "@/components/rooms/RoomDetailsContext";

/** v4 — Bento/Grid: rooms laid out as a structured bento, first room featured larger. */
export function RoomsV4({ data }: BlockProps) {
  if (!data.rooms?.length) return null;
  const { openRoomDetails } = useRoomDetails();
  return (
    <section id="rooms" className="site-rooms-section site-rooms-v4 bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader eyebrow="Stay" title="Rooms & Suites" />
        <div className="grid auto-rows-[260px] grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {data.rooms.map((room, i) => {
            const big = i === 0;
            return (
              <article data-room-clickable role="button" tabIndex={0} onClick={() => openRoomDetails(room, data.whatsapp)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openRoomDetails(room, data.whatsapp); } }}
                key={room.name}
                className={`group relative overflow-hidden rounded-3xl ring-1 ring-black/5 shadow-sm ${big ? "md:col-span-2 md:row-span-2" : ""} cursor-pointer`}
              >
                <img src={room.image} alt={room.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <h3 className={`font-normal tracking-tight ${big ? "text-3xl" : "text-xl"}`} style={{ fontFamily: SERIF }}>{room.name}</h3>
                      {big && <p className="mt-2 max-w-md text-sm text-white/85 line-clamp-2">{room.description}</p>}
                      {big && (
                        <ul className="mt-3 hidden flex-wrap gap-x-4 gap-y-1 text-xs text-white/85 md:flex">
                          {room.features.slice(0, 4).map((f) => (
                            <li key={f} className="flex items-center gap-1.5"><Check className="h-3 w-3" />{f}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-base font-light" style={{ fontFamily: SERIF }}>{room.price}</p>
                      <p className="text-[10px] uppercase tracking-widest text-white/70">/ night</p>
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); const href = bookRoomWaHref(data.whatsapp, room.name); if (href !== "#") window.open(href, "_blank", "noopener,noreferrer"); }} type="button" className="mt-4 inline-flex h-9 items-center rounded-full bg-white px-5 text-xs font-semibold text-neutral-900 shadow hover:bg-white/90">
                    Book
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
