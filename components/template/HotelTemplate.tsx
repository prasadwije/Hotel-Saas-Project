"use client";
import { useEffect, useState, type CSSProperties, type ReactElement, type ReactNode } from "react";
import { Sparkles } from "lucide-react";

import {
  SERIF,
  type HotelData,
  type LayoutConfig,
  type LayoutPreference,
  type MenuItem,
  type Room,
  type Testimonial,
  type Faq,
  type Variant,
  type SectionKey,
  type SubPageKey,
  getHeaderLinks,
  isPageEnabled,
} from "./blocks/shared";

import { HeroV1, HeroV2, HeroV3, HeroV4, HeroV5, HeroV6, HeroV7, HeroV8, HeroV9, HeroV10 } from "./blocks/Hero";
import { AboutV1, AboutV2, AboutV3, AboutV4, AboutV5, AboutV6, AboutV7, AboutV8, AboutV9, AboutV10 } from "./blocks/About";
import { MenuV1, MenuV2, MenuV3, MenuV4, MenuV5, MenuV6, MenuV7, MenuV8, MenuV9, MenuV10 } from "./blocks/Menu";
import { GalleryV1, GalleryV2, GalleryV3, GalleryV4, GalleryV5, GalleryV6, GalleryV7, GalleryV8, GalleryV9, GalleryV10 } from "./blocks/Gallery";
import { RoomsV1, RoomsV2, RoomsV3, RoomsV4, RoomsV5, RoomsV6, RoomsV7, RoomsV8, RoomsV9, RoomsV10 } from "./blocks/Rooms";
import { AmenitiesV1, AmenitiesV2, AmenitiesV3, AmenitiesV4, AmenitiesV5, AmenitiesV6, AmenitiesV7, AmenitiesV8, AmenitiesV9, AmenitiesV10 } from "./blocks/Amenities";
import { TestimonialsV1, TestimonialsV2, TestimonialsV3, TestimonialsV4, TestimonialsV5, TestimonialsV6, TestimonialsV7, TestimonialsV8, TestimonialsV9, TestimonialsV10 } from "./blocks/Testimonials";
import { VideoHighlightV1, VideoHighlightV2 } from "./blocks/VideoHighlight";
import { LocationV1, LocationV2, LocationV3, LocationV4, LocationV5, LocationV6, LocationV7, LocationV8, LocationV9, LocationV10 } from "./blocks/Location";
import { FaqV1, FaqV2 } from "./blocks/Faq";
import { FooterV1, FooterV2 } from "./blocks/Footer";
import { StickyBarV1, StickyBarV2 } from "./blocks/StickyBar";
import { ExperiencesV1, ExperiencesV2 } from "./blocks/Experiences";
import { ContactV1, ContactV2 } from "./blocks/Contact";
import { TrustBadgesV1, TrustBadgesV2 } from "./blocks/TrustBadges";
import { HeaderV1, HeaderV2, HeaderV3, HeaderV4, type HeaderProps } from "./blocks/Header";
import { BookingProvider, useBooking } from "@/components/booking/BookingContext";
import { BookingModal } from "@/components/booking/BookingModal";
import { RoomDetailsProvider } from "@/components/rooms/RoomDetailsContext";
import { RoomDetailsModal } from "@/components/rooms/RoomDetailsModal";

// Re-export consumer types
export type {
  HotelData,
  LayoutConfig,
  LayoutPreference,
  MenuItem,
  Room,
  Testimonial,
  Faq,
  Variant,
  SectionKey,
};

type Props = { data: HotelData };

