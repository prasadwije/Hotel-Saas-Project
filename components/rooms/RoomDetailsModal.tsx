import { useMemo, useState } from "react";
import { Check, X, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SERIF, amenityIcon, bookRoomWaHref } from "@/components/template/blocks/shared";
import { useRoomDetails } from "./RoomDetailsContext";

function SmartImage({
  src,
  alt,
  className = "",
  imgClassName = "",
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <div className={`relative overflow-hidden bg-neutral-100 ${className}`}>
      {!loaded && !failed && (
        <div
          aria-hidden
          className="absolute inset-0 animate-pulse bg-[linear-gradient(110deg,#ececec_8%,#f5f5f5_18%,#ececec_33%)] bg-[length:200%_100%]"
          style={{ animation: "site-shimmer 1.6s linear infinite" }}
        />
      )}
      {failed ? (
        <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-[0.3em] text-neutral-400">
          Image unavailable
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"
            } ${imgClassName}`}
        />
      )}
      <style>{`@keyframes site-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
    </div>
  );
}

export function RoomDetailsModal() {
  const { isOpen, room, whatsapp, closeRoomDetails } = useRoomDetails();

  const images = useMemo(() => {
    if (!room) return [] as string[];
    const all = [room.image, ...(room.gallery ?? [])].filter(Boolean);
    // Dedupe while preserving order.
    return Array.from(new Set(all));
  }, [room]);

  if (!room) return null;

  const lead = images[0];
  const rest = images.slice(1);

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && closeRoomDetails()}>
      <DialogContent
        className="site-room-details-modal left-1/2 top-1/2 w-[calc(100vw-2rem)] max-w-5xl -translate-x-1/2 -translate-y-1/2 gap-0 overflow-hidden rounded-2xl border border-white/40 bg-white/95 p-0 shadow-2xl backdrop-blur-2xl sm:w-full sm:rounded-2xl [&>button]:hidden"
      >
        <DialogTitle className="sr-only">{room.name}</DialogTitle>
        <DialogDescription className="sr-only">{room.description}</DialogDescription>

        <button
          type="button"
          onClick={closeRoomDetails}
          aria-label="Close"
          className="absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/80 text-neutral-800 shadow-sm backdrop-blur-md transition hover:scale-105 hover:bg-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid max-h-[90vh] grid-cols-1 overflow-y-auto md:grid-cols-5">
          {/* Visuals */}
          <div className="bg-neutral-100 md:col-span-3">
            {lead && (
              <SmartImage
                src={lead}
                alt={room.name}
                className="aspect-[4/3] w-full md:aspect-auto md:h-[320px]"
              />
            )}
            {rest.length > 0 && (
              <div className="grid grid-cols-2 gap-1 p-1">
                {rest.map((src, i) => (
                  <SmartImage
                    key={i}
                    src={src}
                    alt={`${room.name} ${i + 2}`}
                    className="aspect-square"
                    imgClassName="transition-transform duration-700 hover:scale-105"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6 p-8 md:col-span-2 md:p-10">
            <div>
              <p
                className="text-[11px] font-medium uppercase tracking-[0.4em]"
                style={{ color: "var(--site-primary)" }}
              >
                {room.price}
              </p>
              <h3
                className="hotel-title mt-3 text-3xl font-light leading-tight tracking-tight text-neutral-950 md:text-4xl"
                style={{ fontFamily: SERIF }}
              >
                {room.name}
              </h3>
            </div>

            <p className="text-sm font-light leading-relaxed text-neutral-600">{room.description}</p>

            {!!room.features?.length && (
              <div>
                <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.35em] text-neutral-500">
                  Highlights
                </p>
                <ul className="grid grid-cols-2 gap-y-2 gap-x-3 text-xs text-neutral-700">
                  {room.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "var(--site-primary)" }} />
                      <span className="tracking-wide">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!!room.amenities?.length && (
              <div>
                <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.35em] text-neutral-500">
                  In-room amenities
                </p>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((a) => {
                    const Icon = amenityIcon(a);
                    return (
                      <span
                        key={a}
                        className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-sm"
                      >
                        <Icon className="h-3.5 w-3.5" style={{ color: "var(--site-primary)" }} />
                        {a}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-auto flex flex-col gap-3 pt-4">
              {whatsapp ? (
                <a
                  href={bookRoomWaHref(whatsapp, room.name)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-medium text-white shadow-sm transition-transform hover:scale-[1.02]"
                  style={{ backgroundColor: "var(--site-primary)" }}
                >
                  <MessageCircle className="h-4 w-4" />
                  Book via WhatsApp
                </a>
              ) : null}
              <button
                type="button"
                onClick={closeRoomDetails}
                className="inline-flex h-11 w-full items-center justify-center rounded-full border border-neutral-200 bg-white px-6 text-sm font-medium text-neutral-800 shadow-sm transition hover:bg-neutral-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}