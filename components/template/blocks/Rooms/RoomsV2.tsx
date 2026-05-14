"use client";
import { Check } from "lucide-react";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SectionHeader, SERIF, bookRoomWaHref } from "@/components/template/blocks/shared";
import { useRoomDetails } from "@/components/rooms/RoomDetailsContext";

export function RoomsV2({ data }: BlockProps) {
  if (!data.rooms?.length) return null;
  const { openRoomDetails } = useRoomDetails();
  return (
    <section id="rooms" className="site-rooms-section site-rooms-v2 bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader eyebrow="Stay" title="Rooms & Suites" />
        <div className="site-rooms-stack space-y-20 md:space-y-28">
          {data.rooms.map((room, i) => {
            const reverse = i % 2 === 1;
            return (
              <article data-room-clickable role="button" tabIndex={0} onClick={() => openRoomDetails(room, data.whatsapp)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openRoomDetails(room, data.whatsapp); } }} key={room.name} className={`site-room-row grid items-center gap-10 md:grid-cols-2 md:gap-16 ${reverse ? "md:[&>div:first-child]:order-2" : ""}`}>
                <div className="site-room-visual relative">
                  <div className="absolute -inset-3 -z-10 rounded-3xl md:-inset-5" style={{ background: "linear-gradient(135deg, color-mix(in oklab, var(--site-primary) 16%, transparent), transparent)" }} />
                  <div className="overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/5">
                    <img src={room.image} alt={room.name} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105" />
                  </div>
                </div>
                <div className="site-room-copy">
                  <p className="text-xs uppercase tracking-[0.35em]" style={{ color: "var(--site-primary)" }}>Room {String(i + 1).padStart(2, "0")}</p>
                  <h3 className="hotel-title mt-3 text-3xl font-light leading-tight text-neutral-900 md:text-4xl" style={{ fontFamily: SERIF }}>{room.name}</h3>
                  <p className="mt-4 text-base leading-relaxed text-neutral-600">{room.description}</p>
                  <ul className="mt-6 grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-neutral-700">
                    {room.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <Check className="h-4 w-4 flex-shrink-0" style={{ color: "var(--site-primary)" }} />
                        <span className="tracking-wide">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex items-center gap-6">
                    <div>
                      <p className="text-3xl font-light" style={{ fontFamily: SERIF, color: "var(--site-primary)" }}>{room.price}</p>
                      <p className="text-xs uppercase tracking-widest text-neutral-500">per night</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); const href = bookRoomWaHref(data.whatsapp, room.name); if (href !== "#") window.open(href, "_blank", "noopener,noreferrer"); }}
                      className="inline-flex h-12 items-center justify-center rounded-full px-7 text-sm font-medium text-white shadow-sm transition-transform hover:scale-[1.02]"
                      style={{ backgroundColor: "var(--site-primary)" }}
                    >
                      Book Room
                    </button>
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
