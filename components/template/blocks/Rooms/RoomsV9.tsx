"use client";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF, bookRoomWaHref } from "@/components/template/blocks/shared";
import { useRoomDetails } from "@/components/rooms/RoomDetailsContext";

/** v9 — Cinematic Elegant Minimal: cinematic full-bleed room rows divided by hairlines. */
export function RoomsV9({ data }: BlockProps) {
  if (!data.rooms?.length) return null;
  const { openRoomDetails } = useRoomDetails();
  return (
    <section id="rooms" className="site-rooms-section site-rooms-v9 bg-white">
      <div className="mx-auto max-w-3xl px-6 pt-24 text-center md:pt-32">
        <p className="text-[11px] font-light uppercase tracking-[0.55em]" style={{ color: "var(--site-primary)" }}>Stay</p>
        <div className="mx-auto mt-6 h-px w-12 bg-neutral-300" />
        <h2 className="hotel-title mt-8 text-4xl font-light tracking-tight text-neutral-950 md:text-6xl" style={{ fontFamily: SERIF }}>
          Rooms & Suites
        </h2>
      </div>
      <div className="mt-20 divide-y divide-neutral-200">
        {data.rooms.map((room, i) => {
          const reverse = i % 2 === 1;
          return (
            <article data-room-clickable role="button" tabIndex={0} onClick={() => openRoomDetails(room, data.whatsapp)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openRoomDetails(room, data.whatsapp); } }} key={room.name} className="hotel-card grid items-center gap-0 md:grid-cols-2 cursor-pointer">
              <div className={`relative ${reverse ? "md:order-2" : ""}`}>
                <img src={room.image} alt={room.name} loading="lazy" className="h-[60vh] w-full object-cover md:h-[75vh]" />
              </div>
              <div className={`flex flex-col justify-center px-6 py-16 md:px-16 md:py-24 ${reverse ? "md:order-1" : ""}`}>
                <p className="text-[11px] font-light uppercase tracking-[0.45em]" style={{ color: "var(--site-primary)" }}>{String(i + 1).padStart(2, "0")} · Suite</p>
                <h3 className="hotel-title mt-5 text-3xl font-light leading-tight tracking-tight text-neutral-950 md:text-5xl" style={{ fontFamily: SERIF }}>{room.name}</h3>
                <div className="mt-6 h-px w-12 bg-neutral-300" />
                <p className="mt-6 max-w-md text-base font-light leading-relaxed tracking-wide text-neutral-600">{room.description}</p>
                <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs font-light uppercase tracking-[0.2em] text-neutral-500">
                  {room.features.slice(0, 4).map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <div className="mt-10 flex items-center gap-8">
                  <p className="text-2xl font-light tracking-wide text-neutral-950" style={{ fontFamily: SERIF }}>{room.price}<span className="ml-2 text-[10px] uppercase tracking-[0.3em] text-neutral-500">per night</span></p>
                  <button onClick={(e) => { e.stopPropagation(); const href = bookRoomWaHref(data.whatsapp, room.name); if (href !== "#") window.open(href, "_blank", "noopener,noreferrer"); }} type="button" className="inline-flex h-11 items-center justify-center rounded-none border border-neutral-900 px-8 text-[11px] font-medium uppercase tracking-[0.35em] text-neutral-900 transition-all hover:bg-neutral-900 hover:text-white">
                    Reserve
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