// ---- Render-engine dispatch tables --------------------------------------
const BLOCKS = {
  hero: { v1: HeroV1, v2: HeroV2, v3: HeroV3, v4: HeroV4, v5: HeroV5, v6: HeroV6, v7: HeroV7, v8: HeroV8, v9: HeroV9, v10: HeroV10 },
  about: { v1: AboutV1, v2: AboutV2, v3: AboutV3, v4: AboutV4, v5: AboutV5, v6: AboutV6, v7: AboutV7, v8: AboutV8, v9: AboutV9, v10: AboutV10 },
  menu: { v1: MenuV1, v2: MenuV2, v3: MenuV3, v4: MenuV4, v5: MenuV5, v6: MenuV6, v7: MenuV7, v8: MenuV8, v9: MenuV9, v10: MenuV10 },
  gallery: { v1: GalleryV1, v2: GalleryV2, v3: GalleryV3, v4: GalleryV4, v5: GalleryV5, v6: GalleryV6, v7: GalleryV7, v8: GalleryV8, v9: GalleryV9, v10: GalleryV10 },
  rooms: { v1: RoomsV1, v2: RoomsV2, v3: RoomsV3, v4: RoomsV4, v5: RoomsV5, v6: RoomsV6, v7: RoomsV7, v8: RoomsV8, v9: RoomsV9, v10: RoomsV10 },
  amenities: { v1: AmenitiesV1, v2: AmenitiesV2, v3: AmenitiesV3, v4: AmenitiesV4, v5: AmenitiesV5, v6: AmenitiesV6, v7: AmenitiesV7, v8: AmenitiesV8, v9: AmenitiesV9, v10: AmenitiesV10 },
  testimonials: { v1: TestimonialsV1, v2: TestimonialsV2, v3: TestimonialsV3, v4: TestimonialsV4, v5: TestimonialsV5, v6: TestimonialsV6, v7: TestimonialsV7, v8: TestimonialsV8, v9: TestimonialsV9, v10: TestimonialsV10 },
  videoHighlight: { v1: VideoHighlightV1, v2: VideoHighlightV2 },
  location: { v1: LocationV1, v2: LocationV2, v3: LocationV3, v4: LocationV4, v5: LocationV5, v6: LocationV6, v7: LocationV7, v8: LocationV8, v9: LocationV9, v10: LocationV10 },
  faq: { v1: FaqV1, v2: FaqV2 },
  footer: { v1: FooterV1, v2: FooterV2 },
  stickyBar: { v1: StickyBarV1, v2: StickyBarV2 },
  experiences: { v1: ExperiencesV1, v2: ExperiencesV2 },
  contact: { v1: ContactV1, v2: ContactV2 },
  trustBadges: { v1: TrustBadgesV1, v2: TrustBadgesV2 },
} as const;

const HEADERS: Record<NonNullable<LayoutConfig["header"]>, (p: HeaderProps) => ReactElement | null> = {
  v1: HeaderV1,
  v2: HeaderV2,
  v3: HeaderV3,
  v4: HeaderV4,
};

type BlockKey = keyof typeof BLOCKS;

function pick<K extends BlockKey>(key: K, cfg: LayoutConfig | undefined) {
  const table = BLOCKS[key] as unknown as Record<string, (props: { data: HotelData }) => ReactElement | null>;
  const requested = (cfg?.[key] ?? "v1") as string;
  return table[requested] ?? table.v1;
}

const DEFAULT_SECTION_ORDER: SectionKey[] = [
  "hero",
  "trustBadges",
  "about",
  "rooms",
  "amenities",
  "menu",
  "videoHighlight",
  "gallery",
  "experiences",
  "testimonials",
  "faq",
  "location",
  "contact",
];

// Sections that should be skipped if their backing data is missing.
function hasSectionData(key: SectionKey, data: HotelData): boolean {
  switch (key) {
    case "rooms":
      return !!data.rooms?.length;
    case "amenities":
      return !!data.amenities?.length;
    case "testimonials":
      return !!data.testimonials?.length;
    case "videoHighlight":
      return !!data.videoUrl;
    case "faq":
      return !!data.faqs?.length;
    case "menu":
      return !!data.menuItems?.length;
    case "gallery":
      return !!data.galleryImages?.length;
    case "location":
      return !!data.mapEmbedUrl;
    case "experiences":
      return !!data.experiences?.length;
    case "contact":
      return !!data.enableContactForm;
    case "trustBadges":
      return !!data.trustBadges?.length;
    case "hero":
    case "about":
      return true;
    default:
      return false;
  }
}

