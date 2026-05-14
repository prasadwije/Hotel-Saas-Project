"use client";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF, bookRoomWaHref } from "@/components/template/blocks/shared";
import { useRoomDetails } from "@/components/rooms/RoomDetailsContext";

/** v8 — Apple Bento & Glassmorphism: rounded glass tiles over an ambient backdrop. */
export function RoomsV8({ data }: BlockProps) {
  if (!data.rooms?.length) return null;
  const { openRoomDetails } = useRoomDetails();
  return (
    <section id="rooms" className="site-rooms-section site-rooms-v8 relative overflow-hidden py-24 md:py-32" style={{ backgroundColor: "color-mix(in oklab, var(--site-primary) 6%, #f5f5f4)" }}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.4em]" style={{ color: "var(--site-primary)" }}>Stay</p>
          <h2 className="hotel-title text-4xl font-semibold tracking-tight text-neutral-950 md:text-5xl" style={{ fontFamily: SERIF }}>Rooms & Suites</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {data.rooms.map((room) => (
            <article data-room-clickable role="button" tabIndex={0} onClick={() => openRoomDetails(room, data.whatsapp)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openRoomDetails(room, data.whatsapp); } }} key={room.name} className="hotel-card group relative flex flex-col overflow-hidden rounded-[2rem] border border-white/40 bg-white/60 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] cursor-pointer">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] m-2">
                <img src={room.image} alt={room.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute right-3 top-3 rounded-full border border-white/40 bg-white/70 px-3 py-1 text-xs font-medium text-neutral-900 backdrop-blur-md">
                  <span style={{ color: "var(--site-primary)" }}>{room.price}</span>
                  <span className="text-neutral-500"> / night</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6 pt-2">
                <h3 className="hotel-title text-xl font-semibold tracking-tight text-neutral-950" style={{ fontFamily: SERIF }}>{room.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{room.description}</p>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); const href = bookRoomWaHref(data.whatsapp, room.name); if (href !== "#") window.open(href, "_blank", "noopener,noreferrer"); }}
                  className="mt-5 inline-flex h-11 items-center justify-center rounded-full text-sm font-medium text-white shadow-sm transition-all hover:scale-[1.02]"
                  style={{ backgroundColor: "var(--site-primary)" }}
                >
                  Book Room
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
