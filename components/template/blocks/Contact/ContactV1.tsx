"use client";
import { useState } from "react";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SectionHeader } from "@/components/template/blocks/shared";
import { Mail } from "lucide-react";

export function ContactV1({ data }: BlockProps) {
  if (!data.enableContactForm) return null;
  const [sent, setSent] = useState(false);
  return (
    <section
      id="contact"
      className="site-contact-section site-contact-v1 relative overflow-hidden py-24 md:py-32"
      style={{
        background:
          "linear-gradient(135deg, color-mix(in oklab, var(--site-primary) 18%, #0a0a0a) 0%, #0a0a0a 100%)",
      }}
    >
      <div className="mx-auto max-w-2xl px-6">
        <div className="text-center text-white">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-white/70">Get in touch</p>
          <h2 className="hotel-title text-4xl font-light tracking-tight md:text-5xl">Send us a direct inquiry</h2>
          <div className="mx-auto mt-6 h-px w-16 bg-white/40" />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="mt-12 rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur-2xl shadow-2xl"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <input required placeholder="Your name" className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30" />
            <input required type="email" placeholder="Email" className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30" />
          </div>
          <textarea required rows={5} placeholder="Tell us about your stay…" className="mt-4 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30" />
          <button
            type="submit"
            className="hotel-btn-primary mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium uppercase tracking-[0.2em] text-white shadow-lg transition-transform hover:scale-[1.01]"
            style={{ backgroundColor: "var(--site-primary)" }}
          >
            <Mail className="h-4 w-4" /> {sent ? "Sent — thank you" : "Send inquiry"}
          </button>
          {data.contactEmail && (
            <p className="mt-4 text-center text-xs text-white/50">Or email us directly at {data.contactEmail}</p>
          )}
        </form>
      </div>
    </section>
  );
}