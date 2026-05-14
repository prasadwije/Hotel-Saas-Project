"use client";
import { createContext, useContext } from "react";
import { SERIF, type SubPageKey, type LayoutPreference, type HotelData } from "./shared-logic";

// මෙතනින් shared-logic එකේ තියෙන ඔක්කොම එළියට දෙනවා (V1-V10 blocks වලට ලේසි වෙන්න)
export * from "./shared-logic";

export function layoutClasses(
  pref: LayoutPreference | undefined,
  desktopGrid: string,
  desktopGap: string,
  mobileItemBasis = "w-[82%] min-w-[82%]",
) {
  if (pref === "carousel") {
    return {
      container: `site-carousel-scroller -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-6 px-6 pb-4 md:mx-0 md:grid ${desktopGrid} ${desktopGap} md:overflow-visible md:px-0 md:pb-0`,
      item: `${mobileItemBasis} shrink-0 snap-center md:w-auto md:min-w-0`,
      isCarousel: true as const,
    };
  }
  return {
    container: `grid grid-cols-1 ${desktopGap} ${desktopGrid}`,
    item: "",
    isCarousel: false as const,
  };
}

export function CarouselHint() {
  return (
    <div className="site-carousel-hint mt-4 flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-neutral-400 md:hidden">
      <span className="h-px w-6 bg-neutral-300" /> Swipe <span aria-hidden>→</span> <span className="h-px w-6 bg-neutral-300" />
    </div>
  );
}

export function SectionHeader({ eyebrow, title, rule = true }: { eyebrow: string; title: string; rule?: boolean; }) {
  return (
    <div className="mb-16 text-center">
      <p className="hotel-text mb-4 text-xs uppercase tracking-[0.35em]" style={{ color: "var(--site-primary)" }}>{eyebrow}</p>
      <h2 className="hotel-title text-4xl font-light tracking-tight text-neutral-900 md:text-5xl" style={{ fontFamily: SERIF }}>{title}</h2>
      {rule && <div className="mx-auto mt-6 h-px w-16" style={{ backgroundColor: "var(--site-primary)" }} />}
    </div>
  );
}

export function openRoomBookingWhatsapp(whatsapp?: string, roomName?: string) {
  // Client-only logic
  if (typeof window !== "undefined") {
    const num = whatsapp?.replace(/\D/g, "");
    const text = roomName ? `Hello, I'd like to book the "${roomName}".` : `Hello!`;
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(text)}`, "_blank");
  }
}

// --- Context & Hooks ---
const DedicatedPageContext = createContext<SubPageKey | null>(null);
export const DedicatedPageProvider = DedicatedPageContext.Provider;

export function useIsDedicatedPage(key: SubPageKey): boolean {
  return useContext(DedicatedPageContext) === key;
}