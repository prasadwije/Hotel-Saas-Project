import type { Metadata } from 'next'

/**
 * All admin pages are noindex, nofollow.
 * This is a layout-level metadata object so every page in [hotelId]/admin/
 * inherits it automatically.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
