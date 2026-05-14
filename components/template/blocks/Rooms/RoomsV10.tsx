"use client";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF, bookRoomWaHref } from "@/components/template/blocks/shared";
import { useRoomDetails } from "@/components/rooms/RoomDetailsContext";

/** v10 — Floating Layered Editorial: each room is an image with a floating solid card overlapping. */
export function RoomsV10({ data }: BlockProps) {
  if (!data.rooms?.length) return null;
  const { openRoomDetails } = useRoomDetails();
  return (
    <section id="rooms" className="site-rooms-section site-rooms-v10 bg-neutral-50 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-20 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.45em]" style={{ color: "var(--site-primary)" }}>Stay</p>
          <h2 className="hotel-title mt-4 text-4xl font-light tracking-tight text-neutral-950 md:text-5xl" style={{ fontFamily: SERIF }}>Rooms & Suites</h2>
        </div>
        <div className="space-y-24 md:space-y-28">
          {data.rooms.map((room, i) => {
            const reverse = i % 2 === 1;
            return (
              <article data-room-clickable role="button" tabIndex={0} onClick={() => openRoomDetails(room, data.whatsapp)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openRoomDetails(room, data.whatsapp); } }} key={room.name} className="hotel-card relative grid grid-cols-12 items-center cursor-pointer">
                <div className={`col-span-12 md:col-span-8 ${reverse ? "md:col-start-5" : ""}`}>
                  <img src={room.image} alt={room.name} loading="lazy" className="h-[60vh] w-full object-cover md:h-[70vh]" />
                </div>
                <div className={`relative z-10 col-span-12 -mt-20 px-4 md:col-span-5 md:-mt-0 ${reverse ? "md:col-start-1 md:row-start-1 md:-mr-20 md:px-0" : "md:col-start-8 md:row-start-1 md:-ml-20 md:px-0"}`}>
                  <div className="rounded-sm bg-white p-8 shadow-2xl shadow-neutral-950/15 md:p-12">
                    <p className="text-[11px] font-medium uppercase tracking-[0.4em]" style={{ color: "var(--site-primary)" }}>Suite {String(i + 1).padStart(2, "0")}</p>
                    <h3 className="hotel-title mt-4 text-3xl font-light leading-tight tracking-tight text-neutral-950 md:text-4xl" style={{ fontFamily: SERIF }}>{room.name}</h3>
                    <p className="mt-4 text-sm font-light leading-relaxed text-neutral-600 md:text-base">{room.description}</p>
                    <div className="mt-6 flex items-center justify-between">
                      <p className="text-xl font-light text-neutral-950" style={{ fontFamily: SERIF }}>{room.price}<span className="ml-1 text-[10px] uppercase tracking-[0.3em] text-neutral-500">/night</span></p>
                      <button onClick={(e) => { e.stopPropagation(); const href = bookRoomWaHref(data.whatsapp, room.name); if (href !== "#") window.open(href, "_blank", "noopener,noreferrer"); }} type="button" className="inline-flex h-11 items-center justify-center rounded-full px-7 text-xs font-medium tracking-wide text-white shadow-sm transition-all hover:scale-[1.02]" style={{ backgroundColor: "var(--site-primary)" }}>
                        Reserve
                      </button>
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