export function HotelTemplate({ data }: Props) {
  return (
    <BookingProvider>
      <RoomDetailsProvider>
        <HotelTemplateInner data={data} />
        <BookingModal data={data} />
        <RoomDetailsModal />
      </RoomDetailsProvider>
    </BookingProvider>
  );
}

function HotelTemplateInner({ data }: Props) {
  return (
    <TemplateShell data={data}>
      <HomePageBlocks data={data} />
    </TemplateShell>
  );
}

/**
 * Wraps any page (home or dedicated sub-page) with the shared header,
 * footer, sticky bar, custom CSS / head injection, and providers.
 */
export function HotelSubPage({ data, children }: { data: HotelData; children: ReactNode }) {
  return (
    <BookingProvider>
      <RoomDetailsProvider>
        <TemplateShell data={data} forceSolidHeader>
          {children}
        </TemplateShell>
        <BookingModal data={data} />
        <RoomDetailsModal />
      </RoomDetailsProvider>
    </BookingProvider>
  );
}

function TemplateShell({
  data,
  children,
  forceSolidHeader = false,
}: {
  data: HotelData;
  children: ReactNode;
  forceSolidHeader?: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  const { openBooking } = useBooking();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Client-side SEO reflection — full SSR metadata lands with the Next.js migration.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const seo = data.seo;
    if (seo?.metaTitle) document.title = seo.metaTitle;

    const setMeta = (name: string, content?: string, attr: "name" | "property" = "name") => {
      if (!content) return;
      let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    setMeta("description", seo?.metaDescription);
    setMeta("keywords", seo?.keywords);
    setMeta("og:title", seo?.metaTitle, "property");
    setMeta("og:description", seo?.metaDescription, "property");
    setMeta("og:image", seo?.ogImage, "property");
    setMeta("twitter:card", seo?.ogImage ? "summary_large_image" : undefined);
    setMeta("twitter:image", seo?.ogImage);

    if (seo?.favicon) {
      let link = document.head.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = seo.favicon;
    }
  }, [data.seo]);

  const cfg = data.layoutConfig;

  const Footer = pick("footer", cfg);
  const StickyBar = pick("stickyBar", cfg);

  const navLinks = getHeaderLinks(data);

  const rootStyle = {
    ["--site-primary" as string]: data.primaryColor,
  } as CSSProperties;

  const heroVariant = (cfg?.hero ?? "v1") as string;
  const headerVariant = (cfg?.header ?? "v1") as NonNullable<LayoutConfig["header"]>;
  const Header = HEADERS[headerVariant] ?? HeaderV1;
  const headerSticky = cfg?.headerSticky !== false;
  // v1 hero is the only one we treat as a full-bleed light backdrop for the
  // classic transparent header. Other heroes already render their own
  // contrast, so we let the header stay solid above them.
  const headerWantsLight = headerVariant === "v1" || headerVariant === "v3";
  const onLightHero = headerWantsLight && !forceSolidHeader && heroVariant === "v1" && !scrolled;

  return (
    <div
      style={rootStyle}
      className="site-root min-h-screen bg-white text-neutral-900 antialiased pb-20 md:pb-0"
    >
      <Header
        data={data}
        scrolled={scrolled}
        forceSolidHeader={forceSolidHeader || !onLightHero ? forceSolidHeader : false}
        navLinks={navLinks}
        onReserve={() => openBooking()}
        sticky={headerSticky}
      />

      {children}

      <Footer data={data} />
      <StickyBar data={data} />
      {data.customCSS && (
        <style data-hotel-custom-css="" dangerouslySetInnerHTML={{ __html: data.customCSS }} />
      )}
      <CustomHeadCode code={data.customHeadCode} />
    </div>
  );
}

