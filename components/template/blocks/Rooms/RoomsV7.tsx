"use client";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF, bookRoomWaHref } from "@/components/template/blocks/shared";
import { useRoomDetails } from "@/components/rooms/RoomDetailsContext";

/** v7 — Apple Product Page: huge title, full-bleed room cards stacked vertically. */
export function RoomsV7({ data }: BlockProps) {
  if (!data.rooms?.length) return null;
  const { openRoomDetails } = useRoomDetails();
  return (
    <section id="rooms" className="site-rooms-section site-rooms-v7 bg-white py-32 md:py-44">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <p className="mb-6 text-xs font-medium uppercase tracking-[0.4em] text-neutral-500">Stay</p>
        <h2 className="hotel-title text-balance text-5xl font-semibold leading-[0.95] tracking-tight text-neutral-950 md:text-7xl" style={{ fontFamily: SERIF }}>
          Designed for rest.
        </h2>
      </div>
      <div className="mt-20 space-y-6 px-4 md:space-y-8 md:px-8">
        {data.rooms.map((room, i) => {
          const reverse = i % 2 === 1;
          return (
            <article data-room-clickable role="button" tabIndex={0} onClick={() => openRoomDetails(room, data.whatsapp)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openRoomDetails(room, data.whatsapp); } }} key={room.name} className="hotel-card relative mx-auto flex max-w-7xl flex-col items-stretch overflow-hidden rounded-[2rem] bg-neutral-50 md:flex-row md:gap-12 md:p-12 cursor-pointer">
              <div className={`relative w-full overflow-hidden rounded-[1.5rem] md:flex-1 ${reverse ? "md:order-2" : ""}`}>
                <img src={room.image} alt={room.name} loading="lazy" className="h-[50vh] w-full object-cover transition-transform duration-700 hover:scale-[1.03] md:h-[60vh]" />
              </div>
              <div className={`flex w-full flex-col items-center p-8 text-center md:flex-1 md:items-start md:justify-center md:p-0 md:text-left ${reverse ? "md:order-1" : ""}`}>
                <p className="text-xs font-medium uppercase tracking-[0.35em]" style={{ color: "var(--site-primary)" }}>{room.price} / night</p>
                <h3 className="hotel-title mt-4 text-4xl font-semibold leading-tight tracking-tight text-neutral-950 md:text-6xl" style={{ fontFamily: SERIF }}>
                  {room.name}
                </h3>
                <p className="mt-5 text-base leading-relaxed text-neutral-600 md:text-lg">{room.description}</p>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); const href = bookRoomWaHref(data.whatsapp, room.name); if (href !== "#") window.open(href, "_blank", "noopener,noreferrer"); }}
                  className="mt-8 inline-flex h-12 w-fit items-center justify-center rounded-full px-8 text-sm font-medium text-white shadow-sm transition-all hover:scale-[1.03]"
                  style={{ backgroundColor: "var(--site-primary)" }}
                >
                  Book now
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
