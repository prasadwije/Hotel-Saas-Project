"use client";
import Link from "next/link";
import { Globe, MapPin, Phone, Mail } from "lucide-react";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF, getFooterLinks } from "@/components/template/blocks/shared";

// V2 — Larger footer with newsletter signup
export function FooterV2({ data }: BlockProps) {
  const links = getFooterLinks(data);
  return (
    <footer className="site-footer site-footer-v2 bg-neutral-950 text-neutral-300">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <p className="text-2xl font-light tracking-tight text-white" style={{ fontFamily: SERIF }}>{data.businessName}</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-400">A quiet retreat — stay in touch for seasonal openings and offers.</p>
            <div className="mt-6 flex items-center gap-3">
              {data.socialLinks?.facebook && (
                <a href={data.socialLinks?.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-transparent hover:text-white" onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--site-primary)")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                  <Globe className="h-4 w-4" />
                </a>
              )}
              {data.socialLinks?.instagram && (
                <a href={data.socialLinks?.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-transparent hover:text-white" onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--site-primary)")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                  <Globe className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {links.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-white/50">Explore</p>
              <ul className="mt-4 space-y-3 text-sm">
                {links.map((l) => (
                  <li key={l.id}>
                    {l.type === "path" ? (
                      <Link href={l.href} className="site-footer-link text-neutral-300 transition-colors hover:text-white">
                        {l.label}
                      </Link>
                    ) : (
                      <a href={l.href} className="site-footer-link text-neutral-300 transition-colors hover:text-white">
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-white/50">Visit</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: "var(--site-primary)" }} /><span className="whitespace-pre-line text-neutral-300">{data.address}</span></li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" style={{ color: "var(--site-primary)" }} /><span>{data.phone}</span></li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-white/50">Newsletter</p>
            <p className="mt-3 text-sm text-neutral-400">Quiet updates, no more than once a month.</p>
            <form className="mt-5 flex w-full items-center gap-2 rounded-full border border-white/15 bg-white/5 p-1.5 backdrop-blur" onSubmit={(e) => e.preventDefault()}>
              <span className="pl-3 text-white/50"><Mail className="h-4 w-4" /></span>
              <input type="email" required placeholder="you@email.com" className="site-newsletter-input flex-1 bg-transparent px-2 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none" />
              <button type="submit" className="hotel-btn-primary site-newsletter-cta inline-flex h-10 items-center justify-center rounded-full px-5 text-xs font-medium uppercase tracking-[0.2em] text-white shadow-sm transition-transform hover:scale-[1.02]" style={{ backgroundColor: "var(--site-primary)" }}>Join</button>
            </form>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/40 md:flex-row">
          <span>© {new Date().getFullYear()} {data.businessName}. All rights reserved.</span>
          <span className="uppercase tracking-[0.3em]">Crafted with care</span>
        </div>
      </div>
    </footer>
  );
}
