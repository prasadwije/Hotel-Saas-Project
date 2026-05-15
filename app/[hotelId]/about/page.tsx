import { notFound } from 'next/navigation'
import { getHotelById, mergeRoomsIntoConfig } from '@/lib/get-hotel-data'
import { HotelSubPage, SectionStack } from '@/components/template/HotelTemplate'
import { DedicatedPageProvider } from '@/components/template/blocks/shared'
import type { SectionKey } from '@/components/template/blocks/shared'

type Props = { params: Promise<{ hotelId: string }> }

export default async function AboutPage({ params }: Props) {
  const { hotelId } = await params
  const hotel = await getHotelById(hotelId)
  if (!hotel) notFound()

  const hotelData = mergeRoomsIntoConfig(hotel)
  const PAGE_KEY = 'about' as const
  const extras = (hotelData.pagesConfig?.[PAGE_KEY]?.extraSections ?? []) as SectionKey[]
  const sections: SectionKey[] = [PAGE_KEY as SectionKey, ...extras]

  return (
    <HotelSubPage data={hotelData}>
      <div className="pt-16">
        <DedicatedPageProvider value={PAGE_KEY}>
          <SectionStack data={hotelData} sections={sections} />
        </DedicatedPageProvider>
      </div>
    </HotelSubPage>
  )
}
