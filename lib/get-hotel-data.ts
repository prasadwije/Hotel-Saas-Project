import { createClient } from '@/lib/supabase/server'
import type { HotelData } from '@/components/template/blocks/shared'

export type HotelRow = {
  id: string
  business_name: string | null
  subdomain: string | null
  custom_domain: string | null
  is_admin_accessible: boolean
  is_booking_engine_enabled: boolean
  status: string
  site_config: HotelData
  hotel_rooms: RoomRow[]
}

export type RoomRow = {
  id: string
  name: string | null
  price: number | null
  description: string | null
  image_url: string | null
  features: string[] | null
}

/**
 * Fetch a hotel (with rooms) by its UUID.
 * Returns null if not found or on DB error.
 */
export async function getHotelById(hotelId: string): Promise<HotelRow | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('hotels')
    .select('*, hotel_rooms(*)')
    .eq('id', hotelId)
    .single()

  if (error || !data) return null
  return data as unknown as HotelRow
}

/**
 * Merge DB rooms back into site_config so the template
 * always has fresh room data from the database.
 */
export function mergeRoomsIntoConfig(hotel: HotelRow): HotelData {
  let rooms = hotel.site_config?.rooms ?? [];
  
  if (hotel.is_booking_engine_enabled) {
    rooms = hotel.hotel_rooms && hotel.hotel_rooms.length > 0
      ? hotel.hotel_rooms.map((r) => ({
          name: r.name ?? '',
          price: r.price != null ? `€${r.price}` : '',
          description: r.description ?? '',
          image: r.image_url ?? '',
          features: r.features ?? [],
        }))
      : [];
  }

  return {
    ...hotel.site_config,
    rooms,
    isBookingEngineEnabled: hotel.is_booking_engine_enabled,
  }
}
