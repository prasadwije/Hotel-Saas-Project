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

/** v1 — Classic: transparent over hero, frosted white on scroll. */
export function HeaderV1({ data, scrolled, forceSolidHeader, navLinks, onReserve, sticky }: HeaderProps) {
  const lightHeader = !forceSolidHeader && !scrolled;
  return (
    <header
      className={`site-header ${headerPositionClass(sticky)} transition-all duration-300 ${scrolled || forceSolidHeader
        ? "bg-white/90 backdrop-blur border-b border-neutral-200/70"
        : "bg-transparent"
        }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
        <Link
          href="/"
          className={`site-brand text-lg font-semibold tracking-tight transition-colors ${lightHeader ? "text-white" : "text-neutral-900"
            }`}
        >
          {data.businessName}
        </Link>

        <nav className="site-nav hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavItem
              key={link.id}
              link={link}
              className={`site-nav-link hotel-nav-link text-sm font-medium tracking-wide transition-colors hover:opacity-70 ${lightHeader ? "text-white/90" : "text-neutral-700"
                }`}
            />
          ))}
          <button
            type="button"
            onClick={onReserve}
            className="site-primary-btn site-nav-cta hotel-btn-primary inline-flex items-center rounded-full px-5 py-2 text-sm font-medium text-white shadow-sm transition-transform hover:scale-[1.02]"
            style={{ backgroundColor: "var(--site-primary)" }}
          >
            Reserve
          </button>
        </nav>

        <Sheet>
          <SheetTrigger asChild>
            <button
              aria-label="Open menu"
              className={`site-hamburger md:hidden inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors ${lightHeader
                ? "text-white hover:bg-white/10"
                : "text-neutral-900 hover:bg-neutral-100"
                }`}
            >
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="site-mobile-menu w-full sm:max-w-sm border-l border-neutral-200 bg-white p-0 [&>button]:hidden"
          >
            <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-5">
              <span className="text-base font-semibold tracking-tight">{data.businessName}</span>
              <SheetClose asChild>
                <button
                  aria-label="Close menu"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-100"
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
                    className="site-nav-link hotel-nav-link border-b border-neutral-100 py-5 text-lg font-medium text-neutral-900"
                  />
                </SheetClose>
              ))}
              <SheetClose asChild>
                <button
                  type="button"
                  onClick={onReserve}
                  className="site-primary-btn hotel-btn-primary mt-8 inline-flex items-center justify-center rounded-full px-6 py-4 text-base font-medium text-white shadow-sm"
                  style={{ backgroundColor: "var(--site-primary)" }}
                >
                  Reserve
                </button>
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}