"use client";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { NavItem, headerPositionClass, type HeaderProps } from "./HeaderShared";

/**
 * v4 — Minimal Underline: thin always-solid bar with an animated primary-color
 * underline indicator on hover for each nav item, ghost outline CTA. Editorial
 * and quiet — perfect for content-heavy multi-page sites.
 */
export function HeaderV4({ data, navLinks, onReserve, sticky }: HeaderProps) {
  return (
    <header className={`site-header site-header-v4 ${headerPositionClass(sticky)} border-b border-neutral-200/80 bg-white/85 backdrop-blur`}>
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-6 px-5 md:px-10">
        <Link
          href="/"
          className="site-brand text-[15px] font-semibold tracking-tight text-neutral-900"
        >
          {data.businessName}
        </Link>

        <nav className="site-nav hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavItem
              key={link.id}
              link={link}
              className="site-nav-link group relative px-3 py-2 text-[13px] font-medium text-neutral-700 transition-colors hover:text-neutral-900"
            />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReserve}
            className="hidden md:inline-flex site-primary-btn items-center rounded-full border px-4 py-1.5 text-[13px] font-medium transition-all hover:text-white"
            style={{
              borderColor: "var(--site-primary)",
              color: "var(--site-primary)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--site-primary)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--site-primary)";
            }}
          >
            Reserve
          </button>

          <Sheet>
            <SheetTrigger asChild>
              <button
                aria-label="Open menu"
                className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-900 hover:bg-neutral-100"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="site-mobile-menu w-full sm:max-w-sm border-l border-neutral-200 bg-white p-0 [&>button]:hidden"
            >
              <div className="flex h-14 items-center justify-between border-b border-neutral-200 px-5">
                <span className="text-base font-semibold tracking-tight">{data.businessName}</span>
                <SheetClose asChild>
                  <button
                    aria-label="Close menu"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </SheetClose>
              </div>
              <nav className="flex flex-col px-5 py-6">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.id}>
                    <NavItem
                      link={link}
                      className="border-b border-neutral-100 py-5 text-[15px] font-medium text-neutral-900"
                    />
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <button
                    type="button"
                    onClick={onReserve}
                    className="site-primary-btn mt-8 inline-flex items-center justify-center rounded-full px-6 py-4 text-base font-medium text-white shadow-sm"
                    style={{ backgroundColor: "var(--site-primary)" }}
                  >
                    Reserve
                  </button>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* underline indicator styles */}
      <style>{`
        .site-header-v4 .site-nav-link::after{
          content:""; position:absolute; left:12px; right:12px; bottom:6px;
          height:2px; background: var(--site-primary);
          transform: scaleX(0); transform-origin: left center;
          transition: transform .35s ease;
          border-radius: 2px;
        }
        .site-header-v4 .site-nav-link:hover::after{ transform: scaleX(1); }
      `}</style>
    </header>
  );
}