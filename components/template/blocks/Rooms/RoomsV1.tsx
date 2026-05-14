"use client";
import { Check } from "lucide-react";
import type { BlockProps } from "@/components/template/blocks/shared";
import { CarouselHint, SectionHeader, SERIF, layoutClasses, bookRoomWaHref, isPageEnabled, useIsDedicatedPage } from "@/components/template/blocks/shared";
import { useRoomDetails } from "@/components/rooms/RoomDetailsContext";
import { ReadMoreCTA } from "@/components/template/ReadMoreCTA";

export function RoomsV1({ data }: BlockProps) {
  if (!data.rooms?.length) return null;
  const layout = layoutClasses(data.mobileLayouts?.rooms, "md:grid-cols-2 lg:grid-cols-3", "gap-8");
  const { openRoomDetails } = useRoomDetails();
  const truncate = isPageEnabled(data, "rooms") && !useIsDedicatedPage("rooms");
  const rooms = truncate ? data.rooms.slice(0, 3) : data.rooms;
  return (
    <section id="rooms" className="site-rooms-section site-rooms-v1 relative overflow-hidden py-24 md:py-32" style={{ background: "linear-gradient(180deg, #ffffff 0%, #fafaf9 100%)" }}>
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader eyebrow="Stay" title="Rooms & Suites" />
        <div className={`site-rooms-grid ${layout.container}`}>
          {rooms.map((room) => (
            <article data-room-clickable role="button" tabIndex={0} onClick={() => openRoomDetails(room, data.whatsapp)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openRoomDetails(room, data.whatsapp); } }} key={room.name} className={`site-room-card group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${layout.item} cursor-pointer`}>
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={room.image} alt={room.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 rounded-full bg-white/95 px-4 py-1.5 text-xs font-medium tracking-wide text-neutral-900 backdrop-blur">
                  <span style={{ color: "var(--site-primary)" }}>{room.price}</span>
                  <span className="text-neutral-500"> / night</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-7">
                <h3 className="hotel-title site-room-name text-2xl font-normal tracking-tight text-neutral-900" style={{ fontFamily: SERIF }}>{room.name}</h3>
                <p className="site-room-desc mt-3 text-sm leading-relaxed text-neutral-500">{room.description}</p>
                <ul className="site-room-features mt-5 grid grid-cols-2 gap-y-2 gap-x-3 text-xs text-neutral-700">
                  {room.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "var(--site-primary)" }} />
                      <span className="tracking-wide">{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); const href = bookRoomWaHref(data.whatsapp, room.name); if (href !== "#") window.open(href, "_blank", "noopener,noreferrer"); }}
                  className="site-room-cta mt-7 inline-flex h-11 items-center justify-center rounded-full text-sm font-medium text-white shadow-sm transition-transform hover:scale-[1.02]"
                  style={{ backgroundColor: "var(--site-primary)" }}
                >
                  Book Room
                </button>
              </div>
            </article>
          ))}
        </div>
        {layout.isCarousel && <CarouselHint />}
        <div className="mt-10 flex justify-center">
          <ReadMoreCTA data={data} sectionKey="rooms" label="View all rooms" />
        </div>
      </div>
    </section>
  );
}
