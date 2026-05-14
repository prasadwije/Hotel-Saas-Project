import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Room } from "@/components/template/blocks/shared";

type RoomDetailsCtx = {
  isOpen: boolean;
  room?: Room;
  whatsapp?: string;
  openRoomDetails: (room: Room, whatsapp?: string) => void;
  closeRoomDetails: () => void;
};

const Ctx = createContext<RoomDetailsCtx | null>(null);

export function RoomDetailsProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [room, setRoom] = useState<Room | undefined>(undefined);
  const [whatsapp, setWhatsapp] = useState<string | undefined>(undefined);

  const openRoomDetails = useCallback((r: Room, wa?: string) => {
    setRoom(r);
    setWhatsapp(wa);
    setOpen(true);
  }, []);
  const closeRoomDetails = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, room, whatsapp, openRoomDetails, closeRoomDetails }),
    [isOpen, room, whatsapp, openRoomDetails, closeRoomDetails],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** Safe hook — returns a no-op opener when used outside a provider. */
export function useRoomDetails(): RoomDetailsCtx {
  const ctx = useContext(Ctx);
  if (ctx) return ctx;
  return {
    isOpen: false,
    room: undefined,
    whatsapp: undefined,
    openRoomDetails: () => { },
    closeRoomDetails: () => { },
  };
}