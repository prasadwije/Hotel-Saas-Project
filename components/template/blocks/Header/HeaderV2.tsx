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
 * v2 — Apple "Dynamic Island" Glass: a floating, centered glass capsule that
 * gently widens / lifts on scroll. Heavy backdrop-blur, hairline border,
 * subtle inner highlight, and a layered drop shadow.
 */
export function HeaderV2({ data, scrolled, navLinks, onReserve, sticky }: HeaderProps) {
  return (
    <header className={`site-header site-header-v2 ${headerPositionClass(sticky)} pointer-events-none`}>
      <div
        className={`mx-auto flex items-center justify-between gap-3 transition-all duration-500 ease-out pointer-events-auto
          ${scrolled ? "mt-2 max-w-3xl px-2 md:px-3" : "mt-4 max-w-5xl px-3 md:px-4"}
        `}
      >
        <div
          className={`relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-full border border-white/30 bg-white/15 px-3 py-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition-all duration-500 md:px-4
            ${scrolled ? "border-neutral-200/70 bg-white/70" : ""}
          `}
          style={{
            backgroundImage:
              "linear-gradient(180deg, color-mix(in oklab, white 35%, transparent) 0%, color-mix(in oklab, white 5%, transparent) 100%)",
          }}
        >
          {/* glossy top highlight */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent"
          />
          <Link
            href="/"
            className={`site-brand pl-2 text-sm font-semibold tracking-tight transition-colors md:text-base ${scrolled ? "text-neutral-900" : "text-white drop-shadow"
              }`}
          >
            {data.businessName}
          </Link>

          <nav className="site-nav hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavItem
                key={link.id}
                link={link}
                className={`site-nav-link rounded-full px-3 py-1.5 text-[13px] font-medium tracking-wide transition-all hover:bg-white/30 ${scrolled ? "text-neutral-700 hover:bg-neutral-900/5" : "text-white/90"
                  }`}
              />
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onReserve}
              className="hidden md:inline-flex site-primary-btn site-nav-cta items-center rounded-full px-4 py-1.5 text-[13px] font-medium text-white shadow-sm transition-transform hover:scale-[1.03]"
              style={{ backgroundColor: "var(--site-primary)" }}
            >
              Reserve
            </button>

            <Sheet>
              <SheetTrigger asChild>
                <button
                  aria-label="Open menu"
                  className={`md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors ${scrolled ? "text-neutral-900 hover:bg-neutral-900/5" : "text-white hover:bg-white/15"
                    }`}
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="site-mobile-menu w-full sm:max-w-sm border-l border-white/40 bg-white/80 p-0 backdrop-blur-2xl [&>button]:hidden"
              >
                <div className="flex h-16 items-center justify-between border-b border-neutral-200/60 px-5">
                  <span className="text-base font-semibold tracking-tight">{data.businessName}</span>
                  <SheetClose asChild>
                    <button
                      aria-label="Close menu"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-900/5"
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
                        className="site-nav-link border-b border-neutral-200/60 py-5 text-lg font-medium text-neutral-900"
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
      </div>
    </header>
  );
}