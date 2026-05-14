"use client";
import { Phone, MessageCircle } from "lucide-react";
import type { BlockProps } from "@/components/template/blocks/shared";
import { telHrefOf, waHrefOf } from "@/components/template/blocks/shared";

export function StickyBarV1({ data }: BlockProps) {
  const telHref = telHrefOf(data.phone);
  const waHref = waHrefOf(data.whatsapp);
  return (
    <div className="site-bottom-bar site-bottom-bar-v1 fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 border-t border-neutral-200 bg-white shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.15)] md:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <a href={telHref} className="site-call-btn flex items-center justify-center gap-2 py-4 text-sm font-medium text-neutral-900 active:bg-neutral-100">
        <Phone className="h-4 w-4" />Call Now
      </a>
      <a href={waHref} target="_blank" rel="noreferrer" className="site-whatsapp-btn flex items-center justify-center gap-2 py-4 text-sm font-medium text-white" style={{ backgroundColor: "var(--site-primary)" }}>
        <MessageCircle className="h-4 w-4" />WhatsApp
      </a>
    </div>
  );
}
