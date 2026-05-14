"use client";

import Link from "next/link";
import type { BlockProps } from "@/components/template/blocks/shared";
import { getFooterLinks } from "@/components/template/blocks/shared";
import { Globe, Camera } from "lucide-react";

export function FooterV1({ data }: BlockProps) {
  const links = getFooterLinks(data);
  return (
    <footer className="site-footer site-footer-v1 border-t border-neutral-200 bg-white py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-start md:justify-between md:text-left">
          <div>
            <p className="text-base font-semibold tracking-tight text-neutral-900">{data.businessName}</p>
            <p className="site-footer-contact mt-2 max-w-xs text-sm text-neutral-500">{data.address}</p>
            <p className="mt-1 text-sm text-neutral-500">{data.phone}</p>
          </div>
          {links.length > 0 && (
            <nav className="site-footer-nav flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-neutral-600">
              {links.map((l) =>
                l.type === "path" ? (
                  <Link key={l.id} href={l.href} className="site-footer-link transition-colors hover:text-neutral-900">
                    {l.label}
                  </Link>
                ) : (
                  <a key={l.id} href={l.href} className="site-footer-link transition-colors hover:text-neutral-900">
                    {l.label}
                  </a>
                ),
              )}
            </nav>
          )}
          <nav className="site-socials flex items-center gap-3">
            {data.socialLinks?.facebook && (
              <a href={data.socialLinks?.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="site-social-link inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 transition-colors hover:border-transparent hover:text-white" onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--site-primary)")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                <Globe className="h-4 w-4" />
              </a>
            )}
            {data.socialLinks?.instagram && (
              <a href={data.socialLinks?.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="site-social-link inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 transition-colors hover:border-transparent hover:text-white" onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--site-primary)")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                <Camera className="h-4 w-4" />
              </a>
            )}
          </nav>
        </div>
        <div className="mt-10 border-t border-neutral-100 pt-6 text-center text-xs text-neutral-400">
          © {new Date().getFullYear()} {data.businessName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
