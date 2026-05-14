import { ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  type HotelData,
  type SubPageKey,
  isPageEnabled,
  getReadMoreHref,
  useIsDedicatedPage,
} from "@/components/template/blocks/shared";

type Props = {
  data: HotelData;
  sectionKey: SubPageKey;
  label?: string;
  className?: string;
};

/**
 * Renders a "View all →" CTA that points at the dedicated sub-page when the
 * site is in multi-page mode AND the page for `sectionKey` is enabled.
 * Returns null otherwise so single-page sites stay untouched.
 */
export function ReadMoreCTA({ data, sectionKey, label, className }: Props) {
  const onDedicated = useIsDedicatedPage(sectionKey);
  if (!isPageEnabled(data, sectionKey) || onDedicated) return null;
  const href = getReadMoreHref(data, sectionKey);
  const text = label ?? `View all ${sectionKey}`;
  const cls =
    "site-read-more inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-2.5 text-xs font-medium uppercase tracking-[0.25em] text-neutral-900 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md " +
    (className ?? "");

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={cls}>
        {text}
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    );
  }
  return (
    <a href={href} className={cls}>
      {text}
      <ArrowRight className="h-3.5 w-3.5" />
    </a>
  );
}