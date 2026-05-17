"use client";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { bookRoomWaHref } from "@/components/template/blocks/shared-logic";

type BookingCtx = {
  isOpen: boolean;
  roomName?: string;
  openBooking: (roomName?: string) => void;
  closeBooking: () => void;
};

const Ctx = createContext<BookingCtx | null>(null);

export function BookingProvider({ 
  children, 
  whatsapp, 
  isBookingEngineEnabled 
}: { 
  children: ReactNode;
  whatsapp?: string;
  isBookingEngineEnabled?: boolean;
}) {
  const [isOpen, setOpen] = useState(false);
  const [roomName, setRoomName] = useState<string | undefined>(undefined);

  const openBooking = useCallback((name?: string) => {
    if (isBookingEngineEnabled === false) {
      if (typeof window !== "undefined") {
        const href = bookRoomWaHref(whatsapp, name);
        if (href !== "#") window.open(href, "_blank", "noopener,noreferrer");
      }
      return;
    }
    setRoomName(name);
    setOpen(true);
  }, [isBookingEngineEnabled, whatsapp]);

  const closeBooking = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, roomName, openBooking, closeBooking }),
    [isOpen, roomName, openBooking, closeBooking],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** Safe hook — returns a no-op opener when used outside a provider so blocks
 *  rendered standalone (e.g. in Storybook or the admin preview) don't crash. */
export function useBooking(): BookingCtx {
  const ctx = useContext(Ctx);
  if (ctx) return ctx;
  return {
    isOpen: false,
    roomName: undefined,
    openBooking: () => { },
    closeBooking: () => { },
  };
}