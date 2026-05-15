import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getHotelById } from '@/lib/get-hotel-data'
import { firstHeroImage } from '@/components/template/blocks/shared-logic'

type Props = {
  params: Promise<{ hotelId: string }>
  children: React.ReactNode
}

/**
 * Per-tenant layout.
 * Generates canonical metadata pointing to the hotel's primary domain
 * (custom_domain preferred over subdomain.yoursaas.com).
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { hotelId } = await params
  const hotel = await getHotelById(hotelId)
  if (!hotel) return { title: 'Hotel Not Found' }

  const cfg = hotel.site_config
  const title = `${cfg?.businessName || hotel.business_name} — ${cfg?.heroTitle || 'Welcome'}`
  const description = cfg?.aboutText?.slice(0, 155) ?? ''
  const ogImage = firstHeroImage(cfg) ?? ''

  // Prefer custom_domain for canonical; fall back to subdomain SaaS URL
  const primaryDomain = hotel.custom_domain
    ?? (hotel.subdomain
      ? `${hotel.subdomain}.${process.env.NEXT_PUBLIC_SAAS_DOMAIN ?? 'hotelsaas.com'}`
      : null)
  const canonical = primaryDomain ? `https://${primaryDomain}` : undefined

  return {
    title,
    description,
    ...(canonical && {
      alternates: { canonical },
      metadataBase: new URL(canonical),
    }),
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : [],
      type: 'website',
      ...(canonical && { url: canonical }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  }
}

/**
 * This layout is intentionally minimal — it just validates the hotel
 * exists and renders children. The root app/layout.tsx handles <html>/<body>.
 */
export default async function HotelLayout({ params, children }: Props) {
  const { hotelId } = await params
  const hotel = await getHotelById(hotelId)
  if (!hotel) notFound()

  return <>{children}</>
}
