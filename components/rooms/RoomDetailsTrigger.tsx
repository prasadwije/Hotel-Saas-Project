import { ArrowUpRight } from "lucide-react";
import type { Room } from "@/components/template/blocks/shared";
import { useRoomDetails } from "./RoomDetailsContext";

/** Small, unobtrusive "View details" link injected into every Rooms variant.
 *  It uses the RoomDetails context, so it's a drop-in with no per-variant wiring. */
export function ViewDetailsLink({
  room,
  className = "",
  variant = "light",
}: {
  room: Room;
  className?: string;
  variant?: "light" | "dark";
}) {
  const { openRoomDetails } = useRoomDetails();
  const tone =
    variant === "dark"
      ? "text-white/85 hover:text-white"
      : "text-neutral-600 hover:text-neutral-900";
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        openRoomDetails(room);
      }}
      className={`site-room-details-link inline-flex items-center gap-1 text-xs font-medium uppercase tracking-[0.2em] transition-colors ${tone} ${className}`}
    >
      View details
      <ArrowUpRight className="h-3.5 w-3.5" />
    </button>
  );
}