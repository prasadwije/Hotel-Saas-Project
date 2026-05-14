"use client";
import { Phone, MessageCircle } from "lucide-react";
import type { BlockProps } from "@/components/template/blocks/shared";
import { telHrefOf, waHrefOf } from "@/components/template/blocks/shared";

// V2 — Floating pill-shaped buttons
export function StickyBarV2({ data }: BlockProps) {
  const telHref = telHrefOf(data.phone);
  const waHref = waHrefOf(data.whatsapp);
  return (
    <div className="site-bottom-bar site-bottom-bar-v2 fixed inset-x-0 bottom-0 z-50 flex items-center justify-center gap-3 px-4 pb-4 pt-2 md:hidden" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)" }}>
      <a href={telHref} className="site-call-btn inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white/95 px-6 text-sm font-medium text-neutral-900 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl transition-transform active:scale-95">
        <Phone className="h-4 w-4" />Call
      </a>
      <a href={waHref} target="_blank" rel="noreferrer" className="site-whatsapp-btn inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-medium text-white shadow-2xl ring-1 ring-black/10 transition-transform active:scale-95" style={{ backgroundColor: "var(--site-primary)" }}>
        <MessageCircle className="h-4 w-4" />WhatsApp
      </a>
    </div>
  );
}
