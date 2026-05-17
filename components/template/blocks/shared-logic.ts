import type { CSSProperties } from "react";
import {
    Sparkles, Wifi, Waves, Flower2, Car, UtensilsCrossed,
    Dumbbell, Coffee, ParkingCircle, AirVent, PawPrint,
    Bath, Tv, Wine
} from "lucide-react";

// --- Types ---
export type MenuItem = { name: string; price: string; description?: string; image?: string };
export type Room = {
    name: string; price: string; description: string; image: string;
    features: string[]; gallery?: string[]; amenities?: string[];
};
export type Testimonial = { author: string; text: string; rating: number };
export type Faq = { question: string; answer: string };
export type Experience = { title: string; distance: string; description: string; image: string; };
export type LayoutPreference = "stack" | "carousel";
export type Variant = "v1" | "v2";
export type ExtendedVariant = Variant | "v3" | "v4" | "v5" | "v6" | "v7" | "v8" | "v9" | "v10";
export type HeroTransition = "slide" | "fade";

export type SectionKey = "hero" | "about" | "rooms" | "amenities" | "menu" | "videoHighlight" | "gallery" | "testimonials" | "faq" | "location" | "experiences" | "contact" | "trustBadges";

export type LayoutConfig = {
    hero?: ExtendedVariant; about?: ExtendedVariant; menu?: ExtendedVariant;
    gallery?: ExtendedVariant; location?: ExtendedVariant; faq?: Variant;
    footer?: Variant; stickyBar?: Variant; testimonials?: ExtendedVariant;
    videoHighlight?: Variant; amenities?: ExtendedVariant; rooms?: ExtendedVariant;
    experiences?: Variant; contact?: Variant; trustBadges?: Variant;
    header?: "v1" | "v2" | "v3" | "v4"; headerSticky?: boolean;
};

export type NavLink = { id: string; label: string; href: string; type: "hash" | "path"; };
export type SiteLayoutMode = "single-page" | "multi-page";
export type SubPageKey = "about" | "rooms" | "amenities" | "menu" | "gallery" | "location";
export const SUB_PAGE_KEYS: SubPageKey[] = ["about", "rooms", "amenities", "menu", "gallery", "location"];

export type PageConfig = { enabled: boolean; extraSections?: SectionKey[]; };
export type PagesConfig = Partial<Record<SubPageKey, PageConfig>>;
export type SiteNavigation = { headerLinks: NavLink[]; footerLinks: NavLink[]; };

export type HotelData = {
    isBookingEngineEnabled?: boolean;
    businessName: string; primaryColor: string; heroTitle: string; heroSubtitle?: string;
    heroImages: HeroImageInput[]; heroTransition?: HeroTransition; aboutText: string;
    menuItems?: MenuItem[]; galleryImages?: string[]; address?: string;
    mapEmbedUrl?: string; phone?: string; whatsapp?: string;
    socialLinks?: { facebook?: string; instagram?: string; };
    specialOffer?: string; rooms?: Room[]; amenities?: string[];
    testimonials?: Testimonial[]; videoUrl?: string; faqs?: Faq[];
    experiences?: Experience[]; enableContactForm?: boolean; contactEmail?: string;
    trustBadges?: string[]; sectionBackgrounds?: Partial<Record<SectionKey, string>>;
    mobileLayouts?: { rooms?: LayoutPreference; menu?: LayoutPreference; testimonials?: LayoutPreference; };
    layoutConfig?: LayoutConfig; sectionOrder?: SectionKey[]; customCSS?: string;
    customHeadCode?: string; seo?: { metaTitle?: string; metaDescription?: string; favicon?: string; ogImage?: string; keywords?: string; };
    siteLayout?: SiteLayoutMode; navigation?: SiteNavigation; pagesConfig?: PagesConfig;
    aboutShortSummary?: string; aboutFullStory?: string; contactDetailedInfo?: string;
};

// --- Constants ---
export const SERIF = '"Cormorant Garamond", "Playfair Display", Georgia, serif';
export const DEFAULT_HERO_DARKNESS = 35;

// --- Helper Functions ---
export const primaryStyle = (extra?: CSSProperties): CSSProperties => ({
    color: "var(--site-primary)",
    ...extra,
});

