"use client";
import { useState } from "react";
import type { BlockProps } from "@/components/template/blocks/shared";
import { firstHeroImage } from "@/components/template/blocks/shared";
import { Mail } from "lucide-react";

export function ContactV2({ data }: BlockProps) {
  if (!data.enableContactForm) return null;
  const [sent, setSent] = useState(false);
  const img = firstHeroImage(data) ?? data.galleryImages?.[0];
  return (
    <section id="contact" className="site-contact-section site-contact-v2 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative min-h-[320px] bg-neutral-200 lg:min-h-[600px]">
          {img && <img src={img} alt="Contact" className="absolute inset-0 h-full w-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-black/10" />
          <div className="relative flex h-full flex-col justify-end p-10 text-white">
            <p className="text-[10px] uppercase tracking-[0.35em] text-white/70">Direct inquiry</p>
            <h2 className="hotel-title mt-3 text-4xl font-light tracking-tight md:text-5xl">We'd love to hear from you</h2>
            {data.contactEmail && <p className="mt-4 text-sm text-white/80">{data.contactEmail}</p>}
          </div>
        </div>
        <div className="flex items-center justify-center bg-neutral-50 px-6 py-16 md:py-24">
          <form
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            className="w-full max-w-md space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <input required placeholder="First name" className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm focus:border-neutral-900 focus:outline-none" />
              <input required placeholder="Last name" className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm focus:border-neutral-900 focus:outline-none" />
            </div>
            <input required type="email" placeholder="Email" className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm focus:border-neutral-900 focus:outline-none" />
            <input placeholder="Subject" className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm focus:border-neutral-900 focus:outline-none" />
            <textarea required rows={5} placeholder="Your message…" className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm focus:border-neutral-900 focus:outline-none" />
            <button
              type="submit"
              className="hotel-btn-primary inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium uppercase tracking-[0.2em] text-white shadow-sm transition-transform hover:scale-[1.01]"
              style={{ backgroundColor: "var(--site-primary)" }}
            >
              <Mail className="h-4 w-4" /> {sent ? "Sent — thank you" : "Send message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}