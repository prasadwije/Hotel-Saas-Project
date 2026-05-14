"use client";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { SERIF } from "@/components/template/blocks/shared";
import { NavItem, headerPositionClass, type HeaderProps } from "./HeaderShared";

/**
 * v3 — Split Centered Logo: classic luxury hotel layout. Nav links split
 * left and right of a serif centered wordmark. Hairline borders, generous
 * letter-spacing, optional Reserve pill on the right.
 */
export function HeaderV3({ data, scrolled, forceSolidHeader, navLinks, onReserve, sticky }: HeaderProps) {
  const lightHeader = !forceSolidHeader && !scrolled;
  const half = Math.ceil(navLinks.length / 2);
  const left = navLinks.slice(0, half);
  const right = navLinks.slice(half);

  const linkClass = `site-nav-link text-[11px] uppercase tracking-[0.32em] transition-colors hover:opacity-70 ${lightHeader ? "text-white/90" : "text-neutral-700"
    }`;

  return (
    <header
      className={`site-header site-header-v3 ${headerPositionClass(sticky)} transition-all duration-300 ${scrolled || forceSolidHeader
        ? "bg-white/95 backdrop-blur border-b border-neutral-200/70"
        : "bg-transparent"
        }`}
    >
      <div className="mx-auto grid h-20 max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-6 px-5 md:px-8">
        {/* Left nav (desktop) */}
        <nav className="hidden md:flex items-center justify-end gap-7">
          {left.map((l) => (
            <NavItem key={l.id} link={l} className={linkClass} />
          ))}
        </nav>

        {/* Mobile hamburger */}
        <div className="flex items-center md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button
                aria-label="Open menu"
                className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors ${lightHeader ? "text-white hover:bg-white/10" : "text-neutral-900 hover:bg-neutral-100"
                  }`}
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="site-mobile-menu w-full sm:max-w-sm border-r border-neutral-200 bg-white p-0 [&>button]:hidden"
            >
              <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-5">
                <span className="text-base font-semibold tracking-tight" style={{ fontFamily: SERIF }}>
                  {data.businessName}
                </span>
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
                      className="border-b border-neutral-100 py-5 text-[11px] uppercase tracking-[0.32em] text-neutral-900"
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

        {/* Centered serif wordmark */}
        <Link
          href="/"
          className={`site-brand justify-self-center text-center text-2xl font-light tracking-tight transition-colors md:text-3xl ${lightHeader ? "text-white" : "text-neutral-900"
            }`}
          style={{ fontFamily: SERIF }}
        >
          {data.businessName}
        </Link>

        {/* Right nav + CTA (desktop) */}
        <nav className="hidden md:flex items-center justify-start gap-7">
          {right.map((l) => (
            <NavItem key={l.id} link={l} className={linkClass} />
          ))}
          <button
            type="button"
            onClick={onReserve}
            className="site-primary-btn ml-2 inline-flex items-center rounded-full px-5 py-2 text-[11px] uppercase tracking-[0.28em] text-white shadow-sm transition-transform hover:scale-[1.02]"
            style={{ backgroundColor: "var(--site-primary)" }}
          >
            Reserve
          </button>
        </nav>

        {/* Spacer placeholder so the grid keeps 3 cols on mobile */}
        <div className="md:hidden" />
      </div>
    </header>
  );
}