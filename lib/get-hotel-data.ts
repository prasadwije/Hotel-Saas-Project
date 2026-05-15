import { createClient } from '@/lib/supabase/server'
import type { HotelData } from '@/components/template/blocks/shared'

export type HotelRow = {
  id: string
  business_name: string | null
  subdomain: string | null
  custom_domain: string | null
  is_admin_accessible: boolean
  status: string
  site_config: HotelData
  rooms: RoomRow[]
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
    .select('*, rooms(*)')
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
  const rooms =
    hotel.rooms && hotel.rooms.length > 0
      ? hotel.rooms.map((r) => ({
          name: r.name ?? '',
          price: r.price != null ? `€${r.price}` : '',
          description: r.description ?? '',
          image: r.image_url ?? '',
          features: r.features ?? [],
        }))
      : hotel.site_config?.rooms ?? []

  return {
    ...hotel.site_config,
    rooms,
  }
}
