"use client";
import Link from "next/link";
import type { HotelData, NavLink } from "@/components/template/blocks/shared";

export type HeaderProps = {
  data: HotelData;
  scrolled: boolean;
  forceSolidHeader: boolean;
  navLinks: NavLink[];
  onReserve: () => void;
  /** When true (default) the header is fixed to the viewport. When false, it sits at the top of the page and scrolls away. */
  sticky?: boolean;
};

/** Position classes shared by every header variant. */
export function headerPositionClass(sticky: boolean | undefined) {
  return `${sticky === false ? "absolute" : "fixed"} inset-x-0 top-0 z-40`;
}

export function NavItem({
  link,
  className,
}: {
  link: NavLink;
  className?: string;
}) {
  if (link.type === "path") {
    return (
      <Link href={link.href} className={className}>
        {link.label}
      </Link>
    );
  }
  return (
    <a href={link.href} className={className}>
      {link.label}
    </a>
  );
}