export const telHrefOf = (phone?: string) => phone ? `tel:${phone.replace(/\s+/g, "")}` : "#";
export const waHrefOf = (whatsapp?: string) => whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, "")}` : "#";

export const bookRoomWaHref = (whatsapp?: string, roomName?: string) => {
    if (!whatsapp) return "#";
    const num = whatsapp.replace(/\D/g, "");
    const text = roomName
        ? `Hello, I'd like to book the "${roomName}". Could you share availability and rates?`
        : `Hello, I'd like to make a reservation.`;
    return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
};

export type HeroImage = { url: string; darkness: number };
export type HeroImageInput = string | { url: string; darkness?: number };

export function normalizeHeroImage(input: HeroImageInput): HeroImage {
    if (typeof input === "string") return { url: input, darkness: DEFAULT_HERO_DARKNESS };
    return {
        url: input.url,
        darkness: typeof input.darkness === "number" ? Math.max(0, Math.min(100, input.darkness)) : DEFAULT_HERO_DARKNESS,
    };
}

export function normalizeHeroImages(items?: HeroImageInput[]): HeroImage[] {
    return (items ?? []).map(normalizeHeroImage).filter((i) => Boolean(i.url));
}

// *** මෙන්න සර්වර් එකට ඕන කෑල්ල ***
export const firstHeroImage = (data: HotelData): string | undefined =>
    normalizeHeroImages(data.heroImages)[0]?.url;

export function getDefaultNavigation(data: HotelData): SiteNavigation {
    const isMulti = data.siteLayout === "multi-page";
    const enabled = (key: SubPageKey) => isMulti && !!data.pagesConfig?.[key]?.enabled;
    const linkFor = (key: SubPageKey, label: string): NavLink =>
        enabled(key) ? { id: key, label, href: `/${key}`, type: "path" } : { id: key, label, href: `#${key}`, type: "hash" };

    const headerLinks: NavLink[] = [];
    if (data.aboutText) headerLinks.push(linkFor("about", "About"));
    if (data.rooms?.length) headerLinks.push(linkFor("rooms", "Rooms"));
    if (data.menuItems?.length) headerLinks.push(linkFor("menu", "Menu"));
    if (data.galleryImages?.length) headerLinks.push(linkFor("gallery", "Gallery"));
    if (data.faqs?.length) headerLinks.push({ id: "faq", label: "FAQ", href: "#faq", type: "hash" });
    if (data.mapEmbedUrl) headerLinks.push(linkFor("location", "Visit"));

    return { headerLinks, footerLinks: [...headerLinks] };
}

export function getHeaderLinks(data: HotelData): NavLink[] {
    return data.navigation?.headerLinks?.length ? data.navigation.headerLinks : getDefaultNavigation(data).headerLinks;
}

export function getFooterLinks(data: HotelData): NavLink[] {
    return data.navigation?.footerLinks?.length ? data.navigation.footerLinks : getDefaultNavigation(data).footerLinks;
}

export function isPageEnabled(data: HotelData, key: SubPageKey): boolean {
    return data.siteLayout === "multi-page" && !!data.pagesConfig?.[key]?.enabled;
}

const AMENITY_ICONS: Record<string, any> = {
    wifi: Wifi, "free wi-fi": Wifi, "free wifi": Wifi, pool: Waves, "swimming pool": Waves,
    spa: Flower2, parking: ParkingCircle, "free parking": ParkingCircle, valet: Car,
    restaurant: UtensilsCrossed, gym: Dumbbell, fitness: Dumbbell, breakfast: Coffee,
    cafe: Coffee, ac: AirVent, "air conditioning": AirVent, "pet friendly": PawPrint,
    pets: PawPrint, bathtub: Bath, tv: Tv, bar: Wine,
};

export function amenityIcon(label: string) {
    const key = label.toLowerCase().trim();
    return AMENITY_ICONS[key] ?? Sparkles;
}

export type BlockProps = { data: HotelData };

/** Resolve the best href to use for a "Read more / View all" CTA targeting `key`. */
export function getReadMoreHref(data: HotelData, key: SubPageKey): string {
    if (isPageEnabled(data, key)) return `/${key}`;
    return `#${key}`;
}

/** Convenience: should a section render its truncated/preview state? */
export function shouldTruncate(data: HotelData, key: SubPageKey): boolean {
    return isPageEnabled(data, key);
}

export function newNavLinkId(): string {
    return `nav_${Math.random().toString(36).slice(2, 9)}`;
}

/** Truncate for Read-More only when in multi-page mode AND we are NOT currently rendering the dedicated page. */
export function shouldRenderTruncated(data: HotelData, key: SubPageKey): boolean {
    if (!isPageEnabled(data, key)) return false;
    return true;
}