/** The default home-page section stack. Skips a section's block if its dedicated sub-page is enabled (so it lives only on /key). */
function HomePageBlocks({ data }: { data: HotelData }) {
  const cfg = data.layoutConfig;
  const order = data.sectionOrder ?? DEFAULT_SECTION_ORDER;
  return (
    <>
      {order.map((key) => {
        if (!hasSectionData(key, data)) return null;
        const Block = pick(key, cfg);
        const slotBg = data.sectionBackgrounds?.[key]?.trim();
        const isImageUrl = !!slotBg && /^(https?:|\/|data:)/i.test(slotBg);
        const bgValue = isImageUrl ? `url("${slotBg}") center / cover no-repeat` : slotBg;
        return (
          <div
            key={key}
            id={`section-${key}`}
            className={`site-section-slot site-slot-${key} hotel-section hotel-section-${key}`}
            data-bg={slotBg ? "" : undefined}
            style={slotBg ? ({ ["--slot-bg" as string]: bgValue, background: bgValue } as CSSProperties) : undefined}
          >
            <Block data={data} />
            {key === "hero" && data.specialOffer && (
              <section className="site-offer-banner relative -mt-px border-y border-black/5 bg-neutral-950 text-white">
                <div
                  className="absolute inset-0 opacity-90"
                  style={{
                    background:
                      "linear-gradient(90deg, color-mix(in oklab, var(--site-primary) 85%, black) 0%, color-mix(in oklab, var(--site-primary) 55%, black) 100%)",
                  }}
                />
                <div className="relative mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-5 text-center md:flex-row md:text-left">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    <p
                      className="site-offer-text text-lg font-light tracking-wide md:text-xl"
                      style={{ fontFamily: SERIF }}
                    >
                      {data.specialOffer}
                    </p>
                  </div>
                  <a
                    href="#rooms"
                    className="inline-flex items-center justify-center rounded-full bg-white/95 px-6 py-2.5 text-xs font-medium uppercase tracking-[0.25em] text-neutral-900 transition-transform hover:scale-[1.02]"
                  >
                    Claim Offer
                  </a>
                </div>
              </section>
            )}
          </div>
        );
      })}
    </>
  );
}

/** Render an arbitrary list of section keys (used by dedicated sub-pages). */
export function SectionStack({ data, sections }: { data: HotelData; sections: SectionKey[] }) {
  const cfg = data.layoutConfig;
  return (
    <>
      {sections.map((key) => {
        if (!hasSectionData(key, data)) return null;
        const Block = pick(key, cfg);
        const slotBg = data.sectionBackgrounds?.[key]?.trim();
        const isImageUrl = !!slotBg && /^(https?:|\/|data:)/i.test(slotBg);
        const bgValue = isImageUrl ? `url("${slotBg}") center / cover no-repeat` : slotBg;
        return (
          <div
            key={key}
            id={`section-${key}`}
            className={`site-section-slot site-slot-${key} hotel-section hotel-section-${key}`}
            style={slotBg ? ({ ["--slot-bg" as string]: bgValue, background: bgValue } as CSSProperties) : undefined}
          >
            <Block data={data} />
          </div>
        );
      })}
    </>
  );
}

// Re-export for convenience
export { isPageEnabled };
export type { SubPageKey };

/**
 * Safely injects arbitrary HTML (script/meta/link tags) into <document.head>.
 * Uses a <template> to parse the markup, then appends each child node to the
 * head. All injected nodes are tracked and removed on unmount / change so
 * preview updates do not leak duplicates.
 */
function CustomHeadCode({ code }: { code?: string }) {
  useEffect(() => {
    if (!code || typeof document === "undefined") return;
    const template = document.createElement("template");
    template.innerHTML = code;
    const injected: Node[] = [];
    template.content.childNodes.forEach((node) => {
      // Re-create <script> nodes so the browser actually executes them.
      if (node.nodeName === "SCRIPT") {
        const src = node as HTMLScriptElement;
        const s = document.createElement("script");
        for (const attr of Array.from(src.attributes)) s.setAttribute(attr.name, attr.value);
        s.text = src.text;
        s.setAttribute("data-hotel-custom-head", "");
        document.head.appendChild(s);
        injected.push(s);
      } else {
        const clone = node.cloneNode(true) as Element;
        if (clone.nodeType === 1) clone.setAttribute("data-hotel-custom-head", "");
        document.head.appendChild(clone);
        injected.push(clone);
      }
    });
    return () => {
      injected.forEach((n) => n.parentNode?.removeChild(n));
    };
  }, [code]);
  return null;
}

export default HotelTemplate;
