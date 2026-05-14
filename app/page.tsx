import { Metadata } from "next";
import { HotelTemplate } from "@/components/template/HotelTemplate";
import { firstHeroImage } from "@/components/template/blocks/shared-logic";
import { demoHotelData as hotelData } from "@/lib/demo-hotel";

// SEO Metadata සැකසීම
const description = hotelData.aboutText?.slice(0, 155) || "";
const title = `${hotelData.businessName} — ${hotelData.heroTitle}`;
const ogImage = firstHeroImage(hotelData) ?? "";

export const metadata: Metadata = {
  title: title,
  description: description,
  openGraph: {
    title: title,
    description: description,
    images: [ogImage ? [{ url: ogImage }] : []],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: title,
    description: description,
    images: [ogImage],
  },
};

export default function Home() {
  // සර්වර් එකේ උයලා (Server Component) කෙලින්ම Template එකට දත්ත යවනවා
  return <HotelTemplate data={hotelData} />;
}