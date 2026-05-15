import { notFound } from 'next/navigation'
import { getHotelById, mergeRoomsIntoConfig } from '@/lib/get-hotel-data'
import { HotelTemplate } from '@/components/template/HotelTemplate'

type Props = { params: Promise<{ hotelId: string }> }

export default async function HotelHomePage({ params }: Props) {
  const { hotelId } = await params
  const hotel = await getHotelById(hotelId)
  if (!hotel) notFound()

  const hotelData = mergeRoomsIntoConfig(hotel)
  return <HotelTemplate data={hotelData} />
}
