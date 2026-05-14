import { HotelSubPage, SectionStack } from "@/components/template/HotelTemplate";
import { DedicatedPageProvider } from "@/components/template/blocks/shared";
import { demoHotelData as hotelData } from "@/lib/demo-hotel";
import type { SectionKey } from "@/components/template/blocks/shared";

const PAGE_KEY = "amenities" as const;

export const metadata = {
    title: `Amenities — ${hotelData.businessName}`,
    description: hotelData.aboutText.slice(0, 155),
};

export default function AmenitiesPage() {
    const extras = (hotelData.pagesConfig?.[PAGE_KEY]?.extraSections ?? []) as SectionKey[];
    const sections: SectionKey[] = [PAGE_KEY as SectionKey, ...extras];
    return (
        <HotelSubPage data={hotelData}>
            <div className="pt-16">
                <DedicatedPageProvider value={PAGE_KEY}><SectionStack data={hotelData} sections={sections} /></DedicatedPageProvider>
            </div>
        </HotelSubPage>
    );
}
