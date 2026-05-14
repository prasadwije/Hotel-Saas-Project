import { Metadata } from "next";
import { HotelTemplate } from "@/components/template/HotelTemplate";
import { firstHeroImage } from "@/components/template/blocks/shared-logic";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { data: hotel } = await supabase.from('hotels').select('site_config, business_name').limit(1).single();

  if (!hotel) return { title: 'Hotel Not Found' };
  
  const hotelData = hotel.site_config;
  const description = hotelData?.aboutText?.slice(0, 155) || "";
  const title = `${hotelData?.businessName || hotel.business_name} — ${hotelData?.heroTitle || 'Welcome'}`;
  const ogImage = firstHeroImage(hotelData) ?? "";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Home() {
  const supabase = await createClient();
  const { data: hotel, error } = await supabase.from('hotels').select('*, rooms(*)').limit(1).single();

  if (error || !hotel) {
    return <div>Hotel not found or database error: {error?.message}</div>;
  }

  // Merge database rooms back into site_config
  const hotelData = {
    ...hotel.site_config,
    rooms: hotel.rooms && hotel.rooms.length > 0 ? hotel.rooms.map((r: any) => ({
      name: r.name,
      price: r.price ? `€${r.price}` : '', // Formatting best effort
      description: r.description,
      image: r.image_url,
      features: r.features,
    })) : hotel.site_config?.rooms
  };

  return <HotelTemplate data={hotelData} />;